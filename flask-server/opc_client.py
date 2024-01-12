from asyncua import Client, Node, ua
from database import Database
from opc_tags import OPC_Tag
import asyncio


database = Database("Tank", recreate_db=False, logger=True)
print(Database.callback_function)
tags = {
    "agitator_speed": None,
    "agitator_state": None,
    "cleaning": None,
    "emptying_state": None,
    "filling_state": None,
    "heating_state": None,
    "heating_temperature": None,
    "input_flow": None,
    "input_state": None,
    "level": None,
    "liquid_temperature": None,
    "maintenance": None,
    "manual_mode": None,
    "output_flow": None,
    "output_state": None,
}


class SubHandler(object):
    """
    Class used for client to subscriptions.
        - receives events from server
        - defines the associated callback procedures
    """

    async def datachange_notification(self, node: Node, val, data):
        """Subscription to monitoring variables from KEPServer's notifications"""
        name = (await node.read_browse_name()).Name
        print(f"Notification de changement de valeur pour {name} : vaut {val}")

        if await node.read_data_type_as_variant_type() is ua.VariantType.Float:
            database.insert(name, [OPC_Tag(name, val)])
        else:
            database.insert("states", [OPC_Tag(name, val)])

server_url = "opc.tcp://127.0.0.1:49320"


async def main():
    async with Client(url=server_url) as client:
        namespace_index = await client.get_namespace_index("KEPServerEX")

        handler = SubHandler()
        
        for tag in tags:
            tags[tag] = await client.nodes.root.get_child(["0:Objects", f"{namespace_index}:FactoryInsight", f"{namespace_index}:Tank", f"{namespace_index}:{tag}"])
            subscription = await client.create_subscription(100, handler)
            await subscription.subscribe_data_change(tags[tag])

        while True:
            await asyncio.sleep(0.5)


if __name__ == "__main__":
    asyncio.run(main())
