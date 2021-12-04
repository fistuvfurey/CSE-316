import { useContext } from 'react';
import { GlobalStoreContext } from '../store';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box } from '@mui/system';
import { Grid, Button, Typography, Accordion, CardContent, Card, AccordionSummary, AccordionDetails, Stack, TextField } from '@mui/material';
import { ListCardButtons, ListItemsCard, CommentCard } from '.';

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

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let comment = event.target.value;
            list.comments.push(comment);
            store.updateList(list);
        }
    }

    return (
        <Card sx={{ mb: 1 }}>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <CardContent>
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography>{list.name}</Typography>
                            <Typography>By {list.ownerUsername}</Typography>
                            <Button onClick={handleEditClick}>Edit</Button>
                        </Box>
                    </CardContent>
                    <Box sx={{ flexGrow: 1 }}></Box>
                    <ListCardButtons list={list}></ListCardButtons>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container direction='row'>
                        <ListItemsCard list={list}></ListItemsCard>
                        <Stack sx={{ flex: 0.65, height: 300 }} spacing={1}>
                            <TextField 
                                sx={{ flex: 1 }}
                                label={"Add comment"}
                                onKeyPress={handleKeyPress}
                            >
                            </TextField>
                            <CommentCard list={list}></CommentCard>
                        </Stack>
                    </Grid>
                </AccordionDetails>
            </Accordion>
        </Card>
    )
}

export default ListCard;