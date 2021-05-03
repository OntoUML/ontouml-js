/**
 * This class is responsible for storing the attribute data.
 *
 * Author: Gustavo L. Guidoni
 */

import { GraphAssociation } from '@libs/ontouml2db/graph/GraphAssociation';

export class NodeProperty {
  //attributes intended for the class
  private id: string;
  private name: string;
  private dataType: string;
  private acceptNull: boolean;
  private multivalued: boolean;

  //attributes intended for the construction of the table
  private isPK: boolean;
  private isPKAutoIncrement: boolean;
  private isFK: boolean;
  private foreignNodeID: string;
  private associationRelated: GraphAssociation;
  private defaultValue: any;

  private resolved: boolean;

  constructor(id: string, name: string, dataType: string, acceptNull: boolean, multivalued: boolean) {
    this.id = id;
    this.name = name;
    this.dataType = dataType;
    this.acceptNull = acceptNull;
    this.multivalued = multivalued;

    this.isPK = false;
    this.isPKAutoIncrement = false;
    this.isFK = false;
    this.defaultValue = null;
    this.resolved = false;
    this.associationRelated = null;
  }

  /**
   * Returns the property ID. This ID is the same as the json file.
   */
  getID(): string {
    return this.id;
  }

  /**
   * Informs the property name.
   *
   * @param name. Property name.
   */
  setName(name: string): void {
    this.name = name;
  }

  /**
   * Returns the property name.
   *
   * @return string with the property name.
   */
  getName(): string {
    return this.name;
  }

  /**
   * Informs the property data type.
   *
   * @param dataType. Name of the property type.
   */
  setDataType(dataType: string): void {
    this.dataType = dataType;
  }

  /**
   * Returns the property data type.
   *
   * @return string with the property data type.
   */
  getDataType(): string {
    return this.dataType;
  }

  /**
   * Informs that the property is a primary key.
   *
   * @param flag. If true, the property will be marked as a
   * primary key.
   */
  setPrimaryKey(flag: boolean): void {
    this.isPK = flag;
    this.isPKAutoIncrement = flag;
    if (flag) {
      this.acceptNull = false;
    }
  }
  /**
   * Returns whether the property is marked as primary key.
   *
   * @return True if the property is a primary key, otherwise false.
   */
  isPrimaryKey(): boolean {
    return this.isPK;
  }

  /**
   * Informs whether the Primary Key is auto-incrementing or not. By default, the primary key is auto-incremented.
   * @param flag
   */
  setPKAutoIncrement(flag: boolean): void {
    this.isPKAutoIncrement = flag;
  }

  /**
   * Returns whether the primary key is auto-increment.
   */
  isPrimaryKeyAutoIncrement(): boolean {
    return this.isPKAutoIncrement;
  }

  /**
   * Informs which node the property (marked as a foreign key) refers to.
   * This is necessary because the foreign key name may be different from
   * the primary key name of the referenced table. This method marks the
   * property as foreign key.
   *
   * @param foreignNode. Node to be referenced.
   */
  setForeignNodeID(foreignNodeID: string, associationRelated: GraphAssociation): void {
    if (foreignNodeID !== null) {
      this.isFK = true;
      this.foreignNodeID = foreignNodeID;
      this.associationRelated = associationRelated;
    } else {
      //removes the foreign key
      this.isFK = false;
      this.foreignNodeID = null;
      this.associationRelated = null;
    }
  }

  /**
   * Returns the ID of the node referenced as foreign key.
   *
   * @return A string with the node name.
   */
  getForeignKeyNodeID(): string {
    return this.foreignNodeID;
  }

  /**
   * Returns if the property is marked as a foreign key.
   *
   * @return True if the property is a foreign key, otherwise false.
   */
  isForeignKey(): boolean {
    return this.isFK;
  }

  /**
   * Returns the association related of Foreign Key.
   */
  getAssociationRelatedOfFK(): GraphAssociation {
    return this.associationRelated;
  }

  /**
   * Informs whether the property accepts null.
   *
   * @param flag. If true, the property accepts null.
   */
  setNullable(flag: boolean): void {
    this.acceptNull = flag;
  }

  /**
   * Returns whether the property accepts null.
   *
   * @return True if the property accepts null, otherwise false.
   */
  isNullable(): boolean {
    return this.acceptNull;
  }

  /**
   * Informs whether the property is multivalued.
   *
   * @param flag. If true, the property is multivalued.
   */
  setMultivalued(flag: boolean): void {
    this.multivalued = flag;
  }

  /**
   * Returns whether the property is multivalued.
   *
   * @return True if the property is multivalued, otherwise false.
   */
  isMultivalued(): boolean {
    return this.multivalued;
  }

  /**
   * Informs a default value for the property.
   *
   * @param value. The default value.
   */
  setDefaultValue(value: any): void {
    this.defaultValue = value;
  }

  /**
   * Returns the default value of the property.
   *
   * @return An object with de default value.
   */
  getDefaultValue() {
    return this.defaultValue;
  }

  /**
   * Informs that the property has already been resolved. Important
   * for the graph operations.
   *
   * @param flag. True if the property has been resolved.
   */
  setResolved(flag: boolean): void {
    this.resolved = flag;
  }

  /**
   * Returns whether the property has been resolved.
   *
   * @return True if the property has been resolved.
   */
  isResolved(): boolean {
    return this.resolved;
  }

  /**
   * Returns a new property with the same values of the current property.
   *
   * @return IOntoProperty.
   */
  clone(newKey?: string): NodeProperty {
    let newProperty: NodeProperty = new NodeProperty(
      newKey == null ? this.id : newKey,
      this.name,
      this.dataType,
      this.acceptNull,
      this.multivalued
    );
    newProperty.setPrimaryKey(this.isPK);
    newProperty.setPKAutoIncrement(this.isPKAutoIncrement);
    newProperty.setForeignNodeID(this.foreignNodeID, this.associationRelated);
    newProperty.setDefaultValue(this.defaultValue);
    return newProperty;
  }

  toString(): string {
    return this.name + ': ' + this.dataType + ', ' + (this.acceptNull === true ? 'NULL' : 'NOT NULL');
  }
}
