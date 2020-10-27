import { ClassStereotype } from '@constants/.';
import Class from '@libs/project/class';

describe('Decoratable Interface Tests', () => {
  it('Class with no stereotypes', () => {
    const c = new Class();
    expect(c.getUniqueStereotype()).toBeUndefined();
  });

  it('Class with single stereotype', () => {
    // Invalid stereotype
    const c = new Class({ stereotypes: ['asd' as ClassStereotype] });
    expect(c.getUniqueStereotype()).toEqual('asd');

    // Valid stereotype
    c.stereotypes = [ClassStereotype.KIND];
    expect(c.getUniqueStereotype()).toEqual(ClassStereotype.KIND);
  });

  it('Class with multiple stereotypes', () => {
    const c = new Class({ stereotypes: [ClassStereotype.KIND, ClassStereotype.ABSTRACT] });
    expect(() => c.getUniqueStereotype()).toThrowError();
  });
});
