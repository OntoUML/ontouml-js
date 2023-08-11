import { Point } from "./point";
import { Shape } from "./shape";

export abstract class RectangularShape extends Shape {
  private topLeft: Point;
  private _width!: number;
  private _height!: number;
  

  constructor(topLeft?: Point, width?: number, height?: number) {
    super();

    this.topLeft = topLeft || new Point(0, 0);
    this.width = width ?? 20;
    this.height = height ?? 10;
  }

  getX(): number {
    return this.topLeft.x;
  }

  setX(x: number): void {
    this.topLeft.x = x;
  }

  getY(): number {
    return this.topLeft.y;
  }

  setY(y: number): void {
    this.topLeft.y = y;
  }

  public get width(): number {
    return this._width;
  }

  public set width(value: number) {
    if(value<=0){
      throw new Error("Cannot set a negative or zero width.")
    }

    this._width = value;
  }

  public get height(): number {
    return this._height;
  }
  public set height(value: number) {
    if(value<=0){
      throw new Error("Cannot set a negative or zero height.")
    }

    this._height = value;
  }

  override toJSON(): any {
    const object = {
      width: this.width,
      height: this.height,
      x: this.topLeft.x,
      y: this.topLeft.y
    };

    return { ...object, ...super.toJSON() };
  }
}
