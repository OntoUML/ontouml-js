import { Project, Package, Relation } from '@libs/ontouml';
import { Cardinality } from '@libs/ontouml/model/cardinality';
import { Class } from '@libs/ontouml/model/class';
import { Decoratable } from '@libs/ontouml/model/decoratable';
import { Generalization } from '@libs/ontouml/model/generalization';
import { GeneralizationSet } from '@libs/ontouml/model/generalization_set';
import { OntologicalNature } from '@libs/ontouml/model/natures';
import { AggregationKind, Property } from '@libs/ontouml/model/property';
import { OntoumlElement } from '@libs/ontouml/ontouml_element';

import { Quad, Writer } from 'n3';
import { Service, ServiceIssue } from '..';

const N3 = require('n3');
const { namedNode, quad, literal, blankNode } = N3.DataFactory;

/**
 *
 * @author Tiago Prince Sales
 *
 */
export class Ontouml2Owl implements Service {
  project: Project;
  owlCode: string;
  writer: Writer;
  baseUri: string;
  basePrefix: string;

  constructor(project: Project, baseUri?: string, basePrefix?: string) {
    this.project = project;
    this.baseUri = baseUri || 'http://ontouml.org/';
    this.basePrefix = basePrefix || 'ontouml';

    this.writer = new N3.Writer({
      format: 'N-Triple',
      prefixes: {
        [this.basePrefix]: this.baseUri,
        ontouml: 'https://purl.org/ontouml-metamodel#',
        rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
        rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
        owl: 'http://www.w3.org/2002/07/owl#',
        xsd: 'http://www.w3.org/2001/XMLSchema#'
      }
    });
  }

  run(): { result: any; issues?: ServiceIssue[] } {
    this.transform();

    return {
      result: this.owlCode
    };
  }

  transform(): boolean {
    try {
      this.transformClasses();
      this.transformGeneralizations();
      this.transformGeneralizationSets();
      this.transformRelations();
      this.transformPackages();
      // TODO: Continue here
      // this.transformDiagrams();
      // this.transformClassViews();
      // this.transformRelationViews();
      // this.transformGeneralizationViews();
      // this.transformGeneralizationSetViews();

      this.writer.end((error, result) => {
        if (error) throw error;
        this.owlCode = result;
        console.log(result);
      });
    } catch (error) {
      console.log(error);
      console.log('An error occurred while transforming the model to ontouml-schema-owl.');
      throw error;
    }

    return true;
  }

  transformClasses() {
    const classes = this.project.getAllClasses();

    for (const c of classes) {
      this.transformClass(c);
    }

    return true;
  }

  transformClass(clazz: Class) {
    const classUri = this.getUri(clazz);
    this.writer.addQuad(namedNode(classUri), namedNode('rdf:type'), namedNode('ontouml:Class'));

    this.transformStereotype(clazz);

    for (const nature of clazz.restrictedTo) {
      this.writer.addQuad(namedNode(classUri), namedNode('ontouml:restrictedTo'), namedNode(this.getNatureUri(nature)));
    }

    this.writer.addQuad(
      namedNode(classUri),
      namedNode('ontouml:isAbstract'),
      literal(clazz.isAbstract, namedNode('xsd:boolean'))
    );

    this.writer.addQuad(namedNode(classUri), namedNode('ontouml:isDerived'), literal(clazz.isDerived, namedNode('xsd:boolean')));

    this.writer.addQuad(
      namedNode(classUri),
      namedNode('ontouml:isExtensional'),
      literal(clazz.isExtensional, namedNode('xsd:boolean'))
    );

    this.writer.addQuad(
      namedNode(classUri),
      namedNode('ontouml:isPowertype'),
      literal(clazz.isPowertype, namedNode('xsd:boolean'))
    );

    this.writer.addQuad(namedNode(classUri), namedNode('ontouml:order'), literal(clazz.order, namedNode('xsd:positiveInteger')));

    this.transformName(clazz);
    this.transformDescription(clazz);

    for (const attr of clazz.properties) {
      const attrUri = this.getUri(attr);
      this.writer.addQuad(namedNode(classUri), namedNode('ontouml:attribute'), namedNode(attrUri));

      this.transformProperty(attr);
    }
  }

  transformRelations() {
    const relations = this.project.getAllRelations();

    for (const r of relations) {
      this.transformRelation(r);
    }
  }

  transformRelation(rel: Relation) {
    this.transformName(rel);
    this.transformDescription(rel);

    const relUri = this.getUri(rel);
    this.writer.addQuad(namedNode(relUri), namedNode('rdf:type'), namedNode('ontouml:Relation'));

    this.transformStereotype(rel);

    this.writer.addQuad(namedNode(relUri), namedNode('ontouml:isDerived'), literal(rel.isDerived, namedNode('xsd:boolean')));

    if (rel.isBinary()) {
      const source = rel.getSourceEnd();
      const sourceUri = this.getUri(source);
      this.writer.addQuad(namedNode(relUri), namedNode('ontouml:sourceEnd'), namedNode(sourceUri));

      const target = rel.getTargetEnd();
      const targetUri = this.getUri(target);
      this.writer.addQuad(namedNode(relUri), namedNode('ontouml:targetEnd'), namedNode(targetUri));
    }

    for (const prop of rel.properties) {
      const propUri = this.getUri(prop);
      this.writer.addQuad(namedNode(relUri), namedNode('ontouml:relationEnd'), namedNode(propUri));
      this.transformProperty(prop);
    }
  }

  transformGeneralizations() {
    const generalizations = this.project.getAllGeneralizations();

    for (const gen of generalizations) {
      this.transformGeneralization(gen);
    }
  }

  transformGeneralization(gen: Generalization) {
    this.transformName(gen);
    this.transformDescription(gen);

    const genUri = this.getUri(gen);
    this.writer.addQuad(namedNode(genUri), namedNode('rdf:type'), namedNode('ontouml:Generalization'));

    const generalUri = this.getUri(gen.general);
    this.writer.addQuad(namedNode(genUri), namedNode('ontouml:general'), namedNode(generalUri));

    const specificUri = this.getUri(gen.specific);
    this.writer.addQuad(namedNode(genUri), namedNode('ontouml:specific'), namedNode(specificUri));
  }

  transformGeneralizationSets() {
    const generalizationSets = this.project.getAllGeneralizationSets();

    for (const gs of generalizationSets) {
      this.transformGeneralizationSet(gs);
    }
  }

  transformGeneralizationSet(gs: GeneralizationSet) {
    this.transformName(gs);
    this.transformDescription(gs);

    const gsUri = this.getUri(gs);
    this.writer.addQuad(namedNode(gsUri), namedNode('rdf:type'), namedNode('ontouml:GeneralizationSet'));

    this.writer.addQuad(namedNode(gsUri), namedNode('ontouml:isComplete'), literal(gs.isComplete, namedNode('xsd:boolean')));
    this.writer.addQuad(namedNode(gsUri), namedNode('ontouml:isDisjoint'), literal(gs.isDisjoint, namedNode('xsd:boolean')));

    if (gs.categorizer) {
      const categorizerUri = this.getUri(gs.categorizer);
      this.writer.addQuad(namedNode(gsUri), namedNode('ontouml:categorizer'), namedNode(categorizerUri));
    }

    for (const gen of gs.generalizations) {
      const genUri = this.getUri(gen);
      this.writer.addQuad(namedNode(gsUri), namedNode('ontouml:generalization'), namedNode(genUri));
    }
  }

  transformPackages() {
    const packages = this.project.getAllPackages();

    for (const pkg of packages) {
      this.transformPackage(pkg);
    }
  }

  transformPackage(pkg: Package) {
    this.transformName(pkg);
    this.transformDescription(pkg);

    const pkgUri = this.getUri(pkg);
    this.writer.addQuad(namedNode(pkgUri), namedNode('rdf:type'), namedNode('ontouml:Package'));

    for (const ele of pkg.contents) {
      const eleUri = this.getUri(ele);
      this.writer.addQuad(namedNode(pkgUri), namedNode('ontouml:containsModelElement'), namedNode(eleUri));
    }
  }

  transformProperty(prop: Property) {
    const propUri = this.getUri(prop);
    this.writer.addQuad(namedNode(propUri), namedNode('rdf:type'), namedNode('ontouml:Property'));

    this.transformStereotype(prop);
    this.transformCardinality(prop);

    this.transformName(prop);
    this.transformDescription(prop);

    this.writer.addQuad(namedNode(propUri), namedNode('ontouml:isDerived'), literal(prop.isDerived, namedNode('xsd:boolean')));
    this.writer.addQuad(namedNode(propUri), namedNode('ontouml:isReadOnly'), literal(prop.isReadOnly, namedNode('xsd:boolean')));
    this.writer.addQuad(namedNode(propUri), namedNode('ontouml:isOrdered'), literal(prop.isOrdered, namedNode('xsd:boolean')));

    const aggUri = this.getAggregationKindUri(prop.aggregationKind);
    this.writer.addQuad(namedNode(propUri), namedNode('ontouml:aggregationKind'), namedNode(aggUri));

    if (prop.propertyType) {
      const typeUri = this.getUri(prop.propertyType);
      this.writer.addQuad(namedNode(propUri), namedNode('ontouml:propertyType'), namedNode(typeUri));
    }

    for (const subsetted of prop.subsettedProperties) {
      const subUri = this.getUri(subsetted);
      this.writer.addQuad(namedNode(propUri), namedNode('ontouml:subsetsProperty'), namedNode(subUri));
    }

    for (const redefined of prop.redefinedProperties) {
      const redUri = this.getUri(redefined);
      this.writer.addQuad(namedNode(propUri), namedNode('ontouml:redefinesProperty'), namedNode(redUri));
    }
  }

  transformCardinality(prop: Property) {
    const cardinality = prop.cardinality;
    if (!cardinality || !cardinality.value) return;

    const propUri = this.getUri(prop);
    const cardUri = prop.id + '_cardinality';

    this.writer.addQuad(namedNode(propUri), namedNode('ontouml:cardinality'), blankNode(cardUri));
    this.writer.addQuad(blankNode(cardUri), namedNode('rdf:type'), namedNode('ontouml:Cardinality'));
    this.writer.addQuad(blankNode(cardUri), namedNode('ontouml:cardinalityValue'), literal(cardinality.value));

    if (cardinality.isValid()) {
      this.writer.addQuad(blankNode(cardUri), namedNode('ontouml:lowerBound'), literal(cardinality.lowerBound));
      this.writer.addQuad(blankNode(cardUri), namedNode('ontouml:upperBound'), literal(cardinality.upperBound));
    }
  }

  transformStereotype(elem: Decoratable<any>) {
    if (elem.stereotype == null) return;

    const subject = this.getUri(elem);
    const stereotypeUri = 'ontouml:' + elem.stereotype;
    this.writer.addQuad(namedNode(subject), namedNode('ontouml:stereotype'), namedNode(stereotypeUri));
  }

  transformName(elem: OntoumlElement) {
    const subject = this.getUri(elem);

    for (const entry of elem.name.entries()) {
      this.writer.addQuad(namedNode(subject), namedNode('ontouml:name'), literal(entry[1], entry[0]));
    }
  }

  transformDescription(elem: OntoumlElement) {
    const subject = this.getUri(elem);

    for (const entry of elem.description.entries()) {
      this.writer.addQuad(namedNode(subject), namedNode('ontouml:description'), literal(entry[1], entry[0]));
    }
  }

  getNatureUri(nature: OntologicalNature) {
    const map = {
      [OntologicalNature.functional_complex]: 'functionalComplex',
      [OntologicalNature.collective]: 'collective',
      [OntologicalNature.quantity]: 'quantity',
      [OntologicalNature.relator]: 'relator',
      [OntologicalNature.intrinsic_mode]: 'intrinsicMode',
      [OntologicalNature.extrinsic_mode]: 'extrinsicMode',
      [OntologicalNature.quality]: 'quality',
      [OntologicalNature.event]: 'event',
      [OntologicalNature.situation]: 'situation',
      [OntologicalNature.type]: 'type',
      [OntologicalNature.abstract]: 'abstract'
    };

    return 'ontouml:' + map[nature];
  }

  getAggregationKindUri(agg: AggregationKind) {
    const map = {
      [AggregationKind.COMPOSITE]: 'composite',
      [AggregationKind.SHARED]: 'shared',
      [AggregationKind.NONE]: 'none'
    };

    return 'ontouml:' + map[agg];
  }

  getUri(element: OntoumlElement): string {
    return this.basePrefix + ':' + element.id;
  }
}
