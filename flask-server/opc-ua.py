from asyncua import Client, Node, ua
from typing import Any
import asyncio


class SubHandler(object):
    """
    Class used for client to subscriptions.
        - receives events from server
        - defines the associated callback procedures
    """

    def datachange_notification(self, node, val, data):
        """Subscription to monitoring variables from KEPServer's notifications"""
        print(f"Notification de changement de valeur pour {node} : vaut {val}")


class OPCTag:
    handler = SubHandler()
    client = Client(url="opc.tcp://127.0.0.1:49320")

    async def __init__(self, name: str) -> None:
        async with OPCTag.client as client:
            self.tag = client.get_node(name)
        #self.tag = OPCTag.client.get_node(name)
        print(self.tag, type(self.tag))
        self.type = 1 #self.get_type()

    async def get_type(self) -> Any:
        """Get the tag type"""
        return await self.tag.read_data_type_as_variant_type()

    async def read(self) -> Any:
        """Read the value of the tag"""
        value = await self.tag.read_value()
        print(value)
        return value 

    async def write(self, value: Any):
        """Write the value of the tag"""
        await self.tag.set_value(ua.DataValue(ua.Variant(value, self.type)))

    async def subscribe(self, interval: float) -> None:
        """Subscribe the tag to the"""
        async with OPCTag.client as client:
            subscription = await client.create_subscription(interval, OPCTag.handler)
            await subscription.subscribe_data_change(self.tag)

    async def tt(self):
        value = await asyncio.run(self.read())
        print(value)

    async def test(self):
        async with OPCTag.client as client:
            node = client.get_node("ns=2;s=Channel1.Device1.Tag1")
            value = await node.read_value()
            return value


    def test2(self):
        return asyncio.run(self.test())


server_url = "opc.tcp://127.0.0.1:49320"

tag1 = OPCTag("ns=2;s=Channel1.Device1.Tag1")
#tag1.subscribe(100)
print(tag1.test2())
#value = asyncio.run(tag1.read())


"""
async def main():
    async with Client(url=server_url) as client:

        tag2 = OPCTag("ns=2;s=Channel1.Device1.Tag2")
        value = await tag2.test()
        print(f"is equal to {value}")
        await tag2.subscribe(100)
        while True:
            await asyncio.sleep(1)


if __name__ == "__main__":
    asyncio.run(main())
"""