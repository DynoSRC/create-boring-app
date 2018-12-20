#!/usr/bin/env node
let ran = false;

function makeCmd(mod) {
  return function exec(argv) {
    ran = true;
    require('./' + mod)(argv)
        .then((result = {status: 1}) => {
          process.exit(result.status);
        })
        .catch(e => {
          process.exit(1);
        });
  };
}

const argv = require('yargs')
    .usage('$0 director-name')
    .help()
    .argv;

makeCmd('create')(argv);

if (!ran) {
  console.log('No valid <cmd> given, please run `boring help` for a list of commands');
}
