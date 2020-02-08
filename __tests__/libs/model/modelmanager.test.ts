import { ModelManager } from '@libs/model';
import { OntoUMLType } from '@constants/.';
import { IElement, IClassifier, IClass } from '@types';

describe('Model deserializing', () => {
  const inputModel = JSON.parse(
    JSON.stringify(require('@test-models/others/example.json')),
  );
  let modelManager: ModelManager;

  it('Check input model against OntoUML Schema', () => {
    modelManager = new ModelManager(inputModel);
  });

  it('Check getRootPackage()', () => {
    Object.values(modelManager.allElements).forEach((element: IElement) => {
      const rootPackage = element.getRootPackage();
      expect(rootPackage).toBe(modelManager.rootPackage);

      if (element.type === OntoUMLType.PROPERTY_TYPE) {
        expect((element.container as IElement).hasIClassifierType).toBeTruthy();
      }
    });
  });

  it('Check getAllContents()', () => {
    const allContents1 = modelManager.rootPackage.getAllContents();
    const allContents2 = Object.values(modelManager.allElements);

    allContents1.push(modelManager.rootPackage);
    allContents1.forEach(item => expect(allContents2).toContain(item));
    allContents2.forEach(item => expect(allContents1).toContain(item));
    expect(allContents1.length === allContents2.length).toBeTruthy();
  });

  it('Check getAllContentsByType()', () => {
    const selectedContents = modelManager.rootPackage.getAllContentsByType([
      OntoUMLType.CLASS_TYPE,
      OntoUMLType.RELATION_TYPE,
    ]);
    expect(selectedContents.length).toBeGreaterThan(0);
    expect(
      selectedContents.filter(element => !element.hasIClassifierType()).length,
    ).toBe(0);
  });

  it('Check getAllContentsById()', () => {
    modelManager.rootPackage
      .getAllContents()
      .forEach(element =>
        expect(
          modelManager.allElements[element.id] ===
            modelManager.getElementById(element.id),
        ).toBeTruthy(),
      );
  });

  it('Check getParents()', () => {
    const sophomore = modelManager.rootPackage.getContentById(
      'h_Y9hA6GAqACnA1t',
    ) as IClassifier;
    const parents = sophomore.getParents();
    const student = modelManager.rootPackage.getContentById(
      'GDbhBA6AUB0UtAv1',
    ) as IClassifier;

    expect(parents.length === 1 && parents.includes(student)).toBeTruthy();
  });

  it('Check getChildren()', () => {
    const student = modelManager.rootPackage.getContentById(
      'GDbhBA6AUB0UtAv1',
    ) as IClassifier;
    const sophomore = modelManager.rootPackage.getContentById(
      'h_Y9hA6GAqACnA1t',
    ) as IClassifier;
    const privately = modelManager.rootPackage.getContentById(
      'cea9hA6GAqACnA2B',
    ) as IClassifier;

    const children = student.getChildren();

    expect(
      children.length === 2 &&
        children.includes(sophomore) &&
        children.includes(privately),
    ).toBeTruthy();
  });

  it('Check getAncestors()', () => {
    const sophomore = modelManager.rootPackage.getContentById(
      'h_Y9hA6GAqACnA1t',
    ) as IClassifier;
    const ancestors = sophomore.getAncestors();
    const student = modelManager.rootPackage.getContentById(
      'GDbhBA6AUB0UtAv1',
    ) as IClassifier;
    const person = modelManager.rootPackage.getContentById(
      '2uxhBA6AUB0UtArb',
    ) as IClassifier;
    const agent = modelManager.rootPackage.getContentById(
      'rw.hBA6AUB0UtArB',
    ) as IClassifier;

    expect(
      ancestors.length === 3 &&
        ancestors.includes(student) &&
        ancestors.includes(person) &&
        ancestors.includes(agent),
    ).toBeTruthy();
  });

  it('Check getDescendents()', () => {
    const sophomore = modelManager.rootPackage.getContentById(
      'h_Y9hA6GAqACnA1t',
    ) as IClassifier;
    const privately = modelManager.rootPackage.getContentById(
      'cea9hA6GAqACnA2B',
    ) as IClassifier;
    const student = modelManager.rootPackage.getContentById(
      'GDbhBA6AUB0UtAv1',
    ) as IClassifier;
    const person = modelManager.rootPackage.getContentById(
      '2uxhBA6AUB0UtArb',
    ) as IClassifier;

    const descendents = person.getDescendents();

    expect(
      descendents.length === 3 &&
        descendents.includes(student) &&
        descendents.includes(sophomore) &&
        descendents.includes(privately),
    ).toBeTruthy();
  });
});

it('Check README How To code', () => {
  const ontoULMSchemaModel = JSON.parse(
    JSON.stringify(require('@test-models/others/example.json')),
  );

  const modelManager = new ModelManager(ontoULMSchemaModel);

  const rootPackage = modelManager.rootPackage; // ontoULMSchemaModel root package
  rootPackage.getAllContents(); // returns elements recursively contained within the executing package
  rootPackage.getAllContentsByType([
    OntoUMLType.GENERALIZATION_TYPE,
    OntoUMLType.PROPERTY_TYPE,
  ]); // returns elements contained within in the package selected by type
  rootPackage.getContentById('elementId'); // returns the element bearering the given id

  const student = rootPackage
    .getAllContents()
    .find(element => element.name === 'Student') as IClass; // Student role class
  student.stereotypes; // [ 'role' ]
  student.getParents(); // [ Person kind class ]
  student.getAncestors(); // [ Person kind class, Agent category class ]
  student.getChildren(); // [ Privately Enrolled role class, Privately Enrolled role class ]
  student.getDescendents(); // [ Privately Enrolled role class, Privately Enrolled role class ]

  const enrollmentDate = rootPackage
    .getAllContents()
    .find(element => element.name === 'Enrollment Date') as IClass; // Enrollment Date mode class
  enrollmentDate.properties[0]; // date property representing the class's attibute
  enrollmentDate.getRootPackage; // returns rootPackage
});
