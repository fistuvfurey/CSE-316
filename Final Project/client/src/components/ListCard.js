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
    
    let cardElement;
    if (list.isPublished) {
        cardElement = 
        <Card sx={{ mb: 1 }}>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <CardContent>
                        <Grid direction="column">
                            <Typography>{list.name}</Typography>
                            <Typography>By {list.ownerUsername}</Typography>
                            <Button onClick={handleEditClick}>Edit</Button>
                        </Grid>
                    </CardContent>
                    <Box sx={{ flexGrow: 1 }}></Box>
                    <Stack>
                        <ListCardButtons list={list}></ListCardButtons>
                        <Typography sx={{ paddingLeft: 14 }}>Views: 20</Typography>
                    </Stack>
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
    }
    else {
        cardElement = 
        <Card sx={{ mb: 1 }}>
            <CardContent>
                <Grid direction="column">
                    <Stack direction="row">
                        <Typography>{list.name}</Typography>   
                    </Stack>
                    <Stack direction="row">
                        <Typography>By {list.ownerUsername}</Typography>
                        <Box sx={{ paddingLeft: 134 }}>
                            <ListCardButtons list={list}></ListCardButtons>
                        </Box>
                    </Stack>
                    <Stack direction="row">
                        <Button onClick={handleEditClick}>Edit</Button>
                        <Typography sx={{ paddingLeft: 150}}>Views: 20</Typography> 
                    </Stack>
                </Grid>
            </CardContent>
        </Card>
    }

    return (
        cardElement
    )
}

export default ListCard;