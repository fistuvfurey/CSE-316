import { Box } from '@mui/system';
import { useContext } from 'react';
import { GlobalStoreContext } from '../store';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import { IconButton, Typography } from '@mui/material';
import ThumbDownOffAlt from '@mui/icons-material/ThumbDownOffAlt';
import DeleteIcon from '@mui/icons-material/Delete';

/*
    This is a card in our list of top 5 lists.
    
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
        store.likeButton(list);
    }

    async function handleClickDislikeButton() {
        store.dislikeButton(list);
    }
        
    return (
        <div>
        <IconButton onClick={(event) => {
            handleClickLikeButton();
        }}>
            <ThumbUpOffAltIcon style={{ fontSize: '24pt' }}></ThumbUpOffAltIcon>
            <Typography>{list.likes.length}</Typography>
        </IconButton>
        <IconButton onClick={(event) => {
            handleClickDislikeButton();
        }}>
            <ThumbDownOffAlt style={{ fontSize: '24pt' }}></ThumbDownOffAlt>
            <Typography>{list.dislikes.length}</Typography>
        </IconButton>
        <IconButton onClick={(event) => {
            handleDeleteList(event, list._id);
        }} aria-label='delete'>
            <DeleteIcon style={{ fontSize: '24pt' }}></DeleteIcon>
        </IconButton>  
        </div>   
    )
}

export default ListCardButtons;