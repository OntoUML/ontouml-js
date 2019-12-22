import Ajv from 'ajv';
import schema from '@schemas/ontouml.schema.json';
import { OntoUMLParserError } from '@error/ontouml_parser';
import OntoUMLParserClass from './ontouml_parser_class';
import OntoUMLParserGeneralizationLink from './ontouml_parser_generalization_link';
import OntoUMLParserRelation from './ontouml_parser_relation';

class OntoUMLParser {
  private _valid: boolean;

  // OntoUMLParserClass
  getClasses: () => IStructuralElement[];
  getClass: (classId: string) => IStructuralElement;
  getClassParents: (classId: string) => IStructuralElement[];
  getClassChildren: (classId: string) => IStructuralElement[];

  // OntoUMLParserGeneralizationLink
  getGeneralizationLinksFromGeneralClass: (
    classId: string,
  ) => IStructuralElement[];
  getGeneralizationLinksFromSpecificClass: (
    classId: string,
  ) => IStructuralElement[];

  // OntoUMLParserRelation
  getRelations: () => IStructuralElement[];
  getRelation: (relationUri: string) => IStructuralElement;
  getRelationSourceClassURI: (relationUri: string) => string;
  getRelationTargetClassURI: (relationUri: string) => string;
  getRelationSourceProperty: (relationUri: string) => IProperty;
  getRelationTargetProperty: (relationUri: string) => IProperty;

  constructor(model: IModel) {
    const ajv = new Ajv();

    ajv.addMetaSchema(schema, 'OntoUMLModel');

    const isModelValid = ajv.validate('OntoUMLModel', model);

    if (!isModelValid) {
      throw new OntoUMLParserError(model, ajv.errorsText());
    }

    this._valid = isModelValid ? true : false;

    const classParser = new OntoUMLParserClass(model);
    const generalizationLinkParser = new OntoUMLParserGeneralizationLink(model);
    const relationParser = new OntoUMLParserRelation(model);

    const serviceMethods = [
      {
        service: classParser,
        serviceClass: OntoUMLParserClass,
        ignoreMethods: [],
      },
      {
        service: generalizationLinkParser,
        serviceClass: OntoUMLParserGeneralizationLink,
        ignoreMethods: [],
      },
      {
        service: relationParser,
        serviceClass: OntoUMLParserRelation,
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
        if (!ignore.includes(method) && typeof service[method] === 'function') {
          this[method] = service[method].bind(service);
        }
      }
    }
  }

  getVersion(): string {
    const classes = this.getClasses();
    const stereotype =
      classes && classes[0] && classes[0].stereotypes
        ? classes[0].stereotypes[0]
        : '';
    const version = stereotype && stereotype.includes('1.0') ? '1.0' : '2.0';

    return version;
  }

  isValid(): boolean {
    return this._valid;
  }
}

export default OntoUMLParser;
