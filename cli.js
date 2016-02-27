#!/usr/bin/env node
'use strict';
const meow = require('meow');

const spaceHogs = require('./');

const cli = meow(`
    Usage
      space-hogs [input]
  
    Options
      path   Path to scan. Defaults to the current path.
      size   Minimum size. Defaults to a % of the total size.
  
    Example
      npm $ space-hogs
      63.61 MB .
      ├──   2 MB /html
      ├──   1 MB /node_modules/read-package-json
      ├──   2 MB /test/tap
      ├──   1 MB /node_modules/init-package-json/node_modules
      ├──   1 MB /node_modules/nock/node_modules
      ├──   1 MB /node_modules/node-gyp/node_modules
      ├──   1 MB /node_modules/npm-registry-mock/fixtures
      ├──   2 MB /node_modules/request/node_modules
      ├──   1 MB /node_modules/node-gyp/gyp/pylib/gyp
      ├──   1 MB /node_modules/tap/node_modules/runforcover/node_modules/bunker/node_modules/burrito
      ├──   1 MB /node_modules/npm-registry-couchapp/node_modules/couchapp/node_modules/http-proxy/examples/node_modules/connect
      ├──   2 MB /node_modules/npm-registry-couchapp/node_modules/couchapp/node_modules/nano/node_modules/request/node_modules
      ├──   2 MB /node_modules/npm-registry-couchapp/node_modules/couchapp/node_modules/nano/node_modules/follow/node_modules/request/node_modules
      └──  45 MB Everything else
`);


const interestingSize = cli.input.find( input => {
    return Number.isInteger(parseInt(input, 10));
});
const pathToUse = cli.input.find( input => {
    return input.trim; // only strings will return true
});
spaceHogs(pathToUse, interestingSize).then(process.exit);
