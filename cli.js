#!/usr/bin/env node
'use strict';

const updateNotifier = require('update-notifier');

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
      directory        Directory to scan. Defaults to the current directory.
      size             Minimum size in MB. Defaults to 6% of the total MB.
      --depth=number   Number of sub-directories to dive into. 0 = none. Defaults to all.

    Examples

      $ space-hogs
      $ space-hogs node_modules 5 --depth=0
      $ space-hogs 1000

`});


updateNotifier({pkg: cli.pkg}).notify();

const userInterestingSizeMB = cli.input.find(Number.isInteger);
const startPath = cli.input.find(isString);
const maxDepth = cli.flags.depth;

spaceHogs({startPath, userInterestingSizeMB, maxDepth}).then(process.exit);
