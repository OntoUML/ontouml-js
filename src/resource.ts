import _ from 'lodash';
import { MultilingualText } from './multilingual_text';

export class Resource {
  private name: MultilingualText = new MultilingualText();
  URI?: string;

  getName(language?: string): string | null {
    return this.name.get(language);
  }

  addName(value: string, language?: string): void {
    if (!this.name) this.name = new MultilingualText();
    this.name.add(value, language);
  }

  setName(value: string | MultilingualText, language?: string): void {
    if (value instanceof MultilingualText) {
      this.name = value;
    } else {
      this.name = new MultilingualText(value, language);
    }
  }

  toJSON(): any {
    const name = this.name.toJSON();
    const URI = !_.isEmpty(this.URI) ? this.URI : null;

    if (name || URI) return { name, URI };
    return null;
  }
}
