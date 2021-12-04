import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Stack from '@mui/material/Stack';
import { Box } from '@mui/system';
import { Button, Typography } from '@mui/material';
import { ListCardButtons } from '.';

/*
    This is a card in our list of top 5 lists.
    
    @author Aidan Furey
*/
function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const { list } = props;

    async function handleDeleteList(event, id) {
        event.stopPropagation();
        store.markListForDeletion(id);
    }

    const handleEditClick = () => {
        store.setCurrentList(list._id);
    }
        
    return (
        <Card sx={{ mb: 1 }}>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <CardContent>
                        <Box sx={{ flexGrow: 1}}>
                            <Typography>{list.name}</Typography>
                            <Typography>By { list.ownerFirstName } { list.ownerLastName }</Typography>
                            <Button onClick={handleEditClick}>Edit</Button>
                        </Box>
                    </CardContent>
                    <Box sx={{ flexGrow: 1 }}></Box>
                    <ListCardButtons list={list}></ListCardButtons>
                </AccordionSummary>
            </Accordion>
        </Card>
    )
}

export default ListCard;