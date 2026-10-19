import assert from 'node:assert/strict';

const scripts: any[] = [];
const timers = new Map<number, () => void>();
let timerId = 0;
const fakeWindow: any = {
  setTimeout(callback: () => void) {
    timers.set(++timerId, callback);
    return timerId;
  },
  clearTimeout(id: number) {
    timers.delete(id);
  },
};
const fakeDocument: any = {
  createElement() {
    return {
      onload: null,
      onerror: null,
      removed: false,
      remove() {
        this.removed = true;
      },
    };
  },
  head: {
    appendChild(script: any) {
      scripts.push(script);
    },
  },
};
Object.assign(globalThis, { window: fakeWindow, document: fakeDocument });
const { loadTurnstile } = await import('../src/util/turnstile.ts');

const failed = loadTurnstile();
const failedAssertion = assert.rejects(failed);
scripts[0].onerror();
await failedAssertion;
assert.equal(scripts[0].removed, true);

const timedOut = loadTurnstile();
const timeoutAssertion = assert.rejects(timedOut);
const lateLoad = scripts[1].onload;
[...timers.values()][0]();
await timeoutAssertion;
assert.equal(scripts[1].removed, true);

const pending = loadTurnstile();
assert.equal(
  loadTurnstile(),
  pending,
  'Concurrent mounts share the same script',
);
assert.equal(scripts.length, 3);
assert.equal(scripts[2].async, true);
assert.match(scripts[2].src, /render=explicit/);
// A late event from the timed-out script must not clear the new load.
lateLoad();
assert.equal(loadTurnstile(), pending);
const fakeApi = {
  render() {
    return 'widget';
  },
  reset() {},
  remove() {},
  ready() {
    throw new Error('ready() is forbidden for async loading');
  },
};
fakeWindow.turnstile = fakeApi;
scripts[2].onload();
assert.equal(await pending, fakeApi);
assert.equal(await loadTurnstile(), fakeApi);
assert.equal(scripts.length, 3);
assert.equal(timers.size, 0);
console.log(
  'Turnstile async loading, retry, timeout and concurrent mount checks passed.',
);
