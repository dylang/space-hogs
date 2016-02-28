'use strict';

const spawn = require('./spawn');
const path = require('path');
const isString = require('util').isString;

// We use MB throughout the application
function bytesToMB(bytes) {
    return bytes / 1000000; // should this be a power of 2?
}

function duOutputToObject(raw) {
    return raw.split('\n')
        .reduce((acc, line) => {
            const sizeDir = line.split('\t');
            const size = parseInt(sizeDir[0], 10);
            const pathName = sizeDir[1];

            if (sizeDir.length !== 2 || !isString(pathName) || !Number.isInteger(size)) {
                return acc;
            }

            acc[pathName.substr(2)] = bytesToMB(size);
            return acc;
        }, {});
}

module.exports = function du(dir) {
    /*
    du --max-depth=1 to get all folders
        40	./hooks
        24	./info
        248	./logs
        29612	./objects
        816	./refs
        30816	.
    */

    const args = [
        '-d',     // depth
        1,        // 1 = just the immediate children. in space-cows this would be 0.
        '-b'      // use actual bytes used
    ];

    const absoluteCWD = path.resolve(dir);

    return spawn('du', args, {cwd: absoluteCWD}).then(output => {
        return duOutputToObject(output.stdout);
    }).catch(err => {
        console.log('du command failed:', absoluteCWD, err.message);
        return duOutputToObject(err.stdout);
    });
};

module.exports.debug = function debug() {
    const pify = require('pify');
    const which = pify(require('which'));

    const pathPromise = which('du');
    const versionPromise = spawn('du', ['--version']).then(output => output.stdout);
    const helpPromise = spawn('du', ['--help']).then(output => output.stdout);

    return Promise.all([pathPromise, versionPromise, helpPromise]).then(results => {
        console.log('-----------');
        console.log('which du');
        console.log(results[0]);
        console.log('-----------');
        console.log('du --version');
        console.log(results[1]);
        console.log('-----------');
        console.log('du --help');
        console.log(results[2]);
        console.log('-----------');
    });
};
