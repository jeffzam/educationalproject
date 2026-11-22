const round = value => Math.round(value * 100) / 100;
export function compareForceTrials(before, after) {
  const first = before.results.find(([name]) => name === 'Distance at 2 s')[1];
  const second = after.results.find(([name]) => name === 'Distance at 2 s')[1];
  const changed = Object.entries(after.inputs)
    .filter(([name, value]) => before.inputs[name] !== value)
    .map(([name, value]) => [name, before.inputs[name], value]);
  return { first, second, difference: round(second - first), changed };
}

export const budget = 1000;
export const sites = [
  ['Harbour road', 0.3, 10], ['Ferry terminal', 0.6, 8], ['Seafront shops', 1, 21],
  ['Low homes', 1.4, 18], ['Clinic', 2, 1], ['Upper homes', 2.8, 24],
  ['School', 3.5, 1], ['Hill park', 5, 0]
];

export function spaceGeometry({ hour, tilt, orbit, moon }) {
  const radians = Math.PI / 180;
  const latitude = 36 * radians;
  const longitude = 2 * Math.PI * orbit / 365;
  const declination = Math.asin(Math.sin(tilt * radians) * Math.sin(longitude));
  const hourAngle = (hour - 12) * Math.PI / 12;
  const altitude = Math.asin(Math.sin(latitude) * Math.sin(declination) +
    Math.cos(latitude) * Math.cos(declination) * Math.cos(hourAngle));
  const lunarAngle = 2 * Math.PI * moon / 29.53;
  const daylight = 24 * Math.acos(-Math.tan(latitude) * Math.tan(declination)) / Math.PI;
  const lunarPercent = 50 * (1 - Math.cos(lunarAngle));
  const sky = Math.abs(altitude / radians) < .02 ? 'Sun on the horizon' : altitude > 0 ? 'Day' : 'Night';
  return { latitude, longitude, declination, hourAngle, altitude, daylight, lunarAngle, lunarPercent, sky };
}

export const labs = {
  forces: {
    controls: [['mass','Object mass (kg)',1,10,1,3],['gravity','Gravity (m/s²)',1,20,.1,9.8],['friction','Friction coefficient',0,.8,.05,.15],['push','Down-ramp force (N)',0,40,1,12],['angle','Ramp angle (°)',0,40,1,12]],
    notes: 'The cart represents a sliding block starting from rest. Static and kinetic friction use the same coefficient. The track is schematic and is assumed long enough for a two-second trial.',
    run: ({ mass, gravity, friction, push, angle }) => {
      const radians = angle * Math.PI / 180;
      const drive = push + mass * gravity * Math.sin(radians);
      const resistance = Math.min(drive, friction * mass * gravity * Math.cos(radians));
      const acceleration = (drive - resistance) / mass;
      return [['Applied force',push,'N'],['Friction',round(resistance),'N'],['Acceleration',round(acceleration),'m/s²'],['Speed at 2 s',round(2 * acceleration),'m/s'],['Distance at 2 s',round(2 * acceleration),'m']];
    }
  },
  electric: {
    controls: [['voltage','Battery voltage (V)',1,12,1,6],['resistance','Resistor (Ω)',0,24,1,3],['battery','Install battery',['No','Yes'],1],['wire','Connect return wire',['No','Yes'],1],['switch','Switch',['Open','Closed'],0],['material','Test link',['Copper','Plastic','Graphite'],0],['pattern','Bulb arrangement',['One bulb','Series','Parallel'],0]],
    notes: 'Ideal DC source and fixed 12 Ω bulb equivalents. The added resistor and test link precede the bulbs. Brightness represents bulb power. Moving dots represent conventional current and exaggerate its speed.',
    run: ({ voltage, resistance, battery, wire, switch: closed, material, pattern }) => {
      const total = resistance + [0, Infinity, 15][material] + [12, 24, 6][pattern];
      const current = battery && wire && closed ? voltage / total : 0;
      const bulb = pattern === 2 ? current / 2 : current;
      return [['Circuit current',round(current),'A'],['Current per bulb',round(bulb),'A'],['Power per bulb',round(bulb ** 2 * 12),'W']];
    }
  },
  matter: {
    controls: [['temperature','Water temperature (°C)',-35,135,1,22]],
    notes: 'Pure water at approximately 1 atm. At 0 °C or 100 °C two phases can coexist. Surface evaporation and condensation can also happen below the boiling point. The model omits heat transfer and latent heat.',
    run: ({ temperature: t }) => [['Bulk state',t < 0 ? 'Solid' : t === 0 ? 'Ice and liquid' : t < 100 ? 'Liquid' : t === 100 ? 'Liquid and gas' : 'Gas',''],['Absolute temperature',round(t + 273.15),'K']]
  },
  space: {
    controls: [['hour','Local solar time (hour)',0,24,.25,12],['tilt','Earth tilt (°)',0,35,.5,23.5],['orbit','Days since March equinox',0,365,1,0],['moon','Days since new moon',0,29.53,.1,7.4],['view','Diagram viewpoint',['Day and night','Earth’s orbit'],0]],
    notes: 'The model uses approximate latitude 36° N, a circular orbit and local solar time. Civil clocks and atmospheric refraction are omitted. Diagrams exaggerate sizes and project distances. The Moon inset shows the lit portion visible from Earth. Its orientation is illustrative and eclipses are omitted.',
    run: values => {
      const { altitude, daylight, lunarPercent, sky } = spaceGeometry(values);
      const angle = altitude * 180 / Math.PI;
      const shadow = angle > .1 ? round(1 / Math.tan(altitude)) : angle > 0 ? 'Very long near the horizon' : 'No direct Sun';
      return [['Sun altitude',round(angle),'°'],['Daylight',round(daylight),'h'],['Shadow per metre',shadow,typeof shadow === 'number' ? 'm' : ''],['Visible Moon lit',round(lunarPercent),'%'],['Malta sky',sky,'']];
    }
  },
  ecosystem: {
    controls: [['plants','Plants at start',0,120,1,80],['rabbits','Rabbits at start',0,40,1,20],['insects','Insects at start',0,50,1,25],['owls','Owls at start',0,20,1,6],['habitat','Habitat retained (%)',0,100,5,85],['rain','Rainfall index',0,100,5,70]],
    notes: 'Plants feed rabbits and insects, which feed owls. Twelve teaching steps use limited plant recovery and food-dependent population growth. Counts can fall but extinct populations cannot reappear. This is a toy food web.',
    run: ({ plants, rabbits, insects, owls, habitat, rain }) => {
      const capacity = 120 * habitat / 100 * rain / 100;
      for (let month = 0; month < 12; month++) {
        const food = plants / (plants + 25);
        const prey = (rabbits + insects) / (rabbits + insects + 20);
        const pressure = owls / (owls + 12);
        plants = Math.max(0, plants + .22 * plants * (1 - plants / Math.max(1, capacity)) - .05 * food * (rabbits + insects));
        rabbits *= 1 + .26 * food - .13 - .19 * pressure;
        insects *= 1 + .33 * food - .12 - .13 * pressure;
        owls *= 1 + .32 * prey - .18;
      }
      return [['Plants',round(plants),''],['Rabbits',round(rabbits),''],['Insects',round(insects),''],['Owls',round(owls),'']];
    }
  },
  flood: {
    controls: [['rise','Sea level assumption (m)',0,2,.1,.4],['surge','Storm surge (m)',0,3,.1,1],['barrier','Barrier height (m)',0,2,.25,0],['retreat','Move low homes uphill',['No','Yes'],0],['wetland','Restore coastal wetland',['No','Yes'],0]],
    notes: 'Fictional town and costs. Residual water level = max(0, sea level + surge − barrier − 0.3 m with wetland). Elevation thresholds approximate exposure. The model omits drainage, flow and barrier failure.',
    run: ({ rise, surge, barrier, retreat, wetland }) => {
      const level = Math.max(0, round(rise + surge - barrier - .3 * wetland));
      const exposed = sites.filter(([, elevation], i) => level >= (i === 3 && retreat ? 4 : elevation));
      return [['Residual water level',level,'m'],['Exposed buildings / assets',exposed.reduce((total, [, , count]) => total + count, 0),''],['Exposed sites',exposed.map(([name]) => name).join(', ') || 'None',''],['Cost',400 * barrier + 350 * retreat + 200 * wetland,'€k']];
    }
  },
  water: {
    controls: [['rain','Monthly rainfall (mm)',0,150,5,35],['storage','Initial storage (ML)',0,80,5,25],['demand','Monthly demand (ML)',10,140,5,65],['leak','Distribution loss (%)',0,35,5,20],['desal','Desalinated supply (ML)',0,100,5,30],['save','Conservation (%)',0,40,5,0]],
    notes: 'One-month water balance. Harvest 0.35 ML per mm of rain. Starting storage plus new supply is drawn down for net demand adjusted for leakage. Maximum end storage 80 ML. Cost is a fictional desalination operating cost.',
    run: ({ rain, storage, demand, leak, desal, save }) => {
      const supply = storage + rain * .35 + desal;
      const required = demand * (1 - save / 100) / (1 - leak / 100);
      return [['Water available',round(supply),'ML'],['Supply required',round(required),'ML'],['Shortfall',round(Math.max(0,required - supply)),'ML'],['Closing storage',round(Math.max(0,Math.min(80,supply - required))),'ML'],['Desalination cost',round(1.2 * desal),'€k']];
    }
  },
  solar: {
    controls: [['solar','Solar size (MW)',0,20,1,5],['sun','Peak sun hours',1,8,.5,5],['demand','Daily demand (MWh)',5,120,5,45],['battery','Storage capacity (MWh)',0,60,1,5],['save','Efficiency savings (%)',0,40,5,0]],
    notes: 'One representative day, split into daytime and nighttime demand. Solar meets daytime needs first, then charges storage. Storage returns 85% of stored energy. Costs are fictional capital costs.',
    run: ({ solar, sun, demand, battery, save }) => {
      const generation = .85 * solar * sun;
      const net = demand * (1 - save / 100);
      const direct = Math.min(net * .55, generation);
      const discharged = Math.min(net * .45, .85 * Math.min(battery, generation - direct));
      return [['Solar generation',round(generation),'MWh'],['Storage delivered',round(discharged),'MWh'],['Demand met by solar',round(100 * (direct + discharged) / net),'%'],['Grid requirement',round(net - direct - discharged),'MWh'],['Capital cost',650 * solar + 220 * battery,'€k']];
    }
  },
  urban: {
    controls: [['trees','Trees planted',0,120,10,20],['green','Permeable space (%)',0,60,5,15],['transit','Bus routes',0,6,1,1],['walk','Pedestrian streets',0,10,1,2],['buildings','New buildings',0,30,1,10],['roads','Road expansion (km)',0,8,1,2]],
    notes: 'Fictional scores, not real forecasts. Trees and green space lower heat and runoff scores. Buildings and road expansion increase pressure. Accessibility favours bus routes and pedestrian streets.',
    run: ({ trees, green, transit, walk, buildings, roads }) => [
      ['Heat score',round(Math.max(0,60 + buildings + 2 * roads - .25 * trees - .35 * green)),''],
      ['Runoff score',round(Math.max(0,65 + .6 * buildings + 2 * roads - green - .08 * trees)),''],
      ['Access score',Math.min(100,30 + 8 * transit + 4 * walk + 2 * roads),''],
      ['Existing habitat retained',Math.max(0,Math.min(100,80 + .3 * green - buildings - 3 * roads)),'%'],
      ['Cost',trees * 2 + green * 5 + transit * 80 + walk * 30 + roads * 140,'€k']
    ].map(([name,value,unit]) => [name,round(value),unit])
  }
};

export function defaults(id) {
  return Object.fromEntries(labs[id].controls.map(([key, , kind, , , start], index) => [
    key, Array.isArray(kind) ? labs[id].controls[index][3] : start
  ]));
}
export function displayInputs(id, values) {
  return Object.fromEntries(labs[id].controls.map(([key, label, kind]) => [
    label, Array.isArray(kind) ? kind[values[key]] : values[key]
  ]));
}
