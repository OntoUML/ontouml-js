/**
 * Transforms an OntoUML model into a model ready for final transformation and its 
 * corresponding into a relational schema.
 * 
 * The one table per kind approach is used; all non-sortals are flattened to kinds, 
 * and sortals lifted to kinds.
 * 
 * Author: João Paulo A. Almeida; Gustavo L. Guidoni
 */
import { IStrategy } from "../IStrategy";
import { IGraph } from '@libs/ontouml2db/graph/IGraph';
import { Flatten } from './Flatten';
import { Lifting } from './Lifting';

export class OneTablePerKind implements IStrategy{

    run(graph: IGraph): void {
        
        Flatten.doFlattening(graph);
		
		Lifting.doLifting(graph);
    }

}