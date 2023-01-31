export declare const CARDINALITY_MAX = "*";
export declare const CARDINALITY_MAX_AS_NUMBER: number;
export declare enum CardinalityValues {
    ZERO_TO_ONE = "0..1",
    ZERO_TO_MANY = "0..*",
    ONE = "1",
    ONE_TO_ONE = "1..1",
    ONE_TO_MANY = "1..*",
    MANY = "*"
}
export declare class Cardinality {
    value: string;
    constructor(base?: Partial<Cardinality>);
    constructor(cardinality?: string);
    constructor(lowerBound: string, upperBound: string);
    constructor(lowerBound: number, upperBound: number);
    getCardinalityBounds(): {
        lowerBound: string;
        upperBound: string;
    };
    getCardinalityBoundsAsNumbers(): {
        lowerBound: number;
        upperBound: number;
    };
    get lowerBound(): string;
    set lowerBound(lowerBound: string);
    getLowerBoundAsNumber(): number;
    setLowerBoundFromNumber(lowerBound: number): void;
    get upperBound(): string;
    set upperBound(upperBound: string);
    getUpperBoundAsNumber(): number;
    setUpperBoundFromNumber(upperBound: number): void;
    isValid(): boolean;
    isLowerBoundValid(): boolean;
    isUpperBoundValid(): boolean;
    isBounded(): boolean;
    toJSON(): any;
    setCardinalityFromNumbers(lowerBound: number, upperBound?: number): void;
    isOptional(): boolean;
    isMandatory(): boolean;
    isZeroToOne(): boolean;
    isZeroToMany(): boolean;
    isOneToOne(): boolean;
    isOneToMany(): boolean;
    setZeroToOne(): void;
    setZeroToMany(): void;
    setOneToOne(): void;
    setOneToMany(): void;
}
