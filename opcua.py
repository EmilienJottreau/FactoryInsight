from flask_socketio import SocketIO
from database import Database
from asyncua import Node, ua
from typing import Any, Dict, TypeAlias


class OPC_Tag:
    def __init__(self, station: str, name: str, node: Node, variant_type: ua.VariantType) -> None:
        self.station = station
        self.name = name
        self.node = node
        self.variant_type = variant_type

    async def read_value(self) -> Any:
        return await self.node.read_value()

    async def change_value(self, value: Any) -> None:
        await self.node.write_value(ua.DataValue(ua.Variant(value, self.variant_type)))

    def __repr__(self) -> str:
        return f"{{station: {self.station}, name : {self.name}, type: {self.variant_type}}}"
    
    @property
    def json() -> Dict:
        return {}


OPC_Dict: TypeAlias = Dict[str, Dict[str, OPC_Tag]]


async def browse_nodes(parent_node: Node) -> OPC_Dict:
    nodes = {}
    for child_node in await parent_node.get_children():
        child_name = (await child_node.read_browse_name()).Name

        if child_name not in ["_Statistics", "_System"]:
            child_nodes = await browse_nodes(child_node)
            if child_nodes:
                nodes[child_name] = child_nodes
            else:
                parent_name = (await parent_node.read_browse_name()).Name
                child_node_type = await child_node.read_data_type_as_variant_type()
                nodes[child_name] = OPC_Tag(parent_name, child_name, child_node, child_node_type)
    return nodes


async def subscribe_tag(tags: OPC_Dict, subscription) -> None:
    for station in tags:
        for tag in tags[station]:
            await subscription.subscribe_data_change(tags[station][tag].node)


def init_database(tags : OPC_Dict, database: Database) -> None:
    for station in tags:
        for tag in tags[station]:
            database.create_table(station, tag)