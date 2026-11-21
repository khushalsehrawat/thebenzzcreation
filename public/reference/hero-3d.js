/* ================= BACKGROUND: scroll-driven 3D point structure (Three.js) ================= */
(() => {
let initialized = false;
function start() {
if (initialized || !window.THREE) return;
initialized = true;
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const motion = matchMedia('(prefers-reduced-motion:reduce)');
let rm = motion.matches;
const fine = matchMedia('(pointer:fine)').matches;
const cv=$('#bg'),nogl=()=>{cv.hidden=true;document.body.classList.add('nogl')};
if(!window.THREE)return nogl();
let R;try{R=new THREE.WebGLRenderer({canvas:cv,antialias:false,alpha:true,powerPreference:'high-performance'})}catch(e){return nogl()}
const mob=innerWidth<760,N=mob?4200:12500,rnd=Math.random,V=(x,y,z)=>new THREE.Vector3(x,y,z);
R.setPixelRatio(Math.min(devicePixelRatio||1,mob?1.5:2));
const sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(35,1,.1,100);cam.position.z=14;
const kc=t=>V((2+Math.cos(3*t))*Math.cos(2*t),(2+Math.cos(3*t))*Math.sin(2*t),Math.sin(3*t));
/* five structures the page morphs through as you scroll */
const SH=[
()=>{const a=new Float32Array(N*3);for(let i=0;i<N;i++){const t=i/N*6.2832,p0=kc(t),T=kc(t+.01).sub(p0).normalize(),A=Math.abs(T.z)<.9?V(0,0,1):V(1,0,0),n=new THREE.Vector3().crossVectors(T,A).normalize(),b=new THREE.Vector3().crossVectors(T,n),v=rnd()*6.2832,r=.29*(.85+.15*rnd()),p=p0.addScaledVector(n,Math.cos(v)*r).addScaledVector(b,Math.sin(v)*r).multiplyScalar(.8);a.set([p.x,p.y,p.z],i*3)}return a},
()=>{const a=new Float32Array(N*3),g=Math.ceil(Math.cbrt(N)),gz=Math.ceil(N/(g*g));for(let i=0;i<N;i++){const x=i%g,y=(i/g|0)%g,z=i/(g*g)|0,X=(x/(g-1)-.5)*4.4,Y=(y/(g-1)-.5)*4.4,Z=(z/Math.max(1,gz-1)-.5)*4.4,an=Y*.55,c=Math.cos(an),s=Math.sin(an);a.set([X*c-Z*s,Y,X*s+Z*c],i*3)}return a},
()=>{const a=new Float32Array(N*3),j=()=>(rnd()-.5)*.09;for(let i=0;i<N;i++){const k=i%10;let u=rnd(),x,z;if(k>=8)u=Math.round(u*22)/22;const y=(u-.5)*5.4,an=u*13.8,r=1.15;if(k<4){x=Math.cos(an)*r;z=Math.sin(an)*r}else if(k<8){x=Math.cos(an+Math.PI)*r;z=Math.sin(an+Math.PI)*r}else{const w=rnd()*2-1;x=Math.cos(an)*r*w;z=Math.sin(an)*r*w}a.set([x+j(),y+j(),z+j()],i*3)}return a},
()=>{const a=new Float32Array(N*3),g=Math.ceil(Math.sqrt(N));for(let i=0;i<N;i++){const x=((i%g)/(g-1)-.5)*5.4,z=((i/g|0)/(g-1)-.5)*5.4;a.set([x,.55*Math.sin(x*1.5)*Math.cos(z*1.5)+.25*Math.sin(z*2.4),z],i*3)}return a},
()=>{const a=new Float32Array(N*3);for(let i=0;i<N;i++){const u=Math.pow(rnd(),.6),an=u*9+(i%3)*2.0944+rnd()*.35,r=u*2.8;a.set([Math.cos(an)*r,(rnd()-.5)*.25*(1-u*.6),Math.sin(an)*r],i*3)}return a}];
const pos=SH.map(f=>f()),aR=new Float32Array(N),aRed=new Float32Array(N);for(let i=0;i<N;i++){aR[i]=rnd();aRed[i]=rnd()<.13?1:0}
const A=new THREE.BufferAttribute(pos[0].slice(),3),B=new THREE.BufferAttribute(pos[1].slice(),3),geo=new THREE.BufferGeometry();
geo.setAttribute('position',A);geo.setAttribute('aB',B);geo.setAttribute('aR',new THREE.BufferAttribute(aR,1));geo.setAttribute('aRed',new THREE.BufferAttribute(aRed,1));
const U={uM:{value:0},uT:{value:0},uAp:{value:0},uVel:{value:0},uScan:{value:0},uPx:{value:R.getPixelRatio()*(mob?.9:1)},uLight:{value:0},uOp:{value:1},uViewport:{value:innerHeight}};
const mat=new THREE.ShaderMaterial({uniforms:U,transparent:true,depthWrite:false,
vertexShader:`attribute vec3 aB;attribute float aR;attribute float aRed;uniform float uM,uT,uAp,uVel,uScan,uPx,uLight,uViewport;varying float vRed,vG,vDepth,vShade;
void main(){float k=smoothstep(aR*.45,.55+aR*.45,uM);vec3 p=mix(position,aB,k);
p+=vec3(sin(uT*.6+aR*40.),cos(uT*.5+aR*31.),sin(uT*.7+aR*17.))*.03;
p.y+=sin(p.x*2.+uT)*uVel*.35;
p*=smoothstep(0.,1.,clamp(uAp*1.5-aR*.5,0.,1.));
float g=1.-smoothstep(0.,.4,abs(p.y-uScan));vRed=aRed;vG=g;
vec4 mv=modelViewMatrix*vec4(p,1.);
vDepth=clamp((mv.z+17.)/6.,0.,1.);
vShade=.55+.45*sin(aR*32.+p.y*1.8+uT*.2);
gl_PointSize=clamp((2.+aRed*1.2+g*.7)*(1.+uLight*.25)*uPx*(uViewport/900.)*(14./(-mv.z)),1.,7.);gl_Position=projectionMatrix*mv;}`,
fragmentShader:`uniform float uLight,uOp;varying float vRed,vG,vDepth,vShade;
void main(){vec2 c=gl_PointCoord-.5;float d=length(c);if(d>.5)discard;float a=1.-smoothstep(.15,.5,d);
vec3 base=mix(vec3(.84,.86,.9),vec3(.015,.018,.025),uLight);
float hot=max(max(vRed,vG*.9),step(.73,vShade)*uLight),lightRed=hot*uLight;
vec3 red=mix(vec3(.9,.17,.29),vec3(1.,.025,.12),uLight);
vec3 col=mix(base,red,hot);
float shine=1.-smoothstep(0.,.18,d);
col=mix(col,vec3(1.,.58,.64),shine*lightRed*.15);
float glow=exp(-d*d*15.)*lightRed*.45;
col*=mix(.65,1.2,vDepth);
float opacity=a*uOp*(.4+.6*vDepth)*vShade+glow*uOp;
// Light panels need stronger ink because their backgrounds sit above this canvas.
opacity=mix(opacity,a*(.78+.22*vDepth),uLight);
gl_FragColor=vec4(col,min(1.,opacity));}`});
// Fine strands describe the surface so the knot reads as a volume, even at rest.
const threadPositions=[];
for(let strand=0;strand<14;strand++){
 const angle=strand/14*Math.PI*2;
 const point=t=>{const c=kc(t),tangent=kc(t+.001).sub(c).normalize(),normal=new THREE.Vector3().crossVectors(tangent,V(0,0,1)).normalize(),binormal=new THREE.Vector3().crossVectors(tangent,normal);return c.addScaledVector(normal,Math.cos(angle)*.29).addScaledVector(binormal,Math.sin(angle)*.29).multiplyScalar(.8)};
 for(let j=0;j<240;j++){const a=point(j/240*Math.PI*2),b=point((j+1)/240*Math.PI*2);threadPositions.push(a.x,a.y,a.z,b.x,b.y,b.z)}
}
const threadGeometry=new THREE.BufferGeometry();threadGeometry.setAttribute('position',new THREE.Float32BufferAttribute(threadPositions,3));
const threadMaterial=new THREE.LineBasicMaterial({color:0xe52b4a,transparent:true,opacity:.11,depthWrite:false});
const sculpture=new THREE.Group();sc.add(sculpture);
const threads=new THREE.LineSegments(threadGeometry,threadMaterial);sculpture.add(threads);
const pts=new THREE.Points(geo,mat);pts.frustumCulled=false;sculpture.add(pts);
let secs=[],docMax=1,hh=1,hw=1,S0=1,desk=true,idx=-1,sp=0,lastY=scrollY,vs=0,tx=0,ty=0,px=0,py=0,anchors=[],raf=0,lastFrame=0,elapsed=0,lightPanels=[];
const cl=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
function measure(){anchors=['.hero','#services','#build','#process','#contact'].map(sel=>{const el=$(sel);return el?el.getBoundingClientRect().top+scrollY:null}).filter(v=>v!==null);docMax=Math.max(1,document.documentElement.scrollHeight-innerHeight);secs=$$('main>section').map(s=>({t:s.offsetTop,b:s.offsetTop+s.offsetHeight,l:/\blt2?\b/.test(s.className)?1:s.id==='contact'?.5:0,h:s.classList.contains('hero')}));
 lightPanels=$$('.lt,.lt2,.cl').map(el=>{const r=el.getBoundingClientRect();return {x:r.left,y:r.top+scrollY,w:r.width,h:r.height}});
 cv.style.backgroundImage=lightPanels.map(()=>'linear-gradient(#fff,#fff)').join(',');
 cv.style.backgroundSize=lightPanels.map(r=>`${r.w}px ${r.h}px`).join(',');
 cv.style.backgroundRepeat='no-repeat';paintPanels();
}
// Give black particles a light backing only inside light panels, including the split contact section.
function paintPanels(){cv.style.backgroundPosition=lightPanels.map(r=>`${r.x}px ${r.y-scrollY}px`).join(',')}
addEventListener('scroll',paintPanels,{passive:true});
function place(){R.setPixelRatio(Math.min(devicePixelRatio||1,innerWidth<760?1.5:2));R.setSize(innerWidth,innerHeight,false);U.uViewport.value=innerHeight;cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();hh=Math.tan(.3054)*14;hw=hh*cam.aspect;desk=innerWidth>860;
S0=(desk?Math.min(hh*.8,hw*.46):Math.min(hh*.4,hw*.62))/2.8;U.uPx.value=R.getPixelRatio()*(mob?.9:1);measure();frame(elapsed,rm)}
function frame(t,still){
 const sy=scrollY;
 let section=0;while(section<anchors.length-2&&sy>=anchors[section+1])section++;
 const progress=anchors.length>1?(section+cl((sy-anchors[section])/Math.max(1,anchors[section+1]-anchors[section])))/(anchors.length-1):cl(sy/docMax);
 const pT=still?0:cl(progress);sp+=(pT-sp)*(still?1:.065);
 const s=sp*(SH.length-1),i0=Math.min(SH.length-2,Math.floor(s)),f=s-i0;
 if(i0!==idx){idx=i0;A.array.set(pos[i0]);B.array.set(pos[i0+1]);A.needsUpdate=B.needsUpdate=true}
 U.uM.value=cl((f-.25)/.5);U.uM.value=U.uM.value*U.uM.value*(3-2*U.uM.value);

 const y=sy+innerHeight*.5,sec=secs.find(q=>y>=q.t&&y<q.b)||secs[0]||{l:0,h:1};
 U.uLight.value+=((sec&&sec.l||0)-U.uLight.value)*.07;U.uOp.value+=((sec&&sec.h?1:sec&&sec.l===1?.9:1)-U.uOp.value)*.07;

 const dy=sy-lastY;lastY=sy;vs+=(cl(Math.abs(dy)/45)-vs)*.1;px+=(tx-px)*.05;py+=(ty-py)*.05;
 const e=still?1:cl(t/1.4),sh=cl(sy/innerHeight);
 U.uAp.value=e;U.uT.value=still?0:t;U.uVel.value=still?0:vs;U.uScan.value=Math.sin(t*.45)*24;
 const k=still?1:1-.2*cl(sp*4);sculpture.scale.setScalar(S0*k);threadMaterial.opacity=(1-U.uM.value)*(idx===0?1:0)*.045*(1-U.uLight.value)*e;
 sculpture.position.x=desk?hw*.49*Math.cos(sp*9.4248):hw*.32;
 sculpture.position.y=(desk?hh*.06:-hh*.18*(1-sh))+(still?0:Math.sin(sp*12.57)*hh*.1);
 sculpture.rotation.y=.6+(still?0:t*.13)+sp*9+px*.35;sculpture.rotation.x=.28+py*.25+(still?0:Math.sin(sp*6.28)*.35);sculpture.rotation.z=still?0:Math.sin(t*.12)*.08;
 R.render(sc,cam)}
function loop(now){
 raf=0;if(document.hidden||rm)return;
 const delta=lastFrame?Math.min((now-lastFrame)/1000,.05):1/60;lastFrame=now;elapsed+=delta;
 frame(elapsed,false);raf=requestAnimationFrame(loop);
}
function resume(){if(!raf&&!document.hidden&&!rm){lastFrame=0;raf=requestAnimationFrame(loop)}}
place();resume();
addEventListener('resize',place);
addEventListener('load',measure);
new ResizeObserver(measure).observe(document.querySelector('main'));
document.fonts.ready.then(measure);
document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0}else resume()});
motion.addEventListener('change',()=>{rm=motion.matches;cancelAnimationFrame(raf);raf=0;if(rm)frame(0,true);else resume()});
cv.addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(raf);raf=0;nogl()});
cv.addEventListener('webglcontextrestored',()=>{cv.hidden=false;document.body.classList.remove('nogl');place();resume()});
if(fine)addEventListener('pointermove',e=>{tx=(e.clientX/innerWidth-.5)*2;ty=(e.clientY/innerHeight-.5)*2},{passive:true});
}
addEventListener('benzz:three-ready',start,{once:true});
start();
})();

