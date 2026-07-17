import { ModelElement, NamedElementBuilder } from '../..';

/**
 * A fluent builder for {@link ModelElement} instances.
 *
 * This abstract builder configures the fields shared by all model elements,
 * namely the container in which the built element is placed and its custom
 * properties (tagged values).
 *
 * @example
 * ```typescript
 * const person = project
 *   .classBuilder()
 *   .kind()
 *   .name('Person')
 *   .container(pkg)
 *   .customProperty('uri', 'https://example.com/person')
 *   .build();
 * ```
 */
export abstract class ModelElementBuilder<
  B extends ModelElementBuilder<B>
> extends NamedElementBuilder<B> {
  protected declare element?: ModelElement;
  protected _container?: ModelElement;
  protected _customProperties: { [key: string]: any } = {};

  /**
   * Sets the {@link ModelElement} that will contain the built element.
   *
   * @param container - the model element that will contain the built element.
   * @returns this builder, for method chaining.
   */
  abstract container(container?: ModelElement): B;

  /**
   * Builds the {@link ModelElement} with the parameters passed to the
   * builder, assigning the configured custom properties to the element under
   * construction. Concrete builders override this method to instantiate and
   * return elements of their specific types.
   */
  override build(): ModelElement {
    super.build();

    this.assertElement();
    this.element!.customProperties = this._customProperties;

    return this.element!;
  }

  /**
   * Sets a custom property (tagged value) on the element, overriding any
   * previous value assigned to the same property name.
   *
   * @param name - the name of the custom property.
   * @param value - the value of the custom property.
   * @returns this builder, for method chaining.
   */
  customProperty(name: string, value: any): B {
    this._customProperties[name] = value;
    return this as unknown as B;
  }
}
