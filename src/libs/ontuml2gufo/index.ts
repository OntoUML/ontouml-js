import { N3Writer } from 'n3';
import { ModelManager } from '@libs/model';
import { IClass, IPackage } from '@types';
import { OntoUMLType, ClassStereotype } from '@constants/.';
import {
  transformKind,
  transformQuantityKind,
  transformCollectiveKind,
  transformSubkind,
  transformRole,
  transformPhase,
  transformCategory,
  transformMixin,
  transformRoleMixin,
  transformPhaseMixin,
  transformRelatorKind,
  transformModeKind,
  transformQualityKind,
} from './class_stereotype_functions';

const N3 = require('n3');
const { DataFactory } = N3;
const { namedNode, literal, quad } = DataFactory;

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

  async transformOntoUML2GUFO(baseIRI: string): Promise<string> {
    const writer = new N3.Writer({
      format: 'Turtle',
      prefixes: {
        ['']: `${baseIRI}#`,
        gufo: 'http://purl.org/nemo/gufo#',
        rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
        rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
        owl: 'http://www.w3.org/2002/07/owl#',
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

    await this.transformOntoUMLClasses2GUFO(writer);

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
      this.transformDisjointClasses(writer, classes),
      this.transformClassesByStereotype(writer, classes),
    ]);

    return true;
  }

  /**
   * Transform classes of same stereotype using owl:AllDisjointClasses
   */
  async transformDisjointClasses(
    writer: N3Writer,
    classes: IClass[],
  ): Promise<boolean> {
    const disjointStereotypes = [
      ClassStereotype.KIND,
      ClassStereotype.QUANTITY,
      ClassStereotype.COLLECTIVE,
      ClassStereotype.RELATOR,
      ClassStereotype.MODE,
      ClassStereotype.QUALITY,
    ];

    for (let i = 0; i < disjointStereotypes.length; i += 1) {
      const stereotype = disjointStereotypes[i];
      const stereotypeClasses = classes
        .filter(({ stereotypes }: IClass) => stereotypes[0] === stereotype)
        .map(({ id }: IClass) => namedNode(`:${id}`));

      if (stereotypeClasses.length > 0) {
        await writer.addQuad(
          quad(
            writer.blank(
              namedNode('rdf:type'),
              namedNode('owl:AllDisjointClasses'),
            ),
            namedNode('owl:members'),
            writer.list(stereotypeClasses),
          ),
        );
      }
    }

    return true;
  }

  /**
   * Transform classes by its stereotypes
   */
  async transformClassesByStereotype(
    writer: N3Writer,
    classes: IClass[],
  ): Promise<boolean> {
    const transformStereotypeFunction = {
      [ClassStereotype.KIND]: transformKind,
      [ClassStereotype.QUANTITY]: transformQuantityKind,
      [ClassStereotype.COLLECTIVE]: transformCollectiveKind,
      [ClassStereotype.SUBKIND]: transformSubkind,
      [ClassStereotype.ROLE]: transformRole,
      [ClassStereotype.PHASE]: transformPhase,
      [ClassStereotype.CATEGORY]: transformCategory,
      [ClassStereotype.MIXIN]: transformMixin,
      [ClassStereotype.ROLE_MIXIN]: transformRoleMixin,
      [ClassStereotype.PHASE_MIXIN]: transformPhaseMixin,
      [ClassStereotype.RELATOR]: transformRelatorKind,
      [ClassStereotype.MODE]: transformModeKind,
      [ClassStereotype.QUALITY]: transformQualityKind,
    };

    for (let i = 0; i < classes.length; i += 1) {
      const classElement = classes[i];
      const { id, name, stereotypes } = classElement;
      const stereotype = stereotypes[0];

      if (
        stereotype &&
        Object.keys(transformStereotypeFunction).includes(stereotype)
      ) {
        await writer.addQuads([
          quad(
            namedNode(`:${id}`),
            namedNode('rdf:type'),
            namedNode('owl:Class'),
          ),
          quad(
            namedNode(`:${id}`),
            namedNode('rdf:type'),
            namedNode('owl:NamedIndividual'),
          ),
          quad(namedNode(`:${id}`), namedNode('rdfs:label'), literal(name)),
        ]);

        const quads = transformStereotypeFunction[stereotype](classElement);
        await writer.addQuads(quads);
      }
    }

    return true;
  }
}
