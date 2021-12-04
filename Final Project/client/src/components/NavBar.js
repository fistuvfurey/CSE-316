import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import FunctionsIcon from '@mui/icons-material/Functions';
import SortIcon from '@mui/icons-material/Sort';
import { TextField } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

function handleHomeButton(event, id) {
  event.stopPropagation();
}

function handleAllListsButton(event, id) {
  event.stopPropagation();
}

function handleUsersListsButtion(event, id) {
  event.stopPropagation();
}

function handleCommunityListsButton(event, id) {
  event.stopPropagation();
}

export default function NavBar() {
  return (
    <Box >
      <AppBar position="static" sx={{ boxShadow: 0 }}>
        <Toolbar>
        <IconButton color="inherit" aria-label="your lists" component="span">
            <HomeIcon fontSize="large"/>
        </IconButton>
        <IconButton color="inherit" aria-label="all lists" component="span">
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