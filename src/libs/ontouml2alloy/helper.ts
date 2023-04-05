import { Package, Project } from '@libs/ontouml';
import { Ontouml2Alloy } from '@libs/ontouml2alloy/index';
import { String } from 'lodash';

//returns the main module of a generated Alloy transformation
export function generateAlloy(modelOrProject: Package | Project): string {
    // const optionsWithDefaults = {
    //   baseIri: 'https://example.com',
    //   format: 'N-Triple',
    //   ...options
    // };
    const ontouml2alloy = new Ontouml2Alloy(modelOrProject);
  
    ontouml2alloy.transform();
  
    return ontouml2alloy.getAlloyCode()[0];
  }

export function generateFact(factName: string, factLines: string[]): string {
    let result = `fact ${factName} {\n`;
    for (const line of factLines) {
      result += `        ${line}\n`;
    }
    result += '}';
    return result;
  }

export function generateWorldAttribute(className: string, classNature: string): string{
    let result = className + ': set exists:>' + classNature;
    return result;
}

export function generateWorldFact(className: string, classNature: string): string{
    let result = '{\n        exists:>' + classNature + ' in ' + className + '\n}';
    return result;
} //change for multiple
