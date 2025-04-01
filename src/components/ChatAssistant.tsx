
import React, { useState, useRef, useEffect } from 'react';

interface ChatAssistantProps {
  activeFlight: string | null;
  onSendMessage: (message: string) => Promise<string>;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ activeFlight, onSendMessage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{content: string; type: 'bot' | 'user' | 'error'}>>([
    {
      content: `🛫 Merhaba! Bir uçuş numarası girerek başlayın. Size şunları söyleyebilirim:
      <ul class="ai-capabilities">
        <li>✔️ Gerçek zamanlı durum</li>
        <li>✔️ Tahmini varış süresi</li>
        <li>✔️ Hava durumu bilgisi</li>
      </ul>`,
      type: 'bot'
    }
  ]);
  
  const chatBodyRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSendMessage = async () => {
    if (!message.trim() || !activeFlight) return;
    
    // Add user message
    setMessages(prev => [...prev, { content: message, type: 'user' }]);
    const userMessage = message;
    setMessage('');

    try {
      // Add bot response
      const response = await onSendMessage(userMessage);
      setMessages(prev => [...prev, { content: response, type: 'bot' }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        content: '⚠️ Bağlantı hatası. Lütfen tekrar deneyin.', 
        type: 'error' 
      }]);
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      <div className={`chat-container ${isOpen ? 'active' : ''}`}>
        <div className="chat-header">
          <h3 className="font-medium flex items-center gap-2">
            <i className="fas">🤖</i> SkyAI Asistan
          </h3>
          <button className="close-btn" onClick={toggleChat}>&times;</button>
        </div>
        <div className="chat-body" ref={chatBodyRef}>
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`message ${msg.type}-message`}
              dangerouslySetInnerHTML={{ __html: msg.content }}
            />
          ))}
        </div>
        <div className="chat-input">
          <input 
            type="text" 
            placeholder={activeFlight 
              ? `${activeFlight} hakkında soru sor...` 
              : "Önce uçuş numarası girin..."
            }
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={!activeFlight}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button 
            className="send-btn" 
            onClick={handleSendMessage}
            disabled={!activeFlight}
          >
            <i className="fas">📤</i>
          </button>
        </div>
      </div>
      <div className="chat-toggle" onClick={toggleChat}>
        <i className="fas">💬</i>
      </div>
    </>
  );
};

export default ChatAssistant;
