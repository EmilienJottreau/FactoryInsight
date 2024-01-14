# FactoryInsight

Service web de supervision d'installations industrielles.

## Technologie du serveur

- Framework **Python Flask** pour la partie back-end du projet
- Base de données **MySQL** pour la sauvegarde de données
- Serveur OPC **KepServer** pour la gestion de données issues d'automates industriels
- Framework **React** pour la partie front-end du site

## Setup du serveur
- Utiliser la commande `git clone https://github.com/EmilienJottreau/FactoryInsight.git` pour cloner le projet.
- Accéder au dossier client `cd client` pour lancer le serveur [Node.JS](https://nodejs.org/en/download/current) avec `npm start` utiliser par React pour la partie front-end.
- Installer les bibliothèques python nécessaires au projet avec la commande `pip install -r requirements.txt` depuis le dossier.
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