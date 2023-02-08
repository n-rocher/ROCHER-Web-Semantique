import axios from "axios";

async function requestSPARQL(sparql) {
    return new Promise((resolve, reject) => {
        var bodyFormData = new URLSearchParams();
        bodyFormData.append('query', sparql);
        axios({
            method: 'post',
            url: 'http://localhost:3030/formula-1/query',
            data: bodyFormData,
        }).then(response => {
            resolve(response.data.results.bindings)
        }).catch(err => {
            console.error(err)
            reject(err)
        })
    })

}


export async function getGrandPrix() {
    const query = `
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX : <http://127.0.0.1:3333/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        SELECT * WHERE {
        ?uri a dbo:GrandPrix ;
        :dateTime [ a :DateTime ; :date ?dateTime ] ;
        :year ?year ;
        :name ?name  .
            OPTIONAL {
            ?race_uri :race ?uri;
                       :positionOrder "1"^^xsd:int;
                       :driver ?winner_uri.

            ?winner_uri :name [ :forename ?winner_forename; :surname ?winner_surname ] .
            }

        } ORDER BY DESC(?dateTime) LIMIT 50
    `
    return requestSPARQL(query)
}




export async function getNumberOfGrandPrixByYear() {
    const query = `
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX : <http://127.0.0.1:3333/>
        SELECT ?year (COUNT(?uri) AS ?value) WHERE {
                ?uri a dbo:GrandPrix ;
                :year ?year.
        } GROUP BY(?year) ORDER BY ASC(?year)
    `
    return requestSPARQL(query)
}



/*






PREFIX dbo: <http://dbpedia.org/ontology/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX : <http://127.0.0.1:3333/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT * WHERE {
  SERVICE <http://dbpedia.org/sparql> {
    ?athlete  rdfs:label  "Cristiano Ronaldo"@en ;
            dbo:number  ?number .
  }
}   LIMIT 10






PREFIX dbp: <http://dbpedia.org/property/>
PREFIX dbo: <http://dbpedia.org/ontology/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX : <http://127.0.0.1:3333/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT *  WHERE {
  		?uri a dbo:GrandPrix ;
          :name ?name;
          :year ?year;
          :circuit ?circuit.
        	OPTIONAL {
    		 ?circuit :name ?circuit_name.
             ?circuit :country ?country.
              OPTIONAL {
                SERVICE <http://dbpedia.org/sparql> {
                  ?country rdfs:label ?country_name ;
        			FILTER(lang(?country_name) ="fr").
                }
              }
            }

} ORDER BY DESC(?year)  LIMIT 10




*/