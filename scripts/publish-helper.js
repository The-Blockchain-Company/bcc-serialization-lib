const fs = require('fs');
const oldPkg = require('../publish/package.json');

const flowFile = 'bcc_serialization_lib.js.flow';
if (oldPkg.files.find(entry => entry === flowFile) == null) {
  oldPkg.files.push(flowFile);
}
if (oldPkg.name === 'bcc-serialization-lib') {
  oldPkg.name = '@the-blockchain-company/' + oldPkg.name + process.argv.slice(2)[0];
}
if (process.argv.slice(2)[0] === '-browser' || process.argv.slice(2)[0] === '-asmjs') {
  // due to a bug in wasm-pack, this file is missing from browser builds
  const missingFile = 'bcc_serialization_lib_bg.js';
  if (oldPkg.files.find(entry => entry === missingFile) == null) {
    oldPkg.files.push(missingFile);
  }
}
if (process.argv.slice(2)[0] === '-asmjs') {
  // need to replace WASM with ASM package 
  const missingFile = 'bcc_serialization_lib_bg.wasm';
  oldPkg.files = [
    'bcc_serialization_lib.asm.js',
    ...oldPkg.files.filter(file => file !== 'bcc_serialization_lib_bg.wasm')
  ];
}

oldPkg.repository = {
  type: "git",
  url: "git+https://github.com/The-Blockchain-Company/bcc-serialization-lib.git"
};
oldPkg.author = "THE-BLOCKCHAIN-COMPANY";
oldPkg.license = "MIT";
console.log(oldPkg);
fs.writeFileSync('./publish/package.json', JSON.stringify(oldPkg, null, 2));
