import { Project, ClassStereotype } from '@libs/ontouml';
import { generateOwl } from './helpers';

const prefix = 't';
const baseUri = 'http://test.com/';

describe('Classes', () => {
  let result: string;

  beforeEach(() => {
    let project = new Project();
    let model = project.createModel();
    model.createKind(null, { id: 'c1' });
    model.createEvent(null, { id: 'c2' });
    model.createClass(null, null, null, { id: 'c3' });
    model.createClass(null, 'role mixin', null, { id: 'c4' });
    model.createClass(null, 'role;mixin', null, { id: 'c5' });
    model.createClass(null, 'role.mixin.', null, { id: 'c6' });

    result = generateOwl(project, baseUri, prefix);
  });

  it('should generate kind stereotype triple', () => {
    expect(result).toContain(
      '<http://test.com/c1> <https://purl.org/ontouml-metamodel#stereotype> <https://purl.org/ontouml-metamodel#kind>'
    );
  });

  it('should generate event stereotype triple', () => {
    expect(result).toContain(
      '<http://test.com/c2> <https://purl.org/ontouml-metamodel#stereotype> <https://purl.org/ontouml-metamodel#event>'
    );
  });

  it('should NOT generate stereotype triple', () => {
    expect(result).not.toContain('<http://test.com/c3> <https://purl.org/ontouml-metamodel#stereotype>');
  });

  it('should handle spaces in user-defined stereotypes', () => {
    expect(result).toContain(
      '<http://test.com/c4> <https://purl.org/ontouml-metamodel#stereotype> <https://purl.org/ontouml-metamodel#role mixin>'
    );
  });

  it("should handle special characters (~.-!$&'()*+,;=/?#@%_) in user-defined stereotypes", () => {
    expect(result).toContain(
      '<http://test.com/c5> <https://purl.org/ontouml-metamodel#stereotype> <https://purl.org/ontouml-metamodel#role;mixin>'
    );
    expect(result).toContain(
      '<http://test.com/c6> <https://purl.org/ontouml-metamodel#stereotype> <https://purl.org/ontouml-metamodel#role.mixin.>'
    );
  });
});
