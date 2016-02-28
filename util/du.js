'use strict';

const spawn = require('./spawn');
const path = require('path');

// We use MB throughout the application
function kbToMB(str) {
    return parseInt(str, 10) / 1000000;
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
        return output.stdout.split('\n').reduce((acc, line) => {
            const sizeDir = line.split('\t');
            acc[sizeDir[1].substr(2)] = kbToMB(sizeDir[0]);
            return acc;
        }, {});
    }, err => {
        console.log('du command failed:', err.message);
        console.log('attempted:', ['du'].concat(args).join(' '), {cwd: absoluteCWD});
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
