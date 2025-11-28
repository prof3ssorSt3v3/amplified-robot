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
let currentImageURL = null; //to be able to reuse the image

document.addEventListener('DOMContentLoaded', init);

function init() {
  //
  // example();
  //open the caches, find one specifically
  //save the reference as a global variable
  caches.open(CacheKey).then((cache) => {
    CACHE = cache;
  });
  getImgFromCache(); //show the first image from the cache when page loads
  addListeners();
}

function example() {
  let target = document.querySelector('[data-count]');
  let num = target.getAttribute('data-count');
  let str = ''.padStart(num, `${check}`);
  document.querySelector('p').setAttribute('data-symbol', str);
}
function addListeners() {
  document.getElementById('btnLoad').addEventListener('click', getImgFromCache);
  document.getElementById('btnSave').addEventListener('click', getAllTheImages);
  document.getElementById('btnLoadJson').addEventListener('click', loadJson);
  document.getElementById('btnSaveJson').addEventListener('click', saveJson);
  document.querySelector('form').addEventListener('submit', saveImageInCache);

  document.getElementById('loadedImage').addEventListener('click', addImage);
}
let DATA = null; //to share between load and save

function getAllTheImages(ev) {
  //get ALL the images from the cache
  let Cache;
  caches
    .open('myimages')
    .then((cache) => {
      Cache = cache;
      return Cache.keys(); //get all the requests
    })
    .then((keys) => {
      //match all the keys (Requests)
      return Promise.allSettled(keys.map((key) => Cache.match(key)));
      // return Promise.allSettled( keys.map(request=> Cache.match(request)) );
    })
    .then((responses) => {
      console.log(responses);
      //read the blob from each and every response
      return Promise.allSettled(
        responses.map((response) => {
          // console.log(response.value.status); //fulfilled
          return response.value.blob();
        })
      );
    })
    .then((blobs) => {
      // [{status:'fulfilled', value: blob}, {status:'fulfilled', value: blob}]
      //turn the blobs into URLS
      let urls = blobs.map((blob) => URL.createObjectURL(blob.value));
      let df = new DocumentFragment();
      urls.forEach((url) => {
        let img = document.createElement('img');
        img.src = url;
        img.alt = 'Howdy image';
        df.append(img);
      });
      document.body.append(df);
    });
}

function addImage(ev) {
  //user clicked on the image tag.
  //add another image at the bottom of the body using the same url
  // let img = `<p><img src="${currentImageURL}" alt="image copy"/></p>`;
  // document.body.innerHTML += img;

  let img = document.createElement('img');
  img.alt = 'image copy';
  img.src = currentImageURL;
  document.body.append(img);
}

function getImgFromCache(ev) {
  //get an image from the cache
  let Cache = null;
  caches
    .open('myimages')
    .then((cache) => {
      console.log('opened cache');
      //get a list of all the Request objects in the cache
      Cache = cache;
      return Cache.keys();
    })
    .then((keys) => {
      //keys is an Array of Request objects
      console.log(keys[0].url);
      console.log(keys[2].url);
      //Cache.match will use the Request to find a Response
      let num = Math.floor(Math.random() * keys.length);
      return Cache.match(keys[num]);
      //this is just like fetch(request)... but talking to the Cache
    })
    .then((response) => {
      //response that is connected with the Request keys[0]
      //response body will contain an image (which is a file that contains a blob)
      return response.blob();
      //.blob() reads the binary data from the Response body
    })
    .then((blob) => {
      //take the blob and stick it in the <img>
      const img = document.getElementById('loadedImage');
      //blob is like an array of numbers
      //img.src needs a real HREF
      currentImageURL = URL.createObjectURL(blob);
      console.log(currentImageURL);
      img.src = currentImageURL;
      //createObjectURL creates an HREF that points to the place in the heap where the image blob is saved
    });
}

function saveImageInCache(ev) {
  ev.preventDefault();
  //stop the page reloading when the user clicks the submit button
  let fileInput = document.getElementById('image');
  console.log(fileInput.files);
  if (fileInput.files.length == 0) return; //exit if no file
  let file = fileInput.files[0];
  let filename = crypto.randomUUID();
  console.log(filename);

  let url = new URL(`${location.origin}/images/${filename}`);
  let request = new Request(url);
  let response = new Response(file, { status: 200 });

  caches
    .open('myimages')
    .then((cache) => {
      return cache.put(request, response);
    })
    .then(() => {})
    .catch((err) => {});

  // let f = new File()
}

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
