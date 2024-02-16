from typing import Any, Tuple, Generator
from datetime import datetime
from asyncua import Node, ua


class OPC_Data:
    def __init__(self, station: str, tag: str, value: Any, timestamp: datetime, id: int = None) -> None:
        self.station = station
        self.tag = tag
        self.id = id
        self.value = round(value, 7)
        self.timestamp = str(timestamp)[:19]

    def set_id(self, id: int) -> None:
        self.id = id

    def __repr__(self) -> str:
        return str(self.__dict__)

    @property
    def json(self) -> dict:
        return self.__dict__


class OPC_Tags:
    class OPC_Tag:
        def __init__(self, node: Node, variant_type: ua.VariantType) -> None:
            self.node = node
            self.variant_type = variant_type
            self.python_type = self.get_type(variant_type)

        def get_type(self, variant_type: ua.VariantType) -> str:
            return {ua.VariantType.Boolean: "bool", ua.VariantType.Float: "float", ua.VariantType.Int16: "smallint"}[variant_type]

        async def read_value(self) -> Any:
            return await self.node.read_value()

        async def change_value(self, value: Any) -> None:
            await self.node.write_value(ua.DataValue(ua.Variant(value, self.variant_type)))

        def __repr__(self) -> str:
            return "OPC_Tag"

    def __init__(self) -> None:
        self.tags = None

    async def browse_nodes(self, parent_node: Node) -> dict[str, dict[str, OPC_Tag]]:
        nodes = {}
        for child_node in await parent_node.get_children():
            child_name = (await child_node.read_browse_name()).Name

            if child_name not in ["_Statistics", "_System"]:
                child_nodes = await self.browse_nodes(child_node)
                if child_nodes:
                    nodes[child_name] = child_nodes
                else:
                    child_node_type = await child_node.read_data_type_as_variant_type()
                    nodes[child_name] = OPC_Tags.OPC_Tag(child_node, child_node_type)
        self.tags = nodes
        return nodes

    def json(self) -> dict:
        return self.tags

    def __getitem__(self, station) -> dict[str, OPC_Tag]:
        return self.tags[station]

    def __iter__(self) -> Generator[Tuple[str, str], None, None]:
        for station, tags in self.tags.items():
            for tag in tags.keys():
                yield station, tag

    def __repr__(self) -> str:
        return str(self.tags)


async def get_node_data(node: Node) -> Tuple[str, str, datetime]:
    _, station, tag_name = (await node.read_attribute(1)).Value.Value.Identifier.split(".")
    timestamp = (await node.read_attribute(13)).SourceTimestamp
    return station, tag_name, timestamp
