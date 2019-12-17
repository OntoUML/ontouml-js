import OntoUMLError from '@error/ontouml_error';

class OntoUMLStereotypeError extends OntoUMLError {
  constructor(structuralElement: IStructuralElement) {
    const { stereotypes, name, uri } = structuralElement;
    const elementName = name || uri;
    let detail = '';

    if (!stereotypes || stereotypes.length === 0) {
      detail = `${structuralElement['@type']} "${elementName}" must contain 1 stereotype.`;
    } else if (stereotypes.length === 1) {
      detail = `The stereotype ${stereotypes[0]} of ${structuralElement['@type']} "${elementName}" is not a valid OntoUML stereotype.`;
    } else {
      detail = `${structuralElement['@type']} "${elementName}" must contain only 1 stereotype.`;
    }

    super({
      title: 'OntoUML Stereotype Error',
      code: 'ontouml_stereotype_error',
      detail,
      links: {
        self:
          'https://github.com/OntoUML/ontouml-js/wiki/OntoUML-Syntax-Constraints',
      },
      meta: { structuralElement },
    });
  }
}

export default OntoUMLStereotypeError;
