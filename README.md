# FactoryInsight

Service web de supervision d'installations industrielles.

## Technologie du serveur

- Framework **Python Flask** pour la partie back-end du projet
- Base de données **MySQL** pour la sauvegarde de données
- Serveur OPC **KepServer** pour la gestion de données issues d'automates industriels
- Framework **React** pour la partie front-end du site

## Setup du serveur
- Télécharger le projet ou utiliser la commande `git clone https://github.com/EmilienJottreau/FactoryInsight.git` pour le cloner.
- [Facultatif] Créer un environnement virtuel pour installer les bibliothèques [python](https://www.python.org/downloads/) :
  - Utiliser `python -m venv .venv` pour initialiser l'environnement.
  - Activer l'environnement virtuel sur Windows avec `.venv\Scripts\activate` ou `.venv/bin/activate` sur Linux ou mac.
      - [Facultatif] Si powershell refuse de lancer l'environnement virtuel, utiliser `Set-ExecutionPolicy Unrestricted -Scope Process`
- Depuis la racine du dossier, utiliser `pip install -r requirements.txt` pour installer les modules python nécessaires au projet.
- Initialiser la base de données MySQL depuis [XAMPP](https://www.apachefriends.org/fr/download.html) :
  - Démarrer les modules *Apache* et *MySQL*.
- Configurer le serveur OPC depuis [KepServer](https://www.kepware.fr/produit/kepserverex/) :
  - Importer depuis l'application l'espace d'adressage **namespace.opf** situé dans le dossier *ressources*.
  - Se connecter aux sources de données depuis l'onglet *Runtime* > *Connect*.
- Exécuter `python flask-server/server.py` pour lancer le serveur Flask.
- Démarrer le simulateur avec `python flask-server/simulator.py` afin de simuler l'installation.
- Accéder au dossier client `cd client` pour lancer le serveur [Node.JS](https://nodejs.org/en/download/current) :
  - `npm install` lors de la première utilisation pour générer le dossier node_modules.
  - `npm start` pour démarrer le serveur front-end.
- Afficher la page web de l'application depuis l'adresse `http://127.0.0.1:3000/` dans un navigateur.

## Vidéos de démonstration

### Setup de l'application web
[![Setup](https://i3.ytimg.com/vi/qaqEv_Dv8r8/maxresdefault.jpg)](https://www.youtube.com/watch?v=qaqEv_Dv8r8 "Video Set-up")

### Démonstration des fonctionnalités
[![Demo](https://i3.ytimg.com/vi/BiSCd3T03wg/maxresdefault.jpg)](https://youtu.be/BiSCd3T03wg "Video Demo")

## Membres de l'équipe

- Marguerite DIOUF
- Emilien JOTTREAU
- Adrien MICHAUT

## Bugs connus

- Sur certaines machines, le serveur flask perd la connexion avec la base de données au bout d'un certain temps. Les réponses aux requêtes nécessitant les informations de la base de données sont alors vides.
