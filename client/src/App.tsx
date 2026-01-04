import React, { useEffect, useState } from 'react';

// MUI Core Components
import { 
  Container, 
  Box, 
  Fab, 
  Typography, 
  CircularProgress 
} from '@mui/material';

// MUI Icons
import AddIcon from '@mui/icons-material/Add';

// Your Custom Components
import { Header } from './components/Header.tsx';
import { PostCard } from './components/PostCard.tsx';
import { CreatePostDialog } from './components/CreatePostDialog.tsx';

// Your API Service
import { api } from './services/api';


function App() {
    const [user, setUser] = useState<string | null>(localStorage.getItem("username"));
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [usernameInput, setUsernameInput] = useState("");

    // Function to fetch data from Go backend
    const refreshData = async () => {
        setLoading(true);
        try {
        const data = await api.getPosts();
        setPosts(data || []);
        } catch (err) {
        console.error("Failed to fetch posts:", err);
        } finally {
        setLoading(false);
        }
    };

    // Load posts on startup
    useEffect(() => {
        refreshData();
    }, []);

    const handleLogin = (username: string | null) => {
        alert("Button clicked! Username is: " + username);
        if (username) {
            api.login(username).then(() => {
            setUser(username);
            localStorage.setItem("username", username);
            setUsernameInput(""); // <--- Add this to clear the box
            });
        } else {
            setUser(null);
            localStorage.removeItem("username");
        }
    };

    return (
        <Box sx={{ bgcolor: '#f5f7f9', minHeight: '100vh' }}>
        <Header 
            user={user} 
            onLogin={handleLogin} 
            usernameInput={usernameInput} 
            setUsernameInput={setUsernameInput} 
        />

        {/* This Container centers your feed! */}
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', textAlign: 'center' }}>
            Community Feed
            </Typography>

            {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>
            ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {posts.map((post: any) => (
                <PostCard key={post.id} post={post} currentUser={user} onRefresh={refreshData} />
                ))}
            </Box>
            )}
        </Container>

        {/* THE ADD POST BUTTON: Only shows if you are logged in */}
        {user && (
            <Fab 
            color="primary" 
            aria-label="add" 
            onClick={() => setIsDialogOpen(true)}
            sx={{ position: 'fixed', bottom: 32, right: 32 }}
            >
            <AddIcon />
            </Fab>
        )}

        <CreatePostDialog 
            open={isDialogOpen} 
            handleClose={() => setIsDialogOpen(false)} 
            currentUser={user} 
            onRefresh={refreshData} 
        />
        </Box>
    );
}

export default App;