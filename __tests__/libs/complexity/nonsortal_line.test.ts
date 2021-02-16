import { Project } from '@libs/ontouml';
import { Modularizer } from '@libs/complexity';

describe('getDescendantsNonSortalLine()', () => {
  it('Should return direct sortal children only', () => {
    const model = new Project().createModel();

    const musicalArtist = model.createMixin('Musical Artist');
    const singer = model.createRole('Singer');
    singer.addParent(musicalArtist);
    const person = model.createKind('Person');
    singer.addParent(person);
    const band = model.createCollective('Band');
    band.addParent(musicalArtist);

    const children = Modularizer.getNonSortalLine(musicalArtist);

    expect(children).toHaveLength(2);
    expect(children).toEqual(expect.arrayContaining([singer, band]));
  });

  it('Should return non-sortal descendants and leaf sortal descendants', () => {
    const model = new Project().createModel();

    const physicalObject = model.createCategory('Physical Object');
    const machine = model.createCategory('Machine');
    machine.addParent(physicalObject);
    const vehicle = model.createCategory('Vehicle');
    vehicle.addParent(machine);
    const car = model.createKind('Car');
    car.addParent(vehicle);
    const computer = model.createCategory('Computer');
    computer.addParent(machine);
    const laptop = model.createKind('Laptop');
    laptop.addParent(computer);
    const desktop = model.createKind('Desktop');
    desktop.addParent(computer);

    const furniture = model.createCategory('Furniture');
    furniture.addParent(physicalObject);
    const bed = model.createKind('Bed');
    bed.addParent(furniture);
    const table = model.createKind('Table');
    table.addParent(furniture);

    const children = Modularizer.getNonSortalLine(physicalObject);
    expect(children).toEqual(expect.arrayContaining([car, desktop, laptop, bed, table, machine, vehicle, computer, furniture]));
  });

  it('Should return sortal and non-sortal descendants', () => {
    const model = new Project().createModel();

    const agent = model.createCategory('Agent');
    const animal = model.createCategory('Animal');
    const robot = model.createKind('Robot');
    const person = model.createKind('Person');
    const dog = model.createKind('Dog');
    const bigRobot = model.createKind('Big Robot');

    agent.addChild(animal);
    agent.addChild(robot);
    animal.addChild(person);
    animal.addChild(dog);
    robot.addChild(bigRobot);

    const children = Modularizer.getNonSortalLine(agent);

    expect(children).toHaveLength(4);
    expect(children).toEqual(expect.arrayContaining([animal, person, dog, robot]));
  });

  it('Should return sortal and non-sortal descendants', () => {
    const model = new Project().createModel();

    const customer = model.createRoleMixin('Customer');
    const goodCustomer = model.createRoleMixin('Good Customer');
    customer.addChild(goodCustomer);
    const badCustomer = model.createRoleMixin('Bad Customer');
    customer.addChild(badCustomer);
    const corporateCustomer = model.createRole('Corporate Customer');
    customer.addChild(corporateCustomer);
    const organization = model.createKind('Organization');
    organization.addChild(corporateCustomer);
    const personalCustomer = model.createRole('Personal Customer');
    customer.addChild(personalCustomer);
    const person = model.createKind('Person');
    person.addChild(personalCustomer);

    const children = Modularizer.getNonSortalLine(customer);

    expect(children).toHaveLength(4);
    expect(children).toEqual(expect.arrayContaining([goodCustomer, badCustomer, corporateCustomer, personalCustomer]));
  });
});
