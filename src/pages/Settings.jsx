import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Paper, 
  Tabs, 
  Tab, 
  TextField, 
  Button, 
  Avatar, 
  IconButton, 
  Switch, 
  FormControlLabel, 
  Divider, 
  Grid, 
  Stack,
  Card,
  CardContent,
  useTheme,
  alpha
} from '@mui/material';
import { 
  Camera, 
  User, 
  Bell, 
  Lock, 
  Key, 
  Globe, 
  Moon, 
  Sun,
  Palette,
  Layout,
  Mail,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 4 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const Settings = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const { showNotification, themeMode, toggleTheme, accentColor, setAccentColor } = useApp();

  const accentColors = [
    { name: 'Midnight', color: '#212529' },
    { name: 'Indigo', color: '#6366f1' },
    { name: 'Rose', color: '#f43f5e' },
    { name: 'Emerald', color: '#10b981' },
    { name: 'Amber', color: '#f59e0b' },
    { name: 'Violet', color: '#8b5cf6' },
  ];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSave = () => {
    showNotification('Settings saved successfully!');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 500, mb: 1, fontFamily: "'Outfit', sans-serif" }}>
        Settings
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Manage your account settings, preferences and system configurations.
      </Typography>

      <Paper sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          sx={{ 
            px: 3, 
            pt: 2, 
            borderBottom: '1px solid',
            borderColor: 'divider',
            '& .MuiTab-root': {
              fontWeight: 500,
              textTransform: 'none',
              fontSize: '0.9rem',
              minWidth: 120,
              py: 2
            }
          }}
        >
          <Tab icon={<User size={18} />} iconPosition="start" label="Profile" />
          <Tab icon={<Palette size={18} />} iconPosition="start" label="Preferences" />
          <Tab icon={<ShieldCheck size={18} />} iconPosition="start" label="Security & API" />
        </Tabs>

        <Box sx={{ px: { xs: 2, md: 4 } }}>
          {/* Profile Tab */}
          <TabPanel value={activeTab} index={0}>
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{ position: 'relative', display: 'inline-block' }}>
                    <Avatar 
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop"
                      sx={{ width: 120, height: 120, border: '4px solid white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <IconButton 
                      sx={{ 
                        position: 'absolute', 
                        bottom: 0, 
                        right: 0, 
                        bgcolor: 'primary.main', 
                        color: 'white',
                        '&:hover': { bgcolor: 'primary.dark' }
                      }}
                      size="small"
                    >
                      <Camera size={16} />
                    </IconButton>
                  </Box>
                  <Typography variant="h6" sx={{ mt: 2, fontWeight: 500 }}>Pranav Patil</Typography>
                  <Typography variant="body2" color="text.secondary">Founder & Lead Developer</Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 8 }}>
                <Stack spacing={3}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField label="First Name" fullWidth defaultValue="Pranav" size="small" />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField label="Last Name" fullWidth defaultValue="Patil" size="small" />
                    </Grid>
                  </Grid>
                  <TextField label="Email Address" fullWidth defaultValue="pranav@indiecode.com" size="small" />
                  <TextField label="Bio" fullWidth multiline rows={4} defaultValue="Building the next generation of creative tools for independent developers." size="small" />
                  <Box>
                    <Button variant="contained" onClick={handleSave} sx={{ borderRadius: 2, px: 4 }}>Save Changes</Button>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Preferences Tab */}
          <TabPanel value={activeTab} index={1}>
            <Stack spacing={4}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Layout size={18} /> Interface Appearance
                </Typography>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Card 
                      variant="outlined" 
                      onClick={() => themeMode === 'dark' && toggleTheme()}
                      sx={{ 
                        borderRadius: 4, 
                        cursor: 'pointer', 
                        borderColor: themeMode === 'light' ? 'primary.main' : 'divider', 
                        bgcolor: themeMode === 'light' ? alpha(theme.palette.primary.main, 0.04) : 'transparent',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Sun size={20} color={themeMode === 'light' ? theme.palette.primary.main : 'inherit'} />
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>Light Mode</Typography>
                          <Typography variant="caption" color="text.secondary">Default bright interface</Typography>
                        </Box>
                        <Box sx={{ ml: 'auto' }}>
                          <Switch checked={themeMode === 'light'} size="small" />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Card 
                      variant="outlined" 
                      onClick={() => themeMode === 'light' && toggleTheme()}
                      sx={{ 
                        borderRadius: 4, 
                        cursor: 'pointer', 
                        borderColor: themeMode === 'dark' ? 'primary.main' : 'divider', 
                        bgcolor: themeMode === 'dark' ? alpha(theme.palette.primary.main, 0.04) : 'transparent',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Moon size={20} color={themeMode === 'dark' ? theme.palette.primary.main : 'inherit'} />
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>Dark Mode</Typography>
                          <Typography variant="caption" color="text.secondary">Premium Midnight experience</Typography>
                        </Box>
                        <Box sx={{ ml: 'auto' }}>
                          <Switch checked={themeMode === 'dark'} size="small" />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Palette size={18} /> Accent Color
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Choose a primary color that reflects your brand and style.
                </Typography>
                <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap sx={{ gap: 2 }}>
                  {accentColors.map((item) => (
                    <Box 
                      key={item.name}
                      onClick={() => setAccentColor(item.color)}
                      sx={{ 
                        width: 48, 
                        height: 48, 
                        borderRadius: 2.5, 
                        bgcolor: item.color,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease',
                        border: '3px solid',
                        borderColor: accentColor === item.color ? 'white' : 'transparent',
                        boxShadow: accentColor === item.color ? `0 0 0 2px ${item.color}` : 'none',
                        '&:hover': { transform: 'scale(1.1)' }
                      }}
                    >
                      {accentColor === item.color && <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'white' }} />}
                    </Box>
                  ))}
                </Stack>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Bell size={18} /> Notifications
                </Typography>
                <Stack spacing={1}>
                  <FormControlLabel control={<Switch checked={true} size="small" />} label={<Typography variant="body2">Email updates for new projects</Typography>} />
                  <FormControlLabel control={<Switch checked={true} size="small" />} label={<Typography variant="body2">Browser push notifications for messages</Typography>} />
                  <FormControlLabel control={<Switch checked={false} size="small" />} label={<Typography variant="body2">Slack integration alerts</Typography>} />
                </Stack>
              </Box>

              <Box>
                <Button variant="contained" onClick={handleSave} sx={{ borderRadius: 2, px: 4 }}>Save Preferences</Button>
              </Box>
            </Stack>
          </TabPanel>

          {/* Security & API Tab */}
          <TabPanel value={activeTab} index={2}>
            <Stack spacing={4}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Key size={18} /> API Keys
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Use these keys to integrate IndieCode Studio with your external tools and workflows.
                </Typography>
                <Card variant="outlined" sx={{ borderRadius: 3, p: 2, bgcolor: 'rgba(0,0,0,0.02)' }}>
                  <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 500, textTransform: 'uppercase', color: 'text.disabled' }}>Secret Key</Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 500 }}>ic_live_••••••••••••••••••••••••4k2p</Typography>
                    </Box>
                    <Button size="small" variant="outlined" sx={{ borderRadius: 2 }}>Reveal Key</Button>
                  </Stack>
                </Card>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Lock size={18} /> Password & Security
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Button variant="outlined" fullWidth startIcon={<Lock size={16} />} sx={{ borderRadius: 2 }}>Change Password</Button>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Button variant="outlined" fullWidth startIcon={<Globe size={16} />} sx={{ borderRadius: 2 }}>Two-Factor Auth</Button>
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Button variant="contained" onClick={handleSave} sx={{ borderRadius: 2, px: 4 }}>Save Security Settings</Button>
              </Box>
            </Stack>
          </TabPanel>
        </Box>
      </Paper>
    </Container>
  );
};

export default Settings;
