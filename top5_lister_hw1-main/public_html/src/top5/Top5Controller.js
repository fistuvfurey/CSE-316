/**
 * Top5ListController.js
 * 
 * This file provides responses for all user interface interactions.
 * 
 * @author McKilla Gorilla
 * @author Aidan Furey
 */
export default class Top5Controller {
    constructor() {

    }

    setModel(initModel) {
        this.model = initModel;
        this.initHandlers();
    }

    initHandlers() {
        // SETUP THE TOOLBAR BUTTON HANDLERS
        document.getElementById("add-list-button").onmousedown = (event) => {
            let newList = this.model.addNewList("Untitled", ["?","?","?","?","?"]);            
            this.model.loadList(newList.id);
            this.model.saveLists();
        }

        document.getElementById("undo-button").onmousedown = (event) => {
            this.model.undo();
        }

        document.getElementById("redo-button").onmousedown = (event) => {
            this.model.redo();
        }

        document.getElementById("close-button").onmousedown = (event) => {
            this.model.unselectAll();
            this.model.closeCurrentList();
            let statusbar = document.getElementById("top5-statusbar");
            statusbar.textContent = "";
        }

        // SETUP THE ITEM HANDLERS
        for (let i = 1; i <= 5; i++) {
            let item = document.getElementById("item-" + i);

            // FOR DRAG AND DROP
            item.ondragstart = (ev) => {
                ev.dataTransfer.setData("text/html", ev.target.id);
            }

            item.ondragover = (ev) => {
                ev.preventDefault();
            }

            item.ondrop = (ev) => {
                ev.preventDefault();
                let item1Id = ev.dataTransfer.getData("text/html");
                let item2Id = ev.target.id;
                let oldIndex = item1Id.charAt(item1Id.length - 1);
                let newIndex = item2Id.charAt(item2Id.length - 1);
                oldIndex--;
                newIndex--;
                this.model.addMoveItemTransaction(oldIndex, newIndex);
            }

            // AND FOR TEXT EDITING
            item.ondblclick = (ev) => {
                if (this.model.hasCurrentList()) {
                    // CLEAR THE TEXT
                    item.innerHTML = "";

                    // ADD A TEXT FIELD
                    let textInput = document.createElement("input");
                    textInput.setAttribute("type", "text");
                    textInput.setAttribute("id", "item-text-input-" + i);
                    textInput.setAttribute("value", this.model.currentList.getItemAt(i-1));

                    item.appendChild(textInput);

                    textInput.ondblclick = (event) => {
                        this.ignoreParentClick(event);
                    }
                    textInput.onkeydown = (event) => {
                        if (event.key === 'Enter') {
                            this.model.addChangeItemTransaction(i-1, event.target.value);
                        }
                    }
                    textInput.onblur = (event) => {
                        this.model.restoreList();
                    }
                }
            }
        }
    }

    registerListSelectHandlers(id) {
        // FOR SELECTING THE LIST
        document.getElementById("top5-list-" + id).onmousedown = (event) => {
            this.model.unselectAll();

            // GET THE SELECTED LIST
            this.model.loadList(id);

            // UPDATE THE STATUS BAR WITH LIST NAME
            let statusbar = document.getElementById("top5-statusbar");
            let list = this.model.getList(this.model.getListIndex(id));
            let listName = list.getName();
            statusbar.textContent = listName;
        }

        // FOR EDITING THE LIST NAME
        let top5ListElement = document.getElementById("top5-list-" + id);
        top5ListElement.ondblclick = (event) => {
            this.ignoreParentClick(event);
            // CLEAR THE TEXT
            top5ListElement.innerHTML = "";

            // ADD A TEXT FIELD
            let textInput = document.createElement("input");
            textInput.setAttribute("type", "text");
            textInput.setAttribute("id", "list-name-text-input-" + id);
            textInput.setAttribute("value", this.model.currentList.getName());

            top5ListElement.appendChild(textInput);

            textInput.onkeydown = (event) => {
                if (event.key === 'Enter') { 
                    this.model.addChangeListNameTransaction(id, event.target.value);
                    this.model.sortLists();
                }
            }

            textInput.onblur = (event) => {
                this.model.addChangeListNameTransaction(id, event.target.value);
                this.model.sortLists();
            }
        }

        // FOR DELETING THE LIST
        document.getElementById("delete-list-" + id).onmousedown = (event) => {
            this.ignoreParentClick(event);
            // VERIFY THAT THE USER REALLY WANTS TO DELETE THE LIST
            let modal = document.getElementById("delete-modal");
            let listToDeleteIndex = this.model.getListIndex(id);
            let listName = this.model.getList(listToDeleteIndex).getName();
            let deleteSpan = document.getElementById("delete-list-span");
            deleteSpan.innerHTML = "";
            deleteSpan.appendChild(document.createTextNode(listName));
            modal.classList.add("is-visible");
            
            // IF USER CLICKS CANCEL
            document.getElementById("dialog-cancel-button").onmousedown = (event) => {
                modal.classList.remove("is-visible");
            }

            // IF USER CLICKS CONFIRM
            document.getElementById("dialog-confirm-button").onmousedown = (event) => {
                this.model.deleteList(id);
                modal.classList.remove("is-visible");
            }
        }

        // FOR MOUSEOVER HIGHLIGHTING THE LIST
        top5ListElement.onmouseover = (event) => {
            top5ListElement.classList.add("highlighted-list-card");
        }

        // FOR MOUSEOUT UNHIGHLIGHTING THE LIST
        top5ListElement.onmouseout = (event) => {
            top5ListElement.classList.remove("highlighted-list-card");
        }
    }

    ignoreParentClick(event) {
        event.cancelBubble = true;
        if (event.stopPropagation) event.stopPropagation();
    }
}