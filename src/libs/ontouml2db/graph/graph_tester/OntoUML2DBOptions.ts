/**
 * 
 * Author: Gustavo Ludovico Guidoni
 */

import { IOntoUML2DBOptions } from '@libs/ontouml2db/IOntoUML2DBOptions';
import { StrategyType } from '@libs/ontouml2db/strategies/StrategyType';
import { DBMSType } from '@libs/ontouml2db/file_generation/DMBSType';

 export class OntoUML2DBOptions implements IOntoUML2DBOptions{

    strategyType: StrategyType;
    dbms: DBMSType;
    standardizeNames?: boolean;

 }