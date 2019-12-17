import OntoUMLError from '@error/ontouml_error';

class OntoUMLParserError extends OntoUMLError {
  constructor(model: IModel, detail: string) {
    super({
      title: 'OntoUML Parser Error',
      code: 'ontouml_parser_error',
      detail,
      links: {
        self: 'https://github.com/OntoUML/ontouml-js/wiki/OntoUML-Parser',
      },
      meta: { model },
    });
  }
}

export default OntoUMLParserError;
