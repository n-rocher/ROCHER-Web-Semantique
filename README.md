# Ontologie - Formule 1 

Ontologie sur les Grand Prix de Formule 1 depuis les premiers jusqu'en 2022.

## Données

Les données utilisées proviennent du jeu de données fournis sur Kaggle : [Formula 1 World Championship](https://www.kaggle.com/datasets/rohanrao/formula-1-world-championship-1950-2020).

Ces données sont récupérées depuis l'api [Ergast](http://ergast.com/mrd/).

## Construit avec

Traitement des données :
* [OpenRefine](https://openrefine.org/) - Nettoyage des données
* [RDF Transform](https://github.com/AtesComp/rdf-transform) - Extension RDF pour OpenRefine 
* [RDF Validator and Converter](http://rdfvalidator.mybluemix.net/) - Validation des données RDF

Site web :
* [React](https://fr.reactjs.org/) - Framework Web
* [React Router](https://reactrouter.com/en/main) - Navigation pour React
* [Elastic UI Framework](https://github.com/elastic/eui) - Composant React pour l'interface
* [Elastic Charts](https://github.com/elastic/elastic-charts) - Composant React pour les graphiques
* [React Simple Maps](https://www.react-simple-maps.io/) - Composant React pour les cartes du monde
* [Axios](https://axios-http.com/) - Client HTTP via promesse js

Serveur :
* [Apache Jena Fuseki](https://jena.apache.org/) - Serveur Web Sémantique RDF 

## Prérequis

Version des différents outils utilisés lors du développement :

```
- node v16
- npm/npx v8.13.2
- yarn v1.22.19
- Apache Jena Fuseki v4.7.0
```

Utilisé pour traiter les données : 

```
- OpenRefine v3.6.2
- RDF Transform v2.2.0
```

## Usage

Étape à suivre pour la mise en place du projet en local :

1. Via la page d'administration de `Apache Jena Fuseki`, charger le fichier `Processed/data.ttl` dans une base de donnée nommée `formula-1`.
> La base de donnée doit être requêtable via `http://localhost:3030/formula-1/query`
2. Dans le dossier `front-end`, installer les dépendances via `npx yarn install`.
3. Toujours dans ce dossier, lancer l'application web en mode développement via `npx yarn start`
4. Testez sur [http://localhost:3000](http://localhost:3000) !



## Auteur
Nathan Rocher
