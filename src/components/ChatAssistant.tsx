
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Robot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';

interface ChatAssistantProps {
  activeFlight: string | null;
  onSendMessage: (message: string) => Promise<string>;
}

interface Message {
  text: string;
  type: 'user' | 'bot' | 'error';
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ activeFlight, onSendMessage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      text: '🛫 Merhaba! Bir uçuş numarası girerek başlayın. Size şunları söyleyebilirim: <ul class="ai-capabilities"><li>✔️ Gerçek zamanlı durum</li><li>✔️ Tahmini varış süresi</li><li>✔️ Hava durumu bilgisi</li></ul>',
      type: 'bot'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  useEffect(() => {
    if (activeFlight) {
      addMessage(`✅ ${activeFlight} uçuşu takip ediliyor!`, 'bot');
    }
  }, [activeFlight]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const addMessage = (text: string, type: 'user' | 'bot' | 'error') => {
    setMessages(prev => [...prev, { text, type }]);
  };
  
  const handleSendMessage = async () => {
    if (!inputText.trim() || !activeFlight) return;
    
    const userMessage = inputText;
    setInputText('');
    addMessage(userMessage, 'user');
    setIsLoading(true);
    
    try {
      const response = await onSendMessage(userMessage);
      addMessage(response, 'bot');
    } catch (error) {
      addMessage('⚠️ Bağlantı hatası. Lütfen tekrar deneyin.', 'error');
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  return (
    <>
      <Button 
        className="fixed bottom-5 right-5 h-14 w-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 transition-all"
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle size={24} />
      </Button>
      
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="border-b border-slate-700 bg-slate-800">
            <div className="flex justify-between items-center">
              <DrawerTitle className="flex items-center gap-2">
                <Robot className="text-blue-500" size={18} />
                <span>SkyAI Asistan</span>
              </DrawerTitle>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X size={18} />
              </Button>
            </div>
          </DrawerHeader>
          
          <div className="p-4 h-80 overflow-y-auto flex flex-col gap-3 bg-slate-900">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`message ${message.type}-message p-3 rounded-lg max-w-[90%] ${
                  message.type === 'user' 
                    ? 'bg-blue-600 text-white self-end rounded-tr-none'
                    : message.type === 'error'
                      ? 'bg-red-900/70 text-white self-start'
                      : 'bg-slate-800 text-white self-start rounded-tl-none'
                }`}
                dangerouslySetInnerHTML={{ __html: message.text }}
              />
            ))}
            {isLoading && (
              <div className="message bot-message p-3 rounded-lg max-w-[90%] bg-slate-800 text-white self-start rounded-tl-none">
                <div className="flex items-center gap-2">
                  <div className="animate-pulse">⌛</div>
                  <div>Yanıt hazırlanıyor...</div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-3 border-t border-slate-700 flex gap-2 bg-slate-800">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={activeFlight ? `${activeFlight} hakkında soru sor...` : "Önce uçuş numarası girin..."}
              disabled={!activeFlight}
              className="flex-1 bg-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!activeFlight || !inputText.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send size={18} />
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ChatAssistant;
