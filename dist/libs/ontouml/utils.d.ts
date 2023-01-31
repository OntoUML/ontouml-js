declare function includesAll<T>(superSet: T[], subSet: T[]): boolean;
declare function intersects<T>(setA: T[], setB: T[]): boolean;
declare function equalContents<T>(setA: Set<T>, setB: Set<T>): boolean;
declare function equalContents<T>(arrayA: T[], arrayB: T[]): boolean;
declare function arrayFrom<T>(input: T | T[] | Set<T>): T[];
export declare const utils: {
    includesAll: typeof includesAll;
    intersects: typeof intersects;
    arrayFrom: typeof arrayFrom;
    equalContents: typeof equalContents;
};
export {};
