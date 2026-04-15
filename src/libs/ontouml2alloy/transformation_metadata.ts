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
}

export interface TransformationMetadata {
  classes: TransformationClassInfo[];
  relations: TransformationRelationInfo[];
}
