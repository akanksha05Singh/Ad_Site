import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

export default function ChatWindow({ user }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeThread, setActiveThread] = useState(null); // String thread key
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setMessages(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching chats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    
    // Poll for new messages every 5 seconds for Stage 2 MVP simple mock real-time syncing
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [user]);

  // Group messages into distinct conversations:
  // Key: listingId._id + '-' + otherUserId
  const threadsMap = {};
  messages.forEach((msg) => {
    if (!msg.listingId || !msg.sender || !msg.receiver) return;

    const currentUserId = user.id || user._id;
    const otherUser = msg.sender._id === currentUserId ? msg.receiver : msg.sender;
    const threadKey = `${msg.listingId._id}-${otherUser._id}`;

    if (!threadsMap[threadKey]) {
      threadsMap[threadKey] = {
        key: threadKey,
        listing: msg.listingId,
        otherUser: otherUser,
        messages: []
      };
    }
    threadsMap[threadKey].messages.push(msg);
  });

  const threads = Object.values(threadsMap);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeThread) return;

    const currentThread = threads.find(t => t.key === activeThread);
    if (!currentThread) return;

    setSending(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          receiver: currentThread.otherUser._id,
          listingId: currentThread.listing._id,
          text: inputText.trim()
        })
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setMessages(prev => [...prev, data.data]);
        setInputText('');
      } else {
        throw new Error(data.error || 'Failed to send message');
      }
    } catch (err) {
      alert(err.message || 'Error sending message');
    } finally {
      setSending(false);
    }
  };

  const selectedThread = threads.find(t => t.key === activeThread);

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-140px)]">
      {/* Title */}
      <div>
        <h2 className="font-outfit text-2xl font-bold text-slate-900">Inquiries Inbox</h2>
        <p className="text-sm text-slate-500">Communicate directly with listing publishers and candidates.</p>
      </div>

      {loading ? (
        <div className="flex-grow flex items-center justify-center bg-white rounded-3xl border border-slate-200 shadow-sm p-12">
          <svg className="animate-spin h-8 w-8 text-brand-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      ) : threads.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center text-center bg-white rounded-3xl border border-slate-200 shadow-sm p-12">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 mb-3 border border-slate-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="font-outfit text-lg font-bold text-slate-900 mb-1">No messages yet</h3>
          <p className="text-slate-500 max-w-sm text-xs">
            Your inquiry list is empty. When buyers ask questions regarding your listings or you request details on posts, threads will display here.
          </p>
        </div>
      ) : (
        <div className="flex-grow flex bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden h-[500px]">
          
          {/* Threads Column */}
          <div className="w-1/3 border-r border-slate-100 flex flex-col">
            <div className="p-4 bg-slate-50 border-b border-slate-100 font-outfit font-bold text-xs text-slate-400 uppercase tracking-wider">
              Conversations ({threads.length})
            </div>
            <div className="flex-grow overflow-y-auto divide-y divide-slate-100">
              {threads.map((thread) => {
                const latestMsg = thread.messages[thread.messages.length - 1];
                return (
                  <button
                    key={thread.key}
                    type="button"
                    onClick={() => setActiveThread(thread.key)}
                    className={`w-full text-left p-4 hover:bg-slate-50/50 transition-colors flex items-start gap-3 ${
                      activeThread === thread.key ? 'bg-slate-50' : ''
                    }`}
                  >
                    <img
                      src={thread.otherUser.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${thread.otherUser.name}`}
                      alt={thread.otherUser.name}
                      className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/60"
                    />
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <span className="text-xs font-bold text-slate-900 truncate">{thread.otherUser.name}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(latestMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-brand-600 truncate block mb-1">
                        Re: {thread.listing.title}
                      </span>
                      <p className="text-xs text-slate-500 truncate">{latestMsg.text}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Message Panel */}
          <div className="w-2/3 flex flex-col">
            {selectedThread ? (
              <>
                {/* Active Header */}
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedThread.otherUser.avatar}
                      alt={selectedThread.otherUser.name}
                      className="w-10 h-10 rounded-xl bg-white border border-slate-200"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{selectedThread.otherUser.name}</h4>
                      <p className="text-[11px] font-medium text-slate-400">
                        Inquiry about: <span className="text-brand-600 font-semibold">{selectedThread.listing.title}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages Feed */}
                <div className="flex-grow overflow-y-auto p-4 space-y-3 bg-slate-50/20">
                  {selectedThread.messages.map((msg) => {
                    const isMe = msg.sender._id === (user.id || user._id);
                    return (
                      <div 
                        key={msg._id} 
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[70%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                          isMe 
                            ? 'bg-slate-900 text-white rounded-tr-none' 
                            : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'
                        }`}>
                          <p>{msg.text}</p>
                          <span className={`block text-[9px] mt-1 text-right ${isMe ? 'text-slate-400' : 'text-slate-400'}`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Message Input Box */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-150 bg-white flex gap-3">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-grow rounded-xl border border-slate-200 px-4 py-2.5 text-xs focus:border-brand-500 focus:outline-none"
                    disabled={sending}
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-slate-950 text-xs font-semibold text-white hover:bg-brand-600"
                    disabled={sending || !inputText.trim()}
                  >
                    Send
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-grow flex items-center justify-center text-center text-slate-400 bg-slate-50/10">
                <p className="text-xs">Select a conversation thread to view messages.</p>
              </div>
            )}
          </div>
          
        </div>
      )}
    </div>
  );
}
