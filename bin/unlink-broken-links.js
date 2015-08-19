#!/usr/bin/env node

'use strict';

var yargs = require('yargs');
var unlinkBrokenLinks = require('../lib');

var argv;

require('bluebird').longStackTraces();

argv = yargs
  .usage('$0 [directory]')
  .version(function getVersion() {
    return require('../package.json').version;
  })
  .option('recursive', {
    alias: 'r',
    type: 'boolean',
    'default': false,
    describe: 'Recursively walk the directory'
  })
  .help('help')
  .alias('help', 'h')
  .showHelpOnFail(true)
  .argv;

unlinkBrokenLinks(argv._[0] || process.cwd(), {
  recursive: argv.recursive
})
  .then(function(result) {
    if (result.removed.length) {
      console.log(result.removed.join('\n'));
    }
    if (result.errors.length) {
      console.error(result.errors.join('\n'));
    }
  });
