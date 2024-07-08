import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Modal, CircularProgress, Select, MenuItem, InputLabel, FormControl, IconButton, Divider, Checkbox, FormControlLabel } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import QuestionMarkIcon from '@mui/icons-material/Help';
import { makeExoCall, createUser, getCallReports, fetchCallDetailsById, updateUser, getCallAgainData } from '../apiService';
import Papa from 'papaparse';
import { format } from 'date-fns-tz';

const MakeExoCall = () => {
    const [customers, setCustomers] = useState([{ name: '', number: '' }]);
    const [assistantId, setAssistantId] = useState('');
    const [assistants, setAssistants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState({});
    const [open, setOpen] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [callStatus, setCallStatus] = useState({});
    const [updateStatus, setUpdateStatus] = useState(null);
    const [isPredefined, setIsPredefined] = useState(false);
    const [firstMessage, setFirstMessage] = useState('');
    const [overrideFirstMessage, setOverrideFirstMessage] = useState(false);

    // useEffect(() => {
    //     const storedAssistants = JSON.parse(sessionStorage.getItem('assistants')) || [];
    //     setAssistants(storedAssistants);
    // }, []);

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

    // const handleAssistantChange = (e) => {
    //     setAssistantId(e.target.value);
    // };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadProgress(0);
            const newCustomers = [];
            let rowCount = 0;
            const CHUNK_SIZE = 500; // Adjust this value as needed

            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                chunkSize: CHUNK_SIZE,
                chunk: (results, parser) => {
                    newCustomers.push(...results.data.map(row => ({ name: row.CustomerName, number: '' + row.PhoneNumber })));
                    rowCount += results.data.length;
                    setUploadProgress((rowCount / results.meta.cursor) * 100);
                },
                complete: () => {
                    setCustomers(prevCustomers => {
                        const updatedCustomers = prevCustomers[0].name === '' && prevCustomers[0].number === '' ? [] : prevCustomers;
                        return [...updatedCustomers, ...newCustomers];
                    });
                    setUploadProgress(100);
                },
                error: (error) => {
                    console.error('Error parsing CSV file:', error);
                    setUploadProgress(0);
                }
            });
        }
    };

    const handleCallClick = async () => {
        setLoading(true);
        const newCallStatus = customers.reduce((acc, customer) => {
            acc[customer.number] = 'waiting';
            return acc;
        }, {});
        setCallStatus(newCallStatus);
    
        const updatedCallStatus = { ...newCallStatus }; // Define updatedCallStatus here
    
        try {
            const results = await Promise.allSettled(
                customers.map(customer => makeExoCall(customer))
            );
            const responses = {};
            const formattedResponses = [];
            const clientId = JSON.parse(sessionStorage.getItem('user'))._id;
    
            results.forEach((result, index) => {
                const customer = customers[index];
                const customerResponse = {
                    customer,
                    status: result.status,
                    value: result.value,
                    reason: result.reason
                };
                responses[customer.number] = customerResponse;
                let callAgain = false;
                if (result.status === "rejected") {
                    callAgain = true;
                }
    
                const now = new Date();
                const calledOn = format(now, 'yyyy-MM-dd HH:mm:ssXXX', { timeZone: 'Asia/Kolkata' });
    
                formattedResponses.push({
                    _id: customer._id, // Keep _id from predefined data
                    number: customer.number,
                    name: customer.name,
                    status: result.status,
                    callAgain: callAgain,
                    reason: result.reason?.message || null,
                    id: result.value?.id || null,
                    clientId: clientId,
                    calledOn: calledOn
                });
    
                if (result.status === 'fulfilled') {
                    updatedCallStatus[customer.number] = 'success';
                } else {
                    updatedCallStatus[customer.number] = 'failed';
                }
            });
            setResponse(responses);
            setCallStatus(updatedCallStatus);
            setOpen(true);
    
            console.log("Detailed Response Status for all users:", formattedResponses);
    
            // if (isPredefined) {
            //     await updateUser(formattedResponses);
            // } else {
            //     await createUser(formattedResponses);
            // }
        } catch (error) {
            console.error('Failed to make calls:', error);
            setResponse([{ error: 'Failed to make calls' }]);
            setOpen(true);
        } finally {
            setLoading(false);
        }
    };
    

    // const handleFetchAndMergeCallDetails = async () => {
    //     setLoading(true);
    //     try {
    //         const clientId = JSON.parse(sessionStorage.getItem('user'))._id;
    //         const callReports = await getCallReports(clientId);
    //         const filteredReports = callReports.filter(report => report.id && !report.startedAt);
    //         console.log(filteredReports);

    //         const mergedReports = await Promise.all(filteredReports.map(async (report) => {
    //             try {
    //                 const callDetails = await fetchCallDetailsById(report.id);
    //                 return {
    //                     ...report,
    //                     assistantId: callDetails.assistantId,
    //                     startedAt: callDetails.startedAt,
    //                     endedAt: callDetails.endedAt,
    //                     recordingUrl: callDetails.recordingUrl,
    //                     summary: callDetails.summary,
    //                     cost: callDetails.cost,
    //                     callingNumber: callDetails.phoneNumber.twilioPhoneNumber,
    //                     endedReason: callDetails.endedReason,
    //                 };
    //             } catch (error) {
    //                 console.error(`Failed to fetch details for report ID ${report.id}:`, error);
    //                 return null;
    //             }
    //         }));

    //         const successfulMergedReports = mergedReports.filter(report => report !== null);
    //         console.log("Merged Reports:", successfulMergedReports);

    //         if (successfulMergedReports.length > 0) {
    //             await updateUser(successfulMergedReports);
    //             setUpdateStatus('success');
    //         } else {
    //             setUpdateStatus('no_data');
    //         }
    //     } catch (error) {
    //         console.error('Failed to fetch and merge call details:', error);
    //         setUpdateStatus('error');
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // const handlePredefinedData = async () => {
    //     try {
    //         const clientId = JSON.parse(sessionStorage.getItem('user'))._id;
    //         const predefinedData = await getCallAgainData(clientId);
    //         if (predefinedData && predefinedData.length > 0) {
    //             const mappedData = predefinedData.map(data => ({
    //                 _id: data._id,
    //                 name: data.name,
    //                 number: data.number
    //             }));
    //             setCustomers(mappedData);
    //             setIsPredefined(true);
    //         }
    //     } catch (error) {
    //         console.error('Failed to fetch predefined data:', error);
    //     }
    // };

    const handleClose = () => setOpen(false);

    const getStatusIcon = (status) => {
        if (status === 'waiting') return <QuestionMarkIcon color="action" />;
        if (status === 'success') return <CheckCircleIcon color="success" />;
        if (status === 'failed') return <ErrorIcon color="error" />;
        return <QuestionMarkIcon color="action" />;
    };

    return (
        <Box sx={{ width: '100%', maxWidth: 600, margin: 'auto', mt: 5 }}>
            <Typography variant="h4" component="h2">Make Call from Indian Number</Typography>
            {/* <Button variant="contained" color="primary" onClick={handleFetchAndMergeCallDetails} sx={{ mb: 2 }}>
                Fetch and Merge Call Details
            </Button> */}
            {/* {loading && <CircularProgress />}
            {updateStatus === 'success' && <Typography variant="body1" color="success">Call details updated successfully!</Typography>}
            {updateStatus === 'error' && <Typography variant="body1" color="error">Failed to update call details.</Typography>} */}
            {/* <FormControl fullWidth sx={{ my: 2 }}>
                <InputLabel>Assistant</InputLabel>
                <Select
                    value={assistantId}
                    onChange={handleAssistantChange}
                    label="Assistant"
                >
                    <MenuItem value="Default">Default</MenuItem>
                    {assistants.map((assistant) => (
                        <MenuItem key={assistant._id} value={assistant._id}>
                            {assistant.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl> */}
            {/* <FormControlLabel
                control={<Checkbox checked={overrideFirstMessage} onChange={() => setOverrideFirstMessage(!overrideFirstMessage)} />}
                label="Override First Message"
            />
            {overrideFirstMessage && (
                <TextField
                    label="First Message"
                    value={firstMessage}
                    onChange={(e) => setFirstMessage(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                />
            )} */}
            <Typography>{customers.length}</Typography>
            <Box sx={{ maxHeight: 300, overflowY: 'auto', my: 2, border: '1px solid #ccc', padding: 2 }}>
                {customers.map((customer, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
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
                        {getStatusIcon(callStatus[customer.number])}
                        <IconButton onClick={addCustomer} sx={{ ml: 2 }}>
                            <AddIcon />
                        </IconButton>
                        {customers.length > 1 && (
                            <IconButton onClick={() => removeCustomer(index)}>
                                <RemoveIcon />
                            </IconButton>
                        )}
                    </Box>
                ))}
            </Box>

            <Box sx={{ my: 2 }}>
                <Button variant="contained" component="label">
                    Upload CSV
                    <input type="file" accept=".csv" hidden onChange={handleFileUpload} />
                </Button>
                
                {/* <Button variant="contained" color="secondary" onClick={handlePredefinedData} sx={{ ml:2 }}>
                    Fetch unreceived calls
                </Button> */}
                {uploadProgress > 0 && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        Upload Progress: {uploadProgress}%
                    </Typography>
                )}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCallClick}
                        disabled={ customers.some(customer => !customer.name || !customer.number)}
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
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" component="h3">Waiting</Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                        {Object.keys(callStatus).filter(key => callStatus[key] === 'waiting').length > 0 ?
                            Object.keys(callStatus).filter(key => callStatus[key] === 'waiting').map(key => 
                                response[key]?.customer ? `${response[key].customer.name} (${response[key].customer.number})` : ''
                            ).join(', ') : 'None'}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" component="h3">Success</Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                        {Object.keys(callStatus).filter(key => callStatus[key] === 'success').length > 0 ?
                            Object.keys(callStatus).filter(key => callStatus[key] === 'success').map(key => 
                                response[key]?.customer ? `${response[key].customer.name} (${response[key].customer.number})` : ''
                            ).join(', ') : 'None'}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" component="h3">Failed</Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                        {Object.keys(callStatus).filter(key => callStatus[key] === 'failed').length > 0 ?
                            Object.keys(callStatus).filter(key => callStatus[key] === 'failed').map(key => 
                                response[key]?.customer ? `${response[key].customer.name} (${response[key].customer.number})` : ''
                            ).join(', ') : 'None'}
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

export default MakeExoCall;
