import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  Box, 
  Stack, 
  TextField, 
  IconButton, 
  Divider,
  Paper,
  alpha,
  useTheme
} from '@mui/material';
import { Trash2, Plus, Download, Send, Receipt, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { generateInvoicePDF } from '../../utils/pdfGenerator';
import { sendPushNotification } from '../../utils/pushNotifications';

const InvoiceModal = ({ open, onClose, project, initialItems = [] }) => {
  const theme = useTheme();
  const { user, showNotification, addInvoice, clients, projects, invoices } = useApp();
  const [items, setItems] = useState(initialItems.length > 0 ? initialItems : [{ description: '', amount: '' }]);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  
  const today = new Date().toISOString().split('T')[0];
  const next15Days = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const [issueDate, setIssueDate] = useState(today);
  const [dueDate, setDueDate] = useState(next15Days);
  
  const [selectedProjectId, setSelectedProjectId] = useState(project?.id || '');
  
  useEffect(() => {
    if (project?.id) {
      setSelectedProjectId(project.id);
    }
  }, [project]);

  useEffect(() => {
    if (open) {
      if (invoices && invoices.length > 0) {
        // Find all numeric parts of invoice numbers
        const numbers = invoices.map(inv => {
          const match = inv.invoice_number.match(/\d+/);
          return match ? parseInt(match[0], 10) : 0;
        });
        const maxNum = Math.max(...numbers);
        const nextNum = (maxNum + 1).toString().padStart(2, '0');
        setInvoiceNumber(`INV-${nextNum}`);
      } else {
        setInvoiceNumber('INV-01');
      }
    }
  }, [open, invoices]);

  const activeProject = project || projects.find(p => p.id === selectedProjectId);
  
  const [loading, setLoading] = useState(false);

  const handleAddItem = () => {
    setItems([...items, { description: '', amount: '' }]);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((acc, item) => acc + (parseFloat(item.amount) || 0), 0);
  };

  const generatePDF = () => {
    const total = calculateTotal();
    const client = clients.find(c => c.id === activeProject?.client_id) || { name: 'Unknown Client' };
    
    // Format dates for display on PDF
    const formattedIssueDate = new Date(issueDate).toLocaleDateString();
    const formattedDueDate = new Date(dueDate).toLocaleDateString();
    
    const invoiceData = {
      invoice_number: invoiceNumber,
      items: items,
      total_amount: total,
      issue_date: formattedIssueDate,
      due_date: formattedDueDate,
      status: 'Pending'
    };
    
    if (activeProject) {
      generateInvoicePDF(invoiceData, client, activeProject);
    }
  };

  const handleSaveInvoice = async () => {
    if (!activeProject) {
      showNotification('Please select a project first', 'warning');
      return;
    }

    try {
      setLoading(true);
      const total = calculateTotal();
      
      const formattedDueDatePDF = new Date(dueDate).toLocaleDateString();
      const formattedIssueDatePDF = new Date(issueDate).toLocaleDateString();
      
      await addInvoice({
        invoice_number: invoiceNumber,
        project_id: activeProject.id,
        client_id: activeProject.client_id,
        total_amount: total,
        status: 'Pending',
        due_date: dueDate, // Keep YYYY-MM-DD for DB
        issue_date: issueDate, // Keep YYYY-MM-DD for DB
        items: items,
        user_id: user.id
      });
      showNotification('Invoice generated and saved!', 'success');
      
      // Generate PDF with formatted dates for the user
      const invoiceDataForPDF = {
        invoice_number: invoiceNumber,
        items: items,
        total_amount: total,
        issue_date: formattedIssueDatePDF,
        due_date: formattedDueDatePDF,
        status: 'Pending'
      };
      const client = clients.find(c => c.id === activeProject.client_id) || { name: 'Unknown Client' };
      generateInvoicePDF(invoiceDataForPDF, client, activeProject);

      // Send push notification to the client
      if (activeProject.client_id && client.email) {
        sendPushNotification(
          client.email,
          'New Invoice Generated',
          `Invoice #${invoiceNumber} for ₹${total.toLocaleString('en-IN')} has been generated.`,
          { invoiceNumber, projectId: activeProject.id }
        );
      }

      onClose();
    } catch (error) {
      showNotification('Error saving invoice: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      sx={{ 
        '& .MuiPaper-root': { borderRadius: 4, backgroundImage: 'none' } 
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <Receipt size={24} color={theme.palette.primary.main} />
          <Typography variant="h6" fontWeight={500}>Generate Invoice</Typography>
        </Stack>
        <IconButton onClick={onClose} size="small"><X size={20} /></IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={3}>
          <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, textTransform: 'uppercase', mb: 1, display: 'block' }}>
              Invoice Details
            </Typography>
            <Stack direction="row" spacing={2}>
              <TextField 
                size="small" 
                label="Invoice #" 
                value={invoiceNumber} 
                onChange={(e) => setInvoiceNumber(e.target.value)}
                fullWidth
              />
              {project ? (
                <TextField 
                  size="small" 
                  label="Project" 
                  value={project.name} 
                  disabled
                  fullWidth
                />
              ) : (
                <TextField
                  select
                  size="small"
                  label="Select Project"
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  fullWidth
                  SelectProps={{ native: true }}
                  InputLabelProps={{ shrink: true }}
                >
                  <option value="">Choose Project...</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </TextField>
              )}
            </Stack>
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <TextField 
                size="small" 
                label="Issue Date" 
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField 
                size="small" 
                label="Due Date" 
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 1.5 }}>Line Items</Typography>
            <Stack spacing={2}>
              {items.map((item, index) => (
                <Stack key={index} direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                  <TextField 
                    fullWidth
                    size="small"
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  />
                  <TextField 
                    sx={{ width: 140 }}
                    size="small"
                    placeholder="Amount"
                    type="number"
                    value={item.amount}
                    onChange={(e) => handleItemChange(index, 'amount', e.target.value)}
                  />
                  <IconButton 
                    size="small" 
                    onClick={() => handleRemoveItem(index)}
                    disabled={items.length === 1}
                    sx={{ color: 'error.main' }}
                  >
                    <Trash2 size={18} />
                  </IconButton>
                </Stack>
              ))}
              <Button 
                startIcon={<Plus size={16} />} 
                onClick={handleAddItem}
                sx={{ alignSelf: 'flex-start', color: 'text.secondary', fontWeight: 500 }}
              >
                Add Item
              </Button>
            </Stack>
          </Box>

          <Divider />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 500 }}>Total</Typography>
            <Typography variant="h5" sx={{ fontWeight: 500, color: 'primary.main' }}>
              ₹{calculateTotal().toLocaleString('en-IN')}
            </Typography>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={onClose} variant="text" sx={{ color: 'text.secondary' }}>Cancel</Button>
        <Button 
          variant="contained" 
          startIcon={loading ? null : <Download size={18} />} 
          onClick={handleSaveInvoice}
          disabled={loading}
          sx={{ borderRadius: 2.5, px: 3 }}
        >
          {loading ? 'Processing...' : 'Generate & Download'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InvoiceModal;
