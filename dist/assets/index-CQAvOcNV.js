var q=Object.defineProperty;var V=(o,t,s)=>t in o?q(o,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):o[t]=s;var h=(o,t,s)=>V(o,typeof t!="symbol"?t+"":t,s);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))i(e);new MutationObserver(e=>{for(const n of e)if(n.type==="childList")for(const f of n.addedNodes)f.tagName==="LINK"&&f.rel==="modulepreload"&&i(f)}).observe(document,{childList:!0,subtree:!0});function s(e){const n={};return e.integrity&&(n.integrity=e.integrity),e.referrerPolicy&&(n.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?n.credentials="include":e.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(e){if(e.ep)return;e.ep=!0;const n=s(e);fetch(e.href,n)}})();class r{constructor(t,s){h(this,"x");h(this,"y");t instanceof r?(this.x=t.x,this.y=t.y):(this.x=t??0,this.y=s??0)}rotate(t){const s=this.x*Math.cos(t)-this.y*Math.sin(t),i=this.x*Math.sin(t)+this.y*Math.cos(t);return this.x=s,this.y=i,this}rotateDegrees(t){const s=t*Math.PI/180,i=this.x*Math.cos(s)-this.y*Math.sin(s),e=this.x*Math.sin(s)+this.y*Math.cos(s);return this.x=i,this.y=e,this}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}normalize(){const t=this.length();return t!==0&&(this.x/=t,this.y/=t),this}angle(){return Math.atan2(this.y,this.x)}angleDegrees(){return this.angle()*180/Math.PI}static fromAngle(t){return new r(Math.cos(t),Math.sin(t))}static fromAngleDegrees(t){return this.fromAngle(t*Math.PI/180)}dist(t,s){let i=0;return t instanceof r&&(i=t.copy().sub(this.copy()).length()),typeof t=="number"&&(i=new r(t,s).sub(this.copy()).length()),i}add(t,s){return t instanceof r&&(this.x+=t.x,this.y+=t.y),typeof t=="number"&&(this.x+=t,this.y+=s??t),this}sub(t,s){return t instanceof r&&(this.x-=t.x,this.y-=t.y),typeof t=="number"&&(this.x-=t,this.y-=s??t),this}div(t,s){return t instanceof r&&(this.x/=t.x,this.y/=t.y),typeof t=="number"&&(this.x/=t,this.y/=s??t),this}mult(t,s){return t instanceof r&&(this.x*=t.x,this.y*=t.y),typeof t=="number"&&(this.x*=t,this.y*=s??t),this}set(t,s){return t instanceof r&&(this.x=t.x,this.y=t.y),typeof t=="number"&&(this.x=t,this.y=s??t),this}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}equals(t){return this.x===t.x&&this.y===t.y}array(){return[this.x,this.y]}copy(){return new r(this.x,this.y)}isInBounds(t,s){return this.x>=t.x&&this.x<=s.x&&this.y>=t.y&&this.y<=s.y}valueOf(){return this.array()}toString(){return this.array().toString()}}const w=document.getElementById("canvas");w.width=window.innerWidth;w.height=window.innerHeight;window.addEventListener("resize",()=>{w.width=window.innerWidth,w.height=window.innerHeight});const c=w.getContext("2d"),R=()=>new r(w.width,w.height);class j{static number(t=1,s){return s||(s=t,t=0),Math.random()*(s-t+1)+t}static string(t=8,s="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"){let i="";if(s instanceof Array){for(let e of s)i+=e[Math.round(this.number(0,e.length-1))];for(let e=i.length;e<t;e++){const n=this.fromArray(s);i+=n[Math.round(this.number(0,n.length-1))]}i=this.shuffle(i)}if(typeof s=="string"){const e=s.split("");for(let n=0;n<t;n++)i+=this.fromArray(e)}return i.slice(0,t)}static fromArray(t){return t[Math.round(this.number(0,t.length-1))]}static shuffle(t){return t instanceof Array?t.map(s=>s).sort(()=>this.number(-1,1)):typeof t=="string"?t.split("").sort(()=>this.number(-1,1)).join(""):t}}const b=class b{constructor(t,s){h(this,"pos");h(this,"size");this.pos=t,this.size=s,b.arrayOfGameObjects.push(this)}getPos(){return this.pos.copy()}getSize(){return this.size.copy()}};h(b,"arrayOfGameObjects",[]);let S=b;const D=1e-6,H=o=>o.copy().sub(...O.array()).div(...F.copy().div(L,P).array()),m=(o,t)=>t>0?Math.ceil(o+Math.sign(t)*D):t<0?Math.floor(o+Math.sign(t)*D):o,K=(o,t)=>{const s=new r(...o.array()),i=r.fromAngle(t).mult(D),e=s.copy(),n=i.copy().add(s);return()=>{const f=new r(...n.array()),a=n.copy().sub(e);if(a.x!==0){const l=a.y/a.x,u=e.y-l*e.x,g=m(n.x,a.x),d=g*l+u;if(f.set(g,d),l!==0){const A=m(n.y,a.y),T=(A-u)/l;n.dist(T,A)<n.dist(f)&&f.set(T,A)}}else{const l=m(n.y,a.y),u=n.x;f.set(u,l)}return e.set(f),n.set(f).add(i),f.add(i.copy().mult(-2))}};var y=(o=>(o[o.EMPTY=0]="EMPTY",o[o.WALL=1]="WALL",o))(y||{}),k=(o=>(o.EMPTY="#243a3c",o.WALL="#24282c",o))(k||{});class v extends S{constructor(s,i,e=0){super(s,i);h(this,"type");h(this,"color");h(this,"mousePos",new r);this.type=e,this.color=k[y[this.type]],this.attachEvents()}attachEvents(){window.addEventListener("mousemove",s=>{this.mousePos.set(s.clientX,s.clientY)}),window.addEventListener("contextmenu",s=>{s.preventDefault();const[i,e]=H(this.mousePos).array();Math.floor(i)===this.pos.x&&Math.floor(e)===this.pos.y&&(this.type=this.type===0?1:0,this.color=k[y[this.type]]),console.log()})}draw(s){s.fillStyle=this.color,s.strokeStyle="#0003",s.lineWidth=.03,G(s,this.pos.x,this.pos.y,this.size.x,this.size.y),s.fill(),s.stroke()}update(...s){[...s]}}const L=20,P=20,F=new r(R().y,R().y).sub(32),O=new r(16,16),x=class x{constructor(t,s){h(this,"COLS");h(this,"ROWS");h(this,"map",[]);h(this,"pos",new r(0,0));h(this,"size",new r(0,0));this.COLS=t,this.ROWS=s,x.instance=this,this.fillWorld()}getCell(t,s){try{return this.map[s][t]}catch{return null}}static getCell(t,s){return x.instance.getCell(t,s)}fillWorld(){for(let t=0;t<this.ROWS;t++){this.map[t]=[];for(let s=0;s<this.COLS;s++){let i=y.EMPTY;t===0||t===this.ROWS-1||s===0||s===this.COLS-1?i=y.WALL:s==1&&t==1||(i=j.fromArray([y.EMPTY,y.EMPTY,y.EMPTY,y.EMPTY,y.EMPTY,y.EMPTY,y.EMPTY,y.EMPTY,y.WALL,y.WALL])),this.map[t][s]=new v(new r(s,t),new r(1,1),i)}}}draw(t){t.fillStyle="#181818",t.rect(this.pos.x,this.pos.y,this.size.x,this.size.y),t.fill(),I(t);for(let s=0;s<this.ROWS;s++)for(let i=0;i<this.COLS;i++)this.map[s][i].draw(t);B(t)}update(){}};h(x,"instance");let p=x;const I=o=>{o.translate(...O.array()),o.scale(...F.copy().div(L,P).array())},B=o=>{o.resetTransform()},Z=(o,t,s,i,e,n=!0)=>{n&&o.beginPath(),o.moveTo(t,s),o.lineTo(i,e),n&&o.closePath()},G=(o,t,s,i,e,n=!0)=>{n&&o.beginPath(),o.rect(t,s,i,e),n&&o.closePath()},C=(o,t,s,i,e=!0)=>{e&&o.beginPath(),o.arc(t,s,i,0,2*Math.PI),e&&o.closePath()};class J{constructor(t,s){h(this,"initialPos");h(this,"initialDir");h(this,"pos");h(this,"dir");h(this,"dots",[]);this.initialPos=t.copy(),this.initialDir=s.copy().normalize().mult(D),this.pos=this.initialPos.copy(),this.dir=this.initialDir.copy().add(this.initialPos)}next(){const t=new r(...this.dir.array()),s=this.dir.copy().sub(this.pos);if(s.x!==0){const i=s.y/s.x,e=this.pos.y-i*this.pos.x,n=m(this.dir.x,s.x),f=n*i+e;if(t.set(n,f),i!==0){const a=m(this.dir.y,s.y),l=(a-e)/i;this.dir.dist(l,a)<this.dir.dist(t)&&t.set(l,a)}}else{const i=m(this.dir.y,s.y),e=this.dir.x;t.set(e,i)}return this.dots.push(t),this.pos.set(t),this.dir.set(t).add(this.initialDir),t.add(this.initialDir.copy().mult(-2))}prev(){return this.dots[this.dots.length-2].copy()}}const E=class E extends S{constructor(s,i){super(s,i);h(this,"viewAngle",new r(1,1));h(this,"raysDots",[]);h(this,"raysDotsOnWall",[]);h(this,"FOV",90);h(this,"FOVRayCount",180);h(this,"FOVRayStep",Math.abs((-this.FOV/2-this.FOV/2)/this.FOVRayCount));h(this,"mousePos",new r(0,0));h(this,"prevMousePos",new r(0,0));h(this,"keys",{});h(this,"rotateSpeed",3);h(this,"moveSpeed",.05);h(this,"mouseSensitivity",.3);E.players.push(this),this.attachEvents()}attachEvents(){window.addEventListener("keydown",s=>{this.keys[s.key.toLowerCase()]=!0}),window.addEventListener("keyup",s=>{this.keys[s.key.toLowerCase()]=!1}),window.addEventListener("mousemove",s=>{this.prevMousePos.equals(new r)&&this.prevMousePos.set(s.clientX,s.clientY),this.mousePos.set(s.clientX,s.clientY)})}draw(s){I(s),s.fillStyle="#f0f",C(s,...this.pos.array(),this.size.x),s.fill(),s.strokeStyle="#fff",s.lineWidth=.01,Z(s,...this.pos.array(),...this.pos.copy().add(this.viewAngle).array()),s.stroke(),this.drawFOV(s),B(s)}drawFOV(s){s.fillStyle="#f0f";for(let i=0;i<this.raysDots.length;i++)C(s,...this.raysDots[i].array(),this.size.x/5),s.fill();s.fillStyle="#0f0";for(let i=0;i<this.raysDotsOnWall.length;i++)C(s,...this.raysDotsOnWall[i].array(),this.size.x/5),s.fill()}update(){var s,i,e,n,f;if((this.keys.a||this.keys.ф)&&this.viewAngle.rotateDegrees(-this.rotateSpeed),(this.keys.d||this.keys.в)&&this.viewAngle.rotateDegrees(this.rotateSpeed),this.viewAngle.rotateDegrees((this.mousePos.x-this.prevMousePos.x)*this.mouseSensitivity),this.prevMousePos.set(...this.mousePos.array()),this.keys.w||this.keys.ц){const{x:a,y:l}=this.pos.copy().add(this.viewAngle.copy().mult(this.moveSpeed));((s=p.getCell(Math.floor(a),Math.floor(this.pos.y)))==null?void 0:s.type)!==y.WALL&&(this.pos.x=a),((i=p.getCell(Math.floor(this.pos.x),Math.floor(l)))==null?void 0:i.type)!==y.WALL&&(this.pos.y=l)}if(this.keys.s||this.keys.ы){const{x:a,y:l}=this.pos.copy().add(this.viewAngle.copy().rotateDegrees(180).mult(this.moveSpeed));((e=p.getCell(Math.floor(a),Math.floor(this.pos.y)))==null?void 0:e.type)!==y.WALL&&(this.pos.x=a),((n=p.getCell(Math.floor(this.pos.x),Math.floor(l)))==null?void 0:n.type)!==y.WALL&&(this.pos.y=l)}((f=p.getCell(...this.pos.copy().floor().array()))==null?void 0:f.type)==y.WALL&&this.pullOutFromWall(),this.raysDots=[],this.raysDotsOnWall=[];for(let a=-this.FOV/2;a<=this.FOV/2;a+=this.FOVRayStep){const l=new J(this.pos,this.viewAngle.copy().rotateDegrees(a));for(;this.raysDots.length<L*P*this.FOVRayCount/this.FOV;){const u=l.next();if(u.isInBounds(new r(0,0),new r(L,P))===!1)break;const d=p.getCell(...u.copy().floor().array());if(d instanceof v?d.type===y.WALL:!1){this.raysDots.at(-1)instanceof r&&this.raysDotsOnWall.push(this.raysDots.at(-1));break}this.raysDots.push(u)}}}pullOutFromWall(){var a;const s=[],i=[];for(let l=-180;l<180;l+=360/36){const u=K(this.pos,this.viewAngle.angle()+l);for(let g=0;g<10;g++){const d=u().add(r.fromAngle(l).div(10));((a=p.getCell(...d.copy().floor().array()))==null?void 0:a.type)===y.EMPTY&&(s.push(d),i.push(d.dist(this.pos)))}}const e=Math.min(...i),n=i.indexOf(e),f=s[n];this.pos.set(f)}};h(E,"players",[]);let M=E;const W=new p(L,P);W.pos=O;W.size=F;new M(new r(1.5,1.5),new r(.2));let z=0,Y=0;const N=o=>{if(o){const t=o-z;z=o,Y=1e3/t}c.fillStyle="#333",c.fillRect(0,0,...R().array()),W.update(),W.draw(c);for(let t=0;t<M.players.length;t++)M.players[t].update(),M.players[t].draw(c);c.font="16px monospace",c.fillStyle="#fff",c.fillText(Y.toFixed(2),16,16),requestAnimationFrame(N)};N();
