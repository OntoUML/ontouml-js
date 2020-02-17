import { ModelManager } from '@libs/model';
import { OntoUMLType } from '@constants/.';
import { IElement, IClassifier, IClass } from '@types';
import { example } from '@test-models/valids';

describe('Model deserializing', () => {
  const inputModel = example;
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
    allContents1.forEach((element: IElement) =>
      expect(allContents2).toContain(element),
    );
    allContents2.forEach((element: IElement) =>
      expect(allContents1).toContain(element),
    );
    expect(allContents1.length === allContents2.length).toBeTruthy();
  });

  it('Check getAllContentsByType()', () => {
    const selectedContents = modelManager.rootPackage.getAllContentsByType([
      OntoUMLType.CLASS_TYPE,
      OntoUMLType.RELATION_TYPE,
    ]);
    expect(selectedContents.length).toBeGreaterThan(0);
    expect(
      selectedContents.filter(
        (element: IElement) => !element.hasIClassifierType(),
      ).length,
    ).toBe(0);
  });

  it('Check getAllContentsById()', () => {
    modelManager.rootPackage
      .getAllContents()
      .forEach((element: IElement) =>
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
    const student = modelManager.rootPackage.getContentById(
      'GDbhBA6AUB0UtAv1',
    ) as IClassifier;
    const person = modelManager.rootPackage.getContentById(
      '2uxhBA6AUB0UtArb',
    ) as IClassifier;
    const agent = modelManager.rootPackage.getContentById(
      'rw.hBA6AUB0UtArB',
    ) as IClassifier;
    const ancestors = sophomore.getAncestors();

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