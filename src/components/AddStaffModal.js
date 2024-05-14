import React, { useState, useEffect } from 'react';
import { Box, Button, Modal, TextField, Typography, IconButton, Select, MenuItem, InputLabel, FormControl, CircularProgress } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const AddStaffModal = ({ open, handleClose, handleAddStaff }) => {
    const [newStaff, setNewStaff] = useState({
        name: '',
        assistantId: '',
        email: '',
        password: '',
        clientId: ''
    });
    const [assistants, setAssistants] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedAssistants = JSON.parse(sessionStorage.getItem('assistants')) || [];
        setAssistants(storedAssistants);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewStaff(prevState => ({ ...prevState, [name]: value }));
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleAddClick = async () => {
        setLoading(true);
        await handleAddStaff(newStaff);
        setLoading(false);
        handleClose();
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{ 
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4
            }}>
                <Typography variant="h6" component="h2">Add New Staff</Typography>
                <TextField
                    fullWidth
                    label="Staff Name"
                    name="name"
                    value={newStaff.name}
                    onChange={handleChange}
                    sx={{ my: 2 }}
                />
                <FormControl fullWidth sx={{ my: 2 }}>
                    <InputLabel>Assistant</InputLabel>
                    <Select
                        name="assistantId"
                        value={newStaff.assistantId}
                        onChange={handleChange}
                        label="Assistant"
                    >
                        {assistants.map((assistant) => (
                            <MenuItem key={assistant._id} value={assistant._id}>
                                {assistant.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={newStaff.email}
                    onChange={handleChange}
                    sx={{ my: 2 }}
                />
                <Box sx={{ position: 'relative' }}>
                    <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={newStaff.password}
                        onChange={handleChange}
                        sx={{ my: 2 }}
                    />
                    <IconButton
                        onClick={toggleShowPassword}
                        sx={{ position: 'absolute', top: '50%', right: 8, transform: 'translateY(-50%)' }}
                    >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    {loading ? (
                        <CircularProgress />
                    ) : (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAddClick}
                        >
                            Add Staff
                        </Button>
                    )}
                </Box>
            </Box>
        </Modal>
    );
};

export default AddStaffModal;
