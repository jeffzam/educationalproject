const frame = document.querySelector('#app');
const log = document.querySelector('#results');
const summary = document.querySelector('#summary');
const app = () => frame.contentDocument;
const assert = (condition,message) => { if (!condition) throw new Error(message); };
const element = selector => {
  const found = app().querySelector(selector);
  assert(found,'Missing '+selector);
  return found;
};
const text = selector => element(selector).textContent;
const contains = (selector,phrase) => assert(text(selector).includes(phrase),selector+' is missing '+phrase);
const click = selector => element(selector).click();
const write = (selector,value,event='input') => {
  const control = element(selector);
  control.value = value;
  control.dispatchEvent(new frame.contentWindow.Event(event,{bubbles:true}));
};
const waitForLoad = () => new Promise(resolve=>frame.addEventListener('load',resolve,{once:true}));
async function load(path) {
  const done=waitForLoad();
  frame.src=path;
  await done;
}
async function view(route) {
  if (frame.contentWindow.location.hash==='#'+route) return;
  const changed=new Promise(resolve=>frame.contentWindow.addEventListener('hashchange',resolve,{once:true}));
  frame.contentWindow.location.hash=route;
  await changed;
}
async function reload() {
  const done=waitForLoad();
  frame.contentWindow.location.reload();
  await done;
}

const checks = [
  ['All seven navigation destinations',async()=>{
    const pages = {
      science:'Science Lab 360',history:'Time Portal Malta',future:'Malta 2050',
      outcomes:'Learning Outcomes Engine',educator:'Educator dashboard',
      student:'Choose an investigation',resources:'Teaching materials'
    };
    for (const [route,heading] of Object.entries(pages)) {
      await view(route);
      contains('main h1',heading);
    }
  }],
  ['Forces evidence and keyboard focus at phone width',async()=>{
    frame.style.width='390px';
    await view('science/forces');
    assert(app().documentElement.scrollWidth<=app().documentElement.clientWidth,'Horizontal overflow');
    click('[data-jump-variables]');
    assert(app().activeElement===element('#variables input'),'Focus missed the controls');
    write('#force-prediction','Friction should slow the cart.');
    click('[data-friction=".15"]');
    click('[data-run]');
    click('[data-friction=".5"]');
    click('[data-run]');
    contains('.trial-comparison','6.71 m less');
    await reload();
    assert(element('#force-prediction').value==='Friction should slow the cart.','Prediction was lost');
    contains('.trial-comparison','The other settings stayed fixed.');
    frame.style.width='';
  }],
  ['Medieval Mdina portal and keyboard sequence',async()=>{
    await view('history/mdina');
    click('[data-view="1"]');
    click('[data-portal]');
    contains('#mdina-stop','Market stall · Educational reconstruction');
    click('#mdina-object');
    assert(element('#source-1').open,'Evidence remained closed');
    assert(app().activeElement===element('#source-1 summary'),'Evidence did not get focus');
    element('#simulation').dispatchEvent(new frame.contentWindow.KeyboardEvent('keydown',{key:'ArrowRight'}));
    contains('#mdina-stop','Workshop');
  }],
  ['Motion preference is available and persists after reload',async()=>{
    await view('science/matter');
    const root=app().documentElement;
    if (root.dataset.motion!=='reduced') click('#motion');
    assert(root.dataset.motion==='reduced','Reduced motion did not take effect');
    assert(element('#motion').getAttribute('aria-pressed')==='true','Motion state is missing from the control');
    await reload();
    assert(app().documentElement.dataset.motion==='reduced','Reduced motion preference was lost');
    click('#motion');
    assert(app().documentElement.dataset.motion==='full','Motion could not be re-enabled');
  }],
  ['Water assignment outcome remains attached to student evidence',async()=>{
    await view('outcomes');
    write('#filters select[name="year"]','9');
    contains('#filter-status','1 outcome found');
    element('#planner').requestSubmit();
    const link=element('#lesson a[href*="water-conservation"]');
    assert(link.href.includes('outcome=water-conservation'),'Outcome missing from assignment link');
    await view(new URL(link.href).hash.slice(1));
    contains('main','Real context: Water in Malta');
    click('[data-source="0"]');
    click('[data-run]');
    for (const name of ['prediction','observations','explanation','reflection']) {
      write('#notebook [name="'+name+'"]','Fictional lesson evidence.');
    }
    element('#notebook').requestSubmit();
    await view('educator');
    contains('#review','3.2h');
    contains('#review','energywateragency.gov.mt/water');
    element('#assessment').requestSubmit();
    assert(app().activeElement===element('#assessment button'),'Teacher review lost keyboard focus');
  }]
];

const key='malta-learningverse-v1';
const backup=localStorage.getItem(key);
let passed=0;
try {
  localStorage.removeItem(key);
  await load('/');
  for (const [title,check] of checks) {
    const entry=document.createElement('li');
    log.append(entry);
    try {
      await check();
      entry.textContent='Passed · '+title;
      passed++;
    } catch (error) {
      entry.dataset.result='failed';
      entry.textContent='Failed · '+title+' · '+error.message;
    }
  }
} finally {
  if (backup===null) localStorage.removeItem(key);
  else localStorage.setItem(key,backup);
  frame.src='about:blank';
  summary.textContent=passed+' of '+checks.length+' browser acceptance checks passed.';
}
