import React from 'react';
import { Box, Paper, Typography, Stack, Button, IconButton, Grid, List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction, Divider } from '@mui/material';
import { Plus, File, Link as LinkIcon, Download, MoreVertical, ExternalLink } from 'lucide-react';

const ResourceCenter = ({ project }) => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: '-0.02em', mb: 0.5 }}>Resource Hub</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>Centralized project assets and documentation</Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button 
            variant="outlined" 
            startIcon={<LinkIcon size={18} />}
            sx={{ borderRadius: 2.5, fontWeight: 700 }}
          >
            Add Link
          </Button>
          <Button 
            variant="contained" 
            startIcon={<Plus size={18} />}
            sx={{ borderRadius: 2.5 }}
          >
            Upload File
          </Button>
        </Stack>
      </Box>

      <Paper 
        elevation={0}
        sx={{ 
          borderRadius: 6, 
          overflow: 'hidden', 
          border: '1px solid', 
          borderColor: 'divider',
          bgcolor: 'background.paper'
        }}
      >
        <List sx={{ p: 0 }}>
          {project.resources?.length > 0 ? (
            project.resources.map((resource, index) => (
              <React.Fragment key={resource.id}>
                <ListItem 
                  sx={{ 
                    py: 3, 
                    px: 4,
                    transition: 'all 0.2s ease',
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 64 }}>
                    <Box 
                      sx={{ 
                        p: 2, 
                        borderRadius: 3, 
                        bgcolor: resource.type === 'link' ? 'rgba(59, 130, 246, 0.08)' : 'rgba(16, 185, 129, 0.08)',
                        color: resource.type === 'link' ? '#3b82f6' : '#10b981',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {resource.type === 'link' ? <LinkIcon size={22} /> : <File size={22} />}
                    </Box>
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Typography variant="subtitle1" sx={{ fontWeight: 850, mb: 0.2 }}>
                        {resource.name}
                      </Typography>
                    }
                    secondary={
                      <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                          {resource.type === 'link' ? 'External Web Link' : 'PDF Document • 2.4 MB'}
                        </Typography>
                        <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'rgba(0,0,0,0.1)' }} />
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.disabled' }}>
                          Added by Alex R. • 2 days ago
                        </Typography>
                      </Stack>
                    }
                  />
                  <ListItemSecondaryAction sx={{ right: 32 }}>
                    <Stack direction="row" spacing={1}>
                      <IconButton 
                        size="small" 
                        sx={{ 
                          bgcolor: 'action.hover', 
                          '&:hover': { bgcolor: 'primary.main', color: 'primary.contrastText' } 
                        }}
                      >
                        {resource.type === 'link' ? <ExternalLink size={18} /> : <Download size={18} />}
                      </IconButton>
                      <IconButton size="small"><MoreVertical size={18} /></IconButton>
                    </Stack>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < project.resources.length - 1 && <Divider sx={{ mx: 4, opacity: 0.5 }} />}
              </React.Fragment>
            ))
          ) : (
            <Box sx={{ py: 10, textAlign: 'center' }}>
              <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 600 }}>No resources available for this project.</Typography>
              <Button variant="text" startIcon={<Plus size={18} />} sx={{ mt: 2, fontWeight: 700 }}>Add your first resource</Button>
            </Box>
          )}
        </List>
      </Paper>
    </Box>
  );
};

export default ResourceCenter;
