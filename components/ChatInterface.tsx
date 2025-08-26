
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { streamChat } from '../services/aiService';
import { ChatMessage, MessageRole } from '../types';
import { SendIcon, UserIcon, RobotIcon } from './Icons';

interface ChatInterfaceProps {
  systemInstruction: string;
  placeholderText: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ systemInstruction, placeholderText }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSend = useCallback(async () => {
    if (input.trim() === '' || isLoading) return;

    const newMessages: ChatMessage[] = [...messages, { role: MessageRole.USER, text: input }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const stream = await streamChat(messages, input, systemInstruction);
      
      let modelResponse = '';
      setMessages(prev => [...prev, { role: MessageRole.MODEL, text: '', isStreaming: true }]);

      for await (const chunk of stream) {
        modelResponse += chunk.text;
        setMessages(prev => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage && lastMessage.role === MessageRole.MODEL) {
            return [
              ...prev.slice(0, -1),
              { ...lastMessage, text: modelResponse, isStreaming: true },
            ];
          }
          return prev;
        });
      }

       setMessages(prev => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage && lastMessage.role === MessageRole.MODEL) {
            return [
              ...prev.slice(0, -1),
              { ...lastMessage, isStreaming: false },
            ];
          }
          return prev;
        });

    } catch (error) {
      console.error("Error streaming chat:", error);
      setMessages(prev => [
          ...prev.filter(m => m.text !== ''), // remove empty streaming message
          { role: MessageRole.MODEL, text: "Sorry, I encountered an error. Please try again." }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, systemInstruction]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-brand-chat-bg">
         {messages.length === 0 && (
            <div className={`flex gap-4 items-start`}>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex-shrink-0 flex items-center justify-center text-xl text-brand-dark">
                    <RobotIcon />
                </div>
                <div className={`p-4 rounded-2xl max-w-lg bg-white shadow-sm rounded-tl-none`}>
                    <p className="whitespace-pre-wrap text-brand-dark">Hello! I'm your AI companion. How can I assist you today?</p>
                </div>
            </div>
         )}

        {messages.map((msg, index) => (
          <div key={index} className={`flex gap-4 items-start ${msg.role === MessageRole.USER ? 'justify-end flex-row-reverse' : 'justify-start'}`}>
             <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-xl text-brand-dark ${
                 msg.role === MessageRole.MODEL ? 'bg-gradient-to-br from-blue-100 to-blue-200' : 'bg-gradient-to-br from-green-100 to-green-200'
             }`}>
                {msg.role === MessageRole.MODEL ? <RobotIcon /> : <UserIcon />}
              </div>
            <div className={`p-4 rounded-2xl max-w-[85%] sm:max-w-lg shadow-sm ${
                msg.role === MessageRole.USER 
                ? 'bg-brand-chat-user rounded-tr-none' 
                : 'bg-white rounded-tl-none'
            }`}>
              <p className="whitespace-pre-wrap text-brand-dark">{msg.text}{msg.isStreaming && <span className="inline-block w-2 h-4 bg-brand-dark animate-pulse ml-1"></span>}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-brand-light-gray">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholderText}
            rows={1}
            className="w-full bg-brand-light border border-gray-300 rounded-full py-3 px-6 pr-16 resize-none focus:ring-2 focus:ring-brand-primary focus:outline-none text-brand-dark"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-brand-primary disabled:bg-brand-light-gray disabled:cursor-not-allowed text-white hover:bg-brand-secondary transition-all duration-300 flex items-center justify-center"
          >
            <SendIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
