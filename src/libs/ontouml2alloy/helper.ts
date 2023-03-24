import { Package, Project } from '@libs/ontouml';
import { Ontouml2Alloy } from '@libs/ontouml2alloy/index';

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