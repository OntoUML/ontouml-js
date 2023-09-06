import {
  Class,
  Generalization,
  GeneralizationSet,
  ModelElementBuilder,
  Package
} from '../..';

export class GeneralizationSetBuilder extends ModelElementBuilder<GeneralizationSetBuilder> {
  protected override element?: GeneralizationSet;
  protected override _container?: Package;
  private _isDisjoint: boolean = false;
  private _isComplete: boolean = false;
  private _categorizer?: Class;
  private _generalizations: Generalization[] = [];

  override build(): GeneralizationSet {
    this.element = new GeneralizationSet(this.project);

    this.element.isDisjoint = this._isDisjoint;
    this.element.isComplete = this._isComplete;
    this.element.categorizer = this._categorizer;
    this.element.generalizations = this._generalizations;

    this._container?.addContent(this.element);

    super.build();
    return this.element!;
  }

  override container(container: Package): GeneralizationSetBuilder {
    this._container = container;
    return this;
  }

  disjoint(): GeneralizationSetBuilder {
    this._isDisjoint = true;
    return this;
  }

  overlapping(): GeneralizationSetBuilder {
    this._isDisjoint = false;
    return this;
  }

  complete(): GeneralizationSetBuilder {
    this._isComplete = true;
    return this;
  }

  incomplete(): GeneralizationSetBuilder {
    this._isComplete = false;
    return this;
  }

  categorizer(c: Class): GeneralizationSetBuilder {
    this._categorizer = c;
    return this;
  }

  generalizations(
    ...generalizations: Generalization[]
  ): GeneralizationSetBuilder {
    this._generalizations = [...generalizations];
    return this;
  }
}
