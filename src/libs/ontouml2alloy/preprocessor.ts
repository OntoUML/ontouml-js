import { OntoumlElement, Package, Decoratable, ClassStereotype } from '@libs/ontouml';
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
          description: `Class '${_class.getName() || _class.id}' has unknown or unsupported stereotype '${String(_class.stereotype)}'.`,
          data: _class
        });
      }
    }

    return errors;
  }

  hasUnsupportedStereotype(decoratable: Decoratable<any>) {
    return decoratable == null || decoratable.hasAnyStereotype(['event', 'situation', 'type']);
  }

  removeUnsupportedElements() {
    for (const _class of this.model.getAllClasses()) {
      if (this.hasUnsupportedStereotype(_class)) {
        for (const property of _class.properties) {
          property.removeSelfFromContainer();
          const attributeName = property.getName() || 'with no name';
          this.generateRemovalIssue(
            property,
            `Attribute '${attributeName}' of the class '${_class.getName() || _class.id}' was removed due to the class having an unsupported stereotype.`
          );
        }

        _class.removeSelfFromContainer();
        this.generateRemovalIssue(_class, `Class '${_class.getName() || _class.id}' was removed due to having an unsupported stereotype.`);
      }
    }

    // Remove attributes with undefined propertyType
    for (const property of this.model.getAllAttributes()) {
      if (!property.propertyType || this.hasUnsupportedStereotype(property.propertyType)) {
        property.removeSelfFromContainer();
        this.generateRemovalIssue(
          property,
          `Attribute '${property.getName() || property.id}' was removed due to undefined/unsupported propertyType.`
        );
      }
    }

    // Remove non-binary (ternary/n-ary) relations, which are not supported by the transformation
    for (const relation of this.model.getAllRelations()) {
      if (!relation.isBinary()) {
        let description = `Non-binary relation removed. Only binary relations are supported.`;
        try {
          const relationName = relation.getName() || relation.id;
          const endCount = relation.properties?.length ?? 0;
          const memberNames = relation
            .getMembers()
            .map(m => m.getName() || m.id)
            .join(', ');
          description = `Relation '${relationName}' was removed because it is a non-binary relation with ${endCount} ends (members: ${memberNames}). Only binary relations are supported.`;
        } catch (_) {
          /* use fallback description */
        }
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
          `Relation '${relation.getName() || relation.id}' was removed due to being connected to an unsupported class '${source.getName() || source.id}'.`
        );
      } else if (target && this.hasUnsupportedStereotype(target)) {
        relation.removeSelfFromContainer();
        this.generateRemovalIssue(
          relation,
          `Relation '${relation.getName() || relation.id}' was removed due to being connected to an unsupported class '${target.getName() || target.id}'.`
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

    // Remove generalizations with missing elements
    for (const generalization of this.model.getAllGeneralizations()) {
      const source = generalization.specific;
      const target = generalization.general;

      if (!source || !target) {
        generalization.removeSelfFromContainer();
        const genName = generalization.getName() || `${source?.getName() || source?.id || '?'} -> ${target?.getName() || target?.id || '?'}`;
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

    // Remove "dead" generalizations whose specific or general was removed in earlier passes
    const liveElements = new Set([...this.model.getAllClasses().map(c => c.id), ...this.model.getAllRelations().map(r => r.id)]);
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
