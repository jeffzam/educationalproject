import { test } from 'node:test';
import assert from 'node:assert/strict';
import { activities, outcomes, history } from '../src/content.js';
import { labs, defaults, displayInputs } from '../src/models.js';

test('every activity has a unique ID, curriculum record and one experience', () => {
  assert.equal(activities.length, 12);
  assert.equal(new Set(activities.map(a => a.id)).size, 12);
  for (const activity of activities) {
    assert.ok(outcomes.find(outcome=>outcome.id===activity.outcome));
    assert.notEqual(Boolean(labs[activity.id]), Boolean(history[activity.id]));
  }
  for (const outcome of outcomes) {
    if (outcome.status.startsWith('Verified')) {
      assert.ok(outcome.code);
      assert.match(outcome.source, /^https:\/\/(curriculum\.gov\.mt|primaryscience\.skola\.edu\.mt)\/.*#page=\d+$/);
    } else assert.equal(outcome.code, undefined);
  }
});
for (const [id, lab] of Object.entries(labs)) {
  test(id + ' has deterministic, finite results at default and extreme inputs', () => {
    const start = defaults(id);
    assert.deepEqual(lab.run(start),lab.run(start));
    assert.equal(Object.keys(displayInputs(id,start)).length,lab.controls.length);
    for (const extreme of [0,1]) {
      const values = Object.fromEntries(lab.controls.map(([key,,kind,max])=>[key, Array.isArray(kind) ? (extreme?kind.length-1:0) : (extreme?max:kind)]));
      for (const [,value] of lab.run(values)) assert.ok(typeof value === 'string' || Number.isFinite(value));
    }
  });
}
const metric = (id, name, changed) => labs[id].run({...defaults(id),...changed}).find(([key])=>key===name)[1];
test('cart follows constant acceleration and stays still below static friction', () => {
  assert.equal(metric('forces','Distance at 2 s',{angle:0,push:10,friction:0,mass:2}),10);
  assert.equal(metric('forces','Distance at 2 s',{angle:0,push:1,friction:.5,mass:2}),0);
});
test('circuits open and parallel branches receive more current than series', () => {
  assert.equal(metric('electric','Circuit current',{switch:0}),0);
  assert.equal(metric('electric','Circuit current',{switch:1,material:1}),0);
  assert.ok(metric('electric','Current per bulb',{switch:1,pattern:2}) > metric('electric','Current per bulb',{switch:1,pattern:1}));
});
test('water phase boundaries and seasonal geometry respond to controls', () => {
  assert.equal(metric('matter','Bulk state',{temperature:0}),'Ice and liquid');
  assert.equal(metric('matter','Bulk state',{temperature:100}),'Liquid and gas');
  assert.equal(metric('space','Daylight',{tilt:0}),12);
  assert.ok(metric('space','Daylight',{orbit:91}) > metric('space','Daylight',{orbit:274}));
});
test('barrier reduces exposure and the model reports cost and clamps water level', () => {
  assert.ok(metric('flood','Exposed buildings / assets',{barrier:1}) < metric('flood','Exposed buildings / assets',{}));
  assert.equal(metric('flood','Cost',{barrier:1,wetland:1}),600);
  assert.equal(metric('flood','Residual water level',{barrier:2,wetland:1}),0);
});
test('conservation, storage, greening and species loss affect model outputs', () => {
  assert.ok(metric('water','Shortfall',{save:30}) < metric('water','Shortfall',{}));
  assert.ok(metric('solar','Grid requirement',{solar:15,battery:25}) < metric('solar','Grid requirement',{solar:15,battery:0}));
  assert.ok(metric('urban','Runoff score',{green:50}) < metric('urban','Runoff score',{}));
  assert.equal(metric('ecosystem','Owls',{owls:0}),0);
});
