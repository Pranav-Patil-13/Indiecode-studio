import React, { useRef, useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Stack, 
  Button, 
  IconButton, 
  Grid, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  ListItemSecondaryAction, 
  Divider,
  CircularProgress
} from '@mui/material';
import { Plus, File, Link as LinkIcon, Download, Trash2, ExternalLink } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { supabase } from '../../../lib/supabase';

const ResourceCenter = ({ project }) => {
  const { user, showNotification, updateProject } = useApp();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${project.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('resources')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('resources')
        .getPublicUrl(filePath);

      const newResource = {
        id: crypto.randomUUID(),
        name: file.name,
        type: 'file',
        url: publicUrl,
        storagePath: filePath,
        added_by: user?.user_metadata?.full_name || user?.email,
        created_at: new Date().toISOString(),
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      };

      const updatedResources = [...(project.resources || []), newResource];
      await updateProject(project.id, { resources: updatedResources });
      showNotification('File uploaded successfully', 'success');
    } catch (error) {
      console.error('Error uploading file:', error);
      showNotification('Error uploading file: ' + error.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteResource = async (resource) => {
    const role = user?.user_metadata?.role || 'admin';
    if (role !== 'admin') {
      showNotification('Only admins can delete resources', 'error');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this resource?')) return;

    try {
      // 1. Delete from storage if it's a file
      if (resource.type === 'file') {
        let filePath = resource.storagePath;
        
        // Fallback: extract from URL if storagePath is missing
        if (!filePath) {
          const urlParts = resource.url.split('/resources/');
          if (urlParts.length > 1) {
            filePath = urlParts[1];
          }
        }

        if (filePath) {
          const { error: storageError } = await supabase.storage
            .from('resources')
            .remove([filePath]);
          
          if (storageError) {
            console.warn('Storage deletion warning:', storageError);
            // We continue even if storage delete fails (file might be gone already)
          }
        }
      }

      // 2. Update database
      const updatedResources = project.resources.filter(r => r.id !== resource.id);
      await updateProject(project.id, { resources: updatedResources });
      showNotification('Resource deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting resource:', error);
      showNotification('Error deleting resource: ' + error.message, 'error');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 4 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 500, letterSpacing: '-0.02em', mb: 0.5 }}>Resource Hub</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>Centralized project assets and documentation</Typography>
        </Box>
        <Stack direction="row" spacing={2} sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileUpload}
          />
          <Button 
            variant="outlined" 
            fullWidth
            startIcon={<LinkIcon size={18} />}
            sx={{ borderRadius: 2.5, fontWeight: 500 }}
          >
            Add Link
          </Button>
          <Button 
            variant="contained" 
            fullWidth
            startIcon={uploading ? <CircularProgress size={18} color="inherit" /> : <Plus size={18} />}
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            sx={{ borderRadius: 2.5 }}
          >
            {uploading ? 'Uploading...' : 'Upload File'}
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
                    px: { xs: 2, sm: 4 },
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: { xs: 2, sm: 0 },
                    transition: 'all 0.2s ease',
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: { xs: 'auto', sm: 64 } }}>
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
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.2, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                        {resource.name}
                      </Typography>
                    }
                    secondary={
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 0.5, sm: 2 }} sx={{ alignItems: { xs: 'flex-start', sm: 'center' } }}>
                        <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                          {resource.type === 'link' ? 'External Web Link' : `Document • ${resource.size || 'Unknown'}`}
                        </Typography>
                        <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'rgba(0,0,0,0.1)', display: { xs: 'none', sm: 'block' } }} />
                        <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.disabled' }}>
                          Added by {resource.added_by || 'Unknown'} • {new Date(resource.created_at).toLocaleDateString()}
                        </Typography>
                      </Stack>
                    }
                  />
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 1, 
                    ml: { xs: 0, sm: 'auto' }, 
                    width: { xs: '100%', sm: 'auto' }, 
                    justifyContent: { xs: 'flex-end', sm: 'flex-start' } 
                  }}>
                    <IconButton 
                      size="small" 
                      component="a"
                      href={resource.url}
                      target="_blank"
                      sx={{ 
                        bgcolor: 'action.hover', 
                        '&:hover': { bgcolor: 'primary.main', color: 'primary.contrastText' } 
                      }}
                    >
                      {resource.type === 'link' ? <ExternalLink size={18} /> : <Download size={18} />}
                    </IconButton>
                    {(user?.user_metadata?.role || 'admin') === 'admin' && (
                      <IconButton 
                        size="small"
                        onClick={() => handleDeleteResource(resource)}
                        sx={{ 
                          bgcolor: 'action.hover',
                          color: 'error.main',
                          '&:hover': { bgcolor: 'error.main', color: 'white' }
                        }}
                      >
                        <Trash2 size={18} />
                      </IconButton>
                    )}
                  </Box>
                </ListItem>
                {index < project.resources.length - 1 && <Divider sx={{ mx: 4, opacity: 0.5 }} />}
              </React.Fragment>
            ))
          ) : (
            <Box sx={{ py: 10, textAlign: 'center' }}>
              <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>No resources available for this project.</Typography>
              <Button 
                variant="text" 
                startIcon={<Plus size={18} />} 
                onClick={() => fileInputRef.current?.click()}
                sx={{ mt: 2, fontWeight: 500 }}
              >
                Add your first resource
              </Button>
            </Box>
          )}
        </List>
      </Paper>
    </Box>
  );
};

export default ResourceCenter;
