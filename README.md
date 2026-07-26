# ontouml-js

[![CI](https://img.shields.io/github/actions/workflow/status/OntoUML/ontouml-js/ci.yml?style=flat-square&label=CI)](https://github.com/OntoUML/ontouml-js/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/ontouml-js?style=flat-square)](https://www.npmjs.com/package/ontouml-js)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue?style=flat-square)](LICENSE)

A TypeScript/JavaScript library to **create, edit, query, and serialize
[OntoUML](https://ontouml.org) models** programmatically. Models round-trip
to and from [OntoUML JSON](https://w3id.org/ontouml/schema) — the interchange
format shared with the OntoUML visual tools — with byte-identical
serialization.

**📖 Tutorial & documentation: <https://ontouml.github.io/ontouml-js/>** —
a guided tour with live, editable code samples.

## Installation

```sh
npm install ontouml-js
```

The package ships CommonJS and ES module builds with full TypeScript
declarations; Node.js ≥ 18 is required.

## Usage

Projects and their containers (packages, classes) act as factories of fluent
builders for their contents:

```javascript
import { Project, serializationUtils } from 'ontouml-js';

// Create an OntoUML project
const project = new Project();
project.name.add('My Project');

// Projects serve as factories of builders for their contents
const model = project.packageBuilder().root().name('Model').build();

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

// Relation ends and attributes are fully configurable
studiesAt.sourceEnd.name.add('student');
studiesAt.sourceEnd.cardinality.setAsOneToMany();
studiesAt.targetEnd.name.add('school');
studiesAt.targetEnd.cardinality.setAsZeroToMany();

enrollment.propertyBuilder().type(date).name('enrollment date').build();

// Containers expose their contents, and query methods span the model
model.classes; // the classes in the package
project.attributes; // every attribute in the project
project.getRelatorTypes(); // every class stereotyped «relator»

// Projects serialize into OntoUML JSON (https://w3id.org/ontouml/schema),
// and serialized projects parse back — byte-identically
const json = JSON.stringify(project);
const copy = serializationUtils.parse(json);
```

The library covers the full OntoUML metamodel: classes and their stereotypes,
relations (binary and n-ary), attributes, generalizations and generalization
sets, notes and anchors, diagrams with views and shapes, multilingual naming,
and the [OntoUML/UFO Catalog](https://w3id.org/ontouml-models) metadata
vocabulary. See the [tutorial](https://ontouml.github.io/ontouml-js/) for the
complete tour.

### Verification

The built-in syntactical verification service checks a project (or a single
model element) against the OntoUML rules and reports issues:

```javascript
import { OntoumlVerification, Project } from 'ontouml-js';

const project = new Project();
const model = project.packageBuilder().root().build();
model.classBuilder().subkind().name('Student').build(); // no identity provider

const { result: issues } = new OntoumlVerification(project).run();
issues.forEach(issue => console.log(issue.severity, issue.description));
```

## Development

```sh
npm install
npm test          # run the Jest suite
npm run lint      # type-check with tsc
npm run build     # bundle CJS + ESM + type declarations
```

The tutorial site lives in [`website/`](website/) and its code samples are
type-checked against the library at build time. See [AGENTS.md](AGENTS.md)
for repository conventions, and the
[publish workflow](.github/workflows/publish.yml) for how releases reach npm.

## About

`ontouml-js` is developed and maintained by the [OntoUML](https://ontouml.org)
community. If you want to know more, feel free to open an issue to provide
feedback on the project or reach our team members for more specific cases:

- [Tiago Prince Sales](https://github.com/tgoprince)
- [Claudenir M. Fonseca](https://github.com/claudenirmf)
- [Lucas Bassetti](https://github.com/LucasBassetti)
- [Victor Viola](https://github.com/victorviola)

## License

[Apache 2.0](LICENSE)
