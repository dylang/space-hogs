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
      path   Path to scan. Defaults to the current path.
      size   Minimum size in MB. Defaults to 6% of the total MB.
      depth  Number of directories to dive into. 0 = none. Defaults to all.

    Examples

      $ space-hogs
      $ space-hogs node_modules 5 --depth=0
      $ space-hogs 1000

`});

const interestingSize = cli.input.find(Number.isInteger);
const pathToUse = cli.input.find(isString);
const depth = cli.flags.depth;

spaceHogs(pathToUse, interestingSize, depth).then(process.exit);
