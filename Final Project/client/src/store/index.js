import { createContext, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import api from '../api'
import AuthContext from '../auth'

/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_LISTS: "LOAD_LISTS",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    UNMARK_LIST_FOR_DELETION: "UNMARK_LIST_FOR_DELETION",
    SET_CURRENT_LIST: "SET_CURRENT_LIST"
}

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        lists: [],
        currentList: null,
        newListCounter: 0,
        listMarkedForDeletion: null
    });
    
    const history = useHistory();

    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    lists: payload.lists,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listMarkedForDeletion: null
                });
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    lists: store.lists,
                    currentList: payload.currentList,
                    newListCounter: store.newListCounter + 1,
                    listMarkedForDeletion: null
                });
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_LISTS: {
                return setStore({
                    lists: payload,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listMarkedForDeletion: null
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    lists: store.lists,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listMarkedForDeletion: payload
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.UNMARK_LIST_FOR_DELETION: {
                return setStore({
                    lists: store.lists,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listMarkedForDeletion: null
                });
            }
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    lists: store.lists,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listMarkedForDeletion: null
                });
            }
            default:
                return store;
        }
    }

    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = async function (id, newName) {
        store.setIsListNameEditActive();
        try {
            let response = await api.getTop5ListById(id);
            if (response.data.success) {
                let top5List = response.data.top5List;
                top5List.name = newName;
                async function updateList(top5List) {
                    response = await api.updateTop5ListById(top5List._id, top5List);
                    if (response.data.success) {
                        async function getListObjs(top5List) {
                            response = await api.getLists();
                            if (response.data.success) {
                                let listsArray = response.data.lists;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        lists: listsArray,
                                        top5List: top5List
                                    }
                                });
                            }
                        }
                        getListObjs(top5List);
                    }
                }
                updateList(top5List);
            }
        } catch (err) {
            console.log(err.response.data.errorMessage);
        }
    }

    // THIS FUNCTION CREATES A NEW LIST
    store.createNewList = async function () {
        let newListName = "Untitled" + store.newListCounter;
        console.log(auth.user.firstName);
        let payload = {
            name: newListName,
            items: ["?", "?", "?", "?", "?"],
            ownerEmail: auth.user.email,
            ownerFirstName: auth.user.firstName,
            ownerLastName: auth.user.lastName,
            numLikes: 0,
            numDislikes: 0,
            numViews: 0,
            isPublished: false,
            comments: []
        };
        try {
            const createListResponse = await api.createTop5List(payload);
            if (createListResponse.data.success) {
                let newList = createListResponse.data.top5List;
                storeReducer({
                    type: GlobalStoreActionType.CREATE_NEW_LIST,
                    payload: {
                        currentList: newList
                    }
                }); 
            }
            else {
                console.log("API FAILED TO CREATE A NEW LIST");
            }
        } catch (err) {
            console.log("oh no error");
        }
    }

    // THIS FUNCTION LOADS ALL THE LISTS SO WE CAN LIST ALL THE LISTS
    store.loadLists = async function () {
        try {
            const response = await api.getLists();
            if (response.data.success) {
                let listsArray = response.data.lists;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_LISTS,
                    payload: listsArray
                });
            }
            else {
                console.log("API FAILED TO GET THE LISTS");
            }
        }
        catch (err) {
            console.log(err.response.data.errorMessage);
        }
    }

    // THE FOLLOWING 5 FUNCTIONS ARE FOR COORDINATING THE DELETION
    // OF A LIST, WHICH INCLUDES USING A VERIFICATION MODAL. THE
    // FUNCTIONS ARE markListForDeletion, deleteList, deleteMarkedList,
    // showDeleteListModal, and hideDeleteListModal
    store.markListForDeletion = async function (id) {
        // GET THE LIST
        try {
            let response = await api.getTop5ListById(id);
            if (response.data.success) {
                let top5List = response.data.top5List;
                storeReducer({
                    type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                    payload: top5List
                });
            }
        } catch (err) {
            console.log(err.response.data.errorMessage);
        }
    }

    store.deleteList = async function (listToDelete) {
        try {
            let response = await api.deleteTop5ListById(listToDelete._id);
            store.loadLists();
            history.push("/");
        } catch (err) {
            let errMessage = err.response.data.errorMessage;
            console.log(errMessage);
        }
    }

    store.deleteMarkedList = function () {
        store.deleteList(store.listMarkedForDeletion);
    }

    store.unmarkListForDeletion = function () {
        storeReducer({
            type: GlobalStoreActionType.UNMARK_LIST_FOR_DELETION,
            payload: null
        });
    }
    
    store.setCurrentList = async function (id) {
        try {
            let response = await api.getTop5ListById(id);
            if (response.data.success) {
                let top5List = response.data.top5List;
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: top5List
                });
            }
        } catch (err) {
            console.log(err.response.data.errorMessage);
        }
    }

    store.getListById = async function (id) {
        try {
            let response = await api.getTop5ListById(id);
            let top5List = response.data.top5List;
            console.log(top5List);
            return top5List;
            
        } catch (err) {
            console.log(err.response.data.errorMessage);
        }
    }

    store.updateItem = function (index, newItem) {
        store.currentList.items[index] = newItem;
        store.updateCurrentList();
    }

    store.updateCurrentList = async function () {
        try {
            const response = await api.updateTop5ListById(store.currentList._id, store.currentList);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                });
            }
        } catch (err) {
            console.log(err.response.data.errorMessage);
        }
    }

    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };