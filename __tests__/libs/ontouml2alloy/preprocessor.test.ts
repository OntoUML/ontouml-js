import { Class, ClassStereotype, Package, Project, RelationStereotype, OntologicalNature, natureUtils } from '@libs/ontouml';
import { Ontouml2AlloyPreprocessor } from '@libs/ontouml2alloy/preprocessor';
import { ServiceIssueSeverity } from '@libs/service_issue_severity';

function createModel(): Package {
  const project = new Project();
  return project.createModel();
}

describe('preprocessor', () => {
  let model: Package;
  let preprocessor: Ontouml2AlloyPreprocessor;

  beforeEach(() => {
    model = createModel();
    preprocessor = new Ontouml2AlloyPreprocessor(model);
  });

  describe('run', () => {
    it('rejects models with unknown class stereotypes', () => {
      const person = model.createKind('Person');
      (person as any).stereotype = 'unknown stereotype name';

      const { ok, issues } = preprocessor.run();

      expect(ok).toBe(false);
      expect(issues).toHaveLength(1);
      expect(issues[0].severity).toBe(ServiceIssueSeverity.ERROR);
      expect(issues[0].code).toBe('UNKNOWN_CLASS_STEREOTYPE');
    });

    it('rejects models with classes without stereotype', () => {
      const person = model.createKind('Person');
      (person as any).stereotype = null;

      const { ok, issues } = preprocessor.run();

      expect(ok).toBe(false);
      expect(issues).toHaveLength(1);
      expect(issues[0].severity).toBe(ServiceIssueSeverity.ERROR);
      expect(issues[0].code).toBe('UNKNOWN_CLASS_STEREOTYPE');
    });

    it('succeeds and preprocesses a valid model without issues', () => {
      model.createKind('Person');

      const { ok, issues } = preprocessor.run();

      expect(ok).toBe(true);
      expect(issues).toHaveLength(0);
    });

    it('applies defaults before removeUnsupportedElements, remapping <<abstract>> so the class survives', () => {
      const goal = model.createAbstract('Goal');
      const number = model.createDatatype('Number');
      goal.createAttribute(number, 'priority');

      const { ok } = preprocessor.run();

      expect(ok).toBe(true);
      expect(goal.stereotype).toBe(ClassStereotype.DATATYPE);
      expect(model.getAllClasses().map(c => c.getName())).toContain('Goal');
    });
  });

  describe('validate', () => {
    it('accepts all standard OntoUML class stereotypes', () => {
      model.createKind('Person');
      model.createSubkind('Man');
      model.createRole('Student');
      model.createPhase('Child');
      model.createCategory('Agent');
      model.createMixin('Seatable');
      model.createRoleMixin('Customer');
      model.createPhaseMixin('Infant');
      model.createRelator('Employment');
      model.createQuality('Strong');
      model.createIntrinsicMode('Skill');
      model.createExtrinsicMode('Love');
      model.createCollective('Group', false);
      model.createQuantity('Wine');
      model.createDatatype('Number');
      model.createEnumeration('Colour');
      model.createEvent('Birthday');
      model.createSituation('Hazard');
      model.createType('PaymentMethod');
      model.createAbstract('Goal');

      const errors = preprocessor.validate();

      expect(errors).toHaveLength(0);
    });

    it('rejects a class with a null stereotype', () => {
      const broken = model.createKind('Broken');
      (broken as any).stereotype = null;

      const errors = preprocessor.validate();

      expect(errors).toHaveLength(1);
      expect(errors[0].code).toBe('UNKNOWN_CLASS_STEREOTYPE');
      expect(errors[0].description).toContain('Broken');
    });

    it('rejects a class with an unknown stereotype string', () => {
      const person = model.createKind('Person');
      (person as any).stereotype = 'madeUpStereotype';

      const errors = preprocessor.validate();

      expect(errors).toHaveLength(1);
      expect(errors[0].description).toContain('madeUpStereotype');
    });
  });

  describe('hasUnsupportedStereotype', () => {
    it('treats null as unsupported', () => {
      expect(preprocessor.hasUnsupportedStereotype(null)).toBe(true);
    });

    it('treats <<event>> as unsupported', () => {
      const event = model.createEvent('Birthday');
      expect(preprocessor.hasUnsupportedStereotype(event)).toBe(true);
    });

    it('treats <<situation>> as unsupported', () => {
      const event = model.createSituation('Hazard');
      expect(preprocessor.hasUnsupportedStereotype(event)).toBe(true);
    });

    it('treats <<type>> as unsupported', () => {
      const event = model.createType('PaymentMethod');
      expect(preprocessor.hasUnsupportedStereotype(event)).toBe(true);
    });

    it('treats <<kind>> as supported', () => {
      const person = model.createKind('Person');
      expect(preprocessor.hasUnsupportedStereotype(person)).toBe(false);
    });

    it('treats <<datatype>> as supported', () => {
      const text = model.createDatatype('Text');
      expect(preprocessor.hasUnsupportedStereotype(text)).toBe(false);
    });
  });

  describe('applyDefaults', () => {
    describe('abstract-to-datatype remapping', () => {
      it('remaps <<abstract>> stereotype to <<datatype>>', () => {
        const goal = model.createAbstract('Goal');

        preprocessor.applyDefaults();

        expect(goal.stereotype).toBe(ClassStereotype.DATATYPE);
      });

      it('preserves attributes after remapping', () => {
        const goal = model.createAbstract('Goal');
        const number = model.createDatatype('Number');
        goal.createAttribute(number, 'priority');

        preprocessor.applyDefaults();

        expect(goal.properties).toHaveLength(1);
        expect(goal.properties[0].getName()).toBe('priority');
      });

      it('does not touch non-abstract stereotypes', () => {
        const person = model.createKind('Person');

        preprocessor.applyDefaults();

        expect(person.stereotype).toBe(ClassStereotype.KIND);
      });
    });

    describe('missing restrictedTo defaulting', () => {
      it('endurant with undefined restrictedTo gets defaulted to all endurant natures to include the class in the transformation', () => {
        const kind = model.createKind('Person');
        kind.restrictedTo = [];

        preprocessor.applyDefaults();

        expect(kind.restrictedTo).toEqual(expect.arrayContaining(natureUtils.EndurantNatures));
      });

      it('emits a warning when defaulting restrictedTo', () => {
        const kind = model.createKind('Person');
        kind.restrictedTo = [];

        preprocessor.applyDefaults();

        expect(preprocessor.issues).toHaveLength(1);
        expect(preprocessor.issues[0].code).toBe('MISSING_VALUE_DEFAULTED');
        expect(preprocessor.issues[0].severity).toBe(ServiceIssueSeverity.WARNING);
        expect(preprocessor.issues[0].description).toContain('Person');
      });

      it('does not default restrictedTo for datatypes', () => {
        const datatype = model.createDatatype('Text');
        datatype.restrictedTo = [];

        preprocessor.applyDefaults();

        expect(datatype.restrictedTo).toEqual([]);
        expect(preprocessor.issues).toHaveLength(0);
      });

      it('does not default restrictedTo for enumerations', () => {
        const enumeration = model.createEnumeration('Colour');
        enumeration.restrictedTo = [];

        preprocessor.applyDefaults();

        expect(enumeration.restrictedTo).toEqual([]);
      });

      it('does not default restrictedTo for event', () => {
        const event = model.createEvent('Birthday');
        event.restrictedTo = [];

        preprocessor.applyDefaults();

        expect(event.restrictedTo).toEqual([]);
      });

      it('does not default restrictedTo for situation', () => {
        const situation = model.createSituation('Hazard');
        situation.restrictedTo = [];

        preprocessor.applyDefaults();

        expect(situation.restrictedTo).toEqual([]);
      });

      it('does not default restrictedTo for type', () => {
        const type = model.createType('PaymentMethod');
        type.restrictedTo = [];

        preprocessor.applyDefaults();

        expect(type.restrictedTo).toEqual([]);
      });

      it('does not overwrite existing restrictedTo', () => {
        const person = model.createKind('Person');
        const original = [OntologicalNature.functional_complex];
        person.restrictedTo = [...original];

        preprocessor.applyDefaults();

        expect(person.restrictedTo).toEqual(original);
        expect(preprocessor.issues).toHaveLength(0);
      });
    });
  });

  describe('removeUnsupportedElements', () => {
    describe('empty enumerations', () => {
      it('removes enumeration classes with no literals and emits UNSUPPORTED_ELEMENT_REMOVED', () => {
        const status = model.createEnumeration('Status');
        status.literals = [];

        preprocessor.removeUnsupportedElements();

        expect(model.getAllClasses().map(c => c.getName())).not.toContain('Status');
        const issue = preprocessor.issues.find(i => i.id === status.id);
        expect(issue).toBeDefined();
        expect(issue.code).toBe('UNSUPPORTED_ELEMENT_REMOVED');
      });

      it('removes attributes whose propertyType was an empty enumeration removed earlier in preprocessing', () => {
        const person = model.createKind('Person');
        const status = model.createEnumeration('Status');
        status.literals = [];
        const attr = person.createAttribute(status, 'status');

        preprocessor.removeUnsupportedElements();

        expect(person.properties.map(p => p.getName())).not.toContain('status');
        const issue = preprocessor.issues.find(i => i.id === attr.id);
        expect(issue).toBeDefined();
        expect(issue.code).toBe('UNSUPPORTED_ELEMENT_REMOVED');
      });
    });

    describe('unsupported stereotypes', () => {
      it('removes <<event>> classes from the model', () => {
        model.createEvent('Birthday');
        model.createKind('Person');

        expect(model.getAllClasses()).toHaveLength(2);

        preprocessor.removeUnsupportedElements();

        const names = model.getAllClasses().map(c => c.getName());
        expect(names).not.toContain('Birthday');
        expect(names).toContain('Person');
      });

      it('removes <<situation>> classes from the model', () => {
        model.createSituation('Hazard');

        expect(model.getAllClasses().map(c => c.getName())).toContain('Hazard');

        preprocessor.removeUnsupportedElements();

        expect(model.getAllClasses().map(c => c.getName())).not.toContain('Hazard');
      });

      it('removes <<type>> classes from the model', () => {
        model.createType('PaymentMethod');

        expect(model.getAllClasses().map(c => c.getName())).toContain('PaymentMethod');

        preprocessor.removeUnsupportedElements();

        expect(model.getAllClasses().map(c => c.getName())).not.toContain('PaymentMethod');
      });

      it('leaves supported class untouched when removing unsupported class', () => {
        model.createEvent('Birthday');
        model.createKind('Person');

        expect(model.getAllClasses()).toHaveLength(2);

        preprocessor.removeUnsupportedElements();

        const names = model.getAllClasses().map(c => c.getName());
        expect(names).not.toContain('Birthday');
        expect(names).toContain('Person');
      });

      it('emits a removal issue when removing a class', () => {
        const birthday = model.createEvent('Birthday');

        preprocessor.removeUnsupportedElements();

        const issue = preprocessor.issues.find(i => i.id === birthday.id);
        expect(issue).toBeDefined();
        expect(issue.code).toBe('UNSUPPORTED_ELEMENT_REMOVED');
      });

      it('emits one removal issue for each removed class', () => {
        const birthday = model.createEvent('Birthday');
        const hazard = model.createSituation('Hazard');

        preprocessor.removeUnsupportedElements();

        expect(preprocessor.issues.length).toBe(2);
        const eventIssue = preprocessor.issues.find(i => i.id === birthday.id);
        expect(eventIssue).toBeDefined();

        const situationIssue = preprocessor.issues.find(i => i.id === hazard.id);
        expect(situationIssue).toBeDefined();
      });

      it('removes attributes of unsupported classes', () => {
        const ceremony = model.createEvent('Ceremony');
        const text = model.createDatatype('Text');
        const venue = ceremony.createAttribute(text, 'venue');

        preprocessor.removeUnsupportedElements();

        expect(preprocessor.issues.map(i => i.id)).toContain(venue.id);
      });
    });

    describe('restricted to non-endurant natures', () => {
      it('removes classes restricted only to non-endurant natures', () => {
        const onlyEvents = model.createClass('OnlyEvents', ClassStereotype.MIXIN, [OntologicalNature.event]);

        expect(model.getAllClasses().map(c => c.getName())).toContain('OnlyEvents');

        preprocessor.removeUnsupportedElements();

        expect(model.getAllClasses().map(c => c.getName())).not.toContain('OnlyEvents');
        expect(preprocessor.issues.map(i => i.id)).toContain(onlyEvents.id);
      });

      it('removes attributes of classes restricted only to non-endurant natures', () => {
        const onlyEvents = model.createClass('OnlyEvents', ClassStereotype.MIXIN, [OntologicalNature.event]);
        const text = model.createDatatype('Text');
        const label = onlyEvents.createAttribute(text, 'label');

        expect(onlyEvents.properties.map(p => p.getName())).toContain('label');

        preprocessor.removeUnsupportedElements();

        expect(onlyEvents.properties.map(p => p.getName())).not.toContain('label');
        expect(preprocessor.issues.map(i => i.id)).toContain(label.id);
      });

      it('retains datatypes regardless of restrictedTo', () => {
        const text = model.createDatatype('Text');
        text.restrictedTo = [OntologicalNature.event];

        expect(model.getAllClasses().map(c => c.getName())).toContain('Text');

        preprocessor.removeUnsupportedElements();

        expect(model.getAllClasses().map(c => c.getName())).toContain('Text');
      });

      it('retains enumerations regardless of restrictedTo', () => {
        const colour = model.createEnumeration('Colour');
        colour.restrictedTo = [OntologicalNature.event];
        colour.createLiteral('red');

        expect(model.getAllClasses().map(c => c.getName())).toContain('Colour');

        preprocessor.removeUnsupportedElements();

        expect(model.getAllClasses().map(c => c.getName())).toContain('Colour');
      });
    });

    describe('attributes with unsupported propertyType', () => {
      it('does not remove attributes whose propertyType is defined and supported', () => {
        const person = model.createKind('Person');
        const text = model.createDatatype('Text');
        person.createAttribute(text, 'name');

        expect(person.properties.map(p => p.getName())).toContain('name');

        preprocessor.removeUnsupportedElements();

        expect(person.properties.map(p => p.getName())).toContain('name');
      });

      it('removes attributes whose propertyType is undefined', () => {
        const person = model.createKind('Person');
        const untypedAttribute = person.createAttribute(null, 'broken');

        expect(person.properties.map(p => p.getName())).toContain('broken');

        preprocessor.removeUnsupportedElements();

        expect(person.properties.map(p => p.getName())).not.toContain('broken');
        expect(preprocessor.issues.map(i => i.id)).toContain(untypedAttribute.id);
      });

      it('removes attributes whose propertyType has an unsupported stereotype', () => {
        const person = model.createKind('Person');
        const occasion = model.createEvent('Occasion');
        const trigger = person.createAttribute(occasion, 'trigger');

        expect(person.properties.map(p => p.getName())).toContain('trigger');

        preprocessor.removeUnsupportedElements();

        expect(person.properties.map(p => p.getName())).not.toContain('trigger');
        expect(preprocessor.issues.map(i => i.id)).toContain(trigger.id);
      });

      it('removes datatype attributes with non-enum or datatype property type and emits UNSUPPORTED_ELEMENT_REMOVED', () => {
        const measurement = model.createDatatype('Measurement');
        const quality = model.createKind('Person');
        const by = measurement.createAttribute(quality, 'by');

        expect(measurement.properties.map(p => p.getName())).toContain('by');

        preprocessor.removeUnsupportedElements();

        expect(measurement.properties.map(p => p.getName())).not.toContain('by');
        const issue = preprocessor.issues.find(i => i.id === by.id);
        expect(issue).toBeDefined();
        expect(issue.code).toBe('UNSUPPORTED_ELEMENT_REMOVED');
      });
    });

    describe('non-binary relations', () => {
      it('removes ternary relations', () => {
        const person = model.createKind('Person');
        const organization = model.createKind('Organization');
        const contract = model.createKind('Contract');
        const ternaryRelation = model.createTernaryRelation([person, organization, contract], 'signsContractWith');

        expect(model.getAllRelations().map(r => r.getName())).toContain('signsContractWith');

        preprocessor.removeUnsupportedElements();

        expect(model.getAllRelations().map(r => r.getName())).not.toContain('signsContractWith');
        expect(preprocessor.issues.map(i => i.id)).toContain(ternaryRelation.id);
      });

      it('includes member names in the removal description', () => {
        const person = model.createKind('Person');
        const organization = model.createKind('Organization');
        const contract = model.createKind('Contract');
        model.createTernaryRelation([person, organization, contract], 'signsContractWith');

        preprocessor.removeUnsupportedElements();

        const issue = preprocessor.issues.find(i => i.description.includes('non-binary'));
        expect(issue.description).toContain('signsContractWith');
        expect(issue.description).toContain('Person');
        expect(issue.description).toContain('Organization');
        expect(issue.description).toContain('Contract');
      });
    });

    describe('relations connected to unsupported classes', () => {
      it('removes a relation whose source is an unsupported class', () => {
        const ceremony = model.createEvent('Ceremony');
        const person = model.createKind('Person');
        const attends = model.createMaterialRelation(ceremony, person, 'attends');

        expect(model.getAllRelations().map(r => r.getName())).toContain('attends');

        preprocessor.removeUnsupportedElements();

        expect(model.getAllRelations().map(r => r.getName())).not.toContain('attends');
        expect(preprocessor.issues.map(i => i.id)).toContain(attends.id);
      });

      it('removes a relation whose target is an unsupported class', () => {
        const person = model.createKind('Person');
        const ceremony = model.createEvent('Ceremony');
        const attends = model.createMaterialRelation(person, ceremony, 'attends');

        expect(model.getAllRelations().map(r => r.getName())).toContain('attends');

        preprocessor.removeUnsupportedElements();

        expect(model.getAllRelations().map(r => r.getName())).not.toContain('attends');
        expect(preprocessor.issues.map(i => i.id)).toContain(attends.id);
      });
    });

    describe('invalid derivation relations', () => {
      it('removes a derivation-stereotyped relation that is structurally invalid', () => {
        const person = model.createKind('Person');
        const organization = model.createKind('Organization');
        const invalidDerivationRelation = model.createBinaryRelation(
          person,
          organization,
          'worksFor',
          RelationStereotype.DERIVATION
        );

        expect(model.getAllRelations().map(r => r.getName())).toContain('worksFor');

        preprocessor.removeUnsupportedElements();

        expect(model.getAllRelations().map(r => r.getName())).not.toContain('worksFor');
        expect(preprocessor.issues.map(i => i.id)).toContain(invalidDerivationRelation.id);
      });

      it('retains a structurally valid derivation relation', () => {
        const person = model.createKind('Person');
        const organization = model.createKind('Organization');
        const worksFor = model.createMaterialRelation(person, organization, 'worksFor');
        const employment = model.createRelator('Employment');
        model.createDerivationRelation(worksFor, employment, 'derivation');

        expect(model.getAllRelations()).toHaveLength(2);

        preprocessor.removeUnsupportedElements();

        expect(model.getAllRelations().map(r => r.getName())).toContain('derivation');
      });
    });

    describe('generalizations with missing elements', () => {
      it('removes a generalization whose specific is null', () => {
        const animal = model.createKind('Animal');
        const dog = model.createKind('Dog');
        const generalization = model.createGeneralization(animal, dog);
        generalization.specific = null;

        expect(model.getAllGeneralizations()).toHaveLength(1);

        preprocessor.removeUnsupportedElements();

        expect(model.getAllGeneralizations()).toHaveLength(0);
        expect(preprocessor.issues.map(i => i.id)).toContain(generalization.id);
      });

      it('removes a generalization whose general is null', () => {
        const dog = model.createKind('Dog');
        const generalization = model.createGeneralization(model.createKind('Animal'), dog);
        generalization.general = null;

        expect(model.getAllGeneralizations()).toHaveLength(1);

        preprocessor.removeUnsupportedElements();

        expect(model.getAllGeneralizations()).toHaveLength(0);
        expect(preprocessor.issues.map(i => i.id)).toContain(generalization.id);
      });
    });

    describe('generalizations with unsupported elements', () => {
      it('removes a generalization whose specific is unsupported', () => {
        const person = model.createKind('Person');
        const birth = model.createEvent('Birth');
        const generalization = model.createGeneralization(person, birth);

        expect(model.getAllGeneralizations()).toHaveLength(1);

        preprocessor.removeUnsupportedElements();

        expect(model.getAllGeneralizations()).toHaveLength(0);
        expect(preprocessor.issues.map(i => i.id)).toContain(generalization.id);
      });

      it('removes a generalization whose general is unsupported', () => {
        const hazard = model.createSituation('Hazard');
        const virus = model.createKind('Virus');
        const generalization = model.createGeneralization(hazard, virus);

        expect(model.getAllGeneralizations()).toHaveLength(1);

        preprocessor.removeUnsupportedElements();

        expect(model.getAllGeneralizations()).toHaveLength(0);
        expect(preprocessor.issues.map(i => i.id)).toContain(generalization.id);
      });
    });

    describe('cascading removal of "dead" relations', () => {
      it('removes a relation whose source class was removed', () => {
        const ghost = model.createKind('Ghost');
        ghost.restrictedTo = [OntologicalNature.event];
        const person = model.createKind('Person');
        person.restrictedTo = [OntologicalNature.functional_complex];
        const haunts = model.createMaterialRelation(ghost, person, 'haunts');

        expect(model.getAllRelations()).toHaveLength(1);

        preprocessor.removeUnsupportedElements();

        expect(model.getAllRelations()).toHaveLength(0);
        expect(preprocessor.issues.map(i => i.id)).toContain(haunts.id);
      });
    });

    describe('generalization sets', () => {
      it('removes a generalization set with a missing generalizations array', () => {
        const animal = model.createKind('Animal');
        const dog = model.createKind('Dog');
        const generalization = model.createGeneralization(animal, dog);
        const generalizationSet = model.createGeneralizationSet([generalization], false, false);
        (generalizationSet as any).generalizations = null;

        expect(model.getAllGeneralizationSets()).toHaveLength(1);

        preprocessor.removeUnsupportedElements();

        expect(model.getAllGeneralizationSets()).toHaveLength(0);
        expect(preprocessor.issues.map(i => i.id)).toContain(generalizationSet.id);
      });

      it('removes a generalization set containing an unsupported specific', () => {
        const person = model.createKind('Person');
        const graduation = model.createEvent('Graduation');
        const generalization = model.createGeneralization(person, graduation);
        const generalizationSet = model.createGeneralizationSet([generalization], false, false);

        expect(model.getAllGeneralizationSets()).toHaveLength(1);

        preprocessor.removeUnsupportedElements();

        expect(model.getAllGeneralizationSets()).toHaveLength(0);
        expect(preprocessor.issues.map(i => i.id)).toContain(generalizationSet.id);
      });

      it('removes a generalization set containing an unsupported general', () => {
        const hazard = model.createSituation('Hazard');
        const virus = model.createKind('Virus');
        const generalization = model.createGeneralization(hazard, virus);
        const generalizationSet = model.createGeneralizationSet([generalization], false, false);

        expect(model.getAllGeneralizationSets()).toHaveLength(1);

        preprocessor.removeUnsupportedElements();

        expect(model.getAllGeneralizationSets()).toHaveLength(0);
        expect(preprocessor.issues.map(i => i.id)).toContain(generalizationSet.id);
      });

      it('retains a generalization set with only supported elements', () => {
        const animal = model.createKind('Animal');
        const dog = model.createSubkind('Dog');
        const cat = model.createSubkind('Cat');
        const dogGeneralization = model.createGeneralization(animal, dog);
        const catGeneralization = model.createGeneralization(animal, cat);
        const generalizationSet = model.createGeneralizationSet([dogGeneralization, catGeneralization], true, false);

        expect(model.getAllGeneralizationSets()).toHaveLength(1);

        preprocessor.removeUnsupportedElements();

        expect(model.getAllGeneralizationSets()).toHaveLength(1);
        expect(preprocessor.issues).toHaveLength(0);
      });
    });
  });
});
