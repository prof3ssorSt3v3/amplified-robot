/*
    window.caches.open(cacheName).then((cache)=>{}).catch(err=>{});
    caches.delete(cacheName).then(bool=>{})
    caches.has(cacheName).then(bool=>{})
    caches.keys().then((namesArr)=>{})
    //caches is a built-in keyword

    //cache is a variable name
    //a cache contains a list of files
    //each item in a cache is a Request and Response pair
    cache.add(request).then(()=>{}).catch(err=>{})
    cache.put(request, response).then(()=>{}).catch(err=>{})
    cache.delete(request).then(()=>{}).catch(err=>{})
    cache.match(request).then((response)=>{}).catch(err=>{})
    cache.matchAll(request).then((response)=>{}).catch(err=>{})
    cache.keys().then((requestNames)=>{})
*/
const log = console.log;
const check = '✓';
let CACHE = null; //global reference to the Monday cache
const CacheKey = 'Monday';

document.addEventListener('DOMContentLoaded', init);

function init() {
  //
  // example();
  //open the caches, find one specifically
  //save the reference as a global variable
  caches.open(CacheKey).then((cache) => {
    CACHE = cache;
  });
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
  document.getElementById('btnLoadJson').addEventListener('click', loadJson);
  document.getElementById('btnSaveJson').addEventListener('click', saveJson);
  document.querySelector('form').addEventListener('submit', f);
}
let DATA = null; //to share between load and save

function saveJson() {
  if (DATA == null || CACHE == null) return;
  // let url = 'https://jsonplaceholder.typicode.com/users';
  let url = '/dogs';
  let request = new Request(url, { method: 'get' });
  let json = JSON.stringify(DATA);
  let file = new File([json], 'myUserData.json', { type: 'application/json' });
  let response = new Response(file, { status: 401, statusText: 'Get your face outta my cache.' });

  CACHE.put(request, response)
    .then(() => {
      log('File was saved in the cache');
      readJson(); //instead of adding another button listener
    })
    .catch((err) => {
      log('Failed to save file in cache.');
    });
}

function readJson() {
  //read some JSON from the cache and display it on the page
  if (CACHE == null) return;
  const url = '/cats'; //this will add 'http://127.0.0.1:5500'
  let request = new Request(url, { method: 'get' });
  // log(request);
  CACHE.match(request)
    .then((response) => {
      if (response == null) throw new Error('Not found in cache');
      if (!response.ok) throw new Error(`found response with status ${response.status}`);
      return response.json();
    })
    .then((data) => {
      log(data);
      document.body.innerHTML += `<pre><code>${JSON.stringify(data)}<code></pre>`;
    })
    .catch((err) => {
      log(err);
    });
}

function loadJson() {
  let url = 'https://jsonplaceholder.typicode.com/users';
  let req = new Request(url, { method: 'GET' });
  fetch(req)
    .then((response) => {
      if (!response.ok) throw new Error('bad json fetch');
      //at this point we have a request AND a response... it could go directly to the cache
      return response.json();
    })
    .then((data) => {
      //we have read the data from the JSON string inside the response body
      DATA = data; //save it globally
      DATA = { cat: true, cheese: 'Cheddar' };
      log(DATA);
    });
}

function f() {
  log('not a useful function');
}
