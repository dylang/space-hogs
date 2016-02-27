'use strict';

const execa = require('execa');
const throat = require('throat')(4);

module.exports = function () {
    const args = arguments;
    return throat(() => {
        return execa.apply(null, args);
    });
};
