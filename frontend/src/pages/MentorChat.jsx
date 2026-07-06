import React, { useState, useEffect, useRef, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AuthContext, API_BASE_URL } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Send, Brain, User, AlertCircle, Sparkles, Lightbulb } from 'lucide-react';

const MentorChat = () => {
  const [searchParams] = useSearchParams();
  const ideaIdParam = searchParams.get('idea_id');

  const { token } = useContext(AuthContext);
  
  const [ideas, setIdeas] = useState([]);
  const [selectedIdeaId, setSelectedIdeaId] = useState(ideaIdParam ? parseInt(ideaIdParam) : '');
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const chatEndRef = useRef(null);

  const suggestionPills = [
    "How can I improve my startup?",
    "How should I price my product?",
    "How can I acquire customers?",
    "How do I get funding?"
  ];

  // Fetch user's ideas for the selector dropdown
  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/ideas`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setIdeas(data);
        }
      } catch (err) {
        console.error("Failed to load ideas:", err);
      }
    };
    if (token) fetchIdeas();
  }, [token]);

  // Fetch chat history whenever selectedIdeaId changes
  const fetchChatHistory = async () => {
    try {
      setError('');
      setLoading(true);
      
      let url = `${API_BASE_URL}/chat`;
      if (selectedIdeaId) {
        url += `?startup_idea_id=${selectedIdeaId}`;
      }

      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      } else {
        setError("Could not load chat logs.");
      }
    } catch (err) {
      setError("Failed to fetch messages.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchChatHistory();
    }
  }, [selectedIdeaId, token]);

  // Scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend) => {
    if (!textToSend.trim()) return;

    setError('');
    const userText = textToSend;
    setInputValue('');

    // Append user message locally
    const tempUserMsg = {
      id: Date.now(),
      sender: 'user',
      message: userText,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempUserMsg]);

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: userText,
          startup_idea_id: selectedIdeaId ? parseInt(selectedIdeaId) : null
        })
      });

      if (res.ok) {
        const mentorMsg = await res.json();
        setMessages(prev => [...prev, mentorMsg]);
      } else {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to contact chatbot.");
      }
    } catch (err) {
      setError(err.message || "Network error. Failed to get response.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  return (
    <div className="min-h-screen bg-dark-bg text-gray-200">
      <Navbar />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6 md:p-10 flex flex-col max-w-5xl h-[calc(100vh-64px)] justify-between gap-6">
          {/* Top Selection Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white">AI Business Mentor</h1>
              <p className="text-sm text-gray-400 mt-1">Get advice on your specific ideas or general business strategies.</p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-semibold whitespace-nowrap">Focus Idea:</span>
              <select
                value={selectedIdeaId}
                onChange={(e) => setSelectedIdeaId(e.target.value)}
                className="px-4 py-2 bg-dark-card border border-dark-border/80 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
              >
                <option value="">General (No Context)</option>
                {ideas.map(i => (
                  <option key={i.id} value={i.id}>{i.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Chat Window Panel */}
          <div className="flex-1 glass-panel rounded-3xl border border-dark-border/60 flex flex-col justify-between overflow-hidden">
            {/* Messages Display Board */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 max-h-[500px]">
              {error && (
                <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3.5 rounded-xl text-xs">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-10 max-w-md mx-auto space-y-4">
                  <div className="h-14 w-14 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400">
                    <Brain className="h-7 w-7" />
                  </div>
                  <h4 className="text-base font-bold text-gray-200">Start consulting your Mentor</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Select a startup idea from the dropdown to give context, or ask a general business planning question.
                  </p>
                  
                  {/* Suggestion Chips */}
                  <div className="grid grid-cols-2 gap-2 mt-4 w-full">
                    {suggestionPills.map((pill, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(pill)}
                        className="p-3 bg-dark-bg/60 border border-dark-border/80 hover:border-brand-500 text-[10px] font-semibold text-gray-400 hover:text-white rounded-xl transition-all text-left flex items-start gap-1.5"
                      >
                        <Lightbulb className="h-3.5 w-3.5 text-brand-400 shrink-0 mt-0.5" />
                        <span>{pill}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => {
                    const isUser = msg.sender === 'user';
                    return (
                      <div 
                        key={msg.id}
                        className={`flex gap-3 max-w-[80%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                      >
                        <div className={`h-8 w-8 rounded-full border shrink-0 flex items-center justify-center ${
                          isUser 
                            ? 'bg-dark-border border-dark-border text-gray-300' 
                            : 'bg-brand-600/10 border-brand-500/30 text-brand-400'
                        }`}>
                          {isUser ? <User className="h-4 w-4" /> : <Brain className="h-4 w-4" />}
                        </div>
                        
                        <div className={`p-4 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                          isUser
                            ? 'bg-brand-600 text-white rounded-tr-none'
                            : 'bg-dark-card/60 border border-dark-border/60 text-gray-300 rounded-tl-none'
                        }`}>
                          {msg.message}
                        </div>
                      </div>
                    );
                  })}
                  
                  {loading && (
                    <div className="flex gap-3 max-w-[80%] mr-auto">
                      <div className="h-8 w-8 rounded-full border bg-brand-600/10 border-brand-500/30 text-brand-400 shrink-0 flex items-center justify-center">
                        <Brain className="h-4 w-4 animate-pulse" />
                      </div>
                      <div className="p-4 bg-dark-card/60 border border-dark-border/60 rounded-2xl rounded-tl-none flex items-center gap-1.5 py-3">
                        <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" />
                        <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
              )}
            </div>

            {/* Input Bar Form */}
            <div className="p-4 border-t border-dark-border/80 bg-dark-card/30">
              <form onSubmit={handleFormSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask a question..."
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-dark-bg/60 border border-dark-border/80 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || loading}
                  className="glow-btn p-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center justify-center"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MentorChat;
