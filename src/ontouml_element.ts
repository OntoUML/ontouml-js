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

  /**
   * Resolves fields containing references (i.e., not contents), replacing
   * each placeholder object with the instance of {@link OntoumlElement} in
   * `elementReferenceMap` that has the same `id`. This method is NOT
   * recursive.
   *
   * @param elementReferenceMap - id-based map of all instances of
   *        {@link OntoumlElement} in the same context or project.
   * @throws an error when no entry in `elementReferenceMap` has a matching
   *         `id`.
   */
  abstract resolveReferences(
    elementReferenceMap: Map<string, OntoumlElement>
  ): void;

  /**
   * Returns the instance of {@link OntoumlElement} in `elementReferenceMap`
   * whose `id` matches that of `reference`. Support method for
   * {@link resolveReferences} implementations.
   *
   * @param reference - placeholder element carrying the id to resolve.
   * @param elementReferenceMap - id-based map of all instances of
   *        {@link OntoumlElement} in the same context or project.
   * @param container - element holding the reference; used to compose the
   *        error message.
   * @param field - name of the field holding the reference; used to compose
   *        the error message.
   * @throws an error accusing a broken reference if no element with a
   *         matching id is found in the map.
   */
  static resolveReference<T extends OntoumlElement>(
    reference: T,
    elementReferenceMap: Map<string, OntoumlElement>,
    container?: OntoumlElement,
    field?: string
  ): T {
    if (!reference) {
      return reference;
    }

    const elementId = reference?.id;
    const element = elementReferenceMap.get(elementId) as T;

    if (element) {
      return element;
    } else {
      const message =
        container && field
          ? `Could not resolve broken reference '${field}' in ${container.constructor.name} '${container.id}'.`
          : `Could not resolve broken reference.`;
      throw new Error(message);
    }
  }
}
