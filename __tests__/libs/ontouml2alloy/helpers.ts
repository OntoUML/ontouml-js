import { Package, Project } from '@libs/ontouml';
import { Ontouml2Alloy } from '@libs/ontouml2alloy/index';
import { String } from 'lodash';

//returns the main module of a generated Alloy transformation
export function generateAlloy(modelOrProject: Package | Project): string {

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

  //TODO check if functions are always like this
  export function generateFun(funName: string, entityType: string, expression: string): string {
    let result = `fun ${funName} [x: World.${entityType}, w: World] : set World.${entityType} {\n`;
    result += `        ${expression}\n`;
    result += '}\n\n';
    return result;
  }  
  

export function generateWorldAttribute(className: string, classNature: string): string{
    return className + ': set exists:>' + classNature;
}

export function generateWorldFact(className: string, classNature: string): string{
    return '{\n        exists:>' + classNature + ' in ' + className + '\n}';
} 

export function generateWorldFacts(factLines: string[]): string{
  let result = '{\n';
  for (const line of factLines){
    result += `        ${line}\n`;
  }
  return result;

}

