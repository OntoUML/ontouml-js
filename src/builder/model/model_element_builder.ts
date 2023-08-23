import { ModelElement } from '../../model/model_element';
import { NamedElementBuilder } from '../named_element_builder';

export abstract class ModelElementBuilder<
  B extends ModelElementBuilder<B>
> extends NamedElementBuilder<B> {
  protected override element?: ModelElement;
  protected _container?: ModelElement;
  protected _customProperties: { [key: string]: any } = {};

  abstract container(container: ModelElement): B;

  override build(): ModelElement {
    super.build();

    this.assertElement();
    this.element!.container = this._container;
    this.element!.customProperties = this._customProperties;

    return this.element!;
  }

  customProperty(name: string, value: any): B {
    this._customProperties[name] = value;
    return this as unknown as B;
  }
}
