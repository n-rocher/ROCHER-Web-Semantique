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
        PREFIX foaf: <http://xmlns.com/foaf/0.1/>

        SELECT 
        ?name
        ?year
        ?gp_date
        ?gp_time
        ?fp1_date
        ?fp2_date
        ?fp3_date
        ?fp1_time
        ?fp2_time
        ?fp3_time
        ?qualification_date
        ?qualification_time
        ?sprint_date
        ?sprint_time
        ?circuit_abstract
        ?circuit_thumbnail
        ?gp_abstract
        ?gp_thumbnail
        ?circuit_name
        ?circuit_location
        ?circuit_country
        ?circuit_lat
        ?circuit_lng

        WHERE {
            :${grandprix_iri} a dbo:GrandPrix .
            OPTIONAL  {:${grandprix_iri} :name ?name }
            OPTIONAL  {:${grandprix_iri} :year ?year}
            OPTIONAL  {:${grandprix_iri} :circuit ?circuit_uri}
            OPTIONAL  {:${grandprix_iri} :wikipedia ?wikipedia_gp_iri }
            OPTIONAL  {:${grandprix_iri} :dateTime [ :date ?gp_date; :time ?gp_time; ] }

            OPTIONAL  { ?circuit_uri a :Circuit;
                :name ?circuit_name ;
                :location ?circuit_location ;
                :country ?circuit_country ;
                :lat ?circuit_lat ;
                :lng ?circuit_lng ;
                :wikipedia ?wikipedia_circuit_iri .
            }
            
            OPTIONAL  { :${grandprix_iri} :fp1 [  :date ?fp1_date; :time ?fp1_time; ] }
            OPTIONAL  { :${grandprix_iri} :fp2 [  :date ?fp2_date; :time ?fp2_time; ] }
            OPTIONAL  { :${grandprix_iri} :fp3 [  :date ?fp3_date; :time ?fp3_time; ] }
            OPTIONAL  { :${grandprix_iri} :qualification [:date ?qualification_date; :time ?qualification_time; ] }
            OPTIONAL  { :${grandprix_iri} :sprint [ :date ?sprint_date; :time ?sprint_time; ] }
     
            OPTIONAL{
                SERVICE <http://dbpedia.org/sparql> {
                  {
                    ?circuit_page_dbr foaf:isPrimaryTopicOf ?wikipedia_circuit_iri
                  }
                  UNION
                  { 
                    ?circuit_page_dbr2 foaf:isPrimaryTopicOf ?wikipedia_circuit_iri ;
                                      dbo:wikiPageRedirects ?circuit_page_dbr.
                  }
                  OPTIONAL{ ?circuit_page_dbr dbo:abstract ?circuit_abstract. FILTER(LANG(?circuit_abstract) = "fr") }
                  OPTIONAL{ ?circuit_page_dbr dbo:thumbnail ?circuit_thumbnail. }
                }
              }
            
            OPTIONAL{
                SERVICE <http://dbpedia.org/sparql> {
                  {
                    ?gp_page_dbr foaf:isPrimaryTopicOf ?wikipedia_gp_iri
                  }
                  UNION
                  { 
                    ?gp_page_dbr2 foaf:isPrimaryTopicOf ?wikipedia_gp_iri ;
                                      dbo:wikiPageRedirects ?gp_page_dbr.
                  }
                  OPTIONAL{ ?gp_page_dbr dbo:abstract ?gp_abstract. FILTER(LANG(?gp_abstract) = "fr") }
                  OPTIONAL{ ?gp_page_dbr dbo:thumbnail ?gp_thumbnail. }
                }
              }
        } ORDER BY DESC(?circuit_abstract) DESC(?circuit_thumbnail) DESC(?gp_abstract) LIMIT 1
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
                    :name [ a :DriverName; :forename ?driver_forename; :surname ?driver_surname ].
            
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

export async function getDriver(driver_iri) {
    const query = `
    PREFIX : <http://127.0.0.1:3333/>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    PREFIX dbo: <http://dbpedia.org/ontology/>
    SELECT * WHERE {
        :${driver_iri} a :Driver ;
        :name [ a :DriverName; :forename ?forename; :surname ?surname ].

        OPTIONAL { :${driver_iri} :dateOfBirth ?dateOfBirth }
        OPTIONAL { :${driver_iri} :code ?code }
        OPTIONAL { :${driver_iri} :nationality ?nationality }
        OPTIONAL { :${driver_iri} :wikipedia ?wikipedia }
      
        OPTIONAL {
            SERVICE <http://dbpedia.org/sparql> {
              ?wikipedia  foaf:primaryTopic ?page_dbo.
              OPTIONAL{
                ?page_dbo dbo:abstract ?abstract.
                FILTER(LANG(?abstract) = "fr")
              }
              OPTIONAL{ ?page_dbo dbo:thumbnail ?thumbnail. }
            }
          }
    
    } 
    `
    console.log(query)
    return requestSPARQL(query)
}

export async function getDriverResults(driver_iri) {
    const query = `
        PREFIX : <http://127.0.0.1:3333/>
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        
        SELECT * WHERE {
        ?result_uri a :Result ;
            :driver :${driver_iri};
        
            :race ?gp_uri ;
            :constructor ?constructor_uri;
        
            :driverNumber ?driverNumber;
            :grid ?grid ;
            :status ?status_uri .
        
        ?status_uri a :Status ;
            :status ?status;
            :type ?status_type.
        
        ?constructor_uri a :Constructor ;
            :name ?constructor.
        
        ?gp_uri a dbo:GrandPrix ;
            :name ?gp_name;
            :year ?gp_year;
            :dateTime [ :date ?gp_date; ] .
        
        OPTIONAL { ?result_uri :positionOrder ?positionOrder ; }
        
        FILTER(LANG(?status) = "fr")
        
        } ORDER BY DESC(?gp_date)
    `
    return requestSPARQL(query)
}

export async function getDriverPointsByYear(driver_iri) {
    const query = `
        PREFIX : <http://127.0.0.1:3333/>
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        
        SELECT ?gp_year ?status_type (count(?status_type) as ?count) (sum(?pt) as ?points)
        WHERE {
        ?result_uri a :Result ;
        :driver :${driver_iri};
        :race ?gp_uri ;
        :points ?pt ;
        :status ?status_uri .
        
        ?gp_uri a dbo:GrandPrix ;
        :year ?gp_year .
        
        ?status_uri a :Status ;
            :type ?status_type.
        
        } GROUP BY ?status_type ?gp_year ORDER BY ?gp_year
    `
    return requestSPARQL(query)
}

export async function getNumberOfGPByCircuit() {
    const query = `
        PREFIX db: <http://dbpedia.org/>
        PREFIX : <http://127.0.0.1:3333/>
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

        SELECT ?gp_name (COUNT(*) as ?nbr_gp)  (SAMPLE(?_latitude) as ?latitude) (SAMPLE(?_longitude) as ?longitude)
        WHERE {
        ?gp_uri a dbo:GrandPrix ; 
            :name ?gp_name ;
            :circuit ?circuit_uri ;
            :year ?gp_year .
        ?circuit_uri a :Circuit ;
            :lat ?_latitude ;
            :lng ?_longitude .
        
        } GROUP BY ?gp_name
        `
    return requestSPARQL(query)
}


export async function getConstructor(constructor_iri) {
    const query = `
    PREFIX : <http://127.0.0.1:3333/>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    PREFIX dbo: <http://dbpedia.org/ontology/>
    SELECT
        ?name
        ?nationality
        ?wikipedia
        ?abstract 
        ?thumbnail
    WHERE {
        :${constructor_iri} a :Constructor ;
        :name ?name ;
        :nationality ?nationality ;
        :wikipedia ?wikipedia .
      
        OPTIONAL {
            SERVICE <http://dbpedia.org/sparql> {
      			{
                    ?page_dbo foaf:isPrimaryTopicOf ?wikipedia
      			}
                UNION
                { 
                    ?page_dbo_2 foaf:isPrimaryTopicOf ?wikipedia ;
                                dbo:wikiPageRedirects ?page_dbo.
                }
      
              OPTIONAL{
                    ?page_dbo dbo:abstract ?abstract.
                    FILTER(LANG(?abstract) = "fr")
              }
              OPTIONAL{ ?page_dbo dbo:thumbnail ?thumbnail. }
            }
          }
    
    } 
    `
    console.log(query)
    return requestSPARQL(query)
}
export async function getConstructorResults() {
    return []
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