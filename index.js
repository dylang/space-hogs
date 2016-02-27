'use strict';

require('loud-rejection')();

const du = require('./util/du');
const percentage = require('./util/percentage');
const toMB = require('./util/nice-size');
const path = require('path');
const pad = require('pad-left');
const series = require('es6-promise-series');


module.exports = function (startPath, userInterestingSizeMB) {
    if (typeof startPath !== 'string') {
        startPath = '.';
    }

    startPath = path.join(startPath, '/');

    const userInterestingSizeBytes = parseInt(userInterestingSizeMB, 10) * 1000 * 1000;
    const absolutePath = path.resolve(startPath);

    let sizeDisplayed = 0;
    let interestingSize = 0;
    let startPathSize = 0;
    let indentSize = 0;
    let startSizeString = '';

    function outputLargeDirectory(pathname, size) {
        console.log(`├── ${pad(toMB(size), indentSize, ' ')} ${percentage(size / startPathSize)} ${path.join(path.sep, pathname.replace(startPath, ''))}`);
    }

    function outputRemainingSpace(sizeDisplayed) {
        const remainingSpace = toMB(startPathSize - sizeDisplayed);
        if (remainingSpace !== 0) {
            console.log(`└── ${pad(remainingSpace, indentSize, ' ')} ${percentage((startPathSize-sizeDisplayed) / startPathSize)} (everything else)`);
        }
    }

    function outputTotal() {
        console.log(`    ${pad(startSizeString, indentSize, ' ')} Total`)
    }

    function checkPath(parentPath) {

        return du(parentPath).then(dirSizes => {
            if (parentPath === startPath) {
                startPathSize = dirSizes[''];
                interestingSize = userInterestingSizeBytes || startPathSize / 16.5; //factor I determined to make interesting results
                startSizeString = toMB(startPathSize);
                indentSize = startSizeString.length;

                console.log(startSizeString, absolutePath);
                console.log(`Largest children directories, each larger than ${toMB(interestingSize)}`);
            }

            const recursivePromises = Object.keys(dirSizes).map(pathName => {
                const size = dirSizes[pathName];
                const fullPath = path.join(parentPath, pathName);

                // current directory
                if (!pathName) {
                    return;
                }

                // too small to care
                if (size < interestingSize) {
                    return;
                }

                // don't deep dive hidden dirs
                // but since we got this far, log it
                if (pathName.startsWith('.')) {
                    sizeDisplayed += size;
                    outputLargeDirectory(fullPath, size);
                    return;
                }

                return checkPath(fullPath).then(resultArray => {
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

    return checkPath(startPath).then(() => {
        outputRemainingSpace(sizeDisplayed);
        outputTotal();

    });
};
