import {
  BinaryRelation,
  Class,
  Generalization,
  GeneralizationSet,
  Literal,
  Package,
  Project,
  Property
} from '../../src';

describe(`Package tests`, () => {
  let proj: Project;
  let model: Package, pkg: Package, pkg2: Package, emptyPkg: Package;
  let person: Class, agent: Class, color: Class;
  let knowsAttr: Property;
  let red: Literal, green: Literal;
  let knows: BinaryRelation;
  let gen: Generalization;
  let gs: GeneralizationSet;
  let contents;

  beforeAll(() => {
    proj = new Project();
    model = proj.packageBuilder().root().build();
    pkg = model.packageBuilder().build();
    pkg2 = pkg.packageBuilder().build();
    emptyPkg = model.packageBuilder().build();
    person = pkg2.classBuilder().build();
    agent = pkg2.classBuilder().build();
    color = pkg2.classBuilder().enumeration().build();
    red = color.literalBuilder().build();
    green = color.literalBuilder().build();
    knows = pkg2.binaryRelationBuilder().source(person).target(person).build();
    knowsAttr = person.propertyBuilder().type(person).build();
    gen = person.addParent(agent);
    gs = pkg2.generalizationSetBuilder().generalizations(gen).build();
  });

  describe(`Test getContents()`, () => {
    it('model should contain [ pkg, emptyPkg ]', () => {
      contents = model.getContents();
      expect(contents).toIncludeAllMembers([pkg, emptyPkg]);
    });

    it('pkg should contain [ pkg2 ]', () => {
      contents = pkg.getContents();
      expect(contents).toIncludeAllMembers([pkg2]);
    });

    it('pkg2 should contain [  person, agent, color, knows, gen, genSet ]', () => {
      contents = pkg2.getContents();
      expect(contents).toIncludeAllMembers([
        person,
        agent,
        color,
        knows,
        gen,
        gs
      ]);
    });

    it('empty package should return empty array', () => {
      contents = emptyPkg.getContents();
      expect(contents).toBeEmpty();
    });
  });

  describe(`Test getAllContents()`, () => {
    it('model should contain all packages', () => {
      contents = model.getAllContents();
      expect(contents).toIncludeAllMembers([pkg, pkg2, emptyPkg]);
    });

    it('model should contain all classes', () => {
      contents = model.getAllContents();
      expect(contents).toIncludeAllMembers([person, agent, color]);
    });

    it('model should contain all binary relations', () => {
      contents = model.getAllContents();
      expect(contents).toIncludeAllMembers([knows]);
    });

    it('model should contain all generalizations', () => {
      contents = model.getAllContents();
      expect(contents).toIncludeAllMembers([gen]);
    });

    it('model should contain all generalization sets', () => {
      contents = model.getAllContents();
      expect(contents).toIncludeAllMembers([gs]);
    });

    it('model should contain all properties', () => {
      contents = model.getAllContents();
      expect(contents).toIncludeAllMembers([knowsAttr]);
    });

    it('model should contain all literals', () => {
      contents = model.getAllContents();
      expect(contents).toIncludeAllMembers([red, green]);
    });

    it('empty package should return empty array', () => {
      contents = emptyPkg.getAllContents();
      expect(contents).toBeEmpty();
    });
  });

  describe(`Test getAllAttributes()`, () => {
    it('model should return [ knowsAttr ]', () => {
      const contents = model.getAllAttributes();
      expect(contents).toIncludeSameMembers([knowsAttr]);
    });

    it('empty package should return empty array', () => {
      contents = emptyPkg.getAllAttributes();
      expect(contents).toBeEmpty();
    });
  });

  describe(`Test getAllBinaryRelations()`, () => {
    it('model should return [ knows ]', () => {
      const contents = model.getAllBinaryRelations();
      expect(contents).toIncludeSameMembers([knows]);
    });

    it('empty package should return empty array', () => {
      contents = emptyPkg.getAllBinaryRelations();
      expect(contents).toBeEmpty();
    });
  });

  describe(`Test getAllClasses()`, () => {
    it('model should return [ person, agent, color ]', () => {
      const contents = model.getAllClasses();
      expect(contents).toIncludeSameMembers([person, agent, color]);
    });

    it('empty package should return empty array', () => {
      contents = emptyPkg.getAllClasses();
      expect(contents).toBeEmpty();
    });
  });

  describe(`Test getAllGeneralizationSets()`, () => {
    it('model should return [ gs ]', () => {
      const contents = model.getAllGeneralizationSets();
      expect(contents).toIncludeSameMembers([gs]);
    });

    it('empty package should return empty array', () => {
      contents = emptyPkg.getAllGeneralizationSets();
      expect(contents).toBeEmpty();
    });
  });

  describe(`Test getAllGeneralizations()`, () => {
    it('model should return [ gen ]', () => {
      const contents = model.getAllGeneralizations();
      expect(contents).toIncludeSameMembers([gen]);
    });

    it('empty package should return empty array', () => {
      contents = emptyPkg.getAllGeneralizations();
      expect(contents).toBeEmpty();
    });
  });

  describe(`Test getAllLinks()`, () => {
    it('model should return [  ]', () => {
      const contents = model.getAllLinks();
      expect(contents).toIncludeSameMembers([]);
    });

    it('empty package should return empty array', () => {
      contents = emptyPkg.getAllLinks();
      expect(contents).toBeEmpty();
    });
  });

  describe(`Test getAllLiterals()`, () => {
    it('model should return [green, red]', () => {
      const contents = model.getAllLiterals();
      expect(contents).toIncludeSameMembers([green, red]);
    });

    it('empty package should return empty array', () => {
      contents = emptyPkg.getAllLiterals();
      expect(contents).toBeEmpty();
    });
  });

  describe(`Test getAllNaryRelations()`, () => {
    it('model should return [  ]', () => {
      const contents = model.getAllNaryRelations();
      expect(contents).toIncludeSameMembers([]);
    });

    it('empty package should return empty array', () => {
      contents = emptyPkg.getAllNaryRelations();
      expect(contents).toBeEmpty();
    });
  });

  describe(`Test getAllNotes()`, () => {
    it('model should return [  ]', () => {
      const contents = model.getAllNotes();
      expect(contents).toIncludeSameMembers([]);
    });

    it('empty package should return empty array', () => {
      contents = emptyPkg.getAllNotes();
      expect(contents).toBeEmpty();
    });
  });

  describe(`Test getAllPackages()`, () => {
    it('model should return [ pkg, pkg2, emptyPkg ]', () => {
      const contents = model.getAllPackages();
      expect(contents).toIncludeSameMembers([pkg, pkg2, emptyPkg]);
    });

    it('empty package should return empty array', () => {
      contents = emptyPkg.getAllPackages();
      expect(contents).toBeEmpty();
    });
  });

  describe(`Test getAllProperties()`, () => {
    it('model should return [  ]', () => {
      const contents = model.getAllProperties();
      expect(contents).toIncludeSameMembers([knowsAttr, ...knows.properties]);
    });

    it('empty package should return empty array', () => {
      contents = emptyPkg.getAllProperties();
      expect(contents).toBeEmpty();
    });
  });

  describe(`Test getAllRelationEnds()`, () => {
    it('model should return [  ]', () => {
      const contents = model.getAllRelationEnds();
      expect(contents).toIncludeSameMembers([...knows.properties]);
    });

    it('empty package should return empty array', () => {
      contents = emptyPkg.getAllRelationEnds();
      expect(contents).toBeEmpty();
    });
  });

  describe(`Test getAllRelations()`, () => {
    it('model should return [ knows ]', () => {
      const contents = model.getAllRelations();
      expect(contents).toIncludeSameMembers([knows]);
    });

    it('empty package should return empty array', () => {
      contents = emptyPkg.getAllRelations();
      expect(contents).toBeEmpty();
    });
  });

  describe(`Test toJSON()`, () => {
    it('should serialize project without throwing an exception', () => {
      expect(() => JSON.stringify(pkg)).not.toThrow();
    });
  });
});

describe(`Test setContainer()`, () => {
  const projectA = new Project();
  const modelA = projectA.packageBuilder().root().build();
  const pkgA = modelA.packageBuilder().build();
  const _class = projectA.classBuilder().build();

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

// describe(`Test clone()`, () => {
//   it('Test method', () => {
//     const smallModel = new Project().packageBuilder().root().build();
//     const packageA = smallModel.packageBuilder().build();
//     const packageB = packageA.clone();
//     expect(packageA).toEqual(packageB);
//   });

//   it('Test method', () => {
//     const packageC = new Project().packageBuilder().root().build();
//     const packageD = packageC.clone();
//     expect(packageC).toEqual(packageD);
//   });

//   it('should clone an entire model', () => {
//     const project = new Project();
//     const model = project.packageBuilder().root().build();

//     const agent = model.classBuilder().name('Agent').build();
//     const person = model.classBuilder().kind().name('Person').build();
//     const org = model.classBuilder().kind().name('Organization').build();
//     const text = model.classBuilder().datatype().name('Text').build();

//     agent.propertyBuilder().type(text).name('name');
//     person.propertyBuilder().type(text).name('surname');

//     model.createBinaryRelation(person, org, 'works-for');

//     const gen1 = model
//       .generalizationBuilder()
//       .general(agent)
//       .specific(person)
//       .name('gen1')
//       .build();

//     const gen2 = model
//       .generalizationBuilder()
//       .general(agent)
//       .specific(org)
//       .name('gen2')
//       .build();

//     model
//       .generalizationSetBuilder()
//       .generalizations(gen1, gen2)
//       .name('agentsSet')
//       .build();

//     expect(model).toEqual(model.clone());
//   });
// });
