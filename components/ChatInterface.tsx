
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { streamChat } from '../services/geminiService';
import { ChatMessage, MessageRole } from '../types';
import { SendIcon, UserIcon } from './Icons';

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
          ...prev, 
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
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      <div className="flex-1 overflow-y-auto pr-4 space-y-6">
        {messages.map((msg, index) => (
          <div key={index} className={`flex gap-4 ${msg.role === MessageRole.USER ? 'justify-end' : ''}`}>
            {msg.role === MessageRole.MODEL && (
              <div className="w-8 h-8 rounded-full bg-brand-primary flex-shrink-0 flex items-center justify-center text-white font-bold">
                AI
              </div>
            )}
            <div className={`p-4 rounded-xl max-w-lg ${msg.role === MessageRole.USER ? 'bg-brand-primary text-white' : 'bg-brand-surface'}`}>
              <p className="whitespace-pre-wrap">{msg.text}{msg.isStreaming && <span className="inline-block w-2 h-4 bg-white animate-pulse ml-1"></span>}</p>
            </div>
            {msg.role === MessageRole.USER && (
               <div className="w-8 h-8 rounded-full bg-brand-surface flex-shrink-0 flex items-center justify-center">
                 <UserIcon />
               </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-6">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholderText}
            rows={1}
            className="w-full bg-brand-surface border border-brand-border rounded-lg p-4 pr-16 resize-none focus:ring-2 focus:ring-brand-primary focus:outline-none"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-brand-primary disabled:bg-brand-border disabled:cursor-not-allowed text-white hover:bg-brand-primary-hover transition-colors"
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
