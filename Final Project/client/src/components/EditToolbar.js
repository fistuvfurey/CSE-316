import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import Button from '@mui/material/Button';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import CloseIcon from '@mui/icons-material/HighlightOff';
import { useHistory } from 'react-router';

/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
    const { store } = useContext(GlobalStoreContext);
    const history = useHistory();

    function handleUndo() {
        store.undo();
    }

    function handleRedo() {
        store.redo();
    }

    function handleClose() {
        history.push("/");
        store.closeCurrentList();
    }
    
    let editStatus = false;
    if (store.isItemEditActive) {
        editStatus = true;
    }  

    return (
        <div id="edit-toolbar">
            { editStatus || !store.canUndo() ? 
                <Button 
                    id='undo-button'
                    variant="contained"
                    disabled>
                        <UndoIcon />
                </Button>
                :
                <Button 
                    id='undo-button'
                    onClick={handleUndo}
                    variant="contained">
                        <UndoIcon />
                </Button>
            }
            { editStatus || !store.canRedo() ? 
                <Button 
                    id='redo-button'
                    variant="contained"
                    disabled>
                        <RedoIcon />
                </Button>
                :
                <Button 
                    id='redo-button'
                    onClick={handleRedo}
                    variant="contained">
                        <RedoIcon />
                </Button>
            }
            { editStatus  ?
                <Button 
                    disabled={editStatus}
                    id='close-button'
                    variant="contained"
                    disabled>
                        <CloseIcon />
                </Button>
                :
                <Button 
                    disabled={editStatus}
                    id='close-button'
                    onClick={handleClose}
                    variant="contained">
                        <CloseIcon />
                </Button>
            }
        </div>
    )
}

export default EditToolbar;