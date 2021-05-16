import { Class, GeneralizationSet, Generalization, Diagram, Project, ClassStereotype, Relation, ModelElement, RelationStereotype } from '@libs/ontouml';
import { Service } from '@libs/service';
import { ServiceIssue } from '@libs/service_issue';
import { Abstraction } from '@libs/abstraction';

/**
 * Class that implements the relation-based model clustering strategy proposed in:
 *
 * Guizzardi, G., Figueiredo, G., Hedblom, M.M. and Poels, G., 2019, May. Ontology-based model abstraction. 
 * In 2019 13th International Conference on Research Challenges in Information Science (RCIS) (pp. 1-13). IEEE.
 * https://ieeexplore.ieee.org/iel7/8868010/8876946/08876971.pdf
 *
 * @author Guylerme Figueiredo
 */

export class Abstractor implements Service {
    project: Project;

    constructor(project: Project, _options?: any) {
        this.project = project;

        if (_options) {
            console.log('Options ignored: this service does not support options');
        }
    }

    run(): { result: any; issues?: ServiceIssue[] } {
        let generatedDiagrams = this.buildAll();
        this.project.addDiagrams(generatedDiagrams);

        return {
            result: this.project,
            issues: null
        };
    }

    buildAll(): Diagram[] {
        const allRules = ["RelatorAbstraction", "NonSortalAbstraction", "SortalAbstraction", "SubkindAndPhasePartitionsAbstraction"]
        return allRules.map((rule, index) => this.abstract(String(index), rule)).map((abstraction) => abstraction.createDiagram(this.project.model));
    }

    abstract(id: string, rule: string): Abstraction {
        let abstraction = new Abstraction('Model Abstraction of rule ' + rule);

        switch (rule) {
            case "RelatorAbstraction": abstraction = this.relatorAbstraction();
                break;
            case "NonSortalAbstraction": abstraction = this.nonSortalAbstraction();
                break;
            case "SortalAbstraction": abstraction = this.sortalAbstraction();
                break;
            case "SubkindAndPhasePartitionsAbstraction": abstraction = this.subkindAndPhasePartitionsAbstraction();
                break;
        }

        return abstraction;
    }

    relatorAbstraction(): Abstraction {
        const abstraction = new Abstraction('Relator Abstraction');

        const allClasses = this.project.getAllClasses();

        const relators = this.project.getAllClassesByStereotype(ClassStereotype.RELATOR);

        const relations = this.project.getAllRelations();

        for (let i = relators.length - 1; i >= 0; i--) {


            for (let j = relations.length - 1; j >= 0; j--) {
                if ((relations[j].getSourceClass() == relators[i]) || (relations[j].getTargetClass() == relators[i])) {
                    relations.splice(j, 1);
                }
            }

            var index = allClasses.indexOf(relators[i]);
            console.log("Remover " + relators[i].getName() + " no indice " + index);
            allClasses.splice(index, 1);

        }



        abstraction.addClasses(allClasses);
        abstraction.addRelations(relations);
        abstraction.removeDuplicates();


        return abstraction;
    }

    copyRelationFromGeneralToSpecific(general: Class, specific: Class, relation: Relation, inSource: boolean) {
        if (inSource) {
            switch (relation.stereotype) {
                case RelationStereotype.MATERIAL: this.project.model.createMaterialRelation(specific, relation.getTargetClass(), relation.getName() + 'as' + general.getName());
                    break;
                case RelationStereotype.COMPARATIVE: this.project.model.createComparativeRelation(specific, relation.getTargetClass(), relation.getName() + 'as' + general.getName());
                    break;
                case RelationStereotype.MEDIATION: this.project.model.createMediationRelation(specific, relation.getTargetClass(), relation.getName() + 'as' + general.getName());
                    break;
                case RelationStereotype.CHARACTERIZATION: this.project.model.createCharacterizationRelation(specific, relation.getTargetClass(), relation.getName() + 'as' + general.getName());
                    break;
                case RelationStereotype.COMPONENT_OF: this.project.model.createComponentOfRelation(specific, relation.getTargetClass(), relation.getName() + 'as' + general.getName());
                    break;
                case RelationStereotype.MEMBER_OF: this.project.model.createMemberOfRelation(specific, relation.getTargetClass(), relation.getName() + 'as' + general.getName());
                    break;
                case RelationStereotype.SUBCOLLECTION_OF: this.project.model.createSubCollectionOfRelation(specific, relation.getTargetClass(), relation.getName() + 'as' + general.getName());
                    break;
                case RelationStereotype.SUBQUANTITY_OF: this.project.model.createSubQuantityOfRelation(specific, relation.getTargetClass(), relation.getName() + 'as' + general.getName());
                    break;
                case RelationStereotype.INSTANTIATION: this.project.model.createInstantiationRelation(specific, relation.getTargetClass(), relation.getName() + 'as' + general.getName());
                    break;
                case RelationStereotype.TERMINATION: this.project.model.createTerminationRelation(specific, relation.getTargetClass(), relation.getName() + 'as' + general.getName());
                    break;
                case RelationStereotype.PARTICIPATIONAL: this.project.model.createParticipationalRelation(specific, relation.getTargetClass(), relation.getName() + 'as' + general.getName());
                    break;
                case RelationStereotype.PARTICIPATION: this.project.model.createParticipationRelation(specific, relation.getTargetClass(), relation.getName() + 'as' + general.getName());
                    break;
                case RelationStereotype.HISTORICAL_DEPENDENCE: this.project.model.createHistoricalDependenceRelation(specific, relation.getTargetClass(), relation.getName() + 'as' + general.getName());
                    break;
                case RelationStereotype.CREATION: this.project.model.createCreationRelation(specific, relation.getTargetClass(), relation.getName() + 'as' + general.getName());
                    break;
                case RelationStereotype.MANIFESTATION: this.project.model.createManifestationRelation(specific, relation.getTargetClass(), relation.getName() + 'as' + general.getName());
                    break;
                case RelationStereotype.BRINGS_ABOUT: this.project.model.createBringsAboutRelation(specific, relation.getTargetClass(), relation.getName() + 'as' + general.getName());
                    break;
                case RelationStereotype.TRIGGERS: this.project.model.createTriggersRelation(specific, relation.getTargetClass(), relation.getName() + 'as' + general.getName());
                    break;
            }
        }
        else {
            switch (relation.stereotype) {
                case RelationStereotype.MATERIAL: this.project.model.createMaterialRelation(relation.getSourceClass(), specific, relation.getName() + 'as' + general.getName());
                    break;
                case RelationStereotype.COMPARATIVE: this.project.model.createComparativeRelation(relation.getSourceClass(), specific, relation.getName() + 'as' + general.getName());
                    break;
                case RelationStereotype.MEDIATION: this.project.model.createMediationRelation(relation.getSourceClass(), specific, relation.getName() + 'as' + general.getName());
                    break;
                case RelationStereotype.CHARACTERIZATION: this.project.model.createCharacterizationRelation(relation.getSourceClass(), specific, relation.getName() + 'as' + general.getName());
                    break;
                case RelationStereotype.COMPONENT_OF: this.project.model.createComponentOfRelation(relation.getSourceClass(), specific, relation.getName() + 'as' + general.getName());
                    break;
                case RelationStereotype.MEMBER_OF: this.project.model.createMemberOfRelation(relation.getSourceClass(), specific, relation.getName() + 'as' + general.getName());
                    break;
                case RelationStereotype.SUBCOLLECTION_OF: this.project.model.createSubCollectionOfRelation(relation.getSourceClass(), specific, relation.getName() + 'as' + general.getName());
                    break;
                case RelationStereotype.SUBQUANTITY_OF: this.project.model.createSubQuantityOfRelation(relation.getSourceClass(), specific, relation.getName() + 'as' + general.getName());
                    break;
                case RelationStereotype.INSTANTIATION: this.project.model.createInstantiationRelation(relation.getSourceClass(), specific, relation.getName() + 'as' + general.getName());
                    break;
                case RelationStereotype.TERMINATION: this.project.model.createTerminationRelation(relation.getSourceClass(), specific, relation.getName() + 'as' + general.getName());
                    break;
                case RelationStereotype.PARTICIPATIONAL: this.project.model.createParticipationalRelation(relation.getSourceClass(), specific, relation.getName() + 'as' + general.getName());
                    break;
                case RelationStereotype.PARTICIPATION: this.project.model.createParticipationRelation(relation.getSourceClass(), specific, relation.getName() + 'as' + general.getName());
                    break;
                case RelationStereotype.HISTORICAL_DEPENDENCE: this.project.model.createHistoricalDependenceRelation(relation.getSourceClass(), specific, relation.getName() + 'as' + general.getName());
                    break;
                case RelationStereotype.CREATION: this.project.model.createCreationRelation(relation.getSourceClass(), specific, relation.getName() + 'as' + general.getName());
                    break;
                case RelationStereotype.MANIFESTATION: this.project.model.createManifestationRelation(relation.getSourceClass(), specific, relation.getName() + 'as' + general.getName());
                    break;
                case RelationStereotype.BRINGS_ABOUT: this.project.model.createBringsAboutRelation(relation.getSourceClass(), specific, relation.getName() + 'as' + general.getName());
                    break;
                case RelationStereotype.TRIGGERS: this.project.model.createTriggersRelation(relation.getSourceClass(), specific, relation.getName() + 'as' + general.getName());
                    break;
            }
        }
    }

    copyRelationsFromGeneralToSpecificList(general: Class, specific: Class) {
        const relations = this.project.getAllRelations();

        for (let i = 0; i < relations.length; i++) {
            if (relations[i].getSourceClass() == general) {
                this.copyRelationFromGeneralToSpecific(general, specific, relations[i], true);
            } else {
                if (relations[i].getTargetClass() == general) {
                    this.copyRelationFromGeneralToSpecific(general, specific, relations[i], true);
                }
            }
        }
    }

    nonSortalAbstraction(): Abstraction {
        const abstraction = new Abstraction('Non Sortal Abstraction');

        const nonSortals = this.project.getAllClassesByStereotype(ClassStereotype.ROLE_MIXIN).concat(this.project.getAllClassesByStereotype(ClassStereotype.MIXIN).concat(this.project.getAllClassesByStereotype(ClassStereotype.CATEGORY)));

        const relations = this.project.getAllRelations();

        const generealizations = this.project.getAllGeneralizationSets();

        for (let i = 0; i < generealizations.length; i++) {
            for (let j = 0; j < nonSortals.length; j++) {
                if (generealizations[i].getGeneral() == nonSortals[j]) {
                    for (let x = 0; x < generealizations[i].getSpecifics().length; x++) {
                        this.copyRelationsFromGeneralToSpecificList(generealizations[i].getGeneralClass(), generealizations[i].getSpecificClasses()[x]);
                    }
                }
            }
        }

        /*TODO Eliminar o não sortal
        */
        const allClasses = this.project.getAllClasses();

        const relations_new = this.project.getAllRelations();

        for (let i = nonSortals.length - 1; i >= 0; i--) {


            for (let j = relations_new.length - 1; j >= 0; j--) {
                if ((relations_new[j].getSourceClass() == nonSortals[i]) || (relations_new[j].getTargetClass() == nonSortals[i])) {
                    relations_new.splice(j, 1);
                }
            }

            var index = allClasses.indexOf(nonSortals[i]);
            console.log("Remover " + nonSortals[i].getName() + " no indice " + index);
            allClasses.splice(index, 1);

        }

        abstraction.addClasses(allClasses);
        abstraction.addRelations(relations_new);
        abstraction.removeDuplicates();

        console.log("Non Sortal Classes: " + allClasses.length)

        return abstraction;
    }

    sortalAbstraction(): Abstraction {
        const abstraction = new Abstraction('Sortal Abstraction');

        return abstraction;
    }

    subkindAndPhasePartitionsAbstraction(): Abstraction {
        const abstraction = new Abstraction('Subkind And Phase Partitions Abstraction');

        return abstraction;
    }



}


