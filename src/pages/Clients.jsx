import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  TextField, 
  InputAdornment, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Avatar, 
  IconButton, 
  Chip,
  Stack,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Phone, ExternalLink, MoreVertical, Plus, Search, Edit, Trash2, Archive, CreditCard } from 'lucide-react';
import { useApp } from '../context/AppContext';
import AddClientModal from '../components/Modals/AddClientModal';
import InvoiceModal from '../components/Modals/InvoiceModal';
import ConfirmDialog from '../components/Modals/ConfirmDialog';
import { useState } from 'react';

const Clients = () => {
  const navigate = useNavigate();
  const { clients, projects, invoices, showNotification, deleteClient } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [invoiceProject, setInvoiceProject] = useState(null);
  const [editClientData, setEditClientData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const handleOpenInvoiceModal = () => {
    const clientProject = projects.find(p => p.client_id === selectedClient.id);
    if (!clientProject) {
      showNotification('Please create a project for this client first to generate an invoice.', 'warning');
      setAnchorEl(null);
      return;
    }
    setInvoiceProject(clientProject);
    setIsInvoiceModalOpen(true);
    setAnchorEl(null);
  };

  const handleMenuOpen = (event, client) => {
    setAnchorEl(event.currentTarget);
    setSelectedClient(client);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClient = () => {
    setEditClientData(selectedClient);
    setIsModalOpen(true);
    setAnchorEl(null);
  };

  const handleGoToProject = (clientId) => {
    const clientProject = projects.find(p => p.client_id === clientId);
    if (clientProject) {
      navigate(`/projects/${clientProject.id}`);
    } else {
      showNotification('This client has no active projects.', 'info');
    }
  };

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4 }, px: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, gap: 3 }}>
        <TextField 
          placeholder="Filter clients by name, email or status..."
          size="small"
          sx={{ maxWidth: { xs: '100%', sm: 400 }, flexGrow: 1 }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} color="#6C757D" />
                </InputAdornment>
              ),
              sx: { bgcolor: 'background.paper', borderRadius: 2.5 }
            }
          }}
        />
        <Button 
          variant="contained" 
          startIcon={<Plus size={18} />}
          sx={{ borderRadius: 2.5, px: 3, whiteSpace: 'nowrap' }}
          onClick={() => { setEditClientData(null); setIsModalOpen(true); }}
        >
          Add Client
        </Button>
      </Box>

      <AddClientModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialData={editClientData} 
      />

      <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid', borderColor: 'divider', borderRadius: 4 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: 1 }}>Client</TableCell>
              <TableCell sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: 1 }}>Contact Person</TableCell>
              <TableCell sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: 1 }}>Projects</TableCell>
              <TableCell sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: 1 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: 1 }}>Collection Progress</TableCell>
              <TableCell sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: 1 }}>Total Value</TableCell>
              <TableCell align="right" sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: 1 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredClients.map((client) => {
              const clientProjects = projects.filter(p => p.client_id === client.id);
              const clientInvoices = invoices.filter(inv => inv.client_id === client.id);
              
              const totalBudgetFromProjects = clientProjects.reduce((sum, p) => sum + (parseFloat(p.budget) || 0), 0);
              const clientLevelRevenue = parseFloat(client.revenue) || 0;
              
              // Priority to project-level budgets, fallback to client-level revenue
              const totalProjectBudget = totalBudgetFromProjects > 0 ? totalBudgetFromProjects : clientLevelRevenue;
              
              const paidAmount = clientInvoices
                .filter(inv => inv.status === 'Paid')
                .reduce((sum, inv) => sum + (parseFloat(inv.total_amount) || 0), 0);
              
              const progress = totalProjectBudget > 0 ? Math.min((paidAmount / totalProjectBudget) * 100, 100) : 0;
              const displayTotal = totalProjectBudget;

              return (
                <TableRow key={client.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar 
                        variant="rounded" 
                        sx={{ 
                          width: 36, 
                          height: 36, 
                          bgcolor: 'action.selected', 
                          color: 'primary.main',
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          borderRadius: 1.5
                        }}
                      >
                        {client.avatar}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{client.name}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.disabled' }}>{client.email}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{client.contact}</Typography>
                      <Stack direction="row" spacing={1} sx={{ color: 'text.disabled', mt: 0.5 }}>
                        <Mail size={14} />
                        <Phone size={14} />
                      </Stack>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{client.projects} Projects</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={client.status} 
                      size="small"
                      sx={{ 
                        borderRadius: 1.5,
                        fontWeight: 500,
                        fontSize: '0.75rem',
                        bgcolor: client.status === 'Active' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 158, 11, 0.08)',
                        color: client.status === 'Active' ? '#10b981' : '#f59e0b',
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ minWidth: 200 }}>
                    <Box sx={{ width: '100%' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" sx={{ fontWeight: 500, color: 'primary.main' }}>
                          ₹{paidAmount.toLocaleString('en-IN')} paid
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {Math.round(progress)}%
                        </Typography>
                      </Box>
                      <Box sx={{ width: '100%', height: 6, bgcolor: 'action.hover', borderRadius: 3, overflow: 'hidden' }}>
                        <Box sx={{ 
                          width: `${progress}%`, 
                          height: '100%', 
                          bgcolor: progress === 100 ? '#10b981' : 'primary.main',
                          transition: 'width 0.5s ease'
                        }} />
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                      ₹{displayTotal.toLocaleString('en-IN')}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end" }}>
                      <IconButton 
                        size="small" 
                        onClick={() => handleGoToProject(client.id)}
                        title="Go to Project"
                      >
                        <ExternalLink size={16} />
                      </IconButton>
                      <IconButton 
                        size="small"
                        onClick={(e) => handleMenuOpen(e, client)}
                      >
                        <MoreVertical size={16} />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: { borderRadius: 3, minWidth: 160, mt: 1, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }
        }}
      >
        <MenuItem onClick={handleOpenInvoiceModal}>
          <ListItemIcon><CreditCard size={16} /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }}>Generate Invoice</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleEditClient}>
          <ListItemIcon><Edit size={16} /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }}>Edit Client</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { showNotification('Archive feature coming soon!', 'info'); handleMenuClose(); }}>
          <ListItemIcon><Archive size={16} /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }}>Archive</ListItemText>
        </MenuItem>
        <MenuItem 
          onClick={() => { 
            setIsDeleteConfirmOpen(true);
            handleMenuClose(); 
          }}
          sx={{ color: 'error.main', '& .MuiListItemIcon-root': { color: 'error.main' } }}
        >
          <ListItemIcon><Trash2 size={16} /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }}>Delete</ListItemText>
        </MenuItem>
      </Menu>

      <InvoiceModal 
        open={isInvoiceModalOpen} 
        onClose={() => setIsInvoiceModalOpen(false)} 
        project={invoiceProject} 
      />

      <ConfirmDialog 
        open={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={() => deleteClient(selectedClient?.id)}
        title="Delete Client"
        message={`Are you sure you want to delete "${selectedClient?.name}"? All associated project data will be affected.`}
        confirmText="Delete Client"
        severity="error"
      />

    </Container>
  );
};

export default Clients;
