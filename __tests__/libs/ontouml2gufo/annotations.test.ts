import { annotations as annotationsModel } from '@test-models/valids';
import { transformOntoUML2GUFO } from './helpers';

describe('Annotations', () => {
  let annotations;

  beforeAll(async () => {
    annotations = (await transformOntoUML2GUFO(annotationsModel)).model;
  });

  it('should generate language labels on classess (testing with nl, pt, en, and it)', async () => {
    expect(annotations).toContain('<:Person> <rdfs:label> "Persoon"@nl');
    expect(annotations).toContain('<:Person> <rdfs:label> "Pessoa"@pt');
    expect(annotations).toContain('<:Person> <rdfs:label> "Person"@en');
    expect(annotations).toContain('<:Person> <rdfs:label> "Persona"@it');
  });

  it('should generate language labels on attributes (testing with nl, pt, en, and it)', async () => {
    expect(annotations).toContain('<:name> <rdfs:label> "naam"@nl');
    expect(annotations).toContain('<:name> <rdfs:label> "nome"@pt');
    expect(annotations).toContain('<:name> <rdfs:label> "name"@en');
    expect(annotations).toContain('<:name> <rdfs:label> "nome"@it');
  });

  it('should generate language labels on classess (testing with nl, pt, en, and it)', async () => {
    expect(annotations).toContain('<:RegardsEmployee> <rdfs:label> "betreft werknemer"@nl');
    expect(annotations).toContain('<:RegardsEmployee> <rdfs:label> "de empregado"@pt');
    expect(annotations).toContain('<:RegardsEmployee> <rdfs:label> "regards employee"@en');
    expect(annotations).toContain('<:RegardsEmployee> <rdfs:label> "di dipendente"@it');
  });

  it('should generate class "description" as a rdfs:comment', async () => {
    expect(annotations).toContain('<:Person> <rdfs:comment> "This is a description of the person class."');
  });

  it('should generate attribute "description" as a rdfs:comment', async () => {
    expect(annotations).toContain(
      '<:name> <rdfs:comment> "This is the description of the attribute name in of the person class."',
    );
  });

  it('should generate association "description" as a rdfs:comment', async () => {
    expect(annotations).toContain(
      '<:RegardsEmployee> <rdfs:comment> "This is the description of the <<mediation>> association between the classes employment and person."',
    );
  });
});
