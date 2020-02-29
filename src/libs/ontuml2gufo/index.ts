import { N3Writer } from 'n3';
import { ModelManager } from '@libs/model';
import {
  IClass,
  IPackage,
  IGeneralizationSet,
  IGeneralization,
  IRelation,
} from '@types';
import { OntoUMLType } from '@constants/.';
import {
  transformDisjointClasses,
  transformClassesByStereotype,
} from './class_functions';
import { transformRelationsByStereotype } from './relation_functions';

const N3 = require('n3');
const { DataFactory } = N3;
const { namedNode, quad } = DataFactory;

type Options = {
  baseIRI: string;
  format?: string;
};

/**
 * Utility class for transform OntoUML models in OWL using the gUFO ontology
 *
 * @author Claudenir Fonseca
 * @author Lucas Bassetti
 */
export class OntoUML2GUFO {
  model: IPackage;

  constructor(model: ModelManager) {
    this.model = model.rootPackage;
  }

  async transformOntoUML2GUFO(options: Options): Promise<string> {
    const { baseIRI, format } = options;

    const writer = new N3.Writer({
      format: format || 'Turtle',
      prefixes: {
        ['']: `${baseIRI}#`,
        gufo: 'http://purl.org/nemo/gufo#',
        rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
        rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
        owl: 'http://www.w3.org/2002/07/owl#',
        xsd: 'http://www.w3.org/2001/XMLSchema#',
      },
    });

    writer.addQuads([
      quad(
        namedNode(baseIRI),
        namedNode('rdf:type'),
        namedNode('owl:Ontology'),
      ),
      quad(namedNode(baseIRI), namedNode('owl:imports'), namedNode('gufo:')),
    ]);

    await Promise.all([
      this.transformOntoUMLClasses2GUFO(writer),
      this.transformGeneralizationSets(writer),
      this.transformOntoUMLRelations2GUFO(writer),
    ]);

    return await new Promise<string>((resolve: (result: string) => null) => {
      writer.end((error: any, result: string) => {
        if (error) {
          console.log(error);
        }

        resolve(result);
      });
    });
  }

  /**
   * Main method to transform OntoUML classes in gUFO. The method will be responsable to run different class transformations.
   */
  async transformOntoUMLClasses2GUFO(writer: N3Writer) {
    const classes = this.model.getAllContentsByType([
      OntoUMLType.CLASS_TYPE,
    ]) as IClass[];

    await Promise.all([
      transformDisjointClasses(writer, classes),
      transformClassesByStereotype(writer, classes),
    ]);

    return true;
  }

  /**
   * Main method to transform OntoUML relations in gUFO. The method will be responsable to run different relations transformations.
   */
  async transformOntoUMLRelations2GUFO(writer: N3Writer) {
    const relations = this.model.getAllContentsByType([
      OntoUMLType.RELATION_TYPE,
    ]) as IRelation[];

    await transformRelationsByStereotype(writer, relations);

    return true;
  }

  /**
   * The method will be responsable to parse all properties (disjoint, complete) of generalization sets.
   */
  async transformGeneralizationSets(writer: N3Writer) {
    const generalizationSets = this.model.getAllContentsByType([
      OntoUMLType.GENERALIZATION_SET_TYPE,
    ]) as IGeneralizationSet[];

    for (let i = 0; i < generalizationSets.length; i += 1) {
      const generalizationSet = generalizationSets[i];
      const classGeneralizations = (<IGeneralization[]>(
        generalizationSet.generalizations
      )).filter(
        (generalization: IGeneralization) =>
          generalization.specific.type === OntoUMLType.CLASS_TYPE,
      );
      const parent = classGeneralizations[0].general;
      const classes = classGeneralizations.map(
        (generalization: IGeneralization) => generalization.specific,
      );
      const classNodes = classes.map((classElement: IClass) =>
        namedNode(`:${classElement.id}`),
      );

      // check if has at least 2 classes to avoid insconsistence
      if (classNodes.length > 1) {
        // add disjoint
        if (generalizationSet.isDisjoint) {
          await writer.addQuad(
            writer.blank(
              namedNode('rdf:type'),
              namedNode('owl:AllDisjointClasses'),
            ),
            namedNode('owl:members'),
            writer.list(classNodes),
          );
        }

        // add complete
        if (generalizationSet.isComplete) {
          await writer.addQuad(
            namedNode(`:${parent.id}`),
            namedNode('owl:equivalentClass'),
            writer.blank([
              {
                predicate: namedNode('rdf:type'),
                object: namedNode('owl:Class'),
              },
              {
                predicate: namedNode('owl:unionOf'),
                object: writer.list(classNodes),
              },
            ]),
          );
        }
      }
    }

    return true;
  }
}
