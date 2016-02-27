'use strict';

import test from 'ava';
import spaceHogs from './';

test('title', async function(t) {
    const output = await spaceHogs('./fixtures');
    t.is(output, undefined);
});
