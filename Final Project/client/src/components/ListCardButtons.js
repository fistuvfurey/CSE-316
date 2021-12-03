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
    const { idNamePair } = props;

    async function handleDeleteList(event, id) {
        event.stopPropagation();
        store.markListForDeletion(id);
        console.log(idNamePair);
    }
        
    return (
        <Box>
            <IconButton>
                <ThumbUpOffAltIcon style={{ fontSize: '24pt' }}></ThumbUpOffAltIcon>
                <Typography>80M</Typography>
            </IconButton>
            <IconButton>
                <ThumbDownOffAlt style={{ fontSize: '24pt' }}></ThumbDownOffAlt>
                <Typography>40</Typography>
            </IconButton>
            <IconButton onClick={(event) => {
                handleDeleteList(event, idNamePair._id)
            }} aria-label='delete'>
                <DeleteIcon style={{ fontSize: '24pt' }}></DeleteIcon>
            </IconButton>
            <Typography>Views: 20</Typography>      
        </Box>
    )
}

export default ListCardButtons;