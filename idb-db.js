import { openDB, deleteDB, wrap, unwrap } from 'https://unpkg.com/idb?module';


if (!window.indexedDB) {
  window.alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
}

var data = [
  { uid: '12345', content: 'first content', done: 'false' },
  { uid: '67890', content: 'second content', done: 'false' },
  { uid: '13579', content: 'third content', done: 'true' }
]

var request = window.indexedDB.open('todoApp', 3);
var db;
request.onerror = function onerror(event) {
  console.log(`Ooops. Something went wrong. Error: ${event.target.errorCode}`);
}

request.onsuccess = function onsuccess(event) {
  db = event.target.result;
}

request.onupgradeneeded = function (event) {
  db = event.target.result;
  var objectStore = db.createObjectStore('todos', { autoIncrement : true });
  objectStore.createIndex('content', 'content', { unique: false });
  objectStore.createIndex('done', 'done', { unique: false });
  objectStore.transaction.oncomplete = function (event) {
    var todoStore = db.transaction('todos', 'readwrite').objectStore('todos');
    data.forEach(function (todos) {
      todoStore.add(todos);
    });
  }
}

document.querySelector('.add_content').addEventListener('click', function() {
    var transaction = db.transaction(['todos']);
    var objectStore = transaction.objectStore('todos');
    var request = objectStore.get('first content');
  
    request.onerror = function(event) {
      // Handle errors!
    };
    request.onsuccess = function(event) {
      // Do something with the request.result!
      alert("UID for first content is: " + request);
    };
})