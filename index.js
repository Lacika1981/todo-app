var todoApp = (function todoApp() {


    var publicMethods = {
        logState,
    };

    var state = {
        text: '',
        numberOfElems: 1,
        updateContent: '',
    };

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

    function createElems() {
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
        doneButton.setAttribute('class', 'update_content');
        updateButton.setAttribute('class', 'update_done');
        deleteButton.setAttribute('class', 'remove-content');
        deleteButton.addEventListener('click', removeTodo);
        updateButton.addEventListener('click', updateContent);

        var content = document.createTextNode(state.text);
        todoText.appendChild(content);

        var liNumber = document.createTextNode(state.numberOfElems);
        listNumber.appendChild(liNumber);

        var doneContentText = document.createTextNode('Done');
        doneButton.appendChild(doneContentText);
        var deleteContentText = document.createTextNode('Delete');
        deleteButton.appendChild(deleteContentText);
        var updateContentText = document.createTextNode('Update');
        updateButton.appendChild(updateContentText);

        buttonContainer.appendChild(doneButton);
        buttonContainer.appendChild(updateButton);
        buttonContainer.appendChild(deleteButton);

        contentContainer.appendChild(listNumber);
        contentContainer.appendChild(todoText);
        contentContainer.appendChild(buttonContainer);

        contentMain.appendChild(contentContainer);

        inputField.value = '';
        updateState();
        state.numberOfElems++;
    }

    function updateListNumbers() {
        var liNumbers = document.querySelectorAll('.list_numbers');
        for (var i = 1; i <= liNumbers.length; i++) {
            console.log(liNumbers[i]);
            liNumbers[i - 1].textContent = i;
        }
    }

    function updateContent() {
        var textNode = this.closest('.content_container').children[1];
        textNode.focus();
        textNode.click();
        state.updateContent = textNode.textContent;
        textNode.getAttribute('contentEditable') == 'true'
        ? textNode.setAttribute('contentEditable', false)
        : textNode.setAttribute('contentEditable', true);
    }

    function removeTodo() {
        var toDelete = this.closest('.content_container');
        contentMain.removeChild(toDelete);
        updateListNumbers();
        state.numberOfElems--;
    }

    addMethod();

    return publicMethods;
})