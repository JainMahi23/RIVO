import { useEffect, useRef, useState } from 'react';
import { Send, Sparkles, Bot, User, Trash2 } from 'lucide-react';
import aiAPI from '../../services/aiAPI';

export default function AIChatWidget({ assessmentId = 'active', suggestedPrompts = [], className = '' }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Namaste! I am your Rivo AI Business Copilot. Ask me anything about your feasibility score, loan calculation, PMEGP subsidy eligibility, or local market demand.",
    },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, sending]);

  const send = async (text) => {
    const trimmed = (text ?? input).trim();
    if (!trimmed || sending) return;
    setError('');
    const newHistory = [...messages, { role: 'user', text: trimmed }];
    setMessages(newHistory);
    setInput('');
    setSending(true);
    try {
      const res = await aiAPI.sendMessage(assessmentId, trimmed, messages);
      const reply = res?.reply || res?.message || "I've analyzed your question based on your business model. Let me know if you need financial or scheme clarifications.";
      setMessages((m) => [...m, { role: 'assistant', text: reply }]);
    } catch (err) {
      setError(err.message || 'Could not reach AI copilot. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        text: "Chat history cleared. How else can I assist your village business enterprise today?",
      },
    ]);
  };

  return (
    <div className={`flex flex-col bg-white rounded-card shadow-card border border-forest/10 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-forest to-forest-light text-cream">
        <div className="flex items-center gap-2">
          <span className="h-7 w-7 rounded-full bg-gold/20 flex items-center justify-center text-gold">
            <Bot size={16} />
          </span>
          <div>
            <span className="text-sm font-semibold block leading-tight">Rivo AI Business Copilot</span>
            <span className="text-[10px] text-cream/70">Powered by Gemini / ML Microservice</span>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="text-cream/60 hover:text-cream text-xs flex items-center gap-1 p-1 transition-colors"
          title="Clear Conversation"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Messages Scroll View */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-[260px] bg-cream/20">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'assistant' && (
              <span className="h-7 w-7 rounded-full bg-forest text-gold flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <Sparkles size={13} />
              </span>
            )}
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                m.role === 'user'
                  ? 'bg-gold text-forest-dark font-medium rounded-br-none'
                  : 'bg-white text-ink rounded-bl-none border border-forest/10'
              }`}
            >
              {m.text}
            </div>
            {m.role === 'user' && (
              <span className="h-7 w-7 rounded-full bg-gold/30 text-forest flex items-center justify-center shrink-0 mt-0.5">
                <User size={14} />
              </span>
            )}
          </div>
        ))}

        {sending && (
          <div className="flex items-center gap-2 justify-start">
            <span className="h-7 w-7 rounded-full bg-forest text-gold flex items-center justify-center shrink-0">
              <Sparkles size={13} />
            </span>
            <div className="bg-white border border-forest/10 text-ink rounded-2xl rounded-bl-none px-4 py-2.5 text-xs flex items-center gap-1.5 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-gold animate-bounce [animation-delay:-0.3s]" />
              <span className="h-2 w-2 rounded-full bg-gold animate-bounce [animation-delay:-0.15s]" />
              <span className="h-2 w-2 rounded-full bg-gold animate-bounce" />
              <span className="text-xs text-ink/50 ml-1">Analyzing model dataset…</span>
            </div>
          </div>
        )}
        {error && <p className="text-xs text-terracotta-dark font-medium px-2">{error}</p>}
      </div>

      {/* Suggested Prompt Pills */}
      {suggestedPrompts.length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-4 py-2 bg-cream/40 border-t border-forest/5">
          {suggestedPrompts.map((p) => (
            <button
              key={p}
              onClick={() => send(p)}
              className="text-xs font-semibold bg-forest/5 text-forest px-3 py-1 rounded-pill hover:bg-gold/20 hover:text-forest-dark transition-all duration-150 border border-forest/10"
            >
              + {p}
            </button>
          ))}
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="flex items-center gap-2 border-t border-forest/10 px-3 py-3 bg-white"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about your business or loan scheme… (English/Hindi)"
          className="flex-1 bg-cream/50 rounded-pill px-4 py-2.5 text-xs sm:text-sm text-ink outline-none focus:ring-2 focus:ring-gold/30 border border-forest/10"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="h-9 w-9 shrink-0 rounded-full bg-gold text-forest-dark flex items-center justify-center hover:bg-gold-dark transition-all disabled:opacity-40 shadow-sm"
          aria-label="Send message"
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  );
}
