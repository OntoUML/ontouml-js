import { expect, it } from '@jest/globals';
import { Project, serializationUtils } from '../src';

it('Test the example presented in the "Usage" section of the README file', () =>
  expect(() => {
    // Every OntoUML element can be created from a constructor that can receive a partial object as references for its creation
    const project = new Project(); // creates an OntoUML project
    project.addName('My Project');

    // Projects contain an instance of Package  dubbed model that contains all model elements in the project
    // Container elements, e.g., projects and packages, also serve as factories for their contents
    const model = project.createModel(); // creates a "model" Package
    model.addName('Model a.k.a. Root Package');

    // Instead of partial objects, "factory" methods receive more suitable lists of arguments to facilitating populating elements
    const person = model.createKind('Person');
    const school = model.createKind('School');
    const date = model.createDatatype('Date');
    const enrollment = model.createRelator('Enrollment');
    const studiesAt = model.createMaterialRelation(
      person,
      school,
      'studies at'
    );

    model.createMediation(enrollment, person);
    model.createMediation(enrollment, school);

    // the API is constantly updated to include helpful methods to facilitate building OntoUML models
    studiesAt.getTargetEnd().addName('school');
    studiesAt.getTargetEnd().cardinality.setZeroToMany();
    studiesAt.getSourceEnd().addName('student');
    studiesAt.getSourceEnd().cardinality.setOneToMany();

    enrollment.createAttribute(date, 'enrollment date');

    // Containers also include methods to easily support retrieving their contents
    model.getAttributes(); // returns all contained attributes
    model.getClasses(); // returns all contained classes
    model.getGeneralizations(); // returns all contained generalizations

    // Any element can be easily serialized into JSON, and properly serialized elements can be deserialized just as easily
    const projectSerialization = JSON.stringify(project);
    const projectCopy = serializationUtils.parse(projectSerialization);
  }).not.toThrow());
