export const groups = {
  science: { title: 'Science Lab 360', label: 'Experiment', heading: 'Test your ideas.', description: 'Change one variable, run a trial and use the results to explain what happened.' },
  history: { title: 'Time Portal Malta', label: 'Investigate', heading: 'Follow the evidence.', description: 'Step into a reconstruction and find out what historical sources can tell us.' },
  future: { title: 'Malta 2050', label: 'Plan', heading: 'Shape a coastal town.', description: 'Compare possible futures for a fictional Maltese settlement and defend your decisions.' }
};

const science = 'https://primaryscience.skola.edu.mt/wp-content/uploads/2026/10/Year-5-Learning-Outcomes-Updated.pdf';
const history7 = 'https://curriculum.gov.mt/wp-content/uploads/2024/04/History_Yr07_Learning-and-Assessment-Programme_2020.pdf';
const history8 = 'https://curriculum.gov.mt/wp-content/uploads/2024/04/History_Yr08_Learning-and-Assessment-Programme_2020.pdf';
const geography = 'https://curriculum.gov.mt/wp-content/uploads/2024/04/Geography_syllabus_Year-8-general-2021-2022.pdf';
const verified = 'Verified in linked official document';
const pending = 'Proposed activity objective · official mapping pending';

export const outcomes = [
  { id: 'prediction', stage: 'Primary', year: 5, subject: 'Primary Science', strand: 'What do Scientists do?', code: '5.1.3', summary: 'Use basic scientific knowledge to predict an investigation’s outcome.', source: science + '#page=1', document: 'Year 5 Primary Science Learning Outcomes', version: 'October 2026', status: verified },
  { id: 'energy', stage: 'Primary', year: 5, subject: 'Primary Science', strand: 'What is energy?', code: '5.5.2', summary: 'Demonstrate and give examples of electrical energy transforming into light, sound, heat and movement.', source: science + '#page=5', document: 'Year 5 Primary Science Learning Outcomes', version: 'October 2026', status: verified },
  { id: 'habitat', stage: 'Primary', year: 5, subject: 'Primary Science', strand: 'How does planet Earth support life?', code: '5.7.4', summary: 'Investigate human impacts on habitats and the organisms living in them.', source: science + '#page=7', document: 'Year 5 Primary Science Learning Outcomes', version: 'October 2026', status: verified },
  { id: 'roman', stage: 'Secondary', year: 7, subject: 'History General', strand: 'Interpretation and source analysis', code: 'HIS 7.4 · objective 3, item 9', summary: 'Draw inferences about Roman sites and life in Malta from different sources, including the Domvs Romana.', source: history7 + '#page=24', document: 'Year 7 History Learning and Assessment Programme', version: '2020 · linked by the Department', status: verified },
  { id: 'mdina', stage: 'Secondary', year: 8, subject: 'History General', strand: 'Historical empathy', code: 'HIS 8.3 · objective 3, item 4 (D7.6, D7.7)', summary: 'Reconstruct a day in the life of a person in a fortified settlement in Late Medieval Malta.', source: history8 + '#page=19', document: 'Year 8 History Learning and Assessment Programme', version: '2020 · linked by the Department', status: verified },
  { id: 'knights', stage: 'Secondary', year: 8, subject: 'History General', strand: 'Chronology and sequence', code: 'HIS 8.5 · objective 3, item 2 (A7.5, A7.8)', summary: 'Sequence key events between the loss of Rhodes in 1523 as stated in the syllabus and the Knights’ formal entry into Mdina in 1530. Consult the source for its periodisation.', source: history8 + '#page=26', document: 'Year 8 History Learning and Assessment Programme', version: '2020 · linked by the Department', status: verified },
  { id: 'flood', stage: 'Secondary', year: 8, subject: 'Geography General', strand: 'Natural hazards', code: '8.3', summary: 'Research a case study to describe the characteristics and effects of a natural disaster, such as flooding.', source: geography + '#page=13', document: 'Year 8 Geography General Syllabus', version: '2021–2022 · linked by the Department', status: verified },
  ...[
    ['space', 'Earth and space', 'Connect sunlight and Earth’s rotation to the day-night cycle.'],
    ['water', 'Water resources', 'Compare the effects of water conservation and additional supply.'],
    ['solar', 'Energy resources', 'Evaluate the costs and benefits of meeting demand with solar energy and storage.'],
    ['urban', 'Sustainable settlements', 'Explain a trade-off between mobility, shade and permeable space.']
  ].map(([id, strand, summary]) => ({ id, stage: 'Secondary', year: id === 'space' ? 7 : 8, subject: id === 'space' ? 'Science' : 'Geography General', strand, summary, status: pending }))
];

export const activities = [
  ['forces','science','Forces and Motion','prediction','Which change makes the cart travel farther in two seconds?','Run two trials. Change just one variable and compare the distances.'],
  ['electric','science','Electricity','energy','When do the bulbs light, and how does the circuit arrangement affect them?','Compare an open circuit with a closed one. Then compare series and parallel at a fixed voltage.'],
  ['matter','science','States of Matter','prediction','How will changing the temperature affect the particles in water?','Compare below freezing, room temperature and the boiling point. Explain your observations at both scales.'],
  ['space','science','Space and Earth','space','What changes when Earth rotates or when its tilt changes?','Follow Malta over one rotation. Then compare daylight hours at two points in the orbit.'],
  ['ecosystem','science','Ecosystem Explorer','habitat','How might habitat loss affect different organisms in a food web?','Run a baseline and a habitat-loss scenario. Change initial species counts to see what the model can and cannot tell you.'],
  ['roman','history','Roman Malta','roman','What can surviving objects tell us about Roman life in Malta?','Inspect two sources, ask the interpreter a question and support a claim with evidence.'],
  ['mdina','history','Medieval Mdina','mdina','What might a working day inside medieval Mdina have been like?','Visit the gate, market stall and workshop in both eras. Record three differences, support two claims with sources and explain one change over time.'],
  ['knights','history','Malta Under the Knights','knights','How did the Knights’ move to Malta change the role of harbour settlements?','Use the timeline and harbour source to connect an event with a consequence.'],
  ['flood','future','Coastal Flooding','flood','Save a Maltese Coastal Town','Record a baseline, add protection within €1 million and justify your plan. Pair your model evidence with the real flood case study.'],
  ['water','future','Water Management','water','Can the town meet a month of water demand after a dry spell?','Compare a supply intervention with conservation or leakage repairs.'],
  ['solar','future','Sustainable Energy','solar','How much demand can the town meet with solar and storage?','Measure the baseline. Compare more panels against improved efficiency and storage.'],
  ['urban','future','Sustainable Urban Planning','urban','How can the town reduce heat and runoff while keeping people connected?','Try two designs within budget and explain who benefits from each.']
].map(([id, group, title, outcome, question, task]) => ({ id, group, title, outcome, question, task }));

export const history = {
  roman: {
    era: 'Roman period', place: 'Rabat and Mdina', character: 'Household artisan',
    sources: [
      ['Mosaic floor', 'The surviving mosaics suggest that the house had an owner with resources for elaborate decoration. This evidence comes from an elite home.', 'https://heritagemalta.mt/explore/domvs-romana/'],
      ['Courtyard and water features', 'Documented elements include a colonnaded courtyard and water systems. Modern scanning records what survives today.', 'https://projects.heritagemalta.mt/project-news/heritage-malta-completes-the-digital-acquisition-of-limestone-monuments-at-the-domvs-romana/'],
      ['Nearby house remains', 'The remains beyond the main house offer another line of evidence for comparing Roman domestic spaces.', 'https://heritagemalta.mt/news/the-houses-beyond-the-house/']
    ],
    responses: ['A decorated floor would take skilled work. Look for actual traces of that work in the museum record.', 'Compare this house with nearby remains. How representative might an elite house be?', 'The coloured floor is evidence. The people and room arrangement in this scene are our imagined interpretation.']
  },
  mdina: {
    era: 'Late medieval period', place: 'Mdina', character: 'Cotton merchant',
    sources: [
      ['Fortified town', 'The history programme identifies Mdina among late medieval fortified settlements. Trace how walls and gates might affect access.', history8 + '#page=19'],
      ['Cotton trading', 'The history programme includes a cotton merchant among the occupations students can investigate. Seek further sources about individual transactions.', history8 + '#page=19'],
      ['Market and workshop', 'This scene’s stalls and workshop are design interpretations. The curriculum also identifies blacksmithing as an example occupation.', history8 + '#page=19']
    ],
    responses: ['Imagine bringing cotton to town. What would a controlled gate mean for your working day?', 'Find two ways the walls might help residents and one way they might inconvenience people.', 'We can imagine my routine. Which details would need a document or an artefact to verify?']
  },
  knights: {
    era: 'Early Order of St John period', place: 'Birgu and Grand Harbour', character: 'Harbour worker',
    sources: [
      ['Chronology dossier', 'Sequence the loss of Rhodes, the grant of Malta and the Knights’ formal entry into Mdina. The syllabus gives the endpoints for your timeline.', history8 + '#page=26'],
      ['Grand Harbour', 'Fort St Angelo’s position allowed control over approaches to Grand Harbour. Identify one geographic advantage visible in the harbour view.', 'https://heritagemalta.mt/app/uploads/2022/06/Access-Statement-Fort-St-Angelo.pdf'],
      ['Layers of building', 'The harbour includes defensive works from different periods. Heritage Malta identifies both Order and later British fortifications.', 'https://heritagemalta.mt/news/heritage-maltas-fortifications-harbour-cruise-is-a-must-this-summer/']
    ],
    responses: ['A harbour connects people and goods. How might an institution settling nearby change demand for work?', 'The view helps explain why this headland mattered. Find a source that supports your explanation.', 'Look at dates before treating the structures as contemporary. The scene compresses several features for teaching.']
  }
};
export const mdinaStops = [
  {
    name: 'Town gate', source: 0,
    present: 'Look at the entrance and the pedestrian approach in the reference illustration.',
    medieval: 'Imagine a resident or trader approaching the gate. How might controlling access affect their day?',
    compare: 'Which function might a gate keep over time? Which detail would you need to verify in a source?'
  },
  {
    name: 'Market stall', source: 1,
    present: 'Compare the permanent shop in the reference illustration with the stall across the portal.',
    medieval: 'The cloth on the stall represents cotton trading. The individual stall and its placement are imagined.',
    compare: 'How might buying or selling goods differ between the scenes? What does the source establish about work?'
  },
  {
    name: 'Workshop', source: 2,
    present: 'The reference illustration shows a closed street-front doorway. Think about where and how people work today.',
    medieval: 'The open doorway and tools suggest a blacksmith’s workspace. The layout and individual objects are imagined.',
    compare: 'Which detail comes from an interpretation? What kind of evidence would help you check it?'
  }
];
export const floodCase = ['Real case study: Malta’s September 2003 floods', 'The national assessment records rainfall flooding on 15 September 2003. It lists Qormi, Msida, Birkirkara, Burmarrad, Siġġiewi and Marsa, and reports disruption to traffic and damage to private property. Use the report to compare how rainfall flooding and coastal flooding affect people and infrastructure.', 'https://www.energywateragency.gov.mt/wp-content/uploads/2017/12/Preliminary-Flood-Risk-Assessment-Final-Report.pdf'];
export const levels = {
  Support: 'Use two examples and this frame: I changed or inspected __. I noticed __. This suggests __.',
  Core: 'Compare two pieces of evidence and use them to explain your conclusion.',
  Challenge: 'Test an alternative explanation and identify a limitation that could change your conclusion.'
};
export const rubric = ['Conceptual understanding', 'Reasoning and explanation', 'Use of evidence'];
