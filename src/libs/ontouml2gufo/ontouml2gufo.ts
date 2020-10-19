import { ModelManager } from '@libs/model';
import { Quad, Writer } from 'n3';
import { IPackage, IRelation } from '@types';
import { writeDisjointnessAxioms, transformClass } from './class_functions';
import { transformRelation } from './relation_functions';
import {
  getAllAttributes,
  getAllClasses,
  getAllGeneralizations,
  getAllGeneralizationSets,
  getAllRelations
} from './helper_functions';
import Inspector from './inspector';
import Options from './options';
import Issue from './issue';
import { getPrefixes } from './prefix_functions';
import { transformGeneralization } from './generalization_functions';
import { transformAttribute } from './attribute_functions';
import { transformGeneralizationSet } from './generalization_set_functions';
import { transformRelationCardinalities } from './cardinality_functions';
import { transformInverseRelation } from './relations_inverse_functions';
import UriManager from './uri_manager';

const N3 = require('n3');
const { namedNode, quad, literal } = N3.DataFactory;

/**
 * Class that transforms OntoUML models in OWL ontologies aligned with the gUFO ontology.
 *
 * @author Tiago Prince Sales
 * @author Claudenir Fonseca
 * @author Lucas Bassetti
 */
export class Ontouml2Gufo {
  model: IPackage;
  options: Options;
  inspector: Inspector;
  owlCode: string;
  writer: Writer;
  uriManager: UriManager;

  constructor(model: ModelManager, options?: Partial<Options>) {
    this.model = model.rootPackage;
    this.options = options ? new Options(options) : new Options();
    this.inspector = new Inspector(this);
    this.uriManager = new UriManager(this);
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

  getSourceUri(relation: IRelation): string {
    return this.uriManager.getSourceUri(relation);
  }

  getTargetUri(relation: IRelation): string {
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
      this.writePreable();
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

  writePreable() {
    this.writer.addQuads([
      quad(namedNode(this.options.baseIri), namedNode('rdf:type'), namedNode('owl:Ontology')),
      quad(namedNode(this.options.baseIri), namedNode('owl:imports'), namedNode('gufo:'))
    ]);
  }

  transformClasses() {
    const classes = getAllClasses(this.model);

    for (const _class of classes) {
      transformClass(this, _class);
    }

    writeDisjointnessAxioms(this, classes);

    return true;
  }

  transformAttributes() {
    const attributes = getAllAttributes(this.model);

    for (const attribute of attributes) {
      transformAttribute(this, attribute);
    }
  }

  transformRelations() {
    const relations = getAllRelations(this.model);

    for (const relation of relations) {
      transformRelation(this, relation);

      if (this.options.createInverses) {
        transformInverseRelation(this, relation);
      }
    }
  }

  transformCardinalities() {
    const relations = getAllRelations(this.model);
    for (const relation of relations) {
      transformRelationCardinalities(this, relation);
    }

    // const attributes = getAllAttributes(this.model);
    // for (const attribute of attributes) {
    //   transformAttributeCardinality(this, attribute);
    // }
  }

  transformGeneralizations() {
    const generalizations = getAllGeneralizations(this.model);

    for (const gen of generalizations) {
      transformGeneralization(this, gen);
    }
  }

  transformGeneralizationSets() {
    const generalizationSets = getAllGeneralizationSets(this.model);

    for (const genSet of generalizationSets) {
      transformGeneralizationSet(this, genSet);
    }
  }
}
