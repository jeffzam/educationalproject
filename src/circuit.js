const components = [
  ['battery','Battery'], ['switch','Switch'], ['resistor','Resistor'],
  ['link','Test material'], ['bulb1','Bulb 1'], ['bulb2','Bulb 2']
];

export const terminals = Object.fromEntries(components.flatMap(([id, name]) => [
  [id+'-a',id==='battery' ? 'Battery positive' : name+' terminal A'],
  [id+'-b',id==='battery' ? 'Battery negative' : name+' terminal B']
]));

export const seriesWires = [
  ['battery-a','switch-a'],['switch-b','resistor-a'],['resistor-b','link-a'],
  ['link-b','bulb1-a'],['bulb1-b','bulb2-a'],['bulb2-b','battery-b']
];
export const parallelWires = [
  ...seriesWires.slice(0,4),['link-b','bulb2-a'],['bulb1-b','battery-b'],['bulb2-b','battery-b']
];
export const circuitNotes = 'The workbench uses ideal wires and battery, fixed 12 Ω bulbs, and a steady direct current. It flags a direct short circuit instead of simulating a real battery heating or failing.';

export function connectWire(wires, a, b) {
  if (!Object.hasOwn(terminals,a) || !Object.hasOwn(terminals,b) || a===b) return wires;
  if (wires.some(w=>w.includes(a) && w.includes(b))) return wires;
  return [...wires,[a,b]];
}

export function solveCircuit({ voltage, battery, resistance, material, switch: closed }, wires) {
  const roots = new Map(Object.keys(terminals).map(key=>[key,key]));
  const root = key => {
    while (roots.get(key)!==key) key = roots.get(key);
    return key;
  };
  const join = ([a,b]) => { if (roots.has(a) && roots.has(b)) roots.set(root(a),root(b)); };
  wires.forEach(join);
  const parts = [['switch',closed ? 0 : Infinity],['resistor',resistance],['link',[0,Infinity,15][material]],['bulb1',12],['bulb2',12]];
  parts.forEach(([id,ohms])=>{if (ohms===0) join([id+'-a',id+'-b']);});
  const positive = root('battery-a'), negative = root('battery-b');
  if (!battery) return { status:'Battery removed', current:0, powers:[0,0] };
  if (positive===negative) return { status:'Short circuit · remove the direct connection', current:null, powers:[0,0] };
  const edges = parts.filter(([,ohms])=>Number.isFinite(ohms) && ohms>0).map(([id,ohms])=>({
    id, a:root(id+'-a'), b:root(id+'-b'), ohms
  }));
  const neighbours = new Map([...new Set(roots.keys())].map(key=>[key,[]]));
  edges.forEach(({a,b})=>{ if (a!==b) { neighbours.get(a).push(b); neighbours.get(b).push(a); } });
  const reachable = start => {
    const seen=new Set([start]);
    for (const node of seen) neighbours.get(node).forEach(next=>seen.add(next));
    return seen;
  };
  const powered = reachable(positive);
  if (!powered.has(negative)) return { status:'Open circuit',current:0,powers:[0,0] };
  const unknown = Array.from(powered).filter(node=>node!==positive && node!==negative);
  const index = new Map(unknown.map((node,i)=>[node,i]));
  const matrix = unknown.map(()=>Array(unknown.length+1).fill(0));
  for (const {a,b,ohms} of edges) {
    if (a===b) continue;
    for (const [node,other] of [[a,b],[b,a]]) {
      if (!index.has(node)) continue;
      const row = matrix[index.get(node)];
      const conductance = 1/ohms;
      row[index.get(node)] += conductance;
      if (other===positive) row[unknown.length] += voltage*conductance;
      else if (index.has(other)) row[index.get(other)] -= conductance;
    }
  }
  // Eliminate unknown node potentials in the grounded resistor network.
  for (let column=0; column<unknown.length; column++) {
    const pivot=matrix[column][column];
    for (let j=column; j<=unknown.length; j++) matrix[column][j] /= pivot;
    for (let row=0; row<unknown.length; row++) {
      if (row===column) continue;
      const multiplier=matrix[row][column];
      for (let j=column; j<=unknown.length; j++) matrix[row][j] -= multiplier*matrix[column][j];
    }
  }
  const potential = key=>key===positive ? voltage : index.has(key) ? matrix[index.get(key)].at(-1) : 0;
  const current = edges.reduce((total,{a,b,ohms})=> {
    if (a!==positive && b!==positive) return total;
    return total + Math.abs(potential(a)-potential(b))/ohms;
  },0);
  const powers = edges.filter(({id})=>id.startsWith('bulb')).map(({a,b,ohms})=>(potential(a)-potential(b))**2/ohms);
  return { status:'Closed circuit', current, powers };
}

export function circuitResults(settings,wires) {
  const { status,current,powers } = solveCircuit(settings,wires);
  const rounded = value => Math.round(value*100)/100;
  return [
    ['Circuit status',status,''],['Battery current',current===null ? 'Unavailable' : rounded(current),current===null ? '' : 'A'],
    ['Bulb 1 power',rounded(powers[0]),'W'],['Bulb 2 power',rounded(powers[1]),'W']
  ];
}
