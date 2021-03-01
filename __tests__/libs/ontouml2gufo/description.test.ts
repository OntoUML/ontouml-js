import { generateGufo } from './helpers';
import { Package } from '@libs/ontouml';

describe('Descriptions to rdfs:comments', () => {
  it('should generate class "description" as a rdfs:comment', () => {
    const model = new Package();
    const _class = model.createKind('Person');
    const description = 'This is a description of the person class.';
    _class.addDescription(description);

    const result = generateGufo(model);

    expect(result).toContain('<:Person> <rdfs:comment> "' + description + '"');
  });

  it('should generate attribute "description" as a rdfs:comment', () => {
    const model = new Package();
    const _class = model.createKind('Person');
    const datatype = model.createDatatype('string');
    const attr = _class.createAttribute(datatype, 'name');
    const description = 'This is the description of the attribute name in of the person class.';

    attr.addDescription(description);

    const result = generateGufo(model);

    expect(result).toContain('<:name> <rdfs:comment> "' + description + '"');
  });

  it('should generate association "description" as a rdfs:comment', () => {
    const model = new Package();
    const _class = model.createKind('Person');
    const relation = model.createMaterialRelation(_class, _class, 'knows');
    const description = 'This is the description of the relation knows.';

    relation.addDescription(description);

    const result = generateGufo(model);

    expect(result).toContain('<:knows> <rdfs:comment> "' + description + '"');

    const regex = new RegExp(description, 'g');
    var matches = (result.match(regex) || []).length;
    expect(matches).toEqual(1);
  });
});
