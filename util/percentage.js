'use strict';

function percentage(num) {
    const MAX_CHARACTERS = 4;
    const relativePercentage = Math.ceil(num * 100 / (100 / MAX_CHARACTERS));

    return `[${'▒'.repeat(relativePercentage)}${' '.repeat(MAX_CHARACTERS - relativePercentage)}]`;
}

module.exports = percentage;
