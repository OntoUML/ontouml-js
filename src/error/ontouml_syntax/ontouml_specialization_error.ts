import OntoUMLError from '@error/ontouml_error';

class OntoUMLSpecializationError extends OntoUMLError {
  constructor(detail: string, meta?: object) {
    super({
      title: 'OntoUML Specialization Error',
      code: 'ontouml_specialization_error',
      detail,
      links: {
        self:
          'https://github.com/OntoUML/ontouml-js/wiki/OntoUML-Specialization-Table',
      },
      meta,
    });
  }
}

export default OntoUMLSpecializationError;
