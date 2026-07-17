import { MultilingualText } from '.';

/** A reference to a resource on the semantic web, identified by its URI and
 * described by its name, as defined by the OntoUML JSON Schema. Resources are
 * used in the metadata fields of projects and named elements, e.g., to
 * identify creators, publishers, licenses, and themes. */
export class Resource {
  uri?: string;
  name: MultilingualText;

  constructor(uri?: string, name?: string, language?: string) {
    this.uri = uri;
    this.name = new MultilingualText(name, language);
  }

  toJSON(): any {
    return {
      URI: this.uri ?? null,
      name: this.name.toJSON()
    };
  }
}
