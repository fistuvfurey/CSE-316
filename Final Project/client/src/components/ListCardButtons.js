import { useContext } from 'react';
import { GlobalStoreContext } from '../store';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import { IconButton, Typography } from '@mui/material';
import ThumbDownOffAlt from '@mui/icons-material/ThumbDownOffAlt';
import DeleteIcon from '@mui/icons-material/Delete';

/*
    This is a card of buttons within our ListCard.
    
    @author Aidan Furey
*/
function ListCardButtons(props) {
    
    const { store } = useContext(GlobalStoreContext);
    const { list } = props;

    async function handleDeleteList(event, id) {
        event.stopPropagation();
        store.markListForDeletion(id);
    }

    async function handleClickLikeButton() {
        if (list.isPublished) {
            store.likeButton(list);
        }
    }

    async function handleClickDislikeButton() {
        if (list.isPublished) {
            store.dislikeButton(list);
        }
    }

    let isDeleteIconVisible = "visible";
    if (store.button !== "HOME") {
        isDeleteIconVisible = "hidden";
    }

    let buttons = 
             <div>
                <IconButton onClick={(event) => {
                    event.stopPropagation();
                    handleClickLikeButton();
                }}>
                    <ThumbUpOffAltIcon style={{ fontSize: '24pt' }}></ThumbUpOffAltIcon>
                    <Typography>{list.likes.length}</Typography>
                </IconButton>
                <IconButton onClick={(event) => {
                    event.stopPropagation();
                    handleClickDislikeButton();
                }}>
                <ThumbDownOffAlt style={{ fontSize: '24pt' }}></ThumbDownOffAlt>
                <Typography>{list.dislikes.length}</Typography>
                </IconButton>
                    <IconButton visibility={isDeleteIconVisible} onClick={(event) => {
                            handleDeleteList(event, list._id);
                        }} aria-label='delete'>
                        <DeleteIcon style={{ fontSize: '24pt' }}></DeleteIcon>
                    </IconButton>
            </div> 
        
    return (
          buttons
    )
}

export default ListCardButtons;