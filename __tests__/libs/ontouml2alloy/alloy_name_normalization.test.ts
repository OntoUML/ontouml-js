import { Ontouml2Alloy } from '@libs/ontouml2alloy/index';
import { Class, OntoumlElement, Package, Project } from '@libs/ontouml';
import { normalizeName } from '@libs/ontouml2alloy/util';
import { generateAlloy, generateFact, generateWorldAttribute, generateWorldFact } from './helpers';


describe('Name normalization' , () => {

    let element: OntoumlElement;
    element = new Class();
    let project: Project;
    let model: Package;
    let transformer: Ontouml2Alloy;

    beforeEach(() => {
    project = new Project();
    model = project.createModel();
    transformer = new Ontouml2Alloy(model);
    });
    
    describe('Original name is kept when there are no issues' , () => {
    
        it('Person -> Person', () => {
            element.addName('Person');
            const normalized = normalizeName(transformer, element);
            expect(normalized).toBe('Person');
          });
        
          it('PERSON -> PERSON', () => {
            element.addName('PERSON');
            const normalized = normalizeName(transformer, element);
            expect(normalized).toBe('PERSON');
          });
        
          it('person -> person', () => {
            element.addName('person');
            const normalized = normalizeName(transformer, element);
            expect(normalized).toBe('person');
          });
        
          it('PeRsoN -> PeRsoN', () => {
            element.addName('PeRsoN');
            const normalized = normalizeName(transformer, element);
            expect(normalized).toBe('PeRsoN');
          });
    
    })
    
    describe("Names are normalized properly", () => {
    
        const reservedKeywords = [
            'abstract', 'all', 'and', 'as', 'assert',
            'but', 'check', 'disj', 'else', 'exactly',
            'extends', 'fact', 'for', 'fun', 'iden',
            'iff', 'implies', 'in', 'Int', 'let',
            'lone', 'module', 'no', 'none', 'not',
            'one', 'open', 'or', 'pred', 'run',
            'set', 'sig', 'some', 'sum', 'univ'
        ];
        //normalization of reserved keywords: abstract -> abstract_set
        reservedKeywords.forEach(keyword => {
            it(`should normalize the reserved keyword "${keyword}"`, () => {
                element.addName(keyword);
                const normalized = normalizeName(transformer, element);
                expect(normalized).toBe(`${keyword}_set`);
            });
        });
    
        const forbiddenCharacters = [
            ' ', '!', '@', '#', '$', '%', '&',
            '*', '(', ')', '-', '+', '=', '{',
            '}', '[', ']', '|', '\\', ';', ':',
            ',', '.', '<', '>', '/', '?'
        ];
    
        forbiddenCharacters.forEach(char => {
            it(`should remove the forbidden character "${char}" from the name`, () => {
                element.addName(`Happy${char}Person`);
                const normalized = normalizeName(transformer, element);
                expect(normalized).toBe('HappyPerson');
            });
        });
    
        
        // it('should normalize a class with no name', () => {
        //     element.addName('');
        //     const normalized = normalizeName(transformer, element);
        //     expect(normalized).toBe('unnamed'); 
        // }); //what to do
    
        it('should normalize two classes with same name', () => {
            model.createKind('Person');
            model.createKind('Person');
            const result = generateAlloy(model);

            expect(result).toContain(generateFact('rigid',['rigidity[Person,Object,exists]']));
            expect(result).toContain(generateFact('rigid',['rigidity[Person1,Object,exists]']));
            expect(result).toContain(generateWorldAttribute('Person','Object'));
            expect(result).toContain(generateWorldAttribute('Person1','Object'));
            expect(result).toContain(generateWorldFact('Person+Person1','Object'));
        })
    
    });



}) 


