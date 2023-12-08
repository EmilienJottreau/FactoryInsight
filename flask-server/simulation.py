from asyncua import Client, ua
import asyncio


class SubHandler(object):
    """
    Class used for client to subscriptions.
        - receives events from server
        - defines the associated callback procedures
    """

    def datachange_notification(self, node, val, data):
        """Souscription pour suivre l'évolution des variables à partir de notifications émisent par KEPServer"""
        print(f"Notification de changement de valeur pour {node} : vaut {val}")


server_url = "opc.tcp://127.0.0.1:4840"
tags = {
    "agitator_speed": None,
    "agitator_state": None,
    "cleaning": None,
    "emptying": None,
    "filling": None,
    "heating_state": None,
    "heating_temperature": None,
    "input_flow": None,
    "input_state": None,
    "level": None,
    "liquid_temperature": None,
    "maintenance": None,
    "output_flow": None,
    "output_state": None,
}


async def change_value(tag):
    await tag.write_value(ua.DataValue(ua.Variant(await tags["level"].read_value() + 1, await tag.read_data_type_as_variant_type())))


async def main():
    async with Client(url=server_url) as client:
        uri = "https://github.com/EmilienJottreau/FactoryInsight"
        namespace_index = await client.get_namespace_index(uri)

        for tag in tags:
            tags[tag] = await client.nodes.root.get_child(["0:Objects", f"{namespace_index}:Tank", f"{namespace_index}:{tag}"])

        await change_value(
            tags["level"],
        )
        await tags["level"].write_value(ua.DataValue(ua.Variant(await tags["level"].read_value(), await tags["level"].read_data_type_as_variant_type())))

        while True:
            await asyncio.sleep(1)


if __name__ == "__main__":
    asyncio.run(main())
