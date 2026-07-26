import {
  Class,
  Generalization,
  Nature,
  Package,
  Project,
  serializationUtils
} from '../../src';
import {
  ClassVerification,
  GeneralizationVerification,
  OntoumlVerification,
  VerificationIssue,
  VerificationIssueCode
} from '../../src';

function createModel(): Package {
  return new Project().packageBuilder().root().build();
}

function createSubkind(model: Package): Class {
  return model
    .classBuilder()
    .subkind()
    .restrictedTo(Nature.FUNCTIONAL_COMPLEX)
    .build();
}

function codesOf(issues: VerificationIssue[]): VerificationIssueCode[] {
  return issues.map(issue => issue.code);
}

function runOn(project: Project): VerificationIssue[] {
  return new OntoumlVerification(project).run().result;
}

describe('Adversarial: empty and minimal inputs', () => {
  it('an empty project yields an empty issue list (not just "does not throw")', () => {
    expect(runOn(new Project())).toEqual([]);
  });

  it('a project whose root package is empty yields no issues', () => {
    const project = new Project();
    project.packageBuilder().root().build();
    expect(runOn(project)).toEqual([]);
  });

  it('a project without a root package is not verified, even if it owns elements', () => {
    // Faithful to the original semantics: ProjectVerification only descends
    // into project.root (the counterpart of the former project.model), so
    // container-less elements are skipped in a project-level run.
    const project = new Project();
    const detached = new Class(project);
    expect(project.root).toBeUndefined();
    expect(runOn(project)).toEqual([]);
    // ...but the same element can still be verified directly.
    expect(codesOf(OntoumlVerification.verify(detached))).toEqual([
      VerificationIssueCode.class_not_unique_stereotype
    ]);
  });

  it('a directly-constructed, package-less class can be verified in isolation', () => {
    const project = new Project();
    project.packageBuilder().root().build();
    const detached = new Class(project); // registered in the project, but in no package
    const issues = OntoumlVerification.verify(detached);
    expect(codesOf(issues)).toEqual([
      VerificationIssueCode.class_not_unique_stereotype
    ]);
  });
});

describe('Adversarial: dispatch coverage over issue-free element types', () => {
  const project = new Project();
  const model = project.packageBuilder().root().build();
  const source = model.classBuilder().kind().build();
  const target = model.classBuilder().kind().build();
  const third = model.classBuilder().kind().build();
  const binary = model
    .binaryRelationBuilder()
    .source(source)
    .target(target)
    .build();
  const nary = model
    .naryRelationBuilder()
    .members(source, target, third)
    .build();
  const enumeration = model.classBuilder().enumeration().build();
  const literal = enumeration.literalBuilder().build();
  const attribute = source.propertyBuilder().type(enumeration).build();
  const gen = model
    .generalizationBuilder()
    .general(source)
    .specific(target)
    .build();
  const genSet = model
    .generalizationSetBuilder()
    .partition()
    .generalizations(gen)
    .build();
  const note = model.noteBuilder().text('a note').build();
  const anchor = model.anchorBuilder().note(note).annotates(source).build();

  it('notes and anchors produce no issues', () => {
    expect(OntoumlVerification.verify(note)).toEqual([]);
    expect(OntoumlVerification.verify(anchor)).toEqual([]);
  });

  it('literals, attributes, and relation ends produce no issues', () => {
    expect(OntoumlVerification.verify(literal)).toEqual([]);
    expect(OntoumlVerification.verify(attribute)).toEqual([]);
    expect(OntoumlVerification.verify(binary.properties[0])).toEqual([]);
  });

  it('generalization sets produce no issues', () => {
    expect(OntoumlVerification.verify(genSet)).toEqual([]);
  });

  it('stereotype-less binary relations and n-ary relations produce no issues', () => {
    expect(OntoumlVerification.verify(binary)).toEqual([]);
    expect(OntoumlVerification.verify(nary)).toEqual([]);
  });

  it('verifying a non-model element throws the advertised error', () => {
    expect(() => OntoumlVerification.verify(null as any)).toThrow(
      'Unexpected element to be verified.'
    );
    expect(() => OntoumlVerification.verify({} as any)).toThrow(
      'Unexpected element to be verified.'
    );
  });

  it('issues found in nested packages are reported by a project-level run', () => {
    const p = new Project();
    const root = p.packageBuilder().root().build();
    const inner = root.packageBuilder().build();
    const innermost = inner.packageBuilder().build();
    innermost.classBuilder().build(); // stereotype-less
    expect(codesOf(runOn(p))).toEqual([
      VerificationIssueCode.class_not_unique_stereotype
    ]);
  });
});

describe('Adversarial: stereotype-less elements wherever rules dispatch', () => {
  it('a stereotype-less class yields exactly the not-unique-stereotype issue', () => {
    const model = createModel();
    model.classBuilder().build();
    expect(codesOf(runOn(model.project!))).toEqual([
      VerificationIssueCode.class_not_unique_stereotype
    ]);
  });

  it('a stereotype-less class that owns literals (via mutation) reports both minimal issues', () => {
    const model = createModel();
    const _class = model.classBuilder().enumeration().build();
    _class.literalBuilder().build();
    _class.stereotype = undefined;

    const issues = ClassVerification.verifyClass(_class);
    expect(codesOf(issues).sort()).toEqual([
      VerificationIssueCode.class_non_enumeration_with_literals,
      VerificationIssueCode.class_not_unique_stereotype
    ]);
  });

  it('a generalization between stereotype-less classes does not crash any rule', () => {
    const model = createModel();
    const general = model.classBuilder().build();
    const specific = model.classBuilder().build();
    model.generalizationBuilder().general(general).specific(specific).build();

    const issues = runOn(model.project!);
    // The stereotype-guarded rules stay silent; the nature-compatibility rule
    // fires because both classes have empty restrictedTo (as in the original,
    // where restrictedToContains() is false for empty inputs).
    expect(codesOf(issues).sort()).toEqual([
      VerificationIssueCode.class_not_unique_stereotype,
      VerificationIssueCode.class_not_unique_stereotype,
      VerificationIssueCode.generalization_incompatible_natures
    ]);
  });

  it('a stereotype-less relation between stereotype-less classes adds no relation issues', () => {
    const model = createModel();
    const a = model.classBuilder().build();
    const b = model.classBuilder().build();
    model.binaryRelationBuilder().source(a).target(b).build();

    expect(codesOf(runOn(model.project!))).toEqual([
      VerificationIssueCode.class_not_unique_stereotype,
      VerificationIssueCode.class_not_unique_stereotype
    ]);
  });
});

describe('Adversarial: identity providers over deep and diamond hierarchies', () => {
  it('a diamond over a single kind does not produce a false multiple-identity-providers issue', () => {
    const model = createModel();
    const kind = model.classBuilder().kind().build();
    const left = createSubkind(model);
    const right = createSubkind(model);
    const bottom = createSubkind(model);
    model.generalizationBuilder().general(kind).specific(left).build();
    model.generalizationBuilder().general(kind).specific(right).build();
    model.generalizationBuilder().general(left).specific(bottom).build();
    model.generalizationBuilder().general(right).specific(bottom).build();

    expect(runOn(model.project!)).toEqual([]);
  });

  it('a diamond over two distinct kinds reports multiple identity providers exactly once', () => {
    const model = createModel();
    const kindA = model.classBuilder().kind().build();
    const kindB = model.classBuilder().kind().build();
    const left = createSubkind(model);
    const right = createSubkind(model);
    const bottom = createSubkind(model);
    model.generalizationBuilder().general(kindA).specific(left).build();
    model.generalizationBuilder().general(kindB).specific(right).build();
    model.generalizationBuilder().general(left).specific(bottom).build();
    model.generalizationBuilder().general(right).specific(bottom).build();

    const issues = runOn(model.project!);
    expect(codesOf(issues)).toEqual([
      VerificationIssueCode.class_multiple_identity_providers
    ]);
    expect(issues[0].data.source).toBe(bottom);
    expect(issues[0].data.context).toHaveLength(2);
    expect(issues[0].data.context).toEqual(
      expect.arrayContaining([kindA, kindB])
    );
  });

  it('a 30-level-deep subkind chain is verified without issues or stack exhaustion', () => {
    const model = createModel();
    let parent: Class = model.classBuilder().kind().build();
    for (let i = 0; i < 30; i++) {
      const child = createSubkind(model);
      model.generalizationBuilder().general(parent).specific(child).build();
      parent = child;
    }
    expect(runOn(model.project!)).toEqual([]);
  });

  it('a kind that indirectly specializes another kind is flagged', () => {
    const model = createModel();
    const topKind = model.classBuilder().kind().build();
    const middle = createSubkind(model);
    const bottomKind = model.classBuilder().kind().build();
    model.generalizationBuilder().general(topKind).specific(middle).build();
    model.generalizationBuilder().general(middle).specific(bottomKind).build();

    const issues = runOn(model.project!);
    expect(codesOf(issues)).toEqual([
      VerificationIssueCode.class_identity_provider_specialization
    ]);
    expect(issues[0].data.source).toBe(bottomKind);
    expect(issues[0].data.context).toEqual([topKind]);
  });

  it('a parentless role with no nature restrictions accumulates both class issues', () => {
    const model = createModel();
    model.classBuilder().role().build(); // role() assigns no natures

    const issues = runOn(model.project!);
    expect(codesOf(issues).sort()).toEqual([
      VerificationIssueCode.class_missing_identity_provider,
      VerificationIssueCode.class_missing_nature_restrictions
    ]);
  });
});

describe('Adversarial: circular generalization tolerance on every reachable rule', () => {
  it('a two-kind cycle flags each kind as specializing an ultimate sortal, without hanging', () => {
    const model = createModel();
    const kindA = model.classBuilder().kind().build();
    const kindB = model.classBuilder().kind().build();
    model.generalizationBuilder().general(kindA).specific(kindB).build();
    model.generalizationBuilder().general(kindB).specific(kindA).build();

    const issues = runOn(model.project!);
    expect(codesOf(issues)).toEqual([
      VerificationIssueCode.class_identity_provider_specialization,
      VerificationIssueCode.class_identity_provider_specialization
    ]);
    // A class in a cycle is not reported as its own identity provider.
    expect(issues[0].data.context).not.toContain(issues[0].data.source);
    expect(issues[1].data.context).not.toContain(issues[1].data.source);
  });

  it('a subkind-only cycle reports a missing identity provider for each member', () => {
    const model = createModel();
    const subA = createSubkind(model);
    const subB = createSubkind(model);
    model.generalizationBuilder().general(subA).specific(subB).build();
    model.generalizationBuilder().general(subB).specific(subA).build();

    expect(codesOf(runOn(model.project!))).toEqual([
      VerificationIssueCode.class_missing_identity_provider,
      VerificationIssueCode.class_missing_identity_provider
    ]);
  });

  it('identity provided outside a cycle is found by traversing through the cycle', () => {
    const model = createModel();
    const kind = model.classBuilder().kind().build();
    const subA = createSubkind(model);
    const subB = createSubkind(model);
    model.generalizationBuilder().general(subA).specific(subB).build();
    model.generalizationBuilder().general(subB).specific(subA).build();
    model.generalizationBuilder().general(kind).specific(subA).build();

    expect(runOn(model.project!)).toEqual([]);
  });

  it('a three-member cycle is traversed by class verification without hanging', () => {
    const model = createModel();
    const a = createSubkind(model);
    const b = createSubkind(model);
    const c = createSubkind(model);
    model.generalizationBuilder().general(a).specific(b).build();
    model.generalizationBuilder().general(b).specific(c).build();
    model.generalizationBuilder().general(c).specific(a).build();

    expect(codesOf(runOn(model.project!))).toEqual([
      VerificationIssueCode.class_missing_identity_provider,
      VerificationIssueCode.class_missing_identity_provider,
      VerificationIssueCode.class_missing_identity_provider
    ]);
  });

  it('a self-generalization (direct construction) is reported exactly once as circular', () => {
    const project = new Project();
    const model = project.packageBuilder().root().build();
    const kind = model.classBuilder().kind().build();
    // The builder rejects self-specialization; direct construction does not.
    const gen = new Generalization(project, kind, kind);
    model.addContent(gen);

    const issues = runOn(project);
    expect(codesOf(issues)).toEqual([
      VerificationIssueCode.generalization_circular
    ]);
    // The self-loop does not confuse the identity-provider traversal of the kind.
    expect(ClassVerification.checkKindSpecialization(kind)).toBeNull();
  });

  it('the minimal-consistency error on a circular generalization stops the remaining rules', () => {
    const project = new Project();
    const model = project.packageBuilder().root().build();
    const enumeration = model.classBuilder().enumeration().build();
    const gen = new Generalization(project, enumeration, enumeration);

    // Were verification not short-circuited, the enumeration/datatype/nature
    // rules would also run; the circular error must be the only one reported.
    expect(
      codesOf(GeneralizationVerification.verifyGeneralization(gen))
    ).toEqual([VerificationIssueCode.generalization_circular]);
  });

  it('cycle tolerance survives a serialization/deserialization round-trip', () => {
    const model = createModel();
    const kindA = model.classBuilder().kind().build();
    const kindB = model.classBuilder().kind().build();
    model.generalizationBuilder().general(kindA).specific(kindB).build();
    model.generalizationBuilder().general(kindB).specific(kindA).build();

    const parsed = serializationUtils.parse(JSON.stringify(model.project));
    expect(codesOf(runOn(parsed))).toEqual([
      VerificationIssueCode.class_identity_provider_specialization,
      VerificationIssueCode.class_identity_provider_specialization
    ]);
  });
});

describe('Adversarial: high-order types with weird order/isPowertype values', () => {
  it('a builder-made «type» class raises no issues by default', () => {
    const model = createModel();
    model.classBuilder().type().build();
    expect(runOn(model.project!)).toEqual([]);
  });

  it('order 0 (via mutation) is reported as a missing order', () => {
    const model = createModel();
    const type = model.classBuilder().type().build();
    (type as any)._order = 0;

    expect(codesOf(ClassVerification.verifyClass(type))).toEqual([
      VerificationIssueCode.class_missing_order
    ]);
  });

  it('a negative order (via mutation) is not reported, faithfully to the original "!order" test', () => {
    const model = createModel();
    const type = model.classBuilder().type().build();
    (type as any)._order = -3;

    expect(ClassVerification.checkMissingOrder(type)).toBeNull();
  });

  it('huge and orderless orders are accepted silently', () => {
    const model = createModel();
    model.classBuilder().type().order(9999).build();
    model.classBuilder().type().orderless().build();
    expect(runOn(model.project!)).toEqual([]);
  });

  it('a null isPowertype (via mutation) is reported as missing', () => {
    const model = createModel();
    const type = model.classBuilder().type().build();
    (type as any).isPowertype = null;

    expect(codesOf(ClassVerification.verifyClass(type))).toEqual([
      VerificationIssueCode.class_missing_is_powertype
    ]);
  });

  it('null isPowertype and zero order accumulate on the same class', () => {
    const model = createModel();
    const type = model.classBuilder().type().build();
    (type as any).isPowertype = null;
    (type as any)._order = 0;

    expect(codesOf(ClassVerification.verifyClass(type)).sort()).toEqual([
      VerificationIssueCode.class_missing_is_powertype,
      VerificationIssueCode.class_missing_order
    ]);
  });

  it('the type nature is incompatible with endurant stereotypes (original endurant list)', () => {
    const model = createModel();
    const category = model
      .classBuilder()
      .category()
      .restrictedTo(Nature.TYPE)
      .build();

    // The original verification excludes the `type` nature from the endurant
    // natures accepted by «category» (unlike the new EndurantNatures constant).
    expect(codesOf(ClassVerification.verifyClass(category))).toEqual([
      VerificationIssueCode.class_incompatible_natures
    ]);
  });
});

describe('Adversarial: enumerations and literals', () => {
  it('an enumeration without literals raises no issues', () => {
    const model = createModel();
    model.classBuilder().enumeration().build();
    expect(runOn(model.project!)).toEqual([]);
  });

  it('an enumeration with both attributes and literals reports only the attribute violation', () => {
    const model = createModel();
    const enumeration = model.classBuilder().enumeration().build();
    enumeration.literalBuilder().build();
    enumeration.propertyBuilder().build();

    expect(codesOf(ClassVerification.verifyClass(enumeration))).toEqual([
      VerificationIssueCode.class_enumeration_with_properties
    ]);
  });

  it('a kind re-stereotyped from enumeration keeps its literals and is flagged, stopping further checks', () => {
    const model = createModel();
    const _class = model.classBuilder().enumeration().build();
    _class.literalBuilder().build();
    _class.stereotype = 'kind' as any;

    // Minimal consistency fails, so the identity-provider rule (which would
    // also fire for this parentless kind... it wouldn't, kinds provide their
    // own identity) and the nature rules must not run.
    expect(codesOf(ClassVerification.verifyClass(_class))).toEqual([
      VerificationIssueCode.class_non_enumeration_with_literals
    ]);
  });

  it('an enumeration specializing an enumeration is consistent', () => {
    const model = createModel();
    const general = model.classBuilder().enumeration().build();
    const specific = model.classBuilder().enumeration().build();
    model.generalizationBuilder().general(general).specific(specific).build();

    expect(runOn(model.project!)).toEqual([]);
  });
});

describe('Adversarial: generalizations mixing classes and relations', () => {
  it('a class-general/relation-specific generalization reports exactly the incompatible-types issue', () => {
    const model = createModel();
    const general = model.classBuilder().kind().build();
    const a = model.classBuilder().kind().build();
    const b = model.classBuilder().kind().build();
    const relation = model
      .binaryRelationBuilder()
      .material()
      .source(a)
      .target(b)
      .build();
    model.generalizationBuilder().general(general).specific(relation).build();

    expect(codesOf(runOn(model.project!))).toEqual([
      VerificationIssueCode.generalization_incompatible_general_and_specific_types
    ]);
  });

  it('a class specializing a stereotyped relation does not crash class verification', () => {
    const model = createModel();
    const a = model.classBuilder().kind().build();
    const b = model.classBuilder().kind().build();
    const relation = model
      .binaryRelationBuilder()
      .material()
      .source(a)
      .target(b)
      .build();
    const subkind = createSubkind(model);
    model.generalizationBuilder().general(relation).specific(subkind).build();

    // The relation-typed "ancestor" must be ignored by the ultimate-sortal
    // traversal rather than crash it; the subkind then lacks an identity
    // provider, and the mixed generalization is separately flagged.
    const classIssues = ClassVerification.verifyClass(subkind);
    expect(codesOf(classIssues)).toEqual([
      VerificationIssueCode.class_missing_identity_provider
    ]);

    expect(codesOf(runOn(model.project!)).sort()).toEqual([
      VerificationIssueCode.class_missing_identity_provider,
      VerificationIssueCode.generalization_incompatible_general_and_specific_types
    ]);
  });

  it('a relation-relation generalization produces no issues (relation rules are unimplemented)', () => {
    const model = createModel();
    const a = model.classBuilder().kind().build();
    const b = model.classBuilder().kind().build();
    const generalRel = model
      .binaryRelationBuilder()
      .material()
      .source(a)
      .target(b)
      .build();
    const specificRel = model
      .binaryRelationBuilder()
      .material()
      .source(a)
      .target(b)
      .build();
    model
      .generalizationBuilder()
      .general(generalRel)
      .specific(specificRel)
      .build();

    expect(runOn(model.project!)).toEqual([]);
  });

  it('a generalization whose general was mutated to a class of another project does not crash', () => {
    const projectA = new Project();
    const modelA = projectA.packageBuilder().root().build();
    const projectB = new Project();
    const modelB = projectB.packageBuilder().root().build();

    const foreignKind = modelB.classBuilder().kind().build();
    const localKind = modelA.classBuilder().kind().build();
    const subkind = createSubkind(modelA);
    const gen = modelA
      .generalizationBuilder()
      .general(localKind)
      .specific(subkind)
      .build();
    gen.general = foreignKind; // cross-project reference, rejected by builders

    // The traversal follows the reference and finds the foreign kind, so no
    // identity issue is raised and nothing crashes.
    expect(runOn(projectA)).toEqual([]);
  });
});

describe('Adversarial: relations with irregular ends', () => {
  it('a relation end whose type was mutated to undefined does not crash a project run', () => {
    const model = createModel();
    const a = model.classBuilder().kind().build();
    const b = model.classBuilder().kind().build();
    const relation = model
      .binaryRelationBuilder()
      .material()
      .source(a)
      .target(b)
      .build();
    (relation.properties[0] as any).propertyType = undefined;

    expect(runOn(model.project!)).toEqual([]);
  });

  it('a relation end typed by a class of another project does not crash a project run', () => {
    const model = createModel();
    const a = model.classBuilder().kind().build();
    const b = model.classBuilder().kind().build();
    const relation = model
      .binaryRelationBuilder()
      .material()
      .source(a)
      .target(b)
      .build();

    const foreign = createModel().classBuilder().kind().build();
    (relation.properties[1] as any).propertyType = foreign;

    expect(runOn(model.project!)).toEqual([]);
  });

  it('an n-ary relation is not subject to binary-only rules and yields no issues', () => {
    const model = createModel();
    const a = model.classBuilder().kind().build();
    const b = model.classBuilder().kind().build();
    const c = model.classBuilder().kind().build();
    model.naryRelationBuilder().material().members(a, b, c).build();

    expect(runOn(model.project!)).toEqual([]);
  });
});

describe('Adversarial: repeated verification and state leakage', () => {
  it('running the same service twice yields the same issues, without duplication', () => {
    const model = createModel();
    createSubkind(model); // missing identity provider
    model.classBuilder().build(); // stereotype-less

    const service = new OntoumlVerification(model.project!);
    const first = service.run().result;
    const second = service.run().result;

    expect(first).toHaveLength(2);
    expect(second).toHaveLength(2);
    expect(codesOf(second).sort()).toEqual(codesOf(first).sort());
    expect(service.issues).toBe(second);
  });

  it('independent services over the same project agree', () => {
    const model = createModel();
    createSubkind(model);

    const first = new OntoumlVerification(model.project!).run().result;
    const second = new OntoumlVerification(model.project!).run().result;

    expect(codesOf(first)).toEqual(codesOf(second));
  });

  it('static verification does not mutate the verified model', () => {
    const model = createModel();
    const kind = model.classBuilder().kind().build();
    const subkind = createSubkind(model);
    model.generalizationBuilder().general(kind).specific(subkind).build();

    const before = JSON.stringify(model.project);
    OntoumlVerification.verify(model.project!);
    expect(JSON.stringify(model.project)).toBe(before);
  });
});
