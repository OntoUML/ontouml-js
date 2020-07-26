import OntoUMLError from '@error/ontouml_error';

class OntoUMLRelationError extends OntoUMLError {
  constructor(detail: string, meta?: object) {
    super({
      title: 'OntoUML Relation Error',
      code: 'ontouml_relation_error',
      detail,
      links: {
        self: 'https://github.com/OntoUML/ontouml-js/wiki/OntoUML-Relationship-Table',
      },
      meta,
    });
  }
}

export default OntoUMLRelationError;
