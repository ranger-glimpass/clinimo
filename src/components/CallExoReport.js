import React, { useState, useEffect } from 'react';
import { Container, List, ListItem, ListItemText, Dialog, DialogTitle, DialogContent, Typography, CircularProgress } from '@mui/material';
import { getExoCallData } from '../apiService'; // Adjust the import path as needed

const CallExoReport = () => {
    const [callData, setCallData] = useState([]);
    const [selectedCall, setSelectedCall] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const data = await getExoCallData();
          setCallData(data);
        } catch (error) {
          console.error('Error fetching call data:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, []);
  
    const handleListItemClick = (call) => {
      setSelectedCall(call);
    };
  
    const handleClose = () => {
      setSelectedCall(null);
    };
  
    const getTranscriptForCall = (sid) => {
      const transcriptData = callData.find(item => item.call_sid === sid);
      return transcriptData ? transcriptData.call_transcript : 'No transcript available';
    };
  
    if (loading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </div>
      );
    }
  
    return (
      <Container style={{ marginTop: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Call Data
        </Typography>
        <List>
          {callData.filter(call => call.Sid).map((call) => (
            <ListItem button key={call.Sid} onClick={() => handleListItemClick(call)}>
              <ListItemText primary={`From: ${call.From}`} secondary={`Status: ${call.Status}`} />
            </ListItem>
          ))}
        </List>
        <Dialog open={!!selectedCall} onClose={handleClose}>
          <DialogTitle>Call Transcript</DialogTitle>
          <DialogContent style={{ whiteSpace: 'pre-line' }}>
            {selectedCall && (
              <Typography>
                {getTranscriptForCall(selectedCall.Sid)}
              </Typography>
            )}
          </DialogContent>
        </Dialog>
      </Container>
    );
  };
  

export default CallExoReport;
