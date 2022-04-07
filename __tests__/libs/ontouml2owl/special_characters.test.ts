import { Project } from '@libs/ontouml';
import { generateOwl } from './helpers';

const prefix = 't';
const baseUri = 'http://test.com/';

describe("Special characters (~.-!$&'()*+,;=/?#@%_)", () => {
  let result: string;

  beforeEach(() => {
    const project = new Project();
    const model = project.createModel();
    model.createKind(null, { id: 'c1:' });
    model.createKind(null, { id: 'c2.' });
    model.createKind(null, { id: '/c3' });
    model.createKind(null, { id: '#c#4' });

    result = generateOwl(project, baseUri, prefix, 'Turtle');
  });

  it('should generate valid turtle data with class id with a colon (:)', () => {
    expect(result).toContain('<http://test.com/c1:> rdf:type ontouml:Class');
  });

  it('should generate valid turtle data with class id with a period (.)', () => {
    expect(result).toContain('<http://test.com/c2.> rdf:type ontouml:Class');
  });

  it('should generate valid turtle data with class id with a forward slash (/)', () => {
    expect(result).toContain('<http://test.com//c3> rdf:type ontouml:Class');
  });

  it('should generate valid turtle data with class id with a hashtag (#)', () => {
    expect(result).toContain('<http://test.com/#c#4> rdf:type ontouml:Class');
  });
});
