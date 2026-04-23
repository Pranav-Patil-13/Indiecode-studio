import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Box, 
  IconButton,
  Typography,
  Stack
} from '@mui/material';
import { X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const AddClientModal = ({ open, onClose }) => {
  const { addClient } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    revenue: '',
    status: 'Active'
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Client name is required';
    if (!formData.contact) newErrors.contact = 'Contact person is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      addClient(formData);
      setFormData({ name: '', contact: '', email: '', revenue: '', status: 'Active' });
      onClose();
    }
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
        <Typography variant="h6" component="span" sx={{ fontWeight: 700 }}>Add New Client</Typography>
        <IconButton onClick={onClose} size="small">
          <X size={20} />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 2 }}>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <TextField
            label="Client Name"
            fullWidth
            size="small"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={!!errors.name}
            helperText={errors.name}
            placeholder="e.g. Acme Corp"
          />
          <TextField
            label="Contact Person"
            fullWidth
            size="small"
            value={formData.contact}
            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            error={!!errors.contact}
            helperText={errors.contact}
            placeholder="e.g. John Doe"
          />
          <TextField
            label="Email Address"
            fullWidth
            size="small"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={!!errors.email}
            helperText={errors.email}
            placeholder="e.g. john@acme.com"
          />
          <TextField
            label="Initial Revenue"
            fullWidth
            size="small"
            value={formData.revenue}
            onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
            placeholder="e.g. ₹5.0L"
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 1 }}>
        <Button onClick={onClose} color="inherit" sx={{ fontWeight: 600 }}>Cancel</Button>
        <Button 
          variant="contained" 
          onClick={handleSubmit}
          sx={{ borderRadius: 2, px: 3, fontWeight: 600 }}
        >
          Add Client
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddClientModal;
