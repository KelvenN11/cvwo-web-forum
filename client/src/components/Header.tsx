import { AppBar, Toolbar, Typography, TextField, Button, Box, Container } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

export const Header = ({ user, onLogin, usernameInput, setUsernameInput }: any) => {
  return (
    <AppBar position="static" color="default" elevation={1} sx={{ bgcolor: 'white' }}>
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
            CVWO_FORUM
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {user ? (
              <>
                {/* --- The Small Textbox (Invisible Border) --- */}
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  bgcolor: '#f0f2f5', // Light grey background
                  px: 1.5, py: 0.5, 
                  borderRadius: 1,
                  border: 'none', // Invisible border
                }}>
                  <PersonIcon fontSize="small" sx={{ mr: 1, color: '#666' }} />
                  <Typography variant="body2" sx={{ fontWeight: 500, color: '#333' }}>
                    {user}
                  </Typography>
                </Box>

                <Button 
                  color="error" 
                  variant="text" // Subtle logout button
                  size="small" 
                  onClick={() => onLogin(null)}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField 
                  size="small" 
                  placeholder="Username" 
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  sx={{ width: 150 }}
                  onKeyPress={(e) => e.key === 'Enter' && onLogin(usernameInput)}
                />
                <Button variant="contained" onClick={() => onLogin(usernameInput)}>
                  Join
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};