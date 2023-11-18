#experimentation
import asyncio
from asyncua import Client,Node, ua # ua: fonctionnalités de base pour les dialogues OPC UA




#CLASSE UTILISEE par le client pour les souscriptions 
class SubHandler(object):
    #reçoit les notifs du serveur, définit les fonctions de callback associés,
    def datachange_notification(self,node,val, data):
        print("nouvelle notif value_change :", node, val)







#coroutine correspondant à notre main
async def main():
    #instanciation et connexion au serveur OPC UA
    async with Client(url="opc.tcp://127.0.0.1:49320") as client:
    # 'client' est l'objet qui correspond au client OPC UA
    # 'url' doit correspondre au endpoint (point d'entrée du serveur OPC UA)
    # Avec Kepserver : demarrer kepserver EX6 administration
    #recupèrer l'url avec click droit opc ua config , endpoints, edit , copy

    #a ce stade on est connecté
    #par defaut, on se retrouve au niveau du root
        root= client.get_root_node()
        print('hello', root)

        #on peut recuperer les nodes qui sont liés au node root
        print("les noeuds liés au root", await client.nodes.root.get_children())
        
        #en fait, seul les nodes de nodeclass 'objects' nous intéresse car ils
        #correspondent aux branches et feuilles de l'espace d'adressage
        objects = client.get_objects_node()
        a= await objects.get_children()
        #print("les noeuds de nodeclass objects sont: ", a)

        #on peut se promener dans l'arborescence
        for node in a:
            if node=="ns=2;s=Channel1":
                print("le noeud :" , node)
                print("a pour noeuds liés :", await node.get_children())

        #pour  accéder aux items servis par kepserver , on va utiliser les informations fournis par les
        tag1 = client.get_node("ns=2;s=Channel1.Device1.Tag1")

        print("la valeur de tag1 est:", await tag1.read_value())
       

        #ecriture: coroutine set_value
        #on doit fournir le type de la variable
        #si on le connait, on l'écrit directement
        dv=ua.DataValue(ua.Variant(2.35,ua.VariantType.Float))
        
        await tag1.set_value(dv)
        

        #on peut aussi écrire avec un type implicite en escomptant que le format
        #on peut recuperer le type
        typ= await tag3.read_data_type_as_variant_type()
        await tag3.set_value(ua.DataValue(ua.Variant(9.5,typ)))

        #on va utiliser le mecanisme de souscription notamment pour suivre l'évolution d'une variable
        #a partir de notifications fournies par kepserver
        #on déclare en amont une classe qui héberge les evenements de notification
        #on instancie  un objet de cette classe
        handler=SubHandler()
        #on crée les souscriptions
        sub= await client.create_subscription(100, handler)
        #1 arg: temps entre deux notifications  - updaterate
        #on souscrit a l'évènement datachange
        handle1 = await sub.subscribe_data_change(tag1)
 
        
        while True:
            await asyncio.sleep(1)
        
        print('hello')

        
        



if __name__ == '__main__':
    #la suite s'exécute seulement si le script est appelé directement par
    #l'interpreteur python
    asyncio.run(main())
