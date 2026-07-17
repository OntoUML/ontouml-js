import uniqid from 'uniqid';
import { OntoumlElement, Project } from '..';

/**
 * A fluent builder for {@link OntoumlElement} instances.
 *
 * This abstract builder is the root of the builder hierarchy. It configures
 * the identifier of the element under construction and registers the built
 * element in its containing {@link Project}. Concrete builders, such as
 * {@link ClassBuilder} and {@link ProjectBuilder}, inherit its methods.
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
   */
  build(): OntoumlElement {
    this.assertElement();

    this.element!.id = this._id;
    this.project?.add(this.element!);
    return this.element!;
  }

  // TODO: confirm whether this is adequate
  /**
   * Sets the identifier of the element, overriding the randomly generated
   * identifier assigned by default.
   *
   * @returns this builder, for method chaining.
   */
  id(id: string): B {
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
}
