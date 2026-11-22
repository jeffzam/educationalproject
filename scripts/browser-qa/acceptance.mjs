import { activities } from '/src/content.js';

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
async function clickAndNavigate(selector) {
  const changed=new Promise(resolve=>frame.contentWindow.addEventListener('hashchange',resolve,{once:true}));
  click(selector);
  await changed;
}
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
  ['All twelve activities render their investigation and evidence controls',async()=>{
    for (const activity of activities) {
      await view(activity.group+'/'+activity.id);
      contains('main h1',activity.question);
      element('#simulation');
      element('#notebook');
      if (activity.group==='history') element('#history-mission');
      else element('#variables');
    }
  }],
  ['Incomplete evidence and an empty curriculum search receive clear messages',async()=>{
    await view('outcomes');
    write('#filters input[name="query"]','nonexistent test query');
    contains('#filter-status','0 outcomes found');
    contains('#matches','No outcomes match these filters.');
    assert(element('#planner button').disabled,'Planner accepted an empty outcome list');
    await view('future/water');
    for (const name of ['prediction','observations','explanation','reflection']) {
      write('#notebook [name="'+name+'"]','Fictional checkpoint response.');
    }
    element('#notebook').requestSubmit();
    contains('#status','Record at least one trial before submitting.');
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
    let printed=false;
    frame.contentWindow.print=()=>{printed=true;};
    click('#review [data-print]');
    assert(printed,'Print dialog was not requested');
    contains('#review .printable','Malta 2050 Planning Report');
  }],
  ['Malta 2050 compares selected plans across a reload',async()=>{
    frame.style.width='390px';
    await view('future/solar');
    contains('main','4.3b');
    click('[data-run]');
    write('#variables [name="solar"]','10');
    click('[data-run]');
    write('#variables [name="solar"]','15');
    click('[data-run]');
    write('#plan-comparison [name="baseline"]','1','change');
    contains('.plan-result','Solar size (MW): 10 → 15');
    contains('.plan-result','+3250 €k');
    await reload();
    contains('.plan-result','Trial 2 and Trial 3');
    assert(app().documentElement.scrollWidth<=app().documentElement.clientWidth,'Plan table caused horizontal overflow');
    click('[data-undo]');
    contains('.plan-result','Trial 1 and Trial 2');
    await view('future/urban');
    contains('main','SCI LOF 7.2 · item 18');
    contains('main','Real context: Landscaping in Maltese towns');
    frame.style.width='';
  }],
  ['Five-minute demonstration connects its three outcomes to live teacher evidence',async()=>{
    await view('home');
    await clickAndNavigate('[data-demo]');
    click('[data-run]');
    click('[data-friction=".5"]');
    click('[data-run]');
    await clickAndNavigate('[data-next]');
    assert(element('#roman-mosaic').hidden,'Mosaic is visible before entering the reconstruction');
    click('[data-portal]');
    assert(!element('#roman-mosaic').hidden,'Mosaic interaction did not appear');
    click('#roman-mosaic');
    assert(element('#source-0').open,'Mosaic evidence did not open');
    click('#source-0 [data-source]');
    await clickAndNavigate('[data-next]');
    click('[data-run]');
    write('#variables [name="barrier"]','1');
    click('[data-run]');
    contains('#plan-comparison','+400 €k');
    await clickAndNavigate('[data-next]');
    contains('#filter-status','3 outcomes found');
    contains('#matches','5.1.3');
    contains('#matches','HIS 7.4');
    contains('#matches','8.3');
    await clickAndNavigate('[data-next]');
    contains('#review','Demo group · live investigation');
    contains('#review','6.71 m less');
    await clickAndNavigate('[data-restart]');
    contains('#trials','Run a trial to record');
    await clickAndNavigate('[data-end]');
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
