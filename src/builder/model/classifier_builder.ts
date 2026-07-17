import { Classifier, Package, Stereotype, DecoratableBuilder } from '../..';

/**
 * A fluent builder for {@link Classifier} instances.
 *
 * This abstract builder configures the fields shared by classes and
 * relations, namely whether the classifier is abstract and the
 * {@link Package} that contains it. Concrete builders, such as
 * {@link ClassBuilder} and {@link NaryRelationBuilder}, inherit its methods.
 *
 * @example
 * ```typescript
 * const agent = project
 *   .classBuilder()
 *   .category()
 *   .name('Agent')
 *   .abstract()
 *   .container(corePackage)
 *   .build();
 * ```
 */
export abstract class ClassifierBuilder<
  B extends ClassifierBuilder<B, S>,
  S extends Stereotype
> extends DecoratableBuilder<B, S> {
  protected declare element?: Classifier<any, any>;
  declare _container?: Package;
  protected _isAbstract: boolean = false;

  /**
   * Builds the {@link Classifier} with the parameters passed to the builder,
   * assigning the configured abstractness to the element under construction
   * and adding it to its container. Concrete builders override this method to
   * instantiate and return elements of their specific types.
   */
  override build(): Classifier<any, any> {
    this.assertElement();

    this.element!.isAbstract = this._isAbstract;
    this._container?.addContent(this.element!);

    super.build();
    return this.element!;
  }

  /**
   * Sets the classifier as abstract, i.e., as a classifier that cannot have
   * direct instances.
   *
   * @returns this builder, for method chaining.
   */
  abstract(): B {
    this._isAbstract = true;
    return this as unknown as B;
  }

  /**
   * Sets the classifier as concrete, i.e., as a classifier that can have
   * direct instances, reverting a previous call to `abstract()`.
   *
   * @returns this builder, for method chaining.
   */
  concrete(): B {
    this._isAbstract = false;
    return this as unknown as B;
  }

  /**
   * Sets the {@link Package} that will contain the built classifier.
   *
   * @returns this builder, for method chaining.
   */
  container(pkg: Package): B {
    this._container = pkg;
    return this as unknown as B;
  }
}
