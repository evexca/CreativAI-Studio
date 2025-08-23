
import React from 'react';
import ChatInterface from '../components/ChatInterface';

const ChatPage: React.FC = () => {
  return (
    <ChatInterface 
      systemInstruction="You are a helpful and friendly AI assistant."
      placeholderText="Ask me anything..."
    />
  );
};

export default ChatPage;
