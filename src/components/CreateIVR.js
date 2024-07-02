import React, { useState, useEffect } from 'react';
import { CircularProgress, IconButton, TextField, Button, Grid, Paper, Typography, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel, Checkbox } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import '../styles/CreateIVR.css';

const CreateIVR = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedPrompts, setGeneratedPrompts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [changingPromptIndex, setChangingPromptIndex] = useState(null);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [editingPromptIndex, setEditingPromptIndex] = useState(null);
  const [editText, setEditText] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [generateAllAudio, setGenerateAllAudio] = useState(false);
  const [audioList, setAudioList] = useState([]);

  const fetchVoices = async () => {
    try {
      const response = await axios.get('https://api.elevenlabs.io/v1/voices', {
        headers: {
          'xi-api-key': process.env.REACT_APP_11LABS_API_KEY,
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

  const editPrompt = (index) => {
    setEditingPromptIndex(index);
    setEditText(generatedPrompts[index]);
  };

  const saveEditedPrompt = () => {
    setGeneratedPrompts(prev => {
      const newPrompts = [...prev];
      newPrompts[editingPromptIndex] = editText;
      return newPrompts;
    });
    setEditingPromptIndex(null);
  };

  const handleOpenModal = () => {
    if (selectedVoice) {
      setOpenModal(true);
    } else {
      alert('Please select a voice first.');
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleGenerateAllAudio = async () => {
    try {
      const newAudioList = [];
      for (let text of generatedPrompts) {
        const response = await axios.post(
          `https://api.elevenlabs.io/v1/text-to-speech/${selectedVoice}`,
          {
            text,
            voice_settings: { stability: 0.5, similarity_boost: 0.75 }
          },
          {
            headers: {
              'xi-api-key': process.env.REACT_APP_11LABS_API_KEY,
              'Content-Type': 'application/json',
            },
            responseType: 'blob',
          }
        );
        const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(audioBlob);
        newAudioList.push({ text, audioUrl });
      }
      setAudioList(newAudioList);
    } catch (error) {
      console.error('Error generating audio:', error);
    }
  };

  const addPromptManually = () => {
    setGeneratedPrompts([...generatedPrompts, '']);
    setEditingPromptIndex(generatedPrompts.length);
    setEditText('');
  };

  useEffect(() => {
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
          <MenuItem key={voice.voice_id} value={voice.voice_id}>
            {voice.name}
            <audio controls src={voice.preview_url} style={{ marginLeft: '10px' }} />
          </MenuItem>
        ))}
      </Select>
      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: '5px' }}
        onClick={generatePrompts}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Generate Prompts'}
      </Button>
      <IconButton 
        color="primary"
        onClick={addPromptManually}
        style={{ marginTop: '5px', marginLeft: '10px' }}
      >
        <AddIcon />
      </IconButton>
      <Grid container spacing={3} style={{ marginTop: '20px' }}>
        {generatedPrompts.map((text, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper elevation={3} style={{ padding: '20px', position: 'relative' }}>
              <Typography variant="body1">
                {editingPromptIndex === index ? (
                  <TextField
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    fullWidth
                    multiline
                  />
                ) : (
                  text
                )}
              </Typography>
              <IconButton 
                edge="end" 
                onClick={() => changePrompt(index)} 
                disabled={changingPromptIndex === index}
                style={{ position: 'absolute', top: '10px', right: '10px' }}
              >
                {changingPromptIndex === index ? <CircularProgress size={24} /> : <RefreshIcon />}
              </IconButton>
              <IconButton 
                edge="end" 
                onClick={() => editPrompt(index)} 
                style={{ position: 'absolute', top: '10px', right: '50px' }}
              >
                <EditIcon />
              </IconButton>
              {editingPromptIndex === index && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={saveEditedPrompt}
                  style={{ marginTop: '10px' }}
                >
                  Save
                </Button>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: '20px' }}
        onClick={handleOpenModal}
        disabled={!selectedVoice}
      >
        Continue
      </Button>
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Generate Audio</DialogTitle>
        <DialogContent>
          <FormControlLabel
            control={<Checkbox checked={generateAllAudio} onChange={(e) => setGenerateAllAudio(e.target.checked)} />}
            label="Generate audio for all prompts"
          />
          {generateAllAudio && (
            <>
              <Typography variant="h6">Generated Audio:</Typography>
              {audioList.map((item, index) => (
                <div key={index} style={{ marginBottom: '10px' }}>
                  <Typography variant="body1">{item.text}</Typography>
                  <audio controls src={item.audioUrl} />
                </div>
              ))}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cancel
          </Button>
          <Button onClick={handleGenerateAllAudio} color="primary">
            Generate
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CreateIVR;
