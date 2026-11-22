const questions = {
  flood:'Which assets did the change protect, and what did that protection cost?',
  water:'Which option reduced the shortfall, and what would Malta need to make it work?',
  solar:'How much less grid electricity did the plan need, and what did that change cost?',
  urban:'Which design reduced runoff or heat, and how did it affect access and habitat?'
};

export function comparePlans(trials,pair) {
  if (trials.length<2) return null;
  const [base,next] = pair || [0,trials.length-1];
  if (!trials[base] || !trials[next] || base===next) return null;
  const before=trials[base], after=trials[next];
  const results=new Map(after.results.map(([name,value,unit])=>[name,[value,unit]]));
  const metrics=before.results.flatMap(([name,value,unit])=>{
    const result=results.get(name);
    if (!result || result[1]!==unit) return [];
    const [later] = result;
    const numeric = typeof value==='number' && typeof later==='number';
    const delta=numeric ? Math.round((later-value)*100)/100 : null;
    const change=delta===null ? (value===later ? 'No change' : 'Changed') :
      (delta>0 ? '+' : '')+delta+(unit ? ' '+(unit==='%' ? 'pp' : unit) : '');
    return [{name,before:value,after:later,unit,change}];
  });
  const settings=Object.entries(after.inputs).filter(([name,value])=>before.inputs[name]!==value)
    .map(([name,value])=>name+': '+before.inputs[name]+' → '+value);
  return {base,next,metrics,settings};
}

const valueText = (value,unit)=>value+(unit?' '+unit:'');
export function planningReport(trials,pair) {
  const plan=comparePlans(trials,pair);
  if (!plan) return '';
  return ['Trial '+(plan.base+1)+' compared with Trial '+(plan.next+1),
    'Settings changed: '+(plan.settings.join('; ') || 'None'),
    ...plan.metrics.map(({name,before,after,unit,change})=>name+': '+valueText(before,unit)+' → '+valueText(after,unit)+' ('+change+')')].join('\n');
}

export function mountPlanningComparison(panel,id,draft,save,escape) {
  const trials=draft.trials;
  const valid=draft.planPair?.every(index=>Number.isInteger(index) && trials[index]);
  if (!valid) delete draft.planPair;
  const pair=draft.planPair || [0,trials.length-1];
  const options=trials.map((_,index)=>'<option value="'+index+'">Trial '+(index+1)+'</option>').join('');
  panel.innerHTML='<h3>Compare two plans</h3><div class="plan-controls"><label>Baseline<select name="baseline">'+options+'</select></label><label>Option<select name="alternative">'+options+'</select></label></div><div class="plan-result"></div><p class="muted">'+questions[id]+'</p>';
  const controls=panel.querySelectorAll('select');
  controls.forEach((select,index)=>{select.value=pair[index];});
  const result=panel.querySelector('.plan-result');
  function render(selection) {
    const plan=comparePlans(trials,selection);
    if (!plan) {result.innerHTML='<p>Select two different trials.</p>';return;}
    result.innerHTML='<p>Settings changed: '+escape(plan.settings.join('; ') || 'None')+'</p>'+
      '<div class="plan-table"><table><caption>Trial '+(plan.base+1)+' and Trial '+(plan.next+1)+'</caption><thead><tr><th scope="col">Measure</th><th scope="col">Baseline</th><th scope="col">Option</th><th scope="col">Change</th></tr></thead><tbody>'+
      plan.metrics.map(({name,before,after,unit,change})=>'<tr><th scope="row">'+escape(name)+'</th><td>'+escape(valueText(before,unit))+'</td><td>'+escape(valueText(after,unit))+'</td><td>'+escape(change)+'</td></tr>').join('')+'</tbody></table></div>';
  }
  panel.onchange=()=>{
    draft.planPair=Array.from(controls,select=>Number(select.value));
    render(draft.planPair);
    save();
  };
  render(pair);
}
