import { Project, Class, RelationStereotype, Relation } from '@libs/ontouml';
import { Service } from '@libs/service';
import { ServiceIssue } from '@libs/service_issue';
import { RepRelOccurrence } from './reprel_occurrence';
import _, { noConflict } from 'lodash';

/**
 * A class designed to find occurrences of the RelOver antipattern in an OntoUML project.
 *
 * RelOver is described in the paper XYZ.
 *
 * @author Tiago Sales
 * @author Mattia Fumagalli
 * 
 */

export class RepRelFinder implements Service {
    project: Project;

    constructor(project: Project) {
        this.project = project;
    }

    run(): { result: RepRelOccurrence[]; issues?: ServiceIssue[] } {
        const relators = this.project.getClassesWithRelatorStereotype();
        const AntiPatternOccurrences: RepRelOccurrence[] = [];

        for (const relator of relators) {
            const FoundOccurrences = this.findOccurrence(relator);
            if (!_.isEmpty(FoundOccurrences)) AntiPatternOccurrences.push(FoundOccurrences);
        }
        return { result: AntiPatternOccurrences };
    }

    findOccurrence(relator: Class): RepRelOccurrence {
        const mediations = this.project
            .getAllRelationsByStereotype(RelationStereotype.MEDIATION)
            .filter(mediation => mediation.getSourceClass() === relator);

        const mediationProperties = mediations.map(mediation => mediation.getSourceEnd());
        const sourceCardinalities = mediationProperties.map(sourceCardinality => sourceCardinality.cardinality);
        const sourceCardinalitiesUpperBound = sourceCardinalities.map(upperBound => upperBound.getUpperBoundAsNumber());
        console.log(`checking sourceCardinalitiesUpperBound: `, sourceCardinalitiesUpperBound);

        if (mediations && mediations.length >= 2) {
            console.log(`mediations lenght: `, mediations.length);
            const mediationSourceCardinalities = sourceCardinalitiesUpperBound;
            const CardinalitiesCheck = mediationSourceCardinalities.filter(x => x > 0);
            console.log(`cardinalities check: `, CardinalitiesCheck);
            if (CardinalitiesCheck && CardinalitiesCheck.length > 2) return new RepRelOccurrence(relator, mediations);
        }
        return null
    }
}

