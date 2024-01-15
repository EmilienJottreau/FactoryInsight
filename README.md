# FactoryInsight

Service web de supervision d'installations industrielles.

## Technologie du serveur

- Framework **Python Flask** pour la partie back-end du projet
- Base de données **MySQL** pour la sauvegarde de données
- Serveur OPC **KepServer** pour la gestion de données issues d'automates industriels
- Framework **React** pour la partie front-end du site

## Setup du serveur
- Utiliser la commande `git clone https://github.com/EmilienJottreau/FactoryInsight.git` pour cloner le projet.
- Accéder au dossier client `cd client` pour lancer le serveur [Node.JS](https://nodejs.org/en/download/current) avec `npm start` utilisé par React pour la partie front-end.
- [Facultatif] Créer un environnement virtuel pour installer les bibliothèques [python](https://www.python.org/downloads/) :
  - Utiliser `python -m venv .venv` pour initialiser l'environnement.
  - Activer l'environnement virtuel avec `.venv\Scripts\activate` sur Windows ou `.venv/bin/activate` sur Linux ou mac.
- Installer les bibliothèques python nécessaires au projet avec la commande `pip install -r requirements.txt` depuis la racine du dossier.
- Initialiser la base de données MySQL depuis [XAMPP](https://www.apachefriends.org/fr/download.html) :
  - Démarrer les modules *Apache* et *MySQL*.
- Initialiser le serveur OPC depuis [KepServer](https://www.kepware.fr/produit/kepserverex/).
  - Importer depuis l'application l'espace d'adressage **namespace.opf** situé dans le dossier *ressources*.
  - Se connecter aux sources de données depuis l'onglet *Runtime* > *Connect*.
- Exécuter `python flask-server/server.py` pour lancer le serveur.
- Démarrer le simulateur avec `python flask-server/simulator.py` afin de simuler l'installation.
- Afficher la page web de l'application depuis l'adresse `http://127.0.0.1:5000/` dans votre navigateur.

## Vidéo de démonstration

TODO

## Membres de l'équipe

- Marguerite DIOUF
- Emilien JOTTREAU
- Adrien MICHAUT

## Bugs connus

TODO