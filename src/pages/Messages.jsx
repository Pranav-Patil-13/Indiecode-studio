import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Avatar, 
  IconButton, 
  TextField, 
  InputAdornment, 
  Divider, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  ListItemButton,
  Paper,
  Badge,
  Tooltip,
  useTheme
} from '@mui/material';
import { 
  Search, 
  MoreVertical, 
  Phone, 
  Video, 
  Paperclip, 
  Image as ImageIcon, 
  Send, 
  Check, 
  CheckCheck,
  Circle,
  FileText
} from 'lucide-react';

const CONTACTS = [
  { 
    id: 1, 
    name: 'Sarah Jenkins', 
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', 
    lastMessage: 'The new designs look amazing!', 
    time: '12:45 PM', 
    unread: 2, 
    status: 'online' 
  },
  { 
    id: 2, 
    name: 'Michael Chen', 
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', 
    lastMessage: 'Can we schedule a call for tomorrow?', 
    time: '10:30 AM', 
    unread: 0, 
    status: 'offline' 
  },
  { 
    id: 3, 
    name: 'Elena Rodriguez', 
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', 
    lastMessage: 'Sent you the project requirements.', 
    time: 'Yesterday', 
    unread: 0, 
    status: 'online' 
  },
  { 
    id: 4, 
    name: 'David Wilson', 
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', 
    lastMessage: 'The feedback has been implemented.', 
    time: 'Yesterday', 
    unread: 0, 
    status: 'offline' 
  }
];

const INITIAL_MESSAGES = {
  1: [
    { id: 1, text: 'Hi Sarah, how are the new dashboard mockups coming along?', time: '10:15 AM', sender: 'me', status: 'read' },
    { id: 2, text: 'They are looking great! I just finished the responsive versions.', time: '10:20 AM', sender: 'them' },
    { id: 3, text: 'The new designs look amazing!', time: '12:45 PM', sender: 'them' },
    { id: 4, text: 'Check out this screenshot of the mobile view.', time: '12:46 PM', sender: 'them', attachment: { type: 'image', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop' } }
  ],
  2: [
    { id: 1, text: 'Hey Michael, any update on the API integration?', time: '09:00 AM', sender: 'me', status: 'read' },
    { id: 2, text: 'Almost done. Just need to test the auth flow.', time: '09:30 AM', sender: 'them' }
  ]
};

const Messages = () => {
  const theme = useTheme();
  const [selectedContact, setSelectedContact] = useState(CONTACTS[0]);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    const newMessage = {
      id: Date.now(),
      text: inputValue,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: 'me',
      status: 'sent'
    };

    setMessages({
      ...messages,
      [selectedContact.id]: [...(messages[selectedContact.id] || []), newMessage]
    });
    setInputValue('');
  };

  const filteredContacts = CONTACTS.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ 
      display: 'flex', 
      height: 'calc(100vh - 180px)', 
      bgcolor: 'background.paper', 
      borderRadius: 4, 
      overflow: 'hidden',
      boxShadow: theme.palette.mode === 'light' ? '0 4px 20px rgba(0, 0, 0, 0.03)' : '0 10px 40px rgba(0,0,0,0.4)',
      border: '1px solid',
      borderColor: 'divider'
    }}>
      {/* Sidebar */}
      <Box sx={{ 
        width: 360, 
        borderRight: '1px solid', 
        borderColor: 'divider',
        display: 'flex', 
        flexDirection: 'column',
        bgcolor: 'background.paper'
      }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Messages</Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={18} color="#6C757D" />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2, bgcolor: 'action.hover', '& fieldset': { border: 'none' } }
              }
            }}
          />
        </Box>
        <Divider sx={{ opacity: 0.5 }} />
        <List sx={{ flexGrow: 1, overflowY: 'auto', p: 0 }}>
          {filteredContacts.map((contact) => (
            <React.Fragment key={contact.id}>
              <ListItem disablePadding>
                <ListItemButton 
                  selected={selectedContact.id === contact.id}
                  onClick={() => setSelectedContact(contact)}
                  sx={{ 
                    py: 2, 
                    px: 3,
                    borderLeft: selectedContact.id === contact.id ? '4px solid' : '4px solid transparent',
                    borderColor: 'primary.main',
                    '&.Mui-selected': {
                      bgcolor: 'action.selected',
                      '&:hover': { bgcolor: 'action.selected' }
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Badge
                      overlap="circle"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      variant="dot"
                      sx={{ 
                        '& .MuiBadge-badge': { 
                          bgcolor: contact.status === 'online' ? '#4CAF50' : '#ADB5BD',
                          border: '2px solid white'
                        } 
                      }}
                    >
                      <Avatar src={contact.avatar} sx={{ width: 48, height: 48 }} />
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{contact.name}</Typography>
                        <Typography variant="caption" color="text.disabled">{contact.time}</Typography>
                      </Box>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          sx={{ 
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis', 
                            whiteSpace: 'nowrap',
                            maxWidth: '180px'
                          }}
                        >
                          {contact.lastMessage}
                        </Typography>
                        {contact.unread > 0 && (
                          <Badge 
                            badgeContent={contact.unread} 
                            color="primary" 
                            sx={{ '& .MuiBadge-badge': { fontSize: 10, height: 18, minWidth: 18 } }} 
                          />
                        )}
                      </Box>
                    }
                  />
                </ListItemButton>
              </ListItem>
              <Divider sx={{ mx: 3, opacity: 0.3 }} />
            </React.Fragment>
          ))}
        </List>
      </Box>

      {/* Chat Window */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
        {/* Chat Header */}
        <Box sx={{ 
          p: 2, 
          px: 3, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar src={selectedContact.avatar} sx={{ width: 40, height: 40 }} />
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>{selectedContact.name}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Circle size={8} fill={selectedContact.status === 'online' ? '#4CAF50' : '#ADB5BD'} color="transparent" />
                <Typography variant="caption" color="text.secondary">
                  {selectedContact.status === 'online' ? 'Active now' : 'Offline'}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Voice Call">
              <IconButton size="small"><Phone size={18} /></IconButton>
            </Tooltip>
            <Tooltip title="Video Call">
              <IconButton size="small"><Video size={18} /></IconButton>
            </Tooltip>
            <Tooltip title="More Info">
              <IconButton size="small"><MoreVertical size={18} /></IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Messages Area */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {(messages[selectedContact.id] || []).map((msg, index) => (
            <Box 
              key={msg.id} 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: msg.sender === 'me' ? 'flex-end' : 'flex-start' 
              }}
            >
              <Paper 
                elevation={0}
                sx={{ 
                  p: 1.5, 
                  px: 2, 
                  maxWidth: '70%', 
                  borderRadius: 3,
                  bgcolor: msg.sender === 'me' ? 'primary.main' : 'background.paper',
                  color: msg.sender === 'me' ? 'white' : 'text.primary',
                  boxShadow: msg.sender === 'me' ? '0 4px 12px rgba(0,0,0,0.1)' : '0 2px 4px rgba(0,0,0,0.02)',
                  border: '1px solid',
                  borderColor: msg.sender === 'me' ? 'transparent' : 'divider',
                  position: 'relative'
                }}
              >
                {msg.attachment && (
                  <Box sx={{ mb: 1, borderRadius: 2, overflow: 'hidden' }}>
                    {msg.attachment.type === 'image' ? (
                      <img src={msg.attachment.url} alt="attachment" style={{ width: '100%', display: 'block' }} />
                    ) : (
                      <Box sx={{ p: 1, bgcolor: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FileText size={20} />
                        <Typography variant="caption">document.pdf</Typography>
                      </Box>
                    )}
                  </Box>
                )}
                <Typography variant="body2">{msg.text}</Typography>
              </Paper>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                <Typography variant="caption" color="text.disabled">{msg.time}</Typography>
                {msg.sender === 'me' && (
                  msg.status === 'read' ? <CheckCheck size={14} color="#4CAF50" /> : <Check size={14} color="#ADB5BD" />
                )}
              </Box>
            </Box>
          ))}
        </Box>

        {/* Input Area */}
        <Box sx={{ p: 2, px: 3, bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider' }}>
          <Paper 
            elevation={0}
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              p: '4px 12px', 
              bgcolor: 'action.hover',
              borderRadius: 3
            }}
          >
            <IconButton size="small"><Paperclip size={20} color="#6C757D" /></IconButton>
            <IconButton size="small"><ImageIcon size={20} color="#6C757D" /></IconButton>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              sx={{ 
                '& .MuiInputBase-root': { py: 1, px: 0 },
                '& fieldset': { border: 'none' }
              }}
              slotProps={{
                input: { sx: { fontSize: '0.875rem' } }
              }}
            />
            <IconButton 
              color="primary" 
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              sx={{ 
                bgcolor: inputValue.trim() ? 'primary.main' : 'transparent', 
                color: inputValue.trim() ? 'white' : 'text.disabled',
                '&:hover': { bgcolor: inputValue.trim() ? 'primary.dark' : 'transparent' }
              }}
            >
              <Send size={18} />
            </IconButton>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Messages;
