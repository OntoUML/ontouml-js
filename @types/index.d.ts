interface IProperty {
  type: string;
  id: string;
  url?: string;
  propertyType?: string;
  cardinality?: string;
}

interface IElement {
  type: string;
  id: string;
  name?: string;
  general?: {
    type: string;
    id: string;
  };
  specific?: {
    type: string;
    id: string;
  };
  stereotypes?: string[];
  properties?: IProperty[];
  elements?: IElement[];
}

interface IModel {
  type: string;
  id: string;
  url?: string;
  name?: string;
  authors?: string[];
  elements?: IElement[];
}

interface IRelation {
  name: string;
  id: string;
  source?: {
    lowerbound: number | string;
    upperbound: number | string;
  };
  target?: {
    lowerbound: number | string;
    upperbound: number | string;
  };
}

interface IStereotype {
  name: string;
  id: string;
  specializes: string[];
  relations: {
    [key: string]: string[];
  };
  rigidity: string;
  sortality: string;
  ultimateSortal: boolean;
}

interface ISelfLink {
  self: string;
}

interface IRelatedLink {
  related: {
    hred: string;
    meta: object;
  };
}

interface IOntoUMLError {
  id?: string;
  code: string;
  title: string;
  detail: string;
  links: ISelfLink | IRelatedLink;
  meta?: object;
}
