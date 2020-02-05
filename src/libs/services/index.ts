import OntoUML2Model from '@libs/model';
import OntoUML2Verification from '@libs/services/verification/verification';

/**
 * Utility class that aggregates functionalities for OntoUML 2 models conformant to `ontouml-schema`. These are functionalities that may exposed as services, such as syntactical verification and model transformation.
 *
 * @author Claudenir Fonseca
 * @author Lucas Basetti
 */
class OntoUML2Services {
  /**
   * Performs syntactical model verification over all OntoUML2 constraints returning an array of IOntoUML objects generated during verification.
   */
  verify(model: OntoUML2Model): IOntoUMLError[] {
    const verification = new OntoUML2Verification();
    verification.run(model);
    return verification.errors;
  }

  // transformToOWL(model: OntoUML2Model): any {
  //   return null;
  // }
}

export default OntoUML2Services;
