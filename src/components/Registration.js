import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, Paper, TextField, Grid, Typography, CircularProgress
} from '@mui/material';
import {updateClient} from '../apiService'
const Registration = () => {
  const [adminCode, setAdminCode] = useState('');
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    company: '',
    contactNumber: '',
    email: '',
    password: '',
    vapiAccessToken: '',
    twilioPhoneNumber: '',
    twilioSid: '',
    twilioAuthToken: ''
  });

  const hardcodedAdminCode = 'admin123';
  const navigate = useNavigate();

  const handleAdminCodeSubmit = (event) => {
    event.preventDefault();
    if (adminCode === hardcodedAdminCode) {
      setIsCodeValid(true);
    } else {
      alert('Invalid admin code');
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await updateClient(formData);  // Use your API service
      alert('Client created successfully!');
      navigate('login');
    } catch (error) {
      console.error('Error creating client:', error);
      alert('Failed to create client.');
    } finally {
      setLoading(false);
    }
  };

  if (!isCodeValid) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh'
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
          <Typography variant="h4" gutterBottom>Admin Code</Typography>
          <form onSubmit={handleAdminCodeSubmit}>
            <Grid container spacing={2} direction="column">
              <Grid item xs={12}>
                <TextField
                  label="Admin Code"
                  type="password"
                  fullWidth
                  required
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" fullWidth variant="contained" color="primary">
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
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
        minHeight: '100vh'
      }}
    >
      <Paper
        elevation={2}
        sx={{
          padding: 3,
          width: '100%',
          maxWidth: 600,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Typography variant="h4" gutterBottom>Client Registration</Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Name"
                  fullWidth
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Address"
                  fullWidth
                  required
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Company"
                  fullWidth
                  required
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Contact Number"
                  type="number"
                  fullWidth
                  required
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  required
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="VAPI Access Token"
                  fullWidth
                  required
                  name="vapiAccessToken"
                  value={formData.vapiAccessToken}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Twilio Phone Number"
                  fullWidth
                  required
                  name="twilioPhoneNumber"
                  value={formData.twilioPhoneNumber}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Twilio SID"
                  fullWidth
                  required
                  name="twilioSid"
                  value={formData.twilioSid}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Twilio Auth Token"
                  fullWidth
                  required
                  name="twilioAuthToken"
                  value={formData.twilioAuthToken}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" fullWidth variant="contained" color="primary">
                  Register
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Paper>
    </Box>
  );
};

export default Registration;
