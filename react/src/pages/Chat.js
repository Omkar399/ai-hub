import React, { useState, useRef, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import ReactMarkdown from 'react-markdown';
import { Link } from '@mui/material';

import {
    Container,
    Box,
    TextField,
    Button,
    Paper,
    Typography,
    Avatar,
    CircularProgress
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = {
            id: Date.now(),
            text: input,
            sender: 'user',
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: input }),
            });

            const data = await response.json();

            const botMessage = {
                id: Date.now() + 1,
                text: data.response,
                sender: 'bot',
                timestamp: new Date().toISOString()
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage = {
                id: Date.now() + 1,
                text: "I'm having trouble connecting right now. Please try again.",
                sender: 'bot',
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, height: '80vh', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h4" gutterBottom>
                AI Learning Assistant
            </Typography>

            <Paper
                elevation={3}
                sx={{
                    flex: 1,
                    mb: 2,
                    p: 2,
                    overflow: 'auto',
                    bgcolor: '#f5f5f5'
                }}
            >
                {messages.map((message) => (
                    <Box
                        key={message.id}
                        sx={{
                            display: 'flex',
                            justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                            mb: 2,
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 1,
                                maxWidth: '70%',
                                flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                            }}
                        >
                            <Avatar
                                sx={{
                                    bgcolor: message.sender === 'user' ? 'primary.main' : 'secondary.main',
                                }}
                            >
                                {message.sender === 'user' ? <PersonIcon /> : <SmartToyIcon />}
                            </Avatar>
                            <Paper
                                elevation={1}
                                sx={{
                                    p: 2,
                                    bgcolor: message.sender === 'user' ? 'primary.light' : 'white',
                                    color: message.sender === 'user' ? 'white' : 'text.primary',
                                    borderRadius: 2,
                                }}
                            >
                                {message.sender === 'user' ? (
                                    <Typography variant="body1">{message.text}</Typography>
                                ) : (
                                    <ReactMarkdown
                                        components={{
                                            p: (props) => <Typography variant="body1" gutterBottom {...props} />,
                                            h1: (props) => <Typography variant="h5" gutterBottom {...props} />,
                                            h2: (props) => <Typography variant="h6" gutterBottom {...props} />,
                                            h3: (props) => <Typography variant="subtitle1" gutterBottom {...props} />,
                                            ul: (props) => <Box component="ul" sx={{ pl: 2 }} {...props} />,
                                            li: (props) => <Typography component="li" variant="body1" gutterBottom {...props} />,
                                            a: (props) => (
                                                <Link
                                                    {...props}
                                                    sx={{ color: 'primary.main' }}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                />
                                            ),
                                        }}
                                    >
                                        {message.text}
                                    </ReactMarkdown>
                                )}
                                <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 1 }}>
                                    {new Date(message.timestamp).toLocaleTimeString()}
                                </Typography>
                            </Paper>
                        </Box>
                    </Box>
                ))}
                {isLoading && (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                        <CircularProgress size={20} />
                    </Box>
                )}
                <div ref={messagesEndRef} />
            </Paper>

            <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                    fullWidth
                    multiline
                    maxRows={4}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about AI learning resources..."
                    variant="outlined"
                    disabled={isLoading}
                />
                <Button
                    variant="contained"
                    endIcon={<SendIcon />}
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    sx={{ minWidth: '120px' }}
                >
                    Send
                </Button>
            </Box>
        </Container>
    );
};

export default Chat;
