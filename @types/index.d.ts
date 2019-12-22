interface IProperty {
  '@type': string;
  uri: string;
  url?: string;
  propertyType?: string;
  lowerbound?: number | string;
  upperbound?: number | string;
}

interface IStructuralElement {
  '@type': string;
  uri: string;
  name?: string;
  tuple?: string[];
  stereotypes?: string[];
  properties?: IProperty[];
  structuralElements?: IStructuralElement[];
}

interface IModel {
  '@type': string;
  uri: string;
  url?: string;
  name?: string;
  authors?: string[];
  structuralElements?: IStructuralElement[];
}

interface IRelation {
  name: string;
  uri: string;
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
  uri: string;
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
