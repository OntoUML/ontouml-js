// import OntoUMLParser from '../ontouml_parser';
// import OntoUMLSyntaxEndurants from './ontouml_syntax_endurants';
// import OntoUMLSyntaxRelations from './ontouml_syntax_relations';

// class OntoUMLSyntax {
//   verifyEndurantTypes: () => Promise<IOntoUMLError[]>;
//   verifyRelationTypes: () => Promise<IOntoUMLError[]>;

//   constructor(parser: OntoUMLParser) {
//     const syntaxEndurants = new OntoUMLSyntaxEndurants(parser);
//     const syntaxRelations = new OntoUMLSyntaxRelations(parser);

//     const serviceMethods = [
//       {
//         service: syntaxEndurants,
//         serviceClass: OntoUMLSyntaxEndurants,
//         ignoreMethods: [],
//       },
//       {
//         service: syntaxRelations,
//         serviceClass: OntoUMLSyntaxRelations,
//         ignoreMethods: [],
//       },
//     ];

//     for (const { service, serviceClass, ignoreMethods } of serviceMethods) {
//       const methods = [
//         ...Object.getOwnPropertyNames(service),
//         ...Object.getOwnPropertyNames(serviceClass.prototype),
//       ];
//       const ignore = ['constructor', ...ignoreMethods];

//       for (const method of methods) {
//         if (!ignore.includes(method) && typeof service[method] === 'function') {
//           this[method] = service[method].bind(service);
//         }
//       }
//     }
//   }

//   async verify(): Promise<IOntoUMLError[]> {
//     const endurantErros = await this.verifyEndurantTypes();
//     const relationErros = await this.verifyRelationTypes();

//     return [...endurantErros, ...relationErros];
//   }
// }

// export default OntoUMLSyntax;
