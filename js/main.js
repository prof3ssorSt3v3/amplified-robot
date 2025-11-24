/*
    caches.open(cacheName).then((cache)=>{}).catch(err=>{});
    caches.delete(cacheName).then(bool=>{})
    caches.has(cacheName).then(bool=>{})
    caches.keys().then((namesArr)=>{})

    cache.add(request).then(()=>{}).catch(err=>{})
    cache.put(request, response).then(()=>{}).catch(err=>{})
    cache.delete(request).then(()=>{}).catch(err=>{})
    cache.match(request).then((response)=>{}).catch(err=>{})
    cache.matchAll(request).then((response)=>{}).catch(err=>{})
    cache.keys().then((requestNames)=>{})
*/
const log = console.log;
const check = '✓';

document.addEventListener('DOMContentLoaded', init);

function init() {
  //
  example();
  addListeners();
}

function example() {
  let target = document.querySelector('[data-count]');
  let num = target.getAttribute('data-count');
  let str = ''.padStart(num, `${check}`);
  document.querySelector('p').setAttribute('data-symbol', str);
}
function addListeners() {
  document.getElementById('btnLoad').addEventListener('click', f);
  document.getElementById('btnSave').addEventListener('click', f);
  document.getElementById('btnLoadJson').addEventListener('click', f);
  document.getElementById('btnSaveJson').addEventListener('click', f);
  document.querySelector('form').addEventListener('submit', f);
}
function f() {
  log('not a useful function');
}
