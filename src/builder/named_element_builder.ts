import { MultilingualText } from '../multilingual_text';
import { NamedElement } from '../named_element';
import { Project } from '../project';
import { OntoumlElementBuilder } from './ontouml_element_builder';

export abstract class NamedElementBuilder<
  B extends NamedElementBuilder<B>
> extends OntoumlElementBuilder<B> {
  protected override element?: NamedElement;
  private _name: MultilingualText = new MultilingualText();
  private _description: MultilingualText = new MultilingualText();

  override build(): NamedElement {
    super.build();

    this.assertElement();
    this.element!.name = this._name;
    this.element!.description = this._description;

    return this.element!;
  }

  name(value: string, language: string = MultilingualText.defaultLanguage): B {
    this._name.addText(value, language);
    return this as unknown as B;
  }

  description(
    value: string,
    language: string = MultilingualText.defaultLanguage
  ): B {
    this._description.addText(value, language);
    return this as unknown as B;
  }
}
