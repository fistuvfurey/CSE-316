import { createContext, useContext, useState } from 'react';
import api from '../api';
import AuthContext from '../auth';

/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author Aidan Furey
*/

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});

export const GlobalStoreActionType = {
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    UNMARK_LIST_FOR_DELETION: "UNMARK_LIST_FOR_DELETION",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    LOAD_ALL_LISTS: "LOAD_ALL_LISTS",
    LOAD_HOME: "LOAD_HOME",
    LOAD_ALL_USER_LISTS: "LOAD_ALL_USER_LISTS",
    UPDATE_LISTS: "UPDATE_LISTS",
    LOAD_COMMUNITY_LISTS: "LOAD_COMMUNITY_LISTS",
    SEARCH: "SEARCH",
    CREATE_COMMUNITY_LIST: "CREATE_COMMUNITY_LIST"
}

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
    const [store, setStore] = useState({
        lists: [],
        currentList: null,
        newListCounter: 0,
        listMarkedForDeletion: null,
        button: "",
        searchBarQuery: "",
        communityLists: []
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
                    listMarkedForDeletion: null,
                    button: store.button,
                    searchBarQuery: store.searchBarQuery,
                    communityLists: store.communityLists
                });
            }
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    lists: store.lists,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listMarkedForDeletion: payload,
                    button: store.button,
                    searchBarQuery: store.searchBarQuery,
                    communityLists: store.communityLists
                });
            }
            case GlobalStoreActionType.UNMARK_LIST_FOR_DELETION: {
                return setStore({
                    lists: store.lists,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listMarkedForDeletion: null,
                    button: store.button,
                    searchBarQuery: store.searchBarQuery,
                    communityLists: store.communityLists
                });
            }
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    lists: store.lists,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listMarkedForDeletion: null,
                    button: store.button,
                    searchBarQuery: store.searchBarQuery,
                    communityLists: store.communityLists
                });
            }
            case GlobalStoreActionType.LOAD_HOME: {
                return setStore({
                    lists: payload,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listMarkedForDeletion: null,
                    button: "HOME",
                    searchBarQuery: store.searchBarQuery,
                    communityLists: store.communityLists
                });
            }
            case GlobalStoreActionType.LOAD_ALL_LISTS: {
                return setStore({
                    lists: payload,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listMarkedForDeletion: null,
                    button: "ALL_LISTS",
                    searchBarQuery: store.searchBarQuery,
                    communityLists: store.communityLists
                });
            }
            case GlobalStoreActionType.UPDATE_LISTS: {
                return setStore({
                    lists: payload,
                    currentList: null, 
                    newListCounter: store.newListCounter, 
                    listMarkedForDeletion: null,
                    button: store.button,
                    searchBarQuery: store.searchBarQuery,
                    communityLists: store.communityLists
                });
            }
            case GlobalStoreActionType.LOAD_ALL_USER_LISTS: {
                return setStore({
                    lists: payload,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listMarkedForDeletion: null,
                    button: "ALL_USER_LISTS",
                    searchBarQuery: store.searchBarQuery,
                    communityLists: store.communityLists
                });
            }
            case GlobalStoreActionType.LOAD_COMMUNITY_LISTS: {
                return setStore({
                    lists: payload,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listMarkedForDeletion: null,
                    button: "COMMUNITY",
                    searchBarQuery: store.searchBarQuery,
                    communityLists: store.communityLists
                });
            }
            case GlobalStoreActionType.SEARCH: {
                return setStore({
                    lists: store.lists,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listMarkedForDeletion: null,
                    button: store.button,
                    searchBarQuery: payload,
                    communityLists: store.communityLists
                });
            }
            case GlobalStoreActionType.CREATE_COMMUNITY_LIST: {
                return setStore({
                    lists: store.lists,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listMarkedForDeletion: null,
                    button: store.button,
                    searchBarQuery: store.searchBarQuery,
                    communityLists: payload
                });
            }
            default:
                return store;
        }
    }

    store.createNewList = async function () {
        let newListName = "Untitled" + store.newListCounter;
        let payload = {
            name: newListName,
            items: ["?", "?", "?", "?", "?"],
            ownerEmail: auth.user.email,
            ownerUsername: auth.user.username,
            likes: [],
            dislikes: [],
            numViews: 0,
            isPublished: false
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

    store.createCommunityList = async function (name, items) {
        try {
            let response = await api.getAllTop5Lists();
            let allPublishedLists = response.data.lists;
            let listsWithSameName = allPublishedLists.filter(list =>
                list.name.toLowerCase() === name.toLowerCase());
            // If there are no lists with the same name then create the community list
            if (listsWithSameName.length === 0) {
                let payload = {
                    name: name,
                    items: [
                        { item : items[0], points: 5 },
                        { item : items[1], points: 4 },
                        { item : items[2], points: 3 },
                        { item : items[3], points: 2 },
                        { item: items[4], points: 1 }
                    ],
                    likes: [],
                    dislikes: [],
                    numViews: 0
                };
                const createListResponse = await api.createCommunityList(payload);
                let newCommunityList = createListResponse.data.communityList;
                store.communityLists.push(newCommunityList);
                storeReducer({
                    type: GlobalStoreActionType.CREATE_COMMUNITY_LIST,
                    payload: store.communityLists
                });
            }
        } catch (err) {
            console.log("Error creating community list.");
        }
    }

    store.markListForDeletion = async function (id) {
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
            console.log("Error marking list for deletion.");
        }
    }

    store.deleteList = async function (listToDelete) {
        try {
            let response = await api.deleteTop5ListById(listToDelete._id);
            store.loadHome();
        } catch (err) {
            console.log("Error deleting ", listToDelete);
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

    store.updateList = async function (listToUpdate) {
        try {
            const updateListResponse = await api.updateTop5ListById(listToUpdate._id, listToUpdate);
            store.updateLists(store.lists);
        } catch (err) {
            console.log("Error updating ", listToUpdate.name);
        }
    }

    store.incrementListViews = async function (list) {
        list.numViews = list.numViews + 1;
        store.updateList(list);
    }

    store.likeButton= async function (list) {
        if (auth.user) {
            if (list.likes.includes(auth.user.username)) {
                // unlike the list
                list.likes = list.likes.filter(username => username !== auth.user.username);  // remove username from list of likes
            } 
            else if (!list.dislikes.includes(auth.user.username)) {  // cannnot like the list if the user already disliked it
                // like the list
                list.likes.push(auth.user.username);  // add username to list of likes
            }
            store.updateList(list);
        }
    }

    store.dislikeButton = async function (list) {
        if (auth.user) {
            if (list.dislikes.includes(auth.user.username)) {
                // undislike the list
                list.dislikes = list.dislikes.filter(username => username !== auth.user.username);  // remove username from list of dislikes
            }
            else if (!list.likes.includes(auth.user.username)) {  // cannot dislike the list if the user already liked it 
                // dislike the list
                list.dislikes.push(auth.user.username)
            }
            store.updateList(list);
        }
    }

    /* Loads a user's lists for when the "home" button is selected. */
    store.loadHome = async function () {
        try {
            if (!auth.isGuest) {
                const response = await api.getLists();
                let listsArray = response.data.lists;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_HOME,
                    payload: listsArray
                });
                console.log("Success in loading home.")
            }
            else {
                console.log("Logged in as guest.")
            }
        } catch (err) {
            console.log("Error loading home.");
        }
    }

    /* Loads all lists when the "all lists" button is selected. */
    store.loadAllLists = async function () {
        try {
            const response = await api.getAllTop5Lists();
            let listsArray = response.data.lists;
            store.lists = listsArray;
            storeReducer({
                type: GlobalStoreActionType.LOAD_ALL_LISTS,
                payload: listsArray
            });
            store.sortByNewest();
        } catch (err) {
            console.log("Error loading all lists.");
        }
    }

    /* Loads all lists for when a guest selects the "all lists" button is selected. */
    store.loadGuestAllLists = async function () {
        try {
            const response = await api.getAllListsForGuest();
            let listsArray = response.data.lists;
            store.lists = listsArray;
            storeReducer({
                type: GlobalStoreActionType.LOAD_ALL_LISTS,
                payload: listsArray
            });
            store.sortByNewest();
        } catch (err) {
            console.log("Error while loading all lists for guest.");
        }
    }

    store.loadCommunityLists = async function () {
        storeReducer({
            type: GlobalStoreActionType.LOAD_COMMUNITY_LISTS,
            payload: null
        });
    }

    /* Empties lists and updates view for when "user lists" button is selected. */
    store.setAllUserLists = function () {   
        storeReducer({
            type: GlobalStoreActionType.LOAD_ALL_USER_LISTS,
            payload: []
        });
    }

    /* Updates lists in the store. */
    store.updateLists = function (lists) {
        store.lists = lists;
        storeReducer({
            type: GlobalStoreActionType.UPDATE_LISTS,
            payload: lists
        });
    }

    /* Loads all lists from the database for when a user is searching user lists. */
    store.loadAllUserLists = async function (lists) {
        try {
            const response = await api.getAllTop5Lists();
            let listsArray = response.data.lists;
            store.lists = listsArray;
            storeReducer({
                type: GlobalStoreActionType.LOAD_ALL_USER_LISTS,
                payload: listsArray
            });
        } catch (err) {
            console.log("Error loading all user lists.")
        }
    }

    store.search = function (searchQuery) {
        storeReducer({
            type: GlobalStoreActionType.SEARCH,
            payload: searchQuery
        });
        if (store.button === "HOME") {
            // If the searchQuery is empty, display all of the user's lists.
            if (searchQuery === "") {
                store.loadHome();
            }
            else {
                let filteredLists = store.lists.filter(list => 
                    list.name.toLowerCase().startsWith(searchQuery.toLowerCase()));
                store.updateLists(filteredLists);
            }
        }
        else if (store.button === "ALL_LISTS") {
            let filteredLists = store.lists.filter(list =>
                list.name.toLowerCase() === searchQuery.toLowerCase());
            store.updateLists(filteredLists);
        }
        else if (store.button === "ALL_USER_LISTS") {
            if (auth.isGuest) {
                store.loadGuestAllLists().then(() => {
                    let filteredLists = store.lists.filter(list =>
                        list.ownerUsername.toLowerCase() === searchQuery.toLowerCase());
                        store.updateLists(filteredLists);
                });
            }
            else {
                store.loadAllUserLists().then(() => {
                    let filteredLists = store.lists.filter(list => 
                        list.ownerUsername.toLowerCase() === searchQuery.toLowerCase());
                        store.updateLists(filteredLists);
                });
            }
        }
    }

    store.sortByNewest = function () {
        let sortedLists = store.lists.sort(function (listA, listB) {
            return listB.time - listA.time;
        });
        store.updateLists(sortedLists);
    }

    store.sortByOldest = function () {
        let sortedLists = store.lists.sort(function (listA, listB) {
            return listA.time - listB.time;
        });
        store.updateLists(sortedLists);
    }

    store.sortByViews = function () {
        let sortedLists = store.lists.sort(function (listA, listB) {
            return listB.numViews - listA.numViews;
        });
        store.updateLists(sortedLists);
    }

    store.sortByLikes = function () {
        let sortedLists = store.lists.sort(function (listA, listB) {
            return listB.likes.length - listA.likes.length;
        });
        store.updateLists(sortedLists);
    }

    store.sortByDislikes = function () {
        let sortedLists = store.lists.sort(function (listA, listB) {
            return listB.dislikes.length - listA.dislikes.length;
        });
        store.updateLists(sortedLists);
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