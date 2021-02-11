import { getUriManager } from './helpers';
import { Package } from '@libs/ontouml';

describe('URI generation duplicate names', () => {
  it('Duplicate detection is case sensitive', () => {
    const model = new Package();
    const class1 = model.createKind('Person');
    const class2 = model.createKind('person');

    const uriManager = getUriManager(model);
    const class1Uri = uriManager.getUri(class1);
    const class2Uri = uriManager.getUri(class2);

    expect(class1Uri).toEqual(':Person');
    expect(class2Uri).toEqual(':person');
  });

  describe('Should generate distinct URIs for elements with the same name', () => {
    it('2 classes', () => {
      const model = new Package();
      const class1 = model.createKind('Person');
      const class2 = model.createKind('Person');

      const uriManager = getUriManager(model);
      const class1Uri = uriManager.getUri(class1);
      const class2Uri = uriManager.getUri(class2);

      expect(class1Uri).toBeTruthy();
      expect(class2Uri).toBeTruthy();
      expect(class1Uri).not.toEqual(class2Uri);
    });

    it('3 classes', () => {
      const model = new Package();
      const class1 = model.createKind('Person');
      const class2 = model.createKind('Person');
      const class3 = model.createKind('Person');

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
      const model = new Package();
      const class1 = model.createKind('Person');
      const relation1 = model.createMaterialRelation(class1, class1, 'knows');
      const relation2 = model.createMaterialRelation(class1, class1, 'knows');

      const uriManager = getUriManager(model);
      const relation1Uri = uriManager.getUri(relation1);
      const relation2Uri = uriManager.getUri(relation2);

      expect(relation1Uri).toBeTruthy();
      expect(relation2Uri).toBeTruthy();
      expect(relation1Uri).not.toEqual(relation2Uri);
    });

    it('2 attributes of the same class', () => {
      const model = new Package();
      const class1 = model.createKind('Person');
      const attribute1 = class1.createAttribute(class1, 'friend');
      const attribute2 = class1.createAttribute(class1, 'friend');

      const uriManager = getUriManager(model);
      const attribute1Uri = uriManager.getUri(attribute1);
      const attribute2Uri = uriManager.getUri(attribute2);

      expect(attribute1Uri).toBeTruthy();
      expect(attribute2Uri).toBeTruthy();
      expect(attribute1Uri).not.toEqual(attribute2Uri);
    });

    it('2 attributes of the different classes', () => {
      const model = new Package();
      const class1 = model.createKind('Person');
      const class2 = model.createKind('Dog');
      const attribute1 = class1.createAttribute(class1, 'friend');
      const attribute2 = class2.createAttribute(class2, 'friend');

      const uriManager = getUriManager(model);
      const attribute1Uri = uriManager.getUri(attribute1);
      const attribute2Uri = uriManager.getUri(attribute2);

      expect(attribute1Uri).toBeTruthy();
      expect(attribute2Uri).toBeTruthy();
      expect(attribute1Uri).not.toEqual(attribute2Uri);
    });

    it('1 class and 1 package ', () => {
      const model = new Package();
      const class1 = model.createKind('Person');

      const uriManager = getUriManager(model);
      const classUri = uriManager.getUri(class1);
      const modelUri = uriManager.getUri(model);

      expect(modelUri).toBeTruthy();
      expect(classUri).toBeTruthy();
      expect(classUri).not.toEqual(modelUri);
    });

    it('1 class and 1 relation ', () => {
      const model = new Package();
      const class1 = model.createKind('Person');
      const relation = model.createMaterialRelation(class1, class1, 'Person');

      const uriManager = getUriManager(model);
      const classUri = uriManager.getUri(class1);
      const relationUri = uriManager.getUri(relation);

      expect(relationUri).toBeTruthy();
      expect(classUri).toBeTruthy();
      expect(classUri).not.toEqual(relationUri);
    });

    it('1 class and 1 relation end ', () => {
      const model = new Package();
      const class1 = model.createKind('Person');
      const relation = model.createMaterialRelation(class1, class1, 'knows');
      relation.getTargetEnd().name = 'Person';

      const uriManager = getUriManager(model);
      const classUri = uriManager.getUri(class1);
      const endUri = uriManager.getUri(relation.properties[1]);

      expect(classUri).toBeTruthy();
      expect(endUri).toBeTruthy();
      expect(classUri).not.toEqual(endUri);
    });

    it('1 class and 1 attribute', () => {
      const model = new Package();
      const class1 = model.createKind('Person');
      const attribute = class1.createAttribute(class1, 'Person');

      const uriManager = getUriManager(model);
      const classUri = uriManager.getUri(class1);
      const attributeUri = uriManager.getUri(attribute);

      expect(classUri).toBeTruthy();
      expect(attributeUri).toBeTruthy();
      expect(classUri).not.toEqual(attributeUri);
    });

    it('1 relation and 1 attribute', () => {
      const model = new Package();
      const class1 = model.createKind('Person');
      const attribute = class1.createAttribute(class1, 'Person');
      const relation = model.createMaterialRelation(class1, class1, 'Person');

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
      const model = new Package();
      const class1 = model.createKind('Person');
      const class2 = model.createKind('Person');
      const class3 = model.createKind('Person');

      const uriManager = getUriManager(model);
      const class1Uri = uriManager.getUri(class1);
      const class2Uri = uriManager.getUri(class2);
      const class3Uri = uriManager.getUri(class3);

      expect([':Person', ':Person_1', ':Person_2']).toContain(class1Uri);
      expect([':Person', ':Person_1', ':Person_2']).toContain(class2Uri);
      expect([':Person', ':Person_1', ':Person_2']).toContain(class3Uri);
    });

    it('3 relations ', () => {
      const model = new Package();
      const class1 = model.createKind('Person');
      const relation1 = model.createMaterialRelation(class1, class1, 'knows');
      const relation2 = model.createMaterialRelation(class1, class1, 'knows');
      const relation3 = model.createMaterialRelation(class1, class1, 'knows');

      const uriManager = getUriManager(model);
      const relation1Uri = uriManager.getUri(relation1);
      const relation2Uri = uriManager.getUri(relation2);
      const relation3Uri = uriManager.getUri(relation3);

      expect([':knows', ':knows_1', ':knows_2']).toContain(relation1Uri);
      expect([':knows', ':knows_1', ':knows_2']).toContain(relation2Uri);
      expect([':knows', ':knows_1', ':knows_2']).toContain(relation3Uri);
    });

    it('3 attributes', () => {
      const model = new Package();
      const class1 = model.createKind('Person');
      const attribute1 = class1.createAttribute(class1, 'friend');
      const attribute2 = class1.createAttribute(class1, 'friend');
      const attribute3 = class1.createAttribute(class1, 'friend');

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
      const model = new Package();
      const class1 = model.createKind('Person');
      const relation = model.createMaterialRelation(class1, class1, 'Person');

      const uriManager = getUriManager(model);
      const classUri = uriManager.getUri(class1);
      const relationUri = uriManager.getUri(relation);

      expect(classUri).toEqual(':Person');
      expect(relationUri).toEqual(':Person_1');
    });

    it('Class has preference over attribute', () => {
      const model = new Package();
      const class1 = model.createKind('Person');
      const attribute = class1.createAttribute(class1, 'Person');

      const uriManager = getUriManager(model);
      const classUri = uriManager.getUri(class1);
      const attributeUri = uriManager.getUri(attribute);

      expect(classUri).toEqual(':Person');
      expect(attributeUri).toEqual(':Person_1');
    });

    it('Attribute has preference over relation', () => {
      const model = new Package();
      const class1 = model.createKind('Person');
      const attribute = class1.createAttribute(class1, 'betterThan');
      const relation = model.createMaterialRelation(class1, class1, 'betterThan');

      const uriManager = getUriManager(model);
      const attributeUri = uriManager.getUri(attribute);
      const relationUri = uriManager.getUri(relation);

      expect(attributeUri).toEqual(':betterThan');
      expect(relationUri).toEqual(':betterThan_1');
    });

    it('Class > attribute > relation', () => {
      const model = new Package();
      const class1 = model.createKind('Person');
      const attribute = class1.createAttribute(class1, 'Person');
      const relation = model.createMaterialRelation(class1, class1, 'Person');

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
