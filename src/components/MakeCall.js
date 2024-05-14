import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Modal, CircularProgress, Select, MenuItem, InputLabel, FormControl, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { makeCall } from '../apiService';
import Papa from 'papaparse';

const MakeCall = () => {
    const [customers, setCustomers] = useState([{ name: '', number: '' }]);
    const [assistantId, setAssistantId] = useState('');
    const [assistants, setAssistants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const storedAssistants = JSON.parse(sessionStorage.getItem('assistants')) || [];
        setAssistants(storedAssistants);
    }, []);

    const handleCustomerChange = (index, e) => {
        const { name, value } = e.target;
        setCustomers(prevCustomers => {
            const updatedCustomers = [...prevCustomers];
            updatedCustomers[index] = { ...updatedCustomers[index], [name]: value };
            return updatedCustomers;
        });
    };

    const addCustomer = () => {
        setCustomers([...customers, { name: '', number: '' }]);
    };

    const removeCustomer = (index) => {
        setCustomers(prevCustomers => prevCustomers.filter((_, i) => i !== index));
    };

    const handleAssistantChange = (e) => {
        setAssistantId(e.target.value);
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            Papa.parse(file, {
                header: true,
                complete: (result) => {
                    setCustomers(result.data.map(row => ({ name: row.CustomerName, number: row.PhoneNumber })));
                },
                skipEmptyLines: true
            });
        }
    };

    const handleCallClick = async () => {
        setLoading(true);
        try {
            const results = await Promise.allSettled(
                customers.map(customer => makeCall(customer, assistantId))
            );
            const responses = results.map((result, index) => ({
                customer: customers[index],
                status: result.status,
                value: result.value,
                reason: result.reason
            }));
            setResponse(responses);
            setOpen(true);
        } catch (error) {
            console.error('Failed to make calls:', error);
            setResponse([{ error: 'Failed to make calls' }]);
            setOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => setOpen(false);

    return (
        <Box sx={{ width: '100%', maxWidth: 600, margin: 'auto', mt: 5 }}>
            <Typography variant="h6" component="h2">Make a Call</Typography>
            <FormControl fullWidth sx={{ my: 2 }}>
                <InputLabel>Assistant</InputLabel>
                <Select
                    value={assistantId}
                    onChange={handleAssistantChange}
                    label="Assistant"
                >
                    {assistants.map((assistant) => (
                        <MenuItem key={assistant._id} value={assistant._id}>
                            {assistant.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {customers.map((customer, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
                    <TextField
                        label="Customer Name"
                        name="name"
                        value={customer.name}
                        onChange={(e) => handleCustomerChange(index, e)}
                        sx={{ mr: 2 }}
                    />
                    <TextField
                        label="Customer Phone Number"
                        name="number"
                        value={customer.number}
                        onChange={(e) => handleCustomerChange(index, e)}
                        sx={{ mr: 2 }}
                    />
                    <IconButton onClick={addCustomer} sx={{ mr: 1 }}>
                        <AddIcon />
                    </IconButton>
                    {customers.length > 1 && (
                        <IconButton onClick={() => removeCustomer(index)}>
                            <RemoveIcon />
                        </IconButton>
                    )}
                </Box>
            ))}

            <Box sx={{ my: 2 }}>
                <Button variant="contained" component="label">
                    Upload CSV
                    <input type="file" accept=".csv" hidden onChange={handleFileUpload} />
                </Button>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCallClick}
                        disabled={!assistantId || customers.some(customer => !customer.name || !customer.number)}
                    >
                        Make Call
                    </Button>
                )}
            </Box>

            <Modal open={open} onClose={handleClose}>
                <Box sx={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4
                }}>
                    <Typography variant="h6" component="h2">Call Response</Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        {response ? JSON.stringify(response, null, 2) : 'No response'}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleClose}
                        sx={{ mt: 2 }}
                    >
                        Close
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
};

export default MakeCall;
