import {
  Class,
  GeneralizationSet,
  Generalization,
  Diagram,
  Project,
  Package,
  ModelElement,
  OntoumlElement,
  ClassStereotype,
  OntologicalNature,
  Classifier,
  Relation,
  Property,
  RelationStereotype,
  AggregationKind
} from '@libs/ontouml';
import { Service } from '@libs/service';
import { ServiceIssue } from '@libs/service_issue';

export class RefOntoumlImporter implements Service {
  refontouml: any;

  constructor(refontouml: any, _options?: any) {
    this.refontouml = refontouml;

    if (_options) {
      console.log('Options ignored: this service does not support options');
    }
  }

  run(): { result: Project; issues?: ServiceIssue[] } {
    const project: Project = this.import();

    return {
      result: project,
      issues: null
    };
  }

  import(): Project {
    const project = new Project({ name: this.refontouml['$'].name });
    this.transformPackage(this.refontouml, project);
    return project;
  }

  transformElement(source: any, container: Package): ModelElement {
    if (this.isPackage(source)) return this.transformPackage(source, container);
    if (this.isClass(source)) return this.transformClass(source, container);
    if (this.isRelation(source)) return this.transformRelation(source, container);
    if (this.isGeneralizationSet(source)) return this.transformGeneralizationSet(source, container);
    return null;
  }

  transformPackage(source: any, container: Package | Project): Package {
    const target = container instanceof Package ? container.createPackage() : container.createModel();

    this.copyBasicProperties(source, target);
    source.packagedElement?.forEach(content => this.transformElement(content, target));
    return target;
  }

  transformClass(source: any, container: Package): Class {
    const target = container.createClass();

    this.copyBasicProperties(source, target);
    target.stereotype = this.getTargetClassStereotype(source);
    target.isAbstract = this.getIsAbstract(source);
    target.isDerived = this.getIsDerived(source);
    target.restrictedTo = this.getDefaultRestrictedTo(source);

    source.generalization?.forEach(gen => this.transformGeneralization(gen, target, container));
    source.ownedAttribute?.forEach(attr => this.transformProperty(attr, target));

    return target;
  }

  transformRelation(source: any, container: Package): Relation {
    const target = container.createRelation();

    this.copyBasicProperties(source, target);
    target.stereotype = this.getTargetRelationStereotype(source);
    target.isAbstract = this.getIsAbstract(source);
    target.isDerived = this.getIsDerived(source);

    source.generalization?.forEach(gen => this.transformGeneralization(gen, target, container));
    source.ownedEnd?.forEach(associationEnd => this.transformProperty(associationEnd, target));

    return target;
  }

  transformProperty(source: any, container: Class | Relation): Property {
    const target = container instanceof Class ? container.createAttribute() : container.createMemberEnd();
    this.copyBasicProperties(source, target);

    const id = this.getPropertyTypeId(source);
    if (id) {
      target.propertyType = new Class({ id });
    }

    const lower = this.getLowerBoundCardinality(source);
    target.cardinality.setLowerBoundFromNumber(lower);

    const upper = this.getUpperBoundCardinality(source);
    target.cardinality.setUpperBoundFromNumber(upper);

    target.isReadOnly = this.getIsReadOnly(source);
    target.isDerived = this.getIsDerived(source);
    target.isOrdered = this.getIsOrdered(source);
    return target;
  }

  transformGeneralization(source: any, specific: Classifier<any, any>, container: Package): Generalization {
    const target = container.createGeneralization();
    target.id = this.getId(source);

    const generalId = this.getGeneralId(source);
    const general = specific instanceof Class ? new Class({ id: generalId }) : new Relation({ id: generalId });
    target.general = general;

    target.specific = specific;

    return target;
  }

  transformGeneralizationSet(source: any, container: Package): GeneralizationSet {
    const target = container.createGeneralizationSet();

    this.copyBasicProperties(source, target);
    target.isComplete = this.getIsCovering(source);
    target.isDisjoint = this.getIsDisjoint(source);

    this.getGeneralizationIds(source).forEach(id => {
      const gen = new Generalization({ id });
      target.generalizations.push(gen);
    });

    return target;
  }

  copyBasicProperties(source: any, target: OntoumlElement) {
    target.id = this.getId(source);
    const name = this.getName(source);
    target.setName(name);
  }

  getName(source: any): string {
    return source['$']['name'];
  }

  getId(source: any): string {
    return source['$']['xmi:id'];
  }

  getType(source: any): string {
    return source['$']['xsi:type'].replace('RefOntoUML:', '');
  }

  getIsAbstract(source: any): boolean {
    return !!source['$']['isAbstract'];
  }

  getIsReadOnly(source: any): boolean {
    return !!source['$']['isReadOnly'];
  }

  getIsOrdered(source: any): boolean {
    return !!source['$']['isOrdered'];
  }

  getIsDerived(source: any): boolean {
    return this.getName(source)?.startsWith('/') || source['$']['isDerived'];
  }

  getGeneralId(source: any): string {
    return source['$']['general'];
  }

  getIsCovering(source: any): boolean {
    return !!source['$']['isCovering'];
  }

  getIsDisjoint(source: any): boolean {
    return !!source['$']['isDisjoint'];
  }

  getPropertyTypeId(source: any): string {
    return source['$']['type'];
  }

  getGeneralizationIds(source: any): string[] {
    return source['$']['generalization'].split(' ');
  }

  getLowerBoundCardinality(source: any): number {
    const value = source?.lowerValue?.[0]?.['$']?.value;
    return value ? parseInt(value) : 0;
  }

  getUpperBoundCardinality(source: any): number {
    const value = source?.upperValue?.[0]?.['$']?.value;
    return !value || value === '-1' ? Infinity : parseInt(value);
  }

  getAggregationKind(source: any): AggregationKind {
    const aggregationMap = {
      composite: AggregationKind.COMPOSITE,
      shared: AggregationKind.SHARED,
      none: AggregationKind.NONE
    };
    const value = source?.['$']?.aggregation;

    return aggregationMap[value] || AggregationKind.NONE;
  }

  getTargetClassStereotype(source: any): ClassStereotype {
    const stereotypeMap = {
      Kind: ClassStereotype.KIND,
      Collective: ClassStereotype.COLLECTIVE,
      Quantity: ClassStereotype.QUANTITY,
      Relator: ClassStereotype.RELATOR,
      Mode: ClassStereotype.MODE,
      Quality: ClassStereotype.QUALITY,
      SubKind: ClassStereotype.SUBKIND,
      Role: ClassStereotype.ROLE,
      Phase: ClassStereotype.PHASE,
      RoleMixin: ClassStereotype.ROLE_MIXIN,
      Category: ClassStereotype.CATEGORY,
      Mixin: ClassStereotype.MIXIN,
      DataType: ClassStereotype.DATATYPE,
      Enumeration: ClassStereotype.ENUMERATION,
      PrimitiveType: ClassStereotype.DATATYPE
    };
    const sourceStereotype = this.getType(source);
    return stereotypeMap[sourceStereotype];
  }

  getTargetRelationStereotype(source: any): RelationStereotype {
    const stereotypeMap = {
      Mediation: RelationStereotype.MEDIATION,
      Characterization: RelationStereotype.CHARACTERIZATION,
      FormalAssociation: RelationStereotype.COMPARATIVE,
      MaterialAssociation: RelationStereotype.MATERIAL,
      componentOf: RelationStereotype.COMPONENT_OF,
      subQuantityOf: RelationStereotype.SUBQUANTITY_OF,
      subCollectionOf: RelationStereotype.SUBCOLLECTION_OF,
      memberOf: RelationStereotype.MEMBER_OF,
      Derivation: RelationStereotype.DERIVATION
    };
    const sourceStereotype = this.getType(source);
    return stereotypeMap[sourceStereotype];
  }

  getDefaultRestrictedTo(source: any): OntologicalNature[] {
    const stereotypeMap = {
      Kind: [OntologicalNature.functional_complex],
      Collective: [OntologicalNature.collective],
      Quantity: [OntologicalNature.quantity],
      Relator: [OntologicalNature.relator],
      Mode: [OntologicalNature.intrinsic_mode, OntologicalNature.extrinsic_mode],
      Quality: [OntologicalNature.quality],
      DataType: [OntologicalNature.abstract],
      Enumeration: [OntologicalNature.abstract],
      PrimitiveType: [OntologicalNature.abstract]
    };

    const sourceStereotype = this.getType(source);
    return stereotypeMap[sourceStereotype];
  }

  isPackage(source: any): boolean {
    const type = this.getType(source);
    return type === 'Package' || type === 'Model';
  }

  isGeneralizationSet(source: any): boolean {
    return this.getType(source) === 'GeneralizationSet';
  }

  isClass(source: any): boolean {
    const classStereotypes = [
      'Kind',
      'Collective',
      'Quantity',
      'Relator',
      'Mode',
      'Quality',
      'SubKind',
      'Role',
      'Phase',
      'RoleMixin',
      'Category',
      'Mixin',
      'DataType',
      'Enumeration',
      'PrimitiveType',
      'Class'
    ];

    const type = this.getType(source);
    return classStereotypes.includes(type);
  }

  isRelation(source: any): boolean {
    const relationStereotypes = [
      'Mediation',
      'Characterization',
      'FormalAssociation',
      'MaterialAssociation',
      'componentOf',
      'subQuantityOf',
      'subCollectionOf',
      'memberOf',
      'Derivation'
    ];

    const type = this.getType(source);
    return relationStereotypes.includes(type);
  }
}
