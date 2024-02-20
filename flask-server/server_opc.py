import asyncio
from asyncua import ua, Server
import json

with open(r"ressources\namespace.json", "r" , encoding='utf8') as namespace:
    config = json.load(namespace)


# config['project']['channels'][0]['devices'][0]['common.ALLTYPES_NAME']       # Tank

config['project']['channels'][0]['devices'][0]['tags'][0]['common.ALLTYPES_NAME'] # nom de tag
config['project']['channels'][0]['devices'][0]['tags'][0]['servermain.TAG_DATA_TYPE'] # Type ( 1 boolean, 4 short, 8 float)


async def main():
    server = Server()

    # initialisation
    await server.init()

    # on defini les points de connexion du server
    server.set_endpoint("opc.tcp://localhost:49320")


    # on defini le namespace
    uri = "KEPServerEX"
    idx = await server.register_namespace(uri)
    print("Namespace index : ", idx)
    print("Namespace uri : ", await server.nodes.namespace_array.read_value())

    objects = server.get_objects_node()

    chanName = config['project']['channels'][0]['common.ALLTYPES_NAME']
    deviceName = config['project']['channels'][0]['devices'][0]['common.ALLTYPES_NAME']

    channel = await objects.add_object(idx, chanName)
    device = await channel.add_object(idx, deviceName)

    tags = config['project']['channels'][0]['devices'][0]['tags']

    for tag in tags:
        variant = ua.VariantType.Boolean
        if tag['servermain.TAG_DATA_TYPE'] == 4:
            variant = ua.VariantType.Int16
        elif tag['servermain.TAG_DATA_TYPE'] == 8:
            variant = ua.VariantType.Float
            
        var = await device.add_variable(f"ns={idx};s={chanName}.{deviceName}.{tag['common.ALLTYPES_NAME']}", ua.QualifiedName(tag['common.ALLTYPES_NAME'], idx), False, variant)
        await var.set_writable()

    async with server:
        while True:
            await asyncio.sleep(2)


if __name__ == "__main__":
    asyncio.run(main())
    pass