import { Class } from '../../model/class';
import { Literal } from '../../model/literal';
import { ModelElement } from '../../model/model_element';
import { ModelElementBuilder } from './model_element_builder';

export class LiteralBuilder extends ModelElementBuilder<LiteralBuilder> {
  protected override element?: Literal;
  protected override readonly _container: Class;

  constructor(c: Class) {
    super(c.project!);
    this._container = c;
  }

  /**
   * Builds an instance of {@link Literal} with the parameters passed to the builder. **WARNING:** the ordering in which methods are evoked may affect the resulting object. When no methods are evoked, the created class has the following defaults:
   * - `id: "randomly-generated-id",`
   */
  override build(): Literal {
    this.element = new Literal(this._container);
    return super.build() as Literal;
  }

  override container(_: ModelElement): LiteralBuilder {
    throw new Error('Container already set on constructor.');
  }
}
