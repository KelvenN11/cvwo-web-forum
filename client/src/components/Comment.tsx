import { Box, Typography, IconButton, TextField, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import { api } from '../services/api.tsx';

/*
this is code for comment
there are 2 state of the comment
1. being edited
  for this one I make a small textbox
  and then there are 2 button save and cancel that serves
  its purpose
2. non edited
  for this one I make a small textbox with author and content
  also create an if statement for the user if it is the same
  then add delete and edit button
*/

export const CommentItem = ({ comment, currentUser, onRefresh }: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.body);

  const handleUpdate = async () => {
    await api.updateComment(comment.id, { 
      body: editText, 
      username: currentUser 
    });
    setIsEditing(false);
    onRefresh();
  };

  const handleDelete = async () => {
    await api.deleteComment(comment.id, currentUser);
    onRefresh();
  };

  return (
    <Box sx={{ bgcolor: '#f8f9fa', p: 1, borderRadius: 1, mb: 1 }}>
      {isEditing ? (
        <Box>
          <TextField 
            fullWidth size="small" 
            value={editText} 
            onChange={(e) => setEditText(e.target.value)} 
          />
          <Button size="small" onClick={handleUpdate}>Save</Button>
          <Button size="small" onClick={() => setIsEditing(false)}>Cancel</Button>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="caption" fontWeight="bold">{comment.username}</Typography>
            <Typography variant="body2">{comment.body}</Typography>
          </Box>
          
          {currentUser === comment.username && (
            <Box>
              <IconButton size="small" onClick={() => setIsEditing(true)}>
                <EditIcon fontSize="inherit" />
              </IconButton>
              <IconButton size="small" color="error" onClick={handleDelete}>
                <DeleteIcon fontSize="inherit" />
              </IconButton>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};