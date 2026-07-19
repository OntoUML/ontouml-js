import { Class, Literal, ModelElement, ModelElementBuilder } from '../..';

/**
 * A fluent builder for {@link Literal} instances.
 *
 * This builder configures a literal of an enumeration {@link Class}, which
 * is provided to the builder on construction and cannot be changed. Literal
 * builders are typically obtained through `Class.literalBuilder()`.
 *
 * @example
 * ```typescript
 * const red = color
 *   .literalBuilder()
 *   .name('Red')
 *   .build();
 * ```
 */
export class LiteralBuilder extends ModelElementBuilder<LiteralBuilder> {
  protected declare element?: Literal;
  protected override readonly _container: Class;

  /**
   * Creates a builder whose built literal will belong to the enumeration
   * class `c`.
   *
   * @param c - the enumeration class that will contain the built literal.
   */
  constructor(c: Class) {
    super(c.project!);
    this._container = c;
  }

  /**
   * Builds an instance of {@link Literal} with the parameters passed to the
   * builder. **WARNING:** the ordering in which methods are evoked may
   * affect the resulting object. When no methods are evoked, the created
   * literal has the following defaults:
   * - `id: "randomly-generated-id",`
   */
  override build(): Literal {
    this.assertNotBuilt();

    this.element = new Literal(this._container);
    super.build();
    return this.element;
  }

  /**
   * Throws an error when evoked. The container of a literal is the
   * enumeration class provided to the constructor and cannot be changed.
   *
   * @throws an error, as the container is already set on the constructor.
   */
  override container(_: ModelElement): LiteralBuilder {
    throw new Error('Container already set on constructor.');
  }
}
