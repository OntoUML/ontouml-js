/**
 * A PropertyContainer is intended to group all the properties of a node.
 * This interface groups together all methods needed to manipulate the node's properties.
 *
 * Author: Gustavo L. Guidoni
 */

import { NodeProperty } from '@libs/ontouml2db/graph/NodeProperty';

export interface PropertyContainerInterface {
  /**
   * Adds a new property in the container.
   *
   * @param property. Property to be added.
   */
  addProperty(property: NodeProperty): void;

  /**
   * Adds a set of property in the container.
   *
   * @param properties. An ArrayList with the properties to be added.
   */
  addProperties(properties: NodeProperty[]): void;

  /**
   * Adds a new property in the container in a specific position.
   *
   * @param index. Position in which the property will be added.
   * @param property. Property to be added.
   */
  addPropertyAt(index: number, property: NodeProperty): void;

  /**
   * Adds a set of property in the container from a specific position
   *
   * @param index. Initial position to be added to the properties.
   * @param properties. Properties to be added.
   */
  addPropertiesAt(index: number, properties: NodeProperty[]): void;

  /**
   * Returns the property.
   *
   * @param id. Property id to search for.
   */
  getPropertyByID(id: string): NodeProperty;

  /**
   * Returns the property.
   *
   * @param name. Property name to search for.
   */
  getPropertyByName(name: string): NodeProperty;

  /**
   * Returns all properties of the container.
   *
   * @return An ArrayList with all properties.
   */
  getProperties(): NodeProperty[];

  /**
   * Clone the container and indicate which node it belongs to.
   *
   * @param sourceNode. Node to which the container belongs.
   * @return A new container with new properties.
   */
  clonePropertyContainer(): PropertyContainerInterface;

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
  getPrimaryKey(): NodeProperty;

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
   * Checks if the property exists in the container. The verification
   * is done by the ID property.
   *
   * @param property Property to be searched.
   */
  existsProperty(property: NodeProperty): boolean;

  /**
   * Returns the FK related to the node ID.
   *
   * @param node
   */
  getFKRelatedOfNodeID(id: string): NodeProperty;

  /**
   * Returns all properties formatted as a string.
   */
  toString(): string;
}
