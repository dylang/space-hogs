'use strict';

module.exports = function toMB(megabytes) {
    const mb = Math.round(megabytes);
    return `${mb} MB`;
};
