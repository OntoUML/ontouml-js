import { Class, containerUtils, ModelElement, Package, Project, serializationUtils } from '@libs/ontouml';

describe(`${ModelElement.name} Tests`, () => {
  // TODO: move test to 'container.test.ts'
  describe(`Test ${containerUtils.setContainer.name}()`, () => {
    const projectA = new Project();
    const modelA = projectA.createModel();
    const pkgA = modelA.createPackage();

    const projectB = new Project();
    const modelB = projectB.createModel();

    const _class = new Class();
    _class.setProject(projectA);

    it('Test set container within common project', () => {
      _class.setContainer(modelA);
      expect(_class.container).toBe(modelA);
      expect(modelA.contents).toContain(_class);
    });

    it('Test change container within common project', () => {
      _class.setContainer(pkgA);
      expect(_class.container).toBe(pkgA);
      expect(pkgA.contents).toContain(_class);
      expect(modelA.getAllContents()).toContain(_class);
    });

    it('Test exception when changing enclosing project', () => {
      expect(() => _class.setContainer(modelB)).toThrow();
    });
  });

  describe(`Test ${ModelElement.prototype.lock.name}`, () => {
    // TODO:  implement test
  });

  describe(`Test ${ModelElement.prototype.unlock.name}`, () => {
    // TODO:  implement test
  });

  describe(`Test ${ModelElement.prototype.isLocked.name}`, () => {
    // TODO:  implement test
  });

  describe(`Test ${ModelElement.prototype.toJSON.name}`, () => {
    const model = new Project().createModel();

    it('Test serialization', () => expect(() => JSON.stringify(model)).not.toThrow());
    it('Test serialization validation', () => expect(serializationUtils.validate(model.project)).toBeTruthy());
  });

  describe(`Test ${ModelElement.prototype.setProject.name}`, () => {
    const model = new Project().createModel();
    const pkg = new Package();
    const person = pkg.createClass();

    const emptyProject = new Project();
    emptyProject.createModel();

    it('Test override defined project throws error', () => expect(() => model.setProject(emptyProject)).toThrow());
    it('Test setting project on the content of a container throws error', () =>
      expect(() => person.setProject(emptyProject)).toThrow());
    it('Test setting a project without a model/root package', () => expect(() => person.setProject(new Project())).toThrow());
    it('Test setting project on the content of a container throws error', () => {
      pkg.setProject(model.project);
      expect(pkg.project).toBe(model.project);
      expect(person.project).toBe(model.project);
      expect(pkg.container).toBe(model);
      expect(person.container).toBe(pkg);
      expect(model.getContents()).toContain(pkg);
    });
  });

  describe(`Test ${ModelElement.prototype.getModelOrRootPackage.name}`, () => {
    // TODO:  implement test
  });

  // describe(`Test ${ModelElement.prototype.clone.name}`, () => {
  //   // TODO:  implement test
  // });

  // describe(`Test ${ModelElement.prototype.replace.name}`, () => {
  //   // TODO:  implement test
  // });

  describe(`Test ${ModelElement.prototype.isDecoratable.name}`, () => {
    const model = new Project().createModel();
    const _class = model.createClass();
    const _enum = model.createEnumeration();
    const att = _class.createAttribute(_enum);
    const lit = _enum.createLiteral();
    const gen = model.createGeneralization(_class, _class);
    const genSet = model.createGeneralizationSet([gen]);
    const pkg = model.createPackage();
    const relation = model.createRelation();

    it('Test function call on _class', () => expect(_class.isDecoratable()).toBe(true));
    it('Test function call on _enum', () => expect(_enum.isDecoratable()).toBe(true));
    it('Test function call on att', () => expect(att.isDecoratable()).toBe(true));
    it('Test function call on lit', () => expect(lit.isDecoratable()).toBe(false));
    it('Test function call on gen', () => expect(gen.isDecoratable()).toBe(false));
    it('Test function call on genSet', () => expect(genSet.isDecoratable()).toBe(false));
    it('Test function call on pkg', () => expect(pkg.isDecoratable()).toBe(false));
    it('Test function call on relation', () => expect(relation.isDecoratable()).toBe(true));
  });

  describe(`Test ${ModelElement.prototype.isClassifier.name}`, () => {
    const model = new Project().createModel();
    const _class = model.createClass();
    const _enum = model.createEnumeration();
    const att = _class.createAttribute(_enum);
    const lit = _enum.createLiteral();
    const gen = model.createGeneralization(_class, _class);
    const genSet = model.createGeneralizationSet([gen]);
    const pkg = model.createPackage();
    const relation = model.createRelation();

    it('Test function call on _class', () => expect(_class.isClassifier()).toBe(true));
    it('Test function call on _enum', () => expect(_enum.isClassifier()).toBe(true));
    it('Test function call on att', () => expect(att.isClassifier()).toBe(false));
    it('Test function call on lit', () => expect(lit.isClassifier()).toBe(false));
    it('Test function call on gen', () => expect(gen.isClassifier()).toBe(false));
    it('Test function call on genSet', () => expect(genSet.isClassifier()).toBe(false));
    it('Test function call on pkg', () => expect(pkg.isClassifier()).toBe(false));
    it('Test function call on relation', () => expect(relation.isClassifier()).toBe(true));
  });
});
