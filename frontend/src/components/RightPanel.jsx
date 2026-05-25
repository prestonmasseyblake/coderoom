import { useState, useRef, useEffect } from 'react'

export default function RightPanel({ collaborators, messages, onSendMessage }) {
  // const [input, setInput] = useState('')
  // const messagesEndRef = useRef(null)

  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  // }, [messages])

  // const handleSend = () => {
  //   const trimmed = input.trim()
  //   if (!trimmed) return
  //   onSendMessage(trimmed)
  //   setInput('')
  // }

  // const handleKeyDown = (e) => {
  //   if (e.key === 'Enter' && !e.shiftKey) {
  //     e.preventDefault()
  //     handleSend()
  //   }
  // }

  return (
    <div className="w-64 border-l border-[#1e2130] bg-[#0f1117] flex flex-col shrink-0 overflow-hidden">
      {/* Collaborators */}
      <div className="px-4 pt-4 pb-3 shrink-0">
        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Collaborators ({collaborators.length})
        </div>
        <div className="space-y-2">
          {collaborators.map(c => (
            <div key={c.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                  style={{ backgroundColor: c.color }}
                >
                  {c.avatar || 'Y'}
                </div>
                <span className="text-xs text-slate-300 truncate">{c.name}</span>
              </div>
              {c.role === 'owner' && (
                <span className="text-[10px] text-slate-400 border border-[#2a2d3d] px-1.5 py-0.5 rounded shrink-0">
                  Owner
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat — commented out
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="px-4 pt-3 pb-2 shrink-0">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Chat</div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 space-y-4 pb-2">
          {messages.map(msg => (
            <div key={msg.id} className="flex gap-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5"
                style={{ backgroundColor: msg.color }}
              >
                {msg.avatar || 'Y'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-xs font-semibold text-slate-200">{msg.user}</span>
                  <span className="text-[10px] text-slate-600">{msg.time}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed break-words">{msg.text}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="px-3 pb-3 pt-2 border-t border-[#1e2130] shrink-0">
          <div className="flex items-center gap-1 bg-[#1a1d27] border border-[#2a2d3d] rounded-md px-2 py-1.5">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 bg-transparent text-xs text-slate-300 placeholder-slate-600 outline-none"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="text-slate-500 hover:text-purple-400 transition-colors disabled:opacity-30"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      */}
    </div>
  )
}
