export default `@prefix : <https://example.com#>.
@prefix gufo: <http://purl.org/nemo/gufo#>.
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.
@prefix owl: <http://www.w3.org/2002/07/owl#>.

<https://example.com> rdf:type owl:Ontology;
    owl:imports gufo:.
[ rdf:type owl:AllDisjointClasses ] owl:members (:Q5deWA6AUB0UtAWn).
:qJdeWA6AUB0UtAWm rdf:type owl:Class, owl:NamedIndividual;
    rdfs:label "Headache";
    rdfs:subClassOf gufo:IntrinsicMode;
    rdf:type gufo:Kind.
:Q5deWA6AUB0UtAWn rdf:type owl:Class, owl:NamedIndividual;
    rdfs:label "Person";
    rdfs:subClassOf gufo:FunctionalComplex;
    rdf:type gufo:Kind.
[ rdf:type owl:AllDisjointClasses ] owl:members (:qJdeWA6AUB0UtAWm).`;
