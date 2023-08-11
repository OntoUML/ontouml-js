import { ModelElement, View, Path, OntoumlType, ClassView } from '..';
import { Diamond } from '../shape/diamond';

export abstract class NaryRelationView<T extends ModelElement> extends View<T> {
  members: ClassView[];
  paths: Path[];
  diamond: Diamond;

  constructor(element: T, members: ClassView[]) {
    super(element);
    
    this.members = members;
    this.diamond = new Diamond();
    
    // members and paths are matched by position
    this.paths = this.members.map(view => new Path());
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
