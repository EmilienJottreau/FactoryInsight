from flask import Flask, redirect, render_template, url_for
from flask_socketio import SocketIO, emit
from asyncua import Client, Node, ua
from database import Database
from opc_tags import OPC_Tag
import constant as constant
from typing import Any
import random as rd
import asyncio


app = Flask(__name__)
socketio = SocketIO(app, logger=False, engineio_logger=False)


database = Database("FactoryInsignt", recreate_db=True, logger=False)

station = "tank"
tables_list = constant.tables_list


def initial_fill_db():
    for table in tables_list:
        database.create_table(station, table)
        database.insert(station, table, [OPC_Tag(table, rd.random())])

    database.insert(station, "states", constant.state_tags)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/reset")
def reset():
    for table in tables_list:
        database.drop_table(station, table)
        database.create_table(station, table)
    return redirect(url_for("index"))


@socketio.on("get_data")
def handle_get_data():
    for table in tables_list:
        emit("setup", {"table": f"{table}", "tags": database.select(station, table)})


@socketio.on("append")
def handle_append(station: str, table: str):
    new_tag = OPC_Tag(table, rd.random())
    database.insert(station, table, [new_tag])
    emit("append", {"station": station, "table": table, "tags": [new_tag.json]}, broadcast=True)


@socketio.on("delete")
def handle_delete(station: str, tag: str, id: int):
    database.delete(station, tag, id)
    # emit("delete", {"station": station, "table": tag, "id": id}, broadcast=True)


@socketio.on("update")
def handle_update(station: str, table: str, tag_name: str, value: Any):
    database.update(station, table, tag_name, value)
    # emit("update", {"station": station, "table": table, "tag_name": tag_name, "value": value}, broadcast=True)


if __name__ == "__main__":
    initial_fill_db()
    socketio.run(app)
