/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { OntoUML2DBOptions } from '@libs/ontouml2db/OntoUML2DBOptions';
import { GenerateOBDAMappingID } from '@libs/ontouml2db/obda/GenerateOBDAMappingID';
import { GenerateOBDATarget } from '@libs/ontouml2db/obda/GenerateOBDATarget';
import { GenerateOBDASource } from '@libs/ontouml2db/obda/GenerateOBDASource';
import { Tracker } from '@libs/ontouml2db/tracker/Tracker';
import { TracedNode } from '../tracker/TracedNode';

export class GenerateOBDA {
  static getFile(options: OntoUML2DBOptions, tracker: Tracker): string {
    let file: string;
    file = this.generatePrefixDeclaration(options);

    file += this.generateMappingDeclaration(options, tracker);

    return file;
  }

  static generatePrefixDeclaration(options: OntoUML2DBOptions): string {
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

  static generateMappingDeclaration(options: OntoUML2DBOptions, tracker: Tracker): string {
    let projectName: string = options.databaseName;
    let first: boolean;
    let text: string = '[MappingDeclaration] @collection [[\n\n';

    for (let trace of tracker.getTraceMap().values()) {
      first = true;
      trace.getTargetNodes().forEach((tracedNode: TracedNode) => {
        text += GenerateOBDAMappingID.generate(trace.getSourceNode(), projectName, first);

        text += GenerateOBDATarget.generate(trace.getSourceNode(), projectName, tracedNode);

        text += GenerateOBDASource.generate(trace, tracedNode);

        first = false;

        text += '\n';
      });
    }
    text += ']]\n';

    return text;
  }
}
