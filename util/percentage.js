'use strict';

function percentage(num) {
    const max = 4;
    const percent = Math.ceil(num * 100 / (100/max));

    return `[${'▒'.repeat(percent)}${' '.repeat(max-percent)}]`;
}

module.exports = percentage;
