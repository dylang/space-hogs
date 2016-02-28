'use strict';

import test from 'ava';
import spawn from '../util/spawn';

test('--help', async function(t) {
    const output = await spawn('cli.js', ['--help'], {cwd: '..'});
    t.ok(output.stdout.includes('Discover surprisingly large directories.'));
});

test('min size', async function(t) {
    const output = await spawn('cli.js', ['1000', 'test/fixtures'], {cwd: '..'});
    t.ok(output.stdout.includes('space-hogs/test/fixtures'));
});
