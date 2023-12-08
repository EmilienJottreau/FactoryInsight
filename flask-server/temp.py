from asyncua import Client, Node, ua
from typing import Any
import asyncio


class SubHandler(object):
    def datachange_notification(self, node, val, data):
        print(f"Notification de changement de valeur pour {node} : vaut {val}")


class OPCTag:
    async def __init__(self, name: str, client: Client):
        self.name = name
        self.client = client
        self.tag = client.get_node("ns=2;s=Channel1.Device1." + name)
        self.type = await self.get_type()

    async def read(self) -> Any:
        return await self.tag.read_value()

    async def write(self, value: Any) -> None:
        await self.tag.write_value(ua.DataValue(ua.Variant(value, ua.VariantType.Float)))

    async def get_type(self) -> None:
        return await self.tag.read_data_type_as_variant_type()

    def __str__(self) -> str:
        #return f"{self.name} est connecté au client {self.client} à la node {self.tag}"
        return f"est de type {self.type}"


async def main():
    async with Client(url="opc.tcp://127.0.0.1:49320") as client:
        tag1 = await OPCTag("Tag1", client)
        print(await tag1.__str__())

        print(await tag1.read())

        await tag1.write(50)

        print(await tag1.read())


if __name__ == "__main__":
    asyncio.run(main())
