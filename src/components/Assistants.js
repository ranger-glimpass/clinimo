import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

function Assistants() {
    const [assistants, setAssistants] = useState([]);

    useEffect(() => {
        const storedAssistants = sessionStorage.getItem('assistants');
        if (storedAssistants) {
            setAssistants(JSON.parse(storedAssistants));
        }
    }, []);

    const handleTestClick = (id) => {
        const url = `https://talk.glimpass.com?unicode=${id}`;
        window.open(url, '_blank');
    };

    const handleAddAssistant = () => {
        console.log('Add Assistant clicked');
        sendEmailRequestForAssistant();
        // Add assistant logic here
    };

    function sendEmailRequestForAssistant() {
        const user = JSON.parse(sessionStorage.getItem('user'));
        if (!user) {
            alert('User information not available, please log in.');
            return;
        }
    
        const clientId = user._id;  // Assuming _id is the clientId in the user object
        const userName = user.name;  // Assuming name is stored in the user object
        const email = "ranger@glimpass.com";
        const subject = encodeURIComponent("Request for New Assistant");
        const body = encodeURIComponent(`Hello,\n\nI would like to request the creation of a new AI assistant for our account.\n\nClient ID: ${clientId}\nName: ${userName}\n\nPlease let us know the next steps.\n\nThank you,\n${userName}`);
    
        const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;
        window.open(mailtoUrl, '_blank');
    }
    return (
        <Box sx={{ width: '100%' }}>
            <Grid container justifyContent="flex-end" sx={{ marginBottom: 2 }}>
                <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<AddIcon />}
                    onClick={handleAddAssistant}
                >
                    Add Assistant
                </Button>
            </Grid>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Assistant Name</TableCell>
                            <TableCell align="right">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {assistants.map((assistant) => (
                            <TableRow key={assistant._id}>
                                <TableCell component="th" scope="row">
                                    {assistant.name}
                                </TableCell>
                                <TableCell align="right">
                                    <Button 
                                        variant="contained" 
                                        color="primary"
                                        onClick={() => handleTestClick(assistant.unicode)}
                                    >
                                        Test
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default Assistants;
