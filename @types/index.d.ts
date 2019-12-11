interface IStructuralElement {
  '@type': string;
  uri: string;
  name?: string;
  tuple?: string[];
  stereotypes?: string[];
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

interface IStereotype {
  name: string;
  uri: string;
  specializes: string[];
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
