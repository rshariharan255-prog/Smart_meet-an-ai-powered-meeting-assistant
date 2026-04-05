import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { listMeetings, askQuestion } from '../api/meetingApi';

export default function AskPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [meetings, setMeetings] = useState([]);
  const [loadingMeetings, setLoadingMeetings] = useState(true);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [asking, setAsking] = useState(false);
  const bottomRef = useRef();

  useEffect(() => {
    listMeetings()
      .then((res) => setMeetings(res.data))
      .catch(() => setMeetings([]))
      .finally(() => setLoadingMeetings(false));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim() || asking) return;

    const userMsg = { role: 'user', text: question };
    setMessages((prev) => [...prev, userMsg]);
    setQuestion('');
    setAsking(true);

    try {
      const payload = { question: userMsg.text };
      if (selectedMeeting?._id) {
        payload.meeting_id = selectedMeeting._id;
      }
      const res = await askQuestion(payload);
      setMessages((prev) => [...prev, { role: 'ai', text: res.data.answer }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'ai', text: '⚠️ ' + (err.response?.data?.detail || 'Failed to get answer.'), error: true },
      ]);
    } finally {
      setAsking(false);
    }
  };

  const formatDate = (iso) =>
    iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 max-w-6xl mx-auto w-full px-4 py-6 gap-5">
        {/* Meeting Selector Panel */}
        <aside className="w-72 shrink-0 flex flex-col gap-3">
          <div>
            <h2 className="font-bold text-white text-lg">Meetings</h2>
            <p className="text-slate-400 text-xs mt-0.5">Select a meeting to chat about</p>
          </div>

          <button
            onClick={() => setSelectedMeeting(null)}
            className={`w-full text-left rounded-2xl border px-4 py-3 transition ${
              !selectedMeeting
                ? 'border-blue-500/50 bg-blue-600/20 text-white'
                : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <p className="font-semibold text-sm">🌐 All Meetings</p>
            <p className="text-xs text-slate-400 mt-0.5">Ask across all your meetings</p>
          </button>

          {loadingMeetings ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 rounded-2xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : meetings.length === 0 ? (
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4 text-center text-sm text-slate-400">
              No meetings yet.<br />
              <span className="text-blue-400">Upload one first!</span>
            </div>
          ) : (
            <div className="space-y-2 overflow-y-auto max-h-[60vh] pr-1">
              {meetings.map((m) => (
                <button
                  key={m._id}
                  onClick={() => {
                    setSelectedMeeting(m);
                    setMessages([]);
                  }}
                  className={`w-full text-left rounded-2xl border px-4 py-3 transition ${
                    selectedMeeting?._id === m._id
                      ? 'border-purple-500/50 bg-purple-600/20 text-white'
                      : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <p className="font-semibold text-sm truncate">🎬 {m.filename}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{formatDate(m.created_at)}</p>
                </button>
              ))}
            </div>
          )}
        </aside>

        {/* Chat Panel */}
        <div className="flex-1 flex flex-col rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
          {/* Chat Header */}
          <div className="px-5 py-4 border-b border-white/10 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-lg">
              🤖
            </div>
            <div>
              <p className="font-bold text-white text-sm">SmartMeet AI</p>
              <p className="text-xs text-slate-400">
                {selectedMeeting ? `Chatting about: ${selectedMeeting.filename}` : 'Chatting about all meetings'}
              </p>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-green-400">Online</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center py-10 space-y-3">
                <div className="text-5xl">💬</div>
                <p className="font-semibold text-white">Ask anything about your meetings</p>
                <p className="text-slate-400 text-sm max-w-xs">
                  {selectedMeeting
                    ? `I'll answer based on "${selectedMeeting.filename}"`
                    : 'Select a specific meeting or ask across all of them'}
                </p>
                <div className="flex flex-wrap gap-2 justify-center mt-2">
                  {['What were the key decisions?', 'Who are the action owners?', 'Summarize the meeting'].map((q) => (
                    <button
                      key={q}
                      onClick={() => setQuestion(q)}
                      className="rounded-full bg-white/10 border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/20 transition"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'ai' && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-sm mr-2 mt-1 shrink-0">
                    🤖
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-sm'
                      : msg.error
                      ? 'bg-red-500/10 border border-red-500/20 text-red-300 rounded-bl-sm'
                      : 'bg-white/10 border border-white/10 text-slate-200 rounded-bl-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {asking && (
              <div className="flex justify-start">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-sm mr-2 mt-1 shrink-0">
                  🤖
                </div>
                <div className="bg-white/10 border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex gap-1 items-center">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleAsk} className="px-4 py-4 border-t border-white/10 flex gap-3">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask about your meeting…"
              className="flex-1 rounded-xl bg-slate-900 border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
            <button
              type="submit"
              disabled={!question.trim() || asking}
              className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 font-semibold text-white hover:from-blue-500 hover:to-indigo-500 transition disabled:opacity-50 shadow-lg shadow-blue-500/20"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
