
import React from 'react';
import ChatInterface from '../components/ChatInterface';
import { ChatIcon } from '../components/Icons';

const ChatPage: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-lg overflow-hidden border border-brand-light-gray">
      <header className="p-5 bg-brand-light border-b border-brand-light-gray flex justify-between items-center">
        <h2 className="text-xl font-bold text-brand-dark flex items-center gap-3">
            <ChatIcon />
            AI Chat
        </h2>
        <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
            <span className="w-2 h-2 rounded-full bg-brand-success mr-2"></span>
            Online
        </div>
      </header>
      <ChatInterface 
        systemInstruction="You are a helpful and friendly AI assistant."
        placeholderText="Ask me anything..."
      />
    </div>
  );
};

export default ChatPage;