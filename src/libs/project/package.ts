import _ from 'lodash';
import { OntoumlType, ClassStereotype, OntologicalNature, RelationStereotype, AggregationKind } from '@constants/.';
import {
  setContainer,
  ModelElement,
  Container,
  addContentToArray,
  getAllContents,
  getContents,
  Class,
  Relation,
  Property,
  Generalization,
  GeneralizationSet,
  Literal,
  PackageContainer,
  MultilingualText,
  Classifier,
  utils,
  UNBOUNDED_CARDINALITY
} from './';

const packageTemplate = {
  contents: null
};

export class Package extends ModelElement
  implements Container<ModelElement, ModelElement>, PackageContainer<ModelElement, ModelElement> {
  container: Package;
  contents: ModelElement[];

  constructor(base?: Partial<Package>) {
    super(base);
    Object.defineProperty(this, 'type', { value: OntoumlType.PACKAGE_TYPE, enumerable: true });
  }

  getContents(contentsFilter?: (modelElement: ModelElement) => boolean): ModelElement[] {
    return getContents(this, ['contents'], contentsFilter);
  }

  getAllContents(contentsFilter?: (modelElement: ModelElement) => boolean): ModelElement[] {
    return getAllContents(this, ['contents'], contentsFilter);
  }

  getAllAttributes(): Property[] {
    const attributesFilter = (modelElement: ModelElement) =>
      modelElement instanceof Property && (modelElement as Property).isAttribute();
    return this.getAllContents(attributesFilter) as Property[];
  }

  getAllRelationEnds(): Property[] {
    const relationEndsFilter = (modelElement: ModelElement) =>
      modelElement instanceof Property && (modelElement as Property).isRelationEnd();
    return this.getAllContents(relationEndsFilter) as Property[];
  }

  getAllRelations(): Relation[] {
    const relationsFilter = (modelElement: ModelElement) => modelElement instanceof Relation;
    return this.getAllContents(relationsFilter) as Relation[];
  }

  getAllGeneralizations(): Generalization[] {
    const generalizationsFilter = (modelElement: ModelElement) => modelElement instanceof Generalization;
    return this.getAllContents(generalizationsFilter) as Generalization[];
  }

  getAllGeneralizationSets(): GeneralizationSet[] {
    const generalizationSetsFilter = (modelElement: ModelElement) => modelElement instanceof GeneralizationSet;
    return this.getAllContents(generalizationSetsFilter) as GeneralizationSet[];
  }

  getAllPackages(): Package[] {
    const packagesFilter = (modelElement: ModelElement) => modelElement instanceof Package;
    return this.getAllContents(packagesFilter) as Package[];
  }

  getAllClasses(): Class[] {
    const classesFilter = (modelElement: ModelElement) => modelElement instanceof Class;
    return this.getAllContents(classesFilter) as Class[];
  }

  getAllEnumerations(): Class[] {
    const classesFilter = (modelElement: ModelElement) =>
      modelElement instanceof Class && (modelElement as Class).isEnumeration();
    return this.getAllContents(classesFilter) as Class[];
  }

  getAllLiterals(): Literal[] {
    const literalsFilter = (modelElement: ModelElement) => modelElement instanceof Literal;
    return this.getAllContents(literalsFilter) as Literal[];
  }

  toJSON(): any {
    const packageSerialization = {} as Package;

    Object.assign(packageSerialization, packageTemplate, super.toJSON());

    return packageSerialization;
  }

  createPackage(name?: MultilingualText, base?: Partial<Package>): Package {
    return addContentToArray<ModelElement, Package>(
      this,
      'contents',
      new Package({ ...base, name: name, container: this, project: this.project })
    );
  }

  createClass(
    name?: MultilingualText,
    stereotype?: ClassStereotype,
    natures?: OntologicalNature | OntologicalNature[],
    base?: Partial<Class>
  ): Class {
    return addContentToArray<ModelElement, Class>(
      this,
      'contents',
      new Class({
        ...base,
        name: name,
        stereotypes: utils.arrayFromInputOrInputArray(stereotype),
        restrictedTo: utils.arrayFromInputOrInputArray(natures),
        container: this,
        project: this.project
      })
    );
  }

  createType(name?: MultilingualText, base?: Partial<Class>): Class {
    return this.createClass(name, ClassStereotype.TYPE, OntologicalNature.type, base);
  }

  createHistoricalRole(name?: MultilingualText, base?: Partial<Class>): Class {
    return this.createClass(name, ClassStereotype.HISTORICAL_ROLE, OntologicalNature.functional_complex, base);
  }

  createHistoricalRoleMixin(
    name?: MultilingualText,
    natures?: OntologicalNature | OntologicalNature[],
    base?: Partial<Class>
  ): Class {
    const isAbstract = true;
    return this.createClass(
      name,
      ClassStereotype.HISTORICAL_ROLE_MIXIN,
      natures || OntologicalNature.functional_complex,
      Object.assign({}, base, { isAbstract })
    );
  }

  createEvent(name?: MultilingualText, base?: Partial<Class>): Class {
    return this.createClass(name, ClassStereotype.EVENT, OntologicalNature.event, base);
  }

  createSituation(name?: MultilingualText, base?: Partial<Class>): Class {
    return this.createClass(name, ClassStereotype.SITUATION, OntologicalNature.situation, base);
  }

  createCategory(name?: MultilingualText, natures?: OntologicalNature | OntologicalNature[], base?: Partial<Class>): Class {
    const isAbstract = true;
    return this.createClass(
      name,
      ClassStereotype.CATEGORY,
      natures || OntologicalNature.functional_complex,
      Object.assign({}, base, { isAbstract })
    );
  }

  createMixin(name?: MultilingualText, natures?: OntologicalNature | OntologicalNature[], base?: Partial<Class>): Class {
    const isAbstract = true;
    return this.createClass(
      name,
      ClassStereotype.MIXIN,
      natures || OntologicalNature.functional_complex,
      Object.assign({}, base, { isAbstract })
    );
  }

  createRoleMixin(name?: MultilingualText, natures?: OntologicalNature | OntologicalNature[], base?: Partial<Class>): Class {
    const isAbstract = true;
    return this.createClass(
      name,
      ClassStereotype.ROLE_MIXIN,
      natures || OntologicalNature.functional_complex,
      Object.assign({}, base, { isAbstract })
    );
  }

  createPhaseMixin(name?: MultilingualText, natures?: OntologicalNature | OntologicalNature[], base?: Partial<Class>): Class {
    const isAbstract = true;
    return this.createClass(
      name,
      ClassStereotype.PHASE_MIXIN,
      natures || OntologicalNature.functional_complex,
      Object.assign({}, base, { isAbstract })
    );
  }

  createKind(name?: MultilingualText, base?: Partial<Class>): Class {
    return this.createClass(name, ClassStereotype.KIND, OntologicalNature.functional_complex, base);
  }

  createCollective(name?: MultilingualText, isExtensional?: boolean, base?: Partial<Class>): Class {
    return this.createClass(
      name,
      ClassStereotype.COLLECTIVE,
      OntologicalNature.collective,
      Object.assign({}, base, { isExtensional })
    );
  }

  createQuantity(name?: MultilingualText, base?: Partial<Class>): Class {
    return this.createClass(name, ClassStereotype.QUANTITY, OntologicalNature.quantity, base);
  }

  createRelator(name?: MultilingualText, base?: Partial<Class>): Class {
    return this.createClass(name, ClassStereotype.RELATOR, OntologicalNature.relator, base);
  }

  createQuality(name?: MultilingualText, base?: Partial<Class>): Class {
    return this.createClass(name, ClassStereotype.QUALITY, OntologicalNature.quality, base);
  }

  createIntrinsicMode(name?: MultilingualText, base?: Partial<Class>): Class {
    return this.createClass(name, ClassStereotype.MODE, OntologicalNature.intrinsic_mode, base);
  }

  createExtrinsicMode(name?: MultilingualText, base?: Partial<Class>): Class {
    return this.createClass(name, ClassStereotype.MODE, OntologicalNature.extrinsic_mode, base);
  }

  createSubkind(name?: MultilingualText, nature?: OntologicalNature, base?: Partial<Class>): Class {
    return this.createClass(name, ClassStereotype.SUBKIND, nature || OntologicalNature.functional_complex, base);
  }

  createRole(name?: MultilingualText, nature?: OntologicalNature, base?: Partial<Class>): Class {
    return this.createClass(name, ClassStereotype.ROLE, nature || OntologicalNature.functional_complex, base);
  }

  createPhase(name?: MultilingualText, nature?: OntologicalNature, base?: Partial<Class>): Class {
    return this.createClass(name, ClassStereotype.PHASE, nature || OntologicalNature.functional_complex, base);
  }

  createAbstract(name?: MultilingualText, base?: Partial<Class>): Class {
    return this.createClass(name, ClassStereotype.ABSTRACT, OntologicalNature.abstract, base);
  }

  createDatatype(name?: MultilingualText, base?: Partial<Class>): Class {
    return this.createClass(name, ClassStereotype.DATATYPE, OntologicalNature.abstract, base);
  }

  createEnumeration(name?: MultilingualText, literals?: Partial<Literal>[], base?: Partial<Class>): Class {
    const enumeration = this.createClass(name, ClassStereotype.ENUMERATION, OntologicalNature.abstract, base);
    if (Array.isArray(literals)) {
      literals.forEach((literalBase: Partial<Literal>) => enumeration.createLiteral(literalBase.name, literalBase));
    }
    return enumeration;
  }

  createRelation(base?: Partial<Relation>): Relation {
    return addContentToArray<ModelElement, Relation>(
      this,
      'contents',
      new Relation(Object.assign({}, base, { container: this, project: this.project }))
    );
  }

  createBinaryRelation(
    source: Class,
    target: Class,
    name?: MultilingualText,
    stereotype?: RelationStereotype,
    base?: Partial<Relation>
  ): Relation {
    const binaryRelation = this.createRelation(Object.assign({}, base, { name, stereotype }));
    binaryRelation.createSourceEnd({ propertyType: source });
    binaryRelation.createTargetEnd({ propertyType: target });
    return binaryRelation;
  }

  createDerivationRelation(
    derivingRelation: Relation,
    derivedClass: Class,
    name?: MultilingualText,
    base?: Partial<Relation>
  ): Relation {
    const derivationRelation = this.createRelation(
      Object.assign({}, base, { name, stereotype: [RelationStereotype.DERIVATION] })
    );
    derivationRelation.createSourceEnd({ propertyType: derivingRelation });
    derivationRelation.createTargetEnd({ propertyType: derivedClass });
    return derivationRelation;
  }

  createTernaryRelation(relata: Class[], name?: MultilingualText, base?: Partial<Relation>): Relation {
    const ternaryRelation = this.createRelation(Object.assign({}, base, { name, stereotype: [RelationStereotype.DERIVATION] }));
    relata.forEach((relatum: Class) => ternaryRelation.createMemberEnd({ propertyType: relatum }));
    return ternaryRelation;
  }

  createMaterialRelation(source: Class, target: Class, name?: MultilingualText, base?: Partial<Relation>): Relation {
    const relation = this.createBinaryRelation(source, target, name, RelationStereotype.MATERIAL, base);
    const sourceEnd = relation.getSourceEnd();
    const targetEnd = relation.getTargetEnd();

    if (target.isRole() || target.isRoleMixin()) {
      sourceEnd.setCardinalityToOneToMany();
    } else {
      sourceEnd.setCardinalityToMany();
    }

    if (source.isRole() || source.isRoleMixin()) {
      targetEnd.setCardinalityToOneToMany();
    } else {
      targetEnd.setCardinalityToMany();
    }

    return relation;
  }

  createComparativeRelation(source: Class, target: Class, name?: MultilingualText, base?: Partial<Relation>): Relation {
    const relation = this.createBinaryRelation(source, target, name, RelationStereotype.COMPARATIVE, base);
    const sourceEnd = relation.getSourceEnd();
    const targetEnd = relation.getTargetEnd();
    sourceEnd.setCardinalityToZeroToOne();
    sourceEnd.isReadOnly = true;
    targetEnd.setCardinalityToZeroToOne();
    targetEnd.isReadOnly = true;
    return relation;
  }

  createMediationRelation(source: Class, target: Class, name?: MultilingualText, base?: Partial<Relation>): Relation {
    const relation = this.createBinaryRelation(source, target, name, RelationStereotype.MEDIATION, base);
    const sourceEnd = relation.getSourceEnd();
    const targetEnd = relation.getTargetEnd();

    if (target.isRole() || target.isRoleMixin()) {
      sourceEnd.setCardinalityToOneToMany();
    } else {
      sourceEnd.setCardinalityToMany();
    }

    targetEnd.setCardinalityToOne();
    targetEnd.isReadOnly = true;

    return relation;
  }

  createCharacterizationRelation(source: Class, target: Class, name?: MultilingualText, base?: Partial<Relation>): Relation {
    const relation = this.createBinaryRelation(source, target, name, RelationStereotype.CHARACTERIZATION, base);
    const sourceEnd = relation.getSourceEnd();
    const targetEnd = relation.getTargetEnd();

    sourceEnd.setCardinalityToOne();
    targetEnd.setCardinalityToOne();
    targetEnd.isReadOnly = true;

    return relation;
  }

  createExternalDependencyRelation(source: Class, target: Class, name?: MultilingualText, base?: Partial<Relation>): Relation {
    const relation = this.createBinaryRelation(source, target, name, RelationStereotype.EXTERNAL_DEPENDENCE, base);
    const sourceEnd = relation.getSourceEnd();
    const targetEnd = relation.getTargetEnd();

    sourceEnd.setCardinalityToMany();
    targetEnd.setCardinalityToOneToMany();
    targetEnd.isReadOnly = true;

    return relation;
  }

  createComponentOfRelation(source: Class, target: Class, name?: MultilingualText, base?: Partial<Relation>): Relation {
    const relation = this.createBinaryRelation(source, target, name, RelationStereotype.COMPONENT_OF, base);
    const sourceEnd = relation.getSourceEnd();
    const targetEnd = relation.getTargetEnd();

    sourceEnd.setCardinalityToOneToMany();
    targetEnd.setCardinalityToOne();
    targetEnd.aggregationKind = AggregationKind.COMPOSITE;

    return relation;
  }

  createMemberOfRelation(source: Class, target: Class, name?: MultilingualText, base?: Partial<Relation>): Relation {
    const relation = this.createBinaryRelation(source, target, name, RelationStereotype.MEMBER_OF, base);
    const sourceEnd = relation.getSourceEnd();
    const targetEnd = relation.getTargetEnd();

    sourceEnd.setCardinalityToOneToMany();
    targetEnd.setCardinalityToOneToMany();
    targetEnd.aggregationKind = AggregationKind.SHARED;

    return relation;
  }

  createSubCollectionOfRelation(source: Class, target: Class, name?: MultilingualText, base?: Partial<Relation>): Relation {
    const relation = this.createBinaryRelation(source, target, name, RelationStereotype.SUBCOLLECTION_OF, base);
    const sourceEnd = relation.getSourceEnd();
    const targetEnd = relation.getTargetEnd();

    sourceEnd.setCardinality(1, 1);
    targetEnd.setCardinality(1, 1);
    targetEnd.aggregationKind = AggregationKind.COMPOSITE;

    return relation;
  }

  createSubQuantityOfRelation(source: Class, target: Class, name?: MultilingualText, base?: Partial<Relation>): Relation {
    const relation = this.createBinaryRelation(source, target, name, RelationStereotype.SUBQUANTITY_OF, base);
    const sourceEnd = relation.getSourceEnd();
    const targetEnd = relation.getTargetEnd();

    sourceEnd.setCardinality(1, 1);
    targetEnd.setCardinality(1, 1);
    targetEnd.aggregationKind = AggregationKind.COMPOSITE;

    return relation;
  }

  createInstantiationRelation(source: Class, target: Class, name?: MultilingualText, base?: Partial<Relation>): Relation {
    const relation = this.createBinaryRelation(source, target, name, RelationStereotype.INSTANTIATION, base);
    const sourceEnd = relation.getSourceEnd();
    const targetEnd = relation.getTargetEnd();

    sourceEnd.setCardinality(0, UNBOUNDED_CARDINALITY);
    targetEnd.setCardinality(1, UNBOUNDED_CARDINALITY);

    return relation;
  }

  createTerminationRelation(source: Class, target: Class, name?: MultilingualText, base?: Partial<Relation>): Relation {
    const relation = this.createBinaryRelation(source, target, name, RelationStereotype.TERMINATION, base);
    const sourceEnd = relation.getSourceEnd();
    const targetEnd = relation.getTargetEnd();

    sourceEnd.setCardinality(1, 1);
    sourceEnd.isReadOnly = true;
    targetEnd.setCardinality(1, 1);
    targetEnd.isReadOnly = true;

    return relation;
  }

  createParticipationalRelation(source: Class, target: Class, name?: MultilingualText, base?: Partial<Relation>): Relation {
    const relation = this.createBinaryRelation(source, target, name, RelationStereotype.PARTICIPATIONAL, base);
    const sourceEnd = relation.getSourceEnd();
    const targetEnd = relation.getTargetEnd();

    sourceEnd.setCardinalityToOneToMany();
    sourceEnd.isReadOnly = true;
    targetEnd.setCardinalityToOne();
    targetEnd.isReadOnly = true;
    targetEnd.aggregationKind = AggregationKind.COMPOSITE;

    return relation;
  }

  createParticipationRelation(source: Class, target: Class, name?: MultilingualText, base?: Partial<Relation>): Relation {
    const relation = this.createBinaryRelation(source, target, name, RelationStereotype.PARTICIPATION, base);
    const sourceEnd = relation.getSourceEnd();
    const targetEnd = relation.getTargetEnd();

    sourceEnd.setCardinalityToZeroToOne();
    sourceEnd.isReadOnly = true;

    if (source.isHistoricalRole() || source.isHistoricalRoleMixin()) {
      targetEnd.setCardinalityToOneToMany();
    } else {
      targetEnd.setCardinalityToMany();
    }

    return relation;
  }

  createHistoricalDependenceRelation(source: Class, target: Class, name?: MultilingualText, base?: Partial<Relation>): Relation {
    const relation = this.createBinaryRelation(source, target, name, RelationStereotype.HISTORICAL_DEPENDENCE, base);
    const sourceEnd = relation.getSourceEnd();
    const targetEnd = relation.getTargetEnd();

    sourceEnd.setCardinalityToMany();
    sourceEnd.isReadOnly = true;
    targetEnd.setCardinalityToOne();

    return relation;
  }

  createCreationRelation(source: Class, target: Class, name?: MultilingualText, base?: Partial<Relation>): Relation {
    const relation = this.createBinaryRelation(source, target, name, RelationStereotype.CREATION, base);
    const sourceEnd = relation.getSourceEnd();
    const targetEnd = relation.getTargetEnd();

    sourceEnd.setCardinalityToOne();
    sourceEnd.isReadOnly = true;
    targetEnd.setCardinalityToOne();
    targetEnd.isReadOnly = true;

    return relation;
  }

  createManifestationRelation(source: Class, target: Class, name?: MultilingualText, base?: Partial<Relation>): Relation {
    const relation = this.createBinaryRelation(source, target, name, RelationStereotype.MANIFESTATION, base);
    const sourceEnd = relation.getSourceEnd();
    const targetEnd = relation.getTargetEnd();

    sourceEnd.setCardinalityToOneToMany();
    sourceEnd.isReadOnly = true;
    targetEnd.setCardinalityToMany();

    return relation;
  }

  createBringsAboutRelation(source: Class, target: Class, name?: MultilingualText, base?: Partial<Relation>): Relation {
    const relation = this.createBinaryRelation(source, target, name, RelationStereotype.BRINGS_ABOUT, base);
    const sourceEnd = relation.getSourceEnd();
    const targetEnd = relation.getTargetEnd();

    sourceEnd.setCardinalityToOne();
    sourceEnd.isReadOnly = true;
    targetEnd.setCardinalityToOne();
    targetEnd.isReadOnly = true;

    return relation;
  }

  createTriggersRelation(source: Class, target: Class, name?: MultilingualText, base?: Partial<Relation>): Relation {
    const relation = this.createBinaryRelation(source, target, name, RelationStereotype.TRIGGERS, base);
    const sourceEnd = relation.getSourceEnd();
    const targetEnd = relation.getTargetEnd();

    sourceEnd.setCardinalityToOne();
    sourceEnd.isReadOnly = true;
    targetEnd.setCardinalityToOne();

    return relation;
  }

  createPartWholeRelation(source: Class, target: Class, name?: MultilingualText, base?: Partial<Relation>): Relation {
    const relation = this.createBinaryRelation(source, target, name, null, base);
    const sourceEnd = relation.getSourceEnd();
    const targetEnd = relation.getTargetEnd();

    sourceEnd.setCardinality(2, UNBOUNDED_CARDINALITY);
    targetEnd.setCardinality(1, 1);
    targetEnd.aggregationKind = AggregationKind.COMPOSITE;

    return relation;
  }

  createGeneralization(
    general: Classifier,
    specific: Classifier,
    name?: MultilingualText,
    base?: Partial<Generalization>
  ): Generalization {
    return addContentToArray<ModelElement, Generalization>(
      this,
      'contents',
      new Generalization(Object.assign({}, base, { name, general, specific, container: this, project: this.project }))
    );
  }

  createGeneralizationSet(
    generalizations: Generalization | Generalization[],
    isDisjoint: boolean = false,
    isComplete: boolean = false,
    name?: MultilingualText,
    base?: Partial<GeneralizationSet>
  ): GeneralizationSet {
    isDisjoint = isDisjoint || false; // avoids issues when receiving undefined or null
    isComplete = isComplete || false;

    return addContentToArray<ModelElement, GeneralizationSet>(
      this,
      'contents',
      new GeneralizationSet(
        Object.assign({}, base, {
          name,
          isDisjoint,
          isComplete,
          generalizations: utils.arrayFromInputOrInputArray(generalizations),
          container: this,
          project: this.project
        })
      )
    );
  }

  createPartition(
    generalizations: Generalization | Generalization[],
    name?: MultilingualText,
    base?: Partial<GeneralizationSet>
  ): GeneralizationSet {
    return this.createGeneralizationSet(
      generalizations,
      false,
      false,
      name,
      Object.assign({}, base, { isDisjoint: true, isComplete: true })
    );
  }

  setContainer(container: Package): void {
    setContainer(this, container);
  }

  // TODO: do we need some getContent(match) method?
}
