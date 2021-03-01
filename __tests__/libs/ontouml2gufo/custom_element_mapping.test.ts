import { generateGufo } from './helpers';
import { Package } from '@libs/ontouml';

describe('Custom labels', () => {
  it("should use the labels defined in the transformation's options to generate class' labels", () => {
    const model = new Package();
    model.createKind('Person');

    const result = generateGufo(model, {
      customElementMapping: {
        Person: {
          label: { en: 'Person', pt: 'Pessoa' }
        }
      }
    });

    expect(result).toContain('<:Person> <rdfs:label> "Person"@en');
    expect(result).toContain('<:Person> <rdfs:label> "Pessoa"@pt');
  });

  it("should use the uri defined in the transformation's options to generate the class' URI", () => {
    const model = new Package();
    model.createKind('Person');

    const result = generateGufo(model, {
      customElementMapping: {
        Person: {
          uri: 'OWLPerson'
        }
      }
    });

    expect(result).not.toContain('<:Person>');
    expect(result).toContain('<:OWLPerson> <rdf:type> <owl:Class>');
    expect(result).toContain('<:OWLPerson> <rdfs:label> "Person"');
  });

  it("should use the labels defined in the transformation's options to generate the relation's labels", () => {
    const model = new Package();
    const _class = model.createKind('Person');
    model.createMaterialRelation(_class, _class, 'likes');
    model.addName('Model');

    const result = generateGufo(model, {
      customElementMapping: {
        likes: {
          label: { it: 'piace', pt: 'gosta' }
        }
      }
    });

    expect(result).toContain('<:likes> <rdfs:label> "piace"@it');
    expect(result).toContain('<:likes> <rdfs:label> "gosta"@pt');
  });

  it("should use the uri defined in the transformation's options to generate the relation's URI", () => {
    const model = new Package();
    const _class = model.createKind('Person');
    model.createMaterialRelation(_class, _class, 'likes');
    model.addName('Model');

    const result = generateGufo(model, {
      customElementMapping: {
        likes: {
          uri: 'owlLikes'
        }
      }
    });

    expect(result).not.toContain('<:likes>');
    expect(result).toContain('<:owlLikes> <rdf:type> <owl:ObjectProperty> .');
    expect(result).toContain('<:owlLikes> <rdfs:label> "likes"');
  });

  it("should use the lables defined in the transformation's options to generate the attribute's labels", () => {
    const model = new Package();
    const _class = model.createKind('Person');
    const datatype = model.createDatatype('string');
    _class.createAttribute(datatype, 'name');

    const result = generateGufo(model, {
      customElementMapping: {
        name: {
          label: { es: 'nome', nl: 'naam' }
        }
      }
    });

    expect(result).toContain('<:name> <rdfs:label> "nome"@es');
    expect(result).toContain('<:name> <rdfs:label> "naam"@nl');
  });

  it("should use the uri defined in the transformation's options to generate the attribute's URI", () => {
    const model = new Package();
    const _class = model.createKind('Person');
    const datatype = model.createDatatype('string');
    _class.createAttribute(datatype, 'name');

    const result = generateGufo(model, {
      customElementMapping: {
        name: {
          uri: 'owlName'
        }
      }
    });

    expect(result).not.toContain('<:name>');
    expect(result).toContain('<:owlName> <rdf:type> <owl:DatatypeProperty> .');
    expect(result).toContain('<:owlName> <rdfs:label> "name"');
  });
});
