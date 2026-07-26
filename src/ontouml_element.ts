import uniqid from 'uniqid';

/**
 * The root of the OntoUML metamodel hierarchy. Every element of an OntoUML
 * project — classes, relations, generalizations, diagrams, views, and the
 * project itself — is an `OntoumlElement`, uniquely identified by an
 * {@link id} and carrying creation and modification timestamps.
 *
 * Elements form a containment tree: an element may contain other elements
 * (see {@link getContents}), and may additionally hold non-containment
 * references to elements elsewhere in the project (e.g., the general and
 * specific classifiers of a generalization).
 */
export abstract class OntoumlElement {
  /** The unique identifier of this element; a random id by default. */
  id: string = uniqid();

  /** When this element was created; the instantiation time by default. */
  created: Date = new Date();

  /** When this element was last modified, if ever. */
  modified?: Date;

  /**
   * Returns the elements directly contained by this element. The base
   * implementation returns an empty array; subclasses that act as containers
   * override it.
   */
  getContents(): OntoumlElement[] {
    return [];
  }

  /**
   * Returns every element directly or indirectly contained by this element,
   * without duplicates.
   *
   * @throws an error if a circular containment is detected.
   */
  getAllContents(): OntoumlElement[] {
    const contents = new Set<OntoumlElement>();
    const path: OntoumlElement[] = [this];

    const collect = (element: OntoumlElement) => {
      for (const content of element.getContents()) {
        if (path.includes(content)) {
          throw new Error(
            `Circular containment detected involving element '${content.id}'.`
          );
        }

        if (contents.has(content)) {
          continue;
        }

        contents.add(content);
        path.push(content);
        collect(content);
        path.pop();
      }
    };

    collect(this);
    return [...contents];
  }

  /**
   * Returns a plain object representation of this element following the
   * OntoUML JSON Schema (https://w3id.org/ontouml/schema), suitable for
   * `JSON.stringify`. Referenced elements are serialized as their ids;
   * contained elements are serialized in full by their containers.
   */
  toJSON(): any {
    const object: any = {
      id: this.id,
      created: this.created?.toISOString() ?? null,
      modified: this.modified?.toISOString() ?? null
    };

    return object;
  }
}
