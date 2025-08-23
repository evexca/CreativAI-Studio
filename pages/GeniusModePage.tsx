
import React from 'react';
import ChatInterface from '../components/ChatInterface';

const GeniusModePage: React.FC = () => {
  return (
    <ChatInterface 
      systemInstruction="You are Genius, an AI with immense knowledge and creativity. Provide detailed, insightful, and expert-level answers."
      placeholderText="Ask a complex question..."
    />
  );
};

export default GeniusModePage;
