'use strict';
const du = require('./util/du');
const percentage = require('./util/percentage');
const toMB = require('./util/to-mb');
const fs = require('fs');
const path = require('path');
const pad = require('pad-left');
const series = require('es6-promise-series');
const tildify = require('tildify');
const ora = require('ora');

// Factor I determined to make interesting results
// Can be overwritten with absolute value on the command line
const DEFAULT_OUTLIER_SIZE = 0.06;

module.exports = function (options) {
    // this whole options section could be done better.
    let startPath = options.startPath;
    let userInterestingSizeMB = options.userInterestingSizeMB;
    let maxDepth = options.maxDepth;

    if (typeof startPath !== 'string') {
        startPath = '.';
    }

    if (!fs.existsSync(startPath)) {
        console.log(startPath, ': No such directory');
        process.exit(1);
    }

    startPath = path.join(startPath, '/');

    const spinner = ora(`Getting recursive size of ${startPath} `);

    const userInterestingSizeBytes = parseInt(userInterestingSizeMB, 10);

    let sizeDisplayed = 0;
    let startPathSize = 0;
    let startSizeString = '';
    let interestingSize = 0;
    let indentSize = 0;

    function outputStart(startSizeString, startPath, interestingSize) {
        spinner.stop();

        const fullPath = tildify(path.resolve(startPath));

        console.log(`${startSizeString} ${fullPath}`);

        if (startPathSize > interestingSize) {
            console.log(`Directories larger than ${toMB(interestingSize)}`);
        }
    }

    function outputAlreadySmall() {
        spinner.stop();

        console.log('Smaller than 1 MB, nice work!');
    }

    function outputLargeDirectory(pathname, size) {
        spinner.stop();

        console.log(`├── ${pad(toMB(size), indentSize, ' ')} ${percentage(size / startPathSize)} ${path.join(path.sep, pathname.replace(startPath, ''))}`);
    }

    function outputRemainingSpace(sizeDisplayed) {
        spinner.stop();

        const remainingSpace = startPathSize - sizeDisplayed;
        if (Math.round(remainingSpace) !== 0) {
            console.log(`└── ${pad(toMB(remainingSpace), indentSize, ' ')} ${percentage((startPathSize - sizeDisplayed) / startPathSize)} (everything else)`);
        }
    }

    function outputTotal() {
        spinner.stop();

        if (Math.round(startPathSize) > 0) {
            console.log(`    ${pad(startSizeString, indentSize, ' ')} Total`);
        }
    }

    function checkPath(parentPath, depth) {
        spinner.start();
        spinner.text = `Checking ${parentPath}`;
        return du(parentPath).then(dirSizes => {
            if (options.isDebugMode) {
                console.log(parentPath, depth);
                console.log(dirSizes);
            }

            if (!dirSizes) {
                return false;
            }

            if (parentPath === startPath) {
                startPathSize = dirSizes[''];
                interestingSize = Math.ceil(userInterestingSizeBytes || startPathSize * DEFAULT_OUTLIER_SIZE, 1);
                startSizeString = toMB(startPathSize);
                indentSize = startSizeString.length;

                if (Math.round(startPathSize) > 0) {
                    outputStart(startSizeString, startPath, interestingSize);
                } else {
                    return outputAlreadySmall();
                }
            }

            const recursivePromises = Object.keys(dirSizes).map(pathName => {
                const size = dirSizes[pathName];
                const fullPath = path.join(parentPath, pathName);

                if (Number.isNaN(size)) {
                    return false;
                }

                // current directory
                if (!pathName) {
                    return false;
                }

                // too small to care
                if (size < interestingSize) {
                    return false;
                }

                if (depth > maxDepth) {
                    return false;
                }

                // don't deep dive hidden dirs
                // but since we got this far, log it
                if (pathName.startsWith('.')) {
                    sizeDisplayed += size;
                    outputLargeDirectory(fullPath, size);
                    return false;
                }

                return checkPath(fullPath, depth + 1).then(resultArray => {
                    // if no outlier directories are returned
                    // then the current path is worth logging.
                    if (!resultArray.length) {
                        sizeDisplayed += size;
                        outputLargeDirectory(fullPath, size);
                    }
                    return size;
                });
            })
            // easy way to remove empty values
            .filter(Boolean);

            // series so they return in order, and it is also somehow faster
            return series(recursivePromises);
        });
    }

    function start() {
        return checkPath(startPath, 0).then(() => {
            spinner.stop();
            outputRemainingSpace(sizeDisplayed);
            outputTotal();
        });
    }

    if (options.isDebugMode) {
        const os = require('os');
        console.log('node', process.version);
        console.log('platform', os.platform(), os.release());
        return du.debug().then(start);
    }

    return start();
};
