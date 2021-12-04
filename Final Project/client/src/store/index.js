import { createContext, useContext, useState } from 'react'
import api from '../api'
import AuthContext from '../auth'

/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author Aidan Furey
*/

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});

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
    const [store, setStore] = useState({
        lists: [],
        currentList: null,
        newListCounter: 0,
        listMarkedForDeletion: null
    });
    
    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);

    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    lists: store.lists,
                    currentList: payload,
                    newListCounter: store.newListCounter + 1,
                    listMarkedForDeletion: null
                });
            }
            case GlobalStoreActionType.LOAD_LISTS: {
                return setStore({
                    lists: payload,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listMarkedForDeletion: null
                });
            }
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    lists: store.lists,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listMarkedForDeletion: payload
                });
            }
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

    store.createNewList = async function () {
        let newListName = "Untitled" + store.newListCounter;
        console.log(auth.user);
        let payload = {
            name: newListName,
            items: ["?", "?", "?", "?", "?"],
            ownerEmail: auth.user.email,
            ownerUsername: auth.user.username,
            likes: [],
            dislikes: [],
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
                    payload: newList
                }); 
            }
            else {
                console.log("API FAILED TO CREATE A NEW LIST");
            }
        } catch (err) {
            console.log(err.response.data.errorMessage);
        }
    }

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

    store.updateList = async function (list) {
        try {
            const updateListResponse = await api.updateTop5ListById(list._id, list);
            const loadListsResponse = await api.getLists();
            let listsArray = loadListsResponse.data.lists;
            storeReducer({
                type: GlobalStoreActionType.LOAD_LISTS,
                payload: listsArray
            });
        } catch (err) {
            console.log(err.response.data.errorMessage);
        }
    }

    store.incrementListViews = async function (list) {
        try {
            list.numViews = list.numViews + 1;
            const updateListResponse = await api.updateTop5ListById(list._id, list);
            const loadListsResponse = await api.getLists();
            let listsArray = loadListsResponse.data.lists;
            storeReducer({
                type: GlobalStoreActionType.LOAD_LISTS,
                payload: listsArray
            });
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