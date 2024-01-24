from flask import Flask, redirect, render_template, url_for
from asyncio import new_event_loop, set_event_loop, sleep
from flask_socketio import SocketIO, emit
from asyncua import Client, Node, ua
from typing import Any, Callable
from database import Database
from opc_tags import OPC_Tag
from threading import Thread
import constant as constant


app = Flask(__name__)
socketio = SocketIO(app, logger=False, engineio_logger=False)

server_url = "opc.tcp://127.0.0.1:49320"

database = Database("FactoryInsignt", recreate_db=True, logger=False)

station = "tank"
tables_list = constant.tables_list
tags = constant.tags


def init_db(recreate_tables=False):
    for table in tables_list:
        if recreate_tables:
            database.drop_table(station, table)
        database.create_table(station, table)
        # database.insert(station, table, OPC_Tag(table, 0))

    #database.insert(station, "states", constant.state_tags)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/reset")
def reset():
    init_db(True)
    return redirect(url_for("index"))


@socketio.on("get_data")
def handle_get_data():
    for table in tables_list:
        emit("setup", {"table": f"{table}", "tags": database.select(station, table)})


@socketio.on("append")
def handle_append(station: str, table: str):
    new_tag = OPC_Tag(table, 0)
    database.insert(station, table, new_tag)
    emit("append", {"station": station, "table": table, "tags": [new_tag.json]}, broadcast=True)


@socketio.on("delete")
def handle_delete(station: str, tag: str, id: int):
    database.delete(station, tag, id)
    # emit("delete", {"station": station, "table": tag, "id": id}, broadcast=True)


@socketio.on("update")
def handle_update(station: str, table: str, tag_name: str, value: Any):
    database.update(station, table, tag_name, value)
    # emit("update", {"station": station, "table": table, "tag_name": tag_name, "value": value}, broadcast=True)


class SubHandler(object):
    async def datachange_notification(self, node: Node, value: Any, data):
        tag_name = (await node.read_browse_name()).Name

        match await node.read_data_type_as_variant_type():
            case ua.VariantType.Float:
                tag = OPC_Tag(tag_name, value)
                database.insert(station, tag_name, tag)
                # emit("append", {"station": station, "table": tag_name, "tags": [tag.json]}, broadcast=True)

            case ua.VariantType.Boolean:
                database.insert(station, "states", OPC_Tag(tag_name, value))


async def main():
    async with Client(url=server_url) as client:
        namespace_index = await client.get_namespace_index("KEPServerEX")

        handler = SubHandler()

        for tag in tags:
            tags[tag] = await client.nodes.root.get_child(["0:Objects", f"{namespace_index}:FactoryInsight", f"{namespace_index}:Tank", f"{namespace_index}:{tag}"])
            subscription = await client.create_subscription(500, handler)
            await subscription.subscribe_data_change(tags[tag])

        while True:
            await sleep(0.5)


def run_async_loop():
    loop = new_event_loop()
    set_event_loop(loop)

    loop.run_until_complete(main())


if __name__ == "__main__":
    init_db()

    opc_client = Thread(target=run_async_loop)
    opc_client.start()

    socketio.run(app)

    opc_client.join()
