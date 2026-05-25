import { useRef, useEffect, useCallback } from 'react'
import MonacoEditor from '@monaco-editor/react'

const PythonIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
    <path d="M11.914 0C5.82 0 6.2 2.656 6.2 2.656l.007 2.752h5.814v.826H3.9S0 5.789 0 11.969c0 6.18 3.403 5.96 3.403 5.96h2.031v-2.867s-.11-3.403 3.347-3.403h5.768s3.236.052 3.236-3.13V3.202S18.305 0 11.914 0zm-3.21 1.853a1.043 1.043 0 1 1 0 2.087 1.043 1.043 0 0 1 0-2.087z" fill="#3776ab"/>
    <path d="M12.086 24c6.094 0 5.714-2.656 5.714-2.656l-.007-2.752h-5.814v-.826h8.121S24 18.211 24 12.031c0-6.18-3.403-5.96-3.403-5.96h-2.031v2.867s.11 3.403-3.347 3.403H9.451s-3.236-.052-3.236 3.13v5.327S5.695 24 12.086 24zm3.21-1.853a1.043 1.043 0 1 1 0-2.087 1.043 1.043 0 0 1 0 2.087z" fill="#ffd43b"/>
  </svg>
)

// Collaborative cursor decorator IDs
let decorationCollection = null

export default function Editor({ code, setCode, cursors, onCursorMove }) {
  const editorRef = useRef(null)
  const monacoRef = useRef(null)
  const decorationsRef = useRef([])

  const handleEditorDidMount = useCallback((editor, monaco) => {
    editorRef.current = editor
    monacoRef.current = monaco

    // Define CodeRoom dark theme
    monaco.editor.defineTheme('coderoom-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword',          foreground: 'c084fc', fontStyle: 'bold' },
        { token: 'keyword.control',  foreground: 'c084fc', fontStyle: 'bold' },
        { token: 'string',           foreground: '34d399' },
        { token: 'string.escape',    foreground: '34d399' },
        { token: 'number',           foreground: 'fb923c' },
        { token: 'comment',          foreground: '6b7280', fontStyle: 'italic' },
        { token: 'identifier',       foreground: 'e2e8f0' },
        { token: 'type',             foreground: '60a5fa' },
        { token: 'delimiter',        foreground: '94a3b8' },
        { token: 'operator',         foreground: 'e2e8f0' },
      ],
      colors: {
        'editor.background':              '#0f1117',
        'editor.foreground':              '#e2e8f0',
        'editor.lineHighlightBackground': '#1a1d27',
        'editor.selectionBackground':     '#3730a380',
        'editorLineNumber.foreground':    '#374151',
        'editorLineNumber.activeForeground': '#94a3b8',
        'editorCursor.foreground':        '#a78bfa',
        'editorGutter.background':        '#0f1117',
        'editorWidget.background':        '#1a1d27',
        'editorWidget.border':            '#2a2d3d',
        'editorSuggestWidget.background': '#1a1d27',
        'editorSuggestWidget.border':     '#2a2d3d',
        'editorSuggestWidget.selectedBackground': '#2a2d4a',
        'scrollbar.shadow':               '#00000000',
        'scrollbarSlider.background':     '#37415180',
        'scrollbarSlider.hoverBackground':'#4b556380',
        'scrollbarSlider.activeBackground':'#6b728080',
      },
    })
    monaco.editor.setTheme('coderoom-dark')

    // Track cursor position for "you"
    editor.onDidChangeCursorPosition((e) => {
      onCursorMove?.(e.position.lineNumber)
    })
  }, [onCursorMove])

  // Apply collaborator cursor decorations whenever cursors change
  useEffect(() => {
    const editor = editorRef.current
    const monaco = monacoRef.current
    if (!editor || !monaco) return

    const others = cursors.filter(c => c.userId !== 'you')
    const totalLines = editor.getModel()?.getLineCount() || 1

    const newDecorations = others.flatMap(c => {
      const line = Math.min(c.line, totalLines)
      const col = editor.getModel()?.getLineMaxColumn(line) || 1

      // Inline label CSS class (injected once per user color)
      const colorKey = c.color.replace('#', '')
      const styleId = `cursor-style-${colorKey}`
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style')
        style.id = styleId
        style.textContent = `
          .cursor-label-${colorKey}::after {
            content: '${c.label}';
            background: ${c.color};
            color: white;
            font-size: 10px;
            font-weight: 600;
            padding: 1px 5px;
            border-radius: 3px;
            margin-left: 4px;
            pointer-events: none;
            white-space: nowrap;
          }
          .cursor-line-${colorKey} {
            background: ${c.color}18;
            border-left: 2px solid ${c.color};
          }
        `
        document.head.appendChild(style)
      }

      return [
        // Line highlight
        {
          range: new monaco.Range(line, 1, line, 1),
          options: {
            isWholeLine: true,
            className: `cursor-line-${colorKey}`,
          },
        },
        // Cursor label at end of line
        {
          range: new monaco.Range(line, col, line, col),
          options: {
            afterContentClassName: `cursor-label-${colorKey}`,
          },
        },
      ]
    })

    decorationsRef.current = editor.deltaDecorations(decorationsRef.current, newDecorations)
  }, [cursors])

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-[#0f1117]">
      {/* Tab bar */}
      <div className="flex items-center border-b border-[#1e2130] bg-[#0f1117] px-2 shrink-0">
        <div className="flex items-center gap-1.5 px-3 py-2 border-b-2 border-purple-500 text-white text-xs">
          <PythonIcon />
          <span>main.py</span>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 overflow-hidden">
        <MonacoEditor
          height="100%"
          language="python"
          value={code}
          onChange={(val) => setCode(val ?? '')}
          onMount={handleEditorDidMount}
          loading={
            <div className="flex items-center justify-center h-full bg-[#0f1117] text-slate-500 text-sm">
              Loading editor...
            </div>
          }
          options={{
            fontSize: 13,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
            fontLigatures: true,
            lineHeight: 21,
            tabSize: 4,
            insertSpaces: true,
            wordWrap: 'off',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            renderLineHighlight: 'line',
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            smoothScrolling: true,
            padding: { top: 8, bottom: 8 },
            lineNumbersMinChars: 3,
            glyphMargin: false,
            folding: true,
            bracketPairColorization: { enabled: true },
            autoClosingBrackets: 'always',
            autoClosingQuotes: 'always',
            formatOnPaste: false,
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
            parameterHints: { enabled: true },
            scrollbar: {
              verticalScrollbarSize: 6,
              horizontalScrollbarSize: 6,
            },
          }}
        />
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-4 h-6 border-t border-[#1e2130] bg-[#0a0d14] text-[10px] text-slate-500 shrink-0">
        <div className="flex items-center gap-4">
          <span>Spaces: 4</span>
          <span>UTF-8</span>
          <span>LF</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Python 3.11</span>
          <span className="w-2 h-2 rounded-full bg-green-400" style={{ boxShadow: '0 0 4px #4ade80' }} />
        </div>
      </div>
    </div>
  )
}
