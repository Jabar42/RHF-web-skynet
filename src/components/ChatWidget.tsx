import { useState, useEffect, useRef } from 'react';

const API_URL = 'https://5c890c15-5e97-4a13-87fb-2d4f235c4941.cfargotunnel.com/v1/chat/completions';
const API_KEY = import.meta.env.VITE_API_SERVER_KEY; // will be set in vercel env

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatWidget() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (input.trim() === '' || loading) return;
    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: 'hermes-agent',
          messages: messages.concat(userMessage),
          stream: false, // we can change to true for streaming later
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'API error');
      }

      const data = await response.json();
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.choices[0]?.message?.content || 'No response',
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error: ' + err.message }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-widget">
      <div className="chat-header">
        <h3>Asistente Virtual RHF</h3>
        <p className="chat-subtext">Pregunta por nuestros proyectos y disponibilidad</p>
      </div>
      <div className="chat-messages" ref={messagesEndRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-message ${msg.role}`}>
            <div className="chat-message-content">{msg.content}</div>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Escribe tu mensaje..."
          disabled={loading}
        />
        <button onClick={sendMessage} disabled={loading || input.trim() === ''}>
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
      </div>
    </div>
  );
}
