import { Decoratable, Stereotype, ModelElementBuilder } from '../..';

/**
 * A fluent builder for {@link Decoratable} instances.
 *
 * This abstract builder configures the fields shared by all elements that can
 * be decorated with OntoUML stereotypes, namely the stereotype itself and
 * whether the element is derived. Concrete builders, such as
 * {@link ClassBuilder} and {@link BinaryRelationBuilder}, inherit its
 * methods and typically offer stereotype-specific shortcuts.
 *
 * @example
 * ```typescript
 * const heavierThan = project
 *   .binaryRelationBuilder()
 *   .stereotype('comparative')
 *   .derived()
 *   .source(person)
 *   .target(person)
 *   .build();
 * ```
 */
export abstract class DecoratableBuilder<
  B extends DecoratableBuilder<B, S>,
  S extends Stereotype
> extends ModelElementBuilder<B> {
  protected declare element?: Decoratable<any>;
  protected _stereotype?: S;
  protected _isDerived: boolean = false;

  /**
   * Builds the {@link Decoratable} with the parameters passed to the builder,
   * assigning the configured stereotype and derivation status to the element
   * under construction. Concrete builders override this method to instantiate
   * and return elements of their specific types.
   */
  override build(): Decoratable<any> {
    super.build();

    this.assertElement();
    this.element!.stereotype = this._stereotype;
    this.element!.isDerived = this._isDerived;

    return this.element!;
  }

  /**
   * Sets the element as derived, i.e., as an element whose instances (or
   * links) can be inferred from other elements in the model.
   *
   * @returns this builder, for method chaining.
   */
  derived(): B {
    this._isDerived = true;
    return this as unknown as B;
  }

  /**
   * Sets the element as non-derived, reverting a previous call to
   * `derived()`.
   *
   * @returns this builder, for method chaining.
   */
  nonDerived(): B {
    this._isDerived = false;
    return this as unknown as B;
  }

  /**
   * Sets the stereotype that decorates the element. Concrete builders
   * override this method to apply default values when the stereotype is a
   * known OntoUML stereotype.
   *
   * @param stereotype - the stereotype to decorate the element with.
   * @returns this builder, for method chaining.
   */
  stereotype(stereotype: string | S): B {
    this._stereotype = stereotype as any;
    return this as unknown as B;
  }
}
