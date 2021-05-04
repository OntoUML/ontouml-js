import { Class, GeneralizationSet, Generalization, Diagram, Project, ClassStereotype } from '@libs/ontouml';
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
        const allRules = ["RelatorAbstraction", "NonSortalAbstraction","SortalAbstraction", "SubkindAndPhasePartitionsAbstraction"]
      return allRules.map((rule, index) => this.abstract(String(index), rule)).map((abstraction) => abstraction.createDiagram(this.project.model));
    }

    abstract(id:string, rule:string): Abstraction{
        let abstraction = new Abstraction('Model Abstraction of rule ' + rule);

        switch(rule){
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

    relatorAbstraction():Abstraction{
        const abstraction = new Abstraction('Relator Abstraction');

        const allClasses = this.project.getAllClasses();

        const relators = this.project.getAllClassesByStereotype(ClassStereotype.RELATOR);

        const relations = this.project.getAllRelations();

        for(let i=relators.length-1; i>=0; i--){

            
            for (let j=relations.length-1; j>=0; j--){
                if((relations[j].getSourceClass()==relators[i])|| (relations[j].getTargetClass()==relators[i])){
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

    nonSortalAbstraction():Abstraction{
        const abstraction = new Abstraction('Non Sortal Abstraction');
        
        return abstraction;
    }

    sortalAbstraction():Abstraction{
        const abstraction = new Abstraction('Sortal Abstraction');
        
        return abstraction;
    }

    subkindAndPhasePartitionsAbstraction():Abstraction{
        const abstraction = new Abstraction('Subkind And Phase Partitions Abstraction');
        
        return abstraction;
    }
}   

