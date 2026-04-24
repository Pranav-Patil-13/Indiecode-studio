import React, { useState, useMemo } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Paper, 
  Stack, 
  Grid, 
  Chip, 
  LinearProgress,
  Button,
  Avatar,
  Divider,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  IconButton
} from '@mui/material';
import { 
  CheckCircle2, 
  Clock, 
  Calendar, 
  MessageSquare, 
  TrendingUp,
  FileText,
  ChevronRight,
  Receipt,
  Download
} from 'lucide-react';
import { generateInvoicePDF } from '../utils/pdfGenerator';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import ProjectRoadmap from '../components/Projects/ProjectDetails/ProjectRoadmap';
import Messages from './Messages';

const ClientPortal = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { projects, clients, invoices, loading } = useApp();
  const [activeTab, setActiveTab] = useState('roadmap'); // 'roadmap', 'messages', 'billing'
  const { user } = useApp();
  
  // AppContext now filters 'clients' so clients[0] is the logged-in client.
  // For admins previewing the portal, it will show the first client's data.
  const client = clients[0];
  const clientProjects = useMemo(() => 
    projects.filter(p => p.client_id === client?.id), 
  [projects, client]);

  const [selectedProjectId, setSelectedProjectId] = useState(null);

  React.useEffect(() => {
    if (!selectedProjectId && clientProjects.length > 0) {
      setSelectedProjectId(clientProjects[0].id);
    }
  }, [clientProjects, selectedProjectId]);

  const project = clientProjects.find(p => p.id === selectedProjectId);

  if (loading) return null;
  if (!client) return (
    <Box sx={{ height: 'calc(100vh - 70px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box textAlign="center" maxWidth={400}>
        <Typography variant="h5" fontWeight={600} gutterBottom>Account Pending Setup</Typography>
        <Typography color="text.secondary">Your client profile is pending setup by the studio administrator. Please contact your project manager for assistance.</Typography>
      </Box>
    </Box>
  );

  const handleDownloadInvoice = (invoice) => {
    generateInvoicePDF(invoice, client, project || { name: 'Unknown Project' });
  };

  return (
    <Container maxWidth={false} sx={{ py: 6, px: { md: 8 } }}>
      <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Box>
          <Typography variant="h3" fontWeight={600} sx={{ letterSpacing: '-0.04em', mb: 1 }}>
            Welcome back, {client.name.split(' ')[0]}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track your project progress, approve milestones, and manage billing.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} sx={{ bgcolor: 'action.hover', p: 0.5, borderRadius: 3 }}>
          <Button 
            variant={activeTab === 'roadmap' ? "contained" : "text"} 
            onClick={() => setActiveTab('roadmap')}
            sx={{ borderRadius: 2.5, px: 3, fontWeight: 500, color: activeTab === 'roadmap' ? 'primary.contrastText' : 'text.secondary', boxShadow: activeTab === 'roadmap' ? 1 : 'none' }}
          >
            Roadmap
          </Button>
          <Button 
            variant={activeTab === 'messages' ? "contained" : "text"} 
            onClick={() => setActiveTab('messages')}
            sx={{ borderRadius: 2.5, px: 3, fontWeight: 500, color: activeTab === 'messages' ? 'primary.contrastText' : 'text.secondary', boxShadow: activeTab === 'messages' ? 1 : 'none' }}
          >
            Messages
          </Button>
          <Button 
            variant={activeTab === 'billing' ? "contained" : "text"} 
            onClick={() => setActiveTab('billing')}
            sx={{ borderRadius: 2.5, px: 3, fontWeight: 500, color: activeTab === 'billing' ? 'primary.contrastText' : 'text.secondary', boxShadow: activeTab === 'billing' ? 1 : 'none' }}
          >
            Billing
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={6}>
        {/* Left Sidebar: My Projects */}
        <Grid item xs={12} md={4} lg={3}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, textTransform: 'uppercase', letterSpacing: 1, color: 'text.disabled' }}>
            My Projects
          </Typography>
          <Stack spacing={2}>
            {clientProjects.map((p) => (
              <Paper 
                key={p.id}
                onClick={() => setSelectedProjectId(p.id)}
                sx={{ 
                  p: 2.5, 
                  borderRadius: 4, 
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: selectedProjectId === p.id ? 'primary.main' : 'divider',
                  bgcolor: selectedProjectId === p.id ? `${theme.palette.primary.main}08` : 'background.paper',
                  transition: 'all 0.2s ease',
                  '&:hover': { transform: 'translateX(5px)' }
                }}
              >
                <Typography variant="subtitle1" fontWeight={600}>{p.name}</Typography>
                <Box sx={{ mt: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">Progress</Typography>
                    <Typography variant="caption" fontWeight={600}>{p.progress}%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={p.progress} sx={{ height: 4, borderRadius: 2 }} />
                </Box>
              </Paper>
            ))}
          </Stack>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={8} lg={9}>
          {activeTab === 'messages' ? (
            <Paper sx={{ p: 0, borderRadius: 6, overflow: 'hidden', border: '1px solid', borderColor: 'divider', height: 'calc(100vh - 250px)' }}>
              <Messages isClientPortal={true} />
            </Paper>
          ) : activeTab === 'billing' ? (
            <Paper sx={{ borderRadius: 6, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
              <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                <Typography variant="h6" fontWeight={600}>Invoices & Billing</Typography>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead sx={{ bgcolor: 'action.hover' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Invoice #</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Project</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Due Date</TableCell>
                      <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {invoices.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                          <Box sx={{ color: 'text.disabled', textAlign: 'center' }}>
                            <Receipt size={48} strokeWidth={1} style={{ marginBottom: 16 }} />
                            <Typography variant="body1">No invoices found for your account.</Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : (
                      invoices.map((inv) => (
                        <TableRow key={inv.id} hover>
                          <TableCell sx={{ fontWeight: 500 }}>{inv.invoice_number}</TableCell>
                          <TableCell>{projects.find(p => p.id === inv.project_id)?.name || 'Project'}</TableCell>
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
                              }} 
                            />
                          </TableCell>
                          <TableCell>{inv.due_date || 'N/A'}</TableCell>
                          <TableCell sx={{ textAlign: 'right' }}>
                            <Tooltip title="Download PDF">
                              <IconButton size="small" onClick={() => handleDownloadInvoice(inv)}>
                                <Download size={18} />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          ) : project ? (
            <Box>
              <Paper 
                sx={{ 
                  p: 4, 
                  borderRadius: 6, 
                  mb: 4, 
                  border: '1px solid', 
                  borderColor: 'divider',
                  bgcolor: 'background.paper'
                }}
              >
                <Stack direction="row" spacing={3} sx={{ alignItems: 'center', mb: 4 }}>
                  <Box sx={{ width: 64, height: 64, borderRadius: 3, bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <TrendingUp size={32} />
                  </Box>
                  <Box>
                    <Typography variant="h5" fontWeight={600}>{project.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{project.description}</Typography>
                  </Box>
                </Stack>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 3 }}>
                      <Typography variant="caption" color="text.disabled" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>Status</Typography>
                      <Typography variant="subtitle1" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <CheckCircle2 size={18} color="#10b981" /> {project.status}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 3 }}>
                      <Typography variant="caption" color="text.disabled" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>Delivery</Typography>
                      <Typography variant="subtitle1" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Calendar size={18} color={theme.palette.primary.main} /> {project.due_date}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 3 }}>
                      <Typography variant="caption" color="text.disabled" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>Team</Typography>
                      <Typography variant="subtitle1" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Avatar sx={{ width: 20, height: 20, fontSize: 10 }}>P</Avatar> IndieCode Studio
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>

              <Box sx={{ mt: 6 }}>
                <ProjectRoadmap project={project} isClientView={true} />
              </Box>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 10 }}>
              <Typography color="text.secondary">Select a project to view details.</Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ClientPortal;
