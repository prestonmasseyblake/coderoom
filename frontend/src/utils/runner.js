let pyodide = null
let loadPromise = null

export async function ensurePyodide(onStatus) {
  if (pyodide) return pyodide
  if (loadPromise) return loadPromise

  loadPromise = (async () => {
    onStatus?.('Loading Python runtime...')

    // Inject CDN script if not already present
    if (!window.loadPyodide) {
      await new Promise((resolve, reject) => {
        const s = document.createElement('script')
        s.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js'
        s.onload = resolve
        s.onerror = () => reject(new Error('Failed to load Pyodide script'))
        document.head.appendChild(s)
      })
    }

    onStatus?.('Initializing Python...')
    pyodide = await window.loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/',
    })
    onStatus?.(null)
    return pyodide
  })()

  return loadPromise
}

export async function runPython(code, stdin = '', onStatus) {
  const py = await ensurePyodide(onStatus)
  const start = performance.now()

  py.globals.set('_user_code', code)
  py.globals.set('_user_stdin', stdin)
  py.globals.set('_exit_code', 0)

  py.runPython(`
import sys, io, traceback

sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
sys.stdin  = io.StringIO(_user_stdin)

try:
    exec(compile(_user_code, 'main.py', 'exec'), {})
except SystemExit as e:
    _exit_code = int(e.code) if e.code is not None else 0
except Exception:
    traceback.print_exc()
    _exit_code = 1
`)

  const stdout  = py.runPython('sys.stdout.getvalue()')
  const stderr  = py.runPython('sys.stderr.getvalue()')
  const exitCode = py.globals.get('_exit_code')
  const elapsed = Math.round(performance.now() - start)

  return { stdout, stderr, exitCode, elapsed }
}
