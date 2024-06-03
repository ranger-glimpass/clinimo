import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Paper, Avatar } from '@mui/material';
import { updateClient } from '../apiService'; // Adjust based on your actual import

function Account() {
    const [userData, setUserData] = useState({
        _id: '',
        name: '',
        email: '',
        company: '',
        address: '',
        contactNumber: '',
        password: '',
        imageUrl: '', // Assuming there's an imageUrl field
        vapiApi: '',
        assistantId: '',
        twilioNumber: '',
        twilioAccountSid: '',
        twilioAuthToken: ''
    });
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        // Fetch user data from sessionStorage
        const user = sessionStorage.getItem('user');
        if (user) {
            setUserData(JSON.parse(user));
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
    };

    const saveUpdates = async () => {
        if (window.confirm("Are you sure you want to save these changes?")) {
            try {
                const response = await updateClient(userData);
                console.log('Update response:', response);
                alert('Profile updated successfully!');
                setEditMode(false); // Disable edit mode after successful update
            } catch (error) {
                console.error('Failed to update profile:', error);
                alert('Failed to update profile.');
            }
        }
    };

    return (
        <Box sx={{ position: 'relative', p: 1 }}>
            <Typography variant="caption" sx={{ position: 'absolute', top: 0, right: 0 }}>
                Client ID: {userData._id}
            </Typography>
            <Paper sx={{ padding: 2, margin: 2, textAlign: 'center' }}>
                <Avatar
                    alt="Profile Picture"
                    src={userData.imageUrl}
                    sx={{ width: 56, height: 56, margin: '10px auto' }}
                />
                {editMode && (
                    <Button variant="contained" component="label" sx={{ mb: 2 }}>
                        Upload Picture
                        <input
                            type="file"
                            hidden
                            onChange={(event) => {
                                // Handle image file upload logic here
                            }}
                        />
                    </Button>
                )}
                <Typography variant="h6">Account Settings</Typography>
                <Box component="form" noValidate autoComplete="off" sx={{ mt: 1 }}>
                    <TextField
                        label="Name"
                        variant="outlined"
                        fullWidth
                        name="name"
                        value={userData.name}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        name="email"
                        value={userData.email}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Company"
                        variant="outlined"
                        fullWidth
                        name="company"
                        value={userData.company}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Address"
                        variant="outlined"
                        fullWidth
                        name="address"
                        value={userData.address}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Contact Number"
                        variant="outlined"
                        fullWidth
                        name="contactNumber"
                        value={userData.contactNumber}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        name="password"
                        value={userData.password}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Vapi API"
                        variant="outlined"
                        fullWidth
                        name="vapiApi"
                        value={userData.vapiApi}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Assistant ID"
                        variant="outlined"
                        fullWidth
                        name="assistantId"
                        value={userData.assistantId}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Twilio Number"
                        variant="outlined"
                        fullWidth
                        name="twilioNumber"
                        value={userData.twilioNumber}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Twilio Account SID"
                        variant="outlined"
                        fullWidth
                        name="twilioAccountSid"
                        value={userData.twilioAccountSid}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Twilio Auth Token"
                        variant="outlined"
                        fullWidth
                        name="twilioAuthToken"
                        value={userData.twilioAuthToken}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        sx={{ mb: 2 }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setEditMode(!editMode)}
                        sx={{ mr: 2 }}
                    >
                        {editMode ? 'Cancel' : 'Edit'}
                    </Button>
                    {editMode && (
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={saveUpdates}
                        >
                            Save Changes
                        </Button>
                    )}
                </Box>
            </Paper>
        </Box>
    );
}

export default Account;
