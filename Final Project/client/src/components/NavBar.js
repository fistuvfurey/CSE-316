import { useContext } from 'react';
import { GlobalStoreContext } from '../store';
import { AppBar, Box, Toolbar, IconButton, Typography, TextField, InputAdornment } from '@mui/material';
// Icon imports
import SortIcon from '@mui/icons-material/Sort';
import FunctionsIcon from '@mui/icons-material/Functions';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';

export default function NavBar() {

  const { store } = useContext(GlobalStoreContext);
  const handleClickHomeButton = () => {
    store.loadHome();
  }

  const handleClickAllListsButton = () => {
    store.loadAllLists();
  }

  return (
    <Box >
      <AppBar position="static" sx={{ boxShadow: 0 }}>
        <Toolbar>
        <IconButton color="inherit" aria-label="your lists" component="span" onClick={handleClickHomeButton}>
            <HomeIcon fontSize="large"/>
        </IconButton>
        <IconButton color="inherit" aria-label="all lists" component="span" onClick={handleClickAllListsButton}>
          <PeopleIcon fontSize="large"/>
        </IconButton>
        <IconButton color="inherit" aria-label="user lists" component="span">
          <PersonIcon fontSize="large"/>
        </IconButton>
        <IconButton color="inherit" aria-label="community lists" component="span">
          <FunctionsIcon fontSize="large"/>
        </IconButton>
          <TextField sx={{ flex: 1, backgroundColor: "#FFFFFF", borderRadius: 2 }} size="small"
            InputProps={{
              startAdornment: (
                  <InputAdornment position='start'>
                      <SearchIcon />
                  </InputAdornment>)
                }}>
          </TextField>
          <Box>
            <Typography sx={{ paddingLeft: 2 }}>SORT BY</Typography>
          </Box>
            <IconButton color="inherit" aria-label="sort by" component="span">
                <SortIcon fontSize="large"/>
            </IconButton>    
        </Toolbar>
      </AppBar>
    </Box>
  );
}