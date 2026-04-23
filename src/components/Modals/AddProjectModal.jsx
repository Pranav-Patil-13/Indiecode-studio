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
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText
} from '@mui/material';
import { X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const AddProjectModal = () => {
  const { clients, addProject, isAddProjectModalOpen, closeAddProjectModal } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    client_id: '',
    status: 'On Track',
    due_date: '',
    priority: 'Medium',
    description: ''
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Project name is required';
    if (!formData.client_id) newErrors.client_id = 'Client selection is required';
    if (!formData.due_date) newErrors.due_date = 'Due date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      addProject(formData);
      setFormData({ name: '', client_id: '', status: 'On Track', due_date: '', priority: 'Medium', description: '' });
      closeAddProjectModal();
    }
  };

  return (
    <Dialog 
      open={isAddProjectModalOpen} 
      onClose={closeAddProjectModal} 
      fullWidth 
      maxWidth="xs"
      slotProps={{
        paper: { sx: { borderRadius: 4, p: 1 } }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="span" sx={{ fontWeight: 700 }}>Create New Project</Typography>
        <IconButton onClick={closeAddProjectModal} size="small">
          <X size={20} />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 2 }}>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <TextField
            label="Project Name"
            fullWidth
            size="small"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={!!errors.name}
            helperText={errors.name}
            placeholder="e.g. Website Redesign"
          />

          <FormControl fullWidth size="small" error={!!errors.client}>
            <InputLabel>Client</InputLabel>
            <Select
              value={formData.client_id}
              label="Client"
              onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
            >
              {clients.map(client => (
                <MenuItem key={client.id} value={client.id}>{client.name}</MenuItem>
              ))}
            </Select>
            {errors.client && <FormHelperText>{errors.client}</FormHelperText>}
          </FormControl>

          <Stack direction="row" spacing={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Priority</InputLabel>
              <Select
                value={formData.priority}
                label="Priority"
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <MenuItem value="On Track">On Track</MenuItem>
                <MenuItem value="In Review">In Review</MenuItem>
                <MenuItem value="Delayed">Delayed</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          <TextField
            label="Due Date"
            type="text"
            fullWidth
            size="small"
            value={formData.due_date}
            onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
            error={!!errors.due_date}
            helperText={errors.due_date || "e.g. May 20, 2026"}
            placeholder="May 20, 2026"
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 1 }}>
        <Button onClick={closeAddProjectModal} color="inherit" sx={{ fontWeight: 600 }}>Cancel</Button>
        <Button 
          variant="contained" 
          onClick={handleSubmit}
          sx={{ borderRadius: 2, px: 3, fontWeight: 600 }}
        >
          Create Project
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProjectModal;
