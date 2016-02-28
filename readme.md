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
      space-hogs [path] [size] [--depth=number]

    Options
      path   Path to scan. Defaults to the current path.
      size   Minimum size in MB. Defaults to 6% of the total MB.
      depth  Number of directories to dive into. 0 = none. Defaults to all.

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
```

## Contributions

### Color

* Show me what it should look like, or make a PR using [chalk](https://github.com/chalk/chalk).
* Even though all terminals should have a black background, some people still use white, and we should be attentive to that when picking colors.

### API, Refactoring

* I feel that my recursive promise implementation could be done better with Observables/RXjs.
* I think this will make it possible to have a good API.
* If this doesn't make sense it's probably because I don't know enough about observables/RXjs.

### Cross-platform

* I currently use `du` for calculating disk usage. This won't work in Windows.
* If you would like to help make it work in Windows let me know and start working on a pull request.

## Inspiration

Some projects at work were taking longer than I expected to `npm install`.
After some investigation, I found that a module that should have been a couple KB was accidentally over 100 MB.

I was also running out of space on my Macbook Pro. A bug in a project had created gigs of temp files and not removed them.

Finding these large directories took a long time. It would have been easier if there was one tool to find them.

Prolific node module creator Sindre Sorhus has a [repo for sharing ideas for new modules](https://github.com/sindresorhus/module-requests/issues).
On Feb 10, 2016, I submitted a proposal for [space-hogs: cli for discovering surprisingly large directories](https://github.com/sindresorhus/module-requests/issues/59).
There was a lot of interest, [including from Sindre](https://twitter.com/sindresorhus/status/698932733935034368), but nobody else had created it, I decided to see if I could create it myself.

## Similar Tools

* [WinDirStat](https://windirstat.info/) - Windows only, GUI only, shows every directory, not just the largest offenders.
* [Grand Perspective](http://grandperspectiv.sourceforge.net/) - Mac only, GUI only, shows every directory, not just the largest offenders.

## License

MIT © [Dylan Greene](https://github.com/dylang)
