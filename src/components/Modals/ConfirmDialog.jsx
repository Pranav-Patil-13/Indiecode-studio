import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography,
  IconButton,
  Box,
  Stack
} from '@mui/material';
import { X, AlertTriangle } from 'lucide-react';

const ConfirmDialog = ({ open, onClose, onConfirm, title, message, confirmText = 'Confirm', severity = 'primary' }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="xs"
      slotProps={{
        paper: { sx: { borderRadius: 4, p: 1 } }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          {severity === 'error' && <AlertTriangle size={20} color="#ef4444" />}
          <Typography variant="h6" sx={{ fontWeight: 500 }}>{title}</Typography>
        </Stack>
        <IconButton onClick={onClose} size="small">
          <X size={20} />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 2 }}>
        <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
          {message}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 1 }}>
        <Button onClick={onClose} color="inherit" sx={{ fontWeight: 500 }}>Cancel</Button>
        <Button 
          variant="contained" 
          onClick={() => {
            onConfirm();
            onClose();
          }}
          color={severity === 'error' ? 'error' : 'primary'}
          sx={{ borderRadius: 2, px: 3, fontWeight: 500 }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
