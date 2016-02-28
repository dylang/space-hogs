'use strict';

// I was getting errors when spawning too many instances at once
// throat is going to limit to the number of cpu's
const cpuCount = require('os').cpus().length;
const throat = require('throat')(cpuCount);
const execa = require('execa');

module.exports = function () {
    const args = arguments;
    return throat(() => {
        return execa.apply(null, args);
    });
};
