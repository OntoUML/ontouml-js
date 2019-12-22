import OntoUMLParser from './services/ontouml_parser';
import OntoUMLSyntax from './services/ontouml_syntax';

class OntoUMLModel {
  // OntoUMLParser
  getClasses: () => IStructuralElement[];
  getClass: (classId: string) => IStructuralElement[];
  getClassParents: (classId: string) => IStructuralElement[];
  getClassChildren: (classId: string) => IStructuralElement[];
  getGeneralizationLinksFromGeneralClass: (
    classId: string,
  ) => IStructuralElement[];
  getGeneralizationLinksFromSpecificClass: (
    classId: string,
  ) => IStructuralElement[];
  getRelations: () => IStructuralElement[];
  getRelation: (relationUri: string) => IStructuralElement;
  getRelationSourceClassURI: (relationUri: string) => string;
  getRelationTargetClassURI: (relationUri: string) => string;
  getRelationSourceProperty: (relationUri: string) => IProperty;
  getRelationTargetProperty: (relationUri: string) => IProperty;
  getVersion: () => string;
  isValid: () => boolean;

  // OntoUMLSyntax
  verify: () => Promise<IOntoUMLError[]>;

  constructor(model: IModel) {
    try {
      const parser = new OntoUMLParser(model);
      const syntax = new OntoUMLSyntax(parser);

      const serviceMethods = [
        {
          service: parser,
          serviceClass: OntoUMLParser,
          ignoreMethods: ['getStructuralElements'],
        },
        {
          service: syntax,
          serviceClass: OntoUMLSyntax,
          ignoreMethods: [],
        },
      ];

      for (const { service, serviceClass, ignoreMethods } of serviceMethods) {
        const methods = [
          ...Object.getOwnPropertyNames(service),
          ...Object.getOwnPropertyNames(serviceClass.prototype),
        ];
        const ignore = ['constructor', ...ignoreMethods];

        for (const method of methods) {
          if (
            !ignore.includes(method) &&
            typeof service[method] === 'function'
          ) {
            this[method] = service[method].bind(service);
          }
        }
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default OntoUMLModel;
