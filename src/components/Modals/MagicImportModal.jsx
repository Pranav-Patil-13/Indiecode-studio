import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Box, 
  Typography, 
  CircularProgress,
  IconButton,
  Stack,
  Alert,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { Sparkles, X, Wand2, FileText, Layout, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { supabase } from '../../lib/supabase';

const MagicImportModal = ({ open, onClose, projectId = null }) => {

  const { user, showNotification, updateProject } = useApp();
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  const handleMagicImport = async () => {
    if (!transcript.trim()) {
      setError('Please provide a meeting transcript or discussion summary.');
      return;
    }

    setLoading(true);
    setError(null);
    setActiveStep(1);

    try {
      // Call Supabase Edge Function
      const { data, error: functionError } = await supabase.functions.invoke('process-meeting', {
        body: { 
          transcript, 
          userId: user?.id,
          projectId
        }
      });


      if (functionError) throw functionError;

      if (data.success) {
        setActiveStep(2);
        showNotification('Project created successfully with AI!', 'success');
        setTimeout(() => {
          onClose();
          // Reset state
          setTranscript('');
          setActiveStep(0);
        }, 2000);
      } else {
        throw new Error(data.error || 'Failed to process meeting');
      }
    } catch (err) {
      console.error('Magic Import Error:', err);
      setError(err.message || 'Something went wrong during the magic import.');
      setActiveStep(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={loading ? undefined : onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: { sx: { borderRadius: 5, p: 1 } }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'primary.main', color: 'white', display: 'flex' }}>
            <Sparkles size={20} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Magic Project Import</Typography>
        </Stack>
        <IconButton onClick={onClose} disabled={loading}>
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 4, mt: 1 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            <Step><StepLabel>Paste Discussion</StepLabel></Step>
            <Step><StepLabel>AI Analysis</StepLabel></Step>
            <Step><StepLabel>Project Created</StepLabel></Step>
          </Stepper>
        </Box>

        {activeStep === 0 && (
          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
              Paste your meeting transcript, Zoom summary, or raw discussion notes below. 
              Our AI will automatically extract requirements, create a roadmap, and set up your project.
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              multiline
              rows={10}
              variant="outlined"
              placeholder="Example: We discussed building a hotel management system. It needs a booking engine, room inventory, and payment integration. Phase 1 should be the dashboard..."
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              sx={{ 
                '& .MuiOutlinedInput-root': { borderRadius: 4, bgcolor: 'action.hover' }
              }}
            />
          </Box>
        )}

        {activeStep === 1 && (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <CircularProgress size={60} thickness={4} sx={{ mb: 4 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Waving the Magic Wand...</Typography>
            <Typography variant="body2" color="text.secondary">
              Analyzing transcript and building your project structure.
            </Typography>
          </Box>
        )}

        {activeStep === 2 && (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Box sx={{ color: 'success.main', mb: 3 }}>
              <CheckCircle2 size={80} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Poof! Project Ready.</Typography>
            <Typography variant="body2" color="text.secondary">
              Your project has been created and the roadmap is live.
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        {activeStep === 0 && (
          <>
            <Button onClick={onClose} sx={{ fontWeight: 600 }}>Cancel</Button>
            <Button 
              variant="contained" 
              startIcon={<Wand2 size={18} />}
              onClick={handleMagicImport}
              disabled={loading || !transcript.trim()}
              sx={{ borderRadius: 2.5, px: 4, py: 1.2 }}
            >
              Start Magic Import
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default MagicImportModal;
