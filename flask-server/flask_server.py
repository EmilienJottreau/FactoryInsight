from flask import Flask, render_template
from datetime import datetime, timedelta
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
        return history

    # /api/v1/stats/Tank/liquid_level/24
    @app.get("/api/v1/stats/<string:station>/<string:tag>/<int:duration>")
    def get_stats(station: str, tag: str, duration: int):
        """Get the stats of a tag over a period of time"""
        results = database.select_stat(station, tag, str(datetime.now() - timedelta(hours=duration)))
        values = []
        for result in results:
            values.append(result["value"])
        return {"max": max(values), "min": min(values), "mean": sum(values) / len(values)}

    return socketio, app
