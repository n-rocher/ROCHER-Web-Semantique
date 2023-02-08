import axios from "axios";

export function getGrandPrix() {

    var bodyFormData = new URLSearchParams();
    bodyFormData.append('query', `
    PREFIX dbo: <http://dbpedia.org/ontology/>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX : <http://127.0.0.1:3333/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT * WHERE {
      ?x a dbo:GrandPrix ;
      :dateTime [ a :DateTime ; :date ?dateTime ] ;
      :year ?year ;
      :name ?name  .
   
    } ORDER BY DESC(?dateTime)  LIMIT 10
    `);

    axios({
        method: 'post',
        url: 'http://localhost:3030/formula-1/query',
        data: bodyFormData,
    }).then(function (response) {
        console.log(response)
    });
}