export declare class MultilingualText {
    static defaultLanguage: string;
    static languagePreference: string[];
    textMap: Map<string, string>;
    constructor(value?: string, language?: string);
    getText(language?: string): string;
    addText(value: string, language?: string): void;
    addAll(obj: object): void;
    entries(): [string, string][];
    clear(): void;
    toJSON(): any;
}
