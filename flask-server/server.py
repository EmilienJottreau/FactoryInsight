from flask import Flask, redirect, render_template, url_for
from flask_socketio import SocketIO, emit
from database import Database
from opc_tags import OPC_Tag
from typing import Any
import random as rd


app = Flask(__name__)
socketio = SocketIO(app, logger=True, engineio_logger=False)


def emit_to_sockets(function_name: str, table: str, tags, *args):
    if function_name == "insert":
        data = {"table": table, "tags": tags[0].json}
    elif function_name == "delete":
        data = {"table": table, "id": tags}
    elif function_name == "update":
        data = {"table": table, "tag_name": tags, "value": args[0]}
    emit(function_name, data, broadcast=True)


tables_list = ["level", "liquid_temperature", "heating_temperature", "input_flow", "output_flow", "agitator_speed", "states"]
database = Database("Tank", recreate_db=True, logger=True)
Database.callback_function = emit_to_sockets
print(Database.callback_function)
for table in tables_list:
    database.create_table(table)
    database.insert(table, [OPC_Tag(f"{table}0", rd.random())])
database.insert(
    "states",
    [
        OPC_Tag("agitator_state", False),
        OPC_Tag("emptying_state", False),
        OPC_Tag("filling_state", False),
        OPC_Tag("input_state", False),
        OPC_Tag("maintenance", False),
        OPC_Tag("manual_mode", False),
        OPC_Tag("output_state", False),
    ],
)


@app.route("/")
def index():
    tags = {}
    for table in tables_list:
        tags[table] = database.select(table)
    return render_template("index.html", data=tags)


@app.route("/reset")
def reset():
    for table in tables_list:
        database.drop_table(table)
        database.create_table(table)
        database.insert(table, [OPC_Tag(f"{table}0", rd.random())])
    return redirect(url_for("index"))


@socketio.on("append")
def handle_append(table: str):
    database.insert(table, [OPC_Tag(table, rd.random())])


@socketio.on("update")
def handle_update(table: str, tag_name: str, value: Any):
    database.update(table, tag_name, value)


@socketio.on("delete")
def handle_delete(table: str, id: str):
    database.delete(table, int(id))


if __name__ == "__main__":
    socketio.run(app)
