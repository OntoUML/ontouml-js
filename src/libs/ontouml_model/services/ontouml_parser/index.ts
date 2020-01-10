import Ajv from 'ajv';
import schema from '@schemas/ontouml.schema.json';
import { OntoUMLParserError } from '@error/ontouml_parser';
import OntoUMLParserClass from './ontouml_parser_class';
import OntoUMLParserGeneralizationLink from './ontouml_parser_generalization_link';

class OntoUMLParser {
  private _valid: boolean;

  // OntoUMLParserClass
  getClasses: () => IElement[];
  getClass: (classId: string) => IElement[];
  getClassParents: (classId: string) => IElement[];
  getClassChildren: (classId: string) => IElement[];

  // OntoUMLParserGeneralizationLink
  getGeneralizationLinksFromGeneralClass: (classId: string) => IElement[];
  getGeneralizationLinksFromSpecificClass: (classId: string) => IElement[];

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

    return stereotype && stereotype.includes('1.0') ? '1.0' : '2.0';
  }

  isValid(): boolean {
    return this._valid;
  }
}

export default OntoUMLParser;
