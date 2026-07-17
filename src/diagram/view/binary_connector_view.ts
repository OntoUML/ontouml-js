import { ModelElement, View, Path, Shape } from '../..';

/**
 * The abstract base of views that depict a model element connecting exactly
 * two other views, such as {@link BinaryRelationView} and
 * {@link GeneralizationView}. A binary connector is rendered as a
 * {@link Path} (a polyline) between the {@link source} and {@link target}
 * views.
 */
export abstract class BinaryConnectorView<
  T extends ModelElement
> extends View<T> {
  /** The view at the source end of the connector. */
  source: View<any>;

  /** The view at the target end of the connector. */
  target: View<any>;

  /** The polyline that renders the connector on the diagram canvas. */
  path: Path;

  constructor(element: T, source: View<any>, target: View<any>) {
    super(element);

    this.path = new Path();
    this.source = source;
    this.target = target;
  }

  /** The shapes that render this view: its {@link path}. */
  override get shapes(): Shape[] {
    return [this.path];
  }

  override toJSON(): any {
    return {
      ...super.toJSON(),
      sourceView: this.source.id,
      targetView: this.target.id,
      path: this.path.id
    };
  }
}
