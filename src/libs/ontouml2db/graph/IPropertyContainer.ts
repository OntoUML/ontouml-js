/**
 * A PropertyContainer is intended to group all the properties of a node. 
 * This interface groups together all methods needed to manipulate the node's properties. 
 * 
 * Author: Gustavo L. Guidoni
 */

 import {INodeProperty} from './INodeProperty';

 export interface IPropertyContainer{
     /**
	 * Adds a new property in the container.
	 * 
	 * @param property. Property to be added.
	 */
	addProperty(property: INodeProperty ): void;
	
	/**
	 * Adds a set of property in the container.
	 * 
	 * @param properties. An ArrayList with the properties to be added.
	 */
	addProperties(properties: INodeProperty[]): void;
	
	/**
	 * Adds a new property in the container in a specific position.
	 * 
	 * @param index. Position in which the property will be added. 
	 * @param property. Property to be added.
	 */
	addPropertyAt(index: number, property: INodeProperty ): void;
	
	/**
	 * Adds a set of property in the container from a specific position
	 * 
	 * @param index. Initial position to be added to the properties.
	 * @param properties. Propertues to be added.
	 */
	addPropertiesAt(index: number, properties: INodeProperty[]): void;
	
	/**
	 * Returns the property.
	 * 
	 * @param name. Property name to search for.
	 */
	getPropertyByName(name: string): INodeProperty;
	
	/**
	 * Returns all properties of the container. 
	 * 
	 * @return An ArrayList with all properties.
	 */
	getProperties(): INodeProperty[];
	
	/**
	 * Clone the container and indicate which node it belongs to.
	 * 
	 * @param sourceNode. Node to which the container belongs.
	 * @return A new container with new properties.
	 */
	clonePropertyContainer(): IPropertyContainer;
	
	/**
	 * Removes a specific property of the container.
	 * 
	 * @param property. Property to be removed.
	 */
	removeProperty(id: string): void;
	
	/**
	 * Returns the property marked as the primary key.
	 * 
	 * @return The primary key property
	 */
	getPrimaryKey(): INodeProperty;
	
	/**
	 * Finds the property marked as primary key and returns its name.
	 *  
	 * @return A string with the primary key name.
	 */
	getPKName(): string;
	
	/**
	 * Checks if there is any property with the given name.
	 * 
	 * @param propertyName. Property name to be searched.
	 * @return True if the property name exists in the container, otherwise false.
	 */
    existsPropertyName(propertyName: string): boolean;
	
	/**
	 * Returns all properties formatted as a string.
	 */
    toString(): string;
 }