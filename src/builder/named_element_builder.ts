import { MultilingualText } from '../multilingual_text';
import { NamedElement } from '../named_element';
import { Resource } from '../resource';
import { OntoumlElementBuilder } from './ontouml_element_builder';

export abstract class NamedElementBuilder<
  B extends NamedElementBuilder<B>
> extends OntoumlElementBuilder<B> {
  protected declare element?: NamedElement;
  private _name: MultilingualText = new MultilingualText();
  private _description: MultilingualText = new MultilingualText();
  private _alternativeNames: MultilingualText[] = [];
  private _editorialNotes: MultilingualText[] = [];
  private _creators: Resource[] = [];
  private _contributors: Resource[] = [];

  override build(): NamedElement {
    super.build();

    this.assertElement();
    this.element!.name = this._name;
    this.element!.description = this._description;
    this.element!.alternativeNames = this._alternativeNames;
    this.element!.editorialNotes = this._editorialNotes;
    this.element!.creators = this._creators;
    this.element!.contributors = this._contributors;

    return this.element!;
  }

  name(value: string, language: string = MultilingualText.defaultLanguage): B {
    this._name.add(value, language);
    return this as unknown as B;
  }

  description(
    value: string,
    language: string = MultilingualText.defaultLanguage
  ): B {
    this._description.add(value, language);
    return this as unknown as B;
  }

  alternativeName(
    value: string,
    language: string = MultilingualText.defaultLanguage
  ): B {
    this._alternativeNames.push(new MultilingualText(value, language));
    return this as unknown as B;
  }

  editorialNote(
    value: string,
    language: string = MultilingualText.defaultLanguage
  ): B {
    this._editorialNotes.push(new MultilingualText(value, language));
    return this as unknown as B;
  }

  creator(uri?: string, name?: string, language?: string): B {
    this._creators.push(new Resource(uri, name, language));
    return this as unknown as B;
  }

  contributor(uri?: string, name?: string, language?: string): B {
    this._contributors.push(new Resource(uri, name, language));
    return this as unknown as B;
  }
}
