import React, { useState } from 'react';
import { CircularProgress, IconButton, TextField, Button, Grid, Paper, Typography, Select, MenuItem } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from 'axios';
import '../styles/CreateIVR.css';

const CreateIVR = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedPrompts, setGeneratedPrompts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [changingPromptIndex, setChangingPromptIndex] = useState(null);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [audioUrl, setAudioUrl] = useState('');

  const fetchVoices = async () => {
    try {
      const response = await axios.get('https://api.11labs.io/v1/voices', {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_11LABS_API_KEY}`,
        },
      });
      setVoices(response.data.voices);
    } catch (error) {
      console.error('Error fetching voices:', error);
    }
  };

  const generatePrompts = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: `Generate 5 different IVR prompts for the following input. Make it 15 words per point: ${prompt}` }],
          max_tokens: 800,
          n: 1,
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const choices = response.data.choices[0].message.content.trim().split('\n').filter(choice => choice.trim() !== '');
      setGeneratedPrompts(choices);
    } catch (error) {
      console.error('Error generating prompts:', error);
    } finally {
      setLoading(false);
    }
  };

  const changePrompt = async (index) => {
    setChangingPromptIndex(index);
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: `Generate a different IVR prompt for the following input. Make it one sentence like 15 words: ${prompt}` }],
          max_tokens: 350,
          n: 1,
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setGeneratedPrompts(prev => {
        const newPrompts = [...prev];
        newPrompts[index] = response.data.choices[0].message.content.trim();
        return newPrompts;
      });
    } catch (error) {
      console.error('Error changing prompt:', error);
    } finally {
      setChangingPromptIndex(null);
    }
  };

  const playAudio = async (text) => {
    try {
      const response = await axios.post(
        'https://api.11labs.io/v1/text-to-speech',
        {
          text,
          voice: selectedVoice,
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_11LABS_API_KEY}`,
            'Content-Type': 'application/json',
          },
          responseType: 'blob', // Ensure the response is in blob format for audio playback
        }
      );
      const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);
    } catch (error) {
      console.error('Error generating audio:', error);
    }
  };

  // Fetch voices on component mount
  React.useEffect(() => {
    fetchVoices();
  }, []);

  return (
    <div className="create-ivr">
      <TextField
        label="Enter prompt"
        variant="outlined"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Select
        value={selectedVoice}
        onChange={(e) => setSelectedVoice(e.target.value)}
        displayEmpty
        fullWidth
        margin="normal"
      >
        <MenuItem value="" disabled>Select Voice</MenuItem>
        {voices.map((voice) => (
          <MenuItem key={voice.id} value={voice.id}>{voice.name}</MenuItem>
        ))}
      </Select>
      <Button
        variant="contained"
        color="primary"
        style={{marginTop:"5px"}}
        onClick={generatePrompts}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Generate Prompts'}
      </Button>
      <Grid container spacing={3} style={{ marginTop: '20px' }}>
        {generatedPrompts.map((text, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper elevation={3} style={{ padding: '20px', position: 'relative' }}>
              <Typography variant="body1">{text}</Typography>
              <IconButton 
                edge="end" 
                onClick={() => changePrompt(index)} 
                disabled={changingPromptIndex === index}
                style={{ position: 'absolute', top: '10px', right: '10px' }}
              >
                {changingPromptIndex === index ? <CircularProgress size={24} /> : <RefreshIcon />}
              </IconButton>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => playAudio(text)}
                style={{ marginTop: '10px' }}
              >
                Play Audio
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
      {audioUrl && <audio controls src={audioUrl} autoPlay />}
    </div>
  );
};

export default CreateIVR;
