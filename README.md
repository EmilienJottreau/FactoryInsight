# FactoryInsight

Service web de supervision d'installations industrielles.

## Technologie du serveur

- Framework back-end **Python Flask**
- **Python**
- Framework front-end **React**
- Base de données **MySQL**
- Serveur OPC **KepServer**

## Setup du serveur
- Lancer le server [Node.JS](https://nodejs.org/en/download/current) depuis le dossier client `cd client`.
- Lancer le server [Node.JS](https://nodejs.org/en/download/current) avec `npm start` nécessaire au front-end.
- Utiliser la commande `pip install -r requirements.txt` depuis le dossier pour installer toutes les dépendances python.
  - Installer la bibliothèque flask pour python `pip install flask`
  - Installer les bibliothèques python nécessaire au serveur OPC `pip install asyncio asyncua`
  - Installer la bibliothèque python MySQL pour la base de données `pip install mysql-connector-python`
- Démarrer la base de données MySQL depuis [XAMPP](https://www.apachefriends.org/fr/download.html).                  
- Initialiser le serveur OPC depuis [KepServer](https://www.kepware.fr/produit/kepserverex/).
- Exécuter `python flask-server/server.py` pour lancer le serveur.

## Vidéo de démonstration

TODO

## Membres de l'équipe

- Marguerite DIOUF
- Emilien JOTTREAU
- Adrien MICHAUT

## Bugs connus

TODO