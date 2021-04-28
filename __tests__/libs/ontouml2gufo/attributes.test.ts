import { Package, Property } from '@libs/ontouml';
import { generateGufo } from './helpers';

describe('An attribute', () => {
  describe('of a class with non-abstract instances (e.g. «kind» Person) with a PRIMITIVE TYPE (e.g. name: string, age: int, start: date)', () => {
    let result: string;

    beforeAll(() => {
      const model = new Package();
      const _class = model.createKind('Person');
      const datatype = model.createDatatype('string');
      _class.createAttribute(datatype, 'name');
      result = generateGufo(model);
    });

    it('should be transformed to an owl:DatatypeProperty specializing gufo:hasQualityValue ', () => {
      expect(result).toContain('<:name> <rdf:type> <owl:DatatypeProperty>');
      expect(result).toContain('<:name> <rdfs:subPropertyOf> <gufo:hasQualityValue>');
    });

    it('should be transformed to an owl:DatatypeProperty whose domain is the class that contains the attribute', () => {
      expect(result).toContain('<:name> <rdfs:domain> <:Person>');
    });

    it("should be transformed to an owl:DatatypeProperty whose range is the attribute's type equivalent xsd type", () => {
      expect(result).toContain('<:name> <rdfs:range> <xsd:string>');
    });

    it("should be transformed to an owl:DatatypeProperty whose label is the attribute's name", () => {
      expect(result).toContain('<:name> <rdfs:label> "name"');
    });
  });

  describe('of a class with non-abstract instances (e.g. «category» Location) with a COMPLEX TYPE (e.g. address: Address)', () => {
    let result: string;

    beforeAll(() => {
      const model = new Package();
      const location = model.createCategory('Location');
      const address = model.createDatatype('Address');
      const _string = model.createDatatype('string');

      address.createAttribute(_string, 'street');
      address.createAttribute(_string, 'city');
      location.createAttribute(address, 'address');

      result = generateGufo(model);
    });

    it('should be transformed to an owl:ObjectProperty specializing gufo:hasReifiedQualityValue ', () => {
      expect(result).toContain('<:address> <rdf:type> <owl:ObjectProperty>');
      expect(result).toContain('<:address> <rdfs:subPropertyOf> <gufo:hasReifiedQualityValue>');
    });

    it('should be transformed to an owl:ObjectProperty whose domain is the class that contains the attribute', () => {
      expect(result).toContain('<:address> <rdfs:domain> <:Location>');
    });

    it("should be transformed to an owl:ObjectProperty whose range is the attribute's type", () => {
      expect(result).toContain('<:address> <rdfs:range> <:Address>');
    });

    it("should be transformed to an owl:ObjectProperty whose label is the attribute's name", () => {
      expect(result).toContain('<:address> <rdfs:label> "address"');
    });
  });

  describe('of a class with non-abstract instances (e.g. «category» Object) with a ENUMERATION TYPE (e.g. color: Color<Red,Blue,Green>)', () => {
    let result: string;

    beforeAll(() => {
      const model = new Package();
      const object = model.createCategory('Object');
      const color = model.createEnumeration('Color');

      object.createAttribute(color, 'color');
      color.createLiteral('Red');
      color.createLiteral('Blue');
      color.createLiteral('Green');

      result = generateGufo(model);
    });

    it('should be transformed to an owl:ObjectProperty specializing gufo:hasReifiedQualityValue ', () => {
      expect(result).toContain('<:color> <rdf:type> <owl:ObjectProperty>');
      expect(result).toContain('<:color> <rdfs:subPropertyOf> <gufo:hasReifiedQualityValue>');
    });

    it('should be transformed to an owl:ObjectProperty whose domain is the class that contains the attribute', () => {
      expect(result).toContain('<:color> <rdfs:domain> <:Object>');
    });

    it("should be transformed to an owl:ObjectProperty whose range is the attribute's type", () => {
      expect(result).toContain('<:color> <rdfs:range> <:Color>');
    });

    it("should be transformed to an owl:ObjectProperty whose label is the attribute's name", () => {
      expect(result).toContain('<:color> <rdfs:label> "color"');
    });
  });

  describe('of a complex datatype (e.g. «datatype» Address) with a PRIMITIVE TYPE (e.g. street: string)', () => {
    let result: string;

    beforeAll(() => {
      const model = new Package();
      const address = model.createDatatype('Address');
      const _string = model.createDatatype('string');

      address.createAttribute(_string, 'street');

      result = generateGufo(model);
    });

    it('should be transformed to an owl:DatatypeProperty specializing gufo:hasValueComponent ', () => {
      expect(result).toContain('<:street> <rdf:type> <owl:DatatypeProperty>');
      expect(result).toContain('<:street> <rdfs:subPropertyOf> <gufo:hasValueComponent>');
    });

    it('should be transformed to an owl:DatatypeProperty whose domain is the class that contains the attribute', () => {
      expect(result).toContain('<:street> <rdfs:domain> <:Address>');
    });

    it("should be transformed to an owl:DatatypeProperty whose range is the attribute's type equivalent xsd type", () => {
      expect(result).toContain('<:street> <rdfs:range> <xsd:string>');
    });

    it("should be transformed to an owl:DatatypeProperty whose label is the attribute's name", () => {
      expect(result).toContain('<:street> <rdfs:label> "street"');
    });
  });

  describe('of a complex datatype (e.g. «datatype» Address) WITHOUT A DEFINED TYPE (e.g. street)', () => {
    let result: string;

    beforeAll(() => {
      // const address = OntoumlFactory.createDatatype('Address');
      // OntoumlFactory.addAttribute(address, 'street');

      // const model = OntoumlFactory.createPackage(null, [address]);

      const model = new Package();
      const address = model.createDatatype('Address');

      // TODO: review if we should support typeless attributes
      address.createAttribute(null, 'street');

      result = generateGufo(model);
    });

    it('should be transformed to an owl:DatatypeProperty specializing gufo:hasValueComponent ', () => {
      expect(result).toContain('<:street> <rdf:type> <owl:DatatypeProperty>');
      expect(result).toContain('<:street> <rdfs:subPropertyOf> <gufo:hasValueComponent>');
    });

    it('should be transformed to an owl:DatatypeProperty whose domain is the class that contains the attribute', () => {
      expect(result).toContain('<:street> <rdfs:domain> <:Address>');
    });

    it("should be transformed to an owl:DatatypeProperty whose range is the attribute's type equivalent xsd type", () => {
      expect(result).not.toContain('<:street> <rdfs:range>');
    });

    it("should be transformed to an owl:DatatypeProperty whose label is the attribute's name", () => {
      expect(result).toContain('<:street> <rdfs:label> "street"');
    });
  });

  describe('of a complex datatype (e.g. «datatype» Address) with a COMPLEX TYPE (e.g. gps: GPS)', () => {
    let result: string;

    beforeAll(() => {
      const model = new Package();
      const address = model.createDatatype('Address');
      const gps = model.createDatatype('GPS');
      const _string = model.createDatatype('string');

      address.createAttribute(gps, 'gps');
      gps.createAttribute(_string, 'latitude');
      gps.createAttribute(_string, 'longitude');

      result = generateGufo(model);
    });

    it('should be transformed to an owl:ObjectProperty ', () => {
      expect(result).toContain('<:gps> <rdf:type> <owl:ObjectProperty>');
      expect(result).not.toContain('<:gps> <rdfs:subPropertyOf> <gufo:hasValueComponent>');
      expect(result).not.toContain('<:gps> <rdfs:subPropertyOf> <gufo:hasReifiedQualityValue>');
      expect(result).not.toContain('<:gps> <rdfs:subPropertyOf> <gufo:hasQualityValue>');
    });

    it('should be transformed to an owl:ObjectProperty whose domain is the class that contains the attribute', () => {
      expect(result).toContain('<:gps> <rdfs:domain> <:Address>');
    });

    it("should be transformed to an owl:ObjectProperty whose range is the attribute's type equivalent xsd type", () => {
      expect(result).toContain('<:gps> <rdfs:range> <:GPS>');
    });

    it("should be transformed to an owl:ObjectProperty whose label is the attribute's name", () => {
      expect(result).toContain('<:gps> <rdfs:label> "gps"');
    });
  });
});
