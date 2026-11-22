(function(root){
'use strict';
var PX=function(x,y,w,h,c){return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+c+'"/>';};
var ITEMS={
  hat:{label:'小帽子',slot:'head',draw:function(c){return PX(4,2,8,2,c)+PX(6,0,4,2,c)+PX(3,4,10,1,'#00000033');}},
  bow:{label:'蝶蝶結',slot:'head',draw:function(c){return PX(5,2,2,3,c)+PX(9,2,2,3,c)+PX(7,3,2,1,'#fff');}},
  scarf:{label:'圍巾',slot:'neck',draw:function(c){return PX(3,0,10,2,c)+PX(9,2,2,4,c);}},
  headphones:{label:'耳機',slot:'head',draw:function(c){return PX(3,3,2,4,c)+PX(11,3,2,4,c)+PX(4,1,8,2,c);}}
};
var ANCHORS={
  default:{head:{x:50,y:8,w:60},neck:{x:50,y:48,w:56}},
  shiba:{head:{x:50,y:6,w:60},neck:{x:50,y:50,w:56}},
  cat:{head:{x:50,y:4,w:58},neck:{x:50,y:48,w:54}},
  rabbit:{head:{x:50,y:12,w:56},neck:{x:50,y:50,w:52}}
};
function build(species,list){
  var a=ANCHORS[species]||ANCHORS.default;
  var wrap=document.createElement('div');
  wrap.className='wp-accessories';
  wrap.style.cssText='position:absolute;inset:0;pointer-events:none;';
  (list||[]).forEach(function(it,i){
    var def=ITEMS[it.id];if(!def)return;
    var p=a[def.slot];
    var s=document.createElementNS('http://www.w3.org/2000/svg','svg');
    s.setAttribute('viewBox','0 0 16 8');
    s.setAttribute('shape-rendering','crispEdges');
    s.style.cssText='position:absolute;left:'+p.x+'%;top:'+p.y+'%;width:'+p.w+'%;transform:translateX(-50%);z-index:'+(10+i);
    s.innerHTML=def.draw(it.color||'#E08E36');
    wrap.appendChild(s);
  });
  return wrap;
}
function attach(petEl,species,list){
  if(!petEl)return null;
  var old=petEl.querySelector(':scope > .wp-accessories');
  if(old)old.remove();
  if(getComputedStyle(petEl).position==='static')petEl.style.position='relative';
  var w=build(species,list);
  petEl.appendChild(w);
  return w;
}
root.WidgetPetsAccessories={items:ITEMS,anchors:ANCHORS,build:build,attach:attach};
})(window);
