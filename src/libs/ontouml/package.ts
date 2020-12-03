import _ from 'lodash';
import {
  ModelElement,
  Container,
  containerUtils,
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
  propertyUtils,
  ClassStereotype,
  OntologicalNature,
  RelationStereotype,
  OntoumlType,
  AggregationKind,
  Project
} from './';

export class Package extends ModelElement
  implements Container<ModelElement, ModelElement>, PackageContainer<ModelElement, ModelElement> {
  container: Package; // for the root package, container must be null, only this.project is set
  contents: ModelElement[];

  constructor(base?: Partial<Package>) {
    super(base);

    Object.defineProperty(this, 'type', { value: OntoumlType.PACKAGE_TYPE, enumerable: true });

    this.contents = this.contents || null;
  }

  getContents(contentsFilter?: (modelElement: ModelElement) => boolean): ModelElement[] {
    return containerUtils.getContents(this, ['contents'], contentsFilter);
  }

  getAllContents(contentsFilter?: (modelElement: ModelElement) => boolean): ModelElement[] {
    return containerUtils.getAllContents(this, ['contents'], contentsFilter);
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
      modelElement instanceof Class && (modelElement as Class).hasEnumerationStereotype();
    return this.getAllContents(classesFilter) as Class[];
  }

  // TODO: review if this function should exist
  getAllLiterals(): Literal[] {
    const literalsFilter = (modelElement: ModelElement) => modelElement instanceof Literal;
    return this.getAllContents(literalsFilter) as Literal[];
  }

  toJSON(): any {
    const packageSerialization = {
      contents: null
    };

    Object.assign(packageSerialization, super.toJSON());

    return packageSerialization;
  }

  createPackage(name?: MultilingualText, base?: Partial<Package>): Package {
    return containerUtils.addContentToArray<ModelElement, Package>(
      this,
      'contents',
      new Package(Object.assign({}, base, { name, container: this, project: this.project }))
    );
  }

  // TODO: documentation
  createClass(
    name?: MultilingualText,
    stereotype?: ClassStereotype,
    natures?: OntologicalNature | OntologicalNature[],
    base?: Partial<Class>
  ): Class {
    return containerUtils.addContentToArray<ModelElement, Class>(
      this,
      'contents',
      new Class(
        Object.assign({}, base, {
          name,
          stereotypes: utils.arrayFrom(stereotype),
          restrictedTo: utils.arrayFrom(natures),
          container: this,
          project: this.project
        })
      )
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

  // TODO: move default
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
    return containerUtils.addContentToArray<ModelElement, Relation>(
      this,
      'contents',
      new Relation(Object.assign({}, base, { container: this, project: this.project }))
    );
  }

  // TODO: update names
  createBinaryRelation(
    source: Class,
    target: Class,
    name?: MultilingualText,
    stereotype?: RelationStereotype,
    base?: Partial<Relation>
  ): Relation {
    const binaryRelation = this.createRelation(Object.assign({}, base, { name, stereotypes: utils.arrayFrom(stereotype) }));
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
      Object.assign({}, base, { name, stereotypes: [RelationStereotype.DERIVATION] })
    );
    derivationRelation.createSourceEnd({ propertyType: derivingRelation });
    derivationRelation.createTargetEnd({ propertyType: derivedClass });
    return derivationRelation;
  }

  createTernaryRelation(relata: Class[], name?: MultilingualText, base?: Partial<Relation>): Relation {
    if (relata.length < 3) {
      throw new Error('Ternary relations must involve at least 3 members');
    }

    const ternaryRelation = this.createRelation(Object.assign({}, base, { name }));
    relata.forEach((relatum: Class, index: number) => ternaryRelation.createMemberEnd(index, { propertyType: relatum }));
    return ternaryRelation;
  }

  createMaterialRelation(source: Class, target: Class, name?: MultilingualText, base?: Partial<Relation>): Relation {
    const relation = this.createBinaryRelation(source, target, name, RelationStereotype.MATERIAL, base);
    const sourceEnd = relation.getSourceEnd();
    const targetEnd = relation.getTargetEnd();

    if (target.hasRoleStereotype() || target.hasRoleMixinStereotype()) {
      sourceEnd.setCardinalityToOneToMany();
    } else {
      sourceEnd.setCardinalityToMany();
    }

    if (source.hasRoleStereotype() || source.hasRoleMixinStereotype()) {
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

    if (target.hasRoleStereotype() || target.hasRoleMixinStereotype()) {
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

    sourceEnd.setCardinality(0, propertyUtils.UNBOUNDED_CARDINALITY);
    targetEnd.setCardinality(1, propertyUtils.UNBOUNDED_CARDINALITY);

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

    if (source.hasHistoricalRoleStereotype() || source.hasHistoricalRoleMixinStereotype()) {
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

    sourceEnd.setCardinality(2, propertyUtils.UNBOUNDED_CARDINALITY);
    targetEnd.setCardinality(1, 1);
    targetEnd.aggregationKind = AggregationKind.COMPOSITE;

    return relation;
  }

  createGeneralization(
    general: Classifier<any>,
    specific: Classifier<any>,
    name?: MultilingualText,
    base?: Partial<Generalization>
  ): Generalization {
    return containerUtils.addContentToArray<ModelElement, Generalization>(
      this,
      'contents',
      new Generalization(Object.assign({}, base, { name, general, specific, container: this, project: this.project }))
    );
  }

  createGeneralizationSet(
    generalizations: Generalization | Generalization[],
    isDisjoint: boolean = false,
    isComplete: boolean = false,
    categorizer?: Class,
    name?: MultilingualText,
    base?: Partial<GeneralizationSet>
  ): GeneralizationSet {
    isDisjoint = isDisjoint || false; // avoids issues when receiving undefined or null
    isComplete = isComplete || false;
    categorizer = categorizer || null;

    return containerUtils.addContentToArray<ModelElement, GeneralizationSet>(
      this,
      'contents',
      new GeneralizationSet(
        Object.assign({}, base, {
          name,
          isDisjoint,
          isComplete,
          categorizer,
          generalizations: utils.arrayFrom(generalizations),
          container: this,
          project: this.project
        })
      )
    );
  }

  createPartition(
    generalizations: Generalization | Generalization[],
    categorizer?: Class,
    name?: MultilingualText,
    base?: Partial<GeneralizationSet>
  ): GeneralizationSet {
    categorizer = categorizer || null;

    return this.createGeneralizationSet(generalizations, true, true, categorizer, name, Object.assign({}, base));
  }

  setContainer(newContainer: Package): void {
    if (this.container instanceof Project) {
      throw new Error('This method cannot be used on a root package');
    }

    containerUtils.setContainer(this, newContainer, 'contents', true);
  }

  /**
   * Clones the model element and all its contents. Replaces all references to
   * original contents with references to their clones if
   * `replaceReferences = true`. If `replaceReferences = false`, replace() will
   * not be triggered, but this argument should only be used in recursive calls.
   *
   * @param replaceReferences - set to false on recursive calls to avoid
   * unnecessary call to `replace()`.
   *  */
  clone(replaceReferences: boolean = true): Package {
    const clone = new Package(this);

    if (clone.contents) {
      clone.contents = clone.contents.map((content: ModelElement) => {
        if (content instanceof Package) {
          return content.clone(false);
        } else {
          return content.clone();
        }
      });
    }

    if (replaceReferences) {
      Package.triggersReplaceOnClonedPackage(this, clone);
    }

    return clone;
  }

  replace(originalElement: ModelElement, newElement: ModelElement): void {
    if (this.container === originalElement) {
      this.container = newElement as Package;
    }

    this.getContents().forEach((content: ModelElement) => content.replace(originalElement, newElement));
  }

  /** Triggers `replace()` on `clonedPackage` and all of its contents, removing
   * references to the contents of `originalPackage` with their references to
   * their clones. */
  static triggersReplaceOnClonedPackage(originalPackage: Package, clonedPackage: Package): void {
    const replacementsMap = new Map<string, { originalContent: ModelElement; newContent: ModelElement }>();

    replacementsMap.set(originalPackage.id, { originalContent: originalPackage, newContent: clonedPackage });

    originalPackage.getAllContents().forEach((content: ModelElement) => {
      replacementsMap.set(content.id, { originalContent: content, newContent: null });
    });

    clonedPackage.getAllContents().forEach((content: ModelElement) => {
      const id = content.id;
      const entry = { ...replacementsMap.get(id), newContent: content };
      replacementsMap.set(id, entry);
    });

    clonedPackage
      .getContents()
      .forEach((content: ModelElement) =>
        replacementsMap.forEach(({ originalContent, newContent }) => content.replace(originalContent, newContent))
      );
  }
}
