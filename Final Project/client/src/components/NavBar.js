import { useContext, useState } from 'react';
import { GlobalStoreContext } from '../store';
import AuthContext from '../auth';
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
  const { auth } = useContext(AuthContext);
  
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  
  const handleClickHomeButton = () => {
    store.button = "HOME";
    store.loadHome();
  };

  const handleClickAllListsButton = () => {
    store.button = "ALL_LISTS";
    if (auth.isGuest) {
      store.loadGuestAllLists();
    }
    else {
      store.loadAllLists();
    }
  };

  const handleClickAllUserListsButton = () => {
    store.button = "ALL_USER_LISTS";
    store.setAllUserLists();
  };

  const handleClickCommunityListsButton = () => {
    store.button = "COMMUNITY"
    store.loadCommunityLists();
  }

  const handleSortByMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSortByMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSortByNewest = () => {
    if (store.button === "COMMUNITY") {
      store.sortCommunityListsByNewest();
    }
    else {
      store.sortByNewest();
    }
    handleSortByMenuClose();
  }

  const handleSortByOldest = () => {
    if (store.button === "COMMUNITY") {
      store.sortCommunityListsByOldest();
    }
    else {
      store.sortByOldest();
    }
    handleSortByMenuClose();
  }

  const handleSortByViews = () => {
    if (store.button === "COMMUNITY") {
      store.sortCommunityListsByViews();
    }
    else {
      store.sortByViews();
    }
    handleSortByMenuClose();
  }

  const handleSortByLikes = () => {
    if (store.button === "COMMUNITY") {
      store.sortCommunityListsByLikes();
    }
    else {
      store.sortByLikes();
    }
    handleSortByMenuClose();
  }

  const handleSortByDislikes = () => {
    if (store.button === "COMMUNITY") {
      store.sortCommunityListsByDislikes();
    }
    else {
      store.sortByDislikes();
    }
    handleSortByMenuClose();
  }

  function handleKeyPress(event) {
    if (event.code === "Enter") {
      const searchPhrase = event.target.value;
      store.searchBarQuery = searchPhrase;
      store.search(searchPhrase);
    }
  }

  let homeButton = (
    <IconButton color="inherit" aria-label="your lists" component="span" onClick={handleClickHomeButton}>
      <HomeIcon fontSize="large"/>
    </IconButton>
  );
  if (auth.isGuest) {
    homeButton = (
      <IconButton disabled color="inherit" aria-label="your lists" component="span" onClick={handleClickHomeButton}>
        <HomeIcon fontSize="large"/>
      </IconButton>
    );
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
        {homeButton}
        <IconButton color="inherit" aria-label="all lists" component="span" onClick={handleClickAllListsButton}>
          <PeopleIcon fontSize="large"/>
        </IconButton>
        <IconButton color="inherit" aria-label="user lists" component="span" onClick={handleClickAllUserListsButton}>
          <PersonIcon fontSize="large"/>
        </IconButton>
        <IconButton color="inherit" aria-label="community lists" component="span" onClick={handleClickCommunityListsButton}>
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