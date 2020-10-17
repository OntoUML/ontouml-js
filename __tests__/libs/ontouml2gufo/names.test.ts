import { RelationStereotype } from '@constants/.';
import { OntoumlFactory, generateGufo } from './helpers';

describe('Names to labels', () => {
  it('should generate labels without language tags when names are simple strings', async () => {
    const _class = OntoumlFactory.createKind('Person');
    const model = OntoumlFactory.createPackage(null, [_class]);
    const result = generateGufo(model);

    expect(result).toContain('<:Person> <rdfs:label> "Person"');
  });

  it('should generate language labels on classess using 2-letter IANA language tags (e.g. en, it)', async () => {
    const _class = OntoumlFactory.createKind('Person');
    _class.name = {
      en: 'Person',
      it: 'Persona'
    };

    const model = OntoumlFactory.createPackage(null, [_class]);
    const result = generateGufo(model);

    expect(result).toContain('<:Person> <rdfs:label> "Person"@en');
    expect(result).toContain('<:Person> <rdfs:label> "Persona"@it');
  });

  it('should generate language labels on classess using composed IANA language tags (e.g. en-us, pt-br)', async () => {
    const _class = OntoumlFactory.createKind('Person');
    _class.name = {
      'en-us': 'Person',
      'pt-br': 'Pessoa'
    };

    const model = OntoumlFactory.createPackage(null, [_class]);
    const result = generateGufo(model);

    expect(result).toContain('<:Person> <rdfs:label> "Person"@en-us');
    expect(result).toContain('<:Person> <rdfs:label> "Pessoa"@pt-br');
  });

  it('should NOT generate language labels for invalid IANA language tags (e.g. ens, it-trento, xyz)', async () => {
    const _class = OntoumlFactory.createKind('Person');
    _class.id = '123';
    _class.name = {
      ens: 'Person',
      'it-trento': 'Persona',
      xyz: 'Persoon'
    };

    const model = OntoumlFactory.createPackage(null, [_class]);
    const result = generateGufo(model);

    expect(result).not.toContain('<:123> <rdfs:label> "Persona"@it-trento');
    expect(result).not.toContain('<:123> <rdfs:label> "Person"@ens');
    expect(result).not.toContain('<:123> <rdfs:label> "Persoon"@xyz');
  });

  it('should generate language labels on attributes (e.g. nl, pt)', async () => {
    const _class = OntoumlFactory.createKind('Person');
    const datatype = OntoumlFactory.createKind('string');
    const attr = OntoumlFactory.addAttribute(_class, 'name', datatype);
    attr.name = {
      nl: 'naam',
      pt: 'nome'
    };

    const model = OntoumlFactory.createPackage(null, [_class, datatype]);
    const result = generateGufo(model);

    expect(result).toContain('<:naam> <rdfs:label> "naam"@nl');
    expect(result).toContain('<:naam> <rdfs:label> "nome"@pt');
  });

  it('should generate language labels on relations (e.g. de, sv)', async () => {
    const _class = OntoumlFactory.createKind('Person');
    const relation = OntoumlFactory.createRelation('knows', RelationStereotype.MATERIAL, _class, _class);
    relation.name = {
      de: 'kennt',
      sv: 'känner'
    };

    const model = OntoumlFactory.createPackage(null, [_class, relation]);
    const result = generateGufo(model);

    expect(result).toContain('<:kennt> <rdfs:label> "kennt"@de');
    expect(result).toContain('<:kennt> <rdfs:label> "känner"@sv');
  });
});
