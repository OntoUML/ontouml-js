import { RelationStereotype } from '@constants/.';
import { OntoumlFactory, generateGufo } from './helpers';

describe('Names in multiple languages', () => {
  it('should generate language labels on classess (testing with nl, pt, en, and it)', async () => {
    const _class = OntoumlFactory.createKind('Person');
    _class.name = {
      en: 'Person',
      it: 'Persona',
      nl: 'Persoon',
      pt: 'Pessoa'
    };

    const model = OntoumlFactory.createPackage(null, [_class]);
    const result = generateGufo(model);

    expect(result).toContain('<:Person> <rdfs:label> "Person"@en');
    expect(result).toContain('<:Person> <rdfs:label> "Persona"@it');
    expect(result).toContain('<:Person> <rdfs:label> "Persoon"@nl');
    expect(result).toContain('<:Person> <rdfs:label> "Pessoa"@pt');
  });

  it('should generate language labels on attributes (testing with nl, pt, en, and it)', async () => {
    const _class = OntoumlFactory.createKind('Person');
    const datatype = OntoumlFactory.createKind('string');
    const attr = OntoumlFactory.addAttribute(_class, 'name', datatype);
    attr.name = {
      en: 'name',
      it: 'nome',
      nl: 'naam',
      pt: 'nome'
    };

    const model = OntoumlFactory.createPackage(null, [_class]);
    const result = generateGufo(model);

    expect(result).toContain('<:name> <rdfs:label> "naam"@nl');
    expect(result).toContain('<:name> <rdfs:label> "nome"@pt');
    expect(result).toContain('<:name> <rdfs:label> "name"@en');
    expect(result).toContain('<:name> <rdfs:label> "nome"@it');
  });

  it('should generate language labels on classess (testing with nl, pt, en, and it)', async () => {
    const _class = OntoumlFactory.createKind('Person');
    const relation = OntoumlFactory.createRelation('knows', RelationStereotype.MATERIAL, _class, _class);
    relation.name = {
      en: 'knows',
      it: 'conosce',
      nl: 'kent',
      pt: 'conhece'
    };

    const model = OntoumlFactory.createPackage(null, [_class, relation]);
    const result = generateGufo(model);

    expect(result).toContain('<:knows> <rdfs:label> "knows"@en');
    expect(result).toContain('<:knows> <rdfs:label> "conosce"@it');
    expect(result).toContain('<:knows> <rdfs:label> "kent"@nl');
    expect(result).toContain('<:knows> <rdfs:label> "conhece"@pt');
  });
});
