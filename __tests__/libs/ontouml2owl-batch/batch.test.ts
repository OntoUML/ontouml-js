import { Project, serializationUtils } from '@libs/ontouml';
import { Ontouml2Owl } from '@libs/ontouml2owl';

var glob = require('glob');
var fs = require('fs');

describe('Properties', () => {
  beforeAll(() => {
    fs.rmSync('output/', { recursive: true, force: true });
    fs.mkdirSync('output/');

    const paths = glob.sync('../ontouml-models/**/ontology.json');

    for (const path of paths) {
      try {
        let sourcePath = path + '';
        const targetPath = 'output/' + sourcePath.match('([^/]+)/ontology.json')[1] + '.ttl';
        console.log(targetPath);

        const content = fs.readFileSync(path);
        const proj = serializationUtils.parse(content) as Project;
        const owlSerializer = new Ontouml2Owl(proj, 'http://example.com', 'dataset', 'Turtle');
        const { result } = owlSerializer.run();

        fs.writeFileSync(targetPath, result);
      } catch (e) {
        console.log('MODEL ' + path + ' is broken...');
        console.log(e);
      }
    }
  });

  it('empty', () => {});
});
