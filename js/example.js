const SearchResults = [];
//if this changes then Update UI

function init() {
  //
  if (SearchResults == []) {
    const newData = getData();
    SearchResults = [...newData];
    updateUI(); //this function always uses SearchResults
    writeCache(newData);
    //write to cache happens after the ui is updated...
    // so user doesn't know or card
  } else {
    updateUI();
    //nothing more needs to be done
  }

  getData()
    .then((data) => {
      SearchResults = [...data];
    })
    .then(() => {
      updateUI();
    })
    .then(() => {
      writeCookie('asdfasdf');
    })
    .then(() => {
      writeCache(SearchResults);
    })
    .catch((err) => {});

  SearchResults.map();
  SearchResults.filter();
  SearchResults.toSorted();

  SearchResults.filter().map().toSorted();

  // let elem1 = document.querySelector('.fred');
  // let elem2 = document.querySelector('.simon');
  // let elem3 = document.querySelector('.chuck');

  // reuse(elem1, 'block');
  // reuse(elem2);
  // reuse(elem3, undefined, 4);
  // const f = reuse(elem1, 'fred', 2);
  // f();
  // // f = null;
}

function readStorage() {}
function writeStorage() {}
function writeCookie() {}
function readCookie() {}
function readCache() {}
function writeCache() {}
function getData() {}

function reuse(elem, className = 'card', imgNum = 0) {
  //always use elem as a reference to an HTML element
  //always set the className, but 'card' is the default
  //imgNum has a default number of zero, for the number of images to add
  return function () {
    let str = className + ' other';
  };
}
