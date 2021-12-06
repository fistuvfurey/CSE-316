import { useContext, useState } from 'react';
import { GlobalStoreContext } from '../store';
import { AppBar, Box, Toolbar, IconButton, Typography, TextField, InputAdornment, MenuItem, Menu} from '@mui/material';
// Icon imports
import SortIcon from '@mui/icons-material/Sort';
import FunctionsIcon from '@mui/icons-material/Functions';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';

export default function NavBar() {

  const { store } = useContext(GlobalStoreContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  
  const handleClickHomeButton = () => {
    store.loadHome();
  }

  const handleClickAllListsButton = () => {
    store.loadAllLists().then(() => {
      store.sortByNewest();
    });
  };

  const handleSortByMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSortByMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSortByNewest = () => {
    store.sortByNewest();
    handleSortByMenuClose();
  }

  const handleSortByOldest = () => {
    store.sortByOldest();
    handleSortByMenuClose();
  }

  const handleSortByViews = () => {
    store.sortByViews();
    handleSortByMenuClose();
  }

  const handleSortByLikes = () => {
    store.sortByLikes();
    handleSortByMenuClose();
  }

  const handleSortByDislikes = () => {
    store.sortByDislikes();
    handleSortByMenuClose();
  }

  function handleKeyPress(event) {
    if (event.code === "Enter") {
      const searchPhrase = event.target.value;
      store.search(searchPhrase);
    }
  }

  const menu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id='primary-search-account-menu'
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleSortByMenuClose}
    >
      <MenuItem onClick={handleSortByNewest}>Publish Date (Newest)</MenuItem>
      <MenuItem onClick={handleSortByOldest}>Publish Date (Oldest)</MenuItem>
      <MenuItem onClick={handleSortByViews}>Views</MenuItem>
      <MenuItem onClick={handleSortByLikes}>Likes</MenuItem>
      <MenuItem onClick={handleSortByDislikes}>Dislikes</MenuItem>
    </Menu>
  );

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
            onKeyPress={handleKeyPress}
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
            <IconButton 
              color="inherit" 
              aria-label="sort by"
              component="span"
              onClick={handleSortByMenuOpen}
            >
              <SortIcon fontSize="large"/>
            </IconButton>    
        </Toolbar>
      </AppBar>
      {
        menu
      }
    </Box>
  );
}