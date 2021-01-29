import { generateGufo } from './helpers';
import { Package } from '@libs/ontouml';

describe('Names to labels', () => {
  it('should generate labels without language tags when names are simple strings', () => {
    const model = new Package();
    model.createKind('Person');
    const result = generateGufo(model);

    expect(result).toContain('<:Person> <rdfs:label> "Person"');
  });

  it('should generate language labels on classess using 2-letter IANA language tags (e.g. en, it)', () => {
    const model = new Package();
    model.createKind({
      en: 'Person',
      it: 'Persona'
    });
    const result = generateGufo(model);

    expect(result).toContain('<:Person> <rdfs:label> "Person"@en');
    expect(result).toContain('<:Person> <rdfs:label> "Persona"@it');
  });

  it('should generate language labels on classess using composed IANA language tags (e.g. en-us, pt-br)', () => {
    const model = new Package();
    model.createKind({
      'en-us': 'Person',
      'pt-br': 'Pessoa'
    });
    const result = generateGufo(model);

    expect(result).toContain('<:Person> <rdfs:label> "Person"@en-us');
    expect(result).toContain('<:Person> <rdfs:label> "Pessoa"@pt-br');
  });

  it('should NOT generate language labels for invalid IANA language tags (e.g. ens, it-trento, xyz)', () => {
    const model = new Package();
    model.createKind(
      {
        ens: 'Person',
        'it-trento': 'Persona',
        xyz: 'Persoon'
      },
      { id: '123' }
    );
    const result = generateGufo(model);

    expect(result).not.toContain('<:123> <rdfs:label> "Persona"@it-trento');
    expect(result).not.toContain('<:123> <rdfs:label> "Person"@ens');
    expect(result).not.toContain('<:123> <rdfs:label> "Persoon"@xyz');
  });

  it('should generate language labels on attributes (e.g. nl, pt)', () => {
    const model = new Package();
    const person = model.createKind('Person');
    const datatype = model.createKind('string');

    person.createAttribute(datatype, { nl: 'naam', pt: 'nome' });

    const result = generateGufo(model);

    expect(result).toContain('<:naam> <rdfs:label> "naam"@nl');
    expect(result).toContain('<:naam> <rdfs:label> "nome"@pt');
  });

  it('should generate language labels on relations (e.g. de, sv)', () => {
    const model = new Package();
    const person = model.createKind('Person');

    model.createMaterialRelation(person, person, { de: 'kennt', sv: 'känner' });

    const result = generateGufo(model);

    expect(result).toContain('<:kennt> <rdfs:label> "kennt"@de');
    expect(result).toContain('<:kennt> <rdfs:label> "känner"@sv');
  });
});
