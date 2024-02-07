from opcua import browse_nodes, init_database, OPC_Dict, OPC_Tag, subscribe_tag
from flask import Flask, redirect, render_template, url_for
from asyncio import new_event_loop, set_event_loop, sleep
from flask_socketio import SocketIO, emit
from asyncua import Client, Node
from database import Database
from typing import Any


from flask_cors import CORS
import json 


server_url = "opc.tcp://127.0.0.1:49320"
tags = {}

app = Flask(__name__)
CORS(app,resources={r"/*":{"origins":"*"}})


@app.route("/")
def index():
    data = {}
    for station in tags:
        for tag in tags[station]:
            data[station + "_" + tag] = database.select(station, tag, 10)
    return render_template("index.html", data=data)


@app.get("/api/v1/history/<string:station>/<string:tag>/<int:limit>")
def get_history(station: str, tag: str, limit: int = 10):
    return database.select(station, tag, limit)

#@app.get("/setup")
#def setup():
#    async with Client(url=server_url) as client:
#        global tags
#        for tag in tags[station]:
#            pass
            #ici faire un read async en passant le callback subhandler


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

        # station, tag = tag_name.split("_")
        # print(await node.read_attribute(13))
        # print(tags[station][tag])

        tag = {"name": tag_name, "value": value, "timestamp": timestamp}
        json_to_send = {
            "station": "tank",
            "tag":tag
        }

        self.database.insert("tank", tag_name, tag)
        json_data = json.dumps(json_to_send, indent=4, sort_keys=True, default=str) 
        self.socket.emit("datachange", json_data)
        print("envoie nouvelles données")



async def main(server_socket: SocketIO) -> None:
    async with Client(url=server_url) as client:
        namespace_index = await client.get_namespace_index("KEPServerEX")
        global tags

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
