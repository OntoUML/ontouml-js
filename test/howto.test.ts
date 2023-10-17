import { Project, serializationUtils } from '../src';

it('Test the example presented in the "Usage" section of the README file', () =>
  expect(() => {
    // Every OntoUML element can be created from a constructor that can receive a partial object as references for its creation
    const project = new Project(); // creates an OntoUML project
    project.name.add('My Project');

    // Projects contain an instance of Package  dubbed model that contains all model elements in the project
    // Container elements, e.g., projects and packages, also serve as factories for their contents
    const model = project
      .packageBuilder()
      .name('Model a.k.a. Root Package')
      .build(); // creates a "model" Package

    // Instead of partial objects, "factory" methods receive more suitable lists of arguments to facilitating populating elements
    const person = model.classBuilder().kind().name('Person').build();
    const school = model.classBuilder().kind().name('School').build();
    const date = model.classBuilder().datatype().name('Date').build();

    const enrollment = model
      .classBuilder()
      .relator()
      .name('Enrollment')
      .build();

    const studiesAt = model
      .binaryRelationBuilder()
      .material()
      .name('studies at')
      .source(person)
      .target(school)
      .build();

    model
      .binaryRelationBuilder()
      .mediation()
      .source(enrollment)
      .target(person)
      .build();

    model
      .binaryRelationBuilder()
      .mediation()
      .source(enrollment)
      .target(school)
      .build();

    // the API is constantly updated to include helpful methods to facilitate building OntoUML models
    studiesAt.targetEnd.name.add('school');
    studiesAt.targetEnd.cardinality.setAsZeroToMany();
    studiesAt.sourceEnd.name.add('student');
    studiesAt.sourceEnd.cardinality.setAsOneToMany();

    enrollment.attributeBuilder().type(date).name('enrollment date').build();

    // Containers also include methods to easily support retrieving their contents
    project.attributes; // returns all contained attributes
    model.classes; // returns all contained classes
    model.generalizations; // returns all contained generalizations

    // Any element can be easily serialized into JSON, and properly serialized elements can be deserialized just as easily
    const projectSerialization = JSON.stringify(project);
    const projectCopy = serializationUtils.parse(projectSerialization);
  }).not.toThrow());
