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
        """Notify a modification"""
        print(f"Notification de changement de valeur pour {node} : vaut {val}")


server_url = "opc.tcp://127.0.0.1:49320"


async def main():
    async with Client(url=server_url) as client:

        class Tag:
            handler = SubHandler()

            def __init__(self, tag_name: str) -> None:
                self.tag = client.get_node(f"ns=2;s={tag_name}")
                self.type = self.get_type()

            async def get_type(self) -> Any:
                """Get the tag type"""
                return await self.tag.read_data_type_as_variant_type()

            async def read(self) -> Any:
                """Read the value of the tag"""
                return await self.tag.read_value()

            async def write(self, value: Any):
                """Write the value of the tag"""
                await self.tag.set_value(ua.DataValue(ua.Variant(value, self.type)))

            async def subscribe(self, interval: float) -> None:
                """Subscribe the tag to the"""
                subscription = await client.create_subscription(interval, Tag.handler)
                await subscription.subscribe_data_change(self.tag)

        while True:
            await asyncio.sleep(1)


if __name__ == "__main__":
    asyncio.run(main())
