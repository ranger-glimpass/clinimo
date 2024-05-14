import React, { useEffect, useState } from 'react';
import {
    Box, Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, IconButton, Typography, TextField
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { createStaff, getStaffByClientId } from '../apiService';
import AddStaffModal from './AddStaffModal';

function Staff() {
    const [staff, setStaff] = useState([]);
    const [assistants, setAssistants] = useState([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showPassword, setShowPassword] = useState({});

    useEffect(() => {
        const fetchStaff = async () => {
            if(!sessionStorage.getItem('staff')){
            const user = JSON.parse(sessionStorage.getItem('user'));
            if (user) {
                const staffData = await getStaffByClientId(user._id);
                setStaff(staffData);
                sessionStorage.setItem('staff', JSON.stringify(staffData));
            }
            setLoading(false);
        }
        else{
            setStaff(JSON.parse(sessionStorage.getItem('staff')));
            setLoading(false);
        }
        };

        const fetchAssistants = () => {
            const storedAssistants = JSON.parse(sessionStorage.getItem('assistants')) || [];
            setAssistants(storedAssistants);
        };

        fetchStaff();
        fetchAssistants();
    }, []);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleAddStaff = async (newStaff) => {
        try {
            const user = JSON.parse(sessionStorage.getItem('user'));
            if (user) {
                newStaff.clientId = user._id;
                const addedStaff = await createStaff(newStaff);
                setStaff(prevStaff => [...prevStaff, addedStaff]);
                sessionStorage.setItem('staff', JSON.stringify([...staff, addedStaff]));
            }
        } catch (error) {
            console.error('Failed to add staff:', error);
        }
    };

    const toggleShowPassword = (id) => {
        setShowPassword((prevState) => ({
            ...prevState,
            [id]: !prevState[id]
        }));
    };

    const getAssistantName = (id) => {
        const assistant = assistants.find((assistant) => assistant._id === id);
        return assistant ? assistant.name : 'Unknown Assistant';
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Grid container justifyContent="flex-end" sx={{ marginBottom: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleOpen}
                >
                    Add Staff
                </Button>
            </Grid>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Staff Name</TableCell>
                            <TableCell>Assistant Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Password</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : staff.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    <Typography variant="h6" component="h2">
                                        No active staff
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            staff.map((staffMember) => (
                                <TableRow key={staffMember._id}>
                                    <TableCell>{staffMember.name}</TableCell>
                                    <TableCell>{getAssistantName(staffMember.assistantId)}</TableCell>
                                    <TableCell>{staffMember.email}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <TextField
                                                type={showPassword[staffMember._id] ? 'text' : 'password'}
                                                value={staffMember.password}
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                                sx={{ mr: 1 }}
                                            />
                                            <IconButton
                                                onClick={() => toggleShowPassword(staffMember._id)}
                                            >
                                                {showPassword[staffMember._id] ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <AddStaffModal open={open} handleClose={handleClose} handleAddStaff={handleAddStaff} />
        </Box>
    );
}

export default Staff;
