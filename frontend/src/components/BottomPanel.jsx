export default function BottomPanel({ output, isRunning, runStatus, activeTab, setActiveTab, stdin, setStdin }) {
  const tabs = ['OUTPUT', 'TERMINAL', 'INPUT']

  return (
    <div className="h-52 border-t border-[#1e2130] bg-[#0a0d14] flex flex-col shrink-0">
      {/* Tab bar */}
      <div className="flex items-center border-b border-[#1e2130] px-3 shrink-0">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={`px-4 py-2 text-xs font-medium tracking-wide transition-colors border-b-2
              ${activeTab === tab.toLowerCase()
                ? 'text-white border-purple-500'
                : 'text-slate-500 border-transparent hover:text-slate-300'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">

        {/* OUTPUT tab */}
        {activeTab === 'output' && (
          <>
            <div className="flex-1 p-3 overflow-y-auto">
              {isRunning && (
                <div className="flex items-center gap-2 text-yellow-400 text-xs">
                  <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  </svg>
                  {runStatus || 'Running...'}
                </div>
              )}

              {!isRunning && !output && (
                <span className="text-slate-600 text-xs">No output yet. Click Run to execute.</span>
              )}

              {!isRunning && output && (
                <div>
                  {/* Status header */}
                  <div className="flex items-center gap-2 mb-2">
                    {output.status === 'success' ? (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/>
                        </svg>
                        <span className="text-green-400 text-xs font-medium">Run completed</span>
                      </>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        <span className="text-red-400 text-xs font-medium">
                          Run failed{output.exitCode != null ? ` (exit code ${output.exitCode})` : ''}
                        </span>
                      </>
                    )}
                    <span className="text-slate-500 text-xs">{output.time}</span>
                  </div>

                  {/* stdout */}
                  {output.stdout && (
                    <pre className="code-font text-slate-200 text-xs whitespace-pre-wrap">{output.stdout}</pre>
                  )}

                  {/* stderr */}
                  {output.stderr && (
                    <pre className="code-font text-red-400 text-xs whitespace-pre-wrap mt-1">{output.stderr}</pre>
                  )}

                  {/* nothing printed */}
                  {!output.stdout && !output.stderr && (
                    <span className="text-slate-600 text-xs">(no output)</span>
                  )}
                </div>
              )}
            </div>

            {/* INPUT sidebar */}
            <div className="w-44 border-l border-[#1e2130] p-3 shrink-0 flex flex-col gap-3">
              <div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">
                  STDIN INPUT
                </div>
                <textarea
                  value={stdin}
                  onChange={e => setStdin(e.target.value)}
                  placeholder="Enter stdin here..."
                  rows={4}
                  className="w-full bg-[#1a1d27] border border-[#2a2d3d] rounded text-xs code-font text-slate-300 placeholder-slate-600 p-2 resize-none outline-none focus:border-purple-500 transition-colors"
                />
                <div className="text-[10px] text-slate-600 mt-1">
                  {stdin.split('\n').length} line{stdin.split('\n').length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </>
        )}

        {/* TERMINAL tab */}
        {activeTab === 'terminal' && (
          <div className="flex-1 p-3 code-font text-xs text-slate-400">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-green-400">$</span>
              <span>python main.py</span>
            </div>
            {output?.stdout && <pre className="text-slate-200 whitespace-pre-wrap">{output.stdout}</pre>}
            {output?.stderr && <pre className="text-red-400 whitespace-pre-wrap">{output.stderr}</pre>}
            {!output && <span className="text-slate-600">Run code to see terminal output.</span>}
          </div>
        )}

        {/* INPUT tab */}
        {activeTab === 'input' && (
          <div className="flex-1 p-3">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">STDIN</div>
            <textarea
              value={stdin}
              onChange={e => setStdin(e.target.value)}
              placeholder="Enter program input (stdin)..."
              className="w-full h-32 bg-[#1a1d27] border border-[#2a2d3d] rounded text-xs code-font text-slate-300 placeholder-slate-600 p-2 resize-none outline-none focus:border-purple-500 transition-colors"
            />
          </div>
        )}
      </div>
    </div>
  )
}
