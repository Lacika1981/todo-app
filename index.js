var todoApp = (function todoApp() {


    var publicMethods = {
        logState,
    };

    var state = {
        text: '',
        numberOfElems: 1,
        updateContent: '',
    };

    var storeName = 'todoApp';

    var inputField = document.querySelector('input.text');
    var contentMain = document.querySelector('.content');
    var addButton = document.querySelector('button.add_content');

    inputField.addEventListener('keyup', updateState);

    function logState() {
        console.log({ state });
    }


    function updateState() {
        state.text = inputField.value;
        state.text != '' ? addButton.removeAttribute('disabled') : addButton.setAttribute('disabled', true)
    }

    function addMethod() {
        addButton.addEventListener('click', createElems);
    }

    function cretaeuid() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        )
    }

    /**
     * 
     * @param {content that comes back from localStorage} t 
     * @param {id of each element stored in localStorage} id 
     */

    function createElems(t, id, done) {
        var text;
        if (typeof t == 'string') {
            text = t;
        }
        var content;
        var contentContainer = document.createElement('section');
        var listNumber = document.createElement('div');
        var todoText = document.createElement('div');
        var buttonContainer = document.createElement('div');
        var doneButton = document.createElement('button');
        var updateButton = document.createElement('button');
        var deleteButton = document.createElement('button');
        contentContainer.setAttribute('class', 'content_container');
        listNumber.setAttribute('class', 'list_numbers');
        todoText.setAttribute('class', 'todo_text');
        todoText.setAttribute('contentEditable', false);
        buttonContainer.setAttribute('class', 'button_container');
        doneButton.setAttribute('class', 'update_status');
        updateButton.setAttribute('class', 'update_done');
        deleteButton.setAttribute('class', 'remove_content');
        deleteButton.addEventListener('click', removeTodo);
        updateButton.addEventListener('click', updateContent);
        doneButton.addEventListener('click', doneContent);

        content = document.createTextNode(text || state.text);

        todoText.appendChild(content);

        var uid = cretaeuid();
        if (!text) {
            addItemToStorage(uid, content, false);
            contentContainer.setAttribute('data-uid', uid);
        } else {
            contentContainer.setAttribute('data-uid', id);
        }

        var liNumber = document.createTextNode(state.numberOfElems);
        listNumber.appendChild(liNumber);

        buttonContainer.appendChild(doneButton);
        buttonContainer.appendChild(updateButton);
        buttonContainer.appendChild(deleteButton);

        contentContainer.appendChild(listNumber);
        contentContainer.appendChild(todoText);
        contentContainer.appendChild(buttonContainer);

        if(done) {
            doneButton.click();
        }

        contentMain.appendChild(contentContainer);

        state.numberOfElems++;
        inputField.value = '';
        updateState();
    }

    function updateListNumbers() {
        var liNumbers = document.querySelectorAll('.list_numbers');
        for (var i = 1; i <= liNumbers.length; i++) {
            liNumbers[i - 1].textContent = i;
        }
    }

    function updateContent() {
        var textNode = this.closest('.content_container').children[1];
        var uid = this.closest('.content_container').getAttribute('data-uid');
        state.updateContent = textNode.textContent;
        textNode.getAttribute('contentEditable') == 'true'
            ? ( textNode.setAttribute('contentEditable', false), updateStore(textNode.textContent, uid) )
            : ( textNode.setAttribute('contentEditable', true), textNode.focus() );
    }

    function doneContent() {
        var textNode = this.closest('.content_container').children[1];
        var uid = this.closest('.content_container').getAttribute('data-uid');
        if (textNode.getAttribute('done') == 'true') {
            return
        } else {
            textNode.setAttribute('done', true);
            textNode.setAttribute('contentEditable', false);
            disableButton(this.closest('.content_container').children[2].childNodes[1], this);
            updateStoreIfContentDone(uid);
        }
        textNode.style.textDecoration = 'line-through'
    }

    function disableButton(...buttons) {
        buttons.map(button => {
            button.setAttribute('disabled', true);
        })
    }

    function removeTodo() {
        var toDelete = this.closest('.content_container');
        var uid = toDelete.getAttribute('data-uid');

        deleteItemFromStorage(uid);

        contentMain.removeChild(toDelete);
        updateListNumbers();
        state.numberOfElems--;
    }

    function retrieveStore(store) {
        var storage = localStorage.getItem(store);
        return JSON.parse(storage);
    }

    function setStore(store, array) {
        localStorage.setItem(store, array);
    }


    /**
     * 
     * @param {unique ID from createuid function} uid 
     * @param {text content} content 
     * @param {whether the content is done or not (line through), if done can not be updated anymore} done 
     */
    function addItemToStorage(uid, content, done) {
        if (localStorage && !localStorage.getItem(storeName)) {
            var elemsArray = [];
            elemsArray.push({ uid, content: content.data, done });
            setStore(storeName, JSON.stringify(elemsArray));
        }
        else if (localStorage && localStorage.getItem(storeName)) {
            var storeArray = retrieveStore(storeName);
            storeArray.push({ uid, content: content.data, done });
            setStore(storeName, JSON.stringify(storeArray));
        }
    }

    function deleteItemFromStorage(uid) {
        var storeArray = retrieveStore(storeName);
        storeArray = storeArray.filter(elem => { return elem.uid != uid });
        setStore(storeName, JSON.stringify(storeArray));
    }

    function updateStore(content, uid) {
        var storeArray = retrieveStore(storeName);
        storeArray.find(elem => {
            if (elem.uid == uid) {
                return elem.content = content;
            }
        });
        setStore(storeName, JSON.stringify(storeArray));
    }

    function updateStoreIfContentDone(uid) {
        var storeArray = retrieveStore(storeName);
        storeArray.find(elem => {
            if (elem.uid == uid) {
                return elem.done = true;
            }
        });
        setStore(storeName, JSON.stringify(storeArray));
    }

    function restoreList() {
        var storeArray = retrieveStore(storeName);
        if (storeArray) storeArray.map(elem => createElems(elem.content, elem.uid, elem.done));
    }

    restoreList();

    addMethod();

    return publicMethods;
})