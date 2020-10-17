import { ModelManager } from '@libs/model';
import { Writer } from 'n3';
import { IPackage } from '@types';
import { writeDisjointnessAxioms, transformClass } from './class_functions';
import { transformRelation } from './relation_functions';
import {
  getAllClasses,
  getAllGeneralizations,
  getAllGeneralizationSets,
  getAllRelations,
  hasAttributes
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

const N3 = require('n3');
const { DataFactory } = N3;
const { namedNode, quad } = DataFactory;
/**
 * Utility class for transform OntoUML models in OWL using the gUFO ontology
 *
 * @author Claudenir Fonseca
 * @author Lucas Bassetti
 * @author Tiago Prince Sales
 */
export class Ontouml2Gufo {
  model: IPackage;
  options: Options;
  inspector: Inspector;
  owlCode: string;
  writer: Writer;

  constructor(model: ModelManager, options?: Partial<Options>) {
    this.model = model.rootPackage;
    this.options = options ? new Options(options) : new Options();
    this.inspector = new Inspector(this.model, this.options);
  }

  getIssues(): Issue[] {
    return this.inspector.issues;
  }

  getOwlCode(): string {
    return this.owlCode;
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
      prefixes: getPrefixes(this.model, this.options)
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
      transformClass(this.writer, _class, this.options);
    }

    writeDisjointnessAxioms(this.writer, classes, this.options);

    return true;
  }

  transformAttributes() {
    const classes = getAllClasses(this.model);

    for (const _class of classes) {
      if (!hasAttributes(_class)) return;

      for (const attribute of _class.properties) {
        transformAttribute(this.writer, _class, attribute, this.options);
      }
    }
  }

  transformRelations() {
    const relations = getAllRelations(this.model);

    for (const relation of relations) {
      transformRelation(this.writer, relation, this.options);

      if (this.options.createInverses) {
        transformInverseRelation(this.writer, relation, this.options);
      }
    }
  }

  transformCardinalities() {
    const relations = getAllRelations(this.model);
    for (const relation of relations) {
      transformRelationCardinalities(this.writer, relation, this.options);
    }
    // const classes = getAllClasses(this.model);
    // for (const _class of classes) {
    //   if (!hasAttributes(_class)) return;
    //   for (const attribute of _class.properties) {
    //     transformAttributeCardinality(this.writer, _class, attribute, this.options);
    //   }
    // }
  }

  transformGeneralizations() {
    const generalizations = getAllGeneralizations(this.model);

    for (const gen of generalizations) {
      transformGeneralization(this.writer, gen, this.options);
    }
  }

  transformGeneralizationSets() {
    const generalizationSets = getAllGeneralizationSets(this.model);

    for (const genSet of generalizationSets) {
      transformGeneralizationSet(this.writer, genSet, this.options);
    }
  }
}
