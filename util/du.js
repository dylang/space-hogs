'use strict';

const spawn = require('./spawn');

function toBytes(str) {
    return parseInt(str, 10) * 1000;
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
        return output.stdout.split('\n').reduce( (acc, line) => {
            const sizeDir = line.split('\t');
            acc[sizeDir[1].substr(2)] = toBytes(sizeDir[0]);
            return acc;
        }, {});
    });
};


module.exports.singleDir = function du(dir) {
    return spawn('du', ['-s'], {cwd: dir}).then(output => {
        return toBytes(output.stdout);
    });
};