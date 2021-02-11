import { getUriManager } from './helpers';
import { Package } from '@libs/ontouml';

describe('URI generation', () => {
  describe("{ uriFormatBy = 'id' }", () => {
    it('should generate id-based uri for classes', () => {
      const model = new Package({ name: 'Model' });
      const _class = model.createKind('Person', { id: '123' });

      const uriManager = getUriManager(model, { uriFormatBy: 'id' });
      const uri = uriManager.getUri(_class);
      expect(uri).toEqual(':123');
    });

    it('should generate id-based uri for attribute', () => {
      const model = new Package({ name: 'Model' });
      const _class = model.createKind('Person');
      const attr = _class.createAttribute(_class, 'name', { id: '456' });

      const uriManager = getUriManager(model, { uriFormatBy: 'id' });
      const uri = uriManager.getUri(attr);
      expect(uri).toEqual(':456');
    });

    it('should generate id-based uri for relations', () => {
      const model = new Package({ name: 'Model' });
      const _class = model.createKind('Person');
      const relation = model.createMaterialRelation(_class, _class, 'knows', { id: 'abc' });

      const uriManager = getUriManager(model, { uriFormatBy: 'id' });
      const uri = uriManager.getUri(relation);
      expect(uri).toEqual(':abc');
    });

    it('should remove special characters from generated id-based uris', () => {});
  });

  describe("{uriFormatBy = 'name'}", () => {
    it('should generate name-based uri for classes', () => {
      const model = new Package({ name: 'Model' });
      const _class = model.createKind('Person');

      const uriManager = getUriManager(model, { uriFormatBy: 'name' });
      const uri = uriManager.getUri(_class);
      expect(uri).toEqual(':Person');
    });

    it('should generate normalized name-based uri for classes', () => {
      const model = new Package({ name: 'Model' });
      const _class = model.createKind('Happy Person');

      const uriManager = getUriManager(model, { uriFormatBy: 'name' });
      const uri = uriManager.getUri(_class);
      expect(uri).toEqual(':HappyPerson');
    });

    it('should generate name-based uri for attribute', () => {
      const model = new Package({ name: 'Model' });
      const _class = model.createKind('Person');
      const attr = _class.createAttribute(_class, 'name');

      const uriManager = getUriManager(model, { uriFormatBy: 'name' });
      const uri = uriManager.getUri(attr);
      expect(uri).toEqual(':name');
    });

    it('should generate normalized name-based uri for attribute', () => {
      const model = new Package({ name: 'Model' });
      const _class = model.createKind('Person');
      const attr = _class.createAttribute(_class, 'last name');

      const uriManager = getUriManager(model, { uriFormatBy: 'name' });
      const uri = uriManager.getUri(attr);
      expect(uri).toEqual(':lastName');
    });

    it('should generate name-based uri for relations', () => {
      const model = new Package({ name: 'Model' });
      const _class = model.createKind('Person');
      const relation = model.createMaterialRelation(_class, _class, 'knows');

      const uriManager = getUriManager(model, { uriFormatBy: 'name' });
      const uri = uriManager.getUri(relation);
      expect(uri).toEqual(':knows');
    });

    it('should generate normalized name-based uri for relations', () => {
      const model = new Package({ name: 'Model' });
      const _class = model.createKind('Person');
      const relation = model.createMaterialRelation(_class, _class, 'has friend');

      const uriManager = getUriManager(model, { uriFormatBy: 'name' });
      const uri = uriManager.getUri(relation);
      expect(uri).toEqual(':hasFriend');
    });

    it('should use target role name when relation name is empty', () => {
      const model = new Package({ name: 'Model' });
      const _class = model.createKind('Person');
      const relation = model.createMaterialRelation(_class, _class, '   ');

      relation.getTargetEnd().name = 'friend';

      const uriManager = getUriManager(model, { uriFormatBy: 'name' });
      const uri = uriManager.getUri(relation);
      expect(uri).toEqual(':friend');
    });

    it('should use target role name when relation name is null', () => {
      const model = new Package({ name: 'Model' });
      const _class = model.createKind('Person');
      const relation = model.createMaterialRelation(_class, _class, null);

      relation.getTargetClassEnd().name = 'friend';

      const uriManager = getUriManager(model, { uriFormatBy: 'name' });
      const uri = uriManager.getUri(relation);
      expect(uri).toEqual(':friend');
    });

    it("When the relation name and the target role name are missing, should create the relation's URI based on its stereotype, source and target classes: «material»", () => {
      const model = new Package({ name: 'Model' });
      const class1 = model.createKind('Person');
      const class2 = model.createKind('Car');
      const relation = model.createMaterialRelation(class1, class2, null);

      const uriManager = getUriManager(model, { uriFormatBy: 'name' });
      const uri = uriManager.getUri(relation);
      expect(uri).toEqual(':personHasCar');
    });

    it("When the relation name and the target role name are missing, should create the relation's URI based on its stereotype, source and target classes: «characterization»", () => {
      const model = new Package({ name: 'Model' });
      const class1 = model.createKind('Love');
      const class2 = model.createKind('Person');
      const relation = model.createCharacterizationRelation(class1, class2, null);

      const uriManager = getUriManager(model, { uriFormatBy: 'name' });
      const uri = uriManager.getUri(relation);
      expect(uri).toEqual(':loveInheresInPerson');
    });
  });
});
