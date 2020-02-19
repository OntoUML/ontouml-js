export default `@prefix : <https://example.com#>.
@prefix gufo: <http://purl.org/nemo/gufo#>.
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.
@prefix owl: <http://www.w3.org/2002/07/owl#>.

<https://example.com> rdf:type owl:Ontology;
    owl:imports gufo:.
[ rdf:type owl:AllDisjointClasses ] owl:members (:2uxhBA6AUB0UtArb :j5phBA6AUB0UtAts).
:rw.hBA6AUB0UtArB rdf:type owl:Class, owl:NamedIndividual;
    rdfs:label "Agent";
    rdfs:subClassOf gufo:Endurant;
    rdf:type gufo:Category.
:2uxhBA6AUB0UtArb rdf:type owl:Class, owl:NamedIndividual;
    rdfs:label "Person";
    rdfs:subClassOf gufo:FunctionalComplex;
    rdf:type gufo:Kind.
:j5phBA6AUB0UtAts rdf:type owl:Class, owl:NamedIndividual;
    rdfs:label "Organization";
    rdfs:subClassOf gufo:FunctionalComplex;
    rdf:type gufo:Kind.
:_xThBA6AUB0UtAvg rdf:type owl:Class, owl:NamedIndividual;
    rdfs:label "School";
    rdfs:subClassOf :j5phBA6AUB0UtAts;
    rdf:type gufo:SubKind.
:GDbhBA6AUB0UtAv1 rdf:type owl:Class, owl:NamedIndividual;
    rdfs:label "Student";
    rdfs:subClassOf :2uxhBA6AUB0UtArb;
    rdf:type gufo:Role.
[ rdf:type owl:AllDisjointClasses ] owl:members (:JLnhBA6AUB0UtAwO).
:JLnhBA6AUB0UtAwO rdf:type owl:Class, owl:NamedIndividual;
    rdfs:label "Enrollment";
    rdfs:subClassOf gufo:Relator;
    rdf:type gufo:Kind.
:wukRBA6AUB0UtAxW rdf:type owl:Class, owl:NamedIndividual;
    rdfs:label "Enrollment Date";
    rdfs:subClassOf gufo:Quality;
    rdf:type gufo:Kind.
:h_Y9hA6GAqACnA1t rdf:type owl:Class, owl:NamedIndividual;
    rdfs:label "Sophomore";
    rdfs:subClassOf :GDbhBA6AUB0UtAv1;
    rdf:type gufo:Role.
:cea9hA6GAqACnA2B rdf:type owl:Class, owl:NamedIndividual;
    rdfs:label "Privately Enrolled".
[ rdf:type owl:AllDisjointClasses ] owl:members (:wukRBA6AUB0UtAxW).
:cea9hA6GAqACnA2B rdfs:subClassOf :GDbhBA6AUB0UtAv1;
    rdf:type gufo:Role.
:6XxdhA6GAqACnA0J rdf:type owl:Class, owl:NamedIndividual;
    rdfs:label "Department";
    rdfs:subClassOf :j5phBA6AUB0UtAts;
    rdf:type gufo:SubKind.`;
