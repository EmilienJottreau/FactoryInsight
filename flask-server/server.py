from flask import Flask, redirect, render_template, url_for, request, jsonify
from flask_socketio import SocketIO, emit
from database import Database
from opc_tags import OPC_Tag
from typing import Any
import random as rd
from flask_cors import CORS


app = Flask(__name__)
CORS(app,resources={r"/*":{"origins":"*"}})
socketio = SocketIO(app, logger=True, engineio_logger=False, cors_allowed_origins="*")
database = Database("FactoryInsignt", recreate_db=True, logger=False)


station = "tank"
variables_list = ["level", "liquid_temperature", "heating_temperature", "input_flow", "output_flow", "agitator_speed", "states"]

for variable in variables_list:
    database.create_table(station, variable)
    database.insert(station, variable, [OPC_Tag(variable, rd.random())])

database.insert(
    station,
    "states",
    [
        OPC_Tag("agitator_state", False),
        OPC_Tag("cleaning_state", False),
        OPC_Tag("heating_state", False),
        OPC_Tag("input_state", False),
        OPC_Tag("maintenance", False),
        OPC_Tag("operating_state", False),
        OPC_Tag("manual_mode", False),
        OPC_Tag("output_state", False),
    ],
)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/reset")
def reset():
    for variable in variables_list:
        database.drop_variable(station, variable)
        database.create_table(station, variable)
    return redirect(url_for("index"))


@socketio.on("get_data")
def handle_get_data():
    for variable in variables_list:
        emit("insert", {f"{variable}": database.select(station, variable)}, broadcast=True)


@socketio.on("append")
def handle_append(station: str, variable: str):
    database.insert(station, variable, [OPC_Tag(variable, rd.random())])


@socketio.on("update")
def handle_update(station: str, variable: str, tag_name: str, value: Any):
    database.update(station, variable, tag_name, value)


@socketio.on("delete")
def handle_delete(station: str, variable: str, id: str):
    database.delete(station, variable, int(id))

#/////////////////////////////// Test web sockets //////////////////////////
@socketio.on('data')
def handle_message(data):
    """event listener when client types a message"""
    print("data from the front end: ",str(data))
    emit("data",{'data':data,'id':request.sid},broadcast=True)

@socketio.on("disconnect")
def disconnected():
    """event listener when client disconnects to the server"""
    print("user disconnected")
    emit("disconnect",f"user {request.sid} disconnected",broadcast=True)

@socketio.on("connect")
def connected():
    """event listener when client connects to the server"""
    print(request.sid)
    print("client has connected")
    #emit("connect",{"data":f"id: {request.sid} is connected"})

@app.route("/aa")
def http_call():
    """return JSON with string data as the value"""
    data = {'data':'This text was fetched using an HTTP call to server on render'}
    #print(jsonify(data))
    return data

@socketio.on("agitateur")
def connected(state):
    print(state)
    print("je suis a un bon toutou et" +  (" j'eteind ", " j'allume ")[state == 1] +  "l'agitateur sans grogner, sans erreur commme un grand")

if __name__ == "__main__":
    socketio.run(app, debug=True, port=5000)
    