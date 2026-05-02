export interface TransformationClassInfo {
  id: string;
  name: string | null;
  alloyName: string;
  stereotype: string | null;
  natures: string[];
}

export interface TransformationRelationInfo {
  id: string;
  name: string | null;
  alloyName: string;
  stereotype: string | null;
  source: { className: string | null; alloyName: string };
  target: { className: string | null; alloyName: string };
  // the targetAccessor function returns the targets of a source instance
  targetAccessor: string | null;
  // the sourceAccessor function returns the sources of a target instance.
  sourceAccessor: string | null;
}

export interface TransformationGeneralizationInfo {
  specific: string; // child
  general: string; // parent
}

export interface TransformationMetadata {
  classes: TransformationClassInfo[];
  relations: TransformationRelationInfo[];
  generalizations: TransformationGeneralizationInfo[];
}
