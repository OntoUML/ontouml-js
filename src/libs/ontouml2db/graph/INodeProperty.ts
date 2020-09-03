/**
 * This interface provides the necessary methods to manipulate the node's properties.
 *
 * Author: Gustavo L. Guidoni
 */

export interface INodeProperty {
  /**
   * Informs the property name.
   *
   * @param name. Property name.
   */
  setName(name: string): void;

  /**
   * Returns the property name.
   *
   * @return string with the property name.
   */
  getName(): string;

  /**
   * Returns the property ID. This ID is the same as the json file.
   */
  getID(): string;

  /**
   * Informs the column name to be assigned to the property in the database.
   *
   * @param name. Attribute name in the database.
   */
  //setColumnName(name: string): void;

  /**
   * Returns the column name of the property in the database.
   *
   * @return string with the column name.
   */
  //getColumnName(): string;

  /**
   * Informs the property data type.
   *
   * @param dataType. Name of the property type.
   */
  setDataType(dataType: string): void;

  /**
   * Returns the property data type.
   *
   * @return string with the property data type.
   */
  getDataType(): string;

  /**
   * Returns a new property with the same values of the current property.
   *
   * @return IOntoProperty.
   */
  clone(): INodeProperty;

  /**
   * Informs that the property is a primary key.
   *
   * @param flag. If true, the property will be marked as a
   * primary key.
   */
  setPrimeryKey(flag: boolean): void;

  /**
   * Returns whether the property is marked as primary key.
   *
   * @return True if the property is a primary key, otherwise false.
   */
  isPrimaryKey(): boolean;

  /**
   * Informs which node the property (marked as a foreign key) refers to.
   * This is necessary because the foreign key name may be different from
   * the primary key name of the referenced table. This method marks the
   * property as foreign key.
   *
   * @param foreignNode. Node to be referenced.
   */
  setForeignNodeID(foreignNodeID: string): void;

  /**
   * Returns the ID of the node referenced as foreign key.
   *
   * @return A string with the node name.
   */
  getForeignKeyNodeID(): string;

  /**
   * Returns if the property is marked as a foreign key.
   *
   * @return True if the property is a foreign key, otherwise false.
   */
  isForeignKey(): boolean;

  /**
   * Informs whether the property accepts null.
   *
   * @param flag. If true, the property accepts null.
   */
  setNullable(flag: boolean): void;

  /**
   * Returns whether the property accepts null.
   *
   * @return True if the property accepts null, otherwise false.
   */
  isNullable(): boolean;

  /**
   * Informs whether the property is multivalued.
   *
   * @param flag. If true, the property is multivalued.
   */
  setMultivalued(flag: boolean): void;

  /**
   * Returns whether the property is multivalued.
   *
   * @return True if the property is multivalued, otherwise false.
   */
  isMultivalued(): boolean;

  /**
   * Informs a default value for the property.
   *
   * @param value. The default value.
   */
  setDefaultValue(value: any): void;

  /**
   * Returns the default value of the property.
   *
   * @return An object with de default value.
   */
  getDefaultValue(): any;

  /**
   * Informs that the property has already been resolved. Important
   * for the graph operations.
   *
   * @param flag. True if the property has been resolved.
   */
  setResolved(flag: boolean): void;

  /**
   * Returns whether the property has been resolved.
   *
   * @return True if the property has been resolved.
   */
  isResolved(): boolean;

  toString(): string;
}
