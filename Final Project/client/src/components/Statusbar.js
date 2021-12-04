import { useContext, useState, forwardRef, StrictMode } from 'react'
import { GlobalStoreContext } from '../store'
import { Typography, Button, Dialog, ListItemText, ListItem, List, Fab, Divider, AppBar, Toolbar, IconButton, Slide, TextField, Box, Card, Stack, Grid } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

/*
    Our Status bar React component goes at the bottom of our UI.
    
    @author Aidan Furey
*/

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

function Statusbar() {
    const { store } = useContext(GlobalStoreContext);
    const [open, setOpen] = useState(false);

    /* Handles opening the full-screen dialog. */
    const handleClickOpen = () => {
        store.createNewList().then(() => {
            setOpen(true);
        });
    };

    /* Handles closing the full-screen dialog. */
    const handleClose = () => {
        store.loadLists().then(() => {
            setOpen(false);
        }); 
    };

    console.log('currentList=' + store.currentList)

    function handleUpdateText(event) {
        let text = event.target.value;
        let id = event.target.id.substring("list-".length) - 1;
        console.log(id);
        store.currentList.items[id] = text;
    }

    let i = 0  // used for mapping the items
    return (
        <div id="top5-statusbar">
            <Fab color="primary" aria-label="add" onClick={handleClickOpen}>
                <AddIcon aria-label='add'/>
            </Fab>
            <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
            <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Workspace
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose}>
              save
            </Button>
            <Button autoFocus color="inherit" onClick={handleClose}>
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
    );
}

export default Statusbar;