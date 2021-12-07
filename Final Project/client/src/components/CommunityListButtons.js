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
function CommunityListButtons(props) {
    
    const { store } = useContext(GlobalStoreContext);
    const { list } = props;

    async function handleClickLikeButton() {
        store.likeButton(list);
        store.updateCommunityList(list);
    }

    async function handleClickDislikeButton() {
        store.dislikeButton(list);
        store.updateCommunityList(list);
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
            </div> 
        
    return (
          buttons
    )
}

export default CommunityListButtons;