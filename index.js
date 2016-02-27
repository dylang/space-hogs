'use strict';

require('loud-rejection')();
const du = require('./util/du');
const path = require('path');
const toMB = require('./util/nice-size');
const pad = require('pad-left');
const series = require('es6-promise-series');

function percentage(num) {
    const max = 4;
    const percent = Math.ceil(num * 100 / (100/max));
    return `[${'▒'.repeat(percent)}${' '.repeat(max-percent)}]`;
}

module.exports = function (startPath, userInterestingSizeMB) {
    if (typeof startPath !== 'string') {
        startPath = '.';
    }

    startPath = path.join(startPath, '/');

    const userInterestingSizeBytes = parseInt(userInterestingSizeMB, 10) * 1000 * 1000;
    const absolutePath = path.resolve(startPath);

    return du.singleDir(absolutePath).then(startPathSize => {
        let sizeDisplayed = 0;
        const interestingSize = userInterestingSizeBytes || startPathSize / 16.5; //factor I determined to make interesting results
        const startSizeString = toMB(startPathSize);
        const indentSize = startSizeString.length;

        //console.log(startSizeString, absolutePath);
        console.log(`Largest children directories, each larger than ${toMB(interestingSize)}`);

        function checkPath(parentPath) {
            return du(parentPath).then(dirSizes => {

                const recursivePromises = Object.keys(dirSizes).map(pathName => {
                    const size = dirSizes[pathName];
                    const fullPath = path.join(parentPath, pathName);

                    if (!pathName) {
                        // current directory
                        return;
                    }

                    // too small to care
                    if (size < interestingSize) {
                        return;
                    }

                    // don't deep dive hidden dirs
                    if (pathName.startsWith('.')) {
                        sizeDisplayed += size;
                        console.log(`├── ${pad(toMB(size), indentSize, ' ')} ${percentage(size/startPathSize)} ${path.join(path.sep, fullPath.replace(startPath, ''))}`);
                        return;
                    }

                    return checkPath(fullPath).then(resultArray => {
                        //console.log('checkPath results', resultArray);
                        if (resultArray.length === 0) {
                            sizeDisplayed += size;
                            console.log(`├── ${pad(toMB(size), indentSize, ' ')} ${percentage(size/startPathSize)} ${path.join(path.sep, fullPath.replace(startPath, ''))}`);
                        }
                        return size;
                    });

                }).filter(Boolean);

                // series so they return in order, but it is also somehow faster
                return series(recursivePromises);
            });
        }

        // absolutePath
        return checkPath(startPath).then(() => {
            const remainingSpace = toMB(startPathSize - sizeDisplayed);
            if (remainingSpace !== 0) {
                console.log(`└── ${pad(remainingSpace, indentSize, ' ')} ${percentage(sizeDisplayed/startPathSize)} (everything else)`);
            }
            console.log(`    ${pad(startSizeString, indentSize, ' ')} Total`)
        });
    });
};
