/// <reference types="node" />

// node dist/libs/ontouml2alloy/ontouml2alloy-cli.js <input-file> [output-dir] [--allow-abstract-leaf-instances]
// stdout: { "issues": [] }
// stderr on failure: { "errors": ["..."] }
// exit 0 on success, 1 on transformation errors

const fs = require('fs');
const path = require('path');
const { parseArgs } = require('util');
const ontoumlLib = require('../ontouml');
const { serializationUtils } = ontoumlLib;
const { Ontouml2Alloy } = require('./ontouml2alloy');

const { values, positionals } = parseArgs({
  args: process.argv.slice(2),
  allowPositionals: true,
  options: {
    'allow-abstract-leaf-instances': { type: 'boolean', default: false }
  }
});

const inputFile = positionals[0];
const outputDir = positionals[1] ?? path.join(__dirname, 'alloy');
const allowAbstractLeafInstances = values['allow-abstract-leaf-instances'];

fs.mkdirSync(outputDir, { recursive: true });

const jsonContent = fs.readFileSync(inputFile, 'utf-8');
const model = serializationUtils.parse(jsonContent);

const transformer = new Ontouml2Alloy(model, { allowAbstractLeafInstances });
const { result, issues } = transformer.run();

if (!result) {
  console.error(JSON.stringify({ errors: (issues || []).map(e => e.description) }));
  process.exit(1);
}

fs.writeFileSync(path.join(outputDir, 'main.als'), result.mainModule, 'utf-8');
fs.writeFileSync(path.join(outputDir, 'world_structure.als'), result.worldStructureModule, 'utf-8');
fs.writeFileSync(path.join(outputDir, 'ontological_properties.als'), result.ontologicalPropertiesModule, 'utf-8');
fs.writeFileSync(
  path.join(outputDir, 'transformation_metadata.json'),
  JSON.stringify(result.transformationMetadata, null, 2),
  'utf-8'
);

process.stdout.write(JSON.stringify({ issues: issues || [] }));
