import { getUriManager } from './helpers';
import OntoumlFactory from './ontouml_factory';

describe('URI generation duplicate names', () => {
  it('Duplicate detection is case sensitive', () => {
    const class1 = OntoumlFactory.createKind('Person');
    const class2 = OntoumlFactory.createKind('person');
    const model = OntoumlFactory.createPackage(null, [class1, class2]);

    const uriManager = getUriManager(model);
    const class1Uri = uriManager.getUri(class1);
    const class2Uri = uriManager.getUri(class2);

    expect(class1Uri).toEqual(':Person');
    expect(class2Uri).toEqual(':person');
  });

  describe('Should generate distinct URIs for elements with the same name', () => {
    it('2 classes', () => {
      const class1 = OntoumlFactory.createKind('Person');
      const class2 = OntoumlFactory.createKind('Person');
      const model = OntoumlFactory.createPackage(null, [class1, class2]);

      const uriManager = getUriManager(model);
      const class1Uri = uriManager.getUri(class1);
      const class2Uri = uriManager.getUri(class2);

      expect(class1Uri).toBeTruthy();
      expect(class2Uri).toBeTruthy();
      expect(class1Uri).not.toEqual(class2Uri);
    });

    it('3 classes', () => {
      const class1 = OntoumlFactory.createKind('Person');
      const class2 = OntoumlFactory.createKind('Person');
      const class3 = OntoumlFactory.createKind('Person');
      const model = OntoumlFactory.createPackage(null, [class1, class2, class3]);

      const uriManager = getUriManager(model);
      const class1Uri = uriManager.getUri(class1);
      const class2Uri = uriManager.getUri(class2);
      const class3Uri = uriManager.getUri(class3);

      expect(class1Uri).toBeTruthy();
      expect(class2Uri).toBeTruthy();
      expect(class3Uri).toBeTruthy();
      expect(class1Uri).not.toEqual(class2Uri);
      expect(class1Uri).not.toEqual(class3Uri);
      expect(class2Uri).not.toEqual(class3Uri);
    });

    it('2 relations ', () => {
      const class1 = OntoumlFactory.createKind('Person');
      const relation1 = OntoumlFactory.createMaterial('knows', class1, class1);
      const relation2 = OntoumlFactory.createMaterial('knows', class1, class1);
      const model = OntoumlFactory.createPackage(null, [class1, relation1, relation2]);

      const uriManager = getUriManager(model);
      const relation1Uri = uriManager.getUri(relation1);
      const relation2Uri = uriManager.getUri(relation2);

      expect(relation1Uri).toBeTruthy();
      expect(relation2Uri).toBeTruthy();
      expect(relation1Uri).not.toEqual(relation2Uri);
    });

    it('2 attributes of the same class', () => {
      const class1 = OntoumlFactory.createKind('Person');
      const attribute1 = OntoumlFactory.addAttribute(class1, 'friend', class1);
      const attribute2 = OntoumlFactory.addAttribute(class1, 'friend', class1);
      const model = OntoumlFactory.createPackage(null, [class1]);

      const uriManager = getUriManager(model);
      const attribute1Uri = uriManager.getUri(attribute1);
      const attribute2Uri = uriManager.getUri(attribute2);

      expect(attribute1Uri).toBeTruthy();
      expect(attribute2Uri).toBeTruthy();
      expect(attribute1Uri).not.toEqual(attribute2Uri);
    });

    it('2 attributes of the different classes', () => {
      const class1 = OntoumlFactory.createKind('Person');
      const class2 = OntoumlFactory.createKind('Dog');
      const attribute1 = OntoumlFactory.addAttribute(class1, 'friend', class1);
      const attribute2 = OntoumlFactory.addAttribute(class2, 'friend', class2);
      const model = OntoumlFactory.createPackage(null, [class1, class2]);

      const uriManager = getUriManager(model);
      const attribute1Uri = uriManager.getUri(attribute1);
      const attribute2Uri = uriManager.getUri(attribute2);

      expect(attribute1Uri).toBeTruthy();
      expect(attribute2Uri).toBeTruthy();
      expect(attribute1Uri).not.toEqual(attribute2Uri);
    });

    it('1 class and 1 package ', () => {
      const class1 = OntoumlFactory.createKind('Person');
      const model = OntoumlFactory.createPackage('Person', [class1]);

      const uriManager = getUriManager(model);
      const classUri = uriManager.getUri(class1);
      const modelUri = uriManager.getUri(model);

      expect(modelUri).toBeTruthy();
      expect(classUri).toBeTruthy();
      expect(classUri).not.toEqual(modelUri);
    });

    it('1 class and 1 relation ', () => {
      const class1 = OntoumlFactory.createKind('Person');
      const relation = OntoumlFactory.createMaterial('Person', class1, class1);
      const model = OntoumlFactory.createPackage(null, [class1, relation]);

      const uriManager = getUriManager(model);
      const classUri = uriManager.getUri(class1);
      const relationUri = uriManager.getUri(relation);

      expect(relationUri).toBeTruthy();
      expect(classUri).toBeTruthy();
      expect(classUri).not.toEqual(relationUri);
    });

    it('1 class and 1 relation end ', () => {
      const class1 = OntoumlFactory.createKind('Person');
      const relation = OntoumlFactory.createMaterial('knows', class1, class1);
      relation.properties[1].name = 'Person';
      const model = OntoumlFactory.createPackage(null, [class1, relation]);

      const uriManager = getUriManager(model);
      const classUri = uriManager.getUri(class1);
      const endUri = uriManager.getUri(relation.properties[1]);

      expect(classUri).toBeTruthy();
      expect(endUri).toBeTruthy();
      expect(classUri).not.toEqual(endUri);
    });

    it('1 class and 1 attribute', () => {
      const class1 = OntoumlFactory.createKind('Person');
      const attribute = OntoumlFactory.addAttribute(class1, 'Person', class1);
      const model = OntoumlFactory.createPackage(null, [class1]);

      const uriManager = getUriManager(model);
      const classUri = uriManager.getUri(class1);
      const attributeUri = uriManager.getUri(attribute);

      expect(classUri).toBeTruthy();
      expect(attributeUri).toBeTruthy();
      expect(classUri).not.toEqual(attributeUri);
    });

    it('1 relation and 1 attribute', () => {
      const class1 = OntoumlFactory.createKind('Car');
      const attribute = OntoumlFactory.addAttribute(class1, 'Person', class1);
      const relation = OntoumlFactory.createMaterial('Person', class1, class1);
      const model = OntoumlFactory.createPackage(null, [class1, relation]);

      const uriManager = getUriManager(model);
      const attributeUri = uriManager.getUri(attribute);
      const relationUri = uriManager.getUri(relation);

      expect(attributeUri).toBeTruthy();
      expect(relationUri).toBeTruthy();
      expect(attributeUri).not.toEqual(relationUri);
    });
  });

  describe('Should use incremental sufixes to distinguish repeated URIs', () => {
    it('3 classes', () => {
      const class1 = OntoumlFactory.createKind('Person');
      const class2 = OntoumlFactory.createKind('Person');
      const class3 = OntoumlFactory.createKind('Person');
      const model = OntoumlFactory.createPackage(null, [class1, class2, class3]);

      const uriManager = getUriManager(model);
      const class1Uri = uriManager.getUri(class1);
      const class2Uri = uriManager.getUri(class2);
      const class3Uri = uriManager.getUri(class3);

      expect([':Person', ':Person_1', ':Person_2']).toContain(class1Uri);
      expect([':Person', ':Person_1', ':Person_2']).toContain(class2Uri);
      expect([':Person', ':Person_1', ':Person_2']).toContain(class3Uri);
    });

    it('3 relations ', () => {
      const class1 = OntoumlFactory.createKind('Person');
      const relation1 = OntoumlFactory.createMaterial('knows', class1, class1);
      const relation2 = OntoumlFactory.createMaterial('knows', class1, class1);
      const relation3 = OntoumlFactory.createMaterial('knows', class1, class1);
      const model = OntoumlFactory.createPackage(null, [class1, relation1, relation2, relation3]);

      const uriManager = getUriManager(model);
      const relation1Uri = uriManager.getUri(relation1);
      const relation2Uri = uriManager.getUri(relation2);
      const relation3Uri = uriManager.getUri(relation3);

      expect([':knows', ':knows_1', ':knows_2']).toContain(relation1Uri);
      expect([':knows', ':knows_1', ':knows_2']).toContain(relation2Uri);
      expect([':knows', ':knows_1', ':knows_2']).toContain(relation3Uri);
    });

    it('3 attributes', () => {
      const class1 = OntoumlFactory.createKind('Person');
      const attribute1 = OntoumlFactory.addAttribute(class1, 'friend', class1);
      const attribute2 = OntoumlFactory.addAttribute(class1, 'friend', class1);
      const attribute3 = OntoumlFactory.addAttribute(class1, 'friend', class1);
      const model = OntoumlFactory.createPackage(null, [class1]);

      const uriManager = getUriManager(model);
      const attribute1Uri = uriManager.getUri(attribute1);
      const attribute2Uri = uriManager.getUri(attribute2);
      const attribute3Uri = uriManager.getUri(attribute3);

      expect([':friend', ':friend_1', ':friend_2']).toContain(attribute1Uri);
      expect([':friend', ':friend_1', ':friend_2']).toContain(attribute2Uri);
      expect([':friend', ':friend_1', ':friend_2']).toContain(attribute3Uri);
    });
  });

  describe('Original URI preference', () => {
    it('Class has preference over relation', () => {
      const class1 = OntoumlFactory.createKind('Person');
      const relation = OntoumlFactory.createMaterial('Person', class1, class1);
      const model = OntoumlFactory.createPackage(null, [class1, relation]);

      const uriManager = getUriManager(model);
      const classUri = uriManager.getUri(class1);
      const relationUri = uriManager.getUri(relation);

      expect(classUri).toEqual(':Person');
      expect(relationUri).toEqual(':Person_1');
    });

    it('Class has preference over attribute', () => {
      const class1 = OntoumlFactory.createKind('Person');
      const attribute = OntoumlFactory.addAttribute(class1, 'Person', class1);
      const model = OntoumlFactory.createPackage(null, [class1]);

      const uriManager = getUriManager(model);
      const classUri = uriManager.getUri(class1);
      const attributeUri = uriManager.getUri(attribute);

      expect(classUri).toEqual(':Person');
      expect(attributeUri).toEqual(':Person_1');
    });

    it('Attribute has preference over relation', () => {
      const class1 = OntoumlFactory.createKind('Person');
      const attribute = OntoumlFactory.addAttribute(class1, 'betterThan', class1);
      const relation = OntoumlFactory.createMaterial('betterThan', class1, class1);
      const model = OntoumlFactory.createPackage(null, [class1, relation]);

      const uriManager = getUriManager(model);
      const attributeUri = uriManager.getUri(attribute);
      const relationUri = uriManager.getUri(relation);

      expect(attributeUri).toEqual(':betterThan');
      expect(relationUri).toEqual(':betterThan_1');
    });

    it('Class > attribute > relation', () => {
      const class1 = OntoumlFactory.createKind('Person');
      const attribute = OntoumlFactory.addAttribute(class1, 'Person', class1);
      const relation = OntoumlFactory.createMaterial('Person', class1, class1);
      const model = OntoumlFactory.createPackage(null, [class1, relation]);

      const uriManager = getUriManager(model);
      const classUri = uriManager.getUri(class1);
      const attributeUri = uriManager.getUri(attribute);
      const relationUri = uriManager.getUri(relation);

      expect(classUri).toEqual(':Person');
      expect(attributeUri).toEqual(':Person_1');
      expect(relationUri).toEqual(':Person_2');
    });
  });
});
