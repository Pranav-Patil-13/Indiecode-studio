import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Typography,
  IconButton,
  Box,
  Stack
} from '@mui/material';
import { X } from 'lucide-react';

const QuickPromptModal = ({ open, onClose, onConfirm, title, label, placeholder, initialValue = '', initialColor = '#3b82f6', showColorPicker = false }) => {
  const [value, setValue] = useState(initialValue);
  const [selectedColor, setSelectedColor] = useState(initialColor);

  const colors = [
    { label: 'Blue', value: '#3b82f6' },
    { label: 'Purple', value: '#8b5cf6' },
    { label: 'Orange', value: '#f59e0b' },
    { label: 'Green', value: '#10b981' },
    { label: 'Red', value: '#ef4444' },
    { label: 'Pink', value: '#ec4899' },
    { label: 'Cyan', value: '#06b6d4' }
  ];

  useEffect(() => {
    if (open) {
      setValue(initialValue);
      setSelectedColor(initialColor);
    }
  }, [open, initialValue, initialColor]);

  const handleConfirm = () => {
    if (showColorPicker) {
      onConfirm(value, selectedColor);
    } else {
      onConfirm(value);
    }
    onClose();
    setValue('');
  };

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
        <Typography variant="h6" sx={{ fontWeight: 500 }}>{title}</Typography>
        <IconButton onClick={onClose} size="small">
          <X size={20} />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 2 }}>
        <TextField
          autoFocus
          label={label}
          fullWidth
          size="small"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          sx={{ mt: 1 }}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleConfirm();
            }
          }}
        />

        {showColorPicker && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.secondary', mb: 1.5, display: 'block' }}>
              Assign Category Color
            </Typography>
            <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap', gap: 1 }}>
              {colors.map((color) => (
                <Box
                  key={color.value}
                  onClick={() => setSelectedColor(color.value)}
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    bgcolor: color.value,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                    border: '3px solid',
                    borderColor: selectedColor === color.value ? 'background.paper' : 'transparent',
                    boxShadow: selectedColor === color.value ? `0 0 0 2px ${color.value}` : 'none',
                    '&:hover': { transform: 'scale(1.15)' }
                  }}
                />
              ))}
            </Stack>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 1 }}>
        <Button onClick={onClose} color="inherit" sx={{ fontWeight: 500 }}>Cancel</Button>
        <Button 
          variant="contained" 
          onClick={handleConfirm}
          disabled={!value.trim()}
          sx={{ borderRadius: 2, px: 3, fontWeight: 500 }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuickPromptModal;
