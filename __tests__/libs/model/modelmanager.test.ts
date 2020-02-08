import { ModelManager } from '@libs/model';
import { OntoUMLType } from '@constants/';
import { IElement, IClassifier } from '@types';

describe('Model deserializing', () => {
  const packages_model = require('@test-models/others/serialization.json');
  const mm = new ModelManager(packages_model);

  it('Check getRootPackage()', () => {
    Object.values(mm.allElements).forEach((element: IElement) => {
      const rootPackage = element.getRootPackage();
      expect(rootPackage).toBe(mm.rootPackage);

      if (element.type === OntoUMLType.PROPERTY_TYPE) {
        expect((element.container as IElement).hasIClassifierType).toBeTruthy();
      }
    });
  });

  it('Check getAllContents()', () => {
    const allContents1 = mm.rootPackage.getAllContents();
    const allContents2 = Object.values(mm.allElements);

    allContents1.push(mm.rootPackage);
    allContents1.forEach(item => expect(allContents2).toContain(item));
    allContents2.forEach(item => expect(allContents1).toContain(item));
    expect(allContents1.length === allContents2.length).toBeTruthy();
  });

  it('Check getAllContentsByType()', () => {
    const selectedContents = mm.rootPackage.getAllContentsByType([
      OntoUMLType.CLASS_TYPE,
      OntoUMLType.RELATION_TYPE,
    ]);
    expect(selectedContents.length).toBeGreaterThan(0);
    expect(
      selectedContents.filter(element => !element.hasIClassifierType()).length,
    ).toBe(0);
  });

  it('Check getAllContentsById()', () => {
    mm.rootPackage
      .getAllContents()
      .forEach(element =>
        expect(
          mm.allElements[element.id] === mm.getElementById(element.id),
        ).toBeTruthy(),
      );
  });

  it('Check getParents()', () => {
    const sophomore = mm.rootPackage.getContentById(
      'h_Y9hA6GAqACnA1t',
    ) as IClassifier;
    const parents = sophomore.getParents();
    const student = mm.rootPackage.getContentById(
      'GDbhBA6AUB0UtAv1',
    ) as IClassifier;

    expect(parents.length === 1 && parents.includes(student)).toBeTruthy();
  });

  it('Check getChildren()', () => {
    const student = mm.rootPackage.getContentById(
      'GDbhBA6AUB0UtAv1',
    ) as IClassifier;
    const sophomore = mm.rootPackage.getContentById(
      'h_Y9hA6GAqACnA1t',
    ) as IClassifier;
    const privately = mm.rootPackage.getContentById(
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
    const sophomore = mm.rootPackage.getContentById(
      'h_Y9hA6GAqACnA1t',
    ) as IClassifier;
    const ancestors = sophomore.getAncestors();
    const student = mm.rootPackage.getContentById(
      'GDbhBA6AUB0UtAv1',
    ) as IClassifier;
    const person = mm.rootPackage.getContentById(
      '2uxhBA6AUB0UtArb',
    ) as IClassifier;
    const agent = mm.rootPackage.getContentById(
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
    const sophomore = mm.rootPackage.getContentById(
      'h_Y9hA6GAqACnA1t',
    ) as IClassifier;
    const privately = mm.rootPackage.getContentById(
      'cea9hA6GAqACnA2B',
    ) as IClassifier;
    const student = mm.rootPackage.getContentById(
      'GDbhBA6AUB0UtAv1',
    ) as IClassifier;
    const person = mm.rootPackage.getContentById(
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
