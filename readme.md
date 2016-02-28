# Space Hogs [![Build Status](https://travis-ci.org/dylang/space-hogs.svg?branch=master)](https://travis-ci.org/dylang/space-hogs)

> Discover surprisingly large directories from the command line.

```
~/projects/npm $ space-hogs
151 MB ~/projects/npm
Largest children directories, each larger than 9 MB
├──  31 MB [▒   ] /.git
├──   9 MB [▒   ] /node_modules/npm-registry-couchapp/node_modules
├──  12 MB [▒   ] /node_modules/tap/node_modules/nyc/node_modules
├──  20 MB [▒   ] /node_modules/standard/node_modules/standard-engine/node_modules/eslint/node_modules
├──  17 MB [▒   ] /node_modules/standard/node_modules/standard-format/node_modules/esformatter-jsx/node_modules/babel-core/node_modules
└──  62 MB [▒▒  ] (everything else)
    151 MB Total
```

```
~/projects/npm $ space-hogs node_modules 5 --depth=0
114 MB ~/projects/npm/node_modules
Largest children directories, each larger than 5 MB
├──   6 MB [▒   ] /node-gyp
├──  11 MB [▒   ] /npm-registry-couchapp
├──  27 MB [▒   ] /tap
├──  56 MB [▒▒  ] /standard
└──  13 MB [▒   ] (everything else)
    114 MB Total
```


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
      directory        Directory to scan. Defaults to the current directory.
      size             Minimum size in MB. Defaults to 6% of the total MB.
      --depth=number   Number of sub-directories to dive into. 0 = none. Defaults to all.

    Examples

      $ space-hogs
      $ space-hogs node_modules 5 --depth=0
      $ space-hogs 1000
```

### Tips

* I don't recommend using this on the root of your drive, there are [better tools](#similar-tools) for exploring your entire disk.
* There isn't a real API yet, it will always output to the console, but I hope to have a promise-based API.
* Test coverage isn't really there yet.

## Contributions

I'm happy to take contributions.

Here's some ideas:

### Colors

* Show me what it should look like, or make a PR using [chalk](https://github.com/chalk/chalk).
* Even though all terminals should have a black background, some people use white, and we should be attentive to that when picking colors.

### API + Refactoring

* I feel that my recursive promise implementation could be done better with [observables/RxJS](https://github.com/Reactive-Extensions/RxJS).
* I think this will make it possible to have a good API.
* If this doesn't make sense it's probably because I don't know enough about observables/RxJS.

### Cross-platform (aka Windows support)

* I currently use `du` for calculating disk usage. This won't work in Windows.
* If you would like to help make it work in Windows let me know and start working on a pull request.

### Performance

* I wonder if there are faster ways to get disk usage than `du` using native code. Ideas?

### Test Coverage

* This project uses the [AVA test runner](https://github.com/sindresorhus/ava), I recommend trying it!
* Help me improve the coverage.

### Troubleshooting

* This is meant for projects, *not for checking your entire disk, or even all of `/usr/`*.
* Add `--debug` and to get some debug info that will be helpful for creating tickets.
* Windows is not yet supported
* Versions of node before 4 are not supported.

## Inspiration

Super awesome and prolific node module creator Sindre Sorhus has a [repo for sharing ideas for new modules](https://github.com/sindresorhus/module-requests/issues).
On Feb 10, 2016, I submitted a proposal for [space-hogs: cli for discovering surprisingly large directories](https://github.com/sindresorhus/module-requests/issues/59).
There was a lot of interest, but nobody else created it, so I decided to see if I could.

## Similar Tools

* [WinDirStat](https://windirstat.info/) - Windows only, GUI only, shows every directory, not just the largest offenders.
* [Grand Perspective](http://grandperspectiv.sourceforge.net/) - Mac only, GUI only, shows every directory, not just the largest offenders.

### About the Author

Hi! My name is **Dylan Greene**. When not overwhelmed with my two young kids I enjoy contributing
to the open source community. I'm also a tech lead at [Opower](http://opower.com). [![@dylang](https://img.shields.io/badge/twitter-dylang-blue.svg)](https://twitter.com/dylang)

## License

MIT © [Dylan Greene](https://github.com/dylang)
