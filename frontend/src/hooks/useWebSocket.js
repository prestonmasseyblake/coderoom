import { useState, useEffect, useRef, useCallback } from 'react'
import { runPython, ensurePyodide } from '../utils/runner'

const INITIAL_CODE = `n = int(input())
is_prime = True

if n < 2:
    is_prime = False
else:
    for i in range(2, int(n ** 0.5) + 1):
        if n % i == 0:
            is_prime = False
            break

if is_prime:
    print(f"{n} is a prime number")
else:
    print(f"{n} is not a prime number")
`

const COLLABORATORS = [
  { id: 'you',   name: 'You (Anonymous)', color: '#7c3aed', role: 'owner', avatar: null },
  { id: 'ava',   name: 'Ava',   color: '#a855f7', avatar: 'A' },
  { id: 'ethan', name: 'Ethan', color: '#3b82f6', avatar: 'E' },
  { id: 'maya',  name: 'Maya',  color: '#eab308', avatar: 'M' },
  { id: 'liam',  name: 'Liam',  color: '#22c55e', avatar: 'L' },
]

const INITIAL_MESSAGES = [
  { id: 1, user: 'Ava',   color: '#a855f7', avatar: 'A', time: '10:24 AM', text: 'Can we handle 1 as a non-prime?' },
  { id: 2, user: 'You',   color: '#7c3aed', avatar: null, time: '10:25 AM', text: 'Good catch!' },
  { id: 3, user: 'Ethan', color: '#3b82f6', avatar: 'E', time: '10:25 AM', text: 'Looks good to me 🚀' },
]

const SIMULATED_CURSORS = [
  { userId: 'ava',   line: 2,  label: 'Ava',   color: '#a855f7' },
  { userId: 'you',   line: 7,  label: 'You',   color: '#eab308' },
  { userId: 'ethan', line: 13, label: 'Ethan', color: '#3b82f6' },
]


export function useWebSocket() {
  const [code, setCode] = useState(INITIAL_CODE)
  const [stdin, setStdin] = useState('7')
  const [cursors, setCursors] = useState(SIMULATED_CURSORS)
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [collaborators] = useState(COLLABORATORS)
  const [isLive] = useState(true)
  const [isRunning, setIsRunning] = useState(false)
  const [runStatus, setRunStatus] = useState(null) // e.g. "Loading Python runtime..."
  const [output, setOutput] = useState(null)
  const [activeTab, setActiveTab] = useState('output')
  const nextMsgId = useRef(4)

  // Preload Pyodide in background so first Run is fast
  useEffect(() => { ensurePyodide() }, [])

// Simulate incoming chat messages
  useEffect(() => {
    const incoming = [
      { user: 'Maya',  color: '#eab308', avatar: 'M', text: 'I can test edge cases!' },
      { user: 'Liam',  color: '#22c55e', avatar: 'L', text: 'Should we add input validation?' },
      { user: 'Ava',   color: '#a855f7', avatar: 'A', text: 'Great work everyone 🎉' },
    ]
    let idx = 0
    const interval = setInterval(() => {
      if (idx < incoming.length) {
        const msg = incoming[idx++]
        const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        setMessages(prev => [...prev, { id: nextMsgId.current++, ...msg, time }])
      }
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  const sendMessage = useCallback((text) => {
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    setMessages(prev => [...prev, {
      id: nextMsgId.current++,
      user: 'You', color: '#7c3aed', avatar: null, time, text,
    }])
  }, [])

  const runCode = useCallback(async () => {
    setIsRunning(true)
    setActiveTab('output')
    setOutput(null)
    try {
      const { stdout, stderr, exitCode, elapsed } = await runPython(code, stdin, setRunStatus)
      setOutput({
        stdout,
        stderr,
        exitCode,
        time: `${elapsed}ms`,
        status: exitCode === 0 ? 'success' : 'error',
      })
    } catch (err) {
      setOutput({
        stdout: '',
        stderr: err.message,
        exitCode: 1,
        time: '—',
        status: 'error',
      })
    } finally {
      setIsRunning(false)
      setRunStatus(null)
    }
  }, [code, stdin])

  const updateCursorPosition = useCallback((line) => {
    setCursors(prev => prev.map(c => c.userId === 'you' ? { ...c, line } : c))
  }, [])

  return {
    code, setCode,
    stdin, setStdin,
    cursors,
    messages, sendMessage,
    collaborators,
    isLive,
    isRunning, runStatus, runCode,
    output,
    activeTab, setActiveTab,
    updateCursorPosition,
  }
}
