import { Class, GeneralizationSet, Generalization, Diagram, Project, ClassStereotype, Relation, ModelElement, RelationStereotype } from '@libs/ontouml';
import { Service } from '@libs/service';
import { ServiceIssue } from '@libs/service_issue';
import { Abstraction } from '@libs/abstraction';
import { getUnpackedSettings } from 'http2';
import { lte, partition } from 'lodash';
import { ClassVerification } from '@libs/verification';

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

    /**
     * This method will abstract a model removing the Relators. If a relator is a truth maker of a relation, 
     * it will be abstracted to a material relation between the elements
     * 
     * @returns A model abstracted using the Relator Abstraction Rule
     */
    relatorAbstraction(): Abstraction {
        const abstraction = new Abstraction('Relator Abstraction');

        const allClasses = this.project.getAllClasses();

        const relators = this.project.getAllClassesByStereotype(ClassStereotype.RELATOR);

        const relations = this.project.getAllRelations();

        /**Step 1: Search for all relators in the model 
         * 
         * Step 2: Remove all relations where a Relator is participating
         * 
         * Step 3: Remove the relator from model.
        */
        for (let i = relators.length - 1; i >= 0; i--) {

            /**2 */
            for (let j = relations.length - 1; j >= 0; j--) {
                if ((relations[j].getSourceClass() == relators[i]) || (relations[j].getTargetClass() == relators[i])) {
                    relations.splice(j, 1);
                }
            }

            /**3 */
            var index = allClasses.indexOf(relators[i]);
            console.log("Remover " + relators[i].getName() + " no indice " + index);
            allClasses.splice(index, 1);

        }



        abstraction.addClasses(allClasses);
        abstraction.addRelations(relations);
        abstraction.removeDuplicates();


        return abstraction;
    }

    /**
     * This method will "move" a relation from Source class to a Target class. 
     * In fact the relation will not be moved, but a new relation just like the original one will be created with target class. 
     * For example, a class X have a material relation (r1) with class y. If this method will "move" the material relation(r1) from x to class w, 
     * this method will create a new material relation(r2), just like r1, however between class w and class y.
     * 
     * @param source Source class that relation will be "moved" from
     * @param target Target class that relation will be "moved" to
     * @param relation Relation to be "moved"
     */
    copyRelationFromSourceToTarget(source: Class, target: Class, relation: Relation) {
        switch (relation.stereotype) {
            case RelationStereotype.MATERIAL: this.project.model.createMaterialRelation(source, target, relation.getName() + 'as' + source.getName());
                break;
            case RelationStereotype.COMPARATIVE: this.project.model.createComparativeRelation(source, target, relation.getName() + 'as' + source.getName());
                break;
            case RelationStereotype.MEDIATION: this.project.model.createMediationRelation(source, target, relation.getName() + 'as' + source.getName());
                break;
            case RelationStereotype.CHARACTERIZATION: this.project.model.createCharacterizationRelation(source, target, relation.getName() + 'as' + source.getName());
                break;
            case RelationStereotype.COMPONENT_OF: this.project.model.createComponentOfRelation(source, target, relation.getName() + 'as' + source.getName());
                break;
            case RelationStereotype.MEMBER_OF: this.project.model.createMemberOfRelation(source, target, relation.getName() + 'as' + source.getName());
                break;
            case RelationStereotype.SUBCOLLECTION_OF: this.project.model.createSubCollectionOfRelation(source, target, relation.getName() + 'as' + source.getName());
                break;
            case RelationStereotype.SUBQUANTITY_OF: this.project.model.createSubQuantityOfRelation(source, target, relation.getName() + 'as' + source.getName());
                break;
            case RelationStereotype.INSTANTIATION: this.project.model.createInstantiationRelation(source, target, relation.getName() + 'as' + source.getName());
                break;
            case RelationStereotype.TERMINATION: this.project.model.createTerminationRelation(source, target, relation.getName() + 'as' + source.getName());
                break;
            case RelationStereotype.PARTICIPATIONAL: this.project.model.createParticipationalRelation(source, target, relation.getName() + 'as' + source.getName());
                break;
            case RelationStereotype.PARTICIPATION: this.project.model.createParticipationRelation(source, target, relation.getName() + 'as' + source.getName());
                break;
            case RelationStereotype.HISTORICAL_DEPENDENCE: this.project.model.createHistoricalDependenceRelation(source, target, relation.getName() + 'as' + source.getName());
                break;
            case RelationStereotype.CREATION: this.project.model.createCreationRelation(source, target, relation.getName() + 'as' + source.getName());
                break;
            case RelationStereotype.MANIFESTATION: this.project.model.createManifestationRelation(source, target, relation.getName() + 'as' + source.getName());
                break;
            case RelationStereotype.BRINGS_ABOUT: this.project.model.createBringsAboutRelation(source, target, relation.getName() + 'as' + source.getName());
                break;
            case RelationStereotype.TRIGGERS: this.project.model.createTriggersRelation(source, target, relation.getName() + 'as' + source.getName());
                break;
        }
    }


    /**
     * This method will "move" relations from General to Specific class in a generalization
     * 
     * @param general General class of generalization that is being analysing 
     * @param specific Specific class of generalization that is being analysing
     * @param relation Specifica class's Relation of generalization that is being analysing
     * @param inSource True if the Specific Class is in the Relation's source, false otherwise
     */
    copyRelationFromGeneralToSpecific(general: Class, specific: Class, relation: Relation, inSource: boolean) {
        if (inSource) {
            this.copyRelationFromSourceToTarget(general, relation.getTargetClass(), relation);
        }
        else {
            this.copyRelationFromSourceToTarget(relation.getSourceClass(), specific, relation);
        }
    }

    /**
     * This method will "move" relations from Specific to General class in a generalization
     * 
     * @param specific Specific class of generalization that is being analysing
     * @param general General class of generalization that is being analysing
     * @param relation Specifica class's Relation of generalization that is being analysing
     * @param inSource True if the Specific Class is in the Relation's source, false otherwise
     */
    copyRelationFromSpecificToGeneral(specific: Class, general: Class, relation: Relation, inSource: boolean) {
        if (inSource) {
            this.copyRelationFromSourceToTarget(specific, relation.getTargetClass(), relation);
        }
        else {
            this.copyRelationFromSourceToTarget(relation.getSourceClass(), general, relation);
        }
    }

    /**
     * This method will "move"relations from a General to the list of Specific class in a GeneralizationSet
     * @param general General class of generalization that is being analysing
     * @param specific Specific class of generalization that is being analysingß
     */
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


    /**
     * This method will abstract all non-sortals specializations by "moving" the general relations to respective specifics. 
     * After that, the general is removed from model
     * 
     * @returns A model abstracted using the Non-Sortal Abstraction Rule
     */
    nonSortalAbstraction(): Abstraction {
        const abstraction = new Abstraction('Non Sortal Abstraction');

        const nonSortals = this.project.getAllClassesByStereotype(ClassStereotype.ROLE_MIXIN).concat(this.project.getAllClassesByStereotype(ClassStereotype.MIXIN).concat(this.project.getAllClassesByStereotype(ClassStereotype.CATEGORY)));

        const relations = this.project.getAllRelations();

        const genereralizations = this.project.getAllGeneralizationSets();

        /**
         * Step 1: Search for all generalizations in model
         * 
         * Step 2: If a Non-Sortal is the general in the generalization, it will be removed from model
         * 
         * 2.1: For each specific of the non-sortal general, general relations will be "moved" to specifics
         */
        for (let i = 0; i < genereralizations.length; i++) {
            for (let j = 0; j < nonSortals.length; j++) {
                /**2 */
                if (genereralizations[i].getGeneral() == nonSortals[j]) {
                    /**2.1 */
                    for (let x = 0; x < genereralizations[i].getSpecifics().length; x++) {
                        this.copyRelationsFromGeneralToSpecificList(genereralizations[i].getGeneralClass(), genereralizations[i].getSpecificClasses()[x]);
                    }
                }
            }
        }


        const allClasses = this.project.getAllClasses();

        const relations_new = this.project.getAllRelations();

        /**Step 3 Remove all relations with the non-sortals
         * 3.1: For each non-sortal in model will search for relations that contains a non-sortal.
         * 
         * 3.2: If the relation has the non-sortal as Source or Target, it will be removed.
         */
        for (let i = nonSortals.length - 1; i >= 0; i--) {


            for (let j = relations_new.length - 1; j >= 0; j--) {
                /**3.2 */
                if ((relations_new[j].getSourceClass() == nonSortals[i]) || (relations_new[j].getTargetClass() == nonSortals[i])) {
                    relations_new.splice(j, 1);
                }
            }

            /**Step 4 Remove the non-sortal from model */
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
    /**
     * This method verify if a Generalization is part of a GeneralizationSet
     * 
     * @param generalization Generalization to be verified  in GeneralizationSet
     * @returns True if the generalization is part of a GeneralizationSet, false if not.
     */
    isInGeneralizationSet(generalization: Generalization): boolean {
        let genSets = this.project.model.getAllGeneralizationSets();

        /**
         * For all GeneralizationSets in model, verify is the generalization is part of it.
         */
        for (let i = 0; i < genSets.length; i++) {

            if (genSets[i].generalizations.includes(generalization)) {
                return true;
            }


        }
        return false;
    }

    /**
     * This method will abstract all sortals specializations by "moving" the specific relations to respective general. 
     * After that, the specific is removed from model
     * 
     * @returns A model abstracted using the Sortal Abstraction Rule
     */
    sortalAbstraction(): Abstraction {
        const abstraction = new Abstraction('Sortal Abstraction');

        const allClasses = this.project.getAllClasses();

        const sortals = this.project.getAllClassesByStereotype(ClassStereotype.KIND).concat(this.project.getAllClassesByStereotype(ClassStereotype.SUBKIND).concat(this.project.getAllClassesByStereotype(ClassStereotype.ROLE).concat(this.project.getAllClassesByStereotype(ClassStereotype.PHASE).concat(this.project.getAllClassesByStereotype(ClassStereotype.COLLECTIVE).concat(this.project.getAllClassesByStereotype(ClassStereotype.QUANTITY))))));

        const relations = this.project.getAllRelations();

        let generalizations = this.project.model.getAllGeneralizations();

        /**Step 1: Consider only Generalizations that isn`'t participating in a GeneralizationSet
         * This loop will remove from the generalizations list all that is participating in a GeneralizationSet
         */

        for (let i = generalizations.length - 1; i > -0; i--) {
            if (this.isInGeneralizationSet(generalizations[i])) {
                generalizations.splice(i, 1);
            }
        }

        /** Step 2: Search for all Sortals Specializations and copy the Specific relation to General
         * 2.1: First loop will consider only generalizations that isn't participation ina a GeneralizationSet
         * 
         * 2.2: Second loop will consider all sortals in model to copy relations
         * 2.2.1: For each sortal in model, if it's in a generalization will copy specific relations to general
         * 2.2.1.1: Navigate in all relations searching for relations that need to be copied and copy the relation
         * 
         * 2.3: Collect all relation that will be removed from model
         * 
         * 2.4: Remove the specific from model
         */

        let relationToRemove = [];

        /**2.1 */
        for (let i = 0; i < generalizations.length; i++) {
            /**2.2 */
            for (let j = 0; j < sortals.length; j++) {
                /**2.2.1 */
                if ((generalizations[i].getGeneralClass() == sortals[j]) && (generalizations[i] != null)) {
                    /**2.2.1.1 */
                    for (let w = 0; w < relations.length; w++) {
                        if (relations[w].getSourceClass() == generalizations[i].getSpecificClass()) {
                            this.copyRelationFromSpecificToGeneral(generalizations[i].getSpecificClass(), generalizations[i].getGeneralClass(), relations[w], true);
                        } else {
                            if (relations[w].getTargetClass() == generalizations[i].getSpecificClass()) {
                                this.copyRelationFromSpecificToGeneral(generalizations[i].getSpecificClass(), generalizations[i].getGeneralClass(), relations[w], true);
                            }
                        }
                    }

                }
            }

            /**2.3*/
            for (let z = 0; z < relations.length; z++) {
                console.log('Classe origem ' + relations[z].getSourceClass());
                if ((relations[z].getSourceClass() == generalizations[i].getSpecificClass()) || (relations[z].getTargetClass() == generalizations[i].getSpecificClass())) {
                    relationToRemove.push(relations[z]);
                }
            }


            /**2.4*/
            var index = allClasses.indexOf(generalizations[i].getSpecificClass());
            console.log("Remover " + generalizations[i].getSpecificClass().getName() + " no indice " + index);
            allClasses.splice(index, 1);
        }


        /**Step 3: Remove all relations with removed specific classes */

        const relations_new = this.project.model.getAllRelations();
        for (let i = relations_new.length; i >= 0; i--) {
            for (let j = 0; j < relationToRemove.length; j++) {
                var index = relations_new.indexOf(relationToRemove[j]);
                relations_new.splice(index, 1);
            }
        }



        abstraction.addClasses(allClasses);
        abstraction.addRelations(relations_new);
        abstraction.removeDuplicates();


        return abstraction;
    }

    subkindAndPhasePartitionsAbstraction(): Abstraction {
        const abstraction = new Abstraction('Subkind And Phase Partitions Abstraction');

        const allClasses = this.project.getAllClasses();

        const generalizationSets = this.project.model.getAllGeneralizationSets();

        const relations = this.project.model.getAllRelations();

        /**Step 1 Verify if the GeneralizationSet is a Phase Partition or a Subkind Partition
         * 
         * Step 2 Get all specifics names to transform then in item of a enumeration
         * 
         * Step 3 Move the relation from specific to general
         * 
         * Step 4 Remove the specific from model
         * 
         * Step 5 Create an Enumeration and a relation between the relation and general class
         */
        let relationToRemove = [];
        for (let i = 0; i < generalizationSets.length; i++) {
            if ((generalizationSets[i].isPhasePartition()) || (generalizationSets[i].isSubkindPartition())) {
                let itens = [];
                /**2 */
                for (let j = 0; j < generalizationSets[i].getSpecificClasses().length; j++) {
                    itens.push(generalizationSets[i].getSpecificClasses()[j].getName());

                    /**3 */
                    for (let w = 0; w < relations.length; w++) {
                        if (relations[w].getSourceClass() == generalizationSets[i].getSpecificClasses()[j]) {
                            this.copyRelationFromSpecificToGeneral(generalizationSets[i].getSpecificClasses()[j], generalizationSets[i].getGeneralClass(), relations[w], true);
                            relationToRemove.push(relations[w]);
                        } else {
                            if (relations[w].getTargetClass() == generalizationSets[i].getSpecificClasses()[j]) {
                                this.copyRelationFromSpecificToGeneral(generalizationSets[i].getSpecificClasses()[j], generalizationSets[i].getGeneralClass(), relations[w], false);
                                relationToRemove.push(relations[w]);
                            }
                        }


                    }

                    /**4 */
                    var index = allClasses.indexOf(generalizationSets[i].getSpecificClasses()[j]);
                    console.log("Remover " + generalizationSets[i].getSpecificClasses()[j].getName() + " no indice " + index);
                    allClasses.splice(index, 1);

                }

                /**5 */
                this.project.model.createBinaryRelation(generalizationSets[i].getGeneralClass(), this.project.model.createEnumeration(generalizationSets[i].getName(), itens));

            }
        }

        /**Step 6 Remove all relations with removed specific classes */

        const relations_new = this.project.model.getAllRelations();
        for (let i = relations_new.length; i >= 0; i--) {
            for (let j = 0; j < relationToRemove.length; j++) {
                var index = relations_new.indexOf(relationToRemove[j]);
                relations_new.splice(index, 1);
            }
        }



        abstraction.addClasses(allClasses);
        abstraction.addRelations(relations_new);
        abstraction.removeDuplicates();


        return abstraction;
    }



}




