import { N3Writer } from 'n3';
import { ModelManager } from '@libs/model';
import {
  IClass,
  IPackage,
  IGeneralizationSet,
  IGeneralization,
  IRelation,
  IOntoUML2GUFOOptions,
  IOntoUML2GUFOResult,
} from '@types';
import { OntoUMLType } from '@constants/.';
import { DefaultPrefixes } from './constants';
import { createDisjointnessContraints, transformClassesByStereotype } from './class_functions';
import { transformRelations } from './relation_functions';
import { getURI, getPackagePrefixes, getBasePrefix } from './helper_functions';
import URIManager from './uri_manager';
import { runPreAnalysis } from './pre_analysis';

const N3 = require('n3');
const { DataFactory } = N3;
const { namedNode, quad } = DataFactory;

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

  async transformOntoUML2GUFO({
    baseIRI,
    basePrefix,
    createInverses = false,
    createObjectProperty = true,
    customElementMapping = {},
    customPackageMapping = {},
    format = 'Turtle',
    preAnalysis = false,
    prefixPackages,
    uriFormatBy = 'name' ,
  }: IOntoUML2GUFOOptions): Promise<IOntoUML2GUFOResult> {
    const options = {
      baseIRI,
      basePrefix,
      createInverses,
      createObjectProperty,
      customElementMapping,
      customPackageMapping,
      format,
      preAnalysis,
      prefixPackages,
      uriFormatBy,
      uriManager: new URIManager(),
    };

    let analysis = [];

    if (preAnalysis) {
      analysis = await runPreAnalysis(this.model, options);
    }

    // TODO: Replace with getAllPackages()
    const packages = this.model.getAllContentsByType([OntoUMLType.PACKAGE_TYPE]) as IPackage[];

    const writer = new N3.Writer({
      format,
      prefixes: {
        ... await getBasePrefix(options),
        ... await getPackagePrefixes(packages, options),
        ...DefaultPrefixes,
      },
    });

    writer.addQuads([
      quad(namedNode(baseIRI), namedNode('rdf:type'), namedNode('owl:Ontology')),
      quad(namedNode(baseIRI), namedNode('owl:imports'), namedNode('gufo:')),
    ]);

    await Promise.all([
      this.transformClasses(writer, options),
      this.transformGeneralizationSets(writer, options),
      this.transformRelations(writer, options),
    ]);

    return await new Promise<IOntoUML2GUFOResult>((resolve: (result: IOntoUML2GUFOResult) => void) => {
      writer.end((error: any, result: string) => {
        if (error) {
          console.log(error);
        }

        resolve({ preAnalysis: analysis, model: result });
      });
    });
  }

  /**
   * Main method to transform OntoUML classes in gUFO. The method will be responsable to run different class transformations.
   */
  async transformClasses(writer: N3Writer, options: IOntoUML2GUFOOptions) {
    // TODO: Replace for getAllClasses()
    const classes = this.model.getAllContentsByType([OntoUMLType.CLASS_TYPE]) as IClass[];

    await Promise.all([
      transformClassesByStereotype(writer, classes, options),
      createDisjointnessContraints(writer, classes, options),
    ]);

    return true;
  }

  /**
   * Main method to transform OntoUML relations in gUFO. The method will be responsable to run different relations transformations.
   */
  async transformRelations(writer: N3Writer, options: IOntoUML2GUFOOptions) {
    const relations = this.model.getAllContentsByType([OntoUMLType.RELATION_TYPE]) as IRelation[];

    await transformRelations(writer, relations, options);

    return true;
  }

  /**
   * The method will be responsable to parse all properties (disjoint, complete) of generalization sets.
   */
  async transformGeneralizationSets(writer: N3Writer, options: IOntoUML2GUFOOptions) {
    const generalizationSets = this.model.getAllContentsByType([
      OntoUMLType.GENERALIZATION_SET_TYPE,
    ]) as IGeneralizationSet[];

    for (let i = 0; i < generalizationSets.length; i += 1) {
      const generalizationSet = generalizationSets[i];

      if (!generalizationSet.generalizations) continue;

      const classGeneralizations = (<IGeneralization[]>generalizationSet.generalizations).filter(
        (generalization: IGeneralization) => generalization.specific.type === OntoUMLType.CLASS_TYPE,
      );
      const parent = classGeneralizations[0].general as IClass;
      const classes = classGeneralizations.map((generalization: IGeneralization) => generalization.specific);
      const classNodes = classes.map((classElement: IClass) => {
        const uri = getURI({ element: classElement, options });

        return namedNode(uri);
      });

      // check if has at least 2 classes to avoid insconsistence
      if (classNodes.length > 1) {
        // add disjoint
        if (generalizationSet.isDisjoint) {
          await writer.addQuad(
            writer.blank(namedNode('rdf:type'), namedNode('owl:AllDisjointClasses')),
            namedNode('owl:members'),
            writer.list(classNodes),
          );
        }

        // add complete
        if (generalizationSet.isComplete) {
          const parentUri = getURI({ element: parent, options });

          await writer.addQuad(
            namedNode(parentUri),
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
