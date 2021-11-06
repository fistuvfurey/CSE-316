import { useContext } from 'react';
import { GlobalStoreContext } from '../store';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function DeleteModal() {

const { store } = useContext(GlobalStoreContext);

  return (
      <Modal
        id="delete-modal"
        open={true}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Delete { store.listMarkedForDeletion.name } Top 5 List?
          </Typography>
          <Stack spacing={2} direction="row">
            <Button 
              variant="contained"
              onClick={store.deleteMarkedList}
            >Confirm
          </Button>
            <Button
              variant="contained"
              onClick={store.unmarkListForDeletion}
            >Cancel
            </Button>
          </Stack>
        </Box>
      </Modal>
  );
}