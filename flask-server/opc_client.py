from asyncio import new_event_loop, set_event_loop, sleep
from opc_tags import get_node_data, OPC_Data, OPC_Tags
from flask_socketio import SocketIO
from asyncua import Client, Node
from database import Database
from typing import Any


def opc_client(server_url: str, database: Database, socket: SocketIO, opc_tags: OPC_Tags) -> None:

    class SubHandler:
        async def datachange_notification(self, node: Node, value: Any, _) -> None:
            station, tag_name, timestamp = await get_node_data(node)

            tag = OPC_Data(station, tag_name, value, timestamp)
            id = database.insert(station, tag_name, tag.json)
            tag.set_id(id)

            socket.emit("datachange", tag.json)

    async def client_loop() -> None:
        async with Client(url=server_url) as client:
            namespace_index = await client.get_namespace_index("KEPServerEX")

            main_node = await client.nodes.root.get_child(f"0:Objects/{namespace_index}:FactoryInsight")
            await opc_tags.browse_nodes(main_node)

            handler = SubHandler()
            subscription = await client.create_subscription(200, handler)

            for station, tag in opc_tags:
                await subscription.subscribe_data_change(opc_tags[station][tag].node)
                database.create_table(station, tag, opc_tags[station][tag].python_type)

            while True:
                await sleep(1)

    loop = new_event_loop()
    set_event_loop(loop)

    loop.run_until_complete(client_loop())
