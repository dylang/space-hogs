#!/usr/bin/env node
'use strict';
const meow = require('meow');
const isString = require('util').isString;
const spaceHogs = require('./');

const cli = meow({
    inferType: true,
    description: 'Discover surprisingly large directories.',
    help:
`
    Usage
      space-hogs [path] [size] [--depth=number]

    Options
      path (str)   Path to scan. Defaults to the current path.
      size (int)   Minimum size in MB. Defaults to 6% of the total MB.
      -d, --depth  Number of directories to dive into. 0 = none. Defaults to all.

    Examples

      ~/projects/npm ❯ space-hogs
      151 MB ~/projects/npm
      Largest children directories, each larger than 9 MB
      ├──  31 MB [▒   ] /.git
      ├──   9 MB [▒   ] /node_modules/npm-registry-couchapp/node_modules
      ├──  12 MB [▒   ] /node_modules/tap/node_modules/nyc/node_modules
      ├──  20 MB [▒   ] /node_modules/standard/node_modules/standard-engine/node_modules/eslint/node_modules
      ├──  17 MB [▒   ] /node_modules/standard/node_modules/standard-format/node_modules/esformatter-jsx/node_modules/babel-core/node_modules
      └──  62 MB [▒▒  ] (everything else)
          151 MB Total

      ~/projects/npm ❯ space-hogs node_modules 5 --depth=0
      114 MB ~/projects/npm/node_modules
      Largest children directories, each larger than 5 MB
      ├──   6 MB [▒   ] /node-gyp
      ├──  11 MB [▒   ] /npm-registry-couchapp
      ├──  27 MB [▒   ] /tap
      ├──  56 MB [▒▒  ] /standard
      └──  13 MB [▒   ] (everything else)
          114 MB Total
`});

const interestingSize = cli.input.find(Number.isInteger);
const pathToUse = cli.input.find(isString);
const depth = cli.flags.depth;

spaceHogs(pathToUse, interestingSize, depth).then(process.exit);
