import { Project, serializationUtils } from '@libs/ontouml';

it('Test the example presented in the "Usage" section of the README file', () =>
  expect(() => {
    // Every OntoUML element can be created from a constructor that can receive a partial object as references for its creation
    const project = new Project({ name: 'My Project' }); // creates an OntoUML projects

    // Projects contain an instance of Package  dubbed model that contains all model elements in the project
    // Container elements, e.g., projects and packages, also serve as factories for their contents
    const model = project.createModel({ name: 'Model a.k.a. Root Package' }); // creates a "model" Package

    // Instead of partial objects, "factory" methods receive more suitable lists of arguments to facilitating populating elements
    const person = model.createKind('Person');
    const school = model.createKind('School');
    const date = model.createDatatype('Date');
    const enrollment = model.createRelator('Enrollment');
    const studiesAt = model.createMaterialRelation(person, school, 'studies at');

    model.createMediationRelation(enrollment, person);
    model.createMediationRelation(enrollment, school);

    // our API is constantly updated to include helpful methods to facilitate building OntoUML models
    studiesAt.getTargetEnd().name = 'school';
    studiesAt.getTargetEnd().cardinality.setZeroToMany();
    studiesAt.getSourceEnd().name = 'student';
    studiesAt.getSourceEnd().cardinality.setOneToMany();

    enrollment.createAttribute(date, 'enrollment date');

    // Containers also include methods to easily support retrieving their contents
    model.getAllAttributes(); // returns all contained attributes
    model.getAllClasses(); // returns all contained classes
    model.getAllGeneralizations(); // returns all contained generalizations

    // Any element can be easily serialized into JSON, and properly serialized elements can be deserialized just as easily
    const projectSerialization = JSON.stringify(project);
    const projectCopy = serializationUtils.parse(projectSerialization);
  }).not.toThrow());
