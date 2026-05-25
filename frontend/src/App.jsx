import Header from './components/Header'
import Editor from './components/Editor'
import BottomPanel from './components/BottomPanel'
import RightPanel from './components/RightPanel'
import { useWebSocket } from './hooks/useWebSocket'

export default function App() {
  const {
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
  } = useWebSocket()

  return (
    <div className="flex flex-col h-screen bg-[#0f1117] text-slate-200 overflow-hidden">
      <Header
        collaborators={collaborators}
        isLive={isLive}
        isRunning={isRunning}
        onRun={runCode}
      />

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-col flex-1 overflow-hidden">
          <Editor
            code={code}
            setCode={setCode}
            cursors={cursors}
            onCursorMove={updateCursorPosition}
          />
          <BottomPanel
            output={output}
            isRunning={isRunning}
            runStatus={runStatus}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            stdin={stdin}
            setStdin={setStdin}
          />
        </div>

        <RightPanel
          collaborators={collaborators}
          messages={messages}
          onSendMessage={sendMessage}
        />
      </div>
    </div>
  )
}
