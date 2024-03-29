import React from 'react';
import './App.css';
import jsTPS from "./common/jsTPS.js"

// Import transactions
import ChangeItem_Transaction from './transactions/ChangeItem_Transaction';
import MoveItem_Transaction from './transactions/MoveItem_Transaction';

// IMPORT DATA MANAGEMENT AND TRANSACTION STUFF
import DBManager from './db/DBManager';

// THESE ARE OUR REACT COMPONENTS
import DeleteModal from './components/DeleteModal';
import Banner from './components/Banner.js'
import Sidebar from './components/Sidebar.js'
import Workspace from './components/Workspace.js';
import Statusbar from './components/Statusbar.js'

class App extends React.Component {
    constructor(props) {
        super(props);

        // THIS WILL TALK TO LOCAL STORAGE
        this.db = new DBManager();
        this.tps = new jsTPS();

        // GET THE SESSION DATA FROM OUR DATA MANAGER
        let loadedSessionData = this.db.queryGetSessionData();

        // SETUP THE INITIAL STATE
        this.state = {
            currentList : null,
            sessionData : loadedSessionData,
            hasTransactionToRedo: this.tps.hasTransactionToRedo,
            hasTransactionToUndo: this.tps.hasTransactionToUndo
        }

        window.addEventListener("keydown", this.handleKeyDown);
    }

    handleKeyDown = (event) => {
        if (event.ctrlKey && event.key === 'z') {
            this.undo();
        }
        if (event.ctrlKey && event.key === 'y') {
            this.redo();
        }
    }

    sortKeyNamePairsByName = (keyNamePairs) => {
        keyNamePairs.sort((keyPair1, keyPair2) => {
            // GET THE LISTS
            return keyPair1.name.localeCompare(keyPair2.name);
        });
    }
    // THIS FUNCTION BEGINS THE PROCESS OF CREATING A NEW LIST
    createNewList = () => {
        // FIRST FIGURE OUT WHAT THE NEW LIST'S KEY AND NAME WILL BE
        let newKey = this.state.sessionData.nextKey;
        let newName = "Untitled" + newKey;

        // MAKE THE NEW LIST
        let newList = {
            key: newKey,
            name: newName,
            items: ["?", "?", "?", "?", "?"]
        };

        // MAKE THE KEY,NAME OBJECT SO WE CAN KEEP IT IN OUR
        // SESSION DATA SO IT WILL BE IN OUR LIST OF LISTS
        let newKeyNamePair = { "key": newKey, "name": newName };
        let updatedPairs = [...this.state.sessionData.keyNamePairs, newKeyNamePair];
        this.sortKeyNamePairsByName(updatedPairs);

        // CHANGE THE APP STATE SO THAT IT THE CURRENT LIST IS
        // THIS NEW LIST AND UPDATE THE SESSION DATA SO THAT THE
        // NEXT LIST CAN BE MADE AS WELL. NOTE, THIS setState WILL
        // FORCE A CALL TO render, BUT THIS UPDATE IS ASYNCHRONOUS,
        // SO ANY AFTER EFFECTS THAT NEED TO USE THIS UPDATED STATE
        // SHOULD BE DONE VIA ITS CALLBACK
        this.setState(prevState => ({
            currentList: newList,
            sessionData: {
                nextKey: prevState.sessionData.nextKey + 1,
                counter: prevState.sessionData.counter + 1,
                keyNamePairs: updatedPairs
            }
        }), () => {
            // PUTTING THIS NEW LIST IN PERMANENT STORAGE
            // IS AN AFTER EFFECT
            this.db.mutationCreateList(newList);
            this.db.mutationUpdateSessionData(this.state.sessionData);
        });
    }
    renameList = (key, newName) => {
        let newKeyNamePairs = [...this.state.sessionData.keyNamePairs];
        // NOW GO THROUGH THE ARRAY AND FIND THE ONE TO RENAME
        for (let i = 0; i < newKeyNamePairs.length; i++) {
            let pair = newKeyNamePairs[i];
            if (pair.key === key) {
                pair.name = newName;
            }
        }
        this.sortKeyNamePairsByName(newKeyNamePairs);

        // WE MAY HAVE TO RENAME THE currentList
        let currentList = this.state.currentList;
        if (currentList.key === key) {
            currentList.name = newName;
        }

        this.setState(prevState => ({
            currentList: prevState.currentList,
            sessionData: {
                nextKey: prevState.sessionData.nextKey,
                counter: prevState.sessionData.counter,
                keyNamePairs: newKeyNamePairs
            }
        }), () => {
            // AN AFTER EFFECT IS THAT WE NEED TO MAKE SURE
            // THE TRANSACTION STACK IS CLEARED
            let list = this.db.queryGetList(key);
            list.name = newName;
            this.db.mutationUpdateList(list);
            this.db.mutationUpdateSessionData(this.state.sessionData);
        });
    }

    changeItem = (index, newItem) => {
        let newCurrentList = this.state.currentList;
        newCurrentList.items[index] = newItem;

        this.setState(prevState => ({
            currentList: prevState.currentList
        }), () => {
            this.db.mutationUpdateList(this.state.currentList);
            this.db.mutationUpdateSessionData(this.state.sessionData);
        });
    }

    addChangeItemTransaction = (index, newItem) => {
        let oldItem = this.state.currentList.items[index];
        let transaction = new ChangeItem_Transaction(this.changeItem, index, oldItem, newItem);
        this.tps.addTransaction(transaction);
    }

    moveItem = (oldItemIndex, newItemIndex) => {
        this.state.currentList.items.splice(newItemIndex, 0, this.state.currentList.items.splice(oldItemIndex, 1)[0]);
        this.setState(prevState => ({
            currentList: prevState.currentList
        }), () => {
            this.db.mutationUpdateList(this.state.currentList);
            this.db.mutationUpdateSessionData(this.state.sessionData);
        })
    }

    addMoveItemTransaction = (oldItemIndex, newItemIndex) => {
        let transaction = new MoveItem_Transaction(this.moveItem, oldItemIndex, newItemIndex);
        this.tps.addTransaction(transaction);
    }

    // THIS FUNCTION BEGINS THE PROCESS OF LOADING A LIST FOR EDITING
    loadList = (key) => {
        let newCurrentList = this.db.queryGetList(key);
        this.setState(prevState => ({
            currentList: newCurrentList,
            sessionData: prevState.sessionData
        }), () => {
            // ANY AFTER EFFECTS?
        });
    }
    // THIS FUNCTION BEGINS THE PROCESS OF CLOSING THE CURRENT LIST
    closeCurrentList = () => {
        this.setState(prevState => ({
            currentList: null,
            listKeyPairMarkedForDeletion : prevState.listKeyPairMarkedForDeletion,
            sessionData: this.state.sessionData
        }), () => {
            // ANY AFTER EFFECTS?
            // Yes, clear the transaction stack.
            this.tps.clearAllTransactions();
        });
    }

    deleteList = (keyNamePair) => {
        // SOMEHOW YOU ARE GOING TO HAVE TO FIGURE OUT
        // WHICH LIST IT IS THAT THE USER WANTS TO
        // DELETE AND MAKE THAT CONNECTION SO THAT THE
        // NAME PROPERLY DISPLAYS INSIDE THE MODAL
        this.setState({
            listKeyPairMarkedForDeletion: keyNamePair
        });
        this.showDeleteListModal();
    }

    removeList = () => {
        let newKeyNamePairs = [...this.state.sessionData.keyNamePairs];
        let listKeyPairToDelete = this.state.listKeyPairMarkedForDeletion;
        let listToDeleteIndex;
        for (let i = 0; i < newKeyNamePairs.length; i++) {
            if (listKeyPairToDelete === newKeyNamePairs[i]) {
                listToDeleteIndex = i;
                break;
            }
        }
        let listToDelete = this.db.queryGetList(listKeyPairToDelete.key);
        let prevCurrentList = this.state.currentList;
        
        newKeyNamePairs.splice(listToDeleteIndex, 1);

        this.setState(prevState => ({
            currentList: prevState.currentList,
            listKeyPairMarkedForDeletion: null, 
            sessionData: {
                nextKey: prevState.sessionData.nextKey,
                counter: prevState.sessionData.counter - 1,  
                keyNamePairs: newKeyNamePairs
            }
        }), () => {
            // Update db
            let sessionData = this.db.queryGetSessionData();
            sessionData.keyNamePairs.splice(listToDeleteIndex, 1)
            this.db.mutationUpdateSessionData(this.state.sessionData);
            // Update UI
            this.hideDeleteListModal();
            if (prevCurrentList && (listToDelete.key === prevCurrentList.key)) {
                this.closeCurrentList();
            }
        });
    }

    // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // TO SEE IF THEY REALLY WANT TO DELETE THE LIST
    showDeleteListModal() {
        let modal = document.getElementById("delete-modal");
        modal.classList.add("is-visible");
    }
    // THIS FUNCTION IS FOR HIDING THE MODAL
    hideDeleteListModal() {
        let modal = document.getElementById("delete-modal");
        modal.classList.remove("is-visible");
    }

    undo = () => {
        if (this.state.hasTransactionToUndo) {
            this.tps.undoTransaction();
        }
        this.setState({
            hasTransactionToUndo: this.tps.hasTransactionToUndo,
            hasTransactionToRedo: this.tps.hasTransactionToRedo
        });
    }

    redo = () => {
        if (this.state.hasTransactionToRedo) {
            this.tps.doTransaction();
        }
        this.setState({
            hasTransactionToUndo: this.tps.hasTransactionToUndo,
            hasTransactionToRedo: this.tps.hasTransactionToRedo
        });
    }

    render() {
        return (
            <div id="app-root">
                <Banner 
                    title='Top 5 Lister'
                    closeCallback={this.closeCurrentList}
                    undoCallback={this.undo}
                    redoCallback={this.redo} 
                    currentList={this.state.currentList}
                    tps={this.tps} />
                <Sidebar
                    heading='Your Lists'
                    currentList={this.state.currentList}
                    keyNamePairs={this.state.sessionData.keyNamePairs}
                    createNewListCallback={this.createNewList}
                    deleteListCallback={this.deleteList}
                    loadListCallback={this.loadList}
                    renameListCallback={this.renameList}
                />
                <Workspace
                    currentList={this.state.currentList}
                    renameItemCallback={this.addChangeItemTransaction}
                    moveItemCallback={this.addMoveItemTransaction}
                />
                <Statusbar 
                    currentList={this.state.currentList} />
                <DeleteModal
                    hideDeleteListModalCallback={this.hideDeleteListModal}
                    removeListCallback={this.removeList}
                    listKeyPair={this.state.listKeyPairMarkedForDeletion}
                />
            </div>
        );
    }
}

export default App;
