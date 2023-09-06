import { ModelElementBuilder, Package, PackageableElement } from '../..';

export class PackageBuilder extends ModelElementBuilder<PackageBuilder> {
  protected override element?: Package;
  protected override _container?: Package;
  private _contents: PackageableElement[] = [];
  private _isRoot: boolean = false;

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

  override container(container: Package): PackageBuilder {
    this._container = container;
    return this;
  }

  contents(...elements: PackageableElement[]): PackageBuilder {
    this._contents = [...this._contents, ...elements];
    return this;
  }

  root(): PackageBuilder {
    this._isRoot = true;
    return this;
  }
}
