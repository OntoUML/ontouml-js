import { ModelElementBuilder, Package, PackageableElement } from '../..';

/**
 * A fluent builder for {@link Package} instances.
 *
 * This builder configures the contents of the package, whether it is the
 * root package of its project, and the parent {@link Package} that contains
 * it.
 *
 * @example
 * ```typescript
 * const pkg = project
 *   .packageBuilder()
 *   .name('Core')
 *   .root()
 *   .build();
 * ```
 */
export class PackageBuilder extends ModelElementBuilder<PackageBuilder> {
  protected declare element?: Package;
  protected declare _container?: Package;
  private _contents: PackageableElement[] = [];
  private _isRoot: boolean = false;

  /**
   * Builds an instance of {@link Package} with the parameters passed to the
   * builder. When no methods are evoked, the created package has the
   * following defaults:
   * - `id: "randomly-generated-id",`
   * - `created: new Date(),`
   * - `contents: []`
   */
  override build(): Package {
    this.element = new Package(this.project);
    this.element.contents = this._contents;

    if (this._isRoot) {
      this.project.root = this.element;
    }

    this._container?.addContent(this.element);
    super.build();
    return this.element!;
  }

  /**
   * Sets the parent {@link Package} that will contain the built package.
   *
   * @returns this builder, for method chaining.
   */
  override container(container: Package): PackageBuilder {
    this._container = container;
    return this;
  }

  /**
   * Adds the given {@link PackageableElement} instances to the contents of
   * the package, preserving previously added contents.
   *
   * @returns this builder, for method chaining.
   */
  contents(...elements: PackageableElement[]): PackageBuilder {
    this._contents = [...this._contents, ...elements];
    return this;
  }

  /**
   * Sets the package as the root package of its project, i.e., the package
   * that contains the entire model.
   *
   * @returns this builder, for method chaining.
   */
  root(): PackageBuilder {
    this._isRoot = true;
    return this;
  }
}
