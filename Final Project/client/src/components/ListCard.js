import { useContext } from 'react'
import AuthContext from '../auth';
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Typography } from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import Stack from '@mui/material/Stack';

/*
    This is a card in our list of top 5 lists.
    
    @author Aidan Furey
*/
function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const { idNamePair } = props;
    const list = store.getListById(idNamePair._id);
    const user = auth.getUserByEmail(list.ownerEmail);

    async function handleDeleteList(event, id) {
        event.stopPropagation();
        store.markListForDeletion(id);
        console.log(idNamePair);
    }
        
    return (
        <ListItem
            id={idNamePair._id}
            key={idNamePair._id}
        >
            <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h5">{idNamePair.name}</Typography>
                <Typography> by {user.firstName + " " + user.lastName} </Typography>
            </Box>

            <Stack >
                <Box>
                    <IconButton aria-label='like'>
                        <ThumbUpOffAltIcon style={{ fontSize: '24pt' }} />
                        <Typography variant="h6">85M</Typography>
                    </IconButton>
                </Box>
                <Box>
                    <Typography>Views: 0</Typography>
                </Box>
            </Stack>
            <Stack >
                <Box sx={{ flexGrow: 1, paddingBottom: 3 }}>
                    <IconButton aria-label='dislike' >
                        <ThumbDownOffAltIcon style={{ fontSize: '24pt' }} />
                        <Typography variant="h6">85M</Typography>
                    </IconButton>
                </Box>
            </Stack>
            <Stack spacing={2}>
                <Box>
                    <IconButton onClick={(event) => {
                        handleDeleteList(event, idNamePair._id)
                    }} aria-label='delete'>
                        <DeleteIcon style={{ fontSize: '24pt' }} />
                    </IconButton>
                </Box>
                <Box>
                    <IconButton aria-label='expand'>
                        <ExpandMoreIcon style={{ fontSize: '24pt' }} />
                    </IconButton>
                </Box>
            </Stack>
        </ListItem>
    );
}

export default ListCard;