import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Stack, 
  MenuItem, 
  Typography, 
  Box, 
  IconButton,
  Divider,
  InputAdornment
} from '@mui/material';
import { X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const ExpenseModal = ({ open, onClose, project: initialProject }) => {
  const { projects, addExpense } = useApp();
  const [selectedProjectId, setSelectedProjectId] = useState(initialProject?.id || '');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Service');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const categories = ['Infrastructure', 'Service', 'Marketing', 'Legal', 'Software', 'Other'];

  useEffect(() => {
    if (initialProject) {
      setSelectedProjectId(initialProject.id);
    }
  }, [initialProject]);

  const handleSubmit = async () => {
    const expenseData = {
      project_id: selectedProjectId,
      description,
      amount: parseFloat(amount),
      category,
      date,
      created_at: new Date().toISOString()
    };

    await addExpense(expenseData);
    onClose();
    // Reset form
    setDescription('');
    setAmount('');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth sx={{ '& .MuiPaper-root': { borderRadius: 4 } }}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3 }}>
        <Typography variant="h6" fontWeight={500}>Record Expense</Typography>
        <IconButton onClick={onClose} size="small"><X size={20} /></IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={3}>
          {!initialProject && (
            <TextField
              select
              fullWidth
              label="Select Project"
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
            >
              {projects.map((p) => (
                <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
              ))}
            </TextField>
          )}

          <TextField 
            fullWidth 
            label="Expense Description" 
            placeholder="e.g. Hosting Fees, API Subscription"
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
          />

          <Stack direction="row" spacing={2}>
            <TextField 
              fullWidth 
              label="Amount" 
              type="number"
              InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <TextField 
              fullWidth 
              select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </TextField>
          </Stack>

          <TextField 
            fullWidth 
            label="Date" 
            type="date" 
            InputLabelProps={{ shrink: true }}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!selectedProjectId || !description || !amount}>
          Save Expense
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExpenseModal;
