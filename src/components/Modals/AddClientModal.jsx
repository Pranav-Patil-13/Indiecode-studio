import React, { useState, useEffect } from 'react';
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

const AddClientModal = ({ open, onClose, initialData = null }) => {
  const { addClient, updateClient } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    password: '',
    revenue: '',
    initial_payment: '',
    status: 'Active',
    created_at: new Date().toISOString().split('T')[0] // Default to today
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData && open) {
      setFormData({
        ...initialData,
        created_at: initialData.created_at ? new Date(initialData.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      });
    } else if (!open) {
      // Reset when closed
      setTimeout(() => {
        setFormData({ name: '', contact: '', email: '', password: '', revenue: '', status: 'Active', created_at: new Date().toISOString().split('T')[0] });
        setErrors({});
      }, 300);
    }
  }, [initialData, open]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Client name is required';
    if (!formData.contact) newErrors.contact = 'Contact person is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!initialData && !formData.password) {
      newErrors.password = 'Password is required to create portal access';
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      const payload = { ...formData };
      const initialPayment = parseFloat(formData.initial_payment);
      
      if (!initialData && !isNaN(initialPayment) && initialPayment > 0) {
        payload.payments = [{
          id: crypto.randomUUID(),
          amount: initialPayment,
          date: formData.created_at,
          description: 'Initial Payment',
          created_at: new Date().toISOString()
        }];
      }
      
      delete payload.initial_payment; // Clean up before sending to Supabase

      if (initialData) {
        updateClient(initialData.id, payload);
      } else {
        addClient(payload);
      }
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
        <Typography variant="h6" component="span" sx={{ fontWeight: 500 }}>
          {initialData ? 'Edit Client' : 'Add New Client'}
        </Typography>
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
            label={initialData ? "New Password (Optional)" : "Portal Password"}
            fullWidth
            size="small"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={!!errors.password}
            helperText={errors.password || (initialData ? "Leave blank to keep existing" : "Used by client to log into portal")}
            placeholder="Min 6 characters"
          />
          <TextField
            label="Total Project Value"
            fullWidth
            size="small"
            type="number"
            value={formData.revenue}
            onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
            onKeyDown={(e) => {
              if (['e', 'E', '+', '-', '.'].includes(e.key)) {
                e.preventDefault();
              }
            }}
            placeholder="e.g. 12000"
            slotProps={{
              input: {
                startAdornment: <Typography variant="body2" sx={{ mr: 1, color: 'text.secondary', fontWeight: 500 }}>₹</Typography>
              }
            }}
          />
          {!initialData && (
            <TextField
              label="Initial Payment (Optional)"
              fullWidth
              size="small"
              type="number"
              value={formData.initial_payment}
              onChange={(e) => setFormData({ ...formData, initial_payment: e.target.value })}
              onKeyDown={(e) => {
                if (['e', 'E', '+', '-', '.'].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              placeholder="e.g. 3000"
              helperText="This will record your first installment automatically."
              slotProps={{
                input: {
                  startAdornment: <Typography variant="body2" sx={{ mr: 1, color: 'text.secondary', fontWeight: 500 }}>₹</Typography>
                }
              }}
            />
          )}
          <TextField
            label="Date Acquired"
            fullWidth
            size="small"
            type="date"
            value={formData.created_at}
            onChange={(e) => setFormData({ ...formData, created_at: e.target.value })}
            slotProps={{
              inputLabel: { shrink: true }
            }}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 1 }}>
        <Button onClick={onClose} color="inherit" sx={{ fontWeight: 500 }}>Cancel</Button>
        <Button 
          variant="contained" 
          onClick={handleSubmit}
          sx={{ borderRadius: 2, px: 3, fontWeight: 500 }}
        >
          {initialData ? 'Save Changes' : 'Add Client'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddClientModal;
