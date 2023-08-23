import { MultilingualText } from "../multilingual_text";
import { Project } from "../project";
import { OntoumlElementBuilder } from "./ontouml_element_builder";

export abstract class NamedElementBuilder<
  B extends NamedElementBuilder<B>,
> extends OntoumlElementBuilder<B> {
  protected _name: MultilingualText = new MultilingualText();
  protected _description: MultilingualText = new MultilingualText();

  name(value: string, language: string = MultilingualText.defaultLanguage): B {
    this._name.addText(value, language);
    return this as unknown as B;
  }

  description(
    value: string,
    language: string = MultilingualText.defaultLanguage,
  ): B {
    this._description.addText(value, language);
    return this as unknown as B;
  }
}
