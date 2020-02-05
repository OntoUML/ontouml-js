import OntoUML2Model from '@libs/model/model_manager';
import memoizee from 'memoizee';

/**
 * Utility class that performs syntactical verification of OntoUML2 models conformant to the `ontouml-schema` definition.
 *
 * @author Claudenir Fonseca
 * @author Lucas Bassetti
 */
class OntoUML2Verification {
  errors: IOntoUMLError[];

  constructor() {
    // Initialize variables
    this.errors = [];

    // Register function for memoization
    this.checkMinimalClassFormat = memoizee(this.checkMinimalClassFormat);
  }

  /**
   * Assynchronous function that waits for the execution of all constraint verifications before returning.
   *
   * @param model - OntoUML2Model object containing a model conformant to the `ontouml-schema`.
   */
  async run(model: OntoUML2Model) {
    this.errors = [];
    const promises = [];
    const classes = model.getClasses();
    // const relations = model.getRelations();
    // const generalizations = model.getGeneralizations();
    // const generalizationSets = model.getGeneralizationSets();
    // const properties = model.getProperties();

    classes.forEach(_class => {
      let error = this.checkMinimallyConsistentClass(_class);

      if (error) {
        this.errors.push(error);
      } else {
        // If minimally consistent, further constraints checks are performed but their results go to an array of Promisse<IOntoUMLError> objects.
      }
    });

    await Promise.all(promises);
  }

  /* Class constraints */

  /**
   *
   * @param _class
   */
  checkMinimallyConsistentClass(_class: IClass): IOntoUMLError {
    return null;
  }

  /**
   *
   * @param _class
   */
  checkMinimalRelationFormat(relation: IRelation): IOntoUMLError {
    return null;
  }
}

export default OntoUML2Verification;
