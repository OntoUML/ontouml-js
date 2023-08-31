import {
  Classifier,
  Generalization,
  ModelElement,
  Package,
  Project,
  utils,
  ModelElementBuilder
} from '../..';

export class GeneralizationBuilder extends ModelElementBuilder<GeneralizationBuilder> {
  protected override element?: Generalization;
  protected override _container?: Package;
  private _general?: Classifier<any, any>;
  private _specific?: Classifier<any, any>;

  /**
   * Builds an instance of {@link Generalization} with the parameters passed to the builder. **WARNING:** the ordering in which methods are evoked may affect the resulting object. When no methods are evoked, the created class has the following defaults:
   * - `id: "randomly-generated-id",`
   * - `created: new Date(),`
   * - `general: <classifier required before build>,`
   * - `specific: <classifier required before build>`
   */
  override build(): Generalization {
    this.assertGeneralSet();
    this.assertSpecificSet();
    utils.assertSameProject(this._general!, this._specific!);

    this.element = new Generalization(this.project, this._container);
    this.element.general = this._general;
    this.element.specific = this._specific;

    super.build();
    return this.element;
  }

  container(pkg?: Package): GeneralizationBuilder {
    this._container = pkg;
    return this;
  }

  general(classifier: Classifier<any, any>): GeneralizationBuilder {
    this._general = classifier;
    return this;
  }

  specific(classifier: Classifier<any, any>): GeneralizationBuilder {
    this._specific = classifier;
    return this;
  }

  assertGeneralSet(): void {
    if (!this._general) throw new Error('Missing general classifier.');
  }
  assertSpecificSet(): void {
    if (!this._specific) throw new Error('Missing specific classifier.');
  }
}
