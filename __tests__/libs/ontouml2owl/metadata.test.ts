import { transformMetadata } from './helpers';

describe('Classes', () => {
  let result: string;

  const metadata = {
    title: 'Common Ontology of Value and Risk',
    acronym: 'COVER',
    issued: '2018',
    modified: '2019',
    contributor: [
      'https://orcid.org/0000-0002-5385-5761',
      'https://orcid.org/0000-0001-7932-7134',
      'https://orcid.org/0000-0002-3452-553X',
      'https://orcid.org/0000-0002-9819-3781',
      'https://orcid.org/0000-0003-0214-8853',
      'https://orcid.org/0000-0002-8698-3292'
    ],
    subject: ['value', 'risk'],
    theme: 'Class H - Social Sciences',
    editorialNote: 'The ontology was documented based on the github repository.',
    type: ['core'],
    language: 'en',
    designedForTask: ['conceptual clarification'],
    context: ['research'],
    source: ['https://doi.org/10.1007/978-3-030-00847-5_11', 'https://doi.org/10.1109/EDOC.2018.00028'],
    conformsTo: ['ontouml'],
    landingPage: 'https://github.com/unibz-core/value-and-risk-ontology',
    license: 'https://creativecommons.org/licenses/by/4.0'
  };

  beforeAll(() => {
    result = transformMetadata(metadata, 'http://t.co', 'N-Triples');
  });

  it('should generate rdf:type dcat:Dataset', () => {
    expect(result).toContain(
      '<http://t.co> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/dcat#Dataset>'
    );
  });
  it('should generate rdf:type dcat:Dataset', () => {
    expect(result).toContain(
      '<http://t.co> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/mod#SemanticArtefact>'
    );
  });

  it('should generate dct:title', () => {
    expect(result).toContain('<http://t.co> <http://purl.org/dc/terms/title> "Common Ontology of Value and Risk"');
  });

  it('should generate mod:acronym', () => {
    expect(result).toContain('<http://t.co> <https://w3id.org/mod#acronym> "COVER"');
  });

  it('should generate dct:issued', () => {
    expect(result).toContain('<http://t.co> <http://purl.org/dc/terms/issued> "2018"^^<http://www.w3.org/2001/XMLSchema#gYear>');
  });

  it('should generate dct:modified', () => {
    expect(result).toContain('<http://t.co> <http://purl.org/dc/terms/issued> "2018"^^<http://www.w3.org/2001/XMLSchema#gYear>');
  });

  it('should generate dct:contributor', () => {
    expect(result).toContain('<http://t.co> <http://purl.org/dc/terms/contributor> <https://orcid.org/0000-0002-5385-5761>');
    expect(result).toContain('<http://t.co> <http://purl.org/dc/terms/contributor> <https://orcid.org/0000-0001-7932-7134>');
    expect(result).toContain('<http://t.co> <http://purl.org/dc/terms/contributor> <https://orcid.org/0000-0002-3452-553X>');
    expect(result).toContain('<http://t.co> <http://purl.org/dc/terms/contributor> <https://orcid.org/0000-0002-9819-3781>');
    expect(result).toContain('<http://t.co> <http://purl.org/dc/terms/contributor> <https://orcid.org/0000-0003-0214-8853>');
    expect(result).toContain('<http://t.co> <http://purl.org/dc/terms/contributor> <https://orcid.org/0000-0002-8698-3292>');
  });

  it('should generate dct:subject', () => {
    expect(result).toContain('<http://t.co> <http://purl.org/dc/terms/subject> "risk"');
    expect(result).toContain('<http://t.co> <http://purl.org/dc/terms/subject> "value"');
  });

  it('should generate dcat:theme', () => {
    expect(result).toContain('<http://t.co> <http://www.w3.org/ns/dcat#theme> <http://id.loc.gov/authorities/classification/H>');
  });

  it('should generate skos:editorialNote', () => {
    expect(result).toContain(
      '<http://t.co> <http://www.w3.org/2004/02/skos/core#editorialNote> "The ontology was documented based on the github repository."'
    );
  });

  it('should generate dct:type', () => {
    expect(result).toContain('<http://t.co> <http://purl.org/dc/terms/type> <https://purl.org/ontouml-models/vocabulary/Core>');
  });

  it('should generate dct:language', () => {
    expect(result).toContain('<http://t.co> <http://purl.org/dc/terms/language> "en"');
  });

  it('should generate mod:designedForTask', () => {
    expect(result).toContain(
      '<http://t.co> <https://w3id.org/mod#designedForTask> <https://purl.org/ontouml-models/vocabulary/ConceptualClarification>'
    );
  });

  it('should generate ontouml:context', () => {
    expect(result).toContain(
      '<http://t.co> <https://purl.org/ontouml-models/vocabulary/context> <https://purl.org/ontouml-models/vocabulary/Research>'
    );
  });

  it('should generate dct:source', () => {
    expect(result).toContain('<http://t.co> <http://purl.org/dc/terms/source> <https://doi.org/10.1007/978-3-030-00847-5_11>');
  });

  it('should generate dct:conformsTo', () => {
    expect(result).toContain(
      '<http://t.co> <http://purl.org/dc/terms/conformsTo> <https://purl.org/ontouml-models/vocabulary/OntoumlStyle>'
    );
  });

  it('should generate dcat:landingPage', () => {
    expect(result).toContain(
      '<http://t.co> <http://www.w3.org/ns/dcat#landingPage> <https://github.com/unibz-core/value-and-risk-ontology>'
    );
  });

  it('should generate dct:license', () => {
    expect(result).toContain('<http://t.co> <http://purl.org/dc/terms/license> <https://creativecommons.org/licenses/by/4.0>');
  });
});
