# Space Hogs [![Build Status](https://travis-ci.org/dylang/space-hogs.svg?branch=master)](https://travis-ci.org/dylang/space-hogs)

> Discover surprisingly large directories from the command line


## Install

```
$ npm i -g space-hogs
```


## Usage

```
$ space-hogs --help

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
```


## License

MIT © [Dylan Greene](https://github.com/dylang)
