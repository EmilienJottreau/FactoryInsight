from asyncua import Client, Node, ua
from typing import Any
import random as rd
import asyncio


server_url = "opc.tcp://127.0.0.1:49320"

tags = {
    "agitator_speed": None,
    "agitator_state": None,
    "cleaning_state": None,
    "heating_state": None,
    "heating_temperature": None,
    "input_flow": None,
    "input_state": None,
    "level": None,
    "liquid_temperature": None,
    "maintenance": None,
    "manual_mode": None,
    "operating_state": None,
    "output_flow": None,
    "output_state": None,
}


async def change_value(tag: Node, value: Any) -> None:
    """Change the value of the tag"""
    await tag.write_value(ua.DataValue(ua.Variant(value, await tag.read_data_type_as_variant_type())))


# sequence = [remplissage, chauffage, agitateur, attente, vidage, nettoyage]
async def simulator() -> None:
    async with Client(url=server_url) as client:
        namespace_index = await client.get_namespace_index("KEPServerEX")

        for tag in tags:
            tags[tag] = await client.nodes.root.get_child(["0:Objects", f"{namespace_index}:FactoryInsight", f"{namespace_index}:Tank", f"{namespace_index}:{tag}"])

        await change_value(tags["operating_state"], True)
        await change_value(tags["input_state"], True)
        await change_value(tags["level"], 0)

        while True:
            if await tags["operating_state"].read_value():
                if not await tags["maintenance"].read_value():
                    if not await tags["cleaning_state"].read_value():
                        if await tags["input_state"].read_value():
                            await change_value(tags["input_flow"], rd.gauss(0.8, 0.4))
                            await change_value(tags["level"], await tags["level"].read_value() + rd.random() / 1000)

                        if await tags["output_state"].read_value():
                            await change_value(tags["output_flow"], rd.gauss(0.8, 0.4))
                            await change_value(tags["level"], await tags["level"].read_value() - rd.random() / 1000)

                        if await tags["heating_state"].read_value():
                            await change_value(tags["heating_temperature"], rd.gauss(82, 1))
                            await change_value(tags["liquid_temperature"], rd.gauss(79, 4))

                        if await tags["agitator_state"].read_value():
                            await change_value(tags["agitator_speed"], rd.gauss(30, 0.2))

                        # if await tags["level"].read_value() > 1.98:
                        # await change_value(tags["input_state"], False)
            await asyncio.sleep(0.5)


if __name__ == "__main__":
    asyncio.run(simulator())
