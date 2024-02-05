from flask_socketio import SocketIO
from database import Database
from asyncua import Node, ua
from typing import Any, Dict


class OPC_Tag:
    def __init__(self, station: str, name: str, node: Node, variant_type: ua.VariantType) -> None:
        self.station = station
        self.name = name
        self.node = node
        self.variant_type = variant_type

    def __repr__(self) -> str:
        return f"{{station: {self.station}, name : {self.name}, type: {self.variant_type}}}"

    async def read_value(self) -> Any:
        return await self.node.read_value()

    async def change_value(self, value: Any) -> None:
        await self.node.write_value(ua.DataValue(ua.Variant(value, self.variant_type)))


async def browse_nodes(parent_node: Node, subscription=None, database: Database = None) -> Dict[str, Dict[str, OPC_Tag]]:
    nodes = {}
    for child_node in await parent_node.get_children():
        parent_name = (await parent_node.read_browse_name()).Name.lower()
        child_name = (await child_node.read_browse_name()).Name.lower()

        if child_name not in ["_Statistics", "_System"]:
            child_nodes = await browse_nodes(child_node, subscription, database)
            if child_nodes:
                nodes[child_name] = child_nodes
            else:
                child_node_type = await child_node.read_data_type_as_variant_type()
                nodes[child_name] = OPC_Tag(parent_name, child_name, child_node, child_node_type)
                if subscription is not None:
                    await subscription.subscribe_data_change(child_node)
                if database is not None:
                    database.create_table(parent_name, child_name)
    return nodes
