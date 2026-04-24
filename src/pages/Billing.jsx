import React, { useState, useMemo } from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  Box, 
  Paper, 
  Stack, 
  Button, 
  Tabs, 
  Tab, 
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  FileText, 
  Plus, 
  Download, 
  ExternalLink,
  Receipt,
  MoreVertical,
  ArrowUpRight,
  Trash2,
  CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import StatCard from '../components/Dashboard/StatCard';
import InvoiceModal from '../components/Modals/InvoiceModal';
import ExpenseModal from '../components/Modals/ExpenseModal';
import { generateInvoicePDF } from '../utils/pdfGenerator';

const Billing = () => {
  const { invoices, expenses, clients, projects, deleteInvoice, deleteExpense, updateInvoice } = useApp();
  const [activeTab, setActiveTab] = useState(0);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  
  // Payment Date Dialog State
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);

  const handleMarkAsPaid = (id) => {
    setSelectedInvoiceId(id);
    setPaymentDate(new Date().toISOString().split('T')[0]);
    setPaymentDialogOpen(true);
  };

  const confirmPayment = () => {
    if (selectedInvoiceId) {
      updateInvoice(selectedInvoiceId, { 
        status: 'Paid', 
        paid_at: new Date(paymentDate).toISOString() 
      });
      setPaymentDialogOpen(false);
      setSelectedInvoiceId(null);
    }
  };

  const totalRevenue = useMemo(() => {
    return invoices
      .filter(inv => inv.status === 'Paid')
      .reduce((sum, inv) => sum + inv.total_amount, 0);
  }, [invoices]);

  const pendingRevenue = useMemo(() => {
    // Total project value across all projects (with client revenue fallback)
    const totalProjectValue = clients.reduce((sum, client) => {
      const clientProjects = projects.filter(p => p.client_id === client.id);
      const budgetFromProjects = clientProjects.reduce((s, p) => s + (parseFloat(p.budget) || 0), 0);
      const clientRevenue = parseFloat(client.revenue) || 0;
      return sum + (budgetFromProjects > 0 ? budgetFromProjects : clientRevenue);
    }, 0);
    
    return Math.max(totalProjectValue - totalRevenue, 0);
  }, [clients, projects, invoices, totalRevenue]);

  const totalExpenses = useMemo(() => {
    return expenses.reduce((sum, exp) => sum + exp.amount, 0);
  }, [expenses]);

  const netProfit = totalRevenue - totalExpenses;

  const stats = [
    { icon: TrendingUp, label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, trend: 'up', trendValue: 'Growth', color: '#10b981' },
    { icon: Receipt, label: 'Pending Revenue', value: `₹${pendingRevenue.toLocaleString('en-IN')}`, trend: pendingRevenue > 0 ? 'down' : 'up', trendValue: pendingRevenue > 0 ? 'Uncollected' : 'Settled', color: '#f59e0b' },
    { icon: TrendingDown, label: 'Total Expenses', value: `₹${totalExpenses.toLocaleString('en-IN')}`, trend: 'down', trendValue: 'Studio costs', color: '#f43f5e' },
    { icon: DollarSign, label: 'Net Profit', value: `₹${netProfit.toLocaleString('en-IN')}`, trend: 'up', trendValue: 'Net', color: '#8b5cf6' },
  ];

  const handleDownloadInvoice = (invoice) => {
    const client = clients.find(c => c.id === invoice.client_id) || { name: 'Unknown' };
    const project = projects.find(p => p.id === invoice.project_id) || { name: 'Unknown' };
    generateInvoicePDF(invoice, client, project);
  };

  return (
    <Container maxWidth={false} sx={{ py: { xs: 3, md: 4 }, px: { xs: 2, sm: 3, md: 5 } }}>
      <Box sx={{ mb: 6, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={600} sx={{ letterSpacing: '-0.02em', mb: 1, fontSize: { xs: '1.75rem', md: '2.125rem' } }}>Financial Hub</Typography>
          <Typography variant="body1" color="text.secondary">Manage your studio's cashflow, invoices, and profitability.</Typography>
        </Box>
        <Stack direction="row" spacing={2} sx={{ width: { xs: '100%', md: 'auto' } }}>
          <Button 
            fullWidth={false}
            variant="outlined" 
            startIcon={<TrendingDown size={18} />} 
            onClick={() => setIsExpenseModalOpen(true)}
            sx={{ borderRadius: 3, flex: { xs: 1, md: 'none' } }}
          >
            Add Expense
          </Button>
          <Button 
            fullWidth={false}
            variant="contained" 
            startIcon={<Plus size={18} />} 
            onClick={() => setIsInvoiceModalOpen(true)}
            sx={{ borderRadius: 3, flex: { xs: 1, md: 'none' } }}
          >
            New Invoice
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={{ xs: 3, md: 4 }} sx={{ mb: 6 }}>
        {stats.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <StatCard {...stat} />
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ borderRadius: 5, overflow: 'hidden', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
        <Box sx={{ px: 3, pt: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
            <Tab label="Invoices" sx={{ fontWeight: 600, py: 2.5 }} />
            <Tab label="Expenses" sx={{ fontWeight: 600, py: 2.5 }} />
          </Tabs>
        </Box>

        <Box sx={{ p: 0 }}>
          {activeTab === 0 ? (
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: 'action.hover' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Invoice #</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Project</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Due Date</TableCell>
                    <TableCell sx={{ fontWeight: 600, textAlign: 'right', minWidth: 140 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                        <Box sx={{ color: 'text.disabled', textAlign: 'center' }}>
                          <FileText size={48} strokeWidth={1} style={{ marginBottom: 16 }} />
                          <Typography variant="body1">No invoices found</Typography>
                          <Button size="small" onClick={() => setIsInvoiceModalOpen(true)} sx={{ mt: 1 }}>Create your first invoice</Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    invoices.map((inv) => (
                      <TableRow key={inv.id} hover>
                        <TableCell sx={{ fontWeight: 500 }}>{inv.invoice_number}</TableCell>
                        <TableCell>{projects.find(p => p.id === inv.project_id)?.name || 'Deleted Project'}</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>₹{inv.total_amount.toLocaleString('en-IN')}</TableCell>
                        <TableCell>
                          <Chip 
                            label={inv.status} 
                            size="small" 
                            sx={{ 
                              fontWeight: 600, 
                              fontSize: '0.65rem',
                              bgcolor: inv.status === 'Paid' ? '#10b98120' : '#f59e0b20',
                              color: inv.status === 'Paid' ? '#10b981' : '#f59e0b',
                              border: '1px solid',
                              borderColor: inv.status === 'Paid' ? '#10b98140' : '#f59e0b40'
                            }} 
                          />
                        </TableCell>
                        <TableCell>{inv.due_date || 'N/A'}</TableCell>
                        <TableCell sx={{ textAlign: 'right', minWidth: 140 }}>
                          <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
                            {inv.status !== 'Paid' && (
                              <Tooltip title="Mark as Paid">
                                <IconButton size="small" sx={{ color: '#10b981' }} onClick={() => handleMarkAsPaid(inv.id)}>
                                  <CheckCircle size={18} />
                                </IconButton>
                              </Tooltip>
                            )}
                            <Tooltip title="Download PDF">
                              <IconButton size="small" onClick={() => handleDownloadInvoice(inv)}>
                                <Download size={18} />
                              </IconButton>
                            </Tooltip>
                            <IconButton size="small" color="error" onClick={() => deleteInvoice(inv.id)}>
                              <Trash2 size={18} />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: 'action.hover' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Project</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {expenses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                        <Box sx={{ color: 'text.disabled', textAlign: 'center' }}>
                          <Receipt size={48} strokeWidth={1} style={{ marginBottom: 16 }} />
                          <Typography variant="body1">No expenses tracked yet</Typography>
                          <Button size="small" onClick={() => setIsExpenseModalOpen(true)} sx={{ mt: 1 }}>Add your first expense</Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    expenses.map((exp) => (
                      <TableRow key={exp.id} hover>
                        <TableCell sx={{ fontWeight: 500 }}>{exp.description}</TableCell>
                        <TableCell>
                          <Chip label={exp.category} size="small" sx={{ fontSize: '0.7rem', fontWeight: 500 }} />
                        </TableCell>
                        <TableCell>{projects.find(p => p.id === exp.project_id)?.name || 'General'}</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: 'error.main' }}>₹{exp.amount.toLocaleString('en-IN')}</TableCell>
                        <TableCell>{new Date(exp.date).toLocaleDateString()}</TableCell>
                        <TableCell align="right">
                          <IconButton size="small" color="error" onClick={() => deleteExpense(exp.id)}>
                            <Trash2 size={18} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Paper>

      {/* Modals */}
      <InvoiceModal 
        open={isInvoiceModalOpen} 
        onClose={() => setIsInvoiceModalOpen(false)} 
      />
      <ExpenseModal 
        open={isExpenseModalOpen} 
        onClose={() => setIsExpenseModalOpen(false)} 
      />

      {/* Payment Date Dialog */}
      <Dialog 
        open={paymentDialogOpen} 
        onClose={() => setPaymentDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Record Payment Date</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            When was this invoice paid? This helps keep your revenue charts accurate.
          </Typography>
          <TextField
            autoFocus
            label="Payment Date"
            type="date"
            fullWidth
            variant="outlined"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            slotProps={{
              inputLabel: { shrink: true }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setPaymentDialogOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={confirmPayment} variant="contained" sx={{ borderRadius: 2, px: 3 }}>
            Confirm Paid
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Billing;
