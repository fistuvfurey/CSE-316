import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import List from '@mui/material/List';
import DeleteModal from './DeleteModal';
import NavBar from './NavBar';

/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);

    useEffect(() => {
        store.loadLists();
    }, []);

    let listCard = "";
    if (store) {
        listCard = 
            <List sx={{ width: '90%', left: '5%' }}>
            {
                store.lists.map((list) => (
                    <ListCard
                        key={list._id}
                        list={list}
                        selected={false}
                    />
                ))
            }
            { store.listMarkedForDeletion ? 
                <DeleteModal />
                : null
            }
            </List>;
    }
    return (
        <div id="top5-list-selector">
            <NavBar></NavBar>
            <div id="list-selector-list">
                {
                    listCard
                }
            </div>
        </div>
    )
}

export default HomeScreen;