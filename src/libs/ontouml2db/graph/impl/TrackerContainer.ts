/**
 * Class responsible for storing the traceability of the node linked to this container to 
 * the nodes in the transformed graph.
 * 
 * Author: Gustavo L. Guidoni 
 */
import { ITrackerContainer } from '../ITrackerContainer';
import { INode } from '../INode';
import { INodeProperty } from '../INodeProperty';
import { ITracker } from '../ITracker';
import { Tracker } from './Tracker';

export class TrackerContainer implements ITrackerContainer{
    private sourceNode: INode; //Node to which the container belongs.
    private tracker: Map<string, ITracker>;

    constructor(node: INode){
        this.sourceNode = node;
        this.tracker = new Map();
    }

    addSourceTrackedNode(newNodeTracker: INode): void{
        for (let value of this.tracker.values()) {
            value.getNode().addTrackedNode(newNodeTracker);
        }
    }
    
    addTrackedNode(newNodeTracker: INode): void {
        let key = newNodeTracker.getId();
		if( ! this.tracker.has( key ) ) {
            this.tracker.set(key, new Tracker(newNodeTracker, null, null));
        }
    }

    addTracking(trackers: ITracker[]): void {
        trackers.forEach( (value: ITracker) =>{
            this.tracker.set( value.getNode().getId(), value );
        });
    }
    
    removeSourceTracking(): void {
        for (let value of this.tracker.values()) {
            value.getNode().removeTracking(this.sourceNode);
        }
    }

    removeTracking(node: INode): void {
        this.tracker.delete(node.getId());
    }

    changeSourceTracking(newNodeTracker: INode): void {
        for(let nodeTracker of this.tracker.values()){
            nodeTracker.getNode().changeTracking(this.sourceNode, newNodeTracker);
			newNodeTracker.addTrackedNode(nodeTracker.getNode());
        }
    }

    changeTracking(oldNodeTracker: INode, newNodeTracker: INode): void {
        //By switching node tracked, the tracker must be removed and re-added 
        //because the node ID is the key of the Map.
        // Find and remove
        let key = oldNodeTracker.getId();
        let nodeTracker = this.tracker.get(key);
        this.tracker.delete(key);
        // Add the new node
        nodeTracker.setNode(newNodeTracker);
        key = newNodeTracker.getId();
        this.tracker.set(key, nodeTracker);
    }

    setSourceTrackerField(property: INodeProperty, value: any): void {
        
        for( let nodeTracker of this.tracker.values() ){
            if(nodeTracker != null) {
				//The attribute tracking  must be performed only for the respective 
				//node (this) and not for the inheritance hierarchy.
				if(nodeTracker.getNode().getName() == this.sourceNode.getName() ){
					nodeTracker.getNode().setTrackerField(this.sourceNode, property, value);
				}
			}
		}
    }

    setTrackerField(node: INode, property: INodeProperty, value: any): void {
        let nodeTracker = this.tracker.get( node.getId() )
        if( nodeTracker!= null ) {
            //The node reference must be changed by the lifting process.
            nodeTracker.setProperty(property);
            nodeTracker.setValue(value);
        }
    }

    setSourcePropertyLinkedAtNode(linkedNode: INode): void {
        for( let nodeTracker of this.tracker.values() ){
            //The attribute tracking  must be performed only for the respective 
            //node (this) and not for the inheritance hierarchy.
            if(nodeTracker.getNode().getName() == this.sourceNode.getName() ){
                nodeTracker.getNode().setPropertyLinkedAtNode(this.sourceNode, linkedNode);
            }
        }
    }

    setPropertyLinkedAtNode(node: INode, linkedNode: INode): void {
        let nodeTracker = this.tracker.get( node.getId() );
        
        if( nodeTracker != null ){
            //The node reference must be changed by the lifting process.
			nodeTracker.setPropertyLinkedAtNode(linkedNode);
        }
    }

    removeSourcePropertyLinkedAtNode(id: string): void {
        for (let value of this.tracker.values()) {
            if( value.getNode() != null )
                value.getNode().removePropertyLinkedAtNode(id);
        }
    }

    removePropertyLinkedAtNode(id: string): void {
        for (let value of this.tracker.values()) {
            if( value.getPropertyLinkedAtNode() != null ){
                if(value.getPropertyLinkedAtNode().getId() == id)
                    value.setPropertyLinkedAtNode(null);
            }
        }
    }

    getAmountNodesTracked(): number {
        throw new Error("Method not implemented.");
    }
    
    getTargetColumnName(field: string): string {
        throw new Error("Method not implemented.");
    }

    getTargetPKName(): string {
        throw new Error("Method not implemented.");
    }

    getTrackers(): ITracker[] {
        return [...this.tracker.values()];
    }

    toString(): string{
        let msg = '\n\t : Tracker => ';

        for (let value of this.tracker.values()) {
            msg += value.getNode().getName() + ' | ';
        }

		return msg;
    }

}