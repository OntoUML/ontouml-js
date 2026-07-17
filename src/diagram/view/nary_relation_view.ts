import {
  View,
  Path,
  OntoumlType,
  ClassView,
  Relation,
  Diamond,
  Shape
} from '../..';

/**
 * The view of an n-ary {@link Relation} in a {@link Diagram}, rendered as a
 * central {@link Diamond} connected to the view of each member class by a
 * {@link Path}. Members and paths are matched by position: `paths[i]`
 * renders the leg between the diamond and `members[i]`.
 */
export class NaryRelationView extends View<Relation> {
  private _members: ClassView[];
  private _paths: Path[];

  /** The diamond that renders the central hub of the relation. */
  diamond: Diamond;

  constructor(element: Relation, members: ClassView[]) {
    super(element);

    this._members = members;
    this.diamond = new Diamond();

    // members and paths are matched by position
    this._paths = this.members.map(view => new Path());
  }

  /** The views of the classes connected by the relation. */
  public get members(): ClassView[] {
    return [...this._members];
  }

  /** Replaces the views of the classes connected by the relation. */
  public set members(value: ClassView[]) {
    this._members = value;
  }

  /** The paths connecting the {@link diamond} to each member view. */
  public get paths(): Path[] {
    return [...this._paths];
  }

  /** Replaces the paths connecting the {@link diamond} to the member views. */
  public set paths(value: Path[]) {
    this._paths = value;
  }

  /** The shapes that render this view: its paths and central diamond. */
  override get shapes(): Shape[] {
    return [...this.paths, this.diamond];
  }

  override toJSON(): any {
    return {
      type: OntoumlType.NARY_RELATION_VIEW,
      ...super.toJSON(),
      members: this.members.map(view => view.id),
      paths: this.paths.map(path => path.id),
      diamond: this.diamond.id
    };
  }
}
