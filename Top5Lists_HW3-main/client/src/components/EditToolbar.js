import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { useHistory } from 'react-router-dom'
/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
    const { store } = useContext(GlobalStoreContext);
    const history = useHistory();

    let enabledButtonClass = "top5-button";
    let disabledButtonClass = "top5-button-disabled";

    function handleUndo() {
        if (!editStatus) {
            store.undo();
        }
    }

    function handleRedo() {
        if (!editStatus) {
            store.redo();
        }
    }

    function handleClose() {
        if (!editStatus) {
            history.push("/");
            store.closeCurrentList();
        }
    }

    let editStatus = false;
    if (store.isItemEditActive) {
        editStatus = true;
    }

    return (
        <div id="edit-toolbar">
            <div
                disabled={editStatus}
                id='undo-button'
                onClick={handleUndo}
                className={store.hasTransactionToUndo && !editStatus ? enabledButtonClass : disabledButtonClass }>
                &#x21B6;
            </div>
            <div
                disabled={editStatus}
                id='redo-button'
                onClick={handleRedo}
                className={store.hasTransactionToRedo && !editStatus ? enabledButtonClass : disabledButtonClass }>
                &#x21B7;
            </div>
            <div
                disabled={editStatus}
                id='close-button'
                onClick={handleClose}
                className={store.currentList && !editStatus ? enabledButtonClass : disabledButtonClass }>
                &#x24E7;
            </div>
        </div>
    )
}

export default EditToolbar;