from flask import Flask, redirect, render_template, url_for
from asyncio import new_event_loop, set_event_loop, sleep
from flask_socketio import SocketIO, emit
from asyncua import Client
from database import Database
from typing import Any
from opcua import *


server_url = "opc.tcp://127.0.0.1:49320"
tags = {}

app = Flask(__name__)
socketio = SocketIO(app, logger=False, engineio_logger=False)

database = Database("FactoryInsignt", recreate_db=False, logger=False)


@app.route("/")
def index():
    data = {}
    for station in tags:
        for tag in tags[station]:
            data[station + "_" + tag] = database.select(station, tag, 10)
    print(data)
    return render_template("index.html", data=data)


@app.get("/reset")
def reset():
    database.reset()
    return redirect(url_for("index"))


@app.get("/api/v1/history/<string:station>/<string:tag>/<int:limit>")
def get_history(station: str, tag: str, limit: int = 10):
    return database.select(station, tag, limit)


@app.get("/api/v1/update/<string:station>/<string:tag>/<value>")
async def get_update(station: str, tag: str, value: Any):
    await tags[station][tag].change_value(value)


class SubHandler(object):
    def __init__(self, database: Database, socket: SocketIO) -> None:
        self.database = database
        self.socket = socket

    async def datachange_notification(self, node: Node, value: Any, data) -> None:
        tag_name = (await node.read_browse_name()).Name
        timestamp = (await node.read_attribute(13)).SourceTimestamp

        tag = {"name": tag_name, "value": value, "timestamp": timestamp}

        self.database.insert("tank", tag_name, tag)
        self.socket.emit("datachange", {"station": "tank"}.update(tag))


async def main(server_socket: SocketIO) -> None:
    async with Client(url=server_url) as client:
        namespace_index = await client.get_namespace_index("KEPServerEX")
        global tags
        handler = SubHandler(database, server_socket)
        subscription = await client.create_subscription(500, handler)

        main_node = await client.nodes.root.get_child(f"0:Objects/{namespace_index}:FactoryInsight")

        tags = await browse_nodes(main_node, subscription, database)
        print(tags)

        while True:
            await sleep(1)


def run_async_loop(server_socket: SocketIO) -> None:
    loop = new_event_loop()
    set_event_loop(loop)

    loop.run_until_complete(main(server_socket))


if __name__ == "__main__":
    socketio.start_background_task(run_async_loop, socketio)
    socketio.run(app)
