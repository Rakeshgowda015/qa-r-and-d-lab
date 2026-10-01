import { useEffect, useMemo, useRef, useState } from 'react'
import { ExerciseCard, PageHeading, Result } from './Exercises.jsx'

const uploadLimit = 2 * 1024 * 1024
const allowedExtensions = new Set(['pdf', 'png', 'jpg', 'jpeg'])

function fileKey(file) {
  return `${file.name}:${file.size}:${file.lastModified}`
}

function validateFiles(fileList) {
  const accepted = []
  const errors = []
  for (const file of fileList) {
    const extension = file.name.split('.').pop()?.toLowerCase() ?? ''
    if (!allowedExtensions.has(extension)) {
      errors.push(`${file.name}: choose a PDF, PNG, JPG, or JPEG file.`)
    } else if (file.size > uploadLimit) {
      errors.push(`${file.name}: file must be 2 MB or smaller.`)
    } else {
      accepted.push(file)
    }
  }
  return { accepted, errors }
}

function useUploadState() {
  const [files, setFiles] = useState([])
  const [errors, setErrors] = useState([])
  const [progress, setProgress] = useState(0)
  const [uploadState, setUploadState] = useState('Choose files to begin.')
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (!uploading) return undefined
    if (progress >= 100) {
      setUploading(false)
      setUploadState('Upload complete. Files stayed in your browser.')
      return undefined
    }
    const timer = window.setTimeout(() => setProgress((current) => Math.min(current + 20, 100)), 180)
    return () => window.clearTimeout(timer)
  }, [uploading, progress])

  const addFiles = (fileList) => {
    const { accepted, errors: rejected } = validateFiles(Array.from(fileList ?? []))
    setErrors(rejected)
    setFiles((current) => {
      const seen = new Set(current.map(fileKey))
      return [...current, ...accepted.filter((file) => !seen.has(fileKey(file)))]
    })
    setProgress(0)
    setUploadState(accepted.length ? 'Ready to simulate an upload.' : rejected.length ? 'Some files need attention.' : 'Choose files to begin.')
    if (inputRef.current) inputRef.current.value = ''
  }

  const reset = () => {
    setFiles([])
    setErrors([])
    setProgress(0)
    setUploadState('Choose files to begin.')
    setUploading(false)
  }

  const start = () => {
    setProgress(0)
    setUploadState('Uploading…')
    setUploading(true)
  }

  const remove = (key) => setFiles((current) => current.filter((file) => fileKey(file) !== key))

  return { files, errors, progress, uploadState, uploading, inputRef, addFiles, reset, start, remove }
}

export function FileUploadSection() {
  const single = useUploadState()
  const multiple = useUploadState()

  return (
    <>
      <PageHeading id="upload" objective="Upload supported local files, reject unsupported or oversized files, and verify simulated progress." />
      <div className="exercise-grid">
        <ExerciseCard title="Single file upload" description="Accepted formats: PDF, PNG, JPG, and JPEG. Maximum size: 2 MB per file." task="Choose a supported file and simulate the upload. Then try selecting an unsupported file.">
          <label className="field">Choose one file<input ref={single.inputRef} name="singleUpload" type="file" accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg" onChange={(event) => single.addFiles(event.target.files)} /></label>
          <p className="small-muted">This demo validates file metadata only. It does not transmit file contents.</p>
          <UploadFeedback files={single.files} errors={single.errors} progress={single.progress} state={single.uploadState} onRemove={single.remove} />
          <div className="button-demo-row"><button className="button button-primary" type="button" disabled={!single.files.length || single.uploading || single.progress === 100} onClick={single.start}>{single.uploading ? 'Uploading…' : 'Simulate upload'}</button><button className="button button-secondary" type="button" onClick={single.reset}>Reset upload</button></div>
        </ExerciseCard>
        <ExerciseCard title="Multiple file upload" description="Select several files together and remove individual selections." task="Choose two supported files, remove one, then simulate the upload.">
          <label className="field">Choose multiple files<input ref={multiple.inputRef} name="multipleUpload" type="file" multiple accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg" onChange={(event) => multiple.addFiles(event.target.files)} /></label>
          <UploadFeedback files={multiple.files} errors={multiple.errors} progress={multiple.progress} state={multiple.uploadState} onRemove={multiple.remove} />
          <div className="button-demo-row"><button className="button button-primary" type="button" disabled={!multiple.files.length || multiple.uploading || multiple.progress === 100} onClick={multiple.start}>{multiple.uploading ? 'Uploading…' : `Simulate upload (${multiple.files.length})`}</button><button className="button button-secondary" type="button" onClick={multiple.reset}>Reset upload</button></div>
        </ExerciseCard>
      </div>
    </>
  )
}

function UploadFeedback({ files, errors, progress, state, onRemove }) {
  return (
    <>
      {files.length > 0 && <ul className="uploaded-file-list" aria-label="Selected files">
        {files.map((file) => <li key={fileKey(file)}><span><strong>{file.name}</strong><small>{(file.size / 1024).toFixed(1)} KB</small></span><button className="text-button" type="button" aria-label={`Remove ${file.name}`} onClick={() => onRemove(fileKey(file))}>Remove</button></li>)}
      </ul>}
      {errors.length > 0 && <div className="upload-errors" role="alert"><strong>File validation</strong><ul>{errors.map((error) => <li key={error}>{error}</li>)}</ul></div>}
      {progress > 0 && <div className="upload-progress"><div className="progress-track"><span className="progress-fill" style={{ width: `${progress}%` }} /></div><span>{progress}%</span></div>}
      <Result>{state}</Result>
    </>
  )
}

const reportRows = [
  ['QA-1042', 'Maya Chen', 'QA Engineer', 'Platform', 'Active'],
  ['QA-1043', 'Jordan Rivera', 'SDET', 'Payments', 'Active'],
  ['QA-1044', 'Amara Okafor', 'Test Analyst', 'Platform', 'On leave'],
]

function buildPdf() {
  const stream = 'BT\n/F1 18 Tf\n72 720 Td\n(QA R&D Lab - Practice Download) Tj\n0 -28 Td\n(This is a local sample PDF.) Tj\nET'
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
  ]
  let pdf = '%PDF-1.4\n'
  const offsets = [0]
  objects.forEach((object, index) => {
    offsets.push(pdf.length)
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`
  })
  const xrefOffset = pdf.length
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  offsets.slice(1).forEach((offset) => { pdf += `${String(offset).padStart(10, '0')} 00000 n \n` })
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`
  return pdf
}

export function DownloadSection() {
  const [lastDownload, setLastDownload] = useState('')
  const download = (filename, content, type) => {
    const url = URL.createObjectURL(new Blob([content], { type }))
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    setLastDownload(filename)
  }
  const csv = ['id,name,role,team,status', ...reportRows.map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(','))].join('\r\n')
  const json = JSON.stringify(reportRows.map(([id, name, role, team, status]) => ({ id, name, role, team, status })), null, 2)

  return (
    <>
      <PageHeading id="download" objective="Trigger browser downloads and verify each file name and format." />
      <ExerciseCard title="Download sample reports" description="Files are generated locally in your browser; no data is sent to a server." task="Download the CSV and JSON files, then download a text file and PDF report.">
        <div className="download-grid">
          <DownloadCard name="Team report.csv" format="CSV · 3 rows" onClick={() => download('team-report.csv', csv, 'text/csv;charset=utf-8')} />
          <DownloadCard name="Team report.json" format="JSON · structured records" onClick={() => download('team-report.json', json, 'application/json')} />
          <DownloadCard name="Readme.txt" format="TXT · plain text" onClick={() => download('qa-practice-readme.txt', 'QA R&D Lab sample download.\r\nPractice verifying browser downloads with your automation tool.', 'text/plain;charset=utf-8')} />
          <DownloadCard name="Practice report.pdf" format="PDF · sample document" onClick={() => download('qa-practice-report.pdf', buildPdf(), 'application/pdf')} />
        </div>
        <Result>Last download: {lastDownload || 'No file downloaded yet.'}</Result>
      </ExerciseCard>
    </>
  )
}

function DownloadCard({ name, format, onClick }) {
  return <button className="download-card" type="button" onClick={onClick}><span className="download-file-icon" aria-hidden="true">↓</span><span><strong>{name}</strong><small>{format}</small></span><span className="download-arrow" aria-hidden="true">↧</span></button>
}

const initialColumns = {
  backlog: [{ id: 'task-locator', title: 'Find the submit button' }, { id: 'task-form', title: 'Enter a valid email' }],
  progress: [{ id: 'task-table', title: 'Sort the team table' }],
  done: [{ id: 'task-login', title: 'Verify login message' }],
}

const columnTitles = { backlog: 'To do', progress: 'In progress', done: 'Done' }

export function DragDropSection() {
  const [columns, setColumns] = useState(initialColumns)
  const [dragging, setDragging] = useState('')
  const [message, setMessage] = useState('Move a task card to another column.')

  const moveTask = (taskId, destination) => {
    const movedTask = Object.values(columns).flat().find((task) => task.id === taskId)
    if (!movedTask || !columns[destination]) return
    setColumns((current) => {
      const next = { backlog: [...current.backlog], progress: [...current.progress], done: [...current.done] }
      let taskToMove
      for (const column of Object.keys(next)) {
        const index = next[column].findIndex((task) => task.id === taskId)
        if (index !== -1) taskToMove = next[column].splice(index, 1)[0]
      }
      if (!taskToMove) return current
      next[destination] = [...next[destination], taskToMove]
      return next
    })
    setMessage(`Moved “${movedTask.title}” to ${columnTitles[destination]}.`)
    setDragging('')
  }

  const reset = () => {
    setColumns({ backlog: [...initialColumns.backlog], progress: [...initialColumns.progress], done: [...initialColumns.done] })
    setMessage('Move a task card to another column.')
  }

  return (
    <>
      <PageHeading id="drag-drop" objective="Drag a task between columns and verify its new location. Use move buttons as a keyboard-accessible alternative." />
      <ExerciseCard title="QA task board" description="Drag task cards to another column, or use their move buttons." task="Move “Find the submit button” to In progress, then move it to Done.">
        <div className="task-board">
          {Object.entries(columns).map(([columnId, tasks]) => <section className={`task-column${dragging ? ' accepts-drop' : ''}`} key={columnId} aria-label={`${columnTitles[columnId]} tasks`} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); const taskId = event.dataTransfer.getData('text/plain'); if (taskId) moveTask(taskId, columnId) }}>
            <div className="task-column-head"><h3>{columnTitles[columnId]}</h3><span>{tasks.length}</span></div>
            <div className="task-column-content">{tasks.map((task) => <article className={`draggable-task${dragging === task.id ? ' task-dragging' : ''}`} key={task.id} draggable onDragStart={(event) => { event.dataTransfer.setData('text/plain', task.id); event.dataTransfer.effectAllowed = 'move'; setDragging(task.id) }} onDragEnd={() => setDragging('')} data-testid={task.id}>
              <span className="drag-handle" aria-hidden="true">⠿</span><strong>{task.title}</strong>
              <label className="sr-only" htmlFor={`${task.id}-destination`}>Move {task.title} to</label>
              <select id={`${task.id}-destination`} aria-label={`Move ${task.title} to`} value={columnId} onChange={(event) => moveTask(task.id, event.target.value)}><option value="backlog">To do</option><option value="progress">In progress</option><option value="done">Done</option></select>
            </article>)}
              {tasks.length === 0 && <p className="drop-empty">Drop a task here</p>}
            </div>
          </section>)}
        </div>
        <Result>{message}</Result>
      </ExerciseCard>
      <div className="reset-bar"><p><strong>Reset the task board?</strong> Return every task to its original column.</p><button type="button" className="button button-secondary button-small" onClick={reset}>Reset task board</button></div>
    </>
  )
}

export function WindowsSection() {
  const childWindows = useRef([])
  const [result, setResult] = useState('Open a child practice page to begin.')
  const [opened, setOpened] = useState(0)
  const childUrl = `${import.meta.env.BASE_URL}window-child.html`

  const openChild = (name, features) => {
    const child = window.open(childUrl, name, features)
    if (!child) {
      setResult('The browser blocked the new window. Allow pop-ups for this site and try again.')
      return
    }
    childWindows.current = [...childWindows.current.filter((item) => !item.closed), child]
    setOpened((count) => count + 1)
    setResult('Child practice page opened. Switch to it, then return here.')
  }

  const openMultiple = () => {
    const children = [1, 2, 3].map((number) => window.open(childUrl, `qa-lab-tab-${number}`)).filter(Boolean)
    childWindows.current = [...childWindows.current.filter((item) => !item.closed), ...children]
    setOpened((count) => count + children.length)
    setResult(children.length === 3 ? 'Opened three child pages.' : `Opened ${children.length} of 3 child pages. The browser may have blocked pop-ups.`)
  }

  const closeChildren = () => {
    const openChildren = childWindows.current.filter((child) => !child.closed)
    openChildren.forEach((child) => child.close())
    childWindows.current = []
    setResult(openChildren.length ? `Closed ${openChildren.length} child page(s).` : 'There are no child pages to close.')
  }

  return (
    <>
      <PageHeading id="windows" objective="Open child pages in tabs or windows, switch context, and close pages opened by this exercise." />
      <ExerciseCard title="Child browser contexts" description="Each child is a local static page in this site. Browser settings may block pop-ups." task="Open a new tab and a separate window, inspect each child page, then close them here.">
        <div className="button-demo-row">
          <button type="button" className="button button-primary" onClick={() => openChild('_blank', '')}>Open new tab</button>
          <button type="button" className="button button-secondary" onClick={() => openChild('qa-r-and-d-lab-window', 'popup,width=900,height=650')}>Open new window</button>
          <button type="button" className="button button-secondary" onClick={openMultiple}>Open three tabs</button>
          <button type="button" className="button button-secondary" onClick={closeChildren}>Close opened pages</button>
        </div>
        <Result>Opened from this page: {opened} · {result}</Result>
        <p className="small-muted">Use your browser’s tab/window controls or browser-automation context APIs to switch between the pages.</p>
      </ExerciseCard>
    </>
  )
}

const iframeDocument = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>
body{font:14px system-ui,sans-serif;color:#334155;margin:16px;background:#fff}form{display:grid;gap:12px;max-width:360px}label{display:grid;gap:5px;font-size:12px;font-weight:600}input,select{padding:8px;border:1px solid #cbd5e1;border-radius:5px;font:inherit}button{padding:9px 12px;border:0;border-radius:5px;color:white;background:#6653d2;font:600 12px system-ui;cursor:pointer}output{min-height:20px;color:#287857;font-size:12px}fieldset{border:1px solid #dbe2ea;border-radius:5px}legend{font-size:12px}
</style></head>
<body><form id="frame-form"><h2>Embedded practice form</h2><label for="frame-name">Your name</label><input id="frame-name" name="frameName" placeholder="Enter a name" required><label for="frame-team">Team</label><select id="frame-team" name="frameTeam"><option value="">Choose a team</option><option>Platform</option><option>Payments</option><option>Mobile</option></select><fieldset><legend>Preferred testing tool</legend><label><input type="checkbox" name="tool" value="Playwright"> Playwright</label><label><input type="checkbox" name="tool" value="Selenium"> Selenium</label></fieldset><button type="submit">Submit frame form</button><output id="frame-result" role="status"></output></form>
<script>document.querySelector('#frame-form').addEventListener('submit',event=>{event.preventDefault();const data=new FormData(event.currentTarget);document.querySelector('#frame-result').textContent='Saved '+data.get('frameName')+' · '+(data.get('frameTeam')||'No team selected')})</script>
</body></html>`

export function IframeSection() {
  return (
    <>
      <PageHeading id="iframe" objective="Switch into an iframe, complete its form, and verify the result inside the frame." />
      <ExerciseCard title="Embedded QA form" description="This isolated iframe contains its own inputs and submit result." task="Enter a name, choose a team and testing tool, then submit the form inside the iframe.">
        <iframe className="practice-iframe" title="Embedded QA practice form" sandbox="allow-forms allow-scripts" srcDoc={iframeDocument} data-testid="practice-iframe" />
      </ExerciseCard>
      <div className="callout callout-blue"><span aria-hidden="true">✳</span><p><strong>Automation task</strong> Locate the embedded form, switch into the frame, submit it, and verify the frame’s status message.</p></div>
    </>
  )
}

class QaShadowProfile extends HTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return
    const root = this.attachShadow({ mode: 'open' })
    root.innerHTML = `
      <style>
        :host{display:block;font:13px system-ui,sans-serif;color:#344057}
        form{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
        label{display:grid;gap:6px;color:#59667c;font-size:11px;font-weight:600}
        input,select{box-sizing:border-box;width:100%;min-height:37px;padding:8px 10px;border:1px solid #dfe4ec;border-radius:6px;background:white;color:#354158;font:11px system-ui}
        button{width:max-content;min-height:36px;padding:0 13px;border:0;border-radius:6px;color:white;background:#6854dd;font:600 11px system-ui;cursor:pointer}
        output{grid-column:1/-1;padding:9px 11px;border:1px solid #e9edf2;border-radius:6px;background:#f8f9fc;color:#4d5a72;font-size:11px}
        @media(max-width:500px){form{grid-template-columns:1fr}}
      </style>
      <form>
        <label for="shadow-name">Profile name<input id="shadow-name" name="profileName" data-testid="shadow-name" placeholder="Enter a name" required></label>
        <label for="shadow-team">Team<select id="shadow-team" name="profileTeam" data-testid="shadow-team"><option value="">Choose a team</option><option>Platform</option><option>Payments</option><option>Mobile</option></select></label>
        <button id="shadow-save" data-testid="shadow-save" type="submit">Save profile</button>
        <output id="shadow-result" data-testid="shadow-result" role="status">No profile saved yet.</output>
      </form>`
    root.querySelector('form').addEventListener('submit', (event) => {
      event.preventDefault()
      const data = new FormData(event.currentTarget)
      root.querySelector('output').textContent = `Saved ${data.get('profileName')} · ${data.get('profileTeam') || 'No team selected'}`
    })
  }
}

if (typeof window !== 'undefined' && !customElements.get('qa-shadow-profile')) {
  customElements.define('qa-shadow-profile', QaShadowProfile)
}

export function ShadowDomSection() {
  return (
    <>
      <PageHeading id="shadow-dom" objective="Interact with controls inside an open Shadow DOM root and verify the component’s status." />
      <ExerciseCard title="Shadow profile card" description="The controls below are rendered inside a custom element’s open shadow root." task="Enter a profile name, choose a team, save, and verify the status in the shadow root.">
        <qa-shadow-profile data-testid="shadow-profile-card" />
      </ExerciseCard>
      <div className="callout callout-blue"><span aria-hidden="true">✳</span><p><strong>Locator practice</strong> Inspect the custom element’s open shadow root. Its input, select, button, and status each have labels and stable test IDs inside the root.</p></div>
    </>
  )
}

export function AuthenticationSection() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [pending, setPending] = useState(false)
  const [sessionUser, setSessionUser] = useState('')
  const [message, setMessage] = useState('')
  const formRef = useRef(null)

  useEffect(() => {
    if (!pending) return undefined
    const timer = window.setTimeout(() => {
      setPending(false)
      if (username === 'locked.user') {
        setMessage('This practice account is locked. Choose a different account.')
      } else if (username === 'qa.user' && password === 'LabPass123') {
        setSessionUser(username)
        setMessage(`Welcome, ${username}. Local demo sign-in succeeded${remember ? ' (remember option selected)' : ''}.`)
      } else {
        setMessage('Sign-in failed. Check the practice username and password.')
      }
    }, 600)
    return () => window.clearTimeout(timer)
  }, [pending, username, password, remember])

  const reset = () => {
    setUsername('')
    setPassword('')
    setRemember(false)
    setPending(false)
    setSessionUser('')
    setMessage('')
    formRef.current?.reset()
  }

  return (
    <>
      <PageHeading id="authentication" objective="Practice form validation, successful sign-in, invalid credentials, locked accounts, and sign-out." />
      <ExerciseCard title={sessionUser ? 'Practice session' : 'Practice sign-in'} description="This is a fake client-side authentication flow. Credentials are not transmitted or saved." task="Use qa.user / LabPass123 for success. Try wrong credentials and locked.user to explore the other outcomes.">
        {sessionUser ? (
          <div className="auth-session">
            <span className="auth-avatar" aria-hidden="true">QA</span>
            <div><strong>Signed in as {sessionUser}</strong><p>This session exists only in the page’s current memory.</p></div>
            <button className="button button-secondary" type="button" onClick={reset}>Sign out</button>
          </div>
        ) : (
          <form className="auth-form" ref={formRef} onSubmit={(event) => { event.preventDefault(); setMessage(''); setPending(true) }}>
            <div className="field-grid">
              <label className="field">Username<input name="username" autoComplete="username" required value={username} onChange={(event) => setUsername(event.target.value)} /></label>
              <label className="field">Password<input name="password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
            </div>
            <label className="choice"><input name="remember" type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} /><span>Remember me for this page session</span></label>
            <button className="button button-primary" type="submit" disabled={pending}>{pending ? 'Signing in…' : 'Sign in'}</button>
          </form>
        )}
        {message && <div className={sessionUser ? 'success-message' : message.includes('succeeded') ? 'success-message' : 'upload-errors'} role={message.includes('failed') || message.includes('locked') ? 'alert' : 'status'}><strong>{message}</strong></div>}
        <div className="credential-note"><strong>Practice credentials</strong><span>Success: <code>qa.user</code> / <code>LabPass123</code></span><span>Locked account: <code>locked.user</code> / any password</span></div>
      </ExerciseCard>
    </>
  )
}

const networkScenarios = [
  { value: '200', label: '200 · Success' },
  { value: '400', label: '400 · Bad request' },
  { value: '401', label: '401 · Unauthorized' },
  { value: '403', label: '403 · Forbidden' },
  { value: '404', label: '404 · Not found' },
  { value: '500', label: '500 · Server error' },
  { value: 'timeout', label: 'Timeout' },
  { value: 'offline', label: 'Network failure' },
]

function getNetworkResult(scenario) {
  const responses = {
    '200': { kind: 'success', text: 'Request succeeded. Three sample records are ready.', status: 'HTTP 200 OK' },
    '400': { kind: 'error', text: 'The simulated request contained invalid input.', status: 'HTTP 400 Bad Request' },
    '401': { kind: 'error', text: 'The simulated request is not authenticated.', status: 'HTTP 401 Unauthorized' },
    '403': { kind: 'error', text: 'The simulated account is not allowed to access this resource.', status: 'HTTP 403 Forbidden' },
    '404': { kind: 'error', text: 'The requested simulated resource was not found.', status: 'HTTP 404 Not Found' },
    '500': { kind: 'error', text: 'The simulated server encountered an error.', status: 'HTTP 500 Internal Server Error' },
    timeout: { kind: 'error', text: 'The simulated request timed out after 1.5 seconds.', status: 'TIMEOUT' },
    offline: { kind: 'error', text: 'The simulated network connection failed. No real request was sent.', status: 'NETWORK ERROR' },
  }
  return responses[scenario]
}

export function NetworkSection() {
  const [scenario, setScenario] = useState('200')
  const [pending, setPending] = useState('')
  const [result, setResult] = useState(null)

  useEffect(() => {
    if (!pending) return undefined
    const request = pending
    const timer = window.setTimeout(() => {
      setResult(getNetworkResult(request))
      setPending('')
    }, request === 'timeout' ? 1500 : 700)
    return () => window.clearTimeout(timer)
  }, [pending])

  return (
    <>
      <PageHeading id="network" objective="Select a simulated response, wait for it to complete, and handle success and failure states." />
      <ExerciseCard title="Simulated request runner" description="All results are local demonstrations; the page makes no network/API request." task="Run a successful response, then try a 404 and a timeout. Verify each response status and message.">
        <div className="network-controls">
          <label className="field">Response scenario<select name="networkScenario" value={scenario} disabled={Boolean(pending)} onChange={(event) => setScenario(event.target.value)}>{networkScenarios.map(({ value, label }) => <option value={value} key={value}>{label}</option>)}</select></label>
          <button className="button button-primary" type="button" disabled={Boolean(pending)} onClick={() => { setResult(null); setPending(scenario) }}>{pending ? 'Waiting for response…' : 'Send simulated request'}</button>
        </div>
        {pending && <div className="loading-result is-loading" role="status"><span className="spinner" aria-hidden="true" /> Simulating {pending === 'timeout' ? 'a timeout' : `HTTP ${pending}`} response…</div>}
        {result && <div className={`network-result network-${result.kind}`} role={result.kind === 'error' ? 'alert' : 'status'}><div><strong>{result.status}</strong><p>{result.text}</p></div></div>}
        <p className="small-muted">The simulated delay is bounded: 700 ms normally and 1.5 seconds for the timeout case.</p>
      </ExerciseCard>
    </>
  )
}

export function ChallengeSection() {
  const [selectorVersion, setSelectorVersion] = useState(1)
  const [hiddenVisible, setHiddenVisible] = useState(false)
  const [delayed, setDelayed] = useState(false)
  const [showDelayed, setShowDelayed] = useState(false)
  const [delayAttempt, setDelayAttempt] = useState(0)
  const [position, setPosition] = useState(0)
  const [dataVersion, setDataVersion] = useState(1)
  const [listVersion, setListVersion] = useState(0)

  useEffect(() => {
    if (!showDelayed) return undefined
    const timer = window.setTimeout(() => setDelayed(true), 1100)
    return () => window.clearTimeout(timer)
  }, [showDelayed, delayAttempt])

  const challengeItems = useMemo(() => {
    const items = ['Build a stable locator', 'Wait for content', 'Verify an updated row']
    const offset = listVersion % items.length
    return [...items.slice(offset), ...items.slice(0, offset)]
  }, [listVersion])

  const reset = () => {
    setSelectorVersion(1)
    setHiddenVisible(false)
    setDelayed(false)
    setShowDelayed(false)
    setDelayAttempt(0)
    setPosition(0)
    setDataVersion(1)
    setListVersion(0)
  }

  return (
    <>
      <PageHeading id="challenges" objective="Practice robust automation against deliberately changing attributes, hidden content, delays, moving targets, and refreshed data." />
      <div className="callout callout-amber challenge-notice"><span aria-hidden="true">⚑</span><p><strong>Challenge mode</strong> Selector and content changes are intentional. They follow controlled sequences rather than random timing, so every challenge remains reproducible.</p></div>
      <div className="exercise-grid">
        <ExerciseCard title="Changing identifier and class" description="Regenerate stable-but-changing attributes using a fixed sequence." task="Record the current identifier and class. Regenerate them and locate the control using its accessible name.">
          <button id={`challenge-control-${selectorVersion}`} className={`challenge-selector challenge-class-${selectorVersion % 3}`} data-testid={`challenge-control-${selectorVersion}`} type="button" onClick={() => setSelectorVersion((version) => version + 1)}>Regenerate challenge selector</button>
          <Result>Current ID: challenge-control-{selectorVersion} · Current class: challenge-class-{selectorVersion % 3}</Result>
        </ExerciseCard>
        <ExerciseCard title="Hidden element" description="The challenge message exists in the DOM but starts visually hidden." task="Reveal the message and verify it is visible.">
          <button className="button button-secondary" type="button" onClick={() => setHiddenVisible((visible) => !visible)}>{hiddenVisible ? 'Hide message' : 'Reveal hidden message'}</button>
          <p className={`challenge-hidden-message${hiddenVisible ? ' challenge-message-visible' : ''}`} aria-hidden={!hiddenVisible}>Hidden challenge message is now visible.</p>
        </ExerciseCard>
        <ExerciseCard title="Bounded delayed control" description="The target appears 1.1 seconds after you start the challenge." task="Start the challenge, wait for the control, and verify its text.">
          <button className="button button-primary" type="button" disabled={showDelayed && !delayed} onClick={() => { setDelayed(false); setShowDelayed(true); setDelayAttempt((attempt) => attempt + 1) }}>{showDelayed && !delayed ? 'Waiting…' : 'Start delayed challenge'}</button>
          {delayed && <Result label="Delayed target"><span data-testid="delayed-challenge-target">Delayed challenge target appeared.</span></Result>}
        </ExerciseCard>
        <ExerciseCard title="Moving target" description="The control moves through four known positions in a repeatable cycle." task="Move the target twice and find it by its accessible name, not its coordinates.">
          <div className="moving-target-stage"><button className={`moving-target moving-position-${position}`} type="button" onClick={() => setPosition((current) => (current + 1) % 4)}>Move challenge target</button></div>
          <Result>Target position index: {position}</Result>
        </ExerciseCard>
        <ExerciseCard title="Refreshed data" description="Refresh the data snapshot to replace the version and item order." task="Refresh the data and verify both its version and updated list order.">
          <button className="button button-secondary" type="button" onClick={() => { setDataVersion((version) => version + 1); setListVersion((version) => version + 1) }}>Refresh challenge data</button>
          <Result>Data version: {dataVersion}</Result>
          <ol className="challenge-list" data-testid="challenge-data-list">{challengeItems.map((item) => <li key={item}>{item}</li>)}</ol>
        </ExerciseCard>
      </div>
      <div className="reset-bar"><p><strong>Reset challenge mode?</strong> Restore the initial identifiers, hidden state, and data sequence.</p><button className="button button-secondary button-small" type="button" onClick={reset}>Reset challenges</button></div>
    </>
  )
}
