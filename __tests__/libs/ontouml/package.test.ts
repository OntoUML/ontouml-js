import {
  Class,
  Generalization,
  GeneralizationSet,
  Literal,
  Package,
  Project,
  Property,
  Relation,
  serializationUtils
} from '@libs/ontouml';

describe(`Package tests`, () => {
  let project: Project;
  let model, pkg, pkg2, emptyPkg: Package;
  let person, agent, color: Class;
  let knowsAttr: Property;
  let red, green: Literal;
  let knows: Relation;
  let gen: Generalization;
  let genSet: GeneralizationSet;

  beforeEach(() => {
    project = new Project();
    model = project.createModel();
    pkg = model.createPackage();
    pkg2 = pkg.createPackage();
    emptyPkg = model.createPackage();
    person = pkg2.createClass();
    agent = pkg2.createClass();
    color = pkg2.createEnumeration();
    red = color.createLiteral();
    green = color.createLiteral();
    knows = pkg2.createBinaryRelation(person, person);
    knowsAttr = person.createAttribute(person, 'knows');
    gen = pkg2.createGeneralization(agent, person);
    genSet = pkg2.createGeneralizationSet(gen);
  });

  describe(`Test getContents()`, () => {
    it('model should contain the correct two packages', () => {
      expect(model.getContents()).toContain(pkg);
      expect(model.getContents()).toContain(emptyPkg);
      expect(model.getContents()).toHaveLength(2);
    });

    it('package should return its directly contained elements', () => {
      expect(pkg2.getContents()).toHaveLength(6);
    });

    it('package should return an empty array when it has no contents', () => {
      expect(emptyPkg.getContents()).toHaveLength(0);
    });

    it('enumeration should return literals as contents', () => {
      const contents = color.getContents();
      expect(contents).toContain(red);
      expect(contents).toContain(green);
    });
  });

  describe(`Test getAllContents()`, () => {
    it('should return direct package', () => {
      expect(model.getAllContents()).toContain(pkg);
    });

    it('should return the package of a direct package', () => {
      expect(model.getAllContents()).toContain(pkg2);
    });

    it('should return all contained elements', () => {
      expect(model.getAllContents()).toHaveLength(14);
    });

    it('should return empty array when package has no contents', () => {
      expect(emptyPkg.getAllContents()).toHaveLength(0);
    });
  });

  describe(`Test getAllAttributes()`, () => {
    it('Test function call', () => {
      expect(model.getAllAttributes()).toContain(knowsAttr);
    });

    it('Test function call', () => {
      expect(model.getAllAttributes()).toHaveLength(1);
    });
  });

  describe(`Test getAllRelationEnds()`, () => {
    it('Test function call', () => {
      expect(model.getAllRelationEnds()).toContain(knows.getSourceEnd());
    });

    it('Test function call', () => {
      expect(model.getAllRelationEnds()).toHaveLength(2);
    });
  });

  describe(`Test getAllRelations()`, () => {
    it('Test function call', () => {
      expect(model.getAllRelations()).toContain(knows);
    });

    it('Test function call', () => {
      expect(model.getAllRelations()).toHaveLength(1);
    });
  });

  describe(`Test getAllGeneralizations()`, () => {
    it('Test function call', () => {
      expect(model.getAllGeneralizations()).toContain(gen);
    });

    it('Test function call', () => {
      expect(model.getAllGeneralizations()).toHaveLength(1);
    });
  });

  describe(`Test getAllGeneralizationSets()`, () => {
    it('Test function call', () => {
      expect(model.getAllGeneralizationSets()).toContain(genSet);
    });

    it('Test function call', () => {
      expect(model.getAllGeneralizationSets()).toHaveLength(1);
    });
  });

  describe(`Test getAllPackages()`, () => {
    it('should return direct packages', () => {
      expect(model.getAllPackages()).toContain(pkg);
      expect(model.getAllPackages()).toContain(emptyPkg);
    });

    it('Should return indirect packages', () => {
      expect(model.getAllPackages()).toContain(pkg2);
    });

    it('Test function call', () => {
      expect(model.getAllPackages()).toHaveLength(3);
    });
  });

  describe(`Test getAllClasses()`, () => {
    it('Should return classes', () => {
      expect(model.getAllClasses()).toContain(agent);
      expect(model.getAllClasses()).toContain(person);
      expect(model.getAllClasses()).toContain(color);
    });

    it('Should return 3 classes', () => {
      expect(model.getAllClasses()).toHaveLength(3);
    });
  });

  describe(`Test getAllEnumerations()`, () => {
    it('Test function call', () => {
      expect(model.getAllEnumerations()).toContain(color);
    });

    it('Test function call', () => {
      expect(model.getAllEnumerations()).toHaveLength(1);
    });
  });

  describe(`Test getAllLiterals()`, () => {
    it('Test function call', () => {
      expect(model.getAllLiterals()).toContain(red);
    });

    it('Test function call', () => {
      expect(model.getAllLiterals()).toContain(green);
    });

    it('Test function call', () => {
      expect(model.getAllLiterals()).toHaveLength(2);
    });
  });

  describe(`Test toJSON()`, () => {
    it('Test serialization', () => {
      expect(() => JSON.stringify(pkg)).not.toThrow();
    });

    it('Test serialization validation', () => {
      expect(serializationUtils.validate(model.project)).toBe(true);
    });
  });

  describe(`Test setContainer()`, () => {
    const projectA = new Project();
    const modelA = projectA.createModel();
    const pkgA = modelA.createPackage();

    const projectB = new Project();
    const modelB = projectB.createModel();

    const _class = new Class();
    _class.setProject(projectA);

    it('Test set container within common project', () => {
      modelA.addContent(_class);
      expect(_class.container).toBe(modelA);
      expect(modelA.contents).toContain(_class);
    });

    it('Test change container within common project', () => {
      pkgA.addContent(_class);
      expect(_class.container).toBe(pkgA);
      expect(pkgA.contents).toContain(_class);
      expect(modelA.getAllContents()).toContain(_class);
    });
  });

  describe(`Test clone()`, () => {
    it('Test method', () => {
      const smallModel = new Project().createModel();
      const packageA = smallModel.createPackage();
      const packageB = packageA.clone();
      expect(packageA).toEqual(packageB);
    });

    it('Test method', () => {
      const packageC = new Package();
      const packageD = packageC.clone();
      expect(packageC).toEqual(packageD);
    });

    it('should clone an entire model', () => {
      const project = new Project();
      const model = project.createModel();

      const agent = model.createCategory('Agent');
      const person = model.createKind('Person');
      const organization = model.createKind('Organization');
      const text = model.createDatatype('Text');

      agent.createAttribute(text, 'name');
      person.createAttribute(text, 'surname');

      model.createBinaryRelation(person, organization, 'works-for');

      const agentIntoPerson = model.createGeneralization(agent, person, 'agentIntoPerson');
      const agentIntoOrganization = model.createGeneralization(agent, organization, 'agentIntoOrganization');

      model.createPartition([agentIntoPerson, agentIntoOrganization], null, 'agentsSet');
      expect(model).toEqual(model.clone());
    });
  });
});
