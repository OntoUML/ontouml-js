import { RelationStereotype } from '@constants/.';
import Options from '@libs/ontouml2gufo/options';
import { getUri } from '@libs/ontouml2gufo/uri_manager';
import { OntoumlFactory } from './helpers';

const createFormatByIdOption = (): Options => {
  return new Options({ uriFormatBy: 'id' });
};

const createFormatByNameOption = (): Options => {
  return new Options({ uriFormatBy: 'name' });
};

describe('URI generation', () => {
  describe("{ uriFormatBy = 'id' }", () => {
    it('should generate id-based uri for classes', () => {
      const opts = createFormatByIdOption();
      const _class = OntoumlFactory.cloneKind({ id: '123', name: 'Person' });
      const uri = getUri(_class, opts);
      expect(uri).toEqual(':123');
    });

    it('should generate id-based uri for attribute', () => {
      const opts = createFormatByIdOption();
      const _class = OntoumlFactory.createKind('Person');
      const attr = OntoumlFactory.addAttribute(_class, 'name', _class);
      attr.id = '456';
      const uri = getUri(attr, opts);
      expect(uri).toEqual(':456');
    });

    it('should generate id-based uri for relations', () => {
      const opts = createFormatByIdOption();
      const _class = OntoumlFactory.createKind('Person');
      const relation = OntoumlFactory.createRelation('knows', RelationStereotype.MATERIAL, _class, _class);
      relation.id = 'abc';
      const uri = getUri(relation, opts);
      expect(uri).toEqual(':abc');
    });

    it('should remove special characters from generated id-based uris', () => {});
  });

  describe("{uriFormatBy = 'name'}", () => {
    it('should generate name-based uri for classes', () => {
      const _class = OntoumlFactory.cloneKind({ name: 'Person' });

      const uri = getUri(_class, createFormatByNameOption());
      expect(uri).toEqual(':Person');
    });

    it('should generate normalized name-based uri for classes', () => {
      const _class = OntoumlFactory.cloneKind({ name: 'Happy Person' });

      const uri = getUri(_class, createFormatByNameOption());
      expect(uri).toEqual(':HappyPerson');
    });

    it('should generate name-based uri for attribute', () => {
      const _class = OntoumlFactory.createKind('Person');
      const attr = OntoumlFactory.addAttribute(_class, 'name', _class);

      const uri = getUri(attr, createFormatByNameOption());
      expect(uri).toEqual(':name');
    });

    it('should generate normalized name-based uri for attribute', () => {
      const _class = OntoumlFactory.createKind('Person');
      const attr = OntoumlFactory.addAttribute(_class, 'last name', _class);

      const uri = getUri(attr, createFormatByNameOption());
      expect(uri).toEqual(':lastName');
    });

    it('should generate name-based uri for relations', () => {
      const _class = OntoumlFactory.createKind('Person');
      const relation = OntoumlFactory.createRelation('knows', RelationStereotype.MATERIAL, _class, _class);

      const uri = getUri(relation, createFormatByNameOption());
      expect(uri).toEqual(':knows');
    });

    it('should generate normalized name-based uri for relations', () => {
      const _class = OntoumlFactory.createKind('Person');
      const relation = OntoumlFactory.createRelation('has friend', RelationStereotype.MATERIAL, _class, _class);

      const uri = getUri(relation, createFormatByNameOption());
      expect(uri).toEqual(':hasFriend');
    });

    it('should use target role name when relation name is empty', () => {
      const _class = OntoumlFactory.createKind('Person');
      const relation = OntoumlFactory.createRelation('', RelationStereotype.MATERIAL, _class, _class);
      relation.properties[1].name = 'friend';

      const uri = getUri(relation, createFormatByNameOption());
      expect(uri).toEqual(':friend');
    });

    it('should use target role name when relation name is null', () => {
      const _class = OntoumlFactory.createKind('Person');
      const relation = OntoumlFactory.createRelation(null, RelationStereotype.MATERIAL, _class, _class);
      relation.properties[1].name = 'friend';

      const uri = getUri(relation, createFormatByNameOption());
      expect(uri).toEqual(':friend');
    });

    it("When the relation name and the target role name are missing, should create the relation's URI based on its stereotype, source and target classes: «material»", () => {
      const class1 = OntoumlFactory.createKind('Person');
      const class2 = OntoumlFactory.createKind('Car');
      const relation = OntoumlFactory.createRelation(null, RelationStereotype.MATERIAL, class1, class2, true);

      const uri = getUri(relation, createFormatByNameOption());
      expect(uri).toEqual(':personHasCar');
    });

    it("When the relation name and the target role name are missing, should create the relation's URI based on its stereotype, source and target classes: «characterization»", () => {
      const class1 = OntoumlFactory.createKind('Love');
      const class2 = OntoumlFactory.createKind('Person');
      const relation = OntoumlFactory.createRelation(null, RelationStereotype.CHARACTERIZATION, class1, class2, true);

      const uri = getUri(relation, createFormatByNameOption());
      expect(uri).toEqual(':loveInheresInPerson');
    });
  });
});
