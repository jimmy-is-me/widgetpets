(function(){
'use strict';
var SCENES=[['','預設'],['grass','草地'],['night','夜晚'],['cafe','咖啡廳'],['snow','雪地']];
var KEY='widgetpets_scene';
function init(){
  var vp=document.querySelector('.browser-viewport');
  var browser=document.querySelector('.simulated-browser');
  if(!vp||!browser||document.querySelector('.scene-bar'))return;
  var bar=document.createElement('div');
  bar.className='scene-bar';
  bar.innerHTML='<span>場景：</span>';
  function apply(s){
    if(s)vp.setAttribute('data-scene',s);else vp.removeAttribute('data-scene');
    bar.querySelectorAll('button').forEach(function(b){b.classList.toggle('active',b.dataset.s===s);});
    try{localStorage.setItem(KEY,s);}catch(e){}
  }
  SCENES.forEach(function(x){
    var b=document.createElement('button');
    b.type='button';b.dataset.s=x[0];b.textContent=x[1];
    b.addEventListener('click',function(){apply(x[0]);});
    bar.appendChild(b);
  });
  browser.parentNode.insertBefore(bar,browser);
  var saved='';
  try{saved=localStorage.getItem(KEY)||'';}catch(e){}
  apply(saved);
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!reduce){
    vp.addEventListener('click',function(e){
      var h=document.createElement('span');
      h.className='fx-heart';h.textContent='\u2764\uFE0F';
      h.style.left=e.clientX+'px';h.style.top=e.clientY+'px';
      document.body.appendChild(h);
      setTimeout(function(){h.remove();},900);
    });
  }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
