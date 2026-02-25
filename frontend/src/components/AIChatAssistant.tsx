import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
}

const aiResponses = [
  "I can help you understand your prescription. Please upload your document or describe your medication.",
  "Based on your query, I recommend consulting with your healthcare provider for personalized advice.",
  "I can analyze drug interactions and provide simplified explanations of medical terminology.",
  "Your health is our priority. Let me help you understand your medical report better.",
  "I can suggest dietary guidelines based on your current medications. What would you like to know?",
  "MediAI supports Marathi, Hindi, Malayalam, and English. Which language would you prefer?",
  "I can help you find nearby hospitals based on your diagnosis. Please share your location or city.",
];

export default function AIChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      text: "Hello! I'm MediAI Assistant. How can I help you understand your medical information today?",
      isUser: false,
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(1);
  const responseIndexRef = useRef(0);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: idRef.current++, text: input, isUser: true };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const delay = 1200 + Math.random() * 800;
    setTimeout(() => {
      const responseText = aiResponses[responseIndexRef.current % aiResponses.length];
      responseIndexRef.current++;
      const aiMsg: Message = {
        id: idRef.current++,
        text: responseText,
        isUser: false,
      };
      setIsTyping(false);
      setMessages((prev) => [...prev, aiMsg]);
    }, delay);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <>
      {/* Chat panel */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-4 sm:right-6 z-[9990] w-80 sm:w-96 rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(10,22,40,0.92)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(0,212,255,0.25)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(0,212,255,0.1)',
            animation: 'chatOpen 0.25s ease forwards',
          }}
        >
          <style>{`
            @keyframes chatOpen {
              from { opacity: 0; transform: scale(0.9) translateY(10px); }
              to { opacity: 1; transform: scale(1) translateY(0); }
            }
          `}</style>

          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{
              background: 'linear-gradient(135deg, rgba(0,212,255,0.12), rgba(124,58,237,0.12))',
              borderBottom: '1px solid rgba(0,212,255,0.15)',
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
                  boxShadow: '0 0 12px rgba(0,212,255,0.5)',
                }}
              >
                <span className="text-xs font-black text-white">AI</span>
              </div>
              <div>
                <div
                  className="text-sm font-bold"
                  style={{ color: '#00d4ff', textShadow: '0 0 8px rgba(0,212,255,0.5)' }}
                >
                  MediAI Assistant
                </div>
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: '#22c55e', boxShadow: '0 0 4px #22c55e', animation: 'pulseDot 2s ease-in-out infinite' }}
                  />
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    Online
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg transition-all duration-200"
              style={{ color: 'rgba(255,255,255,0.5)' }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#00d4ff')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)')}
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div
            className="flex flex-col gap-3 p-4 overflow-y-auto"
            style={{ height: 280, scrollbarWidth: 'thin' }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className="max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed"
                  style={
                    msg.isUser
                      ? {
                          background: 'linear-gradient(135deg, rgba(0,212,255,0.25), rgba(14,165,233,0.2))',
                          border: '1px solid rgba(0,212,255,0.3)',
                          color: '#e0f7ff',
                        }
                      : {
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          color: 'rgba(255,255,255,0.8)',
                        }
                  }
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div
                  className="px-4 py-3 rounded-xl flex items-center gap-1.5"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <div
                    className="typing-dot w-2 h-2 rounded-full"
                    style={{ background: '#00d4ff' }}
                  />
                  <div
                    className="typing-dot w-2 h-2 rounded-full"
                    style={{ background: '#00d4ff' }}
                  />
                  <div
                    className="typing-dot w-2 h-2 rounded-full"
                    style={{ background: '#00d4ff' }}
                  />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            className="flex items-center gap-2 px-3 py-3"
            style={{ borderTop: '1px solid rgba(0,212,255,0.1)' }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your prescription..."
              className="flex-1 bg-transparent text-sm outline-none"
              style={{
                color: 'rgba(255,255,255,0.8)',
                caretColor: '#00d4ff',
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isTyping}
              className="p-2 rounded-lg transition-all duration-200 flex-shrink-0"
              style={{
                background: input.trim() && !isTyping
                  ? 'linear-gradient(135deg, #00d4ff, #0ea5e9)'
                  : 'rgba(255,255,255,0.05)',
                color: input.trim() && !isTyping ? '#020817' : 'rgba(255,255,255,0.3)',
                boxShadow: input.trim() && !isTyping ? '0 0 12px rgba(0,212,255,0.4)' : 'none',
              }}
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Floating orb button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-4 sm:right-6 z-[9991] w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300"
        style={{
          background: isOpen
            ? 'linear-gradient(135deg, rgba(239,68,68,0.3), rgba(124,58,237,0.3))'
            : 'linear-gradient(135deg, #00d4ff, #0ea5e9)',
          boxShadow: isOpen
            ? '0 0 20px rgba(239,68,68,0.4)'
            : '0 0 20px rgba(0,212,255,0.6), 0 0 40px rgba(0,212,255,0.3)',
          animation: isOpen ? 'none' : 'orbPulse 2s ease-out infinite',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
        }}
      >
        {isOpen ? (
          <X size={22} color="#ffffff" />
        ) : (
          <MessageCircle size={22} color="#020817" />
        )}
      </button>
    </>
  );
}
