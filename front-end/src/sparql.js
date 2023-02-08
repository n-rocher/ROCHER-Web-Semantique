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


export async function getAllGrandPrix() {
    const query = `
        PREFIX : <http://127.0.0.1:3333/>
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        
        SELECT * WHERE {
            ?uri a dbo:GrandPrix ;
            :dateTime [ a :DateTime ; :date ?date ] ;
            :year ?year ;
            :name ?name  .
            OPTIONAL {
                ?race_uri :race ?uri;
                        :positionOrder "1"^^xsd:int;
                        :driver ?winner_uri.
                ?winner_uri :name [ :forename ?winner_forename; :surname ?winner_surname ] .
            }
        } ORDER BY DESC(?date) LIMIT 50
    `
    return requestSPARQL(query)
}

export async function getGrandPrix(grandprix_iri) {
    const query = `
        PREFIX : <http://127.0.0.1:3333/>
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

        SELECT * WHERE {
            :${grandprix_iri} a dbo:GrandPrix ;
            :name ?name;
            :year ?year;
            :circuit ?circuit_uri;
            :wikipedia ?wikipedia_url ;
            :dateTime [ :date ?gp_date; :time ?gp_time; ] .

            ?circuit_uri a :Circuit;
                :name ?circuit_name ;
                :location ?circuit_location ;
                :country ?circuit_country ;
                :lat ?circuit_lat ;
                :lng ?circuit_lng ;
                :wikipedia ?circuit_wikipedia .
            
            OPTIONAL  { :${grandprix_iri} :fp1 [  :date ?fp1_date; :time ?fp1_time; ] }
            OPTIONAL  { :${grandprix_iri} :fp2 [  :date ?fp2_date; :time ?fp2_time; ] }
            OPTIONAL  { :${grandprix_iri} :fp3 [  :date ?fp3_date; :time ?fp3_time; ] }
            OPTIONAL  { :${grandprix_iri} :qualification [:date ?qualification_date; :time ?qualification_time; ] }
            OPTIONAL  { :${grandprix_iri} :sprint [ :date ?sprint_date; :time ?sprint_time; ] }
        }
    `
    return requestSPARQL(query)
}

export async function getResults(grandprix_iri) {
    const query = `
        PREFIX : <http://127.0.0.1:3333/>
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        
        SELECT * WHERE {
            ?result_uri a :Result ;
                    :race :${grandprix_iri} ;
                    :driver ?driver_uri;
                    :constructor ?constructor_uri;
                
                    :driverNumber ?driverNumber;
                    :grid ?grid ;
                    :status ?status_uri .
            
            ?status_uri a :Status ;
                    :status ?status;
                    :type ?status_type.
                
            ?driver_uri a :Driver ;
                    :name [ a :DriverName; :forename ?forename; :surname ?surname ].
            
            ?constructor_uri a :Constructor ;
                    :name ?constructor.
        
                OPTIONAL { ?result_uri :positionOrder ?positionOrder ; }
                OPTIONAL { ?result_uri :points ?points ; }
                OPTIONAL { ?result_uri :laps ?laps ; }
                OPTIONAL { ?result_uri :milliseconds ?milliseconds ; }
                OPTIONAL { ?result_uri :fastestLap ?fastestLap ; }
                OPTIONAL { ?result_uri :fastestLapTime ?fastestLapTime ; }
                OPTIONAL { ?result_uri :fastestLapSpeed ?fastestLapSpeed ; }
                OPTIONAL { ?result_uri :rank ?rank ; } 

            FILTER(LANG(?status) = "fr")

        } ORDER BY ASC(?positionOrder)
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