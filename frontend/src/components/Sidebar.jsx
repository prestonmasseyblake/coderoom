import { useState } from 'react'

const PythonIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M11.914 0C5.82 0 6.2 2.656 6.2 2.656l.007 2.752h5.814v.826H3.9S0 5.789 0 11.969c0 6.18 3.403 5.96 3.403 5.96h2.031v-2.867s-.11-3.403 3.347-3.403h5.768s3.236.052 3.236-3.13V3.202S18.305 0 11.914 0zm-3.21 1.853a1.043 1.043 0 1 1 0 2.087 1.043 1.043 0 0 1 0-2.087z" fill="#3776ab"/>
    <path d="M12.086 24c6.094 0 5.714-2.656 5.714-2.656l-.007-2.752h-5.814v-.826h8.121S24 18.211 24 12.031c0-6.18-3.403-5.96-3.403-5.96h-2.031v2.867s.11 3.403-3.347 3.403H9.451s-3.236-.052-3.236 3.13v5.327S5.695 24 12.086 24zm3.21-1.853a1.043 1.043 0 1 1 0-2.087 1.043 1.043 0 0 1 0 2.087z" fill="#ffd43b"/>
  </svg>
)

const FileIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
    <polyline points="13 2 13 9 20 9"/>
  </svg>
)

const FolderIcon = ({ open }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {open
      ? <><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></>
      : <><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></>
    }
  </svg>
)

const ChevronDown = ({ open }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    style={{ transform: open ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.15s' }}>
    <polyline points="6 9 12 15 18 9"/>
  </svg>
)

export default function Sidebar({ sessionInfo, collapsed, onCollapse }) {
  const [filesOpen, setFilesOpen] = useState(true)
  const [explorerOpen, setExplorerOpen] = useState(true)
  const [activeFile, setActiveFile] = useState('main.py')
  const [folderOpen, setFolderOpen] = useState(true)

  if (collapsed) {
    return (
      <div className="w-10 bg-[#0f1117] border-r border-[#1e2130] flex flex-col items-center pt-3 shrink-0">
        <button onClick={onCollapse} className="text-slate-500 hover:text-slate-300 transition-colors p-1 mt-auto mb-3">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="13 17 18 12 13 7"/>
            <polyline points="6 17 11 12 6 7"/>
          </svg>
        </button>
      </div>
    )
  }

  return (
    <div className="w-52 bg-[#0f1117] border-r border-[#1e2130] flex flex-col text-xs shrink-0 overflow-hidden">

      {/* FILES */}
      <div className="px-3 pt-3">
        <button onClick={() => setFilesOpen(v => !v)}
          className="flex items-center justify-between w-full text-slate-400 hover:text-slate-200 transition-colors mb-1.5">
          <span className="font-semibold tracking-wider text-[10px] uppercase">Files</span>
          <ChevronDown open={filesOpen} />
        </button>
        {filesOpen && (
          <div className="space-y-0.5">
            <FileRow
              icon={<PythonIcon />}
              name="main.py"
              active={activeFile === 'main.py'}
              onClick={() => setActiveFile('main.py')}
            />
            <FileRow
              icon={<FileIcon />}
              name="input.txt"
              active={activeFile === 'input.txt'}
              onClick={() => setActiveFile('input.txt')}
            />
          </div>
        )}
      </div>

      <div className="border-t border-[#1e2130] mt-3"/>

      {/* EXPLORER */}
      <div className="px-3 pt-3">
        <button onClick={() => setExplorerOpen(v => !v)}
          className="flex items-center justify-between w-full text-slate-400 hover:text-slate-200 transition-colors mb-1.5">
          <span className="font-semibold tracking-wider text-[10px] uppercase">Explorer</span>
          <ChevronDown open={explorerOpen} />
        </button>
        {explorerOpen && (
          <div>
            <button
              onClick={() => setFolderOpen(v => !v)}
              className="flex items-center gap-1.5 w-full text-slate-400 hover:text-slate-200 py-0.5 transition-colors">
              <ChevronDown open={folderOpen} />
              <FolderIcon open={folderOpen} />
              <span className="text-slate-300">abc123</span>
            </button>
            {folderOpen && (
              <div className="ml-4 mt-0.5 space-y-0.5">
                <FileRow icon={<PythonIcon />} name="main.py"   active={activeFile === 'main.py'}   onClick={() => setActiveFile('main.py')}   indent />
                <FileRow icon={<FileIcon />}   name="input.txt" active={activeFile === 'input.txt'} onClick={() => setActiveFile('input.txt')} indent />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-[#1e2130] mt-3"/>

      {/* SESSION INFO */}
      <div className="px-3 pt-3 space-y-2">
        <div className="text-slate-400 font-semibold tracking-wider text-[10px] uppercase mb-1.5">Session Info</div>
        {[
          ['Language',     sessionInfo.language],
          ['Created by',   sessionInfo.createdBy],
          ['Created',      sessionInfo.created],
          ['Participants', sessionInfo.participants],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between">
            <span className="text-slate-500">{label}</span>
            <span className="text-slate-300">{value}</span>
          </div>
        ))}
      </div>

      {/* Collapse button */}
      <div className="mt-auto border-t border-[#1e2130] px-3 py-2.5">
        <button onClick={onCollapse}
          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="11 17 6 12 11 7"/>
            <polyline points="18 17 13 12 18 7"/>
          </svg>
          <span>Collapse</span>
        </button>
      </div>
    </div>
  )
}

function FileRow({ icon, name, active, onClick, indent }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 w-full py-1 px-2 rounded transition-colors text-left
        ${active ? 'bg-[#2a2d4a] text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-[#1a1d27]'}`}
    >
      {icon}
      <span className="truncate">{name}</span>
    </button>
  )
}
