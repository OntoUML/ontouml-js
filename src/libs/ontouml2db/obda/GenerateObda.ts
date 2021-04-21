/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { Ontouml2DbOptions } from '@libs/ontouml2db/Ontouml2DbOptions';
import { GenerateObdaMappingId } from '@libs/ontouml2db/obda/GenerateObdaMappingId';
import { GenerateObdaTarget } from '@libs/ontouml2db/obda/GenerateObdaTarget';
import { GenerateObdaSource } from '@libs/ontouml2db/obda/GenerateObdaSource';
import { Tracker } from '@libs/ontouml2db/tracker/Tracker';
import { TracedNode } from '../tracker/TracedNode';

export class GenerateObda {
  static getFile(options: Ontouml2DbOptions, tracker: Tracker): string {
    let file: string;
    file = this.generatePrefixDeclaration(options);

    file += this.generateMappingDeclaration(options, tracker);

    return file;
  }

  static generatePrefixDeclaration(options: Ontouml2DbOptions): string {
    return (
      '[PrefixDeclaration]\n' +
      ':       ' +
      options.baseIri +
      '#\n' +
      'gufo:   http://purl.org/nemo/gufo#\n' +
      'rdf:    http://www.w3.org/1999/02/22-rdf-syntax-ns#\n' +
      'rdfs:   http://www.w3.org/2000/01/rdf-schema#\n' +
      'owl:    http://www.w3.org/2002/07/owl#\n' +
      'xsd:    http://www.w3.org/2001/XMLSchema#\n' +
      '\n'
    );
  }

  static generateMappingDeclaration(options: Ontouml2DbOptions, tracker: Tracker): string {
    let projectName: string = options.databaseName;
    let first: boolean;
    let text: string = '[MappingDeclaration] @collection [[\n\n';

    for (let trace of tracker.getTraceMap().values()) {
      first = true;
      trace.getTargetNodes().forEach((tracedNode: TracedNode) => {
        text += GenerateObdaMappingId.generate(trace.getSourceNode(), projectName, first);

        text += GenerateObdaTarget.generate(trace.getSourceNode(), projectName, tracedNode);

        text += GenerateObdaSource.generate(trace, tracedNode);

        first = false;

        text += '\n';
      });
    }
    text += ']]\n';

    return text;
  }
}
