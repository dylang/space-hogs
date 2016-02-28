'use strict';

const spawn = require('./spawn');

// We use MB throughout the application
function kbToMB(str) {
    return parseInt(str, 10) / 1000;
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

    return spawn('du', ['--max-depth=1'], {cwd: dir}).then(output => {
        return output.stdout.split('\n').reduce((acc, line) => {
            const sizeDir = line.split('\t');
            acc[sizeDir[1].substr(2)] = kbToMB(sizeDir[0]);
            return acc;
        }, {});
    });
};
