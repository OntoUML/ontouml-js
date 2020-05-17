type PartialTemplate = {
  name: string;
  partial: string;
};

type Prefixes = { [key: string]: string };

type DocElement = {
  comment?: string;
  label?: string;
  name: string;
  prefixName: string;
  prefix: string;
  uri: string;
};

type DocRelation = DocElement & {
  domain: DocElement;
  range: DocElement;
};

type DocClass = DocElement & {
  disjointWith: DocElement[];
  isDomainOf: DocElement[];
  isRangeOf: DocElement[];
  supertypes: DocElement[];
  subtypes: DocElement[];
  stereotypes: DocElement[];
};
