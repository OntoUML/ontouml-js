import {
  GeneralizationSet,
  GeneralizationView,
  OntoumlType,
  View,
  Text,
  Shape
} from '../..';

/**
 * The view of a {@link GeneralizationSet} in a {@link Diagram}, rendered as
 * a {@link Text} label (100 × 50 by default) associated with the views of
 * the generalizations it groups.
 */
export class GeneralizationSetView extends View<GeneralizationSet> {
  /** The text label that renders the generalization set on the canvas. */
  text: Text;

  /** The views of the generalizations grouped by the set in this diagram. */
  generalizations: GeneralizationView[] = [];

  constructor(genSet: GeneralizationSet) {
    super(genSet);

    this.text = new Text();
    this.text.width = 100;
    this.text.height = 50;
  }

  /** The shapes that render this view: its {@link text} label. */
  override get shapes(): Shape[] {
    return [this.text];
  }

  override toJSON(): any {
    return {
      type: OntoumlType.GENERALIZATION_SET_VIEW,
      ...super.toJSON(),
      generalizations: this.generalizations.map(view => view.id),
      text: this.text.id
    };
  }
}
