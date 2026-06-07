import { OntoumlElement, Package, Decoratable, ClassStereotype, Classifier, Class, natureUtils } from '@libs/ontouml';
import { ServiceIssue } from '..';
import { createIssue, IssueType } from './issue';

export class Ontouml2AlloyPreprocessor {
  private model: Package;
  issues: ServiceIssue[];

  constructor(model: Package) {
    this.issues = [];
    this.model = model;
  }

  run(): { ok: boolean; issues: ServiceIssue[] } {
    const errors = this.validate();
    if (errors.length > 0) {
      this.issues.push(...errors);
      return { ok: false, issues: this.issues };
    }

    this.remapStereotypes();

    this.removeUnsupportedElements();

    return { ok: true, issues: this.issues };
  }

  validate(): ServiceIssue[] {
    const errors: ServiceIssue[] = [];
    const validStereotypes = new Set(Object.values(ClassStereotype));

    for (const _class of this.model.getAllClasses()) {
      if (!validStereotypes.has(_class.stereotype)) {
        errors.push(
          createIssue(
            _class,
            IssueType.UNKNOWN_CLASS_STEREOTYPE,
            `Class '${_class.getName() || _class.id}' has unknown or unsupported stereotype «${_class.stereotype}».`
          )
        );
      }
    }

    return errors;
  }

  hasUnsupportedStereotype(decoratable: Decoratable<any>) {
    return decoratable == null || decoratable.hasAnyStereotype(['event', 'situation', 'type']);
  }

  remapStereotypes() {
    this.remapAbstractToDatatype();
  }

  private remapAbstractToDatatype(){
    for (const _class of this.model.getAllClasses()) {
        if (_class.hasAbstractStereotype()) {
          _class.stereotype = ClassStereotype.DATATYPE;
        }
      }
  }

  removeUnsupportedElements() {
    this.removeClassesWithUnsupportedStereotypes();
    this.removeClassesNotRestrictedToEndurant();
    this.removeEnumerationsWithoutLiterals();
    this.removeAttributesWithInvalidType();
    this.removeUnsupportedRelations();
    this.removeUnsupportedGeneralizations();
    this.removeInvalidGeneralizationSets();
    this.removeOrphanedElements();
  }

  private removeClassesWithUnsupportedStereotypes() {
    for (const _class of this.model.getAllClasses()) {
      if (this.hasUnsupportedStereotype(_class)) {
        for (const property of _class.properties) {
          this.removeProperty(property);
          const attributeName = property.getName() || 'with no name';
          this.generateIssue(
            property,
            IssueType.UNSUPPORTED_ELEMENT_REMOVED,
            `Attribute '${attributeName}' of the class '${
              _class.getName() || _class.id
            }' was removed due to the class having an unsupported stereotype «${_class.stereotype}».`
          );
        }

        _class.removeSelfFromContainer();
        this.generateIssue(
          _class,
          IssueType.UNSUPPORTED_ELEMENT_REMOVED,
          `Class '${_class.getName() || _class.id}' was removed due to having an unsupported stereotype «${_class.stereotype}».`
        );
      }
    }
  }

  private removeClassesNotRestrictedToEndurant() {
    for (const _class of this.model.getAllClasses()) {
      if (_class.hasDatatypeStereotype() || _class.hasEnumerationStereotype()) continue;

      if (!_class.isRestrictedToEndurant()) {
        for (const property of _class.properties) {
          this.removeProperty(property);
          this.generateIssue(
            property,
            IssueType.UNSUPPORTED_ELEMENT_REMOVED,
            `Attribute '${property.getName() || 'with no name'}' of class '${
              _class.getName() || _class.id
            }' was removed because the class has no endurant natures.`
          );
        }

        const natures = _class.restrictedTo?.join(', ') ?? 'none';
        _class.removeSelfFromContainer();
        this.generateIssue(
          _class,
          IssueType.UNSUPPORTED_ELEMENT_REMOVED,
          `Class '${
            _class.getName() || _class.id
          }' was removed because its restrictedTo [${natures}] contains no endurant natures.`
        );
      }
    }
  }

  private removeAttributesWithInvalidType() {
    const liveClassIds = new Set(this.model.getAllClasses().map(_class => _class.id));

    for (const property of this.model.getAllAttributes()) {
      // Remove attributes with non enum/datatype propertyType. Not supported (yet).
      const ownerIsDatatype = property.container instanceof Class && property.container.hasDatatypeStereotype();
      const hasUnsupportedPropertyType =
      ownerIsDatatype &&
      !!property.propertyType &&
      (!(property.propertyType instanceof Class) ||
      (!property.propertyType.hasDatatypeStereotype() && !property.propertyType.hasEnumerationStereotype()));

      if (hasUnsupportedPropertyType) {
        this.removeProperty(property);
        this.generateIssue(
          property,
          IssueType.UNSUPPORTED_ELEMENT_REMOVED,
          `Attribute '${property.getName() || property.id}' was removed because attributes can only be typed by datatypes/enumerations.`
        );
        continue;
      }

      // Remove attributes pointing to types that were removed
      const typeWasRemoved = !!property.propertyType?.id && !liveClassIds.has(property.propertyType.id);
      if (!property.propertyType || this.hasUnsupportedStereotype(property.propertyType) || typeWasRemoved) {
        this.removeProperty(property);
        this.generateIssue(
          property,
          IssueType.UNSUPPORTED_ELEMENT_REMOVED,
          `Attribute '${property.getName() || property.id}' was removed due to undefined/unsupported/removed propertyType.`
        );
      }
    }
  }

  private removeEnumerationsWithoutLiterals() {
    for (const _class of this.model.getAllClasses()) {
      if (_class.hasEnumerationStereotype() && (!_class.literals || _class.literals.length === 0)) {
        _class.removeSelfFromContainer();
        this.generateIssue(
          _class,
          IssueType.UNSUPPORTED_ELEMENT_REMOVED,
          `Enumeration '${
            _class.getName() || _class.id
          }' was removed because it has no literals and cannot be transformed to Alloy enum.`
        );
      }
    }
  }

  private removeUnsupportedRelations() {
    // Remove non-binary relations
    for (const relation of this.model.getAllRelations()) {
      if (!relation.isBinary()) {
        const relationName = relation.getName() || relation.id;
        const endCount = relation.properties?.length ?? 0;
        const memberNames = relation
          .getMembers()
          .map(m => m.getName() || m.id)
          .join(', ');
        const description = `Relation '${relationName}' was removed because it is a non-binary relation with ${endCount} ends (members: ${memberNames}). Only binary relations are supported.`;
        relation.removeSelfFromContainer();
        this.generateIssue(relation, IssueType.UNSUPPORTED_ELEMENT_REMOVED, description);
      }
    }

    // Remove relations connected to unsupported classes
    for (const relation of this.model.getAllRelations()) {
      const source = relation.getSource();
      const target = relation.getTarget();

      if (source && this.hasUnsupportedStereotype(source)) {
        relation.removeSelfFromContainer();
        this.generateIssue(
          relation,
          IssueType.UNSUPPORTED_ELEMENT_REMOVED,
          `Relation '${relation.getName() || relation.id}' was removed due to being connected to an unsupported class '${
            source.getName() || source.id
          }'.`
        );
      } else if (target && this.hasUnsupportedStereotype(target)) {
        relation.removeSelfFromContainer();
        this.generateIssue(
          relation,
          IssueType.UNSUPPORTED_ELEMENT_REMOVED,
          `Relation '${relation.getName() || relation.id}' was removed due to being connected to an unsupported class '${
            target.getName() || target.id
          }'.`
        );
      }
    }

    // Remove derivation relations that are structurally invalid
    for (const relation of this.model.getAllRelations()) {
      if (relation.hasDerivationStereotype() && !relation.isDerivation()) {
        const relationName = relation.getName() || relation.id;
        relation.removeSelfFromContainer();
        this.generateIssue(
          relation,
          IssueType.UNSUPPORTED_ELEMENT_REMOVED,
          `Relation '${relationName}' was removed because it is stereotyped as derivation but structurally invalid.`
        );
      }
    }
  }

  private removeUnsupportedGeneralizations() {
    // Remove generalizations with missing elements
    for (const generalization of this.model.getAllGeneralizations()) {
      const source = generalization.specific;
      const target = generalization.general;

      if (!source || !target) {
        generalization.removeSelfFromContainer();
        const genName =
          generalization.getName() || `${source?.getName() || source?.id || '?'} -> ${target?.getName() || target?.id || '?'}`;
        this.generateIssue(
          generalization,
          IssueType.UNSUPPORTED_ELEMENT_REMOVED,
          `Generalization '${genName}' was removed due to having a missing element.`
        );
      }
    }

    // Remove generalizations consisting of unsupported elements
    for (const generalization of this.model.getAllGeneralizations()) {
      const source = generalization.specific;
      const target = generalization.general;

      if (this.hasUnsupportedStereotype(source) || this.hasUnsupportedStereotype(target)) {
        generalization.removeSelfFromContainer();
        const genName = generalization.getName() || `${source?.getName() ?? '?'} -> ${target?.getName() ?? '?'}`;
        this.generateIssue(
          generalization,
          IssueType.UNSUPPORTED_ELEMENT_REMOVED,
          `Generalization '${genName}' was removed due to having an unsupported element.`
        );
      }
    }
  }

  private removeInvalidGeneralizationSets() {
    // Remove generalization sets with missing generalizations array
    for (const generalizationSet of this.model.getAllGeneralizationSets()) {
      if (!generalizationSet.generalizations) {
        generalizationSet.removeSelfFromContainer();
        const genSetName = generalizationSet.getName() || generalizationSet.id;
        this.generateIssue(
          generalizationSet,
          IssueType.UNSUPPORTED_ELEMENT_REMOVED,
          `Generalization Set '${genSetName}' was removed due to missing generalizations.`
        );
      }
    }

    // Remove generalization sets containing unsupported elements
    for (const generalizationSet of this.model.getAllGeneralizationSets()) {
      if (
        generalizationSet.generalizations.some(
          gen =>
            (gen.specific && this.hasUnsupportedStereotype(gen.specific)) ||
            (gen.general && this.hasUnsupportedStereotype(gen.general))
        )
      ) {
        generalizationSet.removeSelfFromContainer();
        const genSetNames = generalizationSet.generalizations
          .map(gen => gen.getName() || `${gen.specific?.getName() ?? '?'} -> ${gen.general?.getName() ?? '?'}`)
          .join(', ');
        const genSetName = generalizationSet.getName() || `{${genSetNames}}`;

        const removalDescription = `Generalization Set '${genSetName}' was removed due to containing an unsupported element.`;

        this.generateIssue(generalizationSet, IssueType.UNSUPPORTED_ELEMENT_REMOVED, removalDescription);
      }
    }

    // Remove generalization sets that do not involve classes on both ends
    for (const generalizationSet of this.model.getAllGeneralizationSets()) {
      if (!generalizationSet.involvesClasses()) {
        const genSetName = generalizationSet.getName() || generalizationSet.id;
        generalizationSet.removeSelfFromContainer();
        this.generateIssue(
          generalizationSet,
          IssueType.UNSUPPORTED_ELEMENT_REMOVED,
          `Generalization Set '${genSetName}' was removed because not all of its members are class-to-class generalisations.`
        );
      }
    }

    // Remove generalization sets without a unique common parent class
    for (const generalizationSet of this.model.getAllGeneralizationSets()) {
      const generals = generalizationSet.generalizations.map(gen => gen.general);
      const hasUniqueParent = generals.length > 0 && generals.every(g => g === generals[0]);
      if (!hasUniqueParent) {
        const genSetName = generalizationSet.getName() || generalizationSet.id;
        generalizationSet.removeSelfFromContainer();
        this.generateIssue(
          generalizationSet,
          IssueType.UNSUPPORTED_ELEMENT_REMOVED,
          `Generalization Set '${genSetName}' was removed because it does not have a unique common parent class.`
        );
      }
    }
  }

  private removeOrphanedElements() {
    // Remove relations whose source or target class was removed in earlier passes
    // Derivation relations are skipped here because their source end points to a Relation, and they are already handled by the dedicated pass above.
    const liveClasses = new Set(this.model.getAllClasses().map(c => c.id));
    for (const relation of this.model.getAllRelations()) {
      if (relation.hasDerivationStereotype()) continue;

      const sourceId = relation.getSource()?.id;
      const targetId = relation.getTarget()?.id;
      if (!liveClasses.has(sourceId) || !liveClasses.has(targetId)) {
        relation.removeSelfFromContainer();
        this.generateIssue(
          relation,
          IssueType.UNSUPPORTED_ELEMENT_REMOVED,
          `Relation '${relation.getName() || relation.id}' was removed because its source or target class was removed.`
        );
      }
    }

    // Remove generalizations whose specific or general was removed in earlier passes
    const liveElements = new Set([...liveClasses, ...this.model.getAllRelations().map(r => r.id)]);
    for (const generalization of this.model.getAllGeneralizations()) {
      if (!liveElements.has(generalization.specific?.id) || !liveElements.has(generalization.general?.id)) {
        generalization.removeSelfFromContainer();
        const specName = generalization.specific?.getName() ?? '?';
        const genName = generalization.general?.getName() ?? '?';
        this.generateIssue(
          generalization,
          IssueType.UNSUPPORTED_ELEMENT_REMOVED,
          `Generalization '${specName} -> ${genName}' was removed because its specific or general element was removed.`
        );
      }
    }

    // Remove generalization sets whose members were removed in earlier passes.
    const liveGeneralizationIds = new Set(this.model.getAllGeneralizations().map(g => g.id));
    for (const generalizationSet of this.model.getAllGeneralizationSets()) {
      const hasRemovedMember = generalizationSet.generalizations.some(gen => !liveGeneralizationIds.has(gen.id));
      if (hasRemovedMember) {
        const genSetName = generalizationSet.getName() || generalizationSet.id;
        generalizationSet.removeSelfFromContainer();
        this.generateIssue(
          generalizationSet,
          IssueType.UNSUPPORTED_ELEMENT_REMOVED,
          `Generalization Set '${genSetName}' was removed because one or more of its members were removed.`
        );
      }
    }
  }

  // Removes a property from its owning Classifier's properties array
  // The base removeSelfFromContainer() only handles Package containers, but properties are owned by Classifiers
  private removeProperty(property: OntoumlElement) {
    const owner = property.container;
    if (owner instanceof Classifier) {
      owner.properties = owner.properties.filter(p => p !== property);
    }
  }

  private generateIssue(
    element: OntoumlElement,
    issueType: Pick<ServiceIssue, 'code' | 'severity' | 'title'>,
    description: string
  ) {
    this.issues.push(createIssue(element, issueType, description));
  }
}
