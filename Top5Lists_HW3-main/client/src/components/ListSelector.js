import React, { useContext, useEffect, useState } from 'react'
import { useHistory, Redirect } from 'react-router-dom'
import ListCard from './ListCard.js'
import { GlobalStoreContext } from '../store'
import DeleteModal from './DeleteModal'
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const ListSelector = () => {
    const { store } = useContext(GlobalStoreContext);
    store.history = useHistory();

    useEffect(() => {
        store.loadIdNamePairs();
    }, []);

    const handleClick = (event) => {
        store.createList({
            name: "Untitled" + store.newListCounter,
            items: ["?", "?", "?", "?", "?"]
        });
    }
    
    if (store.currentList) {
        return <Redirect to={`/top5list/${store.currentList._id}`}/>
    }

    return (
        <div id="top5-list-selector">
            <div id="list-selector-heading">
                <input
                    type="button"
                    id="add-list-button"
                    className="top5-button"
                    onClick={handleClick}
                    value="+" />
                Your Lists
            </div>
            <div id="list-selector-list">
                {
                    store && store.idNamePairs && store.idNamePairs.map((pair) => (
                        <ListCard
                            key={pair._id}
                            idNamePair={pair}
                            selected={false}
                        />
                    ))
                }
                <DeleteModal />
            </div>
        </div>)
}

export default ListSelector;