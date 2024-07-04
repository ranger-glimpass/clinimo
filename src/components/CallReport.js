import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, ListItemIcon, Divider, TextField, Button, CircularProgress, Dialog, DialogTitle, DialogContent, DialogContentText, ButtonGroup } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import QuestionMarkIcon from '@mui/icons-material/Help';
import { getCallReports } from '../apiService';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const CallReport = () => {
    const [reports, setReports] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredReports, setFilteredReports] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    useEffect(() => {
        const fetchReports = async () => {
            setLoading(true);
            const user = sessionStorage.getItem('user');
            if (user) {
                const clientId = JSON.parse(user)._id;
                try {
                    const storedCallReport = sessionStorage.getItem('callReport');
                    if (storedCallReport && storedCallReport !== '[]') {
                        const parsedReports = JSON.parse(storedCallReport);
                        if (Array.isArray(parsedReports)) {
                            setReports(parsedReports);
                        } else {
                            console.error('Stored call reports are not an array');
                        }
                    } else {
                        const data = await getCallReports(clientId);
                        setReports(data);
                        sessionStorage.setItem('callReport', JSON.stringify(data));
                    }
                } catch (error) {
                    console.error('Failed to fetch call reports:', error);
                }
            } else {
                console.error('No user found in session storage');
            }
            setLoading(false);
        };

        fetchReports();
    }, []);

    useEffect(() => {
        let filtered = Array.isArray(reports) ? reports : [];
        if (searchQuery) {
            filtered = filtered.filter(report =>
                report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                report.number.includes(searchQuery)
            );
        }
        if (startDate && endDate) {
            filtered = filtered.filter(report => {
                const reportDate = new Date(report.calledOn);
                return reportDate >= startDate && reportDate <= endDate;
            });
        }
        if (filter !== 'all') {
            filtered = filtered.filter(report => {
                if (filter === 'fulfilled') return report.status === 'fulfilled';
                if (filter === 'rejected') return report.status === 'rejected';
                if (filter === 'callAgainTrue') return report.callAgain;
                if (filter === 'callAgainFalse') return !report.callAgain;
                if (filter === 'potentialLead') return report.summary && report.summary.toLowerCase().includes('link');
                if (filter === 'voicemail') return report.summary && report.summary.toLowerCase().includes('voicemail');
                if (filter === 'longCalls') return report.cost && report.cost > 0.07;
                return true;
            });
        }

        console.log('Filtered Reports:', filtered); // Add logging to check filtered reports
        setFilteredReports(filtered.slice().reverse().slice(0, 10000)); // reverse for descending order
    }, [searchQuery, filter, reports, startDate, endDate]);

    useEffect(() => {
        if (filter === 'voicemail') {
            const voicemailReports = filteredReports.filter(report => report.summary && report.summary.toLowerCase().includes('voicemail'));
            sessionStorage.setItem('voicemailReports', JSON.stringify(voicemailReports));
        }
    }, [filter, filteredReports]);

    const getStatusIcon = (status) => {
        if (status === 'fulfilled') return <CheckCircleIcon color="success" />;
        if (status === 'rejected') return <ErrorIcon color="error" />;
        return <QuestionMarkIcon color="action" />;
    };

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
    };

    const getCount = (filter) => {
        const validReports = Array.isArray(reports) ? reports : [];
        if (filter === 'fulfilled') return validReports.filter(report => report.status === 'fulfilled').length;
        if (filter === 'rejected') return validReports.filter(report => report.status === 'rejected').length;
        if (filter === 'callAgainTrue') return validReports.filter(report => report.callAgain).length;
        if (filter === 'callAgainFalse') return validReports.filter(report => !report.callAgain).length;
        if (filter === 'potentialLead') return validReports.filter(report => report.summary && report.summary.toLowerCase().includes('link')).length;
        if (filter === 'voicemail') return validReports.filter(report => report.summary && report.summary.toLowerCase().includes('voicemail')).length;
        if (filter === 'longCalls') return validReports.filter(report => report.cost && report.cost > 0.07).length;
        return validReports.length;
    };

    const downloadCSV = () => {
        const xlsx = Papa.unparse(filteredReports);
        const blob = new Blob([xlsx], { type: 'text/xlsx;charset=utf-8;' });
        saveAs(blob, 'call_reports.xlsx');
    };

    const downloadJSON = () => {
        const jsonString = JSON.stringify(filteredReports, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
        saveAs(blob, 'call_reports.json');
    };
    

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ width: '100%', maxWidth: 600, margin: 'auto', mt: 5 }}>
                <Typography variant="h6" component="h2" sx={{ mb: 2 }}>Call Report</Typography>
                <TextField
                    label="Search"
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 2 }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={(date) => setStartDate(date)}
                    renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 2 }} />}
                />
                <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={(date) => setEndDate(date)}
                    renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 2 }} />}
                />
                <ButtonGroup size="small" variant="outlined" sx={{ mb: 2 }}>
                    <Button
                        onClick={() => handleFilterChange('all')}
                        sx={{ backgroundColor: filter === 'all' ? 'primary.main' : 'inherit', color: filter === 'all' ? 'white' : 'inherit' }}
                    >
                        All ({getCount('all')})
                    </Button>
                    <Button
                        onClick={() => handleFilterChange('fulfilled')}
                        sx={{ backgroundColor: filter === 'fulfilled' ? 'primary.main' : 'inherit', color: filter === 'fulfilled' ? 'white' : 'inherit' }}
                    >
                        Fulfilled ({getCount('fulfilled')})
                    </Button>
                    <Button
                        onClick={() => handleFilterChange('rejected')}
                        sx={{ backgroundColor: filter === 'rejected' ? 'primary.main' : 'inherit', color: filter === 'rejected' ? 'white' : 'inherit' }}
                    >
                        Rejected ({getCount('rejected')})
                    </Button>
                    <Button
                        onClick={() => handleFilterChange('callAgainTrue')}
                        sx={{ backgroundColor: filter === 'callAgainTrue' ? 'primary.main' : 'inherit', color: filter === 'callAgainTrue' ? 'white' : 'inherit' }}
                    >
                        Call Again (Yes) ({getCount('callAgainTrue')})
                    </Button>
                    <Button
                        onClick={() => handleFilterChange('callAgainFalse')}
                        sx={{ backgroundColor: filter === 'callAgainFalse' ? 'primary.main' : 'inherit', color: filter === 'callAgainFalse' ? 'white' : 'inherit' }}
                    >
                        Call Again (No) ({getCount('callAgainFalse')})
                    </Button>
                    <Button
                        onClick={() => handleFilterChange('potentialLead')}
                        sx={{ backgroundColor: filter === 'potentialLead' ? 'primary.main' : 'inherit', color: filter === 'potentialLead' ? 'white' : 'inherit' }}
                    >
                        Potential Lead ({getCount('potentialLead')})
                    </Button>
                    <Button
                        onClick={() => handleFilterChange('longCalls')}
                        sx={{ backgroundColor: filter === 'longCalls' ? 'primary.main' : 'inherit', color: filter === 'longCalls' ? 'white' : 'inherit' }}
                    >
                        Long Calls ({getCount('longCalls')})
                    </Button>
                    <Button
                        onClick={() => handleFilterChange('voicemail')}
                        sx={{ backgroundColor: filter === 'voicemail' ? 'primary.main' : 'inherit', color: filter === 'voicemail' ? 'white' : 'inherit' }}
                    >
                        Voice Mails ({getCount('voicemail')})
                    </Button>
                </ButtonGroup>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={downloadCSV}
                    sx={{ mb: 2 }}
                >
                    Download CSV
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={downloadJSON}
                    sx={{ mb: 2 }}
                >
                    Download JSON
                </Button>
                <Paper elevation={3} sx={{ padding: 2, height: '400px', overflowY: 'auto' }}>
                    {loading && <CircularProgress sx={{ display: 'block', margin: 'auto' }} />}
                    <List>
                        {filteredReports.length > 0 ? (
                            filteredReports.map((report) => (
                                <Box key={report._id}>
                                    <ListItem button onClick={() => setSelectedReport(report)}>
                                        <ListItemIcon>
                                            {getStatusIcon(report.status)}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={`Name: ${report.name || 'N/A'}`}
                                            secondary={`Number: ${report.number || 'N/A'}`}
                                        />
                                    </ListItem>
                                    <Typography variant="body2" sx={{ ml: 7, mb: 2 }}>
                                        Status: {report.status || 'N/A'}
                                    </Typography>
                                    {report.reason && (
                                        <Typography variant="body2" sx={{ ml: 7, mb: 2 }}>
                                            Reason: {report.reason}
                                        </Typography>
                                    )}
                                    <Typography variant="body2" sx={{ ml: 7, mb: 2 }}>
                                        Called On: {report.calledOn || 'N/A'}
                                    </Typography>
                                    <Divider />
                                </Box>
                            ))
                        ) : (
                            <Typography variant="body1" sx={{ ml: 2 }}>
                                No call reports available.
                            </Typography>
                        )}
                    </List>
                </Paper>
                <Dialog
                    open={!!selectedReport}
                    onClose={() => setSelectedReport(null)}
                >
                    <DialogTitle>Call Report Details</DialogTitle>
                    {selectedReport && (
                        <DialogContent>
                            <DialogContentText>
                                <strong>Name:</strong> {selectedReport.name || 'N/A'}<br />
                                <strong>Number:</strong> {selectedReport.number || 'N/A'}<br />
                                <strong>Status:</strong> {selectedReport.status || 'N/A'}<br />
                                <strong>Reason:</strong> {selectedReport.reason || 'N/A'}<br />
                                <strong>Call Again:</strong> {selectedReport.callAgain ? 'Yes' : 'No'}<br />
                                <strong>Cost:</strong> {selectedReport.cost || 'N/A'}<br />
                                <strong>Called On:</strong> {selectedReport.calledOn || 'N/A'}<br />
                                <strong>Ended Reason:</strong> {selectedReport.endedReason || 'N/A'}<br />
                                <strong>Recording URL:</strong> {selectedReport.recordingUrl ? <a href={selectedReport.recordingUrl} target="_blank" rel="noopener noreferrer">Link</a> : 'N/A'}<br />
                                <strong>Summary:</strong> {selectedReport.summary || 'N/A'}
                            </DialogContentText>
                        </DialogContent>
                    )}
                </Dialog>
            </Box>
        </LocalizationProvider>
    );
};

export default CallReport;
