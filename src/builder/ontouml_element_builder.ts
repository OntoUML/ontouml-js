import uniqid from 'uniqid';
import _ from 'lodash';
import {
  Cardinality,
  MultilingualText,
  OntoumlElement,
  Project,
  ProjectElement,
  Resource
} from '..';

/**
 * A fluent builder for {@link OntoumlElement} instances.
 *
 * This abstract builder is the root of the builder hierarchy. It configures
 * the identifier of the element under construction and registers the built
 * element in its containing {@link Project}. Concrete builders, such as
 * {@link ClassBuilder} and {@link ProjectBuilder}, inherit its methods.
 *
 * Builders are single-use: `build()` may be called at most once per builder,
 * as building registers the created element in the project. To create
 * several similar elements, configure one builder and derive the others
 * from it via {@link clone}.
 *
 * @example
 * ```typescript
 * const person = project
 *   .classBuilder()
 *   .id('person-id')
 *   .kind()
 *   .name('Person')
 *   .build();
 * ```
 */
export abstract class OntoumlElementBuilder<
  B extends OntoumlElementBuilder<B>
> {
  protected element?: OntoumlElement;
  protected project: Project;
  private _id: string = uniqid();
  private _built: boolean = false;

  /**
   * Creates a builder whose built element will be contained in `project`.
   *
   * @param project - the project that will contain the built element. Only
   *        absent when the built element is a project itself.
   */
  constructor(project?: Project) {
    this.project = project!;
  }

  /**
   * Builds the {@link OntoumlElement} with the parameters passed to the
   * builder, assigning its identifier and adding it to the containing
   * {@link Project}. When `id(id)` is not evoked, the element receives a
   * randomly generated identifier. Concrete builders override this method to
   * instantiate and return elements of their specific types.
   *
   * @throws an error if the builder has already been used.
   */
  build(): OntoumlElement {
    this.assertNotBuilt();
    this._built = true;

    this.assertElement();

    this.element!.id = this._id;
    this.project?.add(this.element!);
    return this.element!;
  }

  /**
   * Creates a new builder of the same type carrying the same configuration
   * as this one, to be used as a template for building similar elements.
   *
   * The clone is independent of this builder: value fields (names,
   * descriptions, cardinalities, resources, custom properties) are copied,
   * while references to model elements (containers, connected classifiers,
   * etc.) are shared. The clone receives a fresh randomly generated
   * identifier — identifiers set via `id(id)` are not carried over — and can
   * be built even when this builder has already been used.
   *
   * @returns a new, buildable builder with the same configuration.
   */
  clone(): B {
    const copy = Object.create(Object.getPrototypeOf(this)) as any;

    for (const [key, value] of Object.entries(this)) {
      copy[key] = OntoumlElementBuilder.cloneFieldValue(value);
    }

    copy._id = uniqid();
    copy._built = false;
    copy.element = undefined;
    copy.project = this.project;

    return copy as B;
  }

  /**
   * Clones the value of a builder field: value objects and collections are
   * copied, while model elements, projects, and other references are shared.
   */
  private static cloneFieldValue(value: any): any {
    if (
      value instanceof MultilingualText ||
      value instanceof Cardinality ||
      value instanceof Resource
    ) {
      return _.cloneDeep(value);
    }

    if (Array.isArray(value)) {
      return value.map(v => OntoumlElementBuilder.cloneFieldValue(v));
    }

    if (value instanceof Set) {
      return new Set(
        [...value].map(v => OntoumlElementBuilder.cloneFieldValue(v))
      );
    }

    if (_.isPlainObject(value)) {
      return { ...value };
    }

    return value;
  }

  /**
   * Sets the identifier of the element, overriding the randomly generated
   * identifier assigned by default.
   *
   * @returns this builder, for method chaining.
   * @throws an error if the identifier is empty or blank.
   */
  id(id: string): B {
    if (!id || id.trim().length === 0) {
      throw new Error('The id cannot be empty or blank.');
    }

    this._id = id;
    return this as unknown as B;
  }

  /**
   * Asserts that the element under construction has been instantiated,
   * throwing an error otherwise.
   */
  assertElement(): void {
    if (!this.element) {
      throw new Error('The element is undefined or null.');
    }
  }

  /**
   * Asserts that this builder has not been used yet.
   *
   * @throws an error if `build()` has already been called on this builder.
   */
  protected assertNotBuilt(): void {
    if (this._built) {
      throw new Error(
        'This builder has already been used. Create a new builder for each element, or derive one from this builder via clone().'
      );
    }
  }

  /**
   * Asserts that the given elements belong to the same project as the
   * builder. Absent (undefined) elements are ignored.
   *
   * @throws an error if some element belongs to a different project.
   */
  protected assertSameProject(
    ...elements: (ProjectElement | undefined)[]
  ): void {
    for (const element of elements) {
      if (element && element.project !== this.project) {
        throw new Error(
          'All elements referenced by a builder must belong to the project that will contain the built element.'
        );
      }
    }
  }
}
