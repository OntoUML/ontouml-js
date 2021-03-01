const SEPARATOR = '..';
export const CARDINALITY_MAX = '*';
export const CARDINALITY_MAX_AS_NUMBER = Infinity;

export enum CardinalityValues {
  ZERO_TO_ONE = '0..1',
  ZERO_TO_MANY = '0..*',
  ONE = '1',
  ONE_TO_ONE = '1..1',
  ONE_TO_MANY = '1..*',
  MANY = '*'
}

export class Cardinality {
  value: string;

  constructor(base?: Partial<Cardinality>);
  constructor(cardinality?: string);
  constructor(lowerBound: string, upperBound: string);
  constructor(lowerBound: number, upperBound: number);
  constructor(arg1?: Partial<Cardinality> | string | number, arg2?: string | number) {
    if (arg1 === undefined && arg2 === undefined) {
      this.value = CardinalityValues.ZERO_TO_MANY;
    } else if (arg1 !== undefined && arg2 === undefined) {
      if (arg1 === null) {
        this.value = null;
      } else if (arg1 instanceof Cardinality) {
        this.value = arg1.value;
      } else if (typeof arg1 === 'string') {
        this.value = arg1;
      } else {
        const msg = 'Bad cardinality input';
        throw new Error(msg);
      }
    } else if (arg1 !== undefined && arg2 !== undefined) {
      if (arg1 === null && arg2 === null) {
        this.value = null;
      } else if (typeof arg1 === 'string' && typeof arg1 === 'string') {
        this.value = `${arg1}..${arg2}`;
      } else if (typeof arg1 === 'number' && typeof arg1 === 'number') {
        this.value = `${arg1}..${arg2}`;
      } else {
        const msg = 'Bad cardinality input';
        throw new Error(msg);
      }
    } else {
      throw new Error('Unexpected cardinality input');
    }
  }

  getCardinalityBounds(): { lowerBound: string; upperBound: string } {
    if (!this.value) {
      return null;
    } else {
      const bounds = this.value.includes(SEPARATOR) ? this.value.split(SEPARATOR, 2) : [this.value, this.value];

      return { lowerBound: bounds[0], upperBound: bounds[1] };
    }
  }

  getCardinalityBoundsAsNumbers(): { lowerBound: number; upperBound: number } {
    const cardinality = this.getCardinalityBounds();

    if (!cardinality) {
      return null;
    }

    const lowerBound = parseInt(cardinality.lowerBound);
    const upperBound = cardinality.upperBound === CARDINALITY_MAX ? CARDINALITY_MAX_AS_NUMBER : parseInt(cardinality.upperBound);

    return { lowerBound, upperBound };
  }

  get lowerBound(): string {
    const bounds = this.getCardinalityBounds();
    return bounds && bounds.lowerBound;
  }

  set lowerBound(lowerBound: string) {
    const bounds = this.getCardinalityBounds() || { upperBound: CARDINALITY_MAX };
    this.value = `${lowerBound}..${bounds.upperBound}`;
  }

  getLowerBoundAsNumber(): number {
    const bounds = this.getCardinalityBoundsAsNumbers();
    return bounds && bounds.lowerBound;
  }

  setLowerBoundFromNumber(lowerBound: number): void {
    if (lowerBound < 0) {
      throw new Error('Lower bound must be a positive number');
    } else if (lowerBound === CARDINALITY_MAX_AS_NUMBER) {
      throw new Error('Lower bound cannot be unbounded');
    } else if (Number.isNaN(lowerBound)) {
      throw new Error('NaN lower bound value');
    }

    this.lowerBound = `${lowerBound}`;
  }

  get upperBound(): string {
    const bounds = this.getCardinalityBounds();
    return bounds && bounds.upperBound;
  }

  set upperBound(upperBound: string) {
    const bounds = this.getCardinalityBounds() || { lowerBound: '0' };
    this.value = `${bounds.lowerBound}..${upperBound}`;
  }

  getUpperBoundAsNumber(): number {
    const bounds = this.getCardinalityBoundsAsNumbers();
    return bounds && bounds.upperBound;
  }

  setUpperBoundFromNumber(upperBound: number): void {
    if (upperBound < 1) {
      throw new Error('Upper bound must be a positive number greater than zero');
    }

    this.upperBound = `${upperBound === CARDINALITY_MAX_AS_NUMBER ? CARDINALITY_MAX : upperBound}`;
  }

  isValid(): boolean {
    const regex = /(\d+\.\.)?(\d+|\*)/;
    const { lowerBound, upperBound } = this.getCardinalityBoundsAsNumbers();
    return (
      this.value && regex.test(this.value) && lowerBound <= upperBound && lowerBound < CARDINALITY_MAX_AS_NUMBER && upperBound > 0
    );
  }

  isLowerBoundValid(): boolean {
    return isNaN(Number.parseInt(this.lowerBound));
  }

  isUpperBoundValid(): boolean {
    return isNaN(Number.parseInt(this.upperBound));
  }

  isBounded(): boolean {
    const bounds = this.getCardinalityBounds();
    return bounds && bounds.upperBound !== CARDINALITY_MAX;
  }

  toJSON(): any {
    return this.value || null;
  }

  setCardinalityFromNumbers(lowerBound: number, upperBound?: number): void {
    if (lowerBound > upperBound) {
      throw new Error('Lower bound cannot be greater than upper bound');
    }
    this.lowerBound = `${lowerBound}`;
    this.upperBound = !upperBound || upperBound === CARDINALITY_MAX_AS_NUMBER ? `${CARDINALITY_MAX}` : `${upperBound}`;
  }

  isOptional(): boolean {
    return this.getLowerBoundAsNumber() === 0;
  }

  isMandatory(): boolean {
    return !this.isOptional();
  }

  isZeroToOne(): boolean {
    const cardinality = this.getCardinalityBoundsAsNumbers();
    return cardinality && cardinality.lowerBound === 0 && cardinality.upperBound === 1;
  }

  isZeroToMany(): boolean {
    const cardinality = this.getCardinalityBoundsAsNumbers();
    return cardinality && cardinality.lowerBound === 0 && cardinality.upperBound === CARDINALITY_MAX_AS_NUMBER;
  }

  isOneToOne(): boolean {
    const cardinality = this.getCardinalityBoundsAsNumbers();
    return cardinality && cardinality.lowerBound === 1 && cardinality.upperBound === 1;
  }

  isOneToMany(): boolean {
    const cardinality = this.getCardinalityBoundsAsNumbers();
    return cardinality && cardinality.lowerBound === 1 && cardinality.upperBound === CARDINALITY_MAX_AS_NUMBER;
  }

  setZeroToOne(): void {
    this.value = CardinalityValues.ZERO_TO_ONE;
  }

  setZeroToMany(): void {
    this.value = CardinalityValues.ZERO_TO_MANY;
  }

  setOneToOne(): void {
    this.value = CardinalityValues.ONE_TO_ONE;
  }

  setOneToMany(): void {
    this.value = CardinalityValues.ONE_TO_MANY;
  }
}
