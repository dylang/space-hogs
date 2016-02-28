'use strict';

module.exports = function toMB(megabytes) {
    const mb = Math.round(megabytes);
    if (mb === 0) {
        return 0;
    }
    return `${mb} MB`;
};
