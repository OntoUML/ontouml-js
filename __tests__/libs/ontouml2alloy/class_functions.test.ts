import { Ontouml2Alloy } from '@libs/ontouml2alloy/index';
import { generateAlloy, generateFact, generateWorldFieldForClass, generateWorldFact } from './helpers';
import { Class, ClassStereotype, Relation, Package, Project, Property, OntoumlType, AggregationKind, stereotypeUtils, OntologicalNature} from '@libs/ontouml';

describe('Class Functions', () => {

    describe('transformClass function', () => {
        let project: Project;
        let model: Package;
        let transformer: Ontouml2Alloy;

        beforeEach(() => {
        project = new Project();
        model = project.createModel();
      });

    it('should ignore classes if they are an <<event>>', () => {
        model.createEvent('Birthday');
        expect(generateAlloy(model)).not.toContain('Birthday');
    });

    it('should ignore classes if they are a <<situation>>', () => {
        model.createSituation('Hazard')
        expect(generateAlloy(model)).not.toContain('Hazard');
    });

    it('should ignore classes if they are a <<type>>', () => {
        model.createType('PaymentMethod')
        expect(generateAlloy(model)).not.toContain('PaymentMethod');
    })
      
    it('should transform <<datatype>> class with attributes (complex datatype)', () => {
        const _number = model.createDatatype('Number');
        const complexDatatype = model.createDatatype('Date');
        complexDatatype.createAttribute(_number, 'day');

        const result = generateAlloy(model);
        const factLines = ['Datatype = Number+Date','disjoint[Number,Date]'];

        expect(result).toContain('sig Date in Datatype {\n        day: set Number\n}');        
        expect(result).toContain(generateFact('additionalDatatypeFacts',factLines));
    });

    it('should transform <<datatype>> class without attributes (primitive datatype)', () => {
        model.createDatatype('Date');
        const result = generateAlloy(model);
        expect(result).toContain('sig Date in Datatype {');
        expect(result).toContain(generateFact('additionalDatatypeFacts',['Datatype = Date']))
    });

    it('should transform <<enumeration>> class with attributes', () => {
        const status = model.createEnumeration('Status');
        status.createLiteral('Active');
        status.createLiteral('Inactive');

        const result = generateAlloy(model)
        expect(result).toContain('enum Status {\n        Active, Inactive}')
    });

    it('should transform <<kind>> class', () => {
        const person = model.createKind('Person');
        const result = generateAlloy(model);
        expect(result).toContain(generateFact('rigid',['rigidity[Person,Object,exists]']));
        expect(result).toContain(generateWorldFieldForClass('Person','Object'));
        expect(result).toContain(generateWorldFact('Person','Object'));
    });  

    it('should transform <<collective>> class', () => {
        model.createCollective('Group', false);
        const result = generateAlloy(model);
        expect(result).toContain(generateWorldFieldForClass('Group','Object'))
        expect(result).toContain(generateWorldFact('Group','Object'));
        expect(result).toContain(generateFact('rigid',['rigidity[Group,Object,exists]']));
    });

    //change member -> same thing -> isExtensional - false

    // it('should generate fact to handle {isExtensional = True} for transforming <<collective>> class', () => {
    //     model.createCollective('FixedGroup', true);
    //     const result = generateAlloy(model);
        
    // }); //TODO

    
    // it('should generate fact to handle {isExtensional = False} for transforming <<collective>> class', () => {
    //     model.createCollective('FixedGroup', true);
    //     const result = generateAlloy(model);
        
    // });

    it('should transform «quantity» class', () => {
        model.createQuantity('Wine');
        const result = generateAlloy(model);
 
        expect(result).toContain(generateFact('rigid',['rigidity[Wine,Object,exists]']));
        expect(result).toContain(generateWorldFieldForClass('Wine','Object'));
        expect(result).toContain(generateWorldFact('Wine','Object'));
    });

    it('should transform <<quality>> class', () => {
      model.createQuality('Strong');
      const result = generateAlloy(model);

      expect(result).toContain(generateFact('rigid',['rigidity[Strong,Aspect,exists]']));
      expect(result).toContain(generateWorldFieldForClass('Strong','Aspect'));
      expect(result).toContain(generateWorldFact('Strong','Aspect'));

    });

    it('should transform «relator» class', () => {
        model.createRelator('Marriage');
        const result = generateAlloy(model);

        expect(result).toContain(generateFact('rigid',['rigidity[Marriage,Aspect,exists]']));
        expect(result).toContain(generateWorldFieldForClass('Marriage','Aspect'));
        expect(result).toContain(generateWorldFact('Marriage','Aspect'));
      });

    it('should transform «role» class', () => {
        model.createRole('Student');
        const result = generateAlloy(model);

        expect(result).toContain(generateFact('antirigid',['antirigidity[Student,Object,exists]']));
        expect(result).toContain(generateWorldFieldForClass('Student','Object'));
        expect(result).toContain(generateWorldFact('Student','Object'));
      });

      it('should transform «phase» class', () => {
        model.createPhase('Child');
        const result = generateAlloy(model);

        expect(result).toContain(generateFact('antirigid',['antirigidity[Child,Object,exists]']));
        expect(result).toContain(generateWorldFieldForClass('Child','Object'));
        expect(result).toContain(generateWorldFact('Child','Object'));
      });

      it('should transform «abstract» class', () => {
        let temp = model.createAbstract('Goal');
        const _number = model.createDatatype('Date');
        temp.createAttribute(_number, 'until');
        
        const result = generateAlloy(model);

        const factLines = ['Datatype = Goal+Date','disjoint[Goal,Date]'];
        expect(result).toContain('sig Goal in Datatype {\n        until: set Date\n}');        
        expect(result).toContain(generateFact('additionalDatatypeFacts',factLines));
      }); 

      it('should transform «mode» class { allowed=[intrinsic-mode] }', () => {
        model.createIntrinsicMode('Skill');
        const result = generateAlloy(model);

        expect(result).toContain(generateFact('rigid',['rigidity[Skill,Aspect,exists]']));
        expect(result).toContain(generateWorldFieldForClass('Skill','Aspect'));
        expect(result).toContain(generateWorldFact('Skill','Aspect'));
      });
    
      it('should transform «mode» class { allowed=[extrinsic-mode] }', () => {
        model.createExtrinsicMode('Love');
        const result = generateAlloy(model);

        expect(result).toContain(generateFact('rigid',['rigidity[Love,Aspect,exists]']));
        expect(result).toContain(generateWorldFieldForClass('Love','Aspect'));
        expect(result).toContain(generateWorldFact('Love','Aspect'));
      });
    
      it('should transform «mode» class { allowed=[intrinsic-mode, extrinsic-mode] }', () => {
        // const _class = OntoumlFactory.createMode('Belief');
        model.createClass('Belief', ClassStereotype.MODE, [OntologicalNature.intrinsic_mode, OntologicalNature.extrinsic_mode]);
        const result = generateAlloy(model);

        expect(result).toContain(generateFact('rigid',['rigidity[Belief,Aspect,exists]']));
        expect(result).toContain(generateWorldFieldForClass('Belief','Aspect'));
        expect(result).toContain(generateWorldFact('Belief','Aspect'));
      });

      //role is for dynamic types, we instantiate by individuals of a single type..
      //role antirigid sortal, rolemixin antirigid sortal

      //there is no difference between the transformation of a role and a roleMixin
      it('should transform «roleMixin» class', () => {
        model.createRoleMixin('Customer',);
        const result = generateAlloy(model);
        
        expect(result).toContain(generateFact('antirigid',['antirigidity[Customer,Object,exists]']));
        expect(result).toContain(generateWorldFieldForClass('Customer','Object'));
        expect(result).toContain(generateWorldFact('Customer','Object'));
      });
    
      //there is no difference between the transformation of a phase and a phaseMixin
      it('should transform «phaseMixin» class', () => {
        model.createPhaseMixin('Infant');
        const result = generateAlloy(model);
        
        expect(result).toContain(generateFact('antirigid',['antirigidity[Infant,Object,exists]']));
        expect(result).toContain(generateWorldFieldForClass('Infant','Object'));
        expect(result).toContain(generateWorldFact('Infant','Object'));
      });

      it('should transform «category» class', () => {
        model.createCategory('Animal');
        const result = generateAlloy(model);

        expect(result).toContain(generateFact('rigid',['rigidity[Animal,Object,exists]']));
        expect(result).toContain(generateWorldFieldForClass('Animal','Object'));
        expect(result).toContain(generateWorldFact('Animal','Object'));
      });

      //TODO figure out how to handle mixins    
      // it('should transform «mixin» class', () => {
      //   model.createMixin('Seatable');
      //   const result = generateAlloy(model);
    
      //   expect(result).toContain('');
      // });


    });
});

  