import { Class, Project, Relation } from '../../src';

describe(`Nary relation builder tests`, () => {
  let proj: Project;
  let buysFrom: Relation;
  let customer: Class, product: Class, seller: Class;

  beforeEach(() => {
    proj = new Project();
    customer = proj.classBuilder().build();
    product = proj.classBuilder().build();
    seller = proj.classBuilder().build();
  });

  describe(`Test default values`, () => {
    beforeEach(() => {
      buysFrom = proj
        .naryRelationBuilder()
        .members(customer, product, seller)
        .build();
    });

    it('relation should have a reference to the project', () => {
      expect(buysFrom.project).toBe(proj);
    });

    it('relation should have undefined container', () => {
      expect(buysFrom.container).toBeUndefined();
    });

    it('relation should have undefined stereotype', () => {
      expect(buysFrom.stereotype).toBeUndefined();
    });

    it('relation should be n-ary', () => {
      expect(buysFrom.isNary()).toBeTrue();
    });

    it('relation should have the correct first member', () => {
      expect(buysFrom.getMember(0)).toBe(customer);
    });

    it('relation should have the correct second member', () => {
      expect(buysFrom.getMember(1)).toBe(product);
    });

    it('relation should have the correct third member', () => {
      expect(buysFrom.getMember(2)).toBe(seller);
    });

    it('relation should have all three members', () => {
      expect(buysFrom.getMembers()).toIncludeSameMembers([
        customer,
        product,
        seller
      ]);
    });
  });

  it('build() should throw an exception if no member is supplied', () => {
    expect(() => proj.naryRelationBuilder().build()).toThrowError();
  });

  it('build() should throw an exception if 1 member is supplied', () => {
    expect(() =>
      proj.naryRelationBuilder().members(customer).build()
    ).toThrowError();
  });

  it('build() should throw an exception if 2 member are supplied', () => {
    expect(() =>
      proj.naryRelationBuilder().members(customer, product).build()
    ).toThrowError();
  });
});
