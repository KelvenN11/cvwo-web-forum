import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, Button, Box 
} from '@mui/material';
import { useState } from 'react';
import { api } from '../services/api';

export const CreatePostDialog = ({ open, handleClose, currentUser, onRefresh }: any) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    if (!title || !content) return;

    await api.createPost({
      title,
      content,
      username: currentUser
    });

    // Reset fields and close
    setTitle("");
    setContent("");
    handleClose();
    onRefresh(); // Refresh the list so the new post appears!
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 'bold' }}>Create New Post</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            label="What's on your mind?"
            fullWidth
            multiline
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} color="inherit">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Post</Button>
      </DialogActions>
    </Dialog>
  );
};