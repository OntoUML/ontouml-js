import { generateGufo, OntoumlFactory } from './helpers';

describe('An attribute', () => {
  describe('of a concrete class (e.g. «kind» Person) with a PRIMITIVE TYPE (e.g. name: string, age: int, start: date)', () => {
    let result: string;

    beforeAll(() => {
      const _class = OntoumlFactory.createKind('Person');
      const datatype = OntoumlFactory.createDatatype('string');
      OntoumlFactory.addAttribute(_class, 'name', datatype);

      const model = OntoumlFactory.createPackage(null, [_class, datatype]);
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

  describe('of a concrete class (e.g. «category» Location) with a COMPLEX TYPE (e.g. address: Address)', () => {
    let result: string;

    beforeAll(() => {
      const location = OntoumlFactory.createCategory('Location');
      const address = OntoumlFactory.createDatatype('Address');
      const _string = OntoumlFactory.createDatatype('string');
      OntoumlFactory.addAttribute(address, 'street', _string);
      OntoumlFactory.addAttribute(address, 'city', _string);
      OntoumlFactory.addAttribute(location, 'address', address);

      const model = OntoumlFactory.createPackage(null, [location, address, _string]);
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

  describe('of a concrete class (e.g. «category» Object) with a ENUMERATION TYPE (e.g. color: Color<Red,Blue,Green>)', () => {
    let result: string;

    beforeAll(() => {
      const location = OntoumlFactory.createCategory('Object');
      const color = OntoumlFactory.createEnumeration('Color', ['Red', 'Blue', 'Green']);
      OntoumlFactory.addAttribute(location, 'color', color);

      const model = OntoumlFactory.createPackage(null, [location, color]);
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
      const address = OntoumlFactory.createDatatype('Address');
      const _string = OntoumlFactory.createDatatype('string');
      OntoumlFactory.addAttribute(address, 'street', _string);

      const model = OntoumlFactory.createPackage(null, [address, _string]);
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
      const address = OntoumlFactory.createDatatype('Address');
      OntoumlFactory.addAttribute(address, 'street');

      const model = OntoumlFactory.createPackage(null, [address]);
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
      const address = OntoumlFactory.createDatatype('Address');
      const gps = OntoumlFactory.createDatatype('GPS');
      const _string = OntoumlFactory.createDatatype('string');
      OntoumlFactory.addAttribute(address, 'gps', gps);
      OntoumlFactory.addAttribute(gps, 'latitude', _string);
      OntoumlFactory.addAttribute(gps, 'longitude', _string);

      const model = OntoumlFactory.createPackage(null, [address, gps, _string]);
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
