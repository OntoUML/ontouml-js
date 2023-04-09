import { Ontouml2Alloy } from '@libs/ontouml2alloy/index';
import { generateAlloy, generateFact, generateWorldAttribute, generateWorldFact } from '__tests__/libs/ontouml2alloy/helpers';
import { Package, Project } from '@libs/ontouml';

describe('Original name is kept when there are no forbidden characters' , () => {

    // it('Person -> Person', () => {
    //     const normalized = normalizeName('Person');
    //     expect(normalized).toBe('Person');
    //   });
    
    //   it('PERSON -> PERSON', () => {
    //     const normalized = normalizeName('PERSON');
    //     expect(normalized).toBe('PERSON');
    //   });
    
    //   it('person -> person', () => {
    //     const normalized = normalizeName('person');
    //     expect(normalized).toBe('person');
    //   });
    
    //   it('PeRsoN -> PeRsoN', () => {
    //     const normalized = normalizeName('PeRsoN');
    //     expect(normalized).toBe('PeRsoN');
    //   });

})