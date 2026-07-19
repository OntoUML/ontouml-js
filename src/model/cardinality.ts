const SEPARATOR = '..';

/** The symbol used to represent an unbounded upper bound (`"*"`). */
export const CARDINALITY_MAX = '*';

/** The numeric counterpart of {@link CARDINALITY_MAX} (`Infinity`). */
export const CARDINALITY_MAX_AS_NUMBER = Infinity;

/** Commonly used cardinality values in their string representation. */
export enum CardinalityValues {
  /** At most one (`0..1`). */
  ZERO_TO_ONE = '0..1',

  /** Any number, including none (`0..*`). */
  ZERO_TO_MANY = '0..*',

  /** Exactly one (`1`). */
  ONE = '1',

  /** Exactly one (`1..1`). */
  ONE_TO_ONE = '1..1',

  /** At least one (`1..*`). */
  ONE_TO_MANY = '1..*',

  /** Any number, including none (`*`). */
  MANY = '*'
}

/**
 * The multiplicity of a {@link Property}, expressed as an interval that
 * constrains how many values the property may take — e.g., how many
 * instances of the class at one end of a relation may be linked to an
 * instance of the class at the other end.
 *
 * The cardinality is stored as a string in the format `"lowerBound..upperBound"`
 * (e.g., `"0..1"`, `"1..*"`), where a single value (e.g., `"2"`) denotes an
 * interval whose bounds coincide and `"*"` denotes an unbounded upper bound.
 */
export class Cardinality {
  /**
   * The string representation of the cardinality (e.g., `"0..*"`), or `null`
   * when the cardinality is not set.
   */
  value: string | null;

  constructor(base?: Partial<Cardinality>);
  constructor(cardinality?: string);
  constructor(lowerBound: string, upperBound: string);
  constructor(lowerBound: number, upperBound: number);
  constructor(
    arg1?: Partial<Cardinality> | string | number,
    arg2?: string | number
  ) {
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
      } else if (typeof arg1 === 'string' && typeof arg2 === 'string') {
        this.value = `${arg1}..${arg2}`;
      } else if (typeof arg1 === 'number' && typeof arg2 === 'number') {
        this.value = `${arg1}..${arg2}`;
      } else {
        const msg = 'Bad cardinality input';
        throw new Error(msg);
      }
    } else {
      throw new Error('Unexpected cardinality input');
    }
  }

  /**
   * Splits the cardinality into its lower and upper bounds as strings. A
   * single-valued cardinality (e.g., `"2"`) yields equal bounds.
   *
   * @throws an error if the cardinality is not set.
   */
  getCardinalityBounds(): { lowerBound: string; upperBound: string } {
    if (!this.value) throw new Error('Cardinality bounds are not set.');

    const bounds = this.value.includes(SEPARATOR)
      ? this.value.split(SEPARATOR, 2)
      : [this.value, this.value];

    return { lowerBound: bounds[0], upperBound: bounds[1] };
  }

  /**
   * Splits the cardinality into its lower and upper bounds as numbers, where
   * an unbounded upper bound (`"*"`) is represented as `Infinity`.
   *
   * @throws an error if the cardinality is not set.
   */
  getCardinalityBoundsAsNumbers(): { lowerBound: number; upperBound: number } {
    const cardinality = this.getCardinalityBounds();

    const lowerBound = parseInt(cardinality.lowerBound);
    const upperBound =
      cardinality.upperBound === CARDINALITY_MAX
        ? CARDINALITY_MAX_AS_NUMBER
        : parseInt(cardinality.upperBound);

    return { lowerBound, upperBound };
  }

  /** The lower bound of the cardinality as a string (e.g., `"0"`). */
  get lowerBound(): string {
    const bounds = this.getCardinalityBounds();
    return bounds && bounds.lowerBound;
  }

  /**
   * Sets the lower bound of the cardinality, preserving the upper bound.
   * When the cardinality is unset, the upper bound defaults to `"*"`.
   */
  set lowerBound(lowerBound: string) {
    const upperBound = this.value
      ? this.getCardinalityBounds().upperBound
      : CARDINALITY_MAX;
    this.value = `${lowerBound}..${upperBound}`;
  }

  /**
   * Retrieves the lower bound of the cardinality as a number.
   */
  getLowerBoundAsNumber(): number {
    const bounds = this.getCardinalityBoundsAsNumbers();
    return bounds && bounds.lowerBound;
  }

  /**
   * Sets the lower bound of the cardinality from a number.
   *
   * @throws an error if the value is negative, unbounded, or `NaN`.
   */
  setLowerBound(lowerBound: number): void {
    if (lowerBound < 0) {
      throw new Error('Lower bound must be a positive number');
    } else if (lowerBound === CARDINALITY_MAX_AS_NUMBER) {
      throw new Error('Lower bound cannot be unbounded');
    } else if (Number.isNaN(lowerBound)) {
      throw new Error('NaN lower bound value');
    }

    this.lowerBound = `${lowerBound}`;
  }

  /** The upper bound of the cardinality as a string (e.g., `"*"`). */
  get upperBound(): string {
    const bounds = this.getCardinalityBounds();
    return bounds && bounds.upperBound;
  }

  /**
   * Sets the upper bound of the cardinality, preserving the lower bound.
   * When the cardinality is unset, the lower bound defaults to `"0"`.
   */
  set upperBound(upperBound: string) {
    const lowerBound = this.value
      ? this.getCardinalityBounds().lowerBound
      : '0';
    this.value = `${lowerBound}..${upperBound}`;
  }

  /**
   * Retrieves the upper bound of the cardinality as a number, where an
   * unbounded upper bound is represented as `Infinity`.
   */
  getUpperBoundAsNumber(): number {
    const bounds = this.getCardinalityBoundsAsNumbers();
    return bounds && bounds.upperBound;
  }

  /**
   * Sets the upper bound of the cardinality from a number, where `Infinity`
   * denotes an unbounded upper bound.
   *
   * @throws an error if the value is smaller than one or `NaN`.
   */
  setUpperBound(upperBound: number): void {
    if (upperBound < 1) {
      throw new Error(
        'Upper bound must be a positive number greater than zero'
      );
    } else if (Number.isNaN(upperBound)) {
      throw new Error('NaN upper bound value');
    }

    this.upperBound = `${
      upperBound === CARDINALITY_MAX_AS_NUMBER ? CARDINALITY_MAX : upperBound
    }`;
  }

  /**
   * Checks whether the cardinality denotes a well-formed, non-empty
   * interval, i.e., whether its string representation is valid, its lower
   * bound is a non-negative bounded number, its upper bound is positive, and
   * the lower bound does not exceed the upper bound.
   */
  isValid(): boolean {
    const { lowerBound, upperBound } = this.getCardinalityBoundsAsNumbers();
    return (
      this.isCardinalityStringValid() &&
      lowerBound >= 0 &&
      lowerBound < CARDINALITY_MAX_AS_NUMBER &&
      upperBound > 0 &&
      lowerBound <= upperBound
    );
  }

  /**
   * Checks whether the string representation of the cardinality matches the
   * expected format (e.g., `"1"`, `"0..*"`, `"2..4"`).
   */
  isCardinalityStringValid(): boolean {
    if (!this.value) return false;

    const regex = /^(\d+\.\.)?(\d+|\*)$/;
    return regex.test(this.value);
  }

  /**
   * Checks whether the lower bound can be parsed as an integer.
   */
  isLowerBoundValid(): boolean {
    return !isNaN(Number.parseInt(this.lowerBound));
  }

  /**
   * Checks whether the upper bound can be parsed as an integer or is
   * unbounded (`"*"`).
   */
  isUpperBoundValid(): boolean {
    return (
      this.upperBound === CARDINALITY_MAX ||
      !isNaN(Number.parseInt(this.upperBound))
    );
  }

  /**
   * Checks whether the cardinality has a bounded upper limit, i.e., an
   * upper bound other than `"*"`.
   */
  isBounded(): boolean {
    const bounds = this.getCardinalityBounds();
    return bounds && bounds.upperBound !== CARDINALITY_MAX;
  }

  /** Serializes the cardinality as its string value, or `null` when unset. */
  toJSON(): any {
    return this.value || null;
  }

  /**
   * Sets both bounds of the cardinality at once. When the upper bound is
   * omitted or `Infinity`, the cardinality becomes unbounded (`"*"`).
   *
   * @throws an error if the bounds are out of range or the lower bound
   *         exceeds the upper bound.
   */
  setBounds(lowerBound: number, upperBound?: number): void {
    if (lowerBound < 0 || Number.isNaN(lowerBound)) {
      throw new Error(
        'Lower bound must be greater than or equal to 0. Supplied value: ' +
          lowerBound
      );
    }

    if (
      upperBound !== undefined &&
      (upperBound <= 0 || Number.isNaN(upperBound))
    ) {
      throw new Error(
        'Upper bound must be a greater than 0. Supplied value: ' + upperBound
      );
    }

    if (upperBound !== undefined && lowerBound > upperBound) {
      throw new Error(
        'Lower bound cannot be greater than upper bound. Supplied values: ' +
          lowerBound +
          ' and ' +
          upperBound
      );
    }

    this.lowerBound = `${lowerBound}`;

    if (!upperBound || upperBound === CARDINALITY_MAX_AS_NUMBER) {
      this.upperBound = `${CARDINALITY_MAX}`;
    } else {
      this.upperBound = `${upperBound}`;
    }
  }

  /**
   * Checks whether the property is optional, i.e., whether the lower bound
   * of the cardinality is zero.
   */
  isOptional(): boolean {
    return this.getLowerBoundAsNumber() === 0;
  }

  /**
   * Checks whether the property is mandatory, i.e., whether the lower bound
   * of the cardinality is greater than zero.
   */
  isMandatory(): boolean {
    return !this.isOptional();
  }

  /** Checks whether the cardinality is exactly `0..1`. */
  isZeroToOne(): boolean {
    const cardinality = this.getCardinalityBoundsAsNumbers();
    return (
      cardinality &&
      cardinality.lowerBound === 0 &&
      cardinality.upperBound === 1
    );
  }

  /** Checks whether the cardinality is exactly `0..*`. */
  isZeroToMany(): boolean {
    const cardinality = this.getCardinalityBoundsAsNumbers();
    return (
      cardinality &&
      cardinality.lowerBound === 0 &&
      cardinality.upperBound === CARDINALITY_MAX_AS_NUMBER
    );
  }

  /** Checks whether the cardinality is exactly `1..1`. */
  isOneToOne(): boolean {
    const cardinality = this.getCardinalityBoundsAsNumbers();
    return (
      cardinality &&
      cardinality.lowerBound === 1 &&
      cardinality.upperBound === 1
    );
  }

  /** Checks whether the cardinality is exactly `1..*`. */
  isOneToMany(): boolean {
    const cardinality = this.getCardinalityBoundsAsNumbers();
    return (
      cardinality &&
      cardinality.lowerBound === 1 &&
      cardinality.upperBound === CARDINALITY_MAX_AS_NUMBER
    );
  }

  /** Sets the cardinality to `0..1`. */
  setAsZeroToOne(): void {
    this.value = CardinalityValues.ZERO_TO_ONE;
  }

  /** Sets the cardinality to `0..*`. */
  setAsZeroToMany(): void {
    this.value = CardinalityValues.ZERO_TO_MANY;
  }

  /** Sets the cardinality to `1..1`. */
  setAsOneToOne(): void {
    this.value = CardinalityValues.ONE_TO_ONE;
  }

  /** Sets the cardinality to `1..*`. */
  setAsOneToMany(): void {
    this.value = CardinalityValues.ONE_TO_MANY;
  }
}
