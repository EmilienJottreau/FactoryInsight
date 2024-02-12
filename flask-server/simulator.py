from random import gauss, random
from opcua import browse_nodes
from asyncio import run, sleep
from asyncua import Client


opc_server_url = "opc.tcp://127.0.0.1:49320"


# sequence = [remplissage, chauffage, agitateur, attente, vidage, nettoyage]
async def simulator() -> None:
    async with Client(url=opc_server_url) as client:
        namespace_index = await client.get_namespace_index("KEPServerEX")

        try:
            main_node = await client.nodes.root.get_child(f"0:Objects/{namespace_index}:FactoryInsight")
            tags = (await browse_nodes(main_node))["Tank"]
        except:
            raise Exception("Le namespace 'FactoryInsignt' n'est pas chargé dans le serveur OPC")

        await tags["operating_state"].change_value(True)
        await tags["input_state"].change_value(True)
        await tags["liquid_level"].change_value(0)

        while True:
            if await tags["operating_state"].read_value():
                if not await tags["manual_mode"].read_value():
                    if not await tags["failure_state"].read_value():
                        if not await tags["cleaning_state"].read_value():
                            if await tags["input_state"].read_value():
                                await tags["input_flow"].change_value(gauss(0.8, 0.4))
                                await tags["liquid_level"].change_value(await tags["liquid_level"].read_value() + random() / 1000)

                            if await tags["output_state"].read_value():
                                await tags["output_flow"].change_value(gauss(0.8, 0.4))
                                await tags["liquid_level"].change_value(await tags["liquid_level"].read_value() - random() / 1000)

                            if await tags["heating_state"].read_value():
                                await tags["heating_temperature"].change_value(gauss(82, 1))
                                await tags["liquid_temperature"].change_value(gauss(79, 4))

                            if await tags["agitator_state"].read_value():
                                await tags["agitator_speed"].change_value(gauss(30, 0.2))

                            if await tags["liquid_level"].read_value() > 1.98:
                                await tags["input_state"].change_value(False)
            await sleep(3)


if __name__ == "__main__":
    run(simulator())
