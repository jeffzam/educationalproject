import { activities, activityOutcomeIds, resolveOutcome, groups, outcomes, history, levels, rubric, floodCase, waterCase, mdinaStops } from './content.js';
import { labs, budget, compareForceTrials, defaults, displayInputs } from './models.js';
import { scene } from './scenes.js';
import { circuitNotes, circuitResults, connectWire, parallelWires, seriesWires, terminals } from './circuit.js';
import { missionEvidence, mountHistoryMission } from './history-missions.js';

const main = document.querySelector('main');
const navigation = [
  ['science','Science Lab 360'],['history','Time Portal Malta'],['future','Malta 2050'],
  ['outcomes','Learning Outcomes'],['educator','Educator'],['student','Student'],['resources','Resources']
];
const reportNames = {science:'Science Investigation Report',history:'Historian’s Evidence Report',future:'Malta 2050 Planning Report'};
const steps = [['science/forces','Test a prediction','Read the sample prediction aloud. Release the cart on the smoother surface, select the rougher surface and release it again. Show the class what changed and what stayed fixed.'],
  ['history/roman','Examine historical evidence','Enter the portal and inspect the mosaic and courtyard records.'],
  ['future/flood','Compare planning decisions','Record a baseline, add a barrier and compare exposed sites and cost.'],
  ['outcomes','Show curriculum links','Reveal the verified outcomes for inquiry, Roman evidence and flooding.'],
  ['educator','Review evidence','Review the cart trials you recorded in minute one, apply the rubric and export the report. A fictional example is available if you skipped the trials.']];
const fields = {
  science: [['prediction','Predict what will happen and why.'],['observations','Describe what you observed.'],['explanation','Explain the results with evidence from your trials.'],['reflection','What would you test next?']],
  history: [['prediction','What do you expect the sources to reveal?'],['observations','Describe what you observed in the sources.'],['explanation','Make a claim and name the evidence supporting it.'],['reflection','Which details are uncertain, and what would help verify them?']],
  future: [['prediction','Predict which intervention will help and why.'],['observations','Compare the baseline and a changed scenario.'],['explanation','Propose a plan. Justify its costs and trade-offs with evidence.'],['reflection','What limitation would you investigate before using this plan?']]
};
const stateKey = 'malta-learningverse-v1';
const initial = () => ({ drafts:{}, submissions:[], motion:null });
let storageWarning = false;
function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(stateKey));
    return saved ? {...initial(),...saved} : initial();
  } catch {
    storageWarning = true;
    return initial();
  }
}
let state = load();
let demo = -1;
let demoState;
let frame;
let alertTimer;
let refreshAnimation;
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
const motionButton = document.querySelector('#motion');
const reduced = () => state.motion ?? motionPreference.matches;
function announce(message) {
  const toast = document.querySelector('#status');
  toast.textContent = message;
  clearTimeout(alertTimer);
  alertTimer = setTimeout(() => { toast.textContent = ''; }, 4500);
}
function save() {
  if (demo >= 0) return;
  try { localStorage.setItem(stateKey, JSON.stringify(state)); }
  catch { announce('Browser storage is unavailable. Download your report before closing this tab.'); }
}
function syncMotion() {
  document.documentElement.dataset.motion = reduced() ? 'reduced' : 'full';
  motionButton.setAttribute('aria-pressed',String(reduced()));
  refreshAnimation?.();
}
motionButton.addEventListener('click', () => { state.motion = !reduced(); syncMotion(); save(); });
motionPreference.addEventListener('change', syncMotion);
document.addEventListener('visibilitychange',()=>refreshAnimation?.());
syncMotion();

const escapeTable = {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'};
const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => escapeTable[ch]);
const recordOutcome = (activity,record) => resolveOutcome(activity,record.outcomeId || (activity.id==='water' ? 'water' : undefined));
const caseStudyFor = id => id==='flood' ? floodCase : id==='water' ? waterCase : undefined;
const link = (url, label) => '<a href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' + esc(label) + '</a>';
const path = activity => activity.group + '/' + activity.id;
const activityLink = (activity, label = activity.title, outcomeId) => '<a href="#'+path(activity)+(outcomeId ? '?outcome='+encodeURIComponent(outcomeId) : '')+'">'+esc(label)+'</a>';
const intro = (eyebrow,title,description) => '<section class="intro"><p class="eyebrow">'+esc(eyebrow)+'</p><h1>'+esc(title)+'</h1><p class="lede">'+esc(description)+'</p></section>';
const option = (value, label = value) => '<option value="'+esc(value)+'">'+esc(label)+'</option>';

function drawPreviews() {
  main.querySelectorAll('canvas[data-preview]').forEach(canvas => {
    const id = canvas.dataset.preview;
    const values = labs[id] ? defaults(id) : {};
    scene(canvas,id,values,labs[id]?.run(values));
  });
}
function home() {
  main.innerHTML = '<section class="hero"><div class="hero-copy"><p class="eyebrow">Primary & secondary education in Malta</p><h1>Malta<br><em>Learningverse</em></h1><p class="lede">Explore. Experiment. Discover.<br>Demonstrate learning.</p><div class="actions"><a class="button" href="#student">Start exploring</a><button type="button" class="secondary" data-demo>Run the 5-minute demo</button></div></div><div class="hero-art" aria-hidden="true"><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><div class="globe"></div><div class="satellite"></div><i class="spark s1">✦</i><i class="spark s2">✧</i><i class="spark s3">✦</i></div></section><section aria-labelledby="worlds"><div class="section-head"><h2 id="worlds">Explore the learning worlds</h2><a href="#outcomes">Browse curriculum outcomes</a></div><div class="cards">'+Object.entries(groups).map(([id,group]) => '<a class="world '+id+'" href="#'+id+'"><canvas data-preview="'+activities.find(a=>a.group===id).id+'" width="480" height="210" aria-hidden="true"></canvas><div><p class="eyebrow">'+group.label+'</p><h3>'+group.title+'</h3><p>'+group.description+'</p></div></a>').join('')+'</div></section>';
  drawPreviews();
}
function catalog(groupId) {
  const group = groups[groupId];
  const items = activities.filter(a => a.group === groupId);
  main.innerHTML = intro(group.label,group.title,group.description)+'<div class="cards">'+items.map(a=>'<a class="world '+groupId+'" href="#'+path(a)+'"><canvas data-preview="'+a.id+'" width="480" height="210" aria-hidden="true"></canvas><div><p class="eyebrow">'+group.label+'</p><h2>'+esc(a.title)+'</h2><p>'+esc(a.question)+'</p></div></a>').join('')+'</div>';
  drawPreviews();
}
function outcomeCard(outcome) {
  const items = activities.filter(a=>activityOutcomeIds(a).includes(outcome.id));
  return '<article class="panel outcome"><p class="eyebrow">'+outcome.stage+' · Year '+outcome.year+' · '+esc(outcome.subject)+'</p><h3>'+esc(outcome.code || outcome.strand)+'</h3><p>'+esc(outcome.summary)+'</p><p class="muted">Platform paraphrase · '+esc(outcome.strand)+'</p><p>'+esc(outcome.status)+'</p>'+(outcome.source ? '<p>'+link(outcome.source,outcome.document)+'<br><small>'+esc(outcome.version)+'</small></p>' : '')+'<p class="actions">'+items.map(a=>activityLink(a,a.title,outcome.id)).join('')+'</p></article>';
}

function outcomePage(params) {
  main.innerHTML = intro('Curriculum','Learning Outcomes Engine','Find an outcome, match it to an activity and build a differentiated lesson.')+
  '<form class="panel filters" id="filters"><label>Search outcome, code or strand<input type="search" name="query"></label><label>Stage<select name="stage">'+option('','All stages')+option('Primary')+option('Secondary')+'</select></label><label>Year group<select name="year">'+option('','All years')+[...new Set(outcomes.map(o=>o.year))].sort((a,b)=>a-b).map(y=>option(y,'Year '+y)).join('')+'</select></label><label>Subject<select name="subject">'+option('','All subjects')+[...new Set(outcomes.map(o=>o.subject))].map(s=>option(s)).join('')+'</select></label><label>Strand<select name="strand">'+option('','All strands')+[...new Set(outcomes.map(o=>o.strand))].map(s=>option(s)).join('')+'</select></label><label>Verification<select name="verification">'+option('','All records')+option('verified','Verified sources')+option('pending','Proposed objectives')+'</select></label></form><p id="filter-status" class="muted filter-status" role="status"></p><div class="layout"><div id="matches" class="stack"></div><aside class="panel"><h2>Plan a lesson</h2><form id="planner" class="stack"><label>Outcome<select name="outcome" required></select></label><label>Activity<select name="activity" required></select></label><label>Learning level<select name="level">'+Object.keys(levels).map(l=>option(l)).join('')+'</select></label><label>Duration<select name="duration">'+[20,30,40,60].map(m=>option(m,m+' minutes')).join('')+'</select></label><button>Generate lesson plan</button></form></aside></div><section id="lesson" class="stack"></section>';
  const filters = main.querySelector('#filters');
  const planner = main.querySelector('#planner');
  planner.elements.level.value = 'Core';
  planner.elements.duration.value = '40';
  const refreshActivities = () => {
    planner.elements.activity.innerHTML = activities.filter(a=>activityOutcomeIds(a).includes(planner.elements.outcome.value)).map(a=>option(a.id,a.title)).join('');
  };
  function search(selected) {
    const f = filters.elements;
    const query = f.query.value.trim().toLowerCase();
    const matches = outcomes.filter(o=> (!f.stage.value || f.stage.value===o.stage) && (!f.year.value || Number(f.year.value)===o.year) &&
    (!f.subject.value || f.subject.value===o.subject) && (!f.strand.value || f.strand.value===o.strand) &&
    (!f.verification.value || (o.source ? 'verified' : 'pending')===f.verification.value) &&
    [o.summary,o.code,o.subject,o.strand].join(' ').toLowerCase().includes(query));
    main.querySelector('#matches').innerHTML = matches.map(outcomeCard).join('') || '<p class="panel">No outcomes match these filters.</p>';
    main.querySelector('#filter-status').textContent = matches.length+' '+(matches.length===1 ? 'outcome' : 'outcomes')+' found';
    planner.elements.outcome.innerHTML = matches.map(o=>option(o.id,(o.code || 'Proposed')+' · '+o.strand)).join('');
    if (matches.some(o=>o.id===selected)) planner.elements.outcome.value = selected;
    refreshActivities();
    planner.querySelector('button').disabled = !matches.length;
  }
  filters.addEventListener('input',()=>search(planner.elements.outcome.value));
  planner.elements.outcome.addEventListener('change',refreshActivities);
  const preferred = activities.find(a=>a.id===params.get('activity'));
  search(preferred?.outcome);
  if (preferred) planner.elements.activity.value=preferred.id;
  planner.addEventListener('submit', event => {
    event.preventDefault();
    const { activity, level, duration } = Object.fromEntries(new FormData(planner));
    const a = activities.find(item=>item.id===activity);
    const o = resolveOutcome(a,planner.elements.outcome.value);
    const time = Number(duration);
    const sections = [
      ['Learning intention',o.summary],['Success criteria',o.criterion || 'State an idea before investigating. Compare relevant evidence. Explain a conclusion and identify a limitation.'],
      ['Prior knowledge','What do you expect to see? What experience or evidence informs your prediction?'],
      ['Teaching sequence',Math.floor(time*.2)+' min introduce and predict · '+Math.floor(time*.55)+' min investigate and compare · '+(time-Math.floor(time*.2)-Math.floor(time*.55))+' min explain and reflect.'],
      ['Investigation',o.enquiry || a.task],['Differentiation · '+level,levels[level]],['Discussion','Which result or source supports your claim? Could there be another explanation?'],
      ['Student reflection','What changed your thinking? What evidence would you collect next?'],['Proposed formative rubric',rubric.join(' · ')+' · Use emerging, developing or secure for each criterion.'],
      ['Follow-up','Transfer the idea to a second example. Ask a partner to check that the evidence supports the explanation.']
    ];
    const share = new URL(location.href);
    share.hash = path(a)+'?'+new URLSearchParams({level,outcome:o.id});
    const content = main.querySelector('#lesson');
    content.innerHTML = '<article class="panel printable"><p class="eyebrow">Lesson plan · '+duration+' minutes</p><h2>'+esc(a.title)+'</h2>'+sections.map(([key,value])=>'<h3>'+esc(key)+'</h3><p>'+esc(value)+'</p>').join('')+'<p>'+esc(o.status)+(o.source?' · '+link(o.source,o.document):'')+'</p><div class="actions no-print">'+activityLink(a,'Preview activity',o.id)+'<a href="'+esc(share.href)+'">Open student assignment</a><button type="button" data-copy>Copy assignment link</button><button type="button" data-print>Print / save PDF</button><button type="button" data-download>Download plan</button></div><label class="no-print">Assignment link<input readonly value="'+esc(share.href)+'"></label></article>';
    content.querySelector('[data-print]').onclick = () => print();
    content.querySelector('[data-copy]').onclick = async () => {
      try { await navigator.clipboard.writeText(share.href); announce('Assignment link copied.'); }
      catch { content.querySelector('input').select(); announce('Copy the selected assignment link.'); }
    };
    content.querySelector('[data-download]').onclick = () => download(a.id+'-lesson.txt',reportText(a.title,[...sections,['Curriculum', curriculumText(o)]]));
    content.scrollIntoView();
  });
}

function download(name, text, type = 'text/plain') {
  const url = URL.createObjectURL(new Blob([text],{type:type+';charset=utf-8'}));
  const a = document.createElement('a');
  a.href = url; a.download = name;
  document.body.append(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),2000);
}
const reportText = (title, rows) => [title, ...rows.map(([k,v])=>k+'\n'+(v || '—'))].join('\n\n');
const curriculumText = o => [o.code,o.summary,o.status,o.document,o.source].filter(Boolean).join(' · ');
const metricText = metrics => metrics.map(([label,value,unit])=>label+': '+value+(unit?' '+unit:'')).join('\n');
function forceComparison(trials) {
  const { first, second, difference, changed } = compareForceTrials(trials.at(-2), trials.at(-1));
  const travelled = difference === 0 ? 'The recorded distances were the same.' :
    'The cart travelled '+Math.abs(difference)+' m '+(difference > 0 ? 'farther' : 'less')+' in the later trial.';
  const inputs = changed.map(([name, before, after]) => name+' changed from '+before+' to '+after+'.').join(' ');
  const interpretation = changed.length === 0 ? 'No settings changed. This pair repeats the same test.' :
    changed.length === 1 ? 'The other settings stayed fixed.' :
    'Several settings changed. Change one setting at a time to see its individual effect.';
  return 'Trial '+(trials.length-1)+': '+first+' m. Trial '+trials.length+': '+second+' m. '+[travelled,inputs,interpretation].filter(Boolean).join(' ');
}
function evidenceRows(activity, record) {
  const o = recordOutcome(activity,record);
  return [['Activity',activity.title],['Learning outcome (platform paraphrase)',curriculumText(o)],['Learning level',record.level],
    ['Learner',record.learner || 'Anonymous learner'],...fields[activity.group].map(([key,label])=>[label,record[key]]),
    ['Recorded trials and variables',record.trials.map((trial,index)=>'Trial '+(index+1)+'\n'+Object.entries(trial.inputs).map(([label,value])=>label+': '+value).join('; ')+'\n'+metricText(trial.results)).join('\n\n')],
    ['Sources examined',record.sources.flatMap(index => {
      const row = history[activity.id]?.sources[index] || caseStudyFor(activity.id);
      return row ? [row[0]+' — '+row[2]] : [];
    }).join('\n')],['Interpreter questions',record.questions.join('\n')],['Model assumptions',activity.id==='electric' && record.trials.some(trial=>Object.hasOwn(trial.inputs,'Wiring')) ? labs.electric.notes+' '+circuitNotes : labs[activity.id]?.notes || 'Scene and character dialogue are educational interpretations.'],
    ['Teacher judgement',record.review?.judgement || 'Awaiting teacher review'],['Proposed rubric',record.review?.scores?.map((score,i)=>rubric[i]+': '+score).join('\n')],
    ['Teacher feedback / next steps',record.review?.feedback],['Suggested next step','Compare your conclusion with another trial or source and explain what would strengthen it.'],
    ...(activity.id==='forces' && record.trials.length>1 ? [['Latest trial comparison',forceComparison(record.trials)]] : []),
    ...(activity.group==='history' ? [['History mission evidence',missionEvidence(activity.id,record.mission)]] : [])];
}
const newDraft = a => ({
  learner:'',prediction:'',observations:'',explanation:'',reflection:'',
  trials:[],sources:[],questions:[],values:labs[a.id] ? defaults(a.id) : {},level:'Core'
});
const exportEvidence = (a,record) => download(a.id+'-report.txt',reportText(reportNames[a.group], evidenceRows(a,record)));
function inputSettings([key,label,kind,max,step], values) {
  return '<label class="setting"><span>'+esc(label)+'</span>'+(Array.isArray(kind)
    ? '<select name="'+key+'">'+kind.map((text,i)=>option(i,text)).join('')+'</select>'
    : '<span class="range"><input name="'+key+'" type="range" min="'+kind+'" max="'+max+'" step="'+step+'" value="'+values[key]+'"><output>' + values[key] + '</output></span>')+'</label>';
}

function investigation(a, params) {
  const d = state.drafts[a.id] ??= newDraft(a);
  if (Object.hasOwn(levels,params.get('level'))) d.level = params.get('level');
  const lab = labs[a.id];
  const dossier = history[a.id];
  const forces = a.id === 'forces';
  const electric = a.id === 'electric';
  const mdina = a.id === 'mdina';
  const o = resolveOutcome(a,params.get('outcome'));
  const caseStudy = caseStudyFor(a.id);
  const title = reportNames[a.group];
  main.innerHTML = '<p class="crumb"><a href="#'+a.group+'">'+groups[a.group].title+'</a></p>'+
    intro(a.title,a.question,o.enquiry || a.task)+
    '<div class="layout investigate"><section class="stack">'+
    (forces ? '<section class="panel"><h2>Make a prediction</h2><label>Predict what will happen and why.<textarea id="force-prediction" name="prediction" form="notebook" rows="2" maxlength="3000" required>'+esc(d.prediction)+'</textarea></label></section>' : '')+
    '<div class="panel visual"><div class="scene-stage"><canvas id="simulation" width="720" height="300" role="img" aria-label="'+esc(a.title+' illustration. Equivalent evidence is available as text below.')+'"></canvas>'+(mdina ? '<button type="button" class="scene-object" id="mdina-object">Inspect town gate</button>' : '')+'</div><div class="scene-controls">'+(lab ? '<button data-run>'+ (forces ? 'Release cart' : 'Run and record scenario')+'</button><button class="secondary" data-reset>Restore starting controls</button><button class="secondary" type="button" data-jump-variables>Go to variables</button>' : '<button data-portal>Enter time portal</button><button class="secondary" data-view="-1">'+(mdina ? 'Previous stop' : 'Look left')+'</button><button class="secondary" data-view="1">'+(mdina ? 'Next stop' : 'Look right')+'</button>')+'</div>'+
    (forces ? '<div class="surface-controls"><p>Test friction while keeping the other settings fixed.</p><div class="actions"><button type="button" class="secondary" data-friction=".15" aria-pressed="false">Smoother surface</button><button type="button" class="secondary" data-friction=".5" aria-pressed="false">Rougher surface</button></div></div>' : '')+
    (mdina ? '<div class="tour-notes"><h2 id="mdina-stop"></h2><p id="mdina-description"></p><p id="mdina-compare" class="muted"></p><p class="muted">Use the buttons or focus the scene and press the left or right arrow key.</p></div>' : '')+'</div>'+
    (electric ? '<section class="panel"><div class="section-head"><h2>Circuit workbench</h2><button class="secondary" type="button" id="circuit-mode" aria-pressed="false">Build your own circuit</button></div><div id="circuit-builder" hidden><p>Choose two terminals to add a wire. Open the switch while you build, then close it to test the circuit.</p><div class="circuit-terminals">'+Object.entries(terminals).map(([id,name])=>'<button type="button" class="secondary" data-terminal="'+id+'" aria-pressed="false">'+name+'</button>').join('')+'</div><div class="actions"><button class="secondary" type="button" data-wire-template="series">Load series example</button><button class="secondary" type="button" data-wire-template="parallel">Load parallel example</button><button class="secondary" type="button" id="clear-wires">Clear wires</button></div><p id="wire-status" class="muted" aria-live="polite"></p><ul id="wires"></ul><details><summary>Read workbench assumptions</summary><p>'+esc(circuitNotes)+'</p></details></div></section>' : '')+
    (lab ? '<div class="panel"><div class="section-head"><h2>Model results</h2><span class="muted" id="budget"></span></div><div id="metrics" class="metrics"></div><details><summary>Read model assumptions</summary><p>'+esc(lab.notes)+'</p></details></div><section class="panel"><h2>Recorded trials</h2><div id="trials"></div></section>' : '<div class="panel"><p class="eyebrow">'+esc(dossier.place)+'</p><h2>Evidence desk</h2><div id="sources"></div><h3>Ask the '+esc(dossier.character.toLowerCase())+'</h3><p class="muted">Scripted fictional interpretation</p><div class="actions">'+['Tell me about your work','What should I compare?','What is uncertain?'].map((q,i)=>'<button class="secondary" data-question="'+i+'">'+q+'</button>').join('')+'</div><p id="reply" aria-live="polite"></p></div>')+
    (dossier ? '<section class="panel" id="history-mission"></section>' : '')+
    (caseStudy ? '<section class="panel"><h2>'+esc(caseStudy[0])+'</h2><p>'+esc(caseStudy[1])+'</p><p>'+link(caseStudy[2],a.id==='flood' ? 'Read the national flood risk assessment' : 'Read the Energy and Water Agency guide')+'</p><button class="secondary" data-source="0">Mark case study examined</button></section>' : '')+
    '</section><aside class="stack"><section class="panel"><h2>Mission brief</h2><p class="eyebrow">Learning outcome</p><p>'+esc(o.summary)+'</p><p class="muted">'+esc(o.status)+'</p>'+(o.source?'<p>'+link(o.source,o.code+' · official source')+'</p>':'')+'<label>Learning level<select id="level">'+Object.keys(levels).map(l=>option(l)).join('')+'</select></label><p id="guidance"></p><details><summary>Get a hint</summary><p>'+esc(a.group==='history' ? 'Ask what survives today. Which part of your claim follows directly from that source?' : 'Compare two trials. What stayed the same, and what changed?')+'</p></details></section>'+
    (lab?'<section class="panel"><h2>Change the variables</h2><form id="variables">'+lab.controls.map(control=>inputSettings(control,d.values)).join('')+'</form></section>':'')+'</aside></div>'+
    '<section class="panel notebook"><div class="section-head"><h2>Investigation notebook</h2><span class="muted">Saved in this browser</span></div><form id="notebook"><label>Anonymous learner ID <small>(optional)</small><input name="learner" maxlength="32" placeholder="e.g. Learner 07" value="'+esc(d.learner)+'"></label><div class="notebook-fields">'+fields[a.group].filter(([key])=>!forces || key!=='prediction').map(([key,label])=>'<label>'+esc(label)+'<textarea name="'+key+'" rows="3" maxlength="3000" required>'+esc(d[key])+'</textarea></label>').join('')+'</div><div class="actions"><button>Submit for local review</button><button type="button" class="secondary" data-export>Download '+esc(title)+'</button></div></form></section>';
  const canvas = main.querySelector('#simulation');
  const level = main.querySelector('#level');
  const guide = main.querySelector('#guidance');
  let historic = false;
  let position = 0;
  let lastTime = 0;
  let active = false;
  let results = [];
  const useBuilder = () => electric && d.circuitMode;
  function draw() {
    scene(canvas,a.id,useBuilder() ? {...d.values, circuitWires:d.circuitWires} : d.values,results,lastTime,historic,position,active);
    if (!mdina) return;
    const stop = mdinaStops[position];
    const era = historic ? 'Educational reconstruction' : 'Present-day reference view';
    const object = main.querySelector('#mdina-object');
    object.dataset.stop = String(position);
    object.textContent = 'Inspect '+stop.name.toLowerCase();
    main.querySelector('#mdina-stop').textContent = stop.name+' · '+era;
    main.querySelector('#mdina-description').textContent = historic ? stop.medieval : stop.present;
    main.querySelector('#mdina-compare').textContent = stop.compare;
    canvas.setAttribute('aria-label',stop.name+' · '+era+'. Use left and right arrow keys to visit other stops.');
    main.querySelector('[data-view="-1"]').disabled = position === 0;
    main.querySelector('[data-view="1"]').disabled = position === mdinaStops.length - 1;
  }
  level.value = d.level;
  guide.textContent = levels[d.level];
  level.onchange = () => { d.level = level.value; guide.textContent = levels[d.level]; save(); };
  if (lab) {
    const variables = main.querySelector('#variables');
    main.querySelector('[data-jump-variables]').onclick=()=>variables.querySelector('input, select').focus();
    function readResults(reveal = !forces) {
      results = useBuilder() ? circuitResults(d.values,d.circuitWires) : lab.run(d.values);
      main.querySelector('#metrics').innerHTML = reveal
        ? results.map(([k,v,u])=>'<div><strong>'+esc(v)+(u?' <small>'+esc(u)+'</small>':'')+'</strong><span>'+esc(k)+'</span></div>').join('')
        : '<p class="muted">Release the cart to see the results for these settings.</p>';
      if (['flood','urban'].includes(a.id)) {
        const cost = results.find(([k])=>k==='Cost')[1];
        const node = main.querySelector('#budget');
        node.textContent = cost > budget ? 'Over budget by €'+(cost-budget)+'k' : 'Budget remaining €'+(budget-cost)+'k';
        node.classList.toggle('over',cost>budget);
      }
    }
    const surfaceButtons = main.querySelectorAll('[data-friction]');
    function syncControls() {
      for (const [key] of lab.controls) {
        const control = variables.elements[key];
        control.value = d.values[key];
        if (control.type==='range') control.nextElementSibling.value = control.value;
      }
      surfaceButtons.forEach(button => button.setAttribute('aria-pressed',String(Number(button.dataset.friction)===d.values.friction)));
    }
    function stop() { cancelAnimationFrame(frame); active = false; lastTime=0; }
    function animate() {
      if (reduced() || document.hidden || useBuilder()) return;
      const start = performance.now();
      const tick = time => {
        lastTime = (time-start)/1000;
        draw();
        frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }
    if (['electric','matter'].includes(a.id)) refreshAnimation=()=>{
      stop();
      draw();
      animate();
    };
    function live() {
      stop();
      readResults();
      draw();
      if (refreshAnimation) animate();
    }
    function trials() {
      const area = main.querySelector('#trials');
      if (!d.trials.length) { area.innerHTML = '<p class="muted">Run a trial to record its controls and results.</p>'; return; }
      const last = d.trials.at(-1);
      const comparison = forces && d.trials.length>1 ? '<div class="trial-comparison"><h3>Latest trial comparison</h3><p>'+esc(forceComparison(d.trials))+'</p></div>' : '';
      const comparable = last.results.find(([key])=>key==='Distance at 2 s') || last.results.find(row=>typeof row[1]==='number');
      const matching = comparable ? d.trials.map((trial,index)=>({trial,index})).filter(({trial})=>trial.results.some(([key,value])=>key===comparable[0] && typeof value==='number')) : [];
      const chart = matching.length>1 ? '<div class="chart" aria-label="'+esc(comparable[0])+' comparison"><strong>'+esc(comparable[0])+'</strong>'+matching.map(({trial,index})=>{
        const metric = trial.results.find(([key])=>key===comparable[0]);
        const maximum = Math.max(1,...matching.map(({trial:item})=>Math.abs(item.results.find(([key])=>key===comparable[0])[1])));
        return '<div><span>Trial '+(index+1)+'</span><meter min="0" max="'+maximum+'" value="'+Math.abs(metric[1])+'"></meter><span>'+esc(metric[1])+' '+esc(metric[2])+'</span></div>';
      }).join('')+'</div>' : '';
      area.innerHTML = comparison+chart+d.trials.map((t,i)=>'<details><summary>Trial '+(i+1)+'</summary><p>'+Object.entries(t.inputs).map(([k,v])=>esc(k)+': '+esc(v)).join(' · ')+'</p><p class="lines">'+esc(metricText(t.results))+'</p></details>').join('')+'<button class="secondary" data-undo>Remove last trial</button>';
      area.querySelector('[data-undo]').onclick = () => { d.trials.pop(); trials(); save(); announce('Last trial removed.'); };
    }
    variables.oninput = ({target}) => {
      if (!Object.hasOwn(d.values,target.name)) return;
      d.values[target.name] = Number(target.value);
      syncControls(); live(); save();
    };
    surfaceButtons.forEach(button => button.onclick = () => {
      d.values.friction = Number(button.dataset.friction);
      syncControls(); live(); save();
      announce(button.textContent+' selected. Other settings are unchanged.');
    });
    main.querySelector('[data-reset]').onclick = () => { d.values=defaults(a.id); syncControls(); live(); save(); announce('Starting controls restored.'); };
    main.querySelector('[data-run]').onclick = () => {
      if (d.trials.length>=20) { announce('The notebook holds 20 trials. Remove the last trial to record another.'); return; }
      readResults(true);
      const inputs = displayInputs(a.id,d.values);
      if (useBuilder()) {
        delete inputs['Connect return wire'];
        delete inputs['Bulb arrangement'];
        inputs.Wiring = d.circuitWires.map(([left,right])=>terminals[left]+' to '+terminals[right]).join('; ') || 'No wires';
      }
      d.trials.push({inputs,results:structuredClone(results)});
      const observed = forces ? results.find(([label])=>label==='Distance at 2 s')[1] : undefined;
      trials(); save(); announce('Trial '+d.trials.length+' recorded.'+(forces ? ' The cart travelled '+observed+' metres in two seconds.' : ''));
      if (!forces) return;
      stop();
      active=true;
      if (reduced()) { lastTime=1; draw(); return; }
      const start = performance.now();
      const tick = time => {
        lastTime=Math.min(1,(time-start)/2000);
        if (reduced()) lastTime=1;
        draw(); if (lastTime<1) frame=requestAnimationFrame(tick);
      };
      frame=requestAnimationFrame(tick);
    };
    if (electric) {
      d.circuitWires ??= [];
      const modeButton = main.querySelector('#circuit-mode');
      const builder = main.querySelector('#circuit-builder');
      const wireList = main.querySelector('#wires');
      const wireStatus = main.querySelector('#wire-status');
      const terminalButtons = builder.querySelectorAll('[data-terminal]');
      let selectedTerminal;
      function renderWires(message='') {
        terminalButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.terminal===selectedTerminal)));
        wireList.innerHTML = d.circuitWires.map(([left,right],i)=>{
          const description = terminals[left]+' to '+terminals[right];
          return '<li><span>'+esc(description)+'</span> <button type="button" class="secondary" data-remove-wire="'+i+'" aria-label="Remove wire from '+esc(description)+'">Remove</button></li>';
        }).join('');
        wireStatus.textContent = message || (d.circuitWires.length ? d.circuitWires.length+' wires connected.' : 'No wires connected.');
        builder.querySelector('#clear-wires').disabled = !d.circuitWires.length;
      }
      function updateBuilder() {
        const enabled = Boolean(useBuilder());
        builder.hidden = !enabled;
        modeButton.setAttribute('aria-pressed',String(enabled));
        variables.elements.wire.closest('label').hidden = enabled;
        variables.elements.pattern.closest('label').hidden = enabled;
        renderWires();
      }
      modeButton.onclick = () => {
        d.circuitMode = !useBuilder();
        selectedTerminal = undefined;
        updateBuilder(); live(); save();
      };
      terminalButtons.forEach(button=>button.onclick = () => {
        const terminal = button.dataset.terminal;
        if (!selectedTerminal) {
          selectedTerminal = terminal;
          renderWires(terminals[terminal]+' selected. Choose the second terminal.');
          return;
        }
        const wires = connectWire(d.circuitWires,selectedTerminal,terminal);
        const message = selectedTerminal===terminal ? 'Terminal deselected.' : wires===d.circuitWires ? 'Those terminals are already connected.' : 'Wire added.';
        d.circuitWires = wires;
        selectedTerminal = undefined;
        renderWires(message); live(); save();
      });
      wireList.onclick = event => {
        const target = event.target.closest('[data-remove-wire]');
        if (!target) return;
        const index = Number(target.dataset.removeWire);
        d.circuitWires.splice(index,1);
        renderWires('Wire removed.'); live(); save();
        (wireList.querySelector('[data-remove-wire="'+index+'"]') || terminalButtons[0]).focus();
      };
      builder.querySelectorAll('[data-wire-template]').forEach(button=>button.onclick = () => {
        d.circuitWires = structuredClone(button.dataset.wireTemplate==='series' ? seriesWires : parallelWires);
        selectedTerminal = undefined;
        renderWires(button.textContent+' applied.'); live(); save();
      });
      builder.querySelector('#clear-wires').onclick = () => {
        d.circuitWires = [];
        selectedTerminal = undefined;
        renderWires('Wires cleared.'); live(); save();
        terminalButtons[0].focus();
      };
      updateBuilder();
    }
    syncControls(); live(); trials();
  } else {
    const portal = main.querySelector('[data-portal]');
    portal.onclick = () => {
      historic = !historic;
      portal.textContent = historic ? 'Return to present day' : 'Enter time portal';
      canvas.classList.remove('transition');
      if (!reduced()) { void canvas.offsetWidth; canvas.classList.add('transition'); }
      draw();
      announce(historic ? 'Educational reconstruction opened.' : 'Present-day reference view opened.');
    };
    function move(direction) {
      const minimum = mdina ? 0 : -4;
      const maximum = mdina ? mdinaStops.length - 1 : 4;
      const next = Math.max(minimum,Math.min(maximum,position+direction));
      if (next === position) return;
      position = next;
      draw();
      if (mdina) announce('You reached the '+mdinaStops[position].name.toLowerCase()+'.');
    }
    main.querySelectorAll('[data-view]').forEach(button => button.onclick = () => move(Number(button.dataset.view)));
    canvas.tabIndex = 0;
    canvas.onkeydown = event => {
      if (!['ArrowLeft','ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      move(event.key==='ArrowLeft' ? -1 : 1);
    };
    main.querySelector('#sources').innerHTML = dossier.sources.map(([name,detail,url],i)=>'<details id="source-'+i+'"><summary>'+esc(name)+'</summary><p>'+esc(detail)+'</p><p>'+link(url,'Open original source')+'</p><button class="secondary" data-source="'+i+'">Mark source examined</button></details>').join('');
    mountHistoryMission(main.querySelector('#history-mission'),a.id,d,save,esc);
    if (mdina) main.querySelector('#mdina-object').onclick = () => {
      const evidence = main.querySelector('#source-'+mdinaStops[position].source);
      evidence.open = true;
      evidence.querySelector('summary').focus();
    };
    main.querySelectorAll('[data-question]').forEach(button=>button.onclick=()=>{
      const index=Number(button.dataset.question);
      main.querySelector('#reply').textContent=dossier.responses[index];
      const exchange = button.textContent+' — '+dossier.responses[index];
      if (!d.questions.includes(exchange)) d.questions.push(exchange);
      save();
    });
    draw();
  }
  main.querySelectorAll('[data-source]').forEach(button=>{
    const index = Number(button.dataset.source);
    const update = () => { button.disabled=d.sources.includes(index); if (button.disabled) button.textContent='Examined'; };
    button.onclick=()=>{d.sources.push(index); update(); save(); announce('Source added to the notebook.');};
    update();
  });
  const notebook = main.querySelector('#notebook');
  const saveResponse = ({target}) => { d[target.name]=target.value; save(); };
  notebook.oninput = saveResponse;
  if (forces) main.querySelector('#force-prediction').oninput = saveResponse;
  notebook.querySelector('[data-export]').onclick = () => exportEvidence(a,{...d,outcomeId:o.id});
  notebook.onsubmit = event => {
    event.preventDefault();
    if (fields[a.group].some(([key])=>!d[key].trim())) { announce('Complete each notebook response before submitting.'); return; }
    if ((lab && !d.trials.length) || (dossier && !d.sources.length)) { announce(lab?'Record at least one trial before submitting.':'Mark at least one historical source examined before submitting.'); return; }
    state.submissions.unshift({...structuredClone(d),outcomeId:o.id,activity:a.id,id:crypto.randomUUID?.() || String(Date.now()),submitted:new Date().toISOString()});
    save();
    announce('Investigation submitted for review in this browser.');
  };
}

function sample() {
  const values = defaults('forces');
  const rough = {...values,friction:.5};
  return {...newDraft(activities[0]),id:'demo-cart',activity:'forces',learner:'Demo learner 07',submitted:'2026-10-15T10:00:00Z',
    prediction:'A rougher ramp will make the cart travel less far because friction opposes its movement.',
    observations:'The lower-friction surface gave the cart a longer distance in two seconds.',
    explanation:'I kept mass, angle, gravity and push the same. Distance dropped when friction increased.',
    reflection:'I would check if the pattern holds on a flatter ramp.',
    trials:[values,rough].map(v=>({ inputs:displayInputs('forces',v),results:labs.forces.run(v) }))};
}
const csvCell = value => '"' + (/^[\s]*[=+@-]|^[\t\r\n]/.test(String(value ?? '')) ? "'" : '')+String(value ?? '').replaceAll('"','""')+'"';
function educator() {
  const submissions = state.submissions;
  const counts = outcomes.map(o => {
    const related = submissions.filter(s=>activities.some(a=>a.id===s.activity && recordOutcome(a,s).id===o.id));
    return {outcome:o, target:related.length, reviewed:related.filter(s=>s.review).length};
  }).filter(entry=>entry.target);
  main.innerHTML = intro('Teaching workspace','Educator dashboard','Plan an activity and review the reasoning captured in this browser.')+
    '<div class="actions"><a href="#outcomes" class="button">Find outcomes and plan a lesson</a><button type="button" class="secondary" data-sample>Load fictional submission</button><button type="button" class="secondary" data-csv '+(submissions.length?'':'disabled')+'>Export evidence CSV</button></div>'+
    '<div class="layout"><section class="panel"><h2>Student submissions</h2><p class="muted">Same-browser review. Shared assignment links open the activity on another device; students can send their downloaded reports through your established school workflow.</p>'+
    (submissions.length ? '<label>Choose submission<select id="submission">'+submissions.map(s=>option(s.id,(s.learner || 'Anonymous learner')+' · '+activities.find(a=>a.id===s.activity).title)).join('')+'</select></label>' : '<p>No submissions yet.</p>')+
    '</section><aside class="panel"><h2>Outcome coverage</h2>'+(counts.map(({outcome,target,reviewed})=>'<p><strong>'+esc(outcome.code || outcome.strand)+'</strong><br>'+target+' targeted · '+reviewed+' teacher reviews</p>').join('')||'<p class="muted">Coverage will appear after students submit their work.</p>')+'</aside></div><div id="review"></div>';
  main.querySelector('[data-sample]').onclick=()=>{
    if (!submissions.some(s=>s.id==='demo-cart')) { submissions.unshift(sample()); save(); }
    educator(); demoBar(); main.querySelector('#submission').value='demo-cart'; review();
  };
  main.querySelector('[data-csv]').onclick=()=> {
    const headings=['Learner','Activity','Outcome','Prediction','Observations','Explanation','Reflection','Trials','Sources','Judgement','Rubric','Feedback','History mission evidence'];
    const rows=submissions.map(s=>{
      const a=activities.find(a=>a.id===s.activity);
      const evidence = evidenceRows(a,s);
      const outcome = recordOutcome(a,s);
      return [s.learner,a.title,outcome.code || outcome.strand,s.prediction,s.observations,s.explanation,s.reflection,evidence[7][1],evidence[8][1],s.review?.judgement,s.review?.scores?.join(' / '),s.review?.feedback,a.group==='history' ? missionEvidence(a.id,s.mission) : ''];
    });
    download('learningverse-evidence.csv',[headings,...rows].map(row=>row.map(csvCell).join(',')).join('\r\n'),'text/csv');
  };
  const chooser=main.querySelector('#submission');
  function review() {
    const record = submissions.find(s=>s.id===main.querySelector('#submission').value);
    const a=activities.find(item=>item.id===record.activity);
    const body=main.querySelector('#review');
    body.innerHTML='<article class="panel printable"><p class="eyebrow">'+esc(record.learner || 'Anonymous learner')+'</p><h2>'+esc(reportNames[a.group])+'</h2>'+evidenceRows(a,record).map(([label,value])=>'<h3>'+esc(label)+'</h3><p class="lines">'+esc(value || '—')+'</p>').join('')+'<div class="actions no-print"><button type="button" data-export>Download report</button><button type="button" class="secondary" data-print>Print / save PDF</button></div></article><section class="panel no-print"><h2>Teacher assessment</h2><p class="muted">Proposed rubric. Check the original outcome and confirm the judgement yourself.</p><form id="assessment" class="stack">'+rubric.map((criterion,i)=>'<label>'+criterion+'<select name="score'+i+'" required>'+['Unscored','Emerging','Developing','Secure'].map(s=>option(s)).join('')+'</select></label>').join('')+'<label>Teacher judgement<select name="judgement">'+['Needs further evidence','Progressing toward the outcome','Teacher confirms outcome achieved'].map(s=>option(s)).join('')+'</select></label><label>Feedback or misconceptions to revisit<textarea name="feedback" rows="3" maxlength="3000">'+esc(record.review?.feedback)+'</textarea></label><button>Save teacher judgement</button></form></section>';
    const form=body.querySelector('form');
    if (record.review) {
      form.elements.judgement.value=record.review.judgement;
      record.review.scores.forEach((s,i)=>{ form.elements['score'+i].value=s; });
    }
    form.onsubmit=event=>{
      event.preventDefault();
      record.review={judgement:form.elements.judgement.value,feedback:form.elements.feedback.value,scores:rubric.map((_,i)=>form.elements['score'+i].value)};
      save();
      const id = record.id;
      educator(); demoBar();
      main.querySelector('#submission').value = id;
      main.querySelector('#submission').dispatchEvent(new Event('change'));
      main.querySelector('#assessment button').focus({preventScroll:true});
      announce('Teacher judgement saved.');
    };
    body.querySelector('[data-export]').onclick=()=>exportEvidence(a,record);
    body.querySelector('[data-print]').onclick=()=>print();
  }
  if (chooser) { chooser.onchange=review; review(); }
}
function student() {
  main.innerHTML=intro('Student learning area','Choose an investigation','Explore the model or the sources, collect evidence, then explain what you think.')+
    '<div class="cards">'+Object.entries(groups).map(([id,group])=>'<section class="panel"><p class="eyebrow">'+group.label+'</p><h2>'+group.title+'</h2><ul>'+activities.filter(a=>a.group===id).map(a=>'<li>'+activityLink(a)+(state.drafts[a.id]?' <small class="muted">· Notebook started</small>':'')+'</li>').join('')+'</ul></section>').join('')+'</div>';
}
const resources = [
  ['Science investigation guide','Ask a testable question. Predict using a scientific idea. Change one variable, measure and compare. Finish by explaining what your results support.'],
  ['Historical evidence sheet','List each source, what you observed, the claim it supports and what remains uncertain. Compare reconstruction details with documented evidence.'],
  ['Coastal planning worksheet','Record the baseline and two options. For each, list cost, assets exposed, benefits, trade-offs and what the model leaves out. Justify a preferred option.'],
  ['Formative assessment rubric','Emerging: states an idea or observation. Developing: links a relevant observation to a claim. Secure: compares evidence, explains the link and identifies uncertainty. Apply to conceptual understanding, reasoning and use of evidence.'],
  ['Five-minute demonstration script',steps.map(([,title,detail],i)=>'Minute '+(i+1)+' · '+title+'\n'+detail).join('\n\n')]
];
function library() {
  main.innerHTML=intro('Resource library','Teaching materials','Download classroom prompts, evidence sheets, assessment guidance and the demonstration script.')+'<div class="cards">'+resources.map(([title,text],i)=>'<article class="panel"><h2>'+esc(title)+'</h2><p class="lines">'+esc(text)+'</p><button class="secondary" data-resource="'+i+'">Download resource</button></article>').join('')+'</div>';
  main.querySelectorAll('[data-resource]').forEach(button=>button.onclick=()=>{
    const [title,text]=resources[Number(button.dataset.resource)];
    download(title.toLowerCase().replaceAll(' ','-')+'.txt',title+'\n\n'+text);
  });
}
function goDemo(index) {
  if (index === 4) {
    const draft = state.drafts.forces;
    const previous = state.submissions.find(s=>s.id==='demo-live-cart');
    state.submissions = state.submissions.filter(s=>s.id!=='demo-live-cart');
    if (draft.trials.length) {
      const evidence = {...draft, learner:'Demo group · live investigation'};
      const unchanged = previous && Object.entries(evidence).every(([key,value])=>JSON.stringify(value)===JSON.stringify(previous[key]));
      state.submissions.unshift(unchanged ? previous : {
        ...structuredClone(evidence), id:'demo-live-cart', activity:'forces', submitted:new Date().toISOString()
      });
    }
  }
  demo=index;
  const hash='#'+steps[index][0];
  if (location.hash===hash) render(false);
  else location.hash=hash;
}
function demoBar() {
  if (demo<0) return;
  const panel=document.createElement('section');
  panel.className='demo panel no-print';
  panel.innerHTML='<p class="eyebrow">Demo · Minute '+(demo+1)+' of 5</p><h2>'+steps[demo][1]+'</h2><p>'+steps[demo][2]+'</p><div class="actions">'+(demo>0?'<button class="secondary" data-prev>Previous step</button>':'')+(demo<4?'<button data-next>Next step</button>':'')+'<button class="secondary" data-restart>Reset demo</button><button class="secondary" data-end>Exit demo</button></div>';
  main.prepend(panel);
  const prev=panel.querySelector('[data-prev]');
  const next=panel.querySelector('[data-next]');
  if (prev) prev.onclick=()=>goDemo(demo-1);
  if (next) next.onclick=()=>goDemo(demo+1);
  panel.querySelector('[data-restart]').onclick=()=>{state=demoInitial();syncMotion();goDemo(0);};
  panel.querySelector('[data-end]').onclick=()=>{state=demoState;demo=-1;syncMotion();location.hash='home';};
}
function demoInitial() {
  const start = initial();
  start.motion = demoState.motion;
  start.submissions=[sample()];
  start.drafts.forces={...newDraft(activities[0]),prediction:'The cart travels farther on the smoother ramp.'};
  return start;
}
document.addEventListener('click',event=>{
  if (!event.target.closest('[data-demo]')) return;
  if (demo < 0) demoState=state;
  state=demoInitial();
  goDemo(0);
});

function render(focus=true) {
  cancelAnimationFrame(frame);
  refreshAnimation = undefined;
  const [route, query] = location.hash.slice(1).split('?');
  const [page,id] = route.split('/');
  const params=new URLSearchParams(query);
  document.querySelector('#navigation').innerHTML=navigation.map(([key,title])=>'<a href="#'+key+'"'+(key===page?' aria-current="page"':'')+'>'+title+'</a>').join('');
  if (Object.hasOwn(groups,page)) {
    const a=activities.find(item=>item.group===page && item.id===id);
    if (a) investigation(a,params); else catalog(page);
  } else if (page==='outcomes') outcomePage(params);
  else if (page==='educator') educator();
  else if (page==='student') student();
  else if (page==='resources') library();
  else home();
  if (demo===3 && page==='outcomes') {
    const filter=main.querySelector('select[name="verification"]');
    filter.value='verified';
    filter.dispatchEvent(new Event('input',{bubbles:true}));
  }
  demoBar();
  if (focus) { window.scrollTo(0,0); main.focus({preventScroll:true}); }
}
addEventListener('hashchange',()=>render());
document.querySelector('.skip').onclick=event=>{event.preventDefault();main.focus();};
render(false);
if (storageWarning) announce('Saved work could not be loaded from this browser.');
