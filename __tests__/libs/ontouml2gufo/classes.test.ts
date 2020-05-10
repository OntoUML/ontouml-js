import {
  mixinExample1,
  modeExample1,
  modeExample2,
  relatorExample1,
  roleExample1,
  alpinebits,
} from '@test-models/valids';
import { transformOntoUML2GUFO } from './helpers';

describe('Classes', () => {
  it('should transform OntoUML <<mixin>> class', async () => {
    const result = (await transformOntoUML2GUFO(mixinExample1, {
      uriFormatBy: 'id',
    })).model;

    expect(result).toContain('<:yhVoWg6DAAAARSb> <rdf:type> <owl:Class>');
    expect(result).toContain(
      '<:yhVoWg6DAAAARSb> <rdf:type> <owl:NamedIndividual>',
    );
    expect(result).toContain('<:yhVoWg6DAAAARSb> <rdfs:label> "Seatable"');
    expect(result).toContain(
      '<:yhVoWg6DAAAARSb> <rdfs:subClassOf> <gufo:Object>',
    );
    expect(result).toContain('<:yhVoWg6DAAAARSb> <rdf:type> <gufo:Mixin>');
  });

  it('should transform OntoUML generalization set', async () => {
    const result = (await transformOntoUML2GUFO(mixinExample1)).model;

    expect(result).toContain('<:Crate> <owl:equivalentClass>');
    expect(result).toContain('<owl:unionOf> (<:BrokenCrate> <:SolidCrate>');
  });

  it('should transform OntoUML <<mode>> class as IntrinsicMode', async () => {
    const result = (await transformOntoUML2GUFO(modeExample1, {
      uriFormatBy: 'id',
    })).model;

    expect(result).toContain('<:qJdeWA6AUB0UtAWm> <rdf:type> <owl:Class>');
    expect(result).toContain(
      '<:qJdeWA6AUB0UtAWm> <rdf:type> <owl:NamedIndividual>',
    );
    expect(result).toContain('<:qJdeWA6AUB0UtAWm> <rdfs:label> "Headache" .');
    expect(result).toContain(
      '<:qJdeWA6AUB0UtAWm> <rdfs:subClassOf> <gufo:IntrinsicMode>',
    );
    expect(result).toContain('<:qJdeWA6AUB0UtAWm> <rdf:type> <gufo:Kind>');
  });

  it('should transform OntoUML <<mode>> class as ExtrinsicMode', async () => {
    const result = (await transformOntoUML2GUFO(modeExample2, {
      uriFormatBy: 'id',
    })).model;

    expect(result).toContain('<:qJdeWA6AUB0UtAWm> <rdf:type> <owl:Class>');
    expect(result).toContain(
      '<:qJdeWA6AUB0UtAWm> <rdf:type> <owl:NamedIndividual>',
    );
    expect(result).toContain('<:qJdeWA6AUB0UtAWm> <rdfs:label> "Love" .');
    expect(result).toContain(
      '<:qJdeWA6AUB0UtAWm> <rdfs:subClassOf> <gufo:ExtrinsicMode>',
    );
    expect(result).toContain('<:qJdeWA6AUB0UtAWm> <rdf:type> <gufo:Kind>');
  });

  it('should transform OntoUML <<relator>> class', async () => {
    const result = (await transformOntoUML2GUFO(relatorExample1, {
      uriFormatBy: 'id',
    })).model;

    expect(result).toContain('<:SzOFmg6DAAAAQuF> <rdf:type> <owl:Class>');
    expect(result).toContain(
      '<:SzOFmg6DAAAAQuF> <rdf:type> <owl:NamedIndividual>',
    );
    expect(result).toContain('<:SzOFmg6DAAAAQuF> <rdfs:label> "Marriage"');
    expect(result).toContain(
      '<:SzOFmg6DAAAAQuF> <rdfs:subClassOf> <gufo:Relator>',
    );
    expect(result).toContain('<:SzOFmg6DAAAAQuF> <rdf:type> <gufo:Kind>');
  });

  it('should transform OntoUML <<role>> class', async () => {
    const result = (await transformOntoUML2GUFO(roleExample1, {
      uriFormatBy: 'id',
    })).model;

    // it's Husband a <<role>>
    expect(result).toContain('<:zT5mg6DAAAAQsY> <rdf:type> <owl:Class>');
    expect(result).toContain(
      '<:zT5mg6DAAAAQsY> <rdf:type> <owl:NamedIndividual>',
    );
    expect(result).toContain('<:zT5mg6DAAAAQsY> <rdfs:label> "Husband"');
    expect(result).toContain('<:zT5mg6DAAAAQsY> <rdf:type> <gufo:Role>');

    // <<role>> Husband subclass of <<subkind>> Man
    expect(result).toContain(
      '<:zT5mg6DAAAAQsY> <rdfs:subClassOf> <:ech5mg6DAAAAQqj>',
    );
    expect(result).toContain('<:ech5mg6DAAAAQqj> <rdf:type> <gufo:SubKind> ');
    expect(result).toContain('<:ech5mg6DAAAAQqj> <rdfs:label> "Man"');

    // <<subkind>> Man is subclass of <<kind>> Person
    expect(result).toContain(
      '<:ech5mg6DAAAAQqj> <rdfs:subClassOf> <:IsW5mg6DAAAAQqE>',
    );
    expect(result).toContain('<:IsW5mg6DAAAAQqE> <rdf:type> <gufo:Kind>');
    expect(result).toContain(
      '<:IsW5mg6DAAAAQqE> <rdfs:subClassOf> <gufo:FunctionalComplex>',
    );
    expect(result).toContain('<:IsW5mg6DAAAAQqE> <rdfs:label> "Person"');
  });

  it('should transform <<enumeration>> class', async () => {
    const result = (await transformOntoUML2GUFO(alpinebits)).model;

    expect(result).toContain(
      `<:SnowparkDifficulty> <owl:equivalentClass> [
      <rdf:type> <owl:Class>;
      <owl:oneOf> (<:S> <:M> <:L> <:XL>)
    ] .`.replace(/ {4}/gm, ''),
    );
  });

  it('should generate custom labels', async () => {
    const result = (await transformOntoUML2GUFO(alpinebits, {
      customElementMapping: {
        JoK2ZeaGAqACBxS5: {
          uri: 'OWLPerson',
          label: { default: 'OWLPerson', en: 'Person', pt: 'Pessoa' },
        },
        Organization: { uri: 'OWLOrganization' },
        'Event Plan': { uri: 'OWLEventPlan' },
      },
    })).model;

    expect(result).toContain('<:OWLPerson> <rdf:type> <owl:Class>');
    expect(result).toContain('<:OWLPerson> <rdfs:label> "Person"@en');
    expect(result).toContain('<:OWLPerson> <rdfs:label> "Pessoa"@pt');
    expect(result).toContain('<:OWLOrganization> <rdf:type> <owl:Class>');
    expect(result).toContain('<:OWLEventPlan> <rdf:type> <owl:Class>');
  });
});
