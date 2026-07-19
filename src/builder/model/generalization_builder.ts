import {
  Classifier,
  Generalization,
  Package,
  ModelElementBuilder
} from '../..';

/**
 * A fluent builder for {@link Generalization} instances.
 *
 * This builder configures the general and the specific {@link Classifier}
 * connected by the generalization, as well as the {@link Package} that
 * contains it. Both classifiers must belong to the same project and be set
 * before the generalization is built.
 *
 * @example
 * ```typescript
 * const gen = project
 *   .generalizationBuilder()
 *   .general(person)
 *   .specific(student)
 *   .build();
 * ```
 */
export class GeneralizationBuilder extends ModelElementBuilder<GeneralizationBuilder> {
  protected declare element?: Generalization;
  protected declare _container?: Package;
  private _general?: Classifier<any, any>;
  private _specific?: Classifier<any, any>;

  /**
   * Builds an instance of {@link Generalization} with the parameters passed
   * to the builder. Both the general and the specific classifiers are
   * required before `build()` is evoked. **WARNING:** the ordering in which
   * methods are evoked may affect the resulting object. When no other
   * methods are evoked, the created generalization has the following
   * defaults:
   * - `id: "randomly-generated-id",`
   * - `created: new Date()`
   */
  override build(): Generalization {
    this.assertNotBuilt();
    this.assertGeneralSet();
    this.assertSpecificSet();

    if (this._general === this._specific) {
      throw new Error('A classifier cannot specialize itself.');
    }

    this.assertSameProject(this._container, this._general, this._specific);

    this.element = new Generalization(
      this.project,
      this._general!,
      this._specific!
    );

    this._container?.addContent(this.element);

    super.build();
    return this.element;
  }

  /**
   * Sets the {@link Package} that will contain the built generalization.
   *
   * @returns this builder, for method chaining.
   */
  container(pkg?: Package): GeneralizationBuilder {
    this._container = pkg;
    return this;
  }

  /**
   * Sets the general {@link Classifier} of the generalization, i.e., the
   * classifier being specialized (the supertype).
   *
   * @returns this builder, for method chaining.
   */
  general(classifier: Classifier<any, any>): GeneralizationBuilder {
    this._general = classifier;
    return this;
  }

  /**
   * Sets the specific {@link Classifier} of the generalization, i.e., the
   * classifier that specializes the general one (the subtype).
   *
   * @returns this builder, for method chaining.
   */
  specific(classifier: Classifier<any, any>): GeneralizationBuilder {
    this._specific = classifier;
    return this;
  }

  /**
   * Asserts that the general classifier of the generalization has been set,
   * throwing an error otherwise.
   */
  assertGeneralSet(): void {
    if (!this._general) throw new Error('Missing general classifier.');
  }

  /**
   * Asserts that the specific classifier of the generalization has been set,
   * throwing an error otherwise.
   */
  assertSpecificSet(): void {
    if (!this._specific) throw new Error('Missing specific classifier.');
  }
}
