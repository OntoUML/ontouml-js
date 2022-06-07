import { Writer } from 'n3';
import { Service, ServiceIssue } from '..';

const N3 = require('n3');
const { namedNode, literal, blankNode } = N3.DataFactory;

const ONTOUML_BASE = 'https://purl.org/ontouml-metamodel#';

/**
 *
 * @author Tiago Prince Sales
 *
 */

export class Metadata {
  acronym: string;
  conformsTo: string[];
  context: string[];
  contributor: string[];
  designedForTask: string[];
  editorialNote: string;
  issued: string;
  landingPage: string;
  language: string;
  license: string;
  modified: string;
  source: string[];
  subject: string[];
  theme: string;
  title: string;
  type: string[];
}

const DCT = {
  contributor: 'http://purl.org/dc/terms/contributor',
  conformsTo: 'http://purl.org/dc/terms/conformsTo',
  issued: 'http://purl.org/dc/terms/issued',
  language: 'http://purl.org/dc/terms/language',
  license: 'http://purl.org/dc/terms/license',
  modified: 'http://purl.org/dc/terms/modified',
  source: 'http://purl.org/dc/terms/source',
  subject: 'http://purl.org/dc/terms/subject',
  title: 'http://purl.org/dc/terms/title',
  type: 'http://purl.org/dc/terms/type'
};

const DCAT = {
  Dataset: 'http://www.w3.org/ns/dcat#Dataset',
  Distribution: 'http://www.w3.org/ns/dcat#Distribution',
  dataset: 'http://www.w3.org/ns/dcat#dataset',
  distribution: 'http://www.w3.org/ns/dcat#distribution',
  downloadURL: 'http://www.w3.org/ns/dcat#downloadURL',
  landingPage: 'http://www.w3.org/ns/dcat#landingPage',
  mediaType: 'http://www.w3.org/ns/dcat#mediaType',
  theme: 'http://www.w3.org/ns/dcat#theme'
};

const MOD = {
  acronym: 'https://w3id.org/mod#acronym',
  designedForTask: 'https://w3id.org/mod#designedForTask',
  SemanticArtefact: 'https://w3id.org/mod#SemanticArtefact'
};

const RDF = {
  type: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type'
};

const XSD = {
  gYear: 'http://www.w3.org/2001/XMLSchema#gYear'
};

const SKOS = {
  editorialNote: 'http://www.w3.org/2004/02/skos/core#editorialNote'
};

const ONTOUML = {
  catalog: 'https://purl.org/ontouml-models/catalog',
  context: 'https://purl.org/ontouml-models/vocabulary/context',
  research: 'https://purl.org/ontouml-models/vocabulary/Research',
  classroom: 'https://purl.org/ontouml-models/vocabulary/Classroom',
  industry: 'https://purl.org/ontouml-models/vocabulary/Industry',
  core: 'https://purl.org/ontouml-models/vocabulary/Core',
  domain: 'https://purl.org/ontouml-models/vocabulary/Domain',
  application: 'https://purl.org/ontouml-models/vocabulary/Application',
  'conceptual clarification': 'https://purl.org/ontouml-models/vocabulary/ConceptualClarification',
  'data publication': 'https://purl.org/ontouml-models/vocabulary/DataPublication',
  'decision support system': 'https://purl.org/ontouml-models/vocabulary/DecisionSupportSystem',
  example: 'https://purl.org/ontouml-models/vocabulary/Example',
  'information retrieval': 'https://purl.org/ontouml-models/vocabulary/InformationRetrieval',
  interoperability: 'https://purl.org/ontouml-models/vocabulary/Interoperability',
  'language engineering': 'https://purl.org/ontouml-models/vocabulary/LanguageEngineering',
  learning: 'https://purl.org/ontouml-models/vocabulary/Learning',
  'ontological analysis': 'https://purl.org/ontouml-models/vocabulary/OntologicalAnalysis',
  'software engineering': 'https://purl.org/ontouml-models/vocabulary/SoftwareEngineering',
  ontouml: 'https://purl.org/ontouml-models/vocabulary/OntoumlStyle',
  ufo: 'https://purl.org/ontouml-models/vocabulary/UfoStyle'
};

const LCC = {
  'Class A - General Works': 'http://id.loc.gov/authorities/classification/A',
  'Class B - Philosophy, Psychology, Religion': 'http://id.loc.gov/authorities/classification/B',
  'Class C - Auxiliary Sciences of History': 'http://id.loc.gov/authorities/classification/C',
  'Class D - World History and History of Europe, Asia, Africa, Australia, New Zealand, etc.':
    'http://id.loc.gov/authorities/classification/D',
  'Class E - History of America': 'http://id.loc.gov/authorities/classification/E',
  'Class F - History of the Americas': 'http://id.loc.gov/authorities/classification/F',
  'Class G - Geography, Anthropology, and Recreation': 'http://id.loc.gov/authorities/classification/G',
  'Class H - Social Sciences': 'http://id.loc.gov/authorities/classification/H',
  'Class J - Political Science': 'http://id.loc.gov/authorities/classification/J',
  'Class K - Law': 'http://id.loc.gov/authorities/classification/K',
  'Class L - Education': 'http://id.loc.gov/authorities/classification/L',
  'Class M - Music': 'http://id.loc.gov/authorities/classification/M',
  'Class N - Fine Arts': 'http://id.loc.gov/authorities/classification/N',
  'Class P - Language and Literature': 'http://id.loc.gov/authorities/classification/P',
  'Class Q - Science': 'http://id.loc.gov/authorities/classification/Q',
  'Class R - Medicine': 'http://id.loc.gov/authorities/classification/R',
  'Class S - Agriculture': 'http://id.loc.gov/authorities/classification/S',
  'Class T - Technology': 'http://id.loc.gov/authorities/classification/T',
  'Class U - Military Science': 'http://id.loc.gov/authorities/classification/U',
  'Class V - Naval Science': 'http://id.loc.gov/authorities/classification/V',
  'Class Z - Bibliography, Library Science, and General Information Resources': 'http://id.loc.gov/authorities/classification/Z'
};

const MEDIA_TYPE = {
  turtle: 'https://www.iana.org/assignments/media-types/text/turtle',
  json: 'https://www.iana.org/assignments/media-types/application/json',
  vpp: 'https://www.visual-paradigm.com/vpp'
};

export class Metadata2Owl implements Service {
  ontologyUri: string;
  metadata: Metadata;
  writer: Writer;
  format: string;
  owlCode: string;
  ontologyDir: string;

  constructor(metadata: Metadata, ontologyUri: string, format: string, ontologyDir?: string) {
    this.ontologyUri = ontologyUri;
    this.metadata = metadata;
    this.format = format;
    this.ontologyDir = ontologyDir || '';

    this.writer = new N3.Writer({
      format: this.format,
      prefixes: {
        ontouml: 'https://purl.org/ontouml-models/vocabulary/',
        dataset: 'https://purl.org/ontouml-models/dataset/',
        rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
        rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
        owl: 'http://www.w3.org/2002/07/owl#',
        xsd: 'http://www.w3.org/2001/XMLSchema#',
        mod: 'https://w3id.org/mod#',
        dct: 'http://purl.org/dc/terms/',
        skos: 'http://www.w3.org/2004/02/skos/core#',
        dcat: 'http://www.w3.org/ns/dcat#',
        lcc: 'http://id.loc.gov/authorities/classification/'
      }
    });
  }

  run(): { result: any; issues?: ServiceIssue[] } {
    this.transform();

    return {
      result: this.owlCode
    };
  }

  transform(): void {
    try {
      this.transformMetadata();
      this.transformDistributions();

      this.writer.end((error, result) => {
        if (error) throw error;
        this.owlCode = result;
      });
    } catch (error) {
      console.log(error);
      console.log('An error occurred while transforming the model to ontouml-schema-owl.');
      throw error;
    }
  }

  transformMetadata(): void {
    this.writer.addQuad(namedNode(this.ontologyUri), namedNode(RDF.type), namedNode(DCAT.Dataset));
    this.writer.addQuad(namedNode(this.ontologyUri), namedNode(RDF.type), namedNode(MOD.SemanticArtefact));

    if (this.metadata.title) {
      this.writer.addQuad(namedNode(this.ontologyUri), namedNode(DCT.title), literal(this.metadata.title));
    }

    if (this.metadata.acronym)
      this.writer.addQuad(namedNode(this.ontologyUri), namedNode(MOD.acronym), literal(this.metadata.acronym));

    if (this.metadata.issued)
      this.writer.addQuad(
        namedNode(this.ontologyUri),
        namedNode(DCT.issued),
        literal(this.metadata.issued, namedNode(XSD.gYear))
      );

    if (this.metadata.modified)
      this.writer.addQuad(
        namedNode(this.ontologyUri),
        namedNode(DCT.modified),
        literal(this.metadata.modified, namedNode(XSD.gYear))
      );

    if (this.metadata.theme)
      this.writer.addQuad(namedNode(this.ontologyUri), namedNode(DCAT.theme), namedNode(LCC[this.metadata.theme]));

    if (this.metadata.editorialNote)
      this.writer.addQuad(namedNode(this.ontologyUri), namedNode(SKOS.editorialNote), literal(this.metadata.editorialNote));

    if (this.metadata.language)
      this.writer.addQuad(namedNode(this.ontologyUri), namedNode(DCT.language), literal(this.metadata.language));

    if (this.metadata.landingPage)
      this.writer.addQuad(namedNode(this.ontologyUri), namedNode(DCAT.landingPage), namedNode(this.metadata.landingPage));

    if (this.metadata.license)
      this.writer.addQuad(namedNode(this.ontologyUri), namedNode(DCT.license), namedNode(this.metadata.license));

    this.transformContributor();
    this.transformSubject();
    this.transformDesignedForTask();
    this.transformContext();
    this.transformSource();
    this.transformConformsTo();
    this.transformType();

    this.writer.addQuad(namedNode(ONTOUML.catalog), namedNode(DCAT.dataset), namedNode(this.ontologyUri));
  }

  transformConformsTo(): void {
    if (!this.metadata.conformsTo) return;

    for (const style of this.metadata.conformsTo)
      this.writer.addQuad(namedNode(this.ontologyUri), namedNode(DCT.conformsTo), namedNode(ONTOUML[style]));
  }

  transformContext(): void {
    if (!this.metadata.context) return;

    for (const context of this.metadata.context)
      this.writer.addQuad(namedNode(this.ontologyUri), namedNode(ONTOUML.context), namedNode(ONTOUML[context]));
  }

  transformContributor(): void {
    if (!this.metadata.contributor) return;

    for (const contributor of this.metadata.contributor)
      this.writer.addQuad(namedNode(this.ontologyUri), namedNode(DCT.contributor), namedNode(contributor));
  }

  transformDesignedForTask(): void {
    if (!this.metadata.designedForTask) return;

    for (const task of this.metadata.designedForTask)
      this.writer.addQuad(namedNode(this.ontologyUri), namedNode(MOD.designedForTask), namedNode(ONTOUML[task]));
  }

  transformSource(): void {
    if (!this.metadata.source) return;

    for (const source of this.metadata.source)
      this.writer.addQuad(namedNode(this.ontologyUri), namedNode(DCT.source), namedNode(source));
  }

  transformSubject(): void {
    if (!this.metadata.subject) return;

    for (const subject of this.metadata.subject)
      this.writer.addQuad(namedNode(this.ontologyUri), namedNode(DCT.subject), literal(subject));
  }

  transformType(): void {
    if (!this.metadata.type) return;

    for (const type of this.metadata.type)
      if (ONTOUML[type]) this.writer.addQuad(namedNode(this.ontologyUri), namedNode(DCT.type), namedNode(ONTOUML[type]));
  }

  transformDistributions(): void {
    const ttlDistUri = this.ontologyUri + 'distribution/ttl';
    const jsonDistUri = this.ontologyUri + 'distribution/json';
    const vppDistUri = this.ontologyUri + 'distribution/vpp';

    this.transformDistribution(ttlDistUri, 'Turtle', MEDIA_TYPE.turtle, 'ontology.ttl');
    this.transformDistribution(ttlDistUri, 'JSON', MEDIA_TYPE.json, 'ontology.json');
    this.transformDistribution(ttlDistUri, 'Turtle', MEDIA_TYPE.vpp, 'ontology.vpp');
  }

  transformDistribution(distUri: string, format: string, mediaTypeUri: string, fileName: string) {
    this.writer.addQuad(namedNode(this.ontologyUri), namedNode(DCAT.distribution), namedNode(distUri));
    this.writer.addQuad(namedNode(distUri), namedNode(RDF.type), namedNode(DCAT.Distribution));

    this.writer.addQuad(
      namedNode(distUri),
      namedNode(DCT.title),
      literal(format + ' distribution of "' + this.metadata.title + '"', 'en')
    );

    this.writer.addQuad(namedNode(distUri), namedNode(DCAT.mediaType), namedNode(mediaTypeUri));
    this.writer.addQuad(
      namedNode(distUri),
      namedNode(DCAT.downloadURL),
      namedNode('https://raw.githubusercontent.com/unibz-core/ontouml-models/master/' + this.ontologyDir + '/' + fileName)
    );
  }
}
