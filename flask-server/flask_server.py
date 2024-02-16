from flask import Flask, render_template
from flask_socketio import SocketIO
from opc_tags import OPC_Tags
from database import Database
from flask_cors import CORS


def flask_server(database: Database, opc_tags: OPC_Tags, logger: bool) -> tuple[SocketIO, Flask]:
    app = Flask(__name__)
    CORS(app)

    socketio = SocketIO(app, logger=logger, engineio_logger=logger, cors_allowed_origins="*")

    @app.route("/")
    def index():
        return render_template("index.html")

    # /api/v1/switch/Tank/heating_state/1
    @app.get("/api/v1/switch/<string:station>/<string:tag>/<int:value>")
    async def switch_state(station: str, tag: str, value: bool):
        """Switch the value of a tag to True/False"""
        await opc_tags[station][tag].change_value(bool(value))
        return {"value": value}

    # /api/v1/values/Tank/liquid_level/10
    @app.get("/api/v1/values/<string:station>/<string:tag>/<int:limit>")
    def get_values(station: str, tag: str, limit: int):
        """Get the latest values of a tag"""
        return database.select(station, tag, limit)

    # /api/v1/history/1
    @app.get("/api/v1/history/<int:limit>")
    def get_history(limit: int):
        """Get the latest values of all tags"""
        history = []
        for station, tag in opc_tags:
            history += database.select(station, tag, limit)
        print(history)
        return history

    return socketio, app
