from flask_server import flask_server
from opc_client import opc_client
from opc_tags import OPC_Tags
from database import Database


opc_server_url = "opc.tcp://127.0.0.1:49320"


database = Database("FactoryInsignt", recreate_db=False, logger=False)

opc_tags = OPC_Tags()

socketio, app = flask_server(database, opc_tags, logger=False)

socketio.start_background_task(opc_client, opc_server_url, database, socketio, opc_tags)

socketio.run(app, allow_unsafe_werkzeug=True)
