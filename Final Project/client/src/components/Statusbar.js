import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import { Typography, Button, Dialog, Fab, AppBar, Toolbar, TextField, Card, Stack, Grid } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';

/*
    Our Status bar React component goes at the bottom of our UI.
    
    @author Aidan Furey
*/
function Statusbar() {
    const { store } = useContext(GlobalStoreContext);
    const [canPublish, setCanPublish] = useState(true);

    /* Handles opening the full-screen dialog. */
    const handleClickOpen = () => {
        store.createNewList();
    }

    /* Handles closing the full-screen dialog when user clicks "save". */
    const handleClose = () => {
        store.updateList(store.currentList).then(() => {
            store.loadHome();
        });
    };
    
    /* Handles closing the full-screen dialog and publishing list when user clicks "publish". */
    const handlePublish = () => {
        store.currentList.isPublished = true;
        // Get the published data
        const date = new Date();
        const year = date.getFullYear();
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", 
        "Sep", "Oct", "Nov", "Dec"];
        const month = months[date.getMonth()];
        const day = date.getDate();
        store.currentList.datePublished = month + " " + day + ", " + year;  // update date string
        store.currentList.time = Date.now();
        store.updateList(store.currentList).then(() => {
            store.loadHome();
        });
    };

    /* Change an item in the list. */
    function handleUpdateText(event) {
        let text = event.target.value;
        let id = event.target.id.substring("list-".length) - 1;
        store.currentList.items[id] = text;
    }

    /* Change the name of the list. */
    function handleUpdateListName(event) {
        let text = event.target.value;
        // Get lists with the same name as the curent text value for list name
        let listsWithSameName = store.lists.filter(list =>
            list.name.toLowerCase() === text.toLowerCase() && 
                list.isPublished);
        if (text === "" || listsWithSameName.length !== 0) {
            setCanPublish(false);
        }
        else {
            setCanPublish(true);
        }
        store.currentList.name = text;
    }

    let i = 0  // used for mapping the items
    let statusbar = <div id="top5-statusbar"></div>;
    if (store.button === "HOME") {
        statusbar = ( 
        <div id="top5-statusbar">
            <Fab color="primary" aria-label="add" onClick={handleClickOpen}>
                <AddIcon aria-label='add'/>
            </Fab>
            <Dialog
                fullScreen
                open={store.currentList}
                onClose={handleClose}
            >
            <AppBar sx={{ position: 'relative' }}>
            <Toolbar>
                <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Workspace
                </Typography>
                <Button autoFocus color="inherit" onClick={handleClose}>
                save
                </Button>
                <Button autoFocus color="inherit" onClick={handlePublish} disabled={!canPublish}>
                publish
                </Button>
            </Toolbar>
            </AppBar>
            <TextField 
                defaultValue={store.currentList && store.currentList.name}
                InputProps={{ style: { fontSize: 40 }}}
                label="List Name"
                margin="dense" 
                sx={{ paddingLeft: 1, paddingRight: 120, mb: 1 }}
                onChange={handleUpdateListName}
            ></TextField>
                <Grid direction="column"> 
                {
                    store.currentList && store.currentList.items.map((item) => (
                        i += 1,
                        <Stack direction="row">
                            <Card sx={{ mb: 1 }}>
                                <Typography variant="h3" sx={{ padding: 3 }}>{i}.</Typography>
                            </Card>
                            <TextField
                                id={"item-" + i}
                                defaultValue={item}
                                InputProps={{ style: { fontSize: 48 } }} 
                                fullWidth
                                label="fullWidth" 
                                label={"item " + i} 
                                margin="none" 
                                sx={{ size: 6, padding: 1 }}
                                onChange={handleUpdateText}>
                            </TextField>           
                        </Stack>
                    ))
                }
                </Grid>
            </Dialog>
            <Typography variant="h3" sx={{ paddingLeft: "15px" }}>Your Lists</Typography>
        </div>
        )
    }
    else if (store.button === "COMMUNITY") {
        statusbar = (
            <div id="top5-statusbar">
                <Typography variant="h3" sx={{ paddingLeft: "15px "}}>Community Lists</Typography>
            </div>
        )
    }
    return (
        statusbar
    );
}

export default Statusbar;