import { useState, useEffect } from 'react';

// MUI Core Components
import { 
  Card, 
  CardContent, 
  Typography, 
  IconButton, 
  TextField, 
  Button, 
  Box, 
  Divider, 
  List 
} from '@mui/material';

// MUI Icons
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// Your Files
import { api } from '../services/api.tsx';
import { CommentItem } from './Comment.tsx'; // Check if your file is 'comment' or 'Comment'

interface PostCardProps {
  post: {
    id: number;
    title: string;
    content: string;
    username: string;
  };
  currentUser: string | null;
  onRefresh: () => void;
}

export const PostCard = ({ post, currentUser, onRefresh }: PostCardProps) => {
  // Post Edit State
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editContent, setEditContent] = useState(post.content);

  // Comments State
  const [comments, setComments] = useState<any[]>([]);
  const [newCommentBody, setNewCommentBody] = useState("");

  // --- 1. Comment Actions ---
  const loadComments = async () => {
    try {
      const data = await api.getComments(post.id);
      setComments(data || []);
    } catch (err) {
      console.error("Failed to load comments", err);
    }
  };

  useEffect(() => {
    loadComments();
  }, [post.id]);

  const handleAddComment = async () => {
    if (!newCommentBody.trim() || !currentUser) return;
    await api.createComment({
      post_id: post.id,
      username: currentUser,
      body: newCommentBody
    });
    setNewCommentBody("");
    loadComments(); // Refresh comments list
  };

  // --- 2. Post Actions ---
  const handleUpdatePost = async () => {
    if (!currentUser) return;
    await api.updatePost(post.id, {
      title: editTitle,
      content: editContent,
      username: currentUser
    });
    setIsEditingPost(false);
    onRefresh(); // Refresh main feed
  };

  const handleDeletePost = async () => {
    if (!currentUser) return;
    if (window.confirm("Are you sure you want to delete this post?")) {
      await api.deletePost(post.id, currentUser);
      onRefresh();
    }
  };

  return (
    <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 3 }}>
      <CardContent>
        {isEditingPost ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField 
              label="Title" 
              fullWidth 
              value={editTitle} 
              onChange={(e) => setEditTitle(e.target.value)} 
            />
            <TextField 
              label="Content" 
              fullWidth 
              multiline 
              rows={3} 
              value={editContent} 
              onChange={(e) => setEditContent(e.target.value)} 
            />
            <Box>
              <Button variant="contained" onClick={handleUpdatePost} sx={{ mr: 1 }}>Save</Button>
              <Button onClick={() => setIsEditingPost(false)}>Cancel</Button>
            </Box>
          </Box>
        ) : (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{post.title}</Typography>
                <Typography variant="caption" color="text.secondary">Posted by {post.username}</Typography>
              </Box>
              
              {currentUser === post.username && (
                <Box>
                  <IconButton onClick={() => setIsEditingPost(true)} color="primary"><EditIcon /></IconButton>
                  <IconButton onClick={handleDeletePost} color="error"><DeleteIcon /></IconButton>
                </Box>
              )}
            </Box>
            <Typography variant="body1" sx={{ mt: 2 }}>{post.content}</Typography>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        {/* --- 3. Comments Section --- */}
        <Typography variant="subtitle2" color="primary" sx={{ mb: 1 }}>Comments</Typography>
        
        <List sx={{ maxHeight: 300, overflow: 'auto' }}>
          {comments.length > 0 ? (
            comments.map((c) => (
              <CommentItem 
                key={c.id} 
                comment={c} 
                currentUser={currentUser} 
                onRefresh={loadComments} 
              />
            ))
          ) : (
            <Typography variant="caption" color="text.secondary">No comments yet.</Typography>
          )}
        </List>

        {/* Add Comment Input */}
        {currentUser && (
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <TextField 
              fullWidth 
              size="small" 
              placeholder="Add a comment..." 
              value={newCommentBody} 
              onChange={(e) => setNewCommentBody(e.target.value)}
            />
            <Button variant="outlined" onClick={handleAddComment}>Reply</Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};