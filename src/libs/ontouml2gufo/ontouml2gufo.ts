import { Project, Package, Relation } from '@libs/ontouml';
import {
  Issue,
  Ontouml2GufoOptions,
  Inspector,
  UriManager,
  getPrefixes,
  transformClass,
  writeDisjointnessAxioms,
  transformAttribute,
  transformRelation,
  transformInverseRelation,
  transformRelationCardinalities,
  transformGeneralization,
  transformGeneralizationSet
} from './';

import { Quad, Writer } from 'n3';
import { Service, ServiceIssue } from './..';

const N3 = require('n3');
const { namedNode, quad, literal } = N3.DataFactory;

/**
 * Class that transforms OntoUML models in OWL ontologies aligned with the gUFO ontology.
 *
 * @author Tiago Prince Sales
 * @author Claudenir Fonseca
 * @author Lucas Bassetti
 */
export class Ontouml2Gufo implements Service {
  model: Package;
  options: Ontouml2GufoOptions;
  inspector: Inspector;
  owlCode: string;
  writer: Writer;
  uriManager: UriManager;

  constructor(project: Project, options?: Partial<Ontouml2GufoOptions>);
  constructor(model: Package, options?: Partial<Ontouml2GufoOptions>);
  constructor(project: Project, options?: Partial<Ontouml2GufoOptions>);
  constructor(input: Project | Package, options?: Partial<Ontouml2GufoOptions>);
  constructor(input: Project | Package, options?: Partial<Ontouml2GufoOptions>) {
    if (input instanceof Project) {
      this.model = input.model;
    } else if (input instanceof Package) {
      this.model = input;
    }

    this.options = options ? new Ontouml2GufoOptions(options) : new Ontouml2GufoOptions();
    this.inspector = new Inspector(this);
    this.uriManager = new UriManager(this);

    if (input instanceof Project) {
      this.model = input.model;
    } else if (input instanceof Package) {
      this.model = input;
    }
  }

  getIssues(): Issue[] {
    return this.inspector.issues;
  }

  getOwlCode(): string {
    return this.owlCode;
  }

  getUri(element): string {
    return this.uriManager.getUri(element);
  }

  getInverseRelationUri(element): string {
    return this.uriManager.getInverseRelationUri(element);
  }

  getSourceUri(relation: Relation): string {
    return this.uriManager.getSourceUri(relation);
  }

  getTargetUri(relation: Relation): string {
    return this.uriManager.getTargetUri(relation);
  }

  addQuad(subject, predicate?, object?) {
    if (subject && predicate && object) {
      if (typeof subject === 'string') subject = namedNode(subject);
      if (typeof predicate === 'string') predicate = namedNode(predicate);
      if (typeof object === 'string') object = namedNode(object);

      this.writer.addQuad(subject, predicate, object);
    } else {
      this.writer.addQuad(subject as Quad);
    }
  }

  addLiteralQuad(subject: string, predicate: string, literalValue: string, language?: string) {
    const literalNode = language ? literal(literalValue, language) : literal(literalValue);
    this.addQuad(namedNode(subject), namedNode(predicate), literalNode);
  }

  addQuads(quads: Quad[]) {
    this.writer.addQuads(quads);
  }

  transform(): boolean {
    try {
      this.inspector.run();
    } catch (error) {
      console.log(error);
      console.log('An error occurrence while inspecting the model and the transformation options.');
    }

    try {
      this.initializeWriter();
      this.writePreamble();
      this.transformClasses();
      this.transformGeneralizations();
      this.transformGeneralizationSets();
      this.transformAttributes();
      this.transformRelations();
      this.transformCardinalities();
      this.writer.end((error, result) => {
        if (error) throw error;
        this.owlCode = result;
      });
    } catch (error) {
      console.log(error);
      console.log('An error occurred while transforming the model to gufo.');
      throw error;
    }

    return true;
  }

  initializeWriter() {
    this.writer = new N3.Writer({
      format: this.options.format,
      prefixes: getPrefixes(this)
    });
  }

  writePreamble() {
    this.writer.addQuads([
      quad(namedNode(this.options.baseIri), namedNode('rdf:type'), namedNode('owl:Ontology')),
      quad(namedNode(this.options.baseIri), namedNode('owl:imports'), namedNode('gufo:'))
    ]);
  }

  transformClasses() {
    const classes = this.model.getAllClasses();

    for (const _class of classes) {
      transformClass(this, _class);
    }

    writeDisjointnessAxioms(this, classes);

    return true;
  }

  transformAttributes() {
    const attributes = this.model.getAllAttributes();

    for (const attribute of attributes) {
      transformAttribute(this, attribute);
    }
  }

  transformRelations() {
    const relations = this.model.getAllRelations();

    for (const relation of relations) {
      transformRelation(this, relation);

      if (this.options.createInverses) {
        transformInverseRelation(this, relation);
      }
    }
  }

  transformCardinalities() {
    const relations = this.model.getAllRelations();
    for (const relation of relations) {
      transformRelationCardinalities(this, relation);
    }

    // const attributes = getAllAttributes(this.model);
    // for (const attribute of attributes) {
    //   transformAttributeCardinality(this, attribute);
    // }
  }

  transformGeneralizations() {
    const generalizations = this.model.getAllGeneralizations();

    for (const gen of generalizations) {
      transformGeneralization(this, gen);
    }
  }

  transformGeneralizationSets() {
    const generalizationSets = this.model.getAllGeneralizationSets();

    for (const genSet of generalizationSets) {
      transformGeneralizationSet(this, genSet);
    }
  }

  // static run(_package: Package, options?: Partial<Options>): { output: string; issues: Issue[] } {
  //   const ontouml2gufo = new Ontouml2Gufo(_package, options);

  //   ontouml2gufo.transform();

  //   return { output: ontouml2gufo.getOwlCode(), issues: ontouml2gufo.getIssues() };
  // }

  run(): { result: any; issues?: ServiceIssue[] } {
    this.transform();

    return {
      result: this.getOwlCode(),
      issues: this.getIssues() || undefined
    };
  }
}
