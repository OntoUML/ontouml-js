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

![](/resources/howto.png)

This package is designed to support manipulating OntoUML models, such as the one above, serialized in [`ontouml-schema`](https://github.com/OntoUML/ontouml-schema) JSON format.

```javascript
import { ModelManager } from 'ontouml-js';

const modelManager = new ModelManager(ontoULMSchemaModel);

const rootPackage = modelManager.rootPackage; // ontoULMSchemaModel root package
rootPackage.getAllContents() // returns elements recursively contained within the executing package
rootPackage.getAllContentsByType([ OntoUMLType.GENERALIZATION_TYPE, OntoUMLType.PROPERTY_TYPE ]) // returns elements contained within in the package selected by type
rootPackage.getContentById('elementId') // returns the element bearering the given id

const student = rootPackage.getAllContents().find(element => element.name === 'Student'); // Student role class
student.stereotypes; // [ 'role' ]
student.getParents(); // [ Person kind class ]
student.getAncestors(); // [ Person kind class, Agent category class ]
student.getChildren(); // [ Privately Enrolled role class, Privately Enrolled role class ]
student.getDescendents(); // [ Privately Enrolled role class, Privately Enrolled role class ]

const enrollmentDate = rootPackage.getAllContents().find(element => element.name === 'Enrollment Date'); // Enrollment Date mode class
enrollmentDate.properties[0]; // date property representing the class's attibute
enrollmentDate.getRootPackage; // returns rootPackage
```

## About

If you are interested to know more, feel free to open an issue to provide feedback on the project or reach our team members for more specific cases:
 * [Claudenir M. Fonseca](https://github.com/claudenirmf)
 * [Tiago Prince Sales](https://github.com/tgoprince)
 * [Lucas Bassetti](https://github.com/LucasBassetti)
 * [Victor Viola](https://github.com/victorviola)

