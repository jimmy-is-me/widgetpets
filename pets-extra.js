(function(root){
'use strict';
var S=16;
function grid(){var g=[];for(var y=0;y<S;y++){g.push([]);for(var x=0;x<S;x++)g[y].push('.');}return g;}
function R(g,x,y,w,h,c){for(var j=y;j<y+h;j++)for(var i=x;i<x+w;i++)if(i>=0&&i<S&&j>=0&&j<S)g[j][i]=c;}
function P(g,x,y,c){R(g,x,y,1,1,c);}
var SPECIES={
  blackcat:{name:'\u9ed1\u8c93',palette:{b:'#23232B',d:'#15151B',e:'#FACC15',n:'#F4A0B5',w:'#3A3A46'},
    opts:{legH:3,earH:2,tail:'long',chest:false}},
  corgi:{name:'\u67ef\u57fa',palette:{b:'#E39B4B',d:'#B97430',w:'#FFF4E0',e:'#1F1916',n:'#1F1916'},
    opts:{legH:2,earH:3,tail:'stub',chest:true}}
};
function build(sp,state,f){
  var o=sp.opts,g=grid(),lh=o.legH,dy=0;
  if(state==='sleep')return sleepFrame(sp,g);
  if(state==='jump'){dy=-3;}
  var by=12-lh+dy;
  var legs;
  if(state==='walk'){legs=f%2?[[5,3],[8,-1]]:[[4,0],[9,0]];}
  else if(state==='jump'){legs=[[5,-1],[8,-1]];}
  else legs=[[4,0],[9,0]];
  legs.forEach(function(l){R(g,l[0],by+5,2,Math.max(1,lh+(l[1]>0?-1:0)+(l[1]<0?-1:0)),'d');});
  R(g,3,by,8,5,'b');
  if(o.chest){R(g,4,by+4,6,1,'w');R(g,9,by+1,2,4,'w');}
  R(g,9,by-3,5,5,'b');
  if(o.chest)R(g,11,by-1,3,3,'w');
  R(g,9,by-3+0,1,1,'b');
  R(g,9,by-3-o.earH+1,1,o.earH,'b');R(g,12,by-3-o.earH+1,1,o.earH,'b');
  if(o.earH===2){P(g,9,by-3+0,'b');}
  P(g,12,by-1,'e');if(state==='yawn'){R(g,12,by+1,2,1,'n');}
  P(g,13,by,'n');
  if(o.tail==='long'){P(g,2,by+3,'b');P(g,1,by+2,'b');P(g,1,by+1,'b');P(g,1,by,'b');P(g,2,by-1,'b');}
  else P(g,2,by+1,'b');
  return g;
}
function sleepFrame(sp,g){
  var o=sp.opts;
  R(g,3,10,9,4,'b');
  if(o.chest)R(g,5,13,6,1,'w');
  R(g,10,8,5,5,'b');
  if(o.chest)R(g,12,10,3,3,'w');
  R(g,10,8-o.earH+1,1,o.earH,'b');R(g,13,8-o.earH+1,1,o.earH,'b');
  R(g,12,10,2,1,'d');
  P(g,14,11,'n');
  if(o.tail==='long')R(g,1,12,3,1,'b');else P(g,2,11,'b');
  P(g,14,5,'w');
  return g;
}
function draw(ctx,spId,state,f,scale,flip){
  var sp=SPECIES[spId];if(!sp)return;
  var g=build(sp,state,f||0);
  ctx.clearRect(0,0,S*scale,S*scale);
  for(var y=0;y<S;y++)for(var x=0;x<S;x++){
    var c=g[y][x];if(c==='.')continue;
    ctx.fillStyle=sp.palette[c]||'#f0f';
    var px=flip?(S-1-x):x;
    ctx.fillRect(px*scale,y*scale,scale,scale);
  }
}
function mount(el,spId,opt){
  opt=opt||{};
  var scale=opt.scale||6,state='idle',frame=0,dir=1,x=0,y=0,t=0,last=0,raf=0,timer=0;
  var cv=document.createElement('canvas');
  cv.width=cv.height=S*scale;
  cv.style.cssText='position:absolute;bottom:0;left:0;image-rendering:pixelated;cursor:pointer;touch-action:none';
  el.style.position=el.style.position||'relative';
  el.appendChild(cv);
  var ctx=cv.getContext('2d');
  var reduce=root.matchMedia&&root.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var jumpT=0;
  function setState(s){state=s;frame=0;}
  function pick(){
    if(state==='jump')return;
    var r=Math.random();
    setState(r<.5?'walk':r<.7?'idle':r<.85?'yawn':'sleep');
    timer=2000+Math.random()*3000;
  }
  function tick(ts){
    var dt=Math.min(64,ts-last);last=ts;t+=dt;timer-=dt;
    if(timer<=0)pick();
    var w=el.clientWidth-S*scale;
    if(state==='walk'){x+=dir*dt*0.05;if(x<0){x=0;dir=1;}if(x>w){x=w;dir=-1;}}
    if(state==='jump'){jumpT+=dt;if(jumpT>450){jumpT=0;setState('idle');}}
    frame=Math.floor(t/220);
    cv.style.left=x+'px';
    draw(ctx,spId,state,frame,scale,dir<0);
    raf=requestAnimationFrame(tick);
  }
  cv.addEventListener('click',function(){jumpT=0;setState('jump');});
  function vis(){if(document.hidden){cancelAnimationFrame(raf);}else{last=performance.now();raf=requestAnimationFrame(tick);}}
  document.addEventListener('visibilitychange',vis);
  if(reduce){draw(ctx,spId,'idle',0,scale,false);}else{last=performance.now();raf=requestAnimationFrame(tick);}
  return{canvas:cv,setState:setState,destroy:function(){cancelAnimationFrame(raf);document.removeEventListener('visibilitychange',vis);cv.remove();}};
}
root.WidgetPetsExtra={species:SPECIES,build:build,draw:draw,mount:mount,SIZE:S};
})(window);
