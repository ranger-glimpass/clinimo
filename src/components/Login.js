import React, { useEffect, useState } from 'react';
import {
  Box, Button, Paper, TextField, Grid, Typography, Link, CircularProgress, Radio, RadioGroup, FormControlLabel
} from '@mui/material';
import { loginUser, fetchAssistants } from '../apiService';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [userType, setUserType] = useState('staff');  // Default to 'staff'
    
    const navigate = useNavigate();

    useEffect(() => {
        if (sessionStorage.getItem("user") !== null) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleLogin = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const data = await loginUser(email, password, userType);  // Pass userType to loginUser
            if (data.length === 0) {
                setError('Invalid email and password');
                setLoading(false);
            } else {
                sessionStorage.setItem('user', JSON.stringify(data));
                console.log('Login successful');
                await fetchAndStoreAssistants(data._id);
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Login failed:', error.message || 'An error occurred');
            setError(error.message || 'Failed to login');
            setLoading(false);
        }
    };

    const fetchAndStoreAssistants = async (clientId) => {
        try {
            const assistants = await fetchAssistants(clientId);
            sessionStorage.setItem('assistants', JSON.stringify(assistants.data));
        } catch (error) {
            console.error('Failed to fetch assistants:', error);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Gathering relevant information...</Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
            }}
        >
            <Paper
                elevation={2}
                sx={{
                    padding: 3,
                    width: '100%',
                    maxWidth: 360,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                <Typography variant="h4" gutterBottom>Login</Typography>
                <RadioGroup row aria-label="user type" name="userType" value={userType} onChange={(e) => setUserType(e.target.value)}
                    sx={{ mb: 2, justifyContent: 'center' }}>
                    <FormControlLabel value="admin" control={<Radio />} label="Admin" />
                    <FormControlLabel value="staff" control={<Radio />} label="Staff" />
                </RadioGroup>
                <form onSubmit={handleLogin}>
                    <Grid container spacing={2} direction="column">
                        <Grid item xs={12}>
                            <TextField
                                label="Email Address"
                                type="email"
                                fullWidth
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Password"
                                type="password"
                                fullWidth
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                variant="outlined"
                            />
                        </Grid>
                        {error && (
                            <Grid item xs={12}>
                                <Typography color="error">{error}</Typography>
                            </Grid>
                        )}
                        <Grid item xs={12} container justifyContent="flex-end">
                            <Link href="#" variant="body2" onClick={() => console.log('Forgot Password?')}>
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item xs={12}>
                            <Button type="submit" fullWidth variant="contained" color="primary">
                                Login
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
}

export default Login;
