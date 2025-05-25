import React from 'react';
import {
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
} from '@mui/material';
import ReplyIcon from '@mui/icons-material/Reply';

function Messages() {
  const [ws, setWs] = React.useState(null);
  const [selectedMessage, setSelectedMessage] = React.useState(null);
  const [replyText, setReplyText] = React.useState('');
  const [openDialog, setOpenDialog] = React.useState(false);

  React.useEffect(() => {
    const websocket = new WebSocket('ws://localhost:5003/ws');

    websocket.onopen = () => {
      console.log('Connected to WebSocket');
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: data.sender,
        message: data.message,
        time: 'Just now',
        isReply: data.isReply,
        replyTo: data.replyTo
      }]);
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, []);

  const handleMessageClick = (msg) => {
    setSelectedMessage(msg);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setReplyText('');
    // Return focus to the last clicked reply button
    const button = document.querySelector(`[data-message-id="${selectedMessage?.id}"]`);
    if (button) {
      button.focus();
    }
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !ws) return;
    
    const reply = {
      sender: 'You',
      message: replyText,
      isReply: true,
      replyTo: selectedMessage.sender
    };
    
    // Send the message through WebSocket
    ws.send(JSON.stringify(reply));
    
    // Add the reply to the messages list
    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        ...reply,
        time: 'Just now'
      }
    ]);
    
    handleCloseDialog();
  };
  const [loading, setLoading] = React.useState(true);
  const [error] = React.useState(null);
  const [messages, setMessages] = React.useState([
    {
      id: 1,
      sender: 'Alice Smith',
      message: 'Hi, I need help with plumbing services.',
      time: '10:30 AM'
    },
    {
      id: 2,
      sender: 'Bob Johnson',
      message: 'When can you come for the electrical work?',
      time: 'Yesterday'
    },
    {
      id: 3,
      sender: 'Carol White',
      message: 'Thanks for the great service!',
      time: '2 days ago'
    }
  ]);

  React.useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h4" gutterBottom>
          Messages
        </Typography>
        <Paper sx={{ mt: 4, p: 4, textAlign: 'center' }}>
          <Typography>Loading messages...</Typography>
        </Paper>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h4" gutterBottom>
          Messages
        </Typography>
        <Paper sx={{ mt: 4, p: 4, textAlign: 'center', color: 'error.main' }}>
          <Typography>{error}</Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="sm" 
        fullWidth
        disablePortal
        keepMounted
        aria-labelledby="reply-dialog-title"
      >
        <DialogTitle id="reply-dialog-title">
          Reply to {selectedMessage?.sender}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Original message: {selectedMessage?.message}
          </Typography>
          <TextField
            autoFocus
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            placeholder="Type your reply here..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                handleSendReply();
              } else if (e.key === 'Escape') {
                e.preventDefault();
                handleCloseDialog();
              }
            }}
            aria-label="Reply message"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSendReply} 
            variant="contained" 
            color="primary"
            disabled={!replyText.trim()}
          >
            Send Reply
          </Button>
        </DialogActions>
      </Dialog>
      <Typography variant="h4" gutterBottom>
        Messages
      </Typography>
      <Paper sx={{ mt: 4 }}>
        <List>
          {messages.map((msg, index) => (
            <React.Fragment key={msg.id}>
              <ListItem 
                onClick={() => handleMessageClick(msg)}
                sx={{ 
                  cursor: 'pointer', 
                  '&:hover': { bgcolor: 'action.hover' },
                  transition: 'background-color 0.2s'
                }}
              >
                <ListItemAvatar>
                  <Avatar>{msg.sender[0]}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={msg.sender}
                  secondary={
                    <>
                      {msg.isReply && (
                        <Typography 
                          component="span" 
                          variant="caption" 
                          color="primary.main"
                          sx={{ display: 'block' }}
                        >
                          Reply to {msg.replyTo}
                        </Typography>
                      )}
                      {msg.message}
                    </>
                  }
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontWeight: 500
                    }
                  }}
                />
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                    {msg.time}
                  </Typography>
                  <IconButton 
                    size="small" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMessageClick(msg);
                    }}
                    aria-label={`Reply to ${msg.sender}`}
                    data-message-id={msg.id}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleMessageClick(msg);
                      }
                    }}
                  >
                    <ReplyIcon fontSize="small" />
                  </IconButton>
                </div>
              </ListItem>
              {index < messages.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Container>
  );
}

export default Messages;
