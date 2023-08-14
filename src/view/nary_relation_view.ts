import { View, Path, OntoumlType, ClassView, OntoumlElement, Relation } from '..';
import { Diamond } from '../shape/diamond';

export class NaryRelationView extends View<Relation> {
  private _members: ClassView[];
  private _paths: Path[];
  
  diamond: Diamond;

  constructor(element: Relation, members: ClassView[]) {
    super(element);
    
    this._members = members;
    this.diamond = new Diamond();
    
    // members and paths are matched by position
    this._paths = this.members.map(view => new Path());
  }

  public get members(): ClassView[] {
    return [...this._members];
  }

  public set members(value: ClassView[]) {
    this._members = value;
  }

  public get paths(): Path[] {
    return [...this._paths];
  }
  public set paths(value: Path[]) {
    this._paths = value;
  }

  override getContents(): OntoumlElement[] {
    return [...this.paths, this.diamond];
  }

  override toJSON(): any {
    const object : any = {
      type: OntoumlType.NARY_RELATION_VIEW,
      members: this.members.map(view => view.id),
      paths: this.paths.map(path => path.id),
      diamond: this.diamond.id
    };

    return {...object, ...super.toJSON()};
  }

}
