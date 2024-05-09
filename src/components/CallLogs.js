import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, MenuItem, FormControl, Select, Box, InputLabel } from '@mui/material';
import { fetchCallLogs } from '../apiService';
import { formatInTimeZone } from 'date-fns-tz';
import { useNavigate } from 'react-router-dom';

function CallLogs() {
    const [callLogs, setCallLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [assistants, setAssistants] = useState([]);
    const [selectedAssistantId, setSelectedAssistantId] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const storedAssistants = JSON.parse(sessionStorage.getItem('assistants'));
        if (storedAssistants && storedAssistants.length > 0) {
            setAssistants(storedAssistants);
            setSelectedAssistantId(storedAssistants[0].id); // Default to first assistant or an empty prompt
        }
    }, []);

    useEffect(() => {
        if (!selectedAssistantId) return;
        setLoading(true);
        const loadCallLogs = async () => {
            try {
                const data = await fetchCallLogs(selectedAssistantId);
                const filteredAndFormattedData = data
                    .filter(log => log.cost > 0.01)
                    .map(log => ({
                        ...log,
                        startedAt: formatZonedTime(log.startedAt),
                        endedAt: formatZonedTime(log.endedAt)
                    }));
                setCallLogs(filteredAndFormattedData);
            } catch (error) {
                console.error('Failed to load call logs:', error);
            } finally {
                setLoading(false);
            }
        };

        loadCallLogs();
    }, [selectedAssistantId]);

    const formatZonedTime = (dateString) => {
        const timeZone = 'Asia/Kolkata'; // GMT+5:30
        return formatInTimeZone(new Date(dateString), timeZone, 'dd-MM-yyyy HH:mm:ss');
    };

    const handleRowClick = (id) => {
        navigate(`/call-details/${id}`);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%', position: 'relative', padding: 2, paddingTop: 3 }}>
    <Box sx={{ position: 'absolute', right: 16, top: 0, zIndex: 1 }}>  
        <FormControl variant="outlined" size="small" sx={{ minWidth: 240 }}>  
            <InputLabel id="assistant-select-label">Select Assistant</InputLabel>
            <Select
                labelId="assistant-select-label"
                value={selectedAssistantId}
                onChange={(e) => setSelectedAssistantId(e.target.value)}
                displayEmpty
                inputProps={{ 'aria-label': 'Select assistant' }}
                label="Select Assistant"  // Added label for better accessibility
            >
                {assistants.map((assistant) => (
                    <MenuItem key={assistant.assistantId} value={assistant.assistantId}>{assistant.assistantId}</MenuItem>
                ))}
            </Select>
        </FormControl>
    </Box>

            <TableContainer component={Paper} sx={{ maxHeight: '80vh', overflow: 'auto', marginTop:  5}}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell align="right">Started At</TableCell>
                            <TableCell align="right">Ended At</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {callLogs.length > 0 ? callLogs.map((log) => (
                            <TableRow key={log.id} hover onClick={() => handleRowClick(log.id)} style={{ cursor: 'pointer' }}>
                                <TableCell component="th" scope="row">{log.id}</TableCell>
                                <TableCell>{log.type}</TableCell>
                                <TableCell align="right">{log.startedAt}</TableCell>
                                <TableCell align="right">{log.endedAt}</TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center">No call logs found</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default CallLogs;
