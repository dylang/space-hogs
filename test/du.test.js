'use strict';

import test from 'ava';
import du from '../util/du';

test('du', async function(t) {
    const output = await du('./fixtures');
    t.same(output, {'-': 0.00390625, '': 0.0078125});
});
