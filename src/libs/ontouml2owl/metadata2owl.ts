import { Writer } from 'n3';
import { Service, ServiceIssue } from '..';

const N3 = require('n3');
const { namedNode, literal, blankNode } = N3.DataFactory;

/**
 *
 * @author Tiago Prince Sales           // https://orcid.org/0000-0002-5385-5761
 * @author Pedro Paulo Favato Barcelos  // https://orcid.org/0000-0003-2736-7817
 *
 */

export class Metadata {
  acronym: string;
  context: string[];
  contributor: string[];
  designedForTask: string[];
  editorialNote: string;
  issued: string;
  keyword: string[];
  landingPage: string;
  language: string;
  license: string;
  modified: string;
  ontologyType: string[];
  representationStyle: string[];
  source: string[];
  theme: string;
  title: string;
}

const OCMV = {
  conformsToSchema: 'https://w3id.org/ontouml-models/vocabulary#conformsToSchema',
  isComplete: 'https://w3id.org/ontouml-models/vocabulary#isComplete',
  ontologyType: 'https://w3id.org/ontouml-models/vocabulary#ontologyType',
  representationStyle: 'https://w3id.org/ontouml-models/vocabulary#representationStyle',
  storageUrl: 'https://w3id.org/ontouml-models/vocabulary#storageUrl'
};

const DCT = {
  contributor: 'http://purl.org/dc/terms/contributor',
  format: 'http://purl.org/dc/terms/format',
  issued: 'http://purl.org/dc/terms/issued',
  language: 'http://purl.org/dc/terms/language',
  license: 'http://purl.org/dc/terms/license',
  modified: 'http://purl.org/dc/terms/modified',
  source: 'http://purl.org/dc/terms/source',
  title: 'http://purl.org/dc/terms/title'
};

const DCAT = {
  dataset: 'http://www.w3.org/ns/dcat#dataset',
  Dataset: 'http://www.w3.org/ns/dcat#Dataset',
  distribution: 'http://www.w3.org/ns/dcat#distribution',
  Distribution: 'http://www.w3.org/ns/dcat#Distribution',
  downloadURL: 'http://www.w3.org/ns/dcat#downloadURL',
  keyword: 'http://www.w3.org/ns/dcat#keyword',
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
  boolean: 'http://www.w3.org/2001/XMLSchema#boolean',
  gYear: 'http://www.w3.org/2001/XMLSchema#gYear'
};

const SKOS = {
  editorialNote: 'http://www.w3.org/2004/02/skos/core#editorialNote'
};

const ONTOUML = {
  catalog: 'https://w3id.org/ontouml-models',
  context: 'https://w3id.org/ontouml-models/vocabulary#context',
  research: 'https://w3id.org/ontouml-models/vocabulary#Research',
  classroom: 'https://w3id.org/ontouml-models/vocabulary#Classroom',
  industry: 'https://w3id.org/ontouml-models/vocabulary#Industry',
  core: 'https://w3id.org/ontouml-models/vocabulary#Core',
  domain: 'https://w3id.org/ontouml-models/vocabulary#Domain',
  application: 'https://w3id.org/ontouml-models/vocabulary#Application',
  'conceptual clarification': 'https://w3id.org/ontouml-models/vocabulary#ConceptualClarification',
  'data publication': 'https://w3id.org/ontouml-models/vocabulary#DataPublication',
  'decision support system': 'https://w3id.org/ontouml-models/vocabulary#DecisionSupportSystem',
  example: 'https://w3id.org/ontouml-models/vocabulary#Example',
  'information retrieval': 'https://w3id.org/ontouml-models/vocabulary#InformationRetrieval',
  interoperability: 'https://w3id.org/ontouml-models/vocabulary#Interoperability',
  'language engineering': 'https://w3id.org/ontouml-models/vocabulary#LanguageEngineering',
  learning: 'https://w3id.org/ontouml-models/vocabulary#Learning',
  'ontological analysis': 'https://w3id.org/ontouml-models/vocabulary#OntologicalAnalysis',
  'software engineering': 'https://w3id.org/ontouml-models/vocabulary#SoftwareEngineering',
  ontouml: 'https://w3id.org/ontouml-models/vocabulary#OntoumlStyle',
  ufo: 'https://w3id.org/ontouml-models/vocabulary#UfoStyle'
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
  json: 'https://www.iana.org/assignments/media-types/application/json',
  png: 'https://www.iana.org/assignments/media-types/image/png',
  turtle: 'https://www.iana.org/assignments/media-types/text/turtle',
  vpp: 'https://www.iana.org/assignments/media-types/application/octet-stream'
};

const VPP_FORMAT = 'https://www.file-extension.info/format/vpp';
const JSON_SCHEMA = 'http://purl.org/ontouml-schema';
const GITHUB_BASE = "https://github.com/OntoUML/ontouml-models/tree/master/models/";
const GITHUB_RAW = "https://raw.githubusercontent.com/OntoUML/ontouml-models/master/models/";

export class Metadata2Owl implements Service {
  ontologyUri: string;
  metadata: Metadata;
  writer: Writer;
  format: string;
  owlCode: string;
  ontologyDir: string;

  constructor(metadata: Metadata, ontologyUri: string, format: string, ontologyDir?: string) {
    this.ontologyUri = ontologyUri.replace("#", "/");
    this.metadata = metadata;
    this.format = format;
    this.ontologyDir = ontologyDir || '';

    this.writer = new N3.Writer({
      format: this.format,
      prefixes: {
        dcat: 'http://www.w3.org/ns/dcat#',
        dct: 'http://purl.org/dc/terms/',
        lcc: 'http://id.loc.gov/authorities/classification/',
        mod: 'https://w3id.org/mod#',
        ocmv: 'https://w3id.org/ontouml-models/vocabulary#',
        owl: 'http://www.w3.org/2002/07/owl#',
        rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
        rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
        skos: 'http://www.w3.org/2004/02/skos/core#',
        xsd: 'http://www.w3.org/2001/XMLSchema#'
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
      console.log('An error occurred while generating the data or metadata files.');
      throw error;
    }
  }

  transformMetadata(): void {
    var newstr = this.ontologyUri;
    newstr = newstr;
    this.writer.addQuad(namedNode(newstr), namedNode(RDF.type), namedNode(DCAT.Dataset));
    this.writer.addQuad(namedNode(newstr), namedNode(RDF.type), namedNode(MOD.SemanticArtefact));

    if (this.metadata.title) {
      var newstr = this.ontologyUri;
      newstr = newstr;
      this.writer.addQuad(namedNode(newstr), namedNode(DCT.title), literal(this.metadata.title));
    }

    if (this.metadata.acronym) {
      var newstr = this.ontologyUri;
      newstr = newstr;
      this.writer.addQuad(namedNode(newstr), namedNode(MOD.acronym), literal(this.metadata.acronym));
    }

    if (this.metadata.issued) {
      var newstr = this.ontologyUri;
      newstr = newstr;
      this.writer.addQuad(namedNode(newstr), namedNode(DCT.issued), literal(this.metadata.issued, namedNode(XSD.gYear)));
    }

    if (this.metadata.modified) {
      var newstr = this.ontologyUri;
      newstr = newstr;
      this.writer.addQuad(namedNode(newstr), namedNode(DCT.modified), literal(this.metadata.modified, namedNode(XSD.gYear)));
    }

    if (this.metadata.theme) {
      var newstr = this.ontologyUri;
      newstr = newstr;
      this.writer.addQuad(namedNode(newstr), namedNode(DCAT.theme), namedNode(LCC[this.metadata.theme]));
    }

    if (this.metadata.editorialNote) {
      var newstr = this.ontologyUri;
      newstr = newstr;
      this.writer.addQuad(namedNode(newstr), namedNode(SKOS.editorialNote), literal(this.metadata.editorialNote));
    }

    if (this.metadata.language) {
      var newstr = this.ontologyUri;
      newstr = newstr;
      this.writer.addQuad(namedNode(newstr), namedNode(DCT.language), literal(this.metadata.language));
    }

    if (this.metadata.landingPage) {
      var newstr = this.ontologyUri;
      newstr = newstr;
      this.writer.addQuad(namedNode(newstr), namedNode(DCAT.landingPage), namedNode(this.metadata.landingPage));
    }

    if (this.metadata.license) {
      var newstr = this.ontologyUri;
      newstr = newstr;
      this.writer.addQuad(namedNode(newstr), namedNode(DCT.license), namedNode(this.metadata.license));
    }

    this.transformContributor();
    this.transformKeyword();
    this.transformDesignedForTask();
    this.transformContext();
    this.transformSource();
    this.transformRepresentationStyle();
    this.transformOntologyType();
    this.setStorageUrl();

    var old_string = this.ontologyUri;
    var new_string = old_string;
    this.writer.addQuad(namedNode(ONTOUML.catalog), namedNode(DCAT.dataset), namedNode(new_string));
  }

  transformRepresentationStyle(): void {
    if (!this.metadata.representationStyle) return;
    var new_string = (this.ontologyUri);
    for (const style of this.metadata.representationStyle)
      this.writer.addQuad(namedNode(new_string), namedNode(OCMV.representationStyle), namedNode(ONTOUML[style]));
  }

  transformContext(): void {
    if (!this.metadata.context) return;
    var new_string = (this.ontologyUri);
    for (const context of this.metadata.context)
      this.writer.addQuad(namedNode(new_string), namedNode(ONTOUML.context), namedNode(ONTOUML[context]));
  }

  transformContributor(): void {
    if (!this.metadata.contributor) return;
    var new_string = (this.ontologyUri);
    for (const contributor of this.metadata.contributor)
      this.writer.addQuad(namedNode(new_string), namedNode(DCT.contributor), namedNode(contributor));
  }

  transformDesignedForTask(): void {
    if (!this.metadata.designedForTask) return;

    var new_string = (this.ontologyUri);
    for (const task of this.metadata.designedForTask)
      this.writer.addQuad(namedNode(new_string), namedNode(MOD.designedForTask), namedNode(ONTOUML[task]));
  }

  transformSource(): void {
    if (!this.metadata.source) return;

    var new_string = (this.ontologyUri);
    for (const source of this.metadata.source)
      this.writer.addQuad(namedNode(new_string), namedNode(DCT.source), namedNode(source));
  }

  transformKeyword(): void {
    if (!this.metadata.keyword) return;

    var new_string = (this.ontologyUri);

    for (const keyword of this.metadata.keyword)
      this.writer.addQuad(namedNode(new_string), namedNode(DCAT.keyword), literal(keyword, 'en'));
  }

  transformOntologyType(): void {
    if (!this.metadata.ontologyType) return;
    var new_string = (this.ontologyUri);
    for (const ontologyType of this.metadata.ontologyType)
      if (ONTOUML[ontologyType]) this.writer.addQuad(namedNode(new_string), namedNode(OCMV.ontologyType), namedNode(ONTOUML[ontologyType]));
  }

  setStorageUrl(): void {
    var new_string = (this.ontologyUri);
    this.writer.addQuad(namedNode(new_string), namedNode(OCMV.storageUrl), namedNode(GITHUB_BASE + this.ontologyDir));
  }

  transformDistributions(): void {
    var newOntologyUri = (this.ontologyUri);

    const ttlDistUri = newOntologyUri.replace("/model", "/turtle");
    const jsonDistUri = newOntologyUri.replace("/model", "/json");
    const vppDistUri = newOntologyUri.replace("/model", "/vpp");

    this.writer.addQuad(namedNode(newOntologyUri), namedNode(DCAT.distribution), namedNode(ttlDistUri));
    this.writer.addQuad(namedNode(newOntologyUri), namedNode(DCAT.distribution), namedNode(jsonDistUri));
    this.writer.addQuad(namedNode(newOntologyUri), namedNode(DCAT.distribution), namedNode(vppDistUri));

    var fs = require('fs');

    const ontologyName = this.metadata.title;

    // DIAGRAM IMAGES TREATMENT    

    const path = require("path");
    let currentPath = process.cwd();
    const parentPath = path.parse(currentPath);
    const modelFolder = parentPath.dir + "\\ontouml-models\\models\\" + this.ontologyDir;
    const fsOriginal = require('fs')
    const fsNew = require('fs')

    // SAVING ORIGINAL DIAGRAMS INFORMATION

    const originalDiagramsFolder = modelFolder + "\\original-diagrams\\"
    const originalFiles = fsOriginal.readdirSync(originalDiagramsFolder);
    const pngOriginalDistUri = "https://w3id.org/ontouml-models/original-diagram/";

    for (let i = 0; i < originalFiles.length; i++) {
      originalFiles[i] = originalFiles[i].replace(/\.[^/.]+$/, "");
      const specificImageURI = pngOriginalDistUri + this.ontologyDir + '/' + originalFiles[i];
      this.writer.addQuad(namedNode(newOntologyUri), namedNode(DCAT.distribution), namedNode(specificImageURI));      

      var functionCode = this.transformSpecificDistribution(specificImageURI, 'PNG', MEDIA_TYPE.png, 'png-o');
      var outputMetadataPath = '../ontouml-models/models/' + this.ontologyDir + '/metadata-' + "png-o-" + originalFiles[i] + '.ttl';
      fs.writeFileSync(outputMetadataPath, functionCode);

    }

    // IF EXISTS, SAVING NEW DIAGRAMS INFORMATION

    const newDiagramsFolder = modelFolder + "\\new-diagrams\\"
    const pngNewDistUri = "https://w3id.org/ontouml-models/new-diagram/";

    if (fsNew.existsSync(newDiagramsFolder)) {
      const newFiles = fsNew.readdirSync(newDiagramsFolder);
      for (let i = 0; i < newFiles.length; i++) {
        newFiles[i] = newFiles[i].replace(/\.[^/.]+$/, "");
        const specificImageURI = pngNewDistUri + this.ontologyDir + '/' + newFiles[i];
        this.writer.addQuad(namedNode(newOntologyUri), namedNode(DCAT.distribution), namedNode(specificImageURI));        

        functionCode = this.transformSpecificDistribution(specificImageURI, 'PNG', MEDIA_TYPE.png, 'png-n');
        outputMetadataPath = '../ontouml-models/models/' + this.ontologyDir + '/metadata-' + "png-n-" + newFiles[i] + '.ttl';
        fs.writeFileSync(outputMetadataPath, functionCode);

      }
    }

    // CREATE SPECIFIC DISTRIBUTION FILES    

    // TTL DISTRIBUTION
    functionCode = this.transformSpecificDistribution(ttlDistUri, 'Turtle', MEDIA_TYPE.turtle, 'ttl');

    outputMetadataPath = '../ontouml-models/models/' + this.ontologyDir + '/metadata-' + "turtle" + '.ttl';
    fs.writeFileSync(outputMetadataPath, functionCode);

    // JSON DISTRIBUTION
    functionCode = this.transformSpecificDistribution(jsonDistUri, 'JSON', MEDIA_TYPE.json, 'json');

    outputMetadataPath = '../ontouml-models/models/' + this.ontologyDir + '/metadata-' + "json" + '.ttl';
    fs.writeFileSync(outputMetadataPath, functionCode);

    // VPP DISTRIBUTION
    functionCode = this.transformSpecificDistribution(vppDistUri, 'Visual Paradigm', MEDIA_TYPE.vpp, 'vpp');

    outputMetadataPath = '../ontouml-models/models/' + this.ontologyDir + '/metadata-' + "vpp" + '.ttl';
    fs.writeFileSync(outputMetadataPath, functionCode);

  }

  // ALL THIS INFO HERE MUST BE SAVED IN A NEW FILE
  transformSpecificDistribution(distUri: string, format: string, mediaTypeUri: string, fileExtension: string) {

    var writer = new N3.Writer({
      format: this.format,
      prefixes: {
        dcat: 'http://www.w3.org/ns/dcat#',
        dct: 'http://purl.org/dc/terms/',
        ocmv: 'https://w3id.org/ontouml-models/vocabulary#',
        owl: 'http://www.w3.org/2002/07/owl#',
        rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
        rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
        skos: 'http://www.w3.org/2004/02/skos/core#',
        xsd: 'http://www.w3.org/2001/XMLSchema#'
      }
    });

    // GENERAL CASES
    writer.addQuad(namedNode(distUri), namedNode(RDF.type), namedNode(DCAT.Distribution));    
    writer.addQuad(namedNode(distUri), namedNode(DCAT.mediaType), namedNode(mediaTypeUri));
    
    if (this.metadata.license) {
      writer.addQuad(namedNode(distUri), namedNode(DCT.license), namedNode(this.metadata.license));
    }

    // SPECIFIC CASES
    if (fileExtension === "vpp") { writer.addQuad(namedNode(distUri), namedNode(DCT.format), namedNode(VPP_FORMAT)); } 

    if (fileExtension === "json") { writer.addQuad(namedNode(distUri), namedNode(OCMV.conformsToSchema), namedNode(JSON_SCHEMA)); }

    if (fileExtension.includes("png")) {      
      writer.addQuad(namedNode(distUri), namedNode(OCMV.isComplete), literal('false', namedNode('xsd:boolean')));
    }
    else {
      writer.addQuad(namedNode(distUri), namedNode(DCT.title), literal(format + ' distribution of ' + this.metadata.title, 'en'));
      writer.addQuad(namedNode(distUri), namedNode(DCAT.downloadURL), namedNode(GITHUB_RAW + this.ontologyDir + "/ontology." + fileExtension));
      writer.addQuad(namedNode(distUri), namedNode(OCMV.isComplete), literal('true', namedNode('xsd:boolean')));
    }

    if (fileExtension === "png-o") {
      var diagramName = distUri.substring(distUri.lastIndexOf('/') + 1);
      var diagramHumanName = diagramName.split('-').join(' ');
      
      writer.addQuad(namedNode(distUri), namedNode(DCT.title), literal(format + ' distribution of diagram \'' + diagramHumanName + '\' from the ' + this.metadata.title + ' (original version)', 'en'));
      var imageDownloadUrl = GITHUB_RAW + this.ontologyDir + "/original-diagrams/" + diagramName + ".png"
      writer.addQuad(namedNode(distUri), namedNode(DCAT.downloadURL), namedNode(imageDownloadUrl));
      writer.addQuad(namedNode(distUri), namedNode(SKOS.editorialNote), literal("This image depicts the diagram as originally represented by its author(s).", 'en'))
    }
    if (fileExtension === "png-n") {
      diagramName = distUri.substring(distUri.lastIndexOf('/') + 1);
      diagramHumanName = diagramName.split('-').join(' ');
      
      writer.addQuad(namedNode(distUri), namedNode(DCT.title), literal(format + ' distribution of diagram \'' + diagramHumanName + '\' from the ' + this.metadata.title + ' (Visual Paradigm version)', 'en'));
      var imageDownloadUrl = GITHUB_RAW + this.ontologyDir + "/new-diagrams/" + diagramName + ".png"
      writer.addQuad(namedNode(distUri), namedNode(DCAT.downloadURL), namedNode(imageDownloadUrl));
      writer.addQuad(namedNode(distUri), namedNode(SKOS.editorialNote), literal("This image depicts a version of the original diagram re-created in the Visual Paradigm editor.", 'en'))
    }


    // RETURN STRING TO BE PRINTED

    var functionCode = "";
    try {
      writer.end((error, result) => {
        if (error) throw error;
        functionCode = result;
      });
    } catch (error) {
      console.log(error);
      console.log('An error occurred while saving the ' + distUri + ' distribution metadata file.');
      throw error;
    }

    return functionCode;

  }
}