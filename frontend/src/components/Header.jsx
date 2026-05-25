import { useState } from 'react'

const AVATAR_COLORS = ['#a855f7', '#3b82f6', '#eab308', '#22c55e']

export default function Header({ collaborators, isLive, isRunning, onRun }) {
  const [copied, setCopied] = useState(false)
  const sessionId = 'abc123'

  const handleCopy = () => {
    navigator.clipboard.writeText(sessionId).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const shown = collaborators.slice(1, 4)
  const extra = collaborators.length - 4

  return (
    <header className="flex items-center justify-between px-4 h-12 border-b border-[#1e2130] bg-[#0f1117] shrink-0 z-10">
      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 18 22 12 16 6"/>
              <polyline points="8 6 2 12 8 18"/>
            </svg>
          </div>
          <span className="font-semibold text-white text-sm tracking-tight">CodeRoom</span>
        </div>

        {/* Session ID */}
        <div className="flex items-center gap-1.5 ml-4 px-2.5 py-1 rounded bg-[#1a1d27] border border-[#2a2d3d]">
          <span className="text-xs text-slate-300 font-mono">{sessionId}</span>
          <button onClick={handleCopy} className="text-slate-500 hover:text-slate-300 transition-colors">
            {copied ? (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
            )}
          </button>
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-1.5 px-2 py-0.5">
          <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-400' : 'bg-slate-500'}`}
            style={isLive ? { boxShadow: '0 0 6px #4ade80' } : {}} />
          <span className="text-xs text-slate-300">{isLive ? 'Live' : 'Offline'}</span>
        </div>
      </div>

      {/* Center: Collaborator avatars */}
      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">
          {shown.map((c, i) => (
            <div
              key={c.id}
              className="w-7 h-7 rounded-full border-2 border-[#0f1117] flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: AVATAR_COLORS[i], zIndex: shown.length - i }}
              title={c.name}
            >
              {c.avatar}
            </div>
          ))}
          {extra > 0 && (
            <div className="w-7 h-7 rounded-full border-2 border-[#0f1117] bg-[#2a2d3d] flex items-center justify-center text-xs text-slate-400 font-medium">
              +{extra}
            </div>
          )}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <button className="px-3.5 py-1.5 rounded-md bg-[#1a1d27] border border-[#2a2d3d] text-sm text-slate-300 hover:bg-[#22253a] transition-colors font-medium">
          Share
        </button>

        <div className="flex items-center rounded-md overflow-hidden border border-[#16a34a]">
          <button
            onClick={onRun}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#16a34a] hover:bg-[#15803d] text-white text-sm font-semibold transition-colors disabled:opacity-60"
          >
            {isRunning ? (
              <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            )}
            {isRunning ? 'Running...' : 'Run'}
          </button>
          <button className="px-1.5 py-1.5 bg-[#16a34a] hover:bg-[#15803d] text-white border-l border-[#15803d] transition-colors">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
        </div>

        <button className="w-8 h-8 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-[#1a1d27] transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </button>

        <button className="w-8 h-8 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-[#1a1d27] transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
          </svg>
        </button>
      </div>
    </header>
  )
}
