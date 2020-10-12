import { RelationStereotype } from '@constants/.';
import Options from '@libs/ontouml2gufo/options';
import UriManager, { getUri } from '@libs/ontouml2gufo/uri_manager';
import { OntoumlFactory } from './helpers';

// TODO: Make Optionsthis into a class
const createFormatByIdOption = (): Options => {
  return new Options({ uriFormatBy: 'id', uriManager: new UriManager() });
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
    it('should generate an uri automatically using association end', () => {
      const personClass = OntoumlFactory.createKind('Person');
      const knowsRelation = OntoumlFactory.createRelation('knows', RelationStereotype.MATERIAL, personClass, personClass);

      const data = [
        '<:historicallyDependsOnKeynoteInvitation> <rdfs:subPropertyOf> <gufo:historicallyDependsOn> .',
        '<:mediatesKeynoteSpeaker> <rdfs:subPropertyOf> <gufo:mediates> .',
        '<:isProperPartOfPerson> <rdfs:subPropertyOf> <gufo:isObjectProperPartOf> .'
      ];

      for (const value of data) {
        expect(partWhole).toContain(value);
      }
    });

    it("should generate an uri automatically using the relation's stereotype", () => {
      const data = ['<:organizer> <rdf:type> <owl:ObjectProperty>'];

      // for (const value of data) {
      //   expect(alpinebits).toContain(value);
      // }
    });
  });
});
