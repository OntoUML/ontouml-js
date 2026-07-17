import uniqid from 'uniqid';

export abstract class OntoumlElement {
  id: string = uniqid();
  created: Date = new Date();
  modified?: Date;

  getContents(): OntoumlElement[] {
    return [];
  }

  toJSON(): any {
    const object: any = {
      id: this.id,
      created: this.created?.toISOString() ?? null,
      modified: this.modified?.toISOString() ?? null
    };

    return object;
  }

  /** Resolve fields containing references (i.e., not contents) replacing the
   * object with the instance of `OntoumlElement` in `elementReferenceMap` with
   * the same `id`. This method is NOT recursive.
   *
   * @throws throws an error when no entry in the `elementReferenceMap` has a
   * matching `id`.
   *
   * @param elementReferenceMap id-based map of all instances of
   * `OntoumlElement` in the same context or project. */
  abstract resolveReferences(
    elementReferenceMap: Map<string, OntoumlElement>
  ): void;

  /** Support method the returns an instance of `OntoumlElement` from a element
   * map based on the reference's id throwing an broken reference exception in
   * case an element with matching id is not found in the map.
   *
   * @throws Error accusing broken reference if a element with matching id is
   * not found in the map */
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
