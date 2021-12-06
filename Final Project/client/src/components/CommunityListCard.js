import { useContext } from 'react';
import { GlobalStoreContext } from '../store';
import AuthContext from '../auth';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box } from '@mui/system';
import { Grid, Button, Typography, Accordion, CardContent, Card, AccordionSummary, AccordionDetails, Stack, TextField } from '@mui/material';
import { ListCardButtons, ListItemsCard, CommentCard } from '.';

/*
    This is a card in our list of top 5 lists.
    
    @author Aidan Furey
*/
function CommunityListCard(props) {
    
    const { store } = useContext(GlobalStoreContext);
    const { list } = props;
    const { auth } = useContext(AuthContext);

    async function handleAccordionOpen() {
        store.incrementListViews(list);
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let comment = { username: auth.user.username, comment: event.target.value }
            list.comments.push(comment);
            store.updateList(list);
        }
    }

    return (
        <Card sx={{ mb: 1 }}>
            <Accordion onChange={(e, expanded) => {
                if (expanded) {
                    handleAccordionOpen();
                }
            }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <CardContent>
                        <Grid direction="column">
                            <Typography>{list.name}</Typography>
                            <Typography>Updated: {list.lastUpdate}</Typography>
                        </Grid>
                    </CardContent>
                    <Box sx={{ flexGrow: 1 }}></Box>
                    <Stack>
                        <ListCardButtons list={list}></ListCardButtons>
                        <Typography sx={{ paddingLeft: 14 }}>Views: {list.numViews}</Typography>
                    </Stack>
                </AccordionSummary>
                {/* <AccordionDetails>
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
                </AccordionDetails> */}
            </Accordion>
        </Card>
    )
}

export default CommunityListCard;