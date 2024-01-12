# FactoryInsight

Service web de supervision d'installations industrielles.

pour utiliser ce repo :

`git clone https://github.com/EmilienJottreau/FactoryInsight.git`

## Technologie du serveur

- Framework **Python Flask** pour la partie back-end
- Base de données **MySQL** pour la sauvegarde de données
- Serveur OPC **KepServer** pour la gestion des données d'automates industriels
- Framework front-end **React**

## Setup du serveur
- Lancer le server [Node.JS](https://nodejs.org/en/download/current) depuis le dossier client `cd client`.
- Lancer le server [Node.JS](https://nodejs.org/en/download/current) avec `npm start` nécessaire au front-end.
- Installer les dépendances python avec la commande `pip install -r requirements.txt` depuis le dossier
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