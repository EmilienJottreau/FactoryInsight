from random import gauss, random
from asyncio import run, sleep
from opc_tags import OPC_Tags
from asyncua import Client
from time import time


opc_server_url = "opc.tcp://127.0.0.1:49320"


async def simulator() -> None:
    async with Client(url=opc_server_url) as client:
        namespace_index = await client.get_namespace_index("KEPServerEX")

        try:
            main_node = await client.nodes.root.get_child(f"0:Objects/{namespace_index}:FactoryInsight")
            tags = (await OPC_Tags().browse_nodes(main_node))["Tank"]
        except Exception as e:
            print(e)
            raise Exception("Le namespace 'FactoryInsignt' n'est pas chargé dans le serveur OPC")

        clock = time()

        await tags["emergency_stop"].change_value(False)
        await tags["operating_state"].change_value(True)
        await tags["manual_mode"].change_value(False)
        await tags["cleaning_state"].change_value(False)
        await tags["liquid_level"].change_value(0)
        await tags["heating_temperature"].change_value(0)
        await tags["liquid_temperature"].change_value(0)
        await tags["cycle_number"].change_value(0)
        await tags["step_number"].change_value(0)

        while True:
            if not await tags["operating_state"].read_value():
                continue

            if await tags["emergency_stop"].read_value():
                await tags["cleaning_state"].change_value(False)
                await tags["input_state"].change_value(False)
                await tags["output_state"].change_value(False)
                await tags["heating_state"].change_value(False)
                await tags["agitator_state"].change_value(False)
                continue

            # Automatic sequence
            if not await tags["manual_mode"].read_value():
                timer = time() - clock
                match (await tags["step_number"].read_value()):
                    case 0:
                        await tags["input_state"].change_value(True)
                        await tags["step_number"].change_value(1)
                        clock = time()
                    case 1:
                        if timer > 5 * 60:
                            await tags["heating_state"].change_value(True)
                            await tags["agitator_state"].change_value(True)
                            await tags["step_number"].change_value(2)
                    case 2:
                        if await tags["liquid_level"].read_value() > 1.98:
                            await tags["input_state"].change_value(False)
                            await tags["step_number"].change_value(3)
                            clock = time()
                    case 3:
                        if timer > 10 * 60:
                            await tags["heating_state"].change_value(False)
                            await tags["agitator_state"].change_value(False)
                            await tags["step_number"].change_value(4)
                            clock = time()
                    case 4:
                        if timer > 2 * 60:
                            await tags["output_state"].change_value(True)
                            await tags["step_number"].change_value(5)
                            clock = time()
                    case 5:
                        if await tags["liquid_level"].read_value() < 0:
                            await tags["output_state"].change_value(False)
                            await tags["step_number"].change_value(6)
                            clock = time()
                    case 6:
                        if timer > 3 * 60:
                            await tags["cleaning_state"].change_value(True)
                            await tags["agitator_state"].change_value(True)
                            await tags["step_number"].change_value(7)
                            clock = time()
                    case 7:
                        if timer > 4 * 60:
                            await tags["cleaning_state"].change_value(False)
                            await tags["agitator_state"].change_value(False)
                            await tags["step_number"].change_value(8)
                            clock = time()
                    case 8:
                        if timer > 1 * 60:
                            await tags["cycle_number"].change_value(await tags["cycle_number"].read_value() + 1)
                            await tags["step_number"].change_value(0)

            if await tags["input_state"].read_value():
                await tags["input_flow"].change_value(gauss(0.8, 0.4))
                await tags["liquid_level"].change_value(await tags["liquid_level"].read_value() + random() / 500)
            else:
                await tags["input_flow"].change_value(0)

            if await tags["output_state"].read_value():
                await tags["output_flow"].change_value(gauss(0.8, 0.4))
                await tags["liquid_level"].change_value(await tags["liquid_level"].read_value() - random() / 500)
            else:
                await tags["output_flow"].change_value(0)

            if await tags["heating_state"].read_value():
                await tags["heating_temperature"].change_value(gauss(82, 1))
                if await tags["liquid_level"].read_value() > 0:
                    if await tags["liquid_temperature"].read_value() < 80:
                        await tags["liquid_temperature"].change_value(await tags["liquid_temperature"].read_value() + gauss(2, 0.3))
                    else:
                        await tags["liquid_temperature"].change_value(await tags["liquid_temperature"].read_value() - gauss(3, 0.5))
                else:
                    await tags["liquid_temperature"].change_value(0)
            else:
                if await tags["heating_temperature"].read_value() > 0:
                    await tags["heating_temperature"].change_value(await tags["heating_temperature"].read_value() - gauss(4, 1))
                if await tags["heating_temperature"].read_value() < 0:
                    await tags["heating_temperature"].change_value(0)
                if await tags["liquid_level"].read_value() > 0:
                    if await tags["liquid_temperature"].read_value() > 26:
                        await tags["liquid_temperature"].change_value(await tags["liquid_temperature"].read_value() - gauss(1, 0.4))
                    if await tags["liquid_temperature"].read_value() < 26:
                        await tags["liquid_temperature"].change_value(await tags["liquid_temperature"].read_value() + gauss(0.2, 0.1))

            if await tags["agitator_state"].read_value():
                await tags["agitator_speed"].change_value(gauss(30, 0.2))
            else:
                await tags["agitator_speed"].change_value(0)

            if await tags["liquid_level"].read_value() > 1.98:
                await tags["input_state"].change_value(False)
            elif await tags["liquid_level"].read_value() < 0:
                await tags["liquid_level"].change_value(0)
                await tags["output_state"].change_value(False)

            if await tags["cleaning_state"].read_value():
                await tags["input_state"].change_value(False)
                await tags["output_state"].change_value(False)
                await tags["heating_state"].change_value(False)

            await sleep(1)


if __name__ == "__main__":
    run(simulator())
