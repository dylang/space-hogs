'use strict';

module.exports = function toMB(size) {
    const mb = Math.round(size / 1000 / 1000);
    if (mb === 0) {
        return 0;
    }
    return `${mb} MB`;
};
