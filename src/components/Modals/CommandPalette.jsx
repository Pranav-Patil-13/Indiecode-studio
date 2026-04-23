import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  Box, 
  InputBase, 
  Typography, 
  List, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Divider,
  Paper,
  alpha,
  useTheme
} from '@mui/material';
import { 
  Search, 
  Briefcase, 
  Users, 
  MessageSquare, 
  LayoutDashboard, 
  Settings,
  Command,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const CommandPalette = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isCommandPaletteOpen, closeCommandPalette, projects, clients } = useApp();
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        isCommandPaletteOpen ? closeCommandPalette() : window.dispatchEvent(new CustomEvent('toggle-command-palette'));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, closeCommandPalette]);

  // Handle local toggle if needed, but AppContext is the source of truth
  useEffect(() => {
    const toggleHandler = () => {
      // This is just a bridge if we need it, but useApp is better
    };
    window.addEventListener('toggle-command-palette', toggleHandler);
    return () => window.removeEventListener('toggle-command-palette', toggleHandler);
  }, []);

  const filteredItems = [
    { category: 'Navigation', items: [
      { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/' },
      { id: 'projects', label: 'Projects', icon: <Briefcase size={18} />, path: '/projects' },
      { id: 'clients', label: 'Clients', icon: <Users size={18} />, path: '/clients' },
      { id: 'messages', label: 'Messages', icon: <MessageSquare size={18} />, path: '/messages' },
      { id: 'settings', label: 'Settings', icon: <Settings size={18} />, path: '/settings' },
    ]},
    { category: 'Projects', items: projects.map(p => ({ id: `p-${p.id}`, label: p.name, icon: <Briefcase size={18} />, path: `/projects/${p.id}`, subtitle: p.client })) },
    { category: 'Clients', items: clients.map(c => ({ id: `c-${c.id}`, label: c.name, icon: <Users size={18} />, path: '/clients', subtitle: c.industry })) }
  ].map(cat => ({
    ...cat,
    items: cat.items.filter(item => 
      item.label.toLowerCase().includes(search.toLowerCase()) || 
      (item.subtitle && item.subtitle.toLowerCase().includes(search.toLowerCase()))
    )
  })).filter(cat => cat.items.length > 0);

  const flatItems = filteredItems.flatMap(cat => cat.items);

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        isCommandPaletteOpen ? closeCommandPalette() : window.dispatchEvent(new CustomEvent('toggle-command-palette'));
        return;
      }

      if (!isCommandPaletteOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % flatItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + flatItems.length) % flatItems.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (flatItems[selectedIndex]) {
          handleSelect(flatItems[selectedIndex].path);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, closeCommandPalette, flatItems, selectedIndex]);

  // Handle local toggle if needed, but AppContext is the source of truth
  useEffect(() => {
    const toggleHandler = () => {
      // This is just a bridge if we need it, but useApp is better
    };
    window.addEventListener('toggle-command-palette', toggleHandler);
    return () => window.removeEventListener('toggle-command-palette', toggleHandler);
  }, []);

  const handleSelect = (path) => {
    navigate(path);
    closeCommandPalette();
    setSearch('');
  };

  return (
    <Dialog 
      open={isCommandPaletteOpen} 
      onClose={closeCommandPalette}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 4,
          bgcolor: theme.palette.mode === 'light' ? 'white' : 'rgba(18, 18, 20, 0.95)',
          backdropFilter: 'blur(12px)',
          border: theme.palette.mode === 'light' ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.2)',
          backgroundImage: 'none',
          overflow: 'hidden',
          top: '-15%' // Shift up slightly
        }
      }}
    >
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Search size={22} color={theme.palette.text.secondary} />
        <InputBase 
          autoFocus
          fullWidth
          placeholder="Search for anything..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ 
            fontSize: '1.1rem', 
            fontWeight: 500,
            color: theme.palette.text.primary
          }}
        />
        <Box 
          sx={{ 
            px: 1, 
            py: 0.5, 
            borderRadius: 1.5, 
            bgcolor: alpha(theme.palette.text.disabled, 0.1),
            display: 'flex',
            alignItems: 'center',
            gap: 0.5
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 800 }}>ESC</Typography>
        </Box>
      </Box>
      
      <Divider />

      <Box sx={{ maxHeight: 450, overflowY: 'auto', p: 1.5 }}>
        {filteredItems.length > 0 ? (
          filteredItems.map((cat, idx) => (
            <Box key={cat.category} sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ px: 1.5, mb: 1, display: 'block', fontWeight: 800, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: 1 }}>
                {cat.category}
              </Typography>
              <List sx={{ p: 0 }}>
                {cat.items.map((item) => {
                  const isSelected = flatItems[selectedIndex]?.id === item.id;
                  return (
                    <ListItemButton 
                      key={item.id}
                      onClick={() => handleSelect(item.path)}
                      selected={isSelected}
                      sx={{ 
                        borderRadius: 3, 
                        mb: 0.5,
                        transition: 'all 0.2s ease',
                        bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                        '&.Mui-selected': {
                          bgcolor: alpha(theme.palette.primary.main, 0.12),
                          '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.18) }
                        },
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.05),
                          '& .MuiListItemIcon-root': { color: 'primary.main' },
                          '& .arrow-icon': { opacity: 1, transform: 'translateX(0)' }
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 44, color: isSelected ? 'primary.main' : 'text.secondary' }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={<Typography variant="body2" sx={{ fontWeight: 700, color: isSelected ? 'primary.main' : 'text.primary' }}>{item.label}</Typography>}
                        secondary={item.subtitle && <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{item.subtitle}</Typography>}
                      />
                      <ArrowRight 
                        className="arrow-icon"
                        size={16} 
                        style={{ 
                          opacity: isSelected ? 1 : 0, 
                          transform: isSelected ? 'translateX(0)' : 'translateX(-10px)', 
                          transition: 'all 0.2s ease',
                          color: theme.palette.primary.main 
                        }} 
                      />
                    </ListItemButton>
                  );
                })}
              </List>
            </Box>
          ))
        ) : (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>No results found for "{search}"</Typography>
          </Box>
        )}
      </Box>

      <Divider />
      
      <Box sx={{ p: 1.5, bgcolor: alpha(theme.palette.text.disabled, 0.03), display: 'flex', gap: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ p: 0.5, borderRadius: 1, bgcolor: alpha(theme.palette.text.disabled, 0.1), display: 'flex' }}>
            <Typography sx={{ fontSize: '10px', fontWeight: 800 }}>↵</Typography>
          </Box>
          <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>to select</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ p: 0.5, borderRadius: 1, bgcolor: alpha(theme.palette.text.disabled, 0.1), display: 'flex' }}>
            <Typography sx={{ fontSize: '10px', fontWeight: 800 }}>↑↓</Typography>
          </Box>
          <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>to navigate</Typography>
        </Box>
      </Box>
    </Dialog>
  );
};

export default CommandPalette;
