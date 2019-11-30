import OntoUMLParser from '../ontouml_parser';

class OntoUMLSyntax {
  private _parser: OntoUMLParser;

  constructor(parser: OntoUMLParser) {
    this._parser = parser;
  }

  get parser() {
    return this._parser;
  }
}

export default OntoUMLSyntax;
