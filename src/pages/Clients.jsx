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
  Stack
} from '@mui/material';
import { motion } from 'framer-motion';
import { Mail, Phone, ExternalLink, MoreVertical, Plus, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import AddClientModal from '../components/Modals/AddClientModal';
import { useState } from 'react';

const Clients = () => {
  const { clients } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextField 
          placeholder="Filter clients by name, email or status..."
          size="small"
          sx={{ maxWidth: 400, flexGrow: 1 }}
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
          sx={{ borderRadius: 2.5, px: 3 }}
          onClick={() => setIsModalOpen(true)}
        >
          Add Client
        </Button>
      </Box>

      <AddClientModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid', borderColor: 'divider', borderRadius: 4 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: 1 }}>Client</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: 1 }}>Contact Person</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: 1 }}>Projects</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: 1 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: 1 }}>Total Revenue</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: 1 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredClients.map((client) => (
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
                        fontWeight: 700,
                        borderRadius: 1.5
                      }}
                    >
                      {client.avatar}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{client.name}</Typography>
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
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      bgcolor: client.status === 'Active' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 158, 11, 0.08)',
                      color: client.status === 'Active' ? '#10b981' : '#f59e0b',
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>{client.revenue}</Typography>
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end" }}>
                    <IconButton size="small"><ExternalLink size={16} /></IconButton>
                    <IconButton size="small"><MoreVertical size={16} /></IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Clients;
