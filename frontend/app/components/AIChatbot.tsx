'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import './AIChatbot.css';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isStreaming?: boolean;
}

const QUICK_QUESTIONS = [
  '🚀 How do I start learning React?',
  '🐍 Explain Python basics',
  '🗃️ What is a database?',
  '🤖 How does AI work?',
];

let socketInstance: any = null;

function getSocket() {
  if (typeof window === 'undefined') return null;
  if (!socketInstance) {
    const { io } = require('socket.io-client');
    socketInstance = io('http://localhost:5001', {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 3,
      timeout: 5000,
    });
  }
  return socketInstance;
}

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: "👋 Hi! I'm **EduBot**, your AI learning assistant. Ask me anything about your courses or any topic you're studying!",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [userId] = useState(() => 'user_' + generateId());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const streamingIdRef = useRef<string | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (!isOpen) return;

    const socket = getSocket();
    if (!socket) return;

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);
    const onTyping = ({ typing }: { typing: boolean }) => setIsTyping(typing);

    const onStream = ({ chunk, full, done }: { chunk: string; full: string; done: boolean }) => {
      if (!streamingIdRef.current) {
        const newId = generateId();
        streamingIdRef.current = newId;
        setMessages(prev => [
          ...prev,
          { id: newId, text: full, sender: 'bot', timestamp: new Date(), isStreaming: !done },
        ]);
      } else {
        setMessages(prev =>
          prev.map(m =>
            m.id === streamingIdRef.current
              ? { ...m, text: full, isStreaming: !done }
              : m
          )
        );
      }
      if (done) streamingIdRef.current = null;
    };

    const onCleared = () => {
      setMessages([{
        id: 'welcome',
        text: "👋 Chat cleared! I'm ready for your next question.",
        sender: 'bot',
        timestamp: new Date(),
      }]);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('bot_typing', onTyping);
    socket.on('bot_stream', onStream);
    socket.on('history_cleared', onCleared);

    if (socket.connected) setIsConnected(true);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('bot_typing', onTyping);
      socket.off('bot_stream', onStream);
      socket.off('history_cleared', onCleared);
    };
  }, [isOpen]);

  const sendMessage = useCallback(async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || isTyping) return;

    const userMessage: Message = {
      id: generateId(),
      text: msg,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    const socket = getSocket();

    if (socket?.connected) {
      streamingIdRef.current = null;
      socket.emit('chat_message', { message: msg, userId });
    } else {
      // HTTP fallback
      setIsTyping(true);
      try {
        const res = await fetch('http://localhost:5001/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: msg, userId }),
        });
        const data = await res.json();
        setMessages(prev => [
          ...prev,
          { id: generateId(), text: data.message, sender: 'bot', timestamp: new Date() },
        ]);
      } catch {
        setMessages(prev => [
          ...prev,
          {
            id: generateId(),
            text: "⚠️ AI server is offline. Please make sure it's running on port 5001.",
            sender: 'bot',
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsTyping(false);
      }
    }

    setTimeout(() => inputRef.current?.focus(), 50);
  }, [input, userId, isTyping]);

  const clearChat = useCallback(() => {
    const socket = getSocket();
    if (socket?.connected) {
      socket.emit('clear_history', { userId });
    } else {
      setMessages([{
        id: 'welcome',
        text: "👋 Chat cleared! Ready for your next question.",
        sender: 'bot',
        timestamp: new Date(),
      }]);
    }
  }, [userId]);

  // Render markdown-ish bold text
  function renderText(text: string) {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  }

  const ACCENT_COLOR = '#6366F1'; // Indigo 500
  const GRADIENT = 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)';

  return (
    <>
      {/* ── Floating toggle button ── */}
      <button
        onClick={() => { setIsOpen(o => !o); setIsMinimized(false); }}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: GRADIENT,
          color: 'white',
          border: 'none',
          fontSize: '26px',
          cursor: 'pointer',
          zIndex: 10000,
          boxShadow: '0 8px 30px rgba(99,102,241,0.4)',
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.1) translateY(-5px)';
          (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 12px 40px rgba(99,102,241,0.6)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1) translateY(0)';
          (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 30px rgba(99,102,241,0.4)';
        }}
        title="Open AI Tutor"
      >
        {isOpen ? '✕' : '🤖'}
      </button>

      {/* ── Chat window ── */}
      {isOpen && (
        <div className="chatbot-window" style={{
          position: 'fixed',
          bottom: '96px',
          right: '24px',
          width: '380px',
          maxHeight: isMinimized ? '56px' : '600px',
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 9999,
          overflow: 'hidden',
          transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>

          {/* Header */}
          <div style={{
            background: GRADIENT,
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
            cursor: 'pointer',
          }} onClick={() => setIsMinimized(m => !m)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px'
              }}>🤖</div>
              <div>
                <div style={{ color: 'white', fontWeight: '700', fontSize: '16px', fontFamily: 'var(--font-inter)' }}>
                  EduBot AI
                </div>
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: isConnected ? '#4ade80' : '#fbbf24',
                    display: 'inline-block'
                  }} />
                  {isConnected ? 'Online' : 'Reconnecting...'}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={e => { e.stopPropagation(); clearChat(); }}
                style={{
                  background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '10px',
                  color: 'white', width: '32px', height: '32px', cursor: 'pointer', fontSize: '14px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.25)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
                title="Clear chat"
              >🗑️</button>
              <button
                onClick={e => { e.stopPropagation(); setIsMinimized(m => !m); }}
                style={{
                  background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '10px',
                  color: 'white', width: '32px', height: '32px', cursor: 'pointer', fontSize: '16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.25)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
              >{isMinimized ? '▲' : '−'}</button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                scrollbarWidth: 'none',
              }}
              className="custom-scrollbar"
              >
                {messages.map((msg) => (
                  <div key={msg.id} className="message-item" style={{
                    display: 'flex',
                    flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                    alignItems: 'flex-start',
                    gap: '10px',
                  }}>
                    {msg.sender === 'bot' && (
                      <div style={{
                        width: '28px', height: '28px', borderRadius: '50%',
                        background: GRADIENT,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '12px', flexShrink: 0, marginTop: '4px'
                      }}>🤖</div>
                    )}
                    <div style={{ maxWidth: '80%' }}>
                      <div style={{
                        padding: '12px 16px',
                        borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                        background: msg.sender === 'user' ? GRADIENT : 'rgba(255,255,255,0.05)',
                        color: 'white',
                        fontSize: '14px',
                        lineHeight: '1.6',
                        border: '1px solid rgba(255,255,255,0.08)',
                        boxShadow: msg.sender === 'user' ? '0 4px 15px rgba(99,102,241,0.2)' : 'none',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                      }}>
                        {renderText(msg.text)}
                        {msg.isStreaming && <span className="streaming-cursor" style={{
                          display: 'inline-block', width: '2px', height: '15px', background: ACCENT_COLOR, marginLeft: '2px'
                        }} />}
                      </div>
                      <div style={{
                        fontSize: '10px', color: 'rgba(255,255,255,0.4)',
                        marginTop: '6px',
                        textAlign: msg.sender === 'user' ? 'right' : 'left',
                      }}>
                        {formatTime(msg.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '50%',
                      background: GRADIENT,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px',
                    }}>🤖</div>
                    <div style={{
                      padding: '12px 18px',
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: '18px 18px 18px 4px',
                      border: '1px solid rgba(255,255,255,0.08)',
                      display: 'flex', gap: '6px', alignItems: 'center',
                    }}>
                      {[0, 0.2, 0.4].map((delay, i) => (
                        <div key={i} className="typing-dot" style={{
                          width: '6px', height: '6px', borderRadius: '50%',
                          background: ACCENT_COLOR,
                          animationDelay: `${delay}s`,
                        }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick suggestions */}
              {messages.length <= 1 && (
                <div style={{
                  padding: '0 20px 15px',
                  display: 'flex', flexWrap: 'wrap', gap: '8px',
                }}>
                  {QUICK_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q.replace(/^[^\s]+\s/, ''))}
                      style={{
                        background: 'rgba(99,102,241,0.1)',
                        border: '1px solid rgba(99,102,241,0.2)',
                        borderRadius: '12px',
                        color: '#A5B4FC',
                        padding: '6px 14px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(99,102,241,0.2)';
                        e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(99,102,241,0.1)';
                        e.currentTarget.style.borderColor = 'rgba(99,102,241,0.2)';
                      }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* Input Area */}
              <div style={{
                padding: '20px',
                borderTop: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                gap: '12px',
                background: 'rgba(15, 23, 42, 0.5)',
              }}>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="Ask a question..."
                  style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    color: 'white',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(99,102,241,0.5)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isTyping}
                  style={{
                    background: input.trim() && !isTyping ? GRADIENT : 'rgba(255,255,255,0.05)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    width: '46px',
                    height: '46px',
                    cursor: input.trim() && !isTyping ? 'pointer' : 'not-allowed',
                    fontSize: '20px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s',
                    boxShadow: input.trim() && !isTyping ? '0 4px 15px rgba(99,102,241,0.3)' : 'none',
                  }}
                  onMouseEnter={e => { if (input.trim() && !isTyping) e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

