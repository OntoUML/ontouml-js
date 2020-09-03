/**
 * Class responsible for assembling the graph that represents the class model.
 * 
 * Author: Gustavo L. Guidoni
 */

import { ModelManager } from '@libs/model';
import { IGraph } from "../graph/IGraph";
import { IPackage, IClass, IGeneralization, IRelation, IGeneralizationSet} from '@types';
import { OntoUMLType, ClassStereotype} from '@constants/.';
import { Graph } from '../graph/impl/Graph';
import { INode} from '../graph/INode';
import { INodeProperty } from '../graph/INodeProperty';
import { IGraphRelation } from '../graph/IGraphRelation';
import { IGraphGeneralization } from '../graph/IGraphGeneralization';
import { Node } from '../graph/impl/Node';
import { NodeProperty } from '../graph/impl/NodeProperty';
import { GraphRelation } from '../graph/impl/GraphRelation';
import { GraphGeneralization } from '../graph/impl/GraphGeneralization';
import { GraphGeneralizationSet } from '../graph/impl/GraphGeneralizationSet';
import { Cardinality } from '../graph/util/enumerations';
import { IGraphGeneralizationSet } from '../graph/IGraphGeneralizationSet';

export class Factory{

    private graph : IGraph;
    private modelManager: ModelManager;
    
    constructor(model: IPackage) {
        let modelCopy = JSON.parse(JSON.stringify(model));
        this.modelManager = new ModelManager(modelCopy);

        this.graph = new Graph();
    }

    public mountGraph() : IGraph{
        this.putClasses();

        this.putRelations();

        this.putGeneralizaitons();
        
        this.putGeneralizationSets();
        
        return this.graph;
    }

    /********************************************************************
    ** puts the classes
    *********************************************************************/
    private putClasses(): void{
        let classes: IClass[];   
        classes = this.modelManager.rootPackage.getAllContentsByType([OntoUMLType.CLASS_TYPE]) as IClass[];

        classes.forEach((iclass : IClass) =>{
            if(this.getUfoStereotype(iclass) != null){
                this.putClass(iclass);
            }
        });
    }

    private putClass(iclass: IClass): void{
        let node: INode;
        let property: INodeProperty;
        
        node = new Node(iclass.id, iclass.name, this.getUfoStereotype(iclass));

        const { properties: attributes } = iclass;

        if(attributes != null){
            for (let i = 0; i < attributes.length; i += 1) {
                const { id: attrID, propertyType: attrElement, name: attrName, cardinality: attrCardinality } = attributes[i];
                const { name: datatypeName } = (attrElement || {}) as IClass;
            
                property = new NodeProperty(attrID, attrName, datatypeName, this.getAcceptNull(attrCardinality), this.getIsMultivalued(attrCardinality));
                
                node.addProperty(property);
            }
        }
        this.graph.addNode(node);
    }

    private getAcceptNull(cardinality: string): boolean{
        if(cardinality == null)
            return true;

        if (cardinality.substring(0,1) == "0" )
            return true;
        else return false;
    }

    private getIsMultivalued(cardinality: string): boolean{
        if(cardinality == null)
            return false;
        
        if(cardinality.length > 3){
            let num = cardinality.substring(cardinality.length-1, cardinality.length);

            if(num == "*")
                return true;

            if(! isNaN(parseFloat(num)) ){
                if(Number(num) > 1)
                    return true;
                else return false;
            }
        }
        return false;
    }

    private getUfoStereotype(iclass : IClass) : ClassStereotype{
        let classStereotype: ClassStereotype  = null;
        if(iclass.stereotypes != null){
            iclass.stereotypes.some ( element =>{
                switch (element) {
                    case ClassStereotype.KIND: classStereotype = ClassStereotype.KIND;
                        break;
                    case ClassStereotype.SUBKIND: classStereotype = ClassStereotype.SUBKIND;
                        break;
                    case ClassStereotype.PHASE: classStereotype = ClassStereotype.PHASE;
                        break;
                    case ClassStereotype.ROLE: classStereotype = ClassStereotype.ROLE;
                        break;
                    case ClassStereotype.COLLECTIVE: classStereotype = ClassStereotype.COLLECTIVE;
                        break;
                    case ClassStereotype.QUANTITY: classStereotype = ClassStereotype.QUANTITY;
                        break;
                    case ClassStereotype.RELATOR: classStereotype = ClassStereotype.RELATOR;
                        break;
                    case ClassStereotype.CATEGORY: classStereotype = ClassStereotype.CATEGORY;
                        break;
                    case ClassStereotype.MIXIN: classStereotype = ClassStereotype.MIXIN;
                        break;
                    case ClassStereotype.ROLE_MIXIN: classStereotype = ClassStereotype.ROLE_MIXIN;
                        break;
                    case ClassStereotype.PHASE_MIXIN: classStereotype = ClassStereotype.PHASE_MIXIN;
                        break;
                    case ClassStereotype.MODE: classStereotype = ClassStereotype.MODE;
                        break;
                    case ClassStereotype.QUALITY: classStereotype = ClassStereotype.QUALITY;
                        break;
                    case ClassStereotype.EVENT: classStereotype = ClassStereotype.EVENT;
                        break;
                    case ClassStereotype.HISTORICAL_ROLE: classStereotype = ClassStereotype.HISTORICAL_ROLE;
                        break;
                    case ClassStereotype.ENUMERATION: classStereotype = ClassStereotype.ENUMERATION;
                        break;
                }
            });
        }
        return classStereotype;
    }

    /********************************************************************
    ** puts the relations
    *********************************************************************/

    putRelations(): void{
        let newRelation : IGraphRelation;
        let sourceNode: INode;
        let targetNode: INode;
        let relations = this.modelManager.rootPackage.getAllContentsByType( [OntoUMLType.RELATION_TYPE] ) as IRelation[];

        relations.forEach( (relation: IRelation) => {
            const source = relation.properties[0];
            const target = relation.properties[1];

            const sourceCardinality = source.cardinality;
            const targetCardinality = target.cardinality;

            sourceNode =  this.graph.getNodeById(relation.getSource().id);
            targetNode = this.graph.getNodeById(relation.getTarget().id);
            
            newRelation = new GraphRelation(
                relation.id,
                sourceNode,
                this.getCardinality(sourceCardinality),
                targetNode,
                this.getCardinality(targetCardinality),
            );

            sourceNode.addRelation(newRelation);
		    targetNode.addRelation(newRelation);

            this.graph.addRelation(newRelation);
        });
    }

    getCardinality(cardinality: string): Cardinality{
        let lowerCardinality = this.getLowerboundCardinality(cardinality);
        let uppetCardinality = this.getUpperboundCardinality(cardinality);

        if( lowerCardinality == 0){
            if( uppetCardinality == 1 )
                return Cardinality.C0_1
            else return Cardinality.C0_N;  // 0..2, 0..3, ..., 0..*
        }
        else{
            if( lowerCardinality == 1 ){
                if( uppetCardinality == 1 )
                    return Cardinality.C1
                else return Cardinality.C1_N; // 1..2, 1..3, ..., 1..*
            }
            else{
                return Cardinality.C1_N;
            }
        }
    }

    getLowerboundCardinality(cardinality: string): number {
        const cardinalities = cardinality.split('..');
        const lowerbound = cardinalities[0];
      
        return lowerbound === '*' ? 99999 : Number(lowerbound);
    }
      
    getUpperboundCardinality (cardinality: string): number {
        const cardinalities = cardinality.split('..');
        const upperbound = cardinalities[1] || cardinalities[0];
      
        return upperbound === '*' ? 99999 : Number(upperbound);
    }

    /********************************************************************
    ** puts the generalizations
    *********************************************************************/
    putGeneralizaitons(): void{
        let newGeneralization: IGraphGeneralization;
        let generalizationNode: INode;
        let specializationNode: INode;
        let generalizations = this.modelManager.rootPackage.getAllContentsByType( [OntoUMLType.GENERALIZATION_TYPE] ) as IGeneralization[];
        
        generalizations.forEach( (gen: IGeneralization) =>{
            generalizationNode = this.graph.getNodeById(gen.general.id);
            specializationNode = this.graph.getNodeById(gen.specific.id);

            newGeneralization = new GraphGeneralization(
                gen.id,
                generalizationNode,
                specializationNode
            );

            generalizationNode.addGeneralization(newGeneralization);
            specializationNode.addGeneralization(newGeneralization);

            this.graph.addGeneralization(newGeneralization);
        });
    }

    /********************************************************************
    ** puts the generalization sets
    *********************************************************************/
    putGeneralizationSets(): void{
        let newGeneralizationSet: IGraphGeneralizationSet;
        let graphGeneralization: IGraphGeneralization;
        let generalizationSets = this.modelManager.rootPackage.getAllContentsByType( [OntoUMLType.GENERALIZATION_SET_TYPE] ) as IGeneralizationSet[];

        //informar para cada generalização que ela pertence a um conjunto de generalização
        generalizationSets.forEach( (gs: IGeneralizationSet) => {
            newGeneralizationSet = new GraphGeneralizationSet(gs.id, gs.name, gs.isDisjoint, gs.isComplete);
            newGeneralizationSet.setGenealizationNode( this.graph.getNodeById( gs.getGeneral().id) );

            gs.generalizations.forEach( (generalization: IGeneralization) =>{
                newGeneralizationSet.addSpecializationNode( this.graph.getNodeById( generalization.specific.id ) as INode );
                graphGeneralization = this.graph.getAssociationByID( generalization.id ) as IGraphGeneralization;
                graphGeneralization.setBelongGeneralizationSet(newGeneralizationSet);
            });
            this.graph.addGeneralizationSet (newGeneralizationSet);
        });
        
    }
}