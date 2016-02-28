'use strict';

import test from 'ava';
import spawn from '../util/spawn';

// This was not working on Travis for some reason:
// spawn('cli.js', ['--help'], {cwd: '..'});

test('--help', async function(t) {
    const output = await spawn('node', ['cli.js', '--help'], {cwd: '..'});
    t.ok(output.stdout.includes('Discover surprisingly large directories.'));
});

test('min size', async function(t) {
    const output = await spawn('node', ['cli.js', '1000', 'test/fixtures'], {cwd: '..'});
    t.same(output.stdout, 'Smaller than 1 MB, nice work!');
});
