import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';

/*
    Our Status bar React component goes at the bottom of our UI.
    
    @author McKilla Gorilla
*/
function Statusbar() {
    const { store } = useContext(GlobalStoreContext);

    function handleCreateNewList() {
        store.createNewList();
    }

    return (
        <div id="top5-statusbar">
            <Fab color="primary" aria-label="add" >
                <AddIcon onClick={(event) => {
                    handleCreateNewList()
                }} aria-label='add'/>
            </Fab>
            <Typography variant="h3" sx={{ paddingLeft: "15px" }}>Your Lists</Typography>
        </div>
    );
}

export default Statusbar;