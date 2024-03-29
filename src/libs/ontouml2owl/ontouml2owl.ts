import { Project, Package, Relation, Diagram, Literal } from '@libs/ontouml';
import { Class } from '@libs/ontouml/model/class';
import { Decoratable } from '@libs/ontouml/model/decoratable';
import { Generalization } from '@libs/ontouml/model/generalization';
import { GeneralizationSet } from '@libs/ontouml/model/generalization_set';
import { OntologicalNature } from '@libs/ontouml/model/natures';
import { AggregationKind, Property } from '@libs/ontouml/model/property';
import { OntoumlElement } from '@libs/ontouml/ontouml_element';
import { ConnectorView } from '@libs/ontouml/view/connector_view';
import { ElementView } from '@libs/ontouml/view/element_view';
import { Path } from '@libs/ontouml/view/path';
import { Point } from '@libs/ontouml/view/point';
import { RectangularShape } from '@libs/ontouml/view/rectangular_shape';

import { Writer } from 'n3';
import { Service, ServiceIssue } from '..';

const N3 = require('n3');
const { namedNode, literal, blankNode } = N3.DataFactory;

const ONTOUML = 'https://purl.org/ontouml-metamodel#';
/**
 *
 * @author Tiago Prince Sales
 *
 */
export class Ontouml2Owl implements Service {
  project: Project;
  owlCode: string;
  writer: Writer;
  baseUri: string;
  basePrefix: string;
  format: string;

  constructor(project: Project, baseUri?: string, basePrefix?: string, format?: string) {
    this.project = project;
    this.baseUri = baseUri || 'http://ontouml.org/';
    this.basePrefix = basePrefix || 'ontouml';
    this.format = format || 'Turtle';

    this.writer = new N3.Writer({
      format: this.format,
      prefixes: {
        [this.basePrefix]: this.baseUri,
        ontouml: 'https://purl.org/ontouml-metamodel#',
        rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
        rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
        owl: 'http://www.w3.org/2002/07/owl#',
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

  transform(): boolean {
    try {
      this.transformProject();

      this.transformPackages();
      this.transformClasses();
      this.transformGeneralizations();
      this.transformGeneralizationSets();
      this.transformRelations();
      this.transformProperties();
      this.transformLiterals();

      this.transformDiagrams();
      this.transformPackageViews();
      this.transformClassViews();
      this.transformRelationViews();
      this.transformGeneralizationViews();
      this.transformGeneralizationSetViews();

      this.transformRectangles();
      this.transformTexts();
      this.transformPaths();

      this.writer.end((error, result) => {
        if (error) throw error;
        this.owlCode = result;
      });
    } catch (error) {
      console.log(error);
      console.log('An error occurred while transforming the model to ontouml-schema-owl.');
      throw error;
    }

    return true;
  }

  transformPackages() {
    this.project.getAllPackages()?.forEach(p => this.transformPackage(p));
  }

  transformClasses() {
    this.project.getAllClasses()?.forEach(c => this.transformClass(c));
  }

  transformRelations() {
    this.project.getAllRelations()?.forEach(r => this.transformRelation(r));
  }

  transformGeneralizations() {
    this.project.getAllGeneralizations()?.forEach(g => this.transformGeneralization(g));
  }

  transformGeneralizationSets() {
    this.project.getAllGeneralizationSets()?.forEach(gs => this.transformGeneralizationSet(gs));
  }

  transformProperties() {
    this.project.getAllProperties()?.forEach(p => this.transformProperty(p));
  }

  transformLiterals() {
    this.project.getAllLiterals()?.forEach(l => this.transformOntoumlElement(l));
  }

  transformDiagrams() {
    this.project.diagrams?.forEach(d => this.transformDiagram(d));
  }

  transformClassViews() {
    this.project.getAllClassViews()?.forEach(v => this.transformElementView(v));
  }

  transformRelationViews() {
    this.project.getAllRelationViews()?.forEach(v => this.transformConnectorView(v));
  }

  transformGeneralizationViews() {
    this.project.getAllGeneralizationViews()?.forEach(v => this.transformConnectorView(v));
  }

  transformGeneralizationSetViews() {
    this.project.getAllGeneralizationSetViews()?.forEach(v => this.transformElementView(v));
  }

  transformPackageViews() {
    this.project.getAllPackageViews()?.forEach(v => this.transformElementView(v));
  }

  transformRectangles() {
    this.project.getAllRectangles()?.forEach(r => this.transformRectangularShape(r));
  }

  transformTexts() {
    this.project.getAllTexts()?.forEach(r => this.transformRectangularShape(r));
  }

  transformPaths() {
    this.project.getAllPaths()?.forEach(r => this.transformPath(r));
  }

  transformProject() {
    this.transformOntoumlElement(this.project);

    const projUri = this.getUri(this.project);

    if (this.project.model) {
      const modelUri = this.getUri(this.project.model);
      this.writer.addQuad(namedNode(projUri), namedNode(ONTOUML + 'model'), namedNode(modelUri));
    }

    this.project.diagrams?.forEach(diag => {
      const diagUri = this.getUri(diag);
      this.writer.addQuad(namedNode(projUri), namedNode(ONTOUML + 'diagram'), namedNode(diagUri));
    });
  }

  transformClass(clazz: Class) {
    this.transformOntoumlElement(clazz);
    this.transformStereotype(clazz);

    const classUri = this.getUri(clazz);

    for (const nature of clazz.restrictedTo) {
      this.writer.addQuad(namedNode(classUri), namedNode(ONTOUML + 'restrictedTo'), namedNode(this.getNatureUri(nature)));
    }

    this.writer.addQuad(
      namedNode(classUri),
      namedNode(ONTOUML + 'isAbstract'),
      literal(clazz.isAbstract, namedNode('xsd:boolean'))
    );

    this.writer.addQuad(
      namedNode(classUri),
      namedNode(ONTOUML + 'isDerived'),
      literal(clazz.isDerived, namedNode('xsd:boolean'))
    );

    this.writer.addQuad(
      namedNode(classUri),
      namedNode(ONTOUML + 'isExtensional'),
      literal(clazz.isExtensional, namedNode('xsd:boolean'))
    );

    this.writer.addQuad(
      namedNode(classUri),
      namedNode(ONTOUML + 'isPowertype'),
      literal(clazz.isPowertype, namedNode('xsd:boolean'))
    );

    this.writer.addQuad(
      namedNode(classUri),
      namedNode(ONTOUML + 'order'),
      literal(clazz.order, namedNode('xsd:positiveInteger'))
    );

    for (const attr of clazz.properties) {
      const attrUri = this.getUri(attr);
      this.writer.addQuad(namedNode(classUri), namedNode(ONTOUML + 'attribute'), namedNode(attrUri));
    }

    for (const literal of clazz.literals) {
      const litUri = this.getUri(literal);
      this.writer.addQuad(namedNode(classUri), namedNode(ONTOUML + 'literal'), namedNode(litUri));
    }
  }

  transformRelation(rel: Relation) {
    this.transformOntoumlElement(rel);
    this.transformStereotype(rel);

    const relUri = this.getUri(rel);
    this.writer.addQuad(namedNode(relUri), namedNode(ONTOUML + 'isDerived'), literal(rel.isDerived, namedNode('xsd:boolean')));

    if (rel.isBinary()) {
      const source = rel.getSourceEnd();
      const sourceUri = this.getUri(source);
      this.writer.addQuad(namedNode(relUri), namedNode(ONTOUML + 'sourceEnd'), namedNode(sourceUri));

      const target = rel.getTargetEnd();
      const targetUri = this.getUri(target);
      this.writer.addQuad(namedNode(relUri), namedNode(ONTOUML + 'targetEnd'), namedNode(targetUri));
    }

    for (const prop of rel.properties) {
      const propUri = this.getUri(prop);
      this.writer.addQuad(namedNode(relUri), namedNode(ONTOUML + 'relationEnd'), namedNode(propUri));
    }
  }

  transformGeneralization(gen: Generalization) {
    this.transformOntoumlElement(gen);

    const genUri = this.getUri(gen);
    const generalUri = this.getUri(gen.general);
    this.writer.addQuad(namedNode(genUri), namedNode(ONTOUML + 'general'), namedNode(generalUri));

    const specificUri = this.getUri(gen.specific);
    this.writer.addQuad(namedNode(genUri), namedNode(ONTOUML + 'specific'), namedNode(specificUri));
  }

  transformGeneralizationSet(gs: GeneralizationSet) {
    this.transformOntoumlElement(gs);

    const gsUri = this.getUri(gs);
    this.writer.addQuad(namedNode(gsUri), namedNode(ONTOUML + 'isComplete'), literal(gs.isComplete, namedNode('xsd:boolean')));
    this.writer.addQuad(namedNode(gsUri), namedNode(ONTOUML + 'isDisjoint'), literal(gs.isDisjoint, namedNode('xsd:boolean')));

    if (gs.categorizer) {
      const categorizerUri = this.getUri(gs.categorizer);
      this.writer.addQuad(namedNode(gsUri), namedNode(ONTOUML + 'categorizer'), namedNode(categorizerUri));
    }

    gs.generalizations?.forEach(gen => {
      const genUri = this.getUri(gen);
      this.writer.addQuad(namedNode(gsUri), namedNode(ONTOUML + 'generalization'), namedNode(genUri));
    });
  }

  transformPackage(pkg: Package) {
    this.transformOntoumlElement(pkg);

    const pkgUri = this.getUri(pkg);
    for (const ele of pkg.contents) {
      const eleUri = this.getUri(ele);
      this.writer.addQuad(namedNode(pkgUri), namedNode(ONTOUML + 'containsModelElement'), namedNode(eleUri));
    }
  }

  transformProperty(prop: Property) {
    this.transformOntoumlElement(prop);
    this.transformStereotype(prop);
    this.transformCardinality(prop);

    const propUri = this.getUri(prop);
    this.writer.addQuad(namedNode(propUri), namedNode(ONTOUML + 'isDerived'), literal(prop.isDerived, namedNode('xsd:boolean')));
    this.writer.addQuad(
      namedNode(propUri),
      namedNode(ONTOUML + 'isReadOnly'),
      literal(prop.isReadOnly, namedNode('xsd:boolean'))
    );
    this.writer.addQuad(namedNode(propUri), namedNode(ONTOUML + 'isOrdered'), literal(prop.isOrdered, namedNode('xsd:boolean')));

    const aggUri = this.getAggregationKindUri(prop.aggregationKind);
    this.writer.addQuad(namedNode(propUri), namedNode(ONTOUML + 'aggregationKind'), namedNode(aggUri));

    if (prop.propertyType) {
      const typeUri = this.getUri(prop.propertyType);
      this.writer.addQuad(namedNode(propUri), namedNode(ONTOUML + 'propertyType'), namedNode(typeUri));
    }

    for (const subsetted of prop.subsettedProperties) {
      const subUri = this.getUri(subsetted);
      this.writer.addQuad(namedNode(propUri), namedNode(ONTOUML + 'subsetsProperty'), namedNode(subUri));
    }

    for (const redefined of prop.redefinedProperties) {
      const redUri = this.getUri(redefined);
      this.writer.addQuad(namedNode(propUri), namedNode(ONTOUML + 'redefinesProperty'), namedNode(redUri));
    }
  }

  transformCardinality(prop: Property) {
    const cardinality = prop.cardinality;
    if (!cardinality || !cardinality.value) return;

    const propUri = this.getUri(prop);
    const cardUri = prop.id + '_cardinality';

    this.writer.addQuad(namedNode(propUri), namedNode(ONTOUML + 'cardinality'), blankNode(cardUri));
    this.writer.addQuad(blankNode(cardUri), namedNode('rdf:type'), namedNode(ONTOUML + 'Cardinality'));
    this.writer.addQuad(blankNode(cardUri), namedNode(ONTOUML + 'cardinalityValue'), literal(cardinality.value));

    if (cardinality.isValid()) {
      this.writer.addQuad(blankNode(cardUri), namedNode(ONTOUML + 'lowerBound'), literal(cardinality.lowerBound));
      this.writer.addQuad(blankNode(cardUri), namedNode(ONTOUML + 'upperBound'), literal(cardinality.upperBound));
    }
  }

  transformStereotype(elem: Decoratable<any>) {
    if (elem.stereotype == null) return;

    const subject = this.getUri(elem);
    const stereotypeUri = ONTOUML + elem.stereotype;
    this.writer.addQuad(namedNode(subject), namedNode(ONTOUML + 'stereotype'), namedNode(stereotypeUri));
  }

  transformDiagram(diagram: Diagram) {
    this.transformOntoumlElement(diagram);

    const diagUri = this.getUri(diagram);

    for (const view of diagram.contents) {
      const viewUri = this.getUri(view);
      this.writer.addQuad(namedNode(diagUri), namedNode(ONTOUML + 'containsView'), namedNode(viewUri));
    }
  }

  transformElementView(view: ElementView<any, any>) {
    this.transformOntoumlElement(view);

    const viewUri = this.getUri(view);
    const eleUri = this.getUri(view.modelElement);
    this.writer.addQuad(namedNode(viewUri), namedNode(ONTOUML + 'isViewOf'), namedNode(eleUri));

    const shapeUri = this.getUri(view.shape);
    this.writer.addQuad(namedNode(viewUri), namedNode(ONTOUML + 'shape'), namedNode(shapeUri));
  }

  transformConnectorView(view: ConnectorView<any>) {
    this.transformElementView(view);

    const viewUri = this.getUri(view);

    const sourceUri = this.getUri(view.source);
    this.writer.addQuad(namedNode(viewUri), namedNode(ONTOUML + 'sourceView'), namedNode(sourceUri));

    const targetUri = this.getUri(view.target);
    this.writer.addQuad(namedNode(viewUri), namedNode(ONTOUML + 'targetView'), namedNode(targetUri));
  }

  transformRectangularShape(rect: RectangularShape) {
    const rectUri = this.getUri(rect);
    this.writer.addQuad(namedNode(rectUri), namedNode('rdf:type'), namedNode(ONTOUML + '' + rect.type));

    this.writer.addQuad(
      namedNode(rectUri),
      namedNode(ONTOUML + 'height'),
      literal(rect.getHeight(), namedNode('xsd:positiveInteger'))
    );

    this.writer.addQuad(
      namedNode(rectUri),
      namedNode(ONTOUML + 'width'),
      literal(rect.getWidth(), namedNode('xsd:positiveInteger'))
    );

    const pointUri = rectUri + '_point';
    this.writer.addQuad(namedNode(rectUri), namedNode(ONTOUML + 'topLeftPosition'), blankNode(pointUri));
    this.transformPoint(rect.topLeft, pointUri);
  }

  transformPath(path: Path) {
    const pathUri = this.getUri(path);
    this.writer.addQuad(namedNode(pathUri), namedNode('rdf:type'), namedNode(ONTOUML + '' + path.type));

    path.points?.forEach((point, index) => {
      const pointUri = pathUri + '_point_' + index;
      this.writer.addQuad(namedNode(pathUri), namedNode(ONTOUML + 'point'), blankNode(pointUri));
      this.transformPoint(point, pointUri);
    });
  }

  transformPoint(point: Point, pointUri: string) {
    this.writer.addQuad(blankNode(pointUri), namedNode('rdf:type'), namedNode(ONTOUML + 'Point'));
    this.writer.addQuad(blankNode(pointUri), namedNode(ONTOUML + 'xCoordinate'), literal(point.x));
    this.writer.addQuad(blankNode(pointUri), namedNode(ONTOUML + 'yCoordinate'), literal(point.y));
  }

  transformOntoumlElement(elem: OntoumlElement) {
    const elemUri = this.getUri(elem);

    const typeUri = ONTOUML + '' + elem.type;
    this.writer.addQuad(namedNode(elemUri), namedNode('rdf:type'), namedNode(typeUri));

    const projUri = this.getUri(this.project);
    this.writer.addQuad(namedNode(projUri), namedNode(ONTOUML + 'project'), namedNode(elemUri));

    this.transformName(elem);
    this.transformDescription(elem);
  }

  transformName(elem: OntoumlElement) {
    const subject = this.getUri(elem);

    for (const entry of elem.name.entries()) {
      this.writer.addQuad(namedNode(subject), namedNode(ONTOUML + 'name'), literal(entry[1], entry[0]));
    }
  }

  transformDescription(elem: OntoumlElement) {
    const subject = this.getUri(elem);

    for (const entry of elem.description.entries()) {
      this.writer.addQuad(namedNode(subject), namedNode(ONTOUML + 'description'), literal(entry[1], entry[0]));
    }
  }

  getNatureUri(nature: OntologicalNature) {
    const map = {
      [OntologicalNature.functional_complex]: 'functionalComplex',
      [OntologicalNature.collective]: 'collective',
      [OntologicalNature.quantity]: 'quantity',
      [OntologicalNature.relator]: 'relator',
      [OntologicalNature.intrinsic_mode]: 'intrinsicMode',
      [OntologicalNature.extrinsic_mode]: 'extrinsicMode',
      [OntologicalNature.quality]: 'quality',
      [OntologicalNature.event]: 'event',
      [OntologicalNature.situation]: 'situation',
      [OntologicalNature.type]: 'type',
      [OntologicalNature.abstract]: 'abstract'
    };

    return ONTOUML + map[nature];
  }

  getAggregationKindUri(agg: AggregationKind) {
    return ONTOUML + agg.toLowerCase();
  }

  getUri(element: OntoumlElement): string {
    return this.baseUri + element.id;
  }
}
