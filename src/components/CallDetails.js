import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

function CallDetails() {
    const { callId } = useParams();
    const [callDetails, setCallDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCallDetails() {
            try {
                const response = await fetch(`https://api.vapi.ai/call/${callId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer e518c4e5-8e86-42ab-b1a5-5315f83af694'  // Replace <token> with the actual token
                    }
                });
                const data = await response.json();
                setCallDetails(data);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch call details:', error);
                setLoading(false);
            }
        }

        fetchCallDetails();
    }, [callId]);

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    if (!callDetails) {
        return <Typography>No call details available.</Typography>;
    }

    return (
        <Box sx={{ margin: 2 }}>
            <Typography variant="h4" gutterBottom>
                Call Details
            </Typography>
            <Typography variant="body1" sx={{ position: 'absolute', top: 20, right: 20 }}>
                Call ID: {callId}
            </Typography>
            <Paper elevation={0} sx={{ padding: 2, marginBottom: 2 }}>
                <Typography variant="h6">Recording</Typography>
                <audio controls src={callDetails.recordingUrl} style={{ width: '100%' }} />
                <PlayCircleOutlineIcon sx={{ visibility: 'hidden' }} /> {/* Hides the icon, maintains layout */}
            </Paper>
            <Paper elevation={0} sx={{ padding: 2 }}>
                <Typography variant="h6">Conversation</Typography>
                <List sx={{ maxHeight: 300, overflow: 'auto', border: 'none', bgcolor: 'background.paper' }}>
                    {callDetails.messages.map((msg, index) => (
                        (index !== 0) && (  // Exclude the first system message
                            <ListItem key={index} sx={{ border: 'none', px: 0 }}>
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: 'secondary.main' }}>{msg.role[0]}</Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={`${msg.role}: ${msg.message}`} sx={{ color: 'text.primary' }} />
                            </ListItem>
                        )
                    ))}
                </List>
                <Typography variant="h6">Summary</Typography>
                <Typography paragraph>{callDetails.summary}</Typography>
            </Paper>
        </Box>
    );
}

export default CallDetails;
