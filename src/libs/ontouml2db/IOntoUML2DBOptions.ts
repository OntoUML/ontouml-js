/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { StrategyType } from './strategies/StrategyType';
import { DBMSType } from './file_generation/DMBSType';

export interface IOntoUML2DBOptions {
  strategyType: StrategyType;
  dbms: DBMSType;
  standardizeNames?: boolean;
}
