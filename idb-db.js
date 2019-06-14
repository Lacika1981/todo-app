import { openDB, deleteDB, wrap, unwrap } from 'https://unpkg.com/idb?module';


if (!window.indexedDB) {
  window.alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
}

// var data = [
//   { uid: '12345', content: 'first content', done: 'false' },
//   { uid: '67890', content: 'second content', done: 'false' },
//   { uid: '13579', content: 'third content', done: 'true' }
// ]

var db;
var request = window.indexedDB.open('todoApp', 1);

request.onerror = function onerror(event) {
  console.log(`Ooops. Something went wrong. Error: ${event.target.errorCode}`);
}

request.onsuccess = function onsuccess(event) {
  db = event.target.result;
}

request.onupgradeneeded = function (event) {
  db = event.target.result;
  var objectStore = db.createObjectStore('todos', { keyPath : 'uid' });
  objectStore.createIndex('content', 'content', { unique: false });
  objectStore.createIndex('done', 'done', { unique: false });
  objectStore.transaction.oncomplete = function (event) {
    console.log('Object store created')
    // var todoStore = db.transaction('todos', 'readwrite').objectStore('todos');
    // data.forEach(function (todos) {
    //   todoStore.add(todos);
    // });
  }
}

document.querySelectorAll('.update_status').forEach( e => {
  e.addEventListener('click', function(e) {
    console.log(e.target.closest('.content_container').children[1]);
      var transaction = db.transaction(['todos'], 'readwrite');
      var objectStore = transaction.objectStore('todos');
      var objectStoreRequest = objectStore.add({'uid': e.target.closest('.content_container').getAttribute('data-uid'), 'content': e.target.closest('.content_container').children[1].textContent});
      console.log(objectStoreRequest);
    
      objectStoreRequest.onerror = function(event) {
        console.log(event);
        // Handle errors!
      };
      objectStoreRequest.transaction.oncomplete = function(event) {
        // Do something with the request.result!
        console.log("UID for first content is: " + objectStoreRequest.result.content);
      };
  });
});