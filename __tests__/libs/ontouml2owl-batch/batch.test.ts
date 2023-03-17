import { Project, serializationUtils } from '@libs/ontouml';
import { Ontouml2Owl, Metadata2Owl, Metadata } from '@libs/ontouml2owl';
import { Writer, StreamWriter } from 'n3';

const N3 = require('n3');
var glob = require('glob');
var fs = require('fs');
const yaml = require('js-yaml');

function getOntologyUri(folderName: string): string {
  return 'https://w3id.org/ontouml-models/turtle/' + folderName + '#';
}

describe('Metadata', () => {
  it('Generate turtle files', async () => {
    const parser = new N3.Parser({ format: 'Turtle' });
    const writer = new N3.Writer({
      format: 'Turtle',
      prefixes: {
        ocmv: 'https://w3id.org/ontouml-models/vocabulary#',
        rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
        rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
        owl: 'http://www.w3.org/2002/07/owl#',
        xsd: 'http://www.w3.org/2001/XMLSchema#',
        dct: 'http://purl.org/dc/terms/',
        dcat: 'http://www.w3.org/ns/dcat#',
        skos: 'http://www.w3.org/2004/02/skos/core#',
        mod: 'https://w3id.org/mod#',
        lcc: 'http://id.loc.gov/authorities/classification/',
        foaf: 'http://xmlns.com/foaf/0.1/'
      }
    });

    const paths = glob.sync('../ontouml-models/**/ontology.json');
    for (const path of paths) {
      let folderName: string;
      let ontologyUri: string;

      console.log(path);

      try {
        folderName = path.match('([^/]+)/ontology.json')[1];
        ontologyUri = getOntologyUri(folderName);
        let jsonRaw = fs.readFileSync(path);
        let project = serializationUtils.parse(jsonRaw) as Project;

        const owlSerializer = new Ontouml2Owl(project, ontologyUri, null, 'Turtle');
        const { result } = owlSerializer.run();

        const outputOntologyPath = '../ontouml-models/models/' + folderName + '/ontology.ttl';
        fs.writeFileSync(outputOntologyPath, result);

        await parser.parse(result, (error, quad, prefixes) => {
          if (quad) writer.addQuad(quad);
        });
      } catch (e) {
        console.log('Could not generate ontology TTL file  of ' + path);
        console.log(e);
      }

      try {
        const metadataPath = '../ontouml-models/models/' + folderName + '/metadata.yaml';
        const yamlRaw = fs.readFileSync(metadataPath, 'utf-8');
        const metadata = yaml.load(yamlRaw);

        const metadataTransformer = new Metadata2Owl(metadata, ontologyUri, 'Turtle', folderName);
        const { result } = metadataTransformer.run();

        const outputMetadataPath = '../ontouml-models/models/' + folderName + '/metadata.ttl';
        fs.writeFileSync(outputMetadataPath, result);

        await parser.parse(result, (error, quad, prefixes) => {
          if (quad) writer.addQuad(quad);
        });
      } catch (e) {
        console.log('Could not generate metadata TTL file of ' + path);
        console.log(e);
      }
    }

    const catalog = `
    @prefix ontouml: <https://w3id.org/ontouml#> .
    @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
    @prefix dct: <http://purl.org/dc/terms/> .
    @prefix dcat: <http://www.w3.org/ns/dcat#> .
    @prefix foaf: <http://xmlns.com/foaf/0.1/> .

    <https://w3id.org/ontouml-models/catalog> a dcat:Catalog ;
        dct:title "OntoUML Model Catalog"@en ;
        rdfs:label "OntoUML Model Catalog"@en ;
        foaf:homepage <https://w3id.org/ontouml-models> ;
        dcat:themeTaxonomy <http://id.loc.gov/authorities/classification> ;
        dcat:distribution <https://w3id.org/ontouml-models/catalog/turtle> ;
        dct:publisher <https://www.inf.unibz.it/krdb/core/> ;
        dct:contributor <https://orcid.org/0000-0002-5385-5761>, <https://orcid.org/0000-0003-2736-7817>, <https://orcid.org/0000-0003-2528-3118>, <https://orcid.org/0000-0002-6661-6292>, <https://orcid.org/0000-0002-0952-9571>, <https://orcid.org/0000-0002-2384-3081>, <https://orcid.org/0000-0002-3452-553X>, <https://github.com/AndrasKomaromi>, <https://orcid.org/0000-0001-5010-3081>, <https://orcid.org/0000-0003-1547-8333>, <https://dblp.org/pid/309/4924>, <https://github.com/TvanEe>, <https://orcid.org/0000-0002-8139-5977>, <https://orcid.org/0000-0003-3385-4769> ;

    <https://www.inf.unibz.it/krdb/core/> rdfs:label "Conceptual and Cognitive Modelling Research Group (CORE)"@en ;
        a foaf:Organization .

    <https://w3id.org/ontouml-models/catalog/turtle> a dcat:Distribution ;
        dcat:downloadURL <https://raw.githubusercontent.com/unibz-core/ontouml-models/master/catalog.ttl> ;
        dct:title "Turtle distribution of the OntoUML Model Catalog"@en ;
        dcat:mediaType <https://www.iana.org/assignments/media-types/text/turtle> ;
    `;
    await parser.parse(catalog, (error, quad, prefixes) => {
      if (quad) writer.addQuad(quad);
    });

    writer.end((error, result) => {
      if (error) throw error;
      fs.writeFileSync('../ontouml-models/catalog.ttl', result);
    });
  });
});
