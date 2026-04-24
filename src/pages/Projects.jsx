import React, { useState } from 'react';
import { Container, Box, Typography, Button, TextField, InputAdornment, IconButton, Grid, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Plus, 
  Grid as GridIcon, 
  List as ListIcon,
  ChevronDown
} from 'lucide-react';
import ProjectCard from '../components/Projects/ProjectCard';
import { useApp } from '../context/AppContext';


const Projects = () => {
  const [viewType, setViewType] = useState('grid');
  const { projects, openAddProjectModal, clients, loading } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  if (loading) return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography variant="h6" color="text.secondary">Loading projects...</Typography>
      </Box>
    </Container>
  );

  const filteredProjects = projects.filter(project => {
    const clientName = clients.find(c => c.id === project.client_id)?.name || '';
    return project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           clientName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4 }, px: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', md: 'center' }, gap: 3 }}>
        <Stack direction="row" spacing={2} sx={{ flexGrow: 1, maxWidth: { md: 600 } }}>
          <TextField 
            fullWidth
            placeholder="Search projects, clients..."
            size="small"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={18} color="#6C757D" />
                  </InputAdornment>
                ),
                sx: { bgcolor: 'white', borderRadius: 2.5 }
              }
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button 
            variant="outlined" 
            color="inherit" 
            startIcon={<Filter size={18} />}
            endIcon={<ChevronDown size={14} />}
            sx={{ 
              borderColor: 'rgba(0, 0, 0, 0.08)', 
              bgcolor: 'white',
              whiteSpace: 'nowrap',
              '&:hover': { borderColor: 'rgba(0, 0, 0, 0.15)', bgcolor: 'rgba(0, 0, 0, 0.02)' }
            }}
          >
            Filters
          </Button>
        </Stack>

        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <Box sx={{ p: 0.5, bgcolor: 'rgba(0, 0, 0, 0.04)', borderRadius: 2, display: 'flex' }}>
            <IconButton 
              size="small" 
              onClick={() => setViewType('grid')}
              sx={{ 
                borderRadius: 1.5, 
                bgcolor: viewType === 'grid' ? 'white' : 'transparent',
                boxShadow: viewType === 'grid' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                color: viewType === 'grid' ? 'primary.main' : 'text.disabled'
              }}
            >
              <GridIcon size={18} />
            </IconButton>
            <IconButton 
              size="small" 
              onClick={() => setViewType('list')}
              sx={{ 
                borderRadius: 1.5, 
                bgcolor: viewType === 'list' ? 'white' : 'transparent',
                boxShadow: viewType === 'list' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                color: viewType === 'list' ? 'primary.main' : 'text.disabled'
              }}
            >
              <ListIcon size={18} />
            </IconButton>
          </Box>
          <Button 
            variant="contained" 
            startIcon={<Plus size={18} />}
            sx={{ borderRadius: 2.5, px: 3 }}
            onClick={openAddProjectModal}
          >
            New Project
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={viewType === 'grid' ? 4 : 2}>
        {filteredProjects.map((project, index) => (
          <Grid size={viewType === 'grid' ? { xs: 12, md: 6, lg: 4 } : { xs: 12 }} key={project.id}>
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ProjectCard project={project} variant={viewType} />
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Projects;
