'use strict';

require('loud-rejection')();

const du = require('./util/du');
const percentage = require('./util/percentage');
const toMB = require('./util/to-mb');
const path = require('path');
const pad = require('pad-left');
const series = require('es6-promise-series');
const tildify = require('tildify');

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

    startPath = path.join(startPath, '/');

    const userInterestingSizeBytes = parseInt(userInterestingSizeMB, 10);

    let sizeDisplayed = 0;
    let interestingSize = 0;
    let startPathSize = 0;
    let indentSize = 0;
    let startSizeString = '';

    function outputStart(startSizeString, startPath, interestingSize) {
        const fullPath = tildify(path.resolve(startPath));
        console.log(`${startSizeString} ${fullPath}`);
        if (startPathSize > interestingSize) {
            console.log(`Directories larger than ${toMB(interestingSize)}`);
        }
    }

    function outputLargeDirectory(pathname, size) {
        console.log(`├── ${pad(toMB(size), indentSize, ' ')} ${percentage(size / startPathSize)} ${path.join(path.sep, pathname.replace(startPath, ''))}`);
    }

    function outputRemainingSpace(sizeDisplayed) {
        const remainingSpace = toMB(startPathSize - sizeDisplayed);
        if (remainingSpace !== 0) {
            console.log(`└── ${pad(remainingSpace, indentSize, ' ')} ${percentage((startPathSize - sizeDisplayed) / startPathSize)} (everything else)`);
        }
    }

    function outputTotal() {
        if (startPathSize > 0) {
            console.log(`    ${pad(startSizeString, indentSize, ' ')} Total`);
        }
    }

    function checkPath(parentPath, depth) {
        return du(parentPath).then(dirSizes => {
            if (parentPath === startPath) {
                startPathSize = dirSizes[''];
                interestingSize = Math.ceil(userInterestingSizeBytes || startPathSize * DEFAULT_OUTLIER_SIZE, 1);
                startSizeString = toMB(startPathSize);
                indentSize = startSizeString.length;
                outputStart(startSizeString, startPath, interestingSize);
            }

            const recursivePromises = Object.keys(dirSizes).map(pathName => {
                const size = dirSizes[pathName];
                const fullPath = path.join(parentPath, pathName);

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

    return checkPath(startPath, 0).then(() => {
        outputRemainingSpace(sizeDisplayed);
        outputTotal();
    });
};
