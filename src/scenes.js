import { sites, spaceGeometry } from './models.js';

export function scene(canvas, id, v = {}, results = [], t = 0, historic = true, position = 0, active = false) {
  const c = canvas.getContext('2d');
  if (!c) return;
  const w = canvas.width, h = canvas.height;
  c.setTransform(w / 720, 0, 0, h / 300, 0, 0);
  const history = ['roman','mdina','knights'].includes(id);
  const town = ['flood','water','solar','urban'].includes(id);
  const sky = c.createLinearGradient(0,0,720,300);
  sky.addColorStop(0, history ? (historic ? '#412642' : '#214466') : town ? '#113f58' : '#111d36');
  sky.addColorStop(1, history ? (historic ? '#e5a56e' : '#758eaa') : town ? '#247b81' : '#263571');
  const box = (x,y,a,b,color) => { c.fillStyle = color; c.fillRect(x,y,a,b); };
  const path = (points,color,fill=false,line=2) => {
    c.beginPath(); points.forEach(([x,y],i) => i ? c.lineTo(x,y) : c.moveTo(x,y));
    if (fill) { c.closePath(); c.fillStyle = color; c.fill(); }
    else { c.strokeStyle = color; c.lineWidth = line; c.stroke(); }
  };
  const dot = (x,y,r,color) => { c.beginPath(); c.arc(x,y,r,0,Math.PI*2); c.fillStyle=color; c.fill(); };
  const label = (name,x,y,color='#e7f2ff') => { c.font='600 13px system-ui'; c.fillStyle=color; c.fillText(name,x,y); };
  const prism = (x,y,width,height,depth,front,side,roof) => {
    box(x,y-height,width,height,front);
    path([[x+width,y],[x+width+depth,y-depth],[x+width+depth,y-height-depth],[x+width,y-height]],side,true);
    path([[x,y-height],[x+depth,y-height-depth],[x+width+depth,y-height-depth],[x+width,y-height]],roof,true);
  };
  box(0,0,720,300,sky);
  for (let i=0;i<32;i++) dot((i*103+17)%720,(i*79+11)%170,1,'#ffffff25');

  if (id === 'mdina') {
    const vanishingX = [354, 304, 382][position];
    const horizon = 132;
    const project = (x, y, depth) => {
      const scale = 200 / depth;
      return [vanishingX + x * scale, horizon - (y - 1.65) * scale];
    };
    const polygon = (vertices, color) => path(vertices.map(point => project(...point)), color, true);
    const lightStone = historic ? '#dcb187' : '#dccab0';
    const darkStone = historic ? '#8e6150' : '#8d7b6e';
    const street = historic ? '#a0816c' : '#919396';
    const masonry = historic ? '#795a51' : '#77767c';
    dot(vanishingX + 54, 60, 32, historic ? '#ffd5ab' : '#d0e5ef');
    polygon([[-35,0,25],[35,0,25],[35,0,1.3],[-35,0,1.3]], street);
    for (let depth = 22; depth > 1.3; depth -= .85) {
      path([project(-9,0,depth), project(9,0,depth)], masonry, false, 1);
      if (!historic) {
        path([project(-2.2,0,depth),project(-2.2,0,Math.max(1.3,depth-.8))],'#e3ce9f');
      }
    }

    for (let block = 5; block >= 0; block--) {
      const front = 2.4 + block * 3.5;
      const back = front + 3.5;
      const wallFront = block === 0 ? 1.15 : front;
      const height = 4.1 + ((block + position) % 3) * .55;
      for (const side of [-1, 1]) {
        const x = side * (side === 1 && block === 0 ? 2.55 : 2.15);
        polygon([[x,0,wallFront],[x,height,wallFront],[x,height,back],[x,0,back]], side === 1 ? lightStone : darkStone);
        for (let course = .55; course < height; course += .48) {
          path([project(x,course,wallFront),project(x,course,back)],side === 1 ? '#c0947b' : '#77594f',false,1);
        }
        polygon([[x,.9,front+.7],[x,2.45,front+.7],[x,2.45,front+1.55],[x,.9,front+1.55]], '#574350');
        polygon([[x,2.75,front+1.4],[x,3.54,front+1.4],[x,3.54,front+2.25],[x,2.75,front+2.25]], side === 1 ? '#75544f' : '#4b414e');
      }
    }
    if (position === 0) {
      const gate = historic ? '#cc9d76' : '#bdbaa9';
      polygon([[-3,2.5,4.6],[3,2.5,4.6],[3,4.65,4.6],[-3,4.65,4.6]], gate);
      polygon([[-3,0,4.6],[-1.28,0,4.6],[-1.28,3.05,4.6],[-3,3.05,4.6]], gate);
      polygon([[1.28,0,4.6],[3,0,4.6],[3,3.05,4.6],[1.28,3.05,4.6]], gate);
      const arch = Array.from({length: 9}, (_, i) => {
        const angle = Math.PI * i / 8;
        return project(Math.cos(angle) * 1.25, 2.1 + Math.sin(angle), 4.59);
      });
      path([project(1.25,0,4.59), ...arch, project(-1.25,0,4.59)], '#664f4b', false, 4);
    } else if (position === 1) {
      const counter = historic ? '#865549' : '#536978';
      polygon([[.95,0,3.3],[2.5,0,3.3],[2.5,.9,3.3],[.95,.9,3.3]], counter);
      polygon([[.7,2.0,3.2],[2.75,2.0,3.2],[2.75,2.55,4.8],[.7,2.55,4.8]],historic ? '#c6595b' : '#659492');
      for(let i=0;i<4;i++) {
        polygon([[1+i*.36,.91,3.35],[1.25+i*.36,.91,3.35],[1.3+i*.36,1.04,3.7],[1+i*.36,1.04,3.7]], ['#e1c4a4','#7b566e','#d1a96a','#6a7777'][i]);
      }
    } else {
      polygon([[.85,0,3.6],[2.85,0,3.6],[2.85,2.7,3.6],[.85,2.7,3.6]], historic ? '#503744' : '#566378');
      if (historic) {
        const [x,y] = project(1.7,.73,3.5);
        dot(x,y,18,'#d6704b');
        dot(x,y+5,9,'#ffb165');
        box(x-39,y+6,25,11,'#4e4b59');
      } else {
        path([project(1.85,0,3.57),project(1.85,2.7,3.57)], '#9da2a9',false,3);
      }
    }
    const [walkerX,walkerY] = project(-.8,0,5.6);
    dot(walkerX,walkerY-52,9,historic ? '#b88465' : '#a8786c');
    path([[walkerX-10,walkerY-42],[walkerX+10,walkerY-42],[walkerX+15,walkerY-10],[walkerX-15,walkerY-10]], historic ? '#764b60' : '#39667f',true);
    path([[walkerX-9,walkerY-12],[walkerX-12,walkerY],[walkerX+12,walkerY],[walkerX+9,walkerY-12]], '#53414d',false,4);
    box(12,9,historic ? 184 : 195,27,'#272139');
    label(historic ? 'Educational reconstruction' : 'Present-day reference view',22,28);
    return;
  }

  if (history) {
    dot(584,74,37,historic?'#ffd3a0':'#b4d7ec');
    const stone = historic?'#d9aa77':'#a7acb3';
    const side = historic?'#997057':'#647383';
    const roof = historic?'#f2cd9e':'#c6ccd1';
    path([[0,230],[160,177],[350,190],[600,153],[720,190],[720,300],[0,300]],'#57617c',true);
    path([[0,300],[273,300],[465,150],[396,156]],historic?'#b98c67':'#5f6b7b',true);
    for(let i=0;i<11;i++) {
      const x = i*75-45-position*16;
      const y = 234 - (i%3)*16;
      const height = 48 + (i*37)%85;
      prism(x,y,55,height,14,stone,side,roof);
      box(x+19,y-32,14,32,side);
      box(x+12,y-height+13,11,15,side);
    }
    if (historic && id==='roman') {
      path([[298,268],[445,268],[486,232],[357,232]],'#7c4c48',true);
      for(let i=0;i<12;i++) dot(358+i%6*15-Math.floor(i/6)*10,239+Math.floor(i/6)*12,4,'#e3bd89');
      for(let i=0;i<4;i++) prism(264+i*34,191,8,66,4,stone,side,roof);
    }
    if (id==='knights') {
      path([[437,179],[720,162],[720,300],[402,300]],'#3c879f',true);
      prism(506,204,120,67,25,stone,side,roof);
      prism(544,168,45,38,12,stone,side,roof);
    }
    label(historic ? 'Educational reconstruction' : 'Present-day reference view',22,28);
    return;
  }

  if (town) {
    path([[0,300],[0,161],[142,163],[281,115],[438,166],[624,89],[720,105],[720,300]],'#5b8d78',true);
    path([[0,264],[134,237],[252,228],[376,184],[527,173],[720,111],[720,201],[620,208],[494,252],[284,283],[188,300],[0,300]],'#abbaa2',true);
    const level = Number(results[0]?.[1]) || 0;
    const shore = id==='flood' ? 286-Math.min(level*22,112) : 278;
    path([[0,shore],[145,shore+15],[340,shore-17],[535,shore+6],[720,shore-24],[720,300],[0,300]],'#247ca2',true);
    for(let i=0;i<sites.length;i++) {
      const [name,elevation] = sites[i];
      const x=45+i*82, y=252-elevation*21;
      const wet=id==='flood' && level>=(i===3 && v.retreat ? 4 : elevation);
      const n = id==='urban' ? Math.min(4,1+Math.floor((v.buildings || 0)/8)) : 3;
      for(let j=0;j<n;j++) prism(x+j*16,y-j*4,11,14+j*6,7,wet?'#ec9a82':'#dfd2ad','#778c83','#f7e3bb');
      if(wet) dot(x+10,y-35,3.8,'#ffb293');
      if(i%2===0) label(name,x-5,y+16);
    }
    if (id==='flood' && v.barrier) path([[0,247],[180,237],[340,205]],'#e5ddbe',false,2+v.barrier*4);
    if (id==='flood' && v.wetland) for(let i=0;i<18;i++) dot(33+i*9,242+Math.sin(i)*4,4,'#75bf80');
    if (id==='urban') for(let i=0;i<(v.trees || 20)/3;i++) dot(32+(i*109)%650,170+(i*61)%61,4,'#183f32');
    if (id==='solar') for(let i=0;i<(v.solar || 4);i++) prism(350+i%10*22,172+Math.floor(i/10)*16,14,2,7,'#375c87','#203144','#385d95');
    if (id==='water') {
      box(535,72,61,65,'#203c55');
      box(540,133-Math.min(55,Number(results[3]?.[1])*.68),51,Math.min(55,Number(results[3]?.[1])*.68)||0,'#63d6ff');
      label('Reservoir',530,61);
    }
    label('Fictional Maltese coastal town',22,28);
    return;
  }

  if (id==='forces') {
    for(let i=0;i<12;i++) path([[i*70-30,300],[290+i*20,129]],'#9ba9ff22');
    for(let i=0;i<5;i++) path([[0,184+i*i*6],[720,184+i*i*6]],'#9ba9ff22');
    const delta = (v.angle ?? 12)*2.65;
    const y = 186-delta;
    path([[112,y],[606,186],[606,229],[112,y+43]],'#2a4481',true);
    path([[112,y],[160,y-22],[654,164],[606,186]],'#5980af',true);
    const distance = Number(results[4]?.[1]) || 0;
    const travelled = distance*t*t;
    const x = 172+(travelled/110)*365, by = y+(x-112)*delta/494;
    prism(x,by,54,30,17,'#8dc6fd','#4d72d8','#ceebff');
    const push = v.push ?? 12, resistance = results[1]?.[1] || 0;
    const arrow = (length,color) => {
      if (!length) return;
      const end=x+27+length;
      path([[x+27,by-43],[end,by-43]],color,false,3);
      path([[end-Math.sign(length)*8,by-49],[end,by-43],[end-Math.sign(length)*8,by-37]],color,false,3);
    };
    arrow(push*2,'#83ebd9'); arrow(-resistance*4,'#ffab9d');
    label('Cart on an adjustable ramp',22,28);
    if (active) label(travelled.toFixed(2)+' m travelled',22,247);
    label('Push',540,272,'#83ebd9'); label('Friction',605,272,'#ffab9d');
  } else if (id==='electric') {
    const current = results[0]?.[1] || 0;
    const connected = v.wire ? [[190,80],[190,224],[530,224],[530,80]] : [[190,80],[190,224],[320,224]];
    path(connected,'#7595d2',false,5);
    path([[190,80],[338,80]],'#7595d2',false,5);
    path([[338,80],[382,v.switch ? 80 : 55]],'#a5c4ff',false,5);
    path([[382,80],[530,80]],'#7595d2',false,5);
    if (v.pattern===2) path([[190,128],[530,128]],'#7595d2',false,5);
    if (v.battery) {box(166,125,48,44,'#4e679d');label('+  −',175,152);}
    const bulbs = v.pattern===2 ? [[360,224],[360,128]] : v.pattern===1 ? [[330,224],[440,224]] : [[360,224]];
    bulbs.forEach(([x,y])=>{if(current)dot(x,y,35,'#ffd57b30');dot(x,y,23,current?'#ffd57b':'#40527a');label('Bulb',x-13,y+4,current?'#181c34':'#fff');});
    if (current) for(let i=0;i<14;i++) dot(195+(i*53+t*710)%335,i%2?80:224,3,'#9bfff1');
    label('DC circuit model',22,28);
  } else if (id==='matter') {
    const temp = v.temperature ?? 22;
    path([[190,57],[190,251],[529,251],[529,57]],'#759be8',false,4);
    for(let i=0;i<48;i++) {
      const solid = temp<0 || (temp===0 && i<24);
      const gas = temp>100 || (temp===100 && i>=24);
      const x = solid ? 240+i%12*22 : 220+(i*67+Math.sin(t*7+i)*(gas?32:16)+30)%280;
      const y = solid ? 165+Math.floor(i/12)*19+Math.sin(t*12+i)*2 : (gas?73:159)+(i*47+Math.cos(t*7+i)*16+20)%(gas?153:61);
      dot(x,y,7,gas?'#ffc9a9':solid?'#9ae7ff':'#8ba8ff');
    }
    label('Water particle model',22,28);
  } else if (id==='space') {
    const { latitude, longitude, declination, hourAngle, lunarAngle, lunarPercent, sky } = spaceGeometry(v);
    const sun = (x,y,r) => {
      const glow = c.createRadialGradient(x,y,r*.2,x,y,r*1.6);
      glow.addColorStop(0,'#fffbdd'); glow.addColorStop(.64,'#ffbd63'); glow.addColorStop(1,'#ffa13700');
      dot(x,y,r*1.6,glow);
    };
    if (v.view === 1) {
      const cx = 265, cy = 146;
      c.beginPath(); c.ellipse(cx,cy,160,79,0,0,2*Math.PI); c.strokeStyle='#7fa9db'; c.lineWidth=2; c.stroke();
      sun(cx,cy,36);
      const earthX = cx + 160 * Math.sin(longitude), earthY = cy - 79 * Math.cos(longitude);
      label('March equinox',215,55); label('June solstice',388,115); label('September equinox',206,257); label('December solstice',56,115);
      dot(earthX,earthY,22,'#60a8d1');
      const tilt = v.tilt * Math.PI / 180;
      path([[earthX+36*Math.sin(tilt),earthY+36*Math.cos(tilt)],[earthX-36*Math.sin(tilt),earthY-36*Math.cos(tilt)]],'#e1fbff',false,2);
      label('Earth’s orbit · perspective view',22,28);
    } else {
      const earthX = 315, earthY = 151, radius = 83;
      const rayX = Math.cos(declination), rayY = Math.sin(declination);
      const sunX = earthX - 204 * rayX, sunY = earthY - 204 * rayY;
      sun(sunX,sunY,39);
      for (const offset of [-44,0,44]) {
        const from = [sunX+59*rayX-offset*rayY,sunY+59*rayY+offset*rayX];
        const to = [earthX-96*rayX-offset*rayY,earthY-96*rayY+offset*rayX];
        path([from,to],'#ffce87',false,1.5);
      }
      dot(earthX,earthY,radius,'#232e54');
      c.save();
      c.translate(earthX,earthY);
      c.rotate(declination);
      const lit = c.createRadialGradient(-52,-24,8,2,0,100);
      lit.addColorStop(0,'#abf7df'); lit.addColorStop(1,'#34699d');
      c.beginPath(); c.arc(0,0,radius,Math.PI/2,3*Math.PI/2); c.closePath();
      c.fillStyle=lit; c.fill();
      c.restore();
      path([[earthX,earthY-radius-10],[earthX,earthY+radius+10]],'#91b5dc80');
      path([[earthX-radius,earthY],[earthX+radius,earthY]],'#b2def074');
      const maltaX = earthX - radius * Math.cos(latitude) * Math.cos(hourAngle);
      const maltaY = earthY - radius * Math.sin(latitude);
      const farSide = Math.sin(hourAngle) < -.001;
      dot(maltaX,maltaY,6,'#ffd899');
      if (farSide) dot(maltaX,maltaY,3.8,'#202947');
      label('Malta',maltaX-16,maltaY-11,'#ffffff');
      label('Light from the Sun',22,28);
      label('Malta · '+sky+(farSide ? ' · far side of the globe' : ''),22,275);
    }
    box(512,48,184,179,'#131e3bbd');
    const moonX=604, moonY=135, moonRadius=41;
    dot(moonX,moonY,moonRadius+1,'#8ba4cf');
    dot(moonX,moonY,moonRadius,'#2c3658');
    const side = lunarAngle <= Math.PI ? 1 : -1;
    const limb = [], terminator = [];
    for (let i=0;i<=40;i++) {
      const y = moonRadius * (i/20-1);
      const halfWidth = Math.sqrt(Math.max(0, moonRadius**2-y**2));
      limb.push([moonX+side*halfWidth,moonY+y]);
      terminator.unshift([moonX+side*Math.cos(lunarAngle)*halfWidth,moonY+y]);
    }
    path(limb.concat(terminator),'#e8e5ce',true);
    label('Moon seen from Earth',532,74);
    label(Math.round(lunarPercent)+'% of visible face lit',534,203);
    label('Sizes and distances are schematic',460,275);
  } else {
    ['Plants','Rabbits','Insects','Owls'].forEach((name,i)=>{
      const x = 120+i*160,y=i%2 ? 110 : 201, value=Number(results[i]?.[1]) || 0;
      if(i<3) path([[x+28,y],[x+125,i%2?201:110]],'#7b9bca',false,3);
      dot(x,y,27+Math.min(32,value/3),['#3c9f8d','#846ccf','#b56483','#577cbe'][i]);
      label(name,x-22,y+4);
    });
    path([[143,192],[417,192],[576,131],[300,129]],'#97ddb5',false);
    label('Illustrative food web · plant and prey links',22,28);
  }

  if (active && id==='forces') label('Trial time  '+(2*t).toFixed(1)+' s',22,270);
}
