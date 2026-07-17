# OntoUML JS

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/OntoUML/ontouml-js/Node%20CI?style=flat-square)

Javascript library utility for manipulating OntoUML models.

## Getting Start

```
npm install ontouml-js --save

// yarn users
yarn add ontouml-js
```

## Usage

This package is designed to support manipulating OntoUML models and their serialization into [`ontouml-schema`](https://github.com/OntoUML/ontouml-schema) compliant JSON files.

```javascript
import { Project, serializationUtils } from 'ontouml-js';

// Creates an OntoUML project
const project = new Project();
project.name.add('My Project');

// Projects serve as factories of builders for their contents
const model = project
  .packageBuilder()
  .root()
  .name('Model a.k.a. Root Package')
  .build();

// Container elements, e.g., packages and classes, are also factories of
// builders for their contents
const person = model.classBuilder().kind().name('Person').build();
const school = model.classBuilder().kind().name('School').build();
const date = model.classBuilder().datatype().name('Date').build();
const enrollment = model.classBuilder().relator().name('Enrollment').build();

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

// The API is constantly updated to include helpful methods to facilitate
// building OntoUML models
studiesAt.targetEnd.name.add('school');
studiesAt.targetEnd.cardinality.setAsZeroToMany();
studiesAt.sourceEnd.name.add('student');
studiesAt.sourceEnd.cardinality.setAsOneToMany();

enrollment.propertyBuilder().type(date).name('enrollment date').build();

// Containers also include methods to easily support retrieving their contents
project.attributes; // returns all contained attributes
model.classes; // returns all contained classes
model.generalizations; // returns all contained generalizations

// Projects can be serialized into ontouml-schema compliant JSON files, and
// serialized projects can be deserialized just as easily
const projectSerialization = JSON.stringify(project);
const projectCopy = serializationUtils.parse(projectSerialization);
```

## About

If you are interested to know more, feel free to open an issue to provide feedback on the project or reach our team members for more specific cases:

- [Claudenir M. Fonseca](https://github.com/claudenirmf)
- [Tiago Prince Sales](https://github.com/tgoprince)
- [Lucas Bassetti](https://github.com/LucasBassetti)
- [Victor Viola](https://github.com/victorviola)
