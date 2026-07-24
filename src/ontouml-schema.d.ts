/**
 * The `ontouml-schema` package exports the OntoUML JSON Schema
 * (https://w3id.org/ontouml/schema) as a plain JSON object and ships no type
 * declarations of its own.
 */
declare module 'ontouml-schema' {
  const schema: Record<string, unknown>;
  export default schema;
}
