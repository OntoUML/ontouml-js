import _, { remove } from 'lodash';
import { OntoumlElement } from '..';
import { OntoumlType } from '..';
import { utils } from '..';
import { Class } from '..';
import { AggregationKind, ClassStereotype, OntologicalNature, PropertyStereotype, RelationStereotype } from '..';
import { Generalization } from '..';
import { GeneralizationSet } from '..';
import { Literal } from '..';
import { ModelElement } from '..';
import { ModelElementContainer } from '..';
import { Property } from '..';
import { Relation } from '..';
import { MultilingualText } from '../multilingual_text';
import { Classifier } from './classifier';
import { Stereotype } from './stereotypes';

export class Package extends ModelElement implements ModelElementContainer {
  contents: ModelElement[];

  constructor(base?: Partial<Package>) {
    super(OntoumlType.PACKAGE_TYPE, base);

    this.contents = base?.contents || [];
  }

  addContent<T extends ModelElement>(child: T): T {
    if (child == null) return null;

    if (child.container instanceof Package) child.container.removeContent(child);

    child.setContainer(this);
    this.contents.push(child);
    return child;
  }

  addContents<T extends ModelElement>(contents: T[]): T[] {
    if (!contents) return [];
    return contents.filter(x => x !== null).map(x => this.addContent(x));
  }

  setContents<T extends ModelElement>(contents: T[]): T[] {
    this.contents = [];
    return this.addContents(contents);
  }

  removeContent<T extends ModelElement>(child: T): T {
    let removed = _.remove(this.contents, x => child === x);
    return remove?.[0] || null;
  }

  getContents(): OntoumlElement[] {
    return this.contents ? [...this.contents] : [];
  }

  getElementById(id: String): OntoumlElement {
    return this.getAllContents().filter(e => e.id === id)?.[0];
  }

  getClassById(id: String): Class {
    return this.getAllClasses().filter(e => e.id === id)?.[0];
  }

  getRelationById(id: String): Relation {
    return this.getAllRelations().filter(e => e.id === id)?.[0];
  }

  getPropertyById(id: String): Property {
    return this.getAllProperties().filter(e => e.id === id)?.[0];
  }

  getGeneralizationById(id: String): Generalization {
    return this.getAllGeneralizations().filter(e => e.id === id)?.[0];
  }

  getGeneralizationSetById(id: String): GeneralizationSet {
    return this.getAllGeneralizationSets().filter(e => e.id === id)?.[0];
  }

  getPackageById(id: String): Package {
    return this.getAllPackages().filter(e => e.id === id)?.[0];
  }

  getAllProperties(): Property[] {
    return this.getAllContents().filter(e => e instanceof Property) as Property[];
  }

  getAllAttributes(): Property[] {
    return this.getAllProperties().filter(p => p.isAttribute());
  }

  getAllRelationEnds(): Property[] {
    return this.getAllProperties().filter(p => p.isRelationEnd());
  }

  getAllRelations(): Relation[] {
    return this.getAllContents().filter(e => e instanceof Relation) as Relation[];
  }

  getAllGeneralizations(): Generalization[] {
    return this.getAllContents().filter(e => e instanceof Generalization) as Generalization[];
  }

  getAllGeneralizationSets(): GeneralizationSet[] {
    return this.getAllContents().filter(e => e instanceof GeneralizationSet) as GeneralizationSet[];
  }

  getAllPackages(): Package[] {
    return this.getAllContents().filter(e => e instanceof Package) as Package[];
  }

  getAllClasses(): Class[] {
    return this.getAllContents().filter(e => e instanceof Class) as Class[];
  }

  getAllEnumerations(): Class[] {
    return this.getAllClasses().filter(c => c.hasEnumerationStereotype()) as Class[];
  }

  getAllLiterals(): Literal[] {
    return this.getAllContents().filter(e => e instanceof Literal) as Literal[];
  }

  getAllModelElements(): ModelElement[] {
    return this.getAllContents().filter(e => e instanceof ModelElement) as ModelElement[];
  }

  getAllContentsByType(type: OntoumlType | OntoumlType[]): OntoumlElement[] {
    const types = utils.arrayFrom(type);
    return this.getAllContents().filter(e => types.includes(e.type));
  }

  getAllAttributesByStereotype(stereotype: PropertyStereotype | PropertyStereotype[]): Property[] {
    const stereotypes = utils.arrayFrom(stereotype);
    const stereotypesFilter = (attribute: Property) => stereotypes.includes(attribute.stereotype);
    return this.getAllAttributes().filter(stereotypesFilter);
  }

  getAllClassesByStereotype(stereotype: ClassStereotype | ClassStereotype[]): Class[] {
    const stereotypes = utils.arrayFrom(stereotype);
    const stereotypesFilter = (_class: Class) => stereotypes.includes(_class.stereotype);
    return this.getAllClasses().filter(stereotypesFilter);
  }

  getAllRelationsByStereotype(stereotype: RelationStereotype | RelationStereotype[]): Relation[] {
    const stereotypes = utils.arrayFrom(stereotype);
    const stereotypesFilter = (relation: Relation) => stereotypes.includes(relation.stereotype);
    return this.getAllRelations().filter(stereotypesFilter);
  }

  getAllClassesWithRestrictedToContainedIn(nature: OntologicalNature | OntologicalNature[]): Class[] {
    const natures = utils.arrayFrom(nature);
    const naturesFilter = (_class: Class) => _class.restrictedToContainedIn(natures);
    return this.getAllClasses().filter(naturesFilter);
  }

  getClassesWithTypeStereotype(): Class[] {
    return this.getAllClassesByStereotype(ClassStereotype.TYPE);
  }

  getClassesWithHistoricalRoleStereotype(): Class[] {
    return this.getAllClassesByStereotype(ClassStereotype.HISTORICAL_ROLE);
  }

  getClassesWithHistoricalRoleMixinStereotype(): Class[] {
    return this.getAllClassesByStereotype(ClassStereotype.HISTORICAL_ROLE_MIXIN);
  }

  getClassesWithEventStereotype(): Class[] {
    return this.getAllClassesByStereotype(ClassStereotype.EVENT);
  }

  getClassesWithSituationStereotype(): Class[] {
    return this.getAllClassesByStereotype(ClassStereotype.SITUATION);
  }

  getClassesWithCategoryStereotype(): Class[] {
    return this.getAllClassesByStereotype(ClassStereotype.CATEGORY);
  }

  getClassesWithMixinStereotype(): Class[] {
    return this.getAllClassesByStereotype(ClassStereotype.MIXIN);
  }

  getClassesWithRoleMixinStereotype(): Class[] {
    return this.getAllClassesByStereotype(ClassStereotype.ROLE_MIXIN);
  }

  getClassesWithPhaseMixinStereotype(): Class[] {
    return this.getAllClassesByStereotype(ClassStereotype.PHASE_MIXIN);
  }

  getClassesWithKindStereotype(): Class[] {
    return this.getAllClassesByStereotype(ClassStereotype.KIND);
  }

  getClassesWithCollectiveStereotype(): Class[] {
    return this.getAllClassesByStereotype(ClassStereotype.COLLECTIVE);
  }

  getClassesWithQuantityStereotype(): Class[] {
    return this.getAllClassesByStereotype(ClassStereotype.QUANTITY);
  }

  getClassesWithRelatorStereotype(): Class[] {
    return this.getAllClassesByStereotype(ClassStereotype.RELATOR);
  }

  getClassesWithQualityStereotype(): Class[] {
    return this.getAllClassesByStereotype(ClassStereotype.QUALITY);
  }

  getClassesWithModeStereotype(): Class[] {
    return this.getAllClassesByStereotype(ClassStereotype.MODE);
  }

  getClassesWithSubkindStereotype(): Class[] {
    return this.getAllClassesByStereotype(ClassStereotype.SUBKIND);
  }

  getClassesWithRoleStereotype(): Class[] {
    return this.getAllClassesByStereotype(ClassStereotype.ROLE);
  }

  getClassesWithPhaseStereotype(): Class[] {
    return this.getAllClassesByStereotype(ClassStereotype.PHASE);
  }

  getClassesWithEnumerationStereotype(): Class[] {
    return this.getAllClassesByStereotype(ClassStereotype.ENUMERATION);
  }

  getClassesWithDatatypeStereotype(): Class[] {
    return this.getAllClassesByStereotype(ClassStereotype.DATATYPE);
  }

  getClassesWithAbstractStereotype(): Class[] {
    return this.getAllClassesByStereotype(ClassStereotype.ABSTRACT);
  }

  getClassesRestrictedToFunctionalComplex(): Class[] {
    return this.getAllClassesWithRestrictedToContainedIn(OntologicalNature.functional_complex);
  }

  getClassesRestrictedToCollective(): Class[] {
    return this.getAllClassesWithRestrictedToContainedIn(OntologicalNature.collective);
  }

  getClassesRestrictedToQuantity(): Class[] {
    return this.getAllClassesWithRestrictedToContainedIn(OntologicalNature.quantity);
  }

  getClassesRestrictedToMode(): Class[] {
    return this.getAllClassesWithRestrictedToContainedIn([OntologicalNature.intrinsic_mode, OntologicalNature.extrinsic_mode]);
  }

  getClassesRestrictedToIntrinsicMode(): Class[] {
    return this.getAllClassesWithRestrictedToContainedIn(OntologicalNature.intrinsic_mode);
  }

  getClassesRestrictedToExtrinsicMode(): Class[] {
    return this.getAllClassesWithRestrictedToContainedIn(OntologicalNature.extrinsic_mode);
  }

  getClassesRestrictedToQuality(): Class[] {
    return this.getAllClassesWithRestrictedToContainedIn(OntologicalNature.quality);
  }

  getClassesRestrictedToRelator(): Class[] {
    return this.getAllClassesWithRestrictedToContainedIn(OntologicalNature.relator);
  }

  toJSON(): any {
    const packageSerialization = {
      contents: null
    };

    Object.assign(packageSerialization, super.toJSON());

    return packageSerialization;
  }

  createPackage(name?: string, base?: Partial<Package>): Package {
    let pkg = new Package(Object.assign({}, base, { name: new MultilingualText(name), container: this, project: this.project }));
    return this.addContent(pkg);
  }

  // TODO: documentation
  createClass(
    name?: string,
    stereotype?: ClassStereotype,
    natures?: OntologicalNature | OntologicalNature[],
    base?: Partial<Class>
  ): Class {
    let clazz = new Class(
      Object.assign({}, base, {
        name: new MultilingualText(name),
        stereotype,
        restrictedTo: utils.arrayFrom(natures),
        container: this,
        project: this.project
      })
    );
    return this.addContent(clazz);
  }

  createType(name?: string, base?: Partial<Class>): Class {
    return this.createClass(name, ClassStereotype.TYPE, OntologicalNature.type, base);
  }

  createHistoricalRole(name?: string, base?: Partial<Class>): Class {
    return this.createClass(name, ClassStereotype.HISTORICAL_ROLE, OntologicalNature.functional_complex, base);
  }

  createHistoricalRoleMixin(name?: string, natures?: OntologicalNature | OntologicalNature[], base?: Partial<Class>): Class {
    const isAbstract = true;
    return this.createClass(
      name,
      ClassStereotype.HISTORICAL_ROLE_MIXIN,
      natures || OntologicalNature.functional_complex,
      Object.assign({}, base, { isAbstract })
    );
  }

  createEvent(name?: string, base?: Partial<Class>): Class {
    return this.createClass(name, ClassStereotype.EVENT, OntologicalNature.event, base);
  }

  createSituation(name?: string, base?: Partial<Class>): Class {
    return this.createClass(name, ClassStereotype.SITUATION, OntologicalNature.situation, base);
  }

  createCategory(name?: string, natures?: OntologicalNature | OntologicalNature[], base?: Partial<Class>): Class {
    const isAbstract = true;
    return this.createClass(
      name,
      ClassStereotype.CATEGORY,
      natures || OntologicalNature.functional_complex,
      Object.assign({}, base, { isAbstract })
    );
  }

  createMixin(name?: string, natures?: OntologicalNature | OntologicalNature[], base?: Partial<Class>): Class {
    const isAbstract = true;
    return this.createClass(
      name,
      ClassStereotype.MIXIN,
      natures || OntologicalNature.functional_complex,
      Object.assign({}, base, { isAbstract })
    );
  }

  // TODO: move default
  createRoleMixin(name?: string, natures?: OntologicalNature | OntologicalNature[], base?: Partial<Class>): Class {
    const isAbstract = true;
    return this.createClass(
      name,
      ClassStereotype.ROLE_MIXIN,
      natures || OntologicalNature.functional_complex,
      Object.assign({}, base, { isAbstract })
    );
  }

  createPhaseMixin(name?: string, natures?: OntologicalNature | OntologicalNature[], base?: Partial<Class>): Class {
    const isAbstract = true;
    return this.createClass(
      name,
      ClassStereotype.PHASE_MIXIN,
      natures || OntologicalNature.functional_complex,
      Object.assign({}, base, { isAbstract })
    );
  }

  createKind(name?: string, base?: Partial<Class>): Class {
    return this.createClass(name, ClassStereotype.KIND, OntologicalNature.functional_complex, base);
  }

  createCollective(name?: string, isExtensional?: boolean, base?: Partial<Class>): Class {
    return this.createClass(
      name,
      ClassStereotype.COLLECTIVE,
      OntologicalNature.collective,
      Object.assign({}, base, { isExtensional })
    );
  }

  createQuantity(name?: string, base?: Partial<Class>): Class {
    return this.createClass(name, ClassStereotype.QUANTITY, OntologicalNature.quantity, base);
  }

  createRelator(name?: string, base?: Partial<Class>): Class {
    return this.createClass(name, ClassStereotype.RELATOR, OntologicalNature.relator, base);
  }

  createQuality(name?: string, base?: Partial<Class>): Class {
    return this.createClass(name, ClassStereotype.QUALITY, OntologicalNature.quality, base);
  }

  createIntrinsicMode(name?: string, base?: Partial<Class>): Class {
    return this.createClass(name, ClassStereotype.MODE, OntologicalNature.intrinsic_mode, base);
  }

  createExtrinsicMode(name?: string, base?: Partial<Class>): Class {
    return this.createClass(name, ClassStereotype.MODE, OntologicalNature.extrinsic_mode, base);
  }

  createSubkind(name?: string, nature?: OntologicalNature, base?: Partial<Class>): Class {
    return this.createClass(name, ClassStereotype.SUBKIND, nature || OntologicalNature.functional_complex, base);
  }

  createRole(name?: string, nature?: OntologicalNature, base?: Partial<Class>): Class {
    return this.createClass(name, ClassStereotype.ROLE, nature || OntologicalNature.functional_complex, base);
  }

  createPhase(name?: string, nature?: OntologicalNature, base?: Partial<Class>): Class {
    return this.createClass(name, ClassStereotype.PHASE, nature || OntologicalNature.functional_complex, base);
  }

  createAbstract(name?: string, base?: Partial<Class>): Class {
    return this.createClass(name, ClassStereotype.ABSTRACT, OntologicalNature.abstract, base);
  }

  createDatatype(name?: string, base?: Partial<Class>): Class {
    return this.createClass(name, ClassStereotype.DATATYPE, OntologicalNature.abstract, base);
  }

  createEnumeration(name?: string, literals?: Partial<Literal>[], base?: Partial<Class>): Class {
    const enumeration = this.createClass(name, ClassStereotype.ENUMERATION, OntologicalNature.abstract, base);

    if (Array.isArray(literals)) {
      literals.forEach((literalBase: Partial<Literal>) => enumeration.createLiteral(undefined, literalBase));
    }

    return enumeration;
  }

  createRelation(base?: Partial<Relation>): Relation {
    let relation = new Relation(Object.assign({}, base, { container: this, project: this.project }));
    return this.addContent(relation);
  }

  // TODO: update names
  createBinaryRelation(
    source: Class,
    target: Class,
    name?: string,
    stereotype?: RelationStereotype,
    base?: Partial<Relation>
  ): Relation {
    const binaryRelation = this.createRelation(Object.assign({}, base, { name, stereotype }));
    binaryRelation.createSourceEnd({ propertyType: source });
    binaryRelation.createTargetEnd({ propertyType: target });
    return binaryRelation;
  }

  createDerivationRelation(derivingRelation: Relation, derivedClass: Class, name?: string, base?: Partial<Relation>): Relation {
    const derivationRelation = this.createRelation(Object.assign({}, base, { name, stereotype: RelationStereotype.DERIVATION }));
    derivationRelation.createSourceEnd({ propertyType: derivingRelation });
    derivationRelation.createTargetEnd({ propertyType: derivedClass });
    return derivationRelation;
  }

  createTernaryRelation(relata: Class[], name?: string, base?: Partial<Relation>): Relation {
    if (relata.length < 3) {
      throw new Error('Ternary relations must involve at least 3 members');
    }

    const ternaryRelation = this.createRelation(Object.assign({}, base, { name }));
    relata.forEach((relatum: Class, index: number) => ternaryRelation.createMemberEnd(index, { propertyType: relatum }));
    return ternaryRelation;
  }

  createMaterialRelation(source: Class, target: Class, name?: string, base?: Partial<Relation>): Relation {
    const relation = this.createBinaryRelation(source, target, name, RelationStereotype.MATERIAL, base);
    const sourceEnd = relation.getSourceEnd();
    const targetEnd = relation.getTargetEnd();

    if (target.hasRoleStereotype() || target.hasRoleMixinStereotype()) {
      sourceEnd.cardinality.setOneToMany();
    } else {
      sourceEnd.cardinality.setZeroToMany();
    }

    if (source.hasRoleStereotype() || source.hasRoleMixinStereotype()) {
      targetEnd.cardinality.setOneToMany();
    } else {
      targetEnd.cardinality.setZeroToMany();
    }

    return relation;
  }

  createComparativeRelation(source: Class, target: Class, name?: string, base?: Partial<Relation>): Relation {
    const relation = this.createBinaryRelation(source, target, name, RelationStereotype.COMPARATIVE, base);
    const sourceEnd = relation.getSourceEnd();
    const targetEnd = relation.getTargetEnd();
    sourceEnd.cardinality.setZeroToOne();
    sourceEnd.isReadOnly = true;
    targetEnd.cardinality.setZeroToOne();
    targetEnd.isReadOnly = true;
    return relation;
  }

  createMediationRelation(source: Class, target: Class, name?: string, base?: Partial<Relation>): Relation {
    const relation = this.createBinaryRelation(source, target, name, RelationStereotype.MEDIATION, base);
    const sourceEnd = relation.getSourceEnd();
    const targetEnd = relation.getTargetEnd();

    if (target.hasRoleStereotype() || target.hasRoleMixinStereotype()) {
      sourceEnd.cardinality.setOneToMany();
    } else {
      sourceEnd.cardinality.setZeroToMany();
    }

    targetEnd.cardinality.setOneToOne();
    targetEnd.isReadOnly = true;

    return relation;
  }

  createCharacterizationRelation(source: Class, target: Class, name?: string, base?: Partial<Relation>): Relation {
    const relation = this.createBinaryRelation(source, target, name, RelationStereotype.CHARACTERIZATION, base);
    const sourceEnd = relation.getSourceEnd();
    const targetEnd = relation.getTargetEnd();

    sourceEnd.cardinality.setOneToOne();
    targetEnd.cardinality.setOneToOne();
    targetEnd.isReadOnly = true;

    return relation;
  }

  createExternalDependencyRelation(source: Class, target: Class, name?: string, base?: Partial<Relation>): Relation {
    const relation = this.createBinaryRelation(source, target, name, RelationStereotype.EXTERNAL_DEPENDENCE, base);
    const sourceEnd = relation.getSourceEnd();
    const targetEnd = relation.getTargetEnd();

    sourceEnd.cardinality.setZeroToMany();
    targetEnd.cardinality.setOneToMany();
    targetEnd.isReadOnly = true;

    return relation;
  }

  createComponentOfRelation(source: Class, target: Class, name?: string, base?: Partial<Relation>): Relation {
    const relation = this.createBinaryRelation(source, target, name, RelationStereotype.COMPONENT_OF, base);
    const sourceEnd = relation.getSourceEnd();
    const targetEnd = relation.getTargetEnd();

    sourceEnd.cardinality.setOneToMany();
    targetEnd.cardinality.setOneToOne();
    targetEnd.aggregationKind = AggregationKind.COMPOSITE;

    return relation;
  }

  createMemberOfRelation(source: Class, target: Class, name?: string, base?: Partial<Relation>): Relation {
    const relation = this.createBinaryRelation(source, target, name, RelationStereotype.MEMBER_OF, base);
    const sourceEnd = relation.getSourceEnd();
    const targetEnd = relation.getTargetEnd();

    sourceEnd.cardinality.setOneToMany();
    targetEnd.cardinality.setOneToMany();
    targetEnd.aggregationKind = AggregationKind.SHARED;

    return relation;
  }

  createSubCollectionOfRelation(source: Class, target: Class, name?: string, base?: Partial<Relation>): Relation {
    const relation = this.createBinaryRelation(source, target, name, RelationStereotype.SUBCOLLECTION_OF, base);
    const sourceEnd = relation.getSourceEnd();
    const targetEnd = relation.getTargetEnd();

    sourceEnd.cardinality.setCardinalityFromNumbers(1, 1);
    targetEnd.cardinality.setCardinalityFromNumbers(1, 1);
    targetEnd.aggregationKind = AggregationKind.COMPOSITE;

    return relation;
  }

  createSubQuantityOfRelation(source: Class, target: Class, name?: string, base?: Partial<Relation>): Relation {
    const relation = this.createBinaryRelation(source, target, name, RelationStereotype.SUBQUANTITY_OF, base);
    const sourceEnd = relation.getSourceEnd();
    const targetEnd = relation.getTargetEnd();

    sourceEnd.cardinality.setCardinalityFromNumbers(1, 1);
    targetEnd.cardinality.setCardinalityFromNumbers(1, 1);
    targetEnd.aggregationKind = AggregationKind.COMPOSITE;

    return relation;
  }

  createInstantiationRelation(source: Class, target: Class, name?: string, base?: Partial<Relation>): Relation {
    const relation = this.createBinaryRelation(source, target, name, RelationStereotype.INSTANTIATION, base);
    const sourceEnd = relation.getSourceEnd();
    const targetEnd = relation.getTargetEnd();

    sourceEnd.cardinality.setZeroToMany();
    targetEnd.cardinality.setOneToMany();

    return relation;
  }

  createTerminationRelation(source: Class, target: Class, name?: string, base?: Partial<Relation>): Relation {
    const relation = this.createBinaryRelation(source, target, name, RelationStereotype.TERMINATION, base);
    const sourceEnd = relation.getSourceEnd();
    const targetEnd = relation.getTargetEnd();

    sourceEnd.cardinality.setCardinalityFromNumbers(1, 1);
    sourceEnd.isReadOnly = true;
    targetEnd.cardinality.setCardinalityFromNumbers(1, 1);
    targetEnd.isReadOnly = true;

    return relation;
  }

  createParticipationalRelation(source: Class, target: Class, name?: string, base?: Partial<Relation>): Relation {
    const relation = this.createBinaryRelation(source, target, name, RelationStereotype.PARTICIPATIONAL, base);
    const sourceEnd = relation.getSourceEnd();
    const targetEnd = relation.getTargetEnd();

    sourceEnd.cardinality.setOneToMany();
    sourceEnd.isReadOnly = true;
    targetEnd.cardinality.setOneToOne();
    targetEnd.isReadOnly = true;
    targetEnd.aggregationKind = AggregationKind.COMPOSITE;

    return relation;
  }

  createParticipationRelation(source: Class, target: Class, name?: string, base?: Partial<Relation>): Relation {
    const relation = this.createBinaryRelation(source, target, name, RelationStereotype.PARTICIPATION, base);
    const sourceEnd = relation.getSourceEnd();
    const targetEnd = relation.getTargetEnd();

    sourceEnd.cardinality.setZeroToOne();
    sourceEnd.isReadOnly = true;

    if (source.hasHistoricalRoleStereotype() || source.hasHistoricalRoleMixinStereotype()) {
      targetEnd.cardinality.setOneToMany();
    } else {
      targetEnd.cardinality.setZeroToMany();
    }

    return relation;
  }

  createHistoricalDependenceRelation(source: Class, target: Class, name?: string, base?: Partial<Relation>): Relation {
    const relation = this.createBinaryRelation(source, target, name, RelationStereotype.HISTORICAL_DEPENDENCE, base);
    const sourceEnd = relation.getSourceEnd();
    const targetEnd = relation.getTargetEnd();

    sourceEnd.cardinality.setZeroToMany();
    sourceEnd.isReadOnly = true;
    targetEnd.cardinality.setOneToOne();

    return relation;
  }

  createCreationRelation(source: Class, target: Class, name?: string, base?: Partial<Relation>): Relation {
    const relation = this.createBinaryRelation(source, target, name, RelationStereotype.CREATION, base);
    const sourceEnd = relation.getSourceEnd();
    const targetEnd = relation.getTargetEnd();

    sourceEnd.cardinality.setOneToOne();
    sourceEnd.isReadOnly = true;
    targetEnd.cardinality.setOneToOne();
    targetEnd.isReadOnly = true;

    return relation;
  }

  createManifestationRelation(source: Class, target: Class, name?: string, base?: Partial<Relation>): Relation {
    const relation = this.createBinaryRelation(source, target, name, RelationStereotype.MANIFESTATION, base);
    const sourceEnd = relation.getSourceEnd();
    const targetEnd = relation.getTargetEnd();

    sourceEnd.cardinality.setOneToMany();
    sourceEnd.isReadOnly = true;
    targetEnd.cardinality.setZeroToMany();

    return relation;
  }

  createBringsAboutRelation(source: Class, target: Class, name?: string, base?: Partial<Relation>): Relation {
    const relation = this.createBinaryRelation(source, target, name, RelationStereotype.BRINGS_ABOUT, base);
    const sourceEnd = relation.getSourceEnd();
    const targetEnd = relation.getTargetEnd();

    sourceEnd.cardinality.setOneToOne();
    sourceEnd.isReadOnly = true;
    targetEnd.cardinality.setOneToOne();
    targetEnd.isReadOnly = true;

    return relation;
  }

  createTriggersRelation(source: Class, target: Class, name?: string, base?: Partial<Relation>): Relation {
    const relation = this.createBinaryRelation(source, target, name, RelationStereotype.TRIGGERS, base);
    const sourceEnd = relation.getSourceEnd();
    const targetEnd = relation.getTargetEnd();

    sourceEnd.cardinality.setOneToOne();
    sourceEnd.isReadOnly = true;
    targetEnd.cardinality.setOneToOne();

    return relation;
  }

  createPartWholeRelation(source: Class, target: Class, name?: string, base?: Partial<Relation>): Relation {
    const relation = this.createBinaryRelation(source, target, name, null, base);
    const sourceEnd = relation.getSourceEnd();
    const targetEnd = relation.getTargetEnd();

    sourceEnd.cardinality.setCardinalityFromNumbers(2);
    targetEnd.cardinality.setOneToOne();
    targetEnd.aggregationKind = AggregationKind.COMPOSITE;

    return relation;
  }

  createGeneralization(
    general: Classifier<any, any>,
    specific: Classifier<any, any>,
    name?: string,
    base?: Partial<Generalization>
  ): Generalization {
    let generalization = new Generalization(
      Object.assign({}, base, { name, general, specific, container: this, project: this.project })
    );
    return this.addContent(generalization);
  }

  createGeneralizationSet(
    generalizations: Generalization | Generalization[],
    isDisjoint: boolean = false,
    isComplete: boolean = false,
    categorizer?: Class,
    name?: string,
    base?: Partial<GeneralizationSet>
  ): GeneralizationSet {
    isDisjoint = isDisjoint || false; // avoids issues when receiving undefined or null
    isComplete = isComplete || false;
    categorizer = categorizer || null;

    let gs = new GeneralizationSet(
      Object.assign({}, base, {
        name,
        isDisjoint,
        isComplete,
        categorizer,
        generalizations: utils.arrayFrom(generalizations),
        container: this,
        project: this.project
      })
    );

    return this.addContent(gs);
  }

  createPartition(
    generalizations: Generalization | Generalization[],
    categorizer?: Class,
    name?: string,
    base?: Partial<GeneralizationSet>
  ): GeneralizationSet {
    categorizer = categorizer || null;

    return this.createGeneralizationSet(generalizations, true, true, categorizer, name, Object.assign({}, base));
  }

  createPartitionFromClasses(general: Class, specifics: Class[], name?: string): GeneralizationSet {
    const generalizations = specifics.map(s => s.addParent(general));
    return this.createGeneralizationSet(generalizations, true, true, null, name);
  }

  createGeneralizationSetFromClasses(
    general: Class,
    specifics: Class[],
    isDisjoint: boolean = false,
    isComplete: boolean = false,
    name?: string
  ): GeneralizationSet {
    const generalizations = specifics.map(s => s.addParent(general));
    return this.createGeneralizationSet(generalizations, isDisjoint, isComplete, null, name);
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
