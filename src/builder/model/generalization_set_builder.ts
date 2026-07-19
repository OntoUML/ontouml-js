import {
  Class,
  Generalization,
  GeneralizationSet,
  ModelElementBuilder,
  Package
} from '../..';

/**
 * A fluent builder for {@link GeneralizationSet} instances.
 *
 * This builder configures the generalizations grouped by the set, its
 * disjointness and completeness constraints, its categorizer, and the
 * {@link Package} that contains it.
 *
 * @example
 * ```typescript
 * const genSet = project
 *   .generalizationSetBuilder()
 *   .partition()
 *   .name('Person by age')
 *   .generalizations(genChild, genAdult)
 *   .build();
 * ```
 */
export class GeneralizationSetBuilder extends ModelElementBuilder<GeneralizationSetBuilder> {
  protected declare element?: GeneralizationSet;
  protected declare _container?: Package;
  private _isDisjoint: boolean = false;
  private _isComplete: boolean = false;
  private _categorizer?: Class;
  private _generalizations: Generalization[] = [];

  /**
   * Builds an instance of {@link GeneralizationSet} with the parameters
   * passed to the builder. When no methods are evoked, the created
   * generalization set has the following defaults:
   * - `id: "randomly-generated-id",`
   * - `created: new Date(),`
   * - `isDisjoint: false,`
   * - `isComplete: false,`
   */
  override build(): GeneralizationSet {
    this.assertNotBuilt();
    this.assertSameProject(
      this._container,
      this._categorizer,
      ...this._generalizations
    );

    this.element = new GeneralizationSet(this.project);

    this.element.isDisjoint = this._isDisjoint;
    this.element.isComplete = this._isComplete;
    this.element.categorizer = this._categorizer;
    this.element.generalizations = this._generalizations;

    this._generalizations.forEach(g => this.element?.addGeneralization(g));

    this._container?.addContent(this.element);

    super.build();
    return this.element!;
  }

  /**
   * Sets the {@link Package} that will contain the built generalization set.
   *
   * @returns this builder, for method chaining.
   */
  override container(container: Package): GeneralizationSetBuilder {
    this._container = container;
    return this;
  }

  /**
   * Sets the generalization set as a partition, i.e., as both disjoint and
   * complete.
   *
   * @returns this builder, for method chaining.
   */
  partition(): GeneralizationSetBuilder {
    this.disjoint();
    this.complete();
    return this;
  }

  /**
   * Sets the generalization set as disjoint, i.e., states that the specific
   * classifiers in the set share no instances.
   *
   * @returns this builder, for method chaining.
   */
  disjoint(): GeneralizationSetBuilder {
    this._isDisjoint = true;
    return this;
  }

  /**
   * Sets the generalization set as overlapping, i.e., states that the
   * specific classifiers in the set may share instances, reverting a
   * previous call to `disjoint()`.
   *
   * @returns this builder, for method chaining.
   */
  overlapping(): GeneralizationSetBuilder {
    this._isDisjoint = false;
    return this;
  }

  /**
   * Sets the generalization set as complete, i.e., states that every
   * instance of the general classifier is an instance of at least one of the
   * specific classifiers in the set.
   *
   * @returns this builder, for method chaining.
   */
  complete(): GeneralizationSetBuilder {
    this._isComplete = true;
    return this;
  }

  /**
   * Sets the generalization set as incomplete, i.e., states that some
   * instances of the general classifier may not be instances of any specific
   * classifier in the set, reverting a previous call to `complete()`.
   *
   * @returns this builder, for method chaining.
   */
  incomplete(): GeneralizationSetBuilder {
    this._isComplete = false;
    return this;
  }

  /**
   * Sets the {@link Class} that categorizes the generalization set, i.e., a
   * high-order class whose instances are the specific classifiers in the
   * set.
   *
   * @returns this builder, for method chaining.
   */
  categorizer(c: Class): GeneralizationSetBuilder {
    this._categorizer = c;
    return this;
  }

  /**
   * Sets the {@link Generalization} instances grouped by the generalization
   * set, replacing any previously set generalizations.
   *
   * @returns this builder, for method chaining.
   */
  generalizations(
    ...generalizations: Generalization[]
  ): GeneralizationSetBuilder {
    this._generalizations = [...generalizations];
    return this;
  }
}
