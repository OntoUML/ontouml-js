/**
 * This class is responsible for storing the attribute data.
 *
 * Author: Gustavo L. Guidoni
 */

import { INodeProperty } from '../INodeProperty';

export class NodeProperty implements INodeProperty {
  //attributes intended for the class
  private id: string;
  private name: string;
  private dataType: string;
  private acceptNull: boolean;
  private multivalued: boolean;

  //attributes intended for the construction of the table
  //private columnName: string;
  private isPK: boolean;
  private isFK: boolean;
  private foreignNodeID: string;
  private defaultValue: any;
  private resolved: boolean;

  constructor(
    id: string,
    name: string,
    dataType: string,
    acceptNull: boolean,
    multivalued: boolean,
  ) {
    this.id = id;
    this.name = name;
    this.dataType = dataType;
    this.acceptNull = acceptNull;
    this.multivalued = multivalued;

    //this.columnName = name;
    this.isPK = false;
    this.isFK = false;
    this.defaultValue = null;
    this.resolved = false;
  }

  getID(): string {
    return this.id;
  }

  setName(name: string): void {
    this.name = name;
  }

  getName(): string {
    return this.name;
  }

  //setColumnName(name: string): void {
  //    this.columnName = name;
  // }

  //getColumnName(): string {
  //    return this.columnName;
  //}

  setDataType(dataType: string): void {
    this.dataType = dataType;
  }

  getDataType(): string {
    return this.dataType;
  }

  setPrimeryKey(flag: boolean): void {
    this.isPK = flag;
    if (flag) {
      this.acceptNull = false;
    }
  }

  isPrimaryKey(): boolean {
    return this.isPK;
  }

  setForeignNodeID(foreignNodeID: string): void {
    if (foreignNodeID != null) {
      this.isFK = true;
      this.foreignNodeID = foreignNodeID;
    } else {
      //removes the foreign key
      this.isFK = false;
      this.foreignNodeID = null;
    }
  }

  getForeignKeyNodeID(): string {
    return this.foreignNodeID;
  }

  isForeignKey(): boolean {
    return this.isFK;
  }

  setNullable(flag: boolean): void {
    this.acceptNull = flag;
  }

  isNullable(): boolean {
    return this.acceptNull;
  }

  setMultivalued(flag: boolean): void {
    this.multivalued = flag;
  }

  isMultivalued(): boolean {
    return this.multivalued;
  }

  setDefaultValue(value: any): void {
    this.defaultValue = value;
  }

  getDefaultValue() {
    return this.defaultValue;
  }

  setResolved(flag: boolean): void {
    this.resolved = flag;
  }

  isResolved(): boolean {
    return this.resolved;
  }

  clone(): INodeProperty {
    let newProperty: INodeProperty = new NodeProperty(
      this.id,
      this.name,
      this.dataType,
      this.acceptNull,
      this.multivalued,
    );
    newProperty.setPrimeryKey(this.isPK);
    newProperty.setForeignNodeID(this.foreignNodeID);
    //newProperty.setColumnName(this.columnName);
    newProperty.setDefaultValue(this.defaultValue);
    return newProperty;
  }

  toString(): string {
    return (
      this.name +
      ': ' +
      this.dataType +
      ', ' +
      (this.acceptNull == true ? 'NULL' : 'NOT NULL')
    );
  }
}
