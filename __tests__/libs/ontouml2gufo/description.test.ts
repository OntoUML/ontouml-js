import { RelationStereotype } from '@constants/.';
import { OntoumlFactory, generateGufo } from './helpers';

describe('Descriptions to rdfs:comments', () => {
  it('should generate class "description" as a rdfs:comment', async () => {
    const _class = OntoumlFactory.createKind('Person');

    const description = 'This is a description of the person class.';
    _class.description = description;

    const model = OntoumlFactory.createPackage(null, [_class]);
    const result = generateGufo(model)

    expect(result).toContain('<:Person> <rdfs:comment> "' + description + '"');
  });

  it('should generate attribute "description" as a rdfs:comment', async () => {
    const _class = OntoumlFactory.createKind('Person');
    const datatype = OntoumlFactory.createDatatype('string');
    const attr = OntoumlFactory.addAttribute(_class, 'name', datatype);

    const description = 'This is the description of the attribute name in of the person class.';
    attr.description = description;

    const model = OntoumlFactory.createPackage(null, [_class, datatype]);
    const result = generateGufo(model)

    expect(result).toContain('<:name> <rdfs:comment> "' + description + '"');
  });

  it('should generate association "description" as a rdfs:comment', async () => {
    const _class = OntoumlFactory.createKind('Person');
    const relation = OntoumlFactory.createRelation('knows', RelationStereotype.MATERIAL, _class, _class);

    const description = 'This is the description of the relation knows.';
    relation.description = description;

    const model = OntoumlFactory.createPackage(null, [_class, relation]);
    const result = generateGufo(model)

    expect(result).toContain('<:knows> <rdfs:comment> "' + description + '"');

    const regex = new RegExp(description, 'g');
    var matches = (result.match(regex) || []).length;
    expect(matches).toEqual(1);
  });
});
