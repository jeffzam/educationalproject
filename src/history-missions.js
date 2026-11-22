export const romanClaims = [
  { text:'The Domvs Romana had an elaborate floor.', supported:'yes', detail:'Heritage Malta describes the surviving mosaics. They give direct evidence of decoration in this house.' },
  { text:'Every Roman family in Malta had a floor this elaborate.', supported:'no', detail:'The source describes a wealthy household. Evidence about one household cannot establish what every family had.' },
  { text:'The house had a courtyard with columns.', supported:'yes', detail:'Heritage Malta’s documentation describes a colonnaded courtyard. The reconstruction gives one way to picture it.' }
];
export const knightsEvents = {
  rhodes: 'The Knights leave Rhodes after the siege',
  grant: 'Charles V grants Malta to the Order',
  mdina: 'The Knights formally enter Mdina',
  residence: 'The Grand Master’s residence at Fort St Angelo ends'
};
export const knightsAnswer = ['rhodes','grant','mdina','residence'];
const initialOrder = ['residence','grant','rhodes','mdina'];
const mdinaPrompts = [
  ['gate','Town gate · difference between the two views'],
  ['market','Market stall · difference between the two views'],
  ['workshop','Workshop · difference between the two views'],
  ['evidence','Which two sources support your claims? What changed over time?']
];

export function moveTimeline(order, index, direction) {
  const next = index+direction;
  if (index<0 || index>=order.length || next<0 || next>=order.length) return order;
  const reordered = [...order];
  [reordered[index],reordered[next]] = [reordered[next],reordered[index]];
  return reordered;
}

export function missionEvidence(id, mission) {
  if (!mission) return '';
  if (id==='roman') return romanClaims.flatMap(({text},index)=>mission.choices?.[index]
    ? [text+' — '+(mission.choices[index]==='yes' ? 'Supported' : 'Evidence is insufficient')] : []).join('\n');
  if (id==='knights') return mission.order.map((event,index)=>(index+1)+'. '+knightsEvents[event]).join('\n');
  return mdinaPrompts.filter(([key])=>mission[key]?.trim())
    .map(([key,label])=>label+': '+mission[key]).join('\n');
}

export function mountHistoryMission(panel, id, draft, save, escape) {
  if (id==='mdina') {
    panel.innerHTML = '<h2>Compare the street across eras</h2><p>Visit each stop in both views. Separate what the illustrations suggest from what the sources can support.</p><div class="stack mission-prompts">'+mdinaPrompts.map(([key,label])=>
      '<label>'+label+'<textarea name="'+key+'" rows="2" maxlength="1000">'+escape(draft.mission?.[key])+'</textarea></label>').join('')+'</div>';
    panel.oninput=({target})=>{
      draft.mission ??= {};
      draft.mission[target.name]=target.value;
      save();
    };
    return;
  }
  if (id==='roman') {
    panel.innerHTML = '<h2>What can the Roman remains support?</h2><p>Use the evidence desk to judge each claim. Check your reasoning after you have selected an answer for each.</p><div class="stack mission-prompts">'+romanClaims.map(({text},i)=>
      '<label>'+text+'<select name="'+i+'"><option value="">Choose an answer</option><option value="yes">Supported by the evidence</option><option value="no">Evidence is insufficient</option></select></label>').join('')+'</div><button type="button" class="secondary mission-check">Check claims</button><div class="mission-feedback" role="status"></div>';
    const feedback=panel.querySelector('.mission-feedback');
    const choices=panel.querySelectorAll('select');
    choices.forEach((select,index)=>{select.value=draft.mission?.choices?.[index] || '';});
    panel.onchange=()=>{
      draft.mission={choices:Array.from(choices,select=>select.value)};
      feedback.replaceChildren();
      save();
    };
    panel.querySelector('button').onclick=()=>{
      if (Array.from(choices).some(select=>!select.value)) {
        feedback.textContent='Choose an answer for all three claims.';
        return;
      }
      feedback.innerHTML='<ol>'+romanClaims.map(({supported,detail},index)=>
        '<li><strong>'+(choices[index].value===supported ? 'Supported judgement.' : 'Revisit this judgement.')+'</strong> '+detail+'</li>').join('')+'</ol>';
    };
    return;
  }
  panel.innerHTML='<h2>Sequence the Knights’ move to Malta</h2><p>Consult the chronology sources, then move the events into order from earliest to latest.</p><ol class="timeline"></ol><button class="secondary mission-check" type="button" data-check>Check timeline</button><div class="mission-feedback" role="status"></div>';
  const list=panel.querySelector('.timeline');
  const feedback=panel.querySelector('.mission-feedback');
  let order=draft.mission?.order || initialOrder;
  function render() {
    list.innerHTML=order.map((event,index)=>'<li><span>'+knightsEvents[event]+'</span><div class="timeline-controls">'+[-1,1].map(direction=>{
      const label=direction<0 ? 'earlier' : 'later';
      return '<button class="secondary" type="button" data-event="'+event+'" data-direction="'+direction+'" aria-label="Move '+escape(knightsEvents[event])+' '+label+'"'+(index+direction<0 || index+direction>=order.length?' disabled':'')+'>'+label+'</button>';
    }).join('')+'</div></li>').join('');
  }
  list.onclick=event=>{
    const button=event.target.closest('button');
    if (!button) return;
    const id=button.dataset.event;
    const direction=Number(button.dataset.direction);
    order=moveTimeline(order,order.indexOf(id),direction);
    draft.mission={order};
    save();
    render();
    (list.querySelector('[data-event="'+id+'"][data-direction="'+direction+'"]:enabled') ||
      list.querySelector('[data-event="'+id+'"]:enabled')).focus();
    feedback.textContent=knightsEvents[id]+' moved to position '+(order.indexOf(id)+1)+'.';
  };
  panel.querySelector('[data-check]').onclick=()=>{
    const correct=order.every((event,index)=>event===knightsAnswer[index]);
    feedback.textContent=correct
      ? 'The events are in order. The Knights left Rhodes in 1523. The grant and entry into Mdina followed in 1530. The Grand Master’s residence at Fort St Angelo ended in 1558.'
      : 'Some events are out of sequence. Compare the dates in the chronology and Fort St Angelo sources. Which event had to happen before the arrival in Mdina?';
    draft.mission={order:[...order]};
    save();
  };
  render();
}
