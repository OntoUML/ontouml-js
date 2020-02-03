import OntoUML2Model from '@libs/ontouml2';

/**
 * Utility class that aggregates functionalities for OntoUML 2 models conformant to `ontouml-schema`. These are functionalities that may exposed as services.
 *
 * @author Claudenir Fonseca
 * @author Lucas Basetti
 */
class OntoUML2Services {
  constructor() {}

  /**
   *
   */
  verify(model: OntoUML2Model): IOntoUMLError[] {
    return null;
  }

  transformToOWL(model: OntoUML2Model): any {
    return null;
  }
}

export default OntoUML2Services;
