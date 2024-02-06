from opcua import browse_nodes, init_database, OPC_Dict, OPC_Tag, subscribe_tag
from flask import Flask, redirect, render_template, url_for
from asyncio import new_event_loop, set_event_loop, sleep
from flask_socketio import SocketIO, emit
from asyncua import Client, Node
from database import Database
from typing import Any
import asyncio


server_url = "opc.tcp://127.0.0.1:49320"
tags = {}

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.get("/api/v1/setup")
def get_setup():
    table_data = {}
    for station in tags:
        for tag in tags[station]:
            table_data[station + "_" + tag] = database.select(station, tag, 10)
    return table_data


# /api/v1/history/tank/liquid_level/10
@app.get("/api/v1/history/<string:station>/<string:tag>/<int:limit>")
def get_history(station: str, tag: str, limit: int = 10):
    return database.select(station, tag, limit)


# /api/v1/update/Tank/agitator_speed/2.2
@app.get("/api/v1/update/<string:station>/<string:tag>/<value>")
def get_update(station: str, tag: str, value: Any):
    print(station, tag, value, tags[station][tag])
    socketio.start_background_task(tags[station][tag].change_value, 2.2)


class SubHandler(object):
    def __init__(self, database: Database, socket: SocketIO) -> None:
        self.database = database
        self.socket = socket

    async def datachange_notification(self, node: Node, value: Any, _) -> None:
        _, station, tag_name = (await node.read_attribute(1)).Value.Value.Identifier.split(".")
        timestamp = (await node.read_attribute(13)).SourceTimestamp

        tag = {"station": station, "tag": tag_name, "value": value, "timestamp": str(timestamp)}

        self.database.insert(station, tag_name, tag)
        self.socket.emit("datachange", tag)


async def main(server_socket: SocketIO) -> None:
    async with Client(url=server_url) as client:
        global tags

        namespace_index = await client.get_namespace_index("KEPServerEX")

        main_node = await client.nodes.root.get_child(f"0:Objects/{namespace_index}:FactoryInsight")
        tags = await browse_nodes(main_node)

        handler = SubHandler(database, server_socket)
        subscription = await client.create_subscription(500, handler)
        await subscribe_tag(tags, subscription)

        init_database(tags, database)

        while True:
            await sleep(1)


def run_async_loop(server_socket: SocketIO) -> None:
    loop = new_event_loop()
    set_event_loop(loop)

    loop.run_until_complete(main(server_socket))


if __name__ == "__main__":
    database = Database("FactoryInsignt", recreate_db=False, logger=False)

    socketio = SocketIO(app, logger=False, engineio_logger=False, cors_allowed_origins="*")

    socketio.start_background_task(run_async_loop, socketio)
    socketio.run(app)
