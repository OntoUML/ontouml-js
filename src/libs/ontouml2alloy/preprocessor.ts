import { OntoumlElement, Package, Decoratable, ClassStereotype, Classifier, natureUtils } from '@libs/ontouml';
import { ServiceIssue, ServiceIssueSeverity } from '..';

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

    this.applyDefaults();

    this.removeUnsupportedElements();

    return { ok: true, issues: this.issues };
  }

  validate(): ServiceIssue[] {
    const errors: ServiceIssue[] = [];
    const validStereotypes = new Set(Object.values(ClassStereotype));

    for (const _class of this.model.getAllClasses()) {
      if (!validStereotypes.has(_class.stereotype)) {
        errors.push({
          id: _class.id,
          code: 'UNKNOWN_CLASS_STEREOTYPE',
          severity: ServiceIssueSeverity.ERROR,
          title: 'Unknown Class Stereotype',
          description: `Class '${_class.getName() || _class.id}' has unknown or unsupported stereotype «${_class.stereotype}».`,
          data: _class
        });
      }
    }

    return errors;
  }

  hasUnsupportedStereotype(decoratable: Decoratable<any>) {
    return decoratable == null || decoratable.hasAnyStereotype(['event', 'situation', 'type']);
  }

  // Normalizes (remapping and defaulting) model metadata before removal/transformation.
  applyDefaults() {
    for (const _class of this.model.getAllClasses()) {
      if (_class.hasAbstractStereotype()) {
        _class.stereotype = ClassStereotype.DATATYPE;
      }
    }

    for (const _class of this.model.getAllClasses()) {
      if (_class.hasDatatypeStereotype() || _class.hasEnumerationStereotype() || this.hasUnsupportedStereotype(_class)) {
        continue;
      }

      if (!_class.restrictedTo || _class.restrictedTo.length === 0) {
        _class.restrictedTo = [...natureUtils.EndurantNatures];
        this.issues.push({
          id: _class.id,
          code: 'MISSING_VALUE_DEFAULTED',
          severity: ServiceIssueSeverity.WARNING,
          title: 'Missing Value Defaulted',
          description: `Class '${
            _class.getName() || _class.id
          }' had no restrictedTo natures and was defaulted to all endurant natures.`,
          data: _class
        });
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
          this.generateRemovalIssue(
            property,
            `Attribute '${attributeName}' of the class '${
              _class.getName() || _class.id
            }' was removed due to the class having an unsupported stereotype «${_class.stereotype}».`
          );
        }

        _class.removeSelfFromContainer();
        this.generateRemovalIssue(
          _class,
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
          this.generateRemovalIssue(
            property,
            `Attribute '${property.getName() || 'with no name'}' of class '${
              _class.getName() || _class.id
            }' was removed because the class has no endurant natures.`
          );
        }

        const natures = _class.restrictedTo?.join(', ') ?? 'none';
        _class.removeSelfFromContainer();
        this.generateRemovalIssue(
          _class,
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
      const typeWasRemoved = !!property.propertyType?.id && !liveClassIds.has(property.propertyType.id);

      if (!property.propertyType || this.hasUnsupportedStereotype(property.propertyType) || typeWasRemoved) {
        this.removeProperty(property);
        this.generateRemovalIssue(
          property,
          `Attribute '${property.getName() || property.id}' was removed due to undefined/unsupported/removed propertyType.`
        );
      }
    }
  }

  private removeEnumerationsWithoutLiterals() {
    for (const _class of this.model.getAllClasses()) {
      if (_class.hasEnumerationStereotype() && (!_class.literals || _class.literals.length === 0)) {
        _class.removeSelfFromContainer();
        this.issues.push({
          id: _class.id,
          code: 'EMPTY_ENUM_REMOVED',
          severity: ServiceIssueSeverity.WARNING,
          title: 'Empty Enumeration Removed',
          description: `Enumeration '${
            _class.getName() || _class.id
          }' was removed because it has no literals and cannot be transformed to Alloy enum.`,
          data: _class
        });
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
        this.generateRemovalIssue(relation, description);
      }
    }

    // Remove relations connected to unsupported classes
    for (const relation of this.model.getAllRelations()) {
      const source = relation.getSource();
      const target = relation.getTarget();

      if (source && this.hasUnsupportedStereotype(source)) {
        relation.removeSelfFromContainer();
        this.generateRemovalIssue(
          relation,
          `Relation '${relation.getName() || relation.id}' was removed due to being connected to an unsupported class '${
            source.getName() || source.id
          }'.`
        );
      } else if (target && this.hasUnsupportedStereotype(target)) {
        relation.removeSelfFromContainer();
        this.generateRemovalIssue(
          relation,
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
        this.generateRemovalIssue(
          relation,
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
        this.generateRemovalIssue(generalization, `Generalization '${genName}' was removed due to having a missing element.`);
      }
    }

    // Remove generalizations consisting of unsupported elements
    for (const generalization of this.model.getAllGeneralizations()) {
      const source = generalization.specific;
      const target = generalization.general;

      if (this.hasUnsupportedStereotype(source) || this.hasUnsupportedStereotype(target)) {
        generalization.removeSelfFromContainer();
        const genName = generalization.getName() || `${source?.getName() ?? '?'} -> ${target?.getName() ?? '?'}`;
        this.generateRemovalIssue(
          generalization,
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
        this.generateRemovalIssue(
          generalizationSet,
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

        this.generateRemovalIssue(generalizationSet, removalDescription);
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
        this.generateRemovalIssue(
          relation,
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
        this.generateRemovalIssue(
          generalization,
          `Generalization '${specName} -> ${genName}' was removed because its specific or general element was removed.`
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

  private generateRemovalIssue(element: OntoumlElement, description: string) {
    const issue: ServiceIssue = {
      id: element.id,
      code: 'UNSUPPORTED_ELEMENT_REMOVED',
      severity: ServiceIssueSeverity.WARNING,
      title: 'Unsupported Element Removed',
      description: description,
      data: element
    };
    this.issues.push(issue);
  }
}
