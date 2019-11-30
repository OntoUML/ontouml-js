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
