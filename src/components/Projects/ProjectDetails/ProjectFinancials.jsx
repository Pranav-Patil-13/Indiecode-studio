import React, { useState, useMemo } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Paper, 
  Stack, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Chip,
  IconButton,
  Divider,
  LinearProgress
} from '@mui/material';
import { 
  TrendingUp, 
  TrendingDown, 
  Receipt, 
  Plus, 
  Download, 
  FileText,
  AlertCircle,
  Trash2,
  CheckCircle
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import InvoiceModal from '../../Modals/InvoiceModal';
import ExpenseModal from '../../Modals/ExpenseModal';
import ConfirmDialog from '../../Modals/ConfirmDialog';
import { generateInvoicePDF } from '../../../utils/pdfGenerator';

const ProjectFinancials = ({ project }) => {
  const { invoices, expenses, clients, deleteInvoice, deleteExpense, updateInvoice } = useApp();
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);

  const projectInvoices = useMemo(() => invoices.filter(inv => inv.project_id === project.id), [invoices, project.id]);
  const projectExpenses = useMemo(() => expenses.filter(exp => exp.project_id === project.id), [expenses, project.id]);

  const totalBilled = projectInvoices.reduce((sum, inv) => sum + inv.total_amount, 0);
  const totalPaid = projectInvoices.filter(inv => inv.status === 'Paid').reduce((sum, inv) => sum + inv.total_amount, 0);
  const totalCosts = projectExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const projectProfit = totalPaid - totalCosts;

  const handleDownloadInvoice = (invoice) => {
    const client = clients.find(c => c.id === project.client_id) || { name: 'Unknown' };
    generateInvoicePDF(invoice, client, project);
  };

  const handleConfirmDelete = async () => {
    if (invoiceToDelete) {
      await deleteInvoice(invoiceToDelete.id);
      setInvoiceToDelete(null);
    }
  };

  const handleMarkAsPaid = async (id) => {
    await updateInvoice(id, { status: 'Paid' });
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 500, letterSpacing: '-0.02em', mb: 0.5 }}>Financial Performance</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>Track budget, invoices, and profitability for this project.</Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" startIcon={<TrendingDown size={18} />} onClick={() => setIsExpenseModalOpen(true)} sx={{ borderRadius: 2.5 }}>
            Record Expense
          </Button>
          <Button variant="contained" startIcon={<Plus size={18} />} onClick={() => setIsInvoiceModalOpen(true)} sx={{ borderRadius: 2.5 }}>
            Create Invoice
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, height: '100%', borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
            <Stack spacing={1}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase' }}>Total Billed</Typography>
              <Typography variant="h4" fontWeight={700}>₹{totalBilled.toLocaleString('en-IN')}</Typography>
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" fontWeight={600}>Collection Status</Typography>
                  <Typography variant="caption" fontWeight={600}>{Math.round((totalPaid / (totalBilled || 1)) * 100)}% Paid</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(totalPaid / (totalBilled || 1)) * 100} 
                  sx={{ height: 6, borderRadius: 3, bgcolor: 'action.hover', '& .MuiLinearProgress-bar': { borderRadius: 3 } }}
                />
              </Box>
            </Stack>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, height: '100%', borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
            <Stack spacing={1}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase' }}>Project Costs</Typography>
              <Typography variant="h4" fontWeight={700} color="error.main">₹{totalCosts.toLocaleString('en-IN')}</Typography>
              <Typography variant="caption" sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AlertCircle size={14} /> Includes {projectExpenses.length} expense items
              </Typography>
            </Stack>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, height: '100%', borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: 'none', bgcolor: 'primary.main', color: 'white' }}>
            <Stack spacing={1}>
              <Typography variant="caption" sx={{ opacity: 0.8, fontWeight: 600, textTransform: 'uppercase' }}>Net Profit</Typography>
              <Typography variant="h4" fontWeight={700}>₹{projectProfit.toLocaleString('en-IN')}</Typography>
              <Chip 
                label={projectProfit >= 0 ? 'Profitable' : 'Loss'} 
                size="small" 
                sx={{ width: 'fit-content', mt: 2, bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }} 
              />
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>Invoices</Typography>
      <TableContainer component={Paper} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: 'none', mb: 6 }}>
        <Table>
          <TableHead sx={{ bgcolor: 'action.hover' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, width: '15%' }}>Invoice #</TableCell>
              <TableCell sx={{ fontWeight: 600, width: '25%' }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 600, width: '15%' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600, width: '20%' }}>Due Date</TableCell>
              <TableCell sx={{ fontWeight: 600, width: '25%', textAlign: 'right' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projectInvoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.disabled' }}>No invoices found for this project</TableCell>
              </TableRow>
            ) : (
              projectInvoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell sx={{ fontWeight: 500 }}>{inv.invoice_number}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>₹{inv.total_amount.toLocaleString('en-IN')}</TableCell>
                  <TableCell>
                    <Chip label={inv.status} size="small" color={inv.status === 'Paid' ? 'success' : 'warning'} sx={{ fontWeight: 600, fontSize: '0.65rem' }} />
                  </TableCell>
                  <TableCell>{inv.due_date || 'N/A'}</TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5, mr: -1 }}>
                      {inv.status !== 'Paid' && (
                        <IconButton size="small" onClick={() => handleMarkAsPaid(inv.id)} title="Mark as Paid" sx={{ color: 'success.main' }}>
                          <CheckCircle size={18} />
                        </IconButton>
                      )}
                      <IconButton size="small" onClick={() => handleDownloadInvoice(inv)} title="Download Invoice">
                        <Download size={18} />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => setInvoiceToDelete(inv)} 
                        title="Delete Invoice"
                        sx={{ color: 'error.main' }}
                      >
                        <Trash2 size={18} />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <InvoiceModal open={isInvoiceModalOpen} onClose={() => setIsInvoiceModalOpen(false)} project={project} />
      <ExpenseModal open={isExpenseModalOpen} onClose={() => setIsExpenseModalOpen(false)} project={project} />
      
      <ConfirmDialog 
        open={!!invoiceToDelete}
        onClose={() => setInvoiceToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Invoice"
        message={`Are you sure you want to delete invoice ${invoiceToDelete?.invoice_number}? This action cannot be undone and will affect your financial totals.`}
        confirmText="Delete"
        severity="error"
      />
    </Box>
  );
};

export default ProjectFinancials;
