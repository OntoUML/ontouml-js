import { Project } from '@libs/ontouml';
import { Modularizer } from '@libs/complexity';

describe('getRelatorChain()', () => {
  it('Should include directly and indirectly chained relators', () => {
    const model = new Project().createModel();

    const relator1 = model.createRelator('Relator1');
    const relator2 = model.createRelator('Relator2');
    const relator3 = model.createRelator('Relator3');
    const relator4 = model.createRelator('Relator4');

    const med1 = model.createMediationRelation(relator1, relator2, 'involves insurer');
    const med2 = model.createMediationRelation(relator2, relator3, 'involves rental');
    const med3 = model.createMediationRelation(relator3, relator4, 'involves customer');

    const module = Modularizer.getRelatorChain(relator1);

    expect(module.classes).toContain(relator2);
    expect(module.classes).toContain(relator3);
    expect(module.classes).toContain(relator4);
  });

  it('Should include directly and indirectly relator parents', () => {
    const model = new Project().createModel();

    const relator1 = model.createRelator('Relator1');
    const relator2 = model.createRelator('Relator2');
    const relator3 = model.createRelator('Relator3');
    const relator4 = model.createRelator('Relator4');

    relator1.addParent(relator2);
    relator1.addParent(relator3);
    relator3.addParent(relator4);

    const module = Modularizer.getRelatorChain(relator1);

    expect(module.classes).toContain(relator2);
    expect(module.classes).toContain(relator3);
    expect(module.classes).toContain(relator4);
  });

  it('Should not include duplicated parents', () => {
    const model = new Project().createModel();

    const relator1 = model.createRelator('Relator1');
    const relator2 = model.createRelator('Relator2');
    const relator3 = model.createRelator('Relator3');
    const relator4 = model.createRelator('Relator4');

    relator1.addParent(relator2);
    relator1.addParent(relator3);
    relator3.addParent(relator4);
    relator2.addParent(relator4);

    const module = Modularizer.getRelatorChain(relator1);

    expect(module.classes).toEqual(expect.arrayContaining([relator1, relator2, relator3, relator4]));
    expect(module.classes).toHaveLength(4);
  });

  describe('from «relator» Marriage involving «role» Husband and «role» Wife', () => {
    const model = new Project().createModel();

    const marriage = model.createRelator('Marriage');
    const wife = model.createRole('wife');
    const husband = model.createRole('Husband');

    const involvesWife = model.createMediationRelation(marriage, wife, 'involves wife');
    const involvesHusband = model.createMediationRelation(marriage, husband, 'involves husband');

    const module = Modularizer.getRelatorChain(marriage);

    it('Should include «relator» Marriage', () => {
      expect(module.classes).toContain(marriage);
    });

    it('Should not include non-relator classes connected to mediations coming from the relator', () => {
      expect(module.classes).not.toContain(wife);
      expect(module.classes).not.toContain(husband);
    });

    it('Should include mediations coming from the relator', () => {
      expect(module.relations).toEqual(expect.arrayContaining([involvesWife, involvesHusband]));
    });
  });

  describe('from «relator» Rental Insurance involving «role» Insurer and «relator» Car Rental, which involves «role» Customer and «role» Rental Car,', () => {
    const model = new Project().createModel();

    const insurance = model.createRelator('Rental Insurance');
    const insurer = model.createRole('Insurer');
    const rental = model.createRelator('Car Rental');
    const customer = model.createRole('Customer');
    const car = model.createRole('Rental Car');

    const involvesInsurer = model.createMediationRelation(insurance, insurer, 'involves insurer');
    const involvesRental = model.createMediationRelation(insurance, rental, 'involves rental');
    const involvesCustomer = model.createMediationRelation(rental, customer, 'involves customer');
    const involvesCar = model.createMediationRelation(rental, car, 'involves car');

    const module = Modularizer.getRelatorChain(insurance);

    it('Should include «relator» Insurance', () => {
      expect(module.classes).toContain(insurance);
    });

    it('Should include chained «relator» Car Rental', () => {
      expect(module.classes).toContain(rental);
    });

    it('Should not include non-relator classes connected to mediations coming from any relator', () => {
      expect(module.classes).not.toContain(insurer);
      expect(module.classes).not.toContain(customer);
      expect(module.classes).not.toContain(car);
    });

    it('Should include mediations coming from every relator', () => {
      expect(module.relations).toEqual(expect.arrayContaining([involvesInsurer, involvesRental, involvesCustomer, involvesCar]));
    });
  });

  describe(
    'from «relator» Employment involving «role» Employee and «kind» Organization. Employment specializes' +
      '«relator» Registered Agreement, which involves «role» Notary and «kind» Contract,',
    () => {
      const model = new Project().createModel();

      const employment = model.createRelator('Employment');
      const employee = model.createRole('Employee');
      const organization = model.createKind('Organization');
      const agreement = model.createRelator('Registered Agreement');
      const notary = model.createRole('Notary');
      const contract = model.createKind('Contract');

      const gen = employment.addParent(agreement);

      const involvesEmployee = model.createMediationRelation(employment, employee, 'involves employee');
      const involvesOrganization = model.createMediationRelation(employment, organization, 'involves organization');
      const involvesNotary = model.createMediationRelation(agreement, notary, 'involves notary');
      const involvesContract = model.createMediationRelation(agreement, contract, 'involves contract');

      const module = Modularizer.getRelatorChain(employment);

      it('Should include «relator» Employment', () => {
        expect(module.classes).toContain(employment);
      });

      it('Should include parent «relator» Registered Agreement', () => {
        expect(module.classes).toContain(agreement);
      });

      it('Should not include non-relator classes connected to mediations coming from any relator', () => {
        expect(module.classes).not.toContain(organization);
        expect(module.classes).not.toContain(employee);
        expect(module.classes).not.toContain(notary);
        expect(module.classes).not.toContain(contract);
      });

      it('Should include mediations coming from every relator', () => {
        expect(module.relations).toEqual(
          expect.arrayContaining([involvesEmployee, involvesOrganization, involvesNotary, involvesContract])
        );
      });
    }
  );
});
