import { Ontouml2Alloy } from '@libs/ontouml2alloy/index';
import { Class, OntoumlElement, Package, Project } from '@libs/ontouml';
import { normalizeName } from '@libs/ontouml2alloy/util';

describe('Original name is kept when there are no issues' , () => {

    let element: OntoumlElement;
    element = new Class();

    it('Person -> Person', () => {
        element.addName('Person');
        const normalized = normalizeName(element);
        expect(normalized).toBe('Person');
      });
    
      it('PERSON -> PERSON', () => {
        element.addName('PERSON');
        const normalized = normalizeName(element);
        expect(normalized).toBe('PERSON');
      });
    
      it('person -> person', () => {
        element.addName('person');
        const normalized = normalizeName(element);
        expect(normalized).toBe('person');
      });
    
      it('PeRsoN -> PeRsoN', () => {
        element.addName('PeRsoN');
        const normalized = normalizeName(element);
        expect(normalized).toBe('PeRsoN');
      });

})

describe("Names are normalized properly", () => {

    let element: OntoumlElement;
    element = new Class();

    // it('should normalize an empty name', () => {
    //     element.addName('');
    //     const normalized = normalizeName(element);
    //     expect(normalized).toBe('');
    // });

    const reservedKeywords = [
        'abstract', 'all', 'and', 'as', 'assert',
        'but', 'check', 'disj', 'else', 'exactly',
        'extends', 'fact', 'for', 'fun', 'iden',
        'iff', 'implies', 'in', 'Int', 'let',
        'lone', 'module', 'no', 'none', 'not',
        'one', 'open', 'or', 'pred', 'run',
        'set', 'sig', 'some', 'sum', 'univ'
    ];
    //normalization of reserved keywords: abstract -> _abstract
    reservedKeywords.forEach(keyword => {
        it(`should normalize the reserved keyword "${keyword}"`, () => {
            element.addName(keyword);
            const normalized = normalizeName(element);
            expect(normalized).toBe(`_${keyword}`); //what to do
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
            const normalized = normalizeName(element);
            expect(normalized).toBe('HappyPerson');
        });
    });

    

    it('should normalize a class with no name', () => {
        element.addName('');
        const normalized = normalizeName(element);
        expect(normalized).toBe('_unnamed'); //what to do
    });

    it('temp', () => {
        let project = new Project();
        let model = project.createModel();
        let ontouml2alloy = new Ontouml2Alloy(model);

        model.createKind('Person');
        model.createKind('Person');
        ontouml2alloy.transform();
        console.log(ontouml2alloy.getAliases());
        console.log(ontouml2alloy.facts);
    })

    // it('should add a class to a map to keep track of transformed classes', () => {
    //     const className = 'Person';
    //     element.addName(className);
    //     const normalized = normalizeName(element);
    // });

});
