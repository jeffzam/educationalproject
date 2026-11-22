import { test } from 'node:test';
import assert from 'node:assert/strict';
import { activities, outcomes, history, mdinaStops } from '../src/content.js';
import { labs, compareForceTrials, defaults, displayInputs } from '../src/models.js';
import { circuitResults, connectWire, parallelWires, seriesWires, solveCircuit } from '../src/circuit.js';
import { knightsAnswer, knightsEvents, missionEvidence, moveTimeline, romanClaims } from '../src/history-missions.js';

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
test('each Mdina stop points to distinct evidence and supports comparison across eras', () => {
  assert.equal(mdinaStops.length, history.mdina.sources.length);
  assert.equal(new Set(mdinaStops.map(stop => stop.source)).size, mdinaStops.length);
  for (const stop of mdinaStops) {
    assert.ok(history.mdina.sources[stop.source]?.[2].startsWith('https://'));
    assert.ok(stop.present && stop.medieval && stop.compare);
  }
});
test('history missions keep the selected order, source judgements and comparisons for review', () => {
  const swapped=moveTimeline(knightsAnswer,0,1);
  assert.equal(swapped[0],'grant');
  assert.equal(knightsAnswer[0],'rhodes');
  assert.equal(moveTimeline(swapped,0,-1),swapped);
  assert.ok(missionEvidence('knights',{order:swapped}).startsWith('1. '+knightsEvents.grant));
  assert.match(missionEvidence('roman',{choices:['yes','no','']}),/Every Roman family.*Evidence is insufficient/);
  assert.ok(missionEvidence('roman',{choices:['yes','no','']}).includes(romanClaims[0].text));
  assert.match(missionEvidence('mdina',{gate:'An entrance can control access.'}),/Town gate.*An entrance/);
  assert.equal(missionEvidence('mdina',undefined),'');
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
test('cart comparison reports recorded distance and distinguishes a fair test from several changed settings', () => {
  const trial = settings => {
    const inputs = {...defaults('forces'), ...settings};
    return { inputs: displayInputs('forces', inputs), results: labs.forces.run(inputs) };
  };
  const smoother = trial({friction:.15});
  const rougher = trial({friction:.5});
  assert.deepEqual(compareForceTrials(smoother,rougher), {
    first:9.2,second:2.49,difference:-6.71,changed:[['Friction coefficient',.15,.5]]
  });
  assert.equal(compareForceTrials(smoother,smoother).changed.length,0);
  assert.equal(compareForceTrials(smoother,trial({friction:.5,mass:6})).changed.length,2);
});
test('circuits open and parallel branches receive more current than series', () => {
  assert.equal(metric('electric','Circuit current',{switch:0}),0);
  assert.equal(metric('electric','Circuit current',{switch:1,material:1}),0);
  assert.ok(metric('electric','Current per bulb',{switch:1,pattern:2}) > metric('electric','Current per bulb',{switch:1,pattern:1}));
});
test('workbench solver follows wiring instead of a selected circuit arrangement', () => {
  const settings = {...defaults('electric'),switch:1};
  const series = solveCircuit(settings,seriesWires);
  const parallel = solveCircuit(settings,parallelWires);
  assert.ok(Math.abs(series.current - 6/27) < 1e-10);
  assert.ok(Math.abs(parallel.current - 6/9) < 1e-10);
  assert.ok(parallel.powers.every((power,i)=>power>series.powers[i]));
  assert.equal(solveCircuit(settings,seriesWires.slice(0,-1)).status,'Open circuit');
  assert.equal(solveCircuit({...settings,material:1},seriesWires).current,0);
  assert.equal(solveCircuit({...settings,switch:0},parallelWires).current,0);
  assert.equal(solveCircuit({...settings,battery:0},parallelWires).status,'Battery removed');
  assert.equal(circuitResults(settings,[['battery-a','battery-b']])[1][1],'Unavailable');
});
test('workbench wires are undirected and reject duplicate and self connections', () => {
  const wires=connectWire([],'battery-a','bulb1-a');
  assert.equal(connectWire(wires,'bulb1-a','battery-a'),wires);
  assert.equal(connectWire(wires,'resistor-a','resistor-a'),wires);
  assert.equal(connectWire(wires,'unknown','resistor-a'),wires);
  const loop=connectWire(wires,'bulb1-b','battery-b');
  const { current,powers } = solveCircuit({...defaults('electric'),switch:0},loop);
  assert.equal(current,.5);
  assert.deepEqual(powers,[3,0]);
});
test('water phase boundaries and seasonal geometry respond to controls', () => {
  assert.equal(metric('matter','Bulk state',{temperature:0}),'Ice and liquid');
  assert.equal(metric('matter','Bulk state',{temperature:100}),'Liquid and gas');
  assert.equal(metric('space','Daylight',{tilt:0}),12);
  assert.ok(metric('space','Daylight',{orbit:91}) > metric('space','Daylight',{orbit:274}));
  assert.equal(metric('space','Malta sky',{hour:12}),'Day');
  assert.equal(metric('space','Malta sky',{hour:0}),'Night');
  assert.equal(metric('space','Malta sky',{hour:6,orbit:0}),'Sun on the horizon');
  assert.equal(metric('space','Visible Moon lit',{moon:0}),0);
  assert.equal(metric('space','Visible Moon lit',{moon:29.53/2}),100);
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
