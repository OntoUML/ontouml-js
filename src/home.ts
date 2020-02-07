const packages = require('./../test_models/others/packages.json');
const Package = require('./../dist/libs/model').Package;
// const ModelManager = require('./../dist/libs/model/').ModelManager;
// const manager = new ModelManager(packages);

var pkg = new Package();
console.log(pkg);

// console.log(packages);
