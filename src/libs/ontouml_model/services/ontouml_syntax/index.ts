import OntoUMLParser from '../ontouml_parser';
import OntoUMLSyntaxEndurants from './ontouml_syntax_endurants';

class OntoUMLSyntax {
  verifyEndurantTypes: () => Promise<IOntoUMLError[]>;

  constructor(parser: OntoUMLParser) {
    const syntaxEndurants = new OntoUMLSyntaxEndurants(parser);

    const serviceMethods = [
      {
        service: syntaxEndurants,
        serviceClass: OntoUMLSyntaxEndurants,
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

  async verify(): Promise<IOntoUMLError[]> {
    return await this.verifyEndurantTypes();
  }
}

export default OntoUMLSyntax;
