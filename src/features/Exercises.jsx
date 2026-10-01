import { useEffect, useMemo, useRef, useState } from 'react'

const employees = [
  { id: 'QA-1042', name: 'Maya Chen', role: 'QA Engineer', team: 'Platform', status: 'Active' },
  { id: 'QA-1043', name: 'Jordan Rivera', role: 'SDET', team: 'Payments', status: 'Active' },
  { id: 'QA-1044', name: 'Amara Okafor', role: 'Test Analyst', team: 'Platform', status: 'On leave' },
  { id: 'QA-1045', name: 'Luca Moretti', role: 'QA Engineer', team: 'Mobile', status: 'Active' },
  { id: 'QA-1046', name: 'Priya Nair', role: 'Automation Lead', team: 'Payments', status: 'Active' },
]

const exerciseInfo = {
  inputs: { number: '01', level: 'Beginner', title: 'Inputs', description: 'Practice locating fields, entering values, and checking their current state.' },
  selections: { number: '02', level: 'Beginner', title: 'Selections', description: 'Explore radio groups, checkboxes, and native select controls.' },
  buttons: { number: '03', level: 'Beginner', title: 'Buttons', description: 'Interact with enabled and disabled buttons and verify the result.' },
  forms: { number: '04', level: 'Beginner', title: 'Forms', description: 'Complete a registration form and inspect validation feedback.' },
  tables: { number: '05', level: 'Intermediate', title: 'Tables', description: 'Search and sort a predictable data set, then update a row.' },
  dynamic: { number: '06', level: 'Advanced', title: 'Dynamic elements & dialogs', description: 'Practice synchronization with bounded changes and common dialogs.' },
  pagination: { number: '07', level: 'Intermediate', title: 'Pagination', description: 'Navigate a predictable list of records and inspect page boundaries.' },
  filters: { number: '08', level: 'Intermediate', title: 'Search & filters', description: 'Combine search text with category, status, and price filters.' },
  'date-time': { number: '09', level: 'Intermediate', title: 'Date & time', description: 'Enter dates and times, select a range, and validate the result.' },
  mouse: { number: '10', level: 'Intermediate', title: 'Mouse actions', description: 'Practice hover, double-click, and right-click interactions.' },
  keyboard: { number: '11', level: 'Intermediate', title: 'Keyboard actions', description: 'Capture key presses, combinations, and keyboard form submission.' },
}

export function PageHeading({ id, objective, children }) {
  const info = exerciseInfo[id]
  return (
    <div className="exercise-heading">
      <div className="breadcrumb"><a href="#overview">Practice lab</a><span aria-hidden="true">/</span><span>{info.title}</span></div>
      <div className="heading-row">
        <div><p className="eyebrow">EXERCISE {info.number} <span className="eyebrow-dot">·</span> {info.level.toUpperCase()}</p><h1>{info.title}</h1><p className="section-subtitle">{info.description}</p></div>
        <span className={`difficulty-pill difficulty-${info.level.toLowerCase()}`}>{info.level}</span>
      </div>
      <div className="objective"><span aria-hidden="true">◎</span><p><strong>Objective</strong> {objective}</p></div>
      {children}
    </div>
  )
}

export function ExerciseCard({ title, description, task, children, className = '' }) {
  return (
    <section className={`exercise-card ${className}`}>
      <div className="exercise-card-head"><div><h2>{title}</h2><p>{description}</p></div><span className="task-count">TRY IT</span></div>
      {task && <div className="task-prompt"><span className="task-check" aria-hidden="true">✓</span><p><strong>Your task</strong>{task}</p></div>}
      <div className="exercise-card-body">{children}</div>
    </section>
  )
}

export function Result({ children, label = 'Observed result' }) {
  return <div className="result-box" role="status"><span className="result-label">{label}</span><strong>{children}</strong></div>
}

export function InputsSection() {
  const [name, setName] = useState('')
  const [search, setSearch] = useState('')
  const fieldsRef = useRef(null)
  return (
    <>
      <PageHeading id="inputs" objective="Enter and inspect values in common input types, including fields with special states." />
      <form className="exercise-grid" ref={fieldsRef} onSubmit={(event) => event.preventDefault()}>
        <ExerciseCard title="Text fields" description="Enter a value and observe it in the live result." task="Enter your name and a search term, then verify the displayed values.">
          <div className="field-grid">
            <label className="field">Full name<input id="practice-name" name="fullName" type="text" placeholder="e.g. Alex Morgan" value={name} onChange={(event) => setName(event.target.value)} /></label>
            <label className="field">Search term<input aria-label="Search the sample catalog" name="query" type="search" placeholder="Try “automation”" value={search} onChange={(event) => setSearch(event.target.value)} /></label>
          </div>
          <Result>Name: {name || '—'} · Search: {search || '—'}</Result>
        </ExerciseCard>
        <ExerciseCard title="Field states" description="Readonly and disabled controls behave differently from editable fields." task="Read the readonly value and check which field is disabled.">
          <div className="field-grid">
            <label className="field">Readonly reference<input name="referenceCode" value="LAB-2026-041" readOnly /></label>
            <label className="field">Disabled field<input name="accountStatus" value="Verified account" disabled readOnly /></label>
          </div>
          <div className="hint-line"><span aria-hidden="true">i</span> Try typing into each field and observe the difference.</div>
        </ExerciseCard>
        <ExerciseCard title="More input types" description="These controls keep their native browser behavior." task="Choose a date and inspect the current email value.">
          <div className="field-grid">
            <label className="field">Contact email<input name="contactEmail" type="email" placeholder="you@example.com" /></label>
            <label className="field">Quantity<input name="quantity" type="number" min="1" defaultValue="2" /></label>
            <label className="field">Start date<input name="startDate" type="date" /></label>
            <label className="field">Notes<textarea name="notes" rows="2" placeholder="Add a short note…" /></label>
          </div>
        </ExerciseCard>
      </form>
      <div className="reset-bar"><p><strong>Want to start over?</strong> Restore all input examples to their initial values.</p><button className="button button-secondary button-small" type="button" onClick={() => { fieldsRef.current?.reset(); setName(''); setSearch('') }}>Reset inputs</button></div>
    </>
  )
}

export function SelectionsSection() {
  const [experience, setExperience] = useState('Intermediate')
  const [skills, setSkills] = useState(['Playwright'])
  const [country, setCountry] = useState('')
  const toggleSkill = (skill) => setSkills((current) => current.includes(skill) ? current.filter((item) => item !== skill) : [...current, skill])
  const allSkills = ['Java', 'Python', 'JavaScript', 'Selenium', 'Playwright']
  return (
    <>
      <PageHeading id="selections" objective="Choose options from radio groups, checkboxes, and native dropdowns, then verify their state." />
      <div className="exercise-grid">
        <ExerciseCard title="Radio group" description="Radio controls allow one choice within a group." task="Select an experience level and verify the chosen option.">
          <fieldset className="choice-fieldset"><legend>Experience level</legend><div className="choice-list">{['Beginner', 'Intermediate', 'Advanced'].map((level) => <label className="choice" key={level}><input type="radio" name="experience" value={level} checked={experience === level} onChange={() => setExperience(level)} /><span>{level}</span></label>)}</div></fieldset>
          <Result>Selected: {experience}</Result>
        </ExerciseCard>
        <ExerciseCard title="Checkboxes" description="Select more than one skill or clear all selections." task="Choose two skills, then use the clear button to reset them.">
          <fieldset className="choice-fieldset"><legend>Automation skills</legend><div className="choice-list choice-list-grid">{allSkills.map((skill) => <label className="choice" key={skill}><input type="checkbox" name="skills" value={skill} checked={skills.includes(skill)} onChange={() => toggleSkill(skill)} /><span>{skill}</span></label>)}</div></fieldset>
          <div className="result-actions"><Result>Selected: {skills.length ? skills.join(', ') : 'None'}</Result><button type="button" className="button button-secondary button-small" onClick={() => setSkills([])}>Clear selections</button></div>
        </ExerciseCard>
        <ExerciseCard title="Native dropdown" description="Practice selecting and reading a native option." task="Choose a country and verify the selected value.">
          <label className="field field-narrow">Country<select name="country" value={country} onChange={(event) => setCountry(event.target.value)}><option value="">Select a country…</option><option>India</option><option>Japan</option><option>United Kingdom</option><option>United States</option></select></label>
          <Result>Country: {country || 'No country selected'}</Result>
        </ExerciseCard>
      </div>
      <div className="reset-bar"><p><strong>Want to start over?</strong> Restore the default radio, checkbox, and dropdown selections.</p><button className="button button-secondary button-small" type="button" onClick={() => { setExperience('Intermediate'); setSkills(['Playwright']); setCountry('') }}>Reset selections</button></div>
    </>
  )
}

export function ButtonsSection() {
  const [message, setMessage] = useState('Nothing clicked yet.')
  return (
    <>
      <PageHeading id="buttons" objective="Identify actionable controls, distinguish a disabled button, and verify a click outcome." />
      <ExerciseCard title="Button states" description="A basic action button, a disabled control, and a button that changes its result." task="Click the action button and confirm the success message appears.">
        <div className="button-demo-row"><button className="button button-primary" type="button" onClick={() => setMessage('Action completed successfully.')}>Run action <span aria-hidden="true">→</span></button><button className="button button-secondary" type="button" onClick={() => setMessage('Secondary action completed.')}>Secondary action</button><button className="button button-secondary" type="button" disabled>Unavailable</button></div>
        <Result>{message}</Result>
        <button className="text-button" type="button" onClick={() => setMessage('Nothing clicked yet.')}>Reset result</button>
      </ExerciseCard>
      <div className="callout callout-blue"><span aria-hidden="true">✳</span><p><strong>Automation task</strong> Locate the disabled button and verify that it cannot be activated. Then click “Run action” and verify the result text.</p></div>
    </>
  )
}

export function FormsSection() {
  const [values, setValues] = useState({ fullName: '', email: '', password: '', confirmPassword: '', terms: false })
  const [submitted, setSubmitted] = useState(false)
  const [success, setSuccess] = useState(false)
  const change = (event) => {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }))
    setSuccess(false)
  }
  const errors = {
    fullName: !values.fullName.trim() ? 'Enter your name.' : '',
    email: !values.email.trim() ? 'Enter your email address.' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) ? 'Enter a valid email address.' : '',
    password: values.password.length < 8 ? 'Use at least 8 characters.' : '',
    confirmPassword: values.confirmPassword !== values.password ? 'Passwords do not match.' : '',
    terms: !values.terms ? 'Accept the practice terms to continue.' : '',
  }
  const submit = (event) => {
    event.preventDefault()
    setSubmitted(true)
    const hasErrors = Object.values(errors).some(Boolean)
    setSuccess(!hasErrors)
  }
  const reset = () => {
    setValues({ fullName: '', email: '', password: '', confirmPassword: '', terms: false })
    setSubmitted(false)
    setSuccess(false)
  }
  return (
    <>
      <PageHeading id="forms" objective="Complete the form, trigger validation errors, then submit valid data and verify the outcome." />
      <ExerciseCard title="Create your practice account" description="This demo validates input in the browser only. No data is sent or stored." task="Try submitting empty fields, correct the errors, then submit valid information.">
        <form className="registration-form" noValidate onSubmit={submit} onReset={reset}>
          <div className="field-grid">
            <div className={`field${submitted && errors.fullName ? ' field-error' : ''}`}><label htmlFor="registration-name">Full name</label><input id="registration-name" name="fullName" type="text" autoComplete="name" placeholder="Alex Morgan" value={values.fullName} onChange={change} aria-invalid={submitted && Boolean(errors.fullName)} aria-describedby={submitted && errors.fullName ? 'name-error' : undefined} />{submitted && errors.fullName && <span className="error-message" id="name-error">{errors.fullName}</span>}</div>
            <div className={`field${submitted && errors.email ? ' field-error' : ''}`}><label htmlFor="registration-email">Email address</label><input id="registration-email" name="email" type="email" autoComplete="email" placeholder="alex@example.com" value={values.email} onChange={change} aria-invalid={submitted && Boolean(errors.email)} aria-describedby={submitted && errors.email ? 'email-error' : undefined} />{submitted && errors.email && <span className="error-message" id="email-error">{errors.email}</span>}</div>
            <div className={`field${submitted && errors.password ? ' field-error' : ''}`}><label htmlFor="registration-password">Password</label><input id="registration-password" name="password" type="password" autoComplete="new-password" placeholder="At least 8 characters" value={values.password} onChange={change} aria-invalid={submitted && Boolean(errors.password)} aria-describedby={submitted && errors.password ? 'password-error' : undefined} />{submitted && errors.password && <span className="error-message" id="password-error">{errors.password}</span>}</div>
            <div className={`field${submitted && errors.confirmPassword ? ' field-error' : ''}`}><label htmlFor="registration-confirm-password">Confirm password</label><input id="registration-confirm-password" name="confirmPassword" type="password" autoComplete="new-password" placeholder="Re-enter your password" value={values.confirmPassword} onChange={change} aria-invalid={submitted && Boolean(errors.confirmPassword)} aria-describedby={submitted && errors.confirmPassword ? 'confirm-error' : undefined} />{submitted && errors.confirmPassword && <span className="error-message" id="confirm-error">{errors.confirmPassword}</span>}</div>
          </div>
          <div><label className="choice terms-choice"><input name="terms" type="checkbox" checked={values.terms} onChange={(event) => { setValues((current) => ({ ...current, terms: event.target.checked })); setSuccess(false) }} aria-invalid={submitted && Boolean(errors.terms)} aria-describedby={submitted && errors.terms ? 'terms-error' : undefined} /><span>I agree to the practice lab terms</span></label>{submitted && errors.terms && <span className="error-message" id="terms-error">{errors.terms}</span>}</div>
          <div className="form-actions"><button className="button button-primary" type="submit">Create account <span aria-hidden="true">→</span></button><button className="button button-secondary" type="reset">Reset form</button></div>
          {success && <div className="success-message" role="status"><span aria-hidden="true">✓</span><div><strong>Account created!</strong><p>Your form was submitted successfully. This is a local practice result.</p></div></div>}
        </form>
      </ExerciseCard>
    </>
  )
}

export function TablesSection() {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState({ key: 'name', direction: 'ascending' })
  const [rows, setRows] = useState(employees)
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return rows.filter((row) => Object.values(row).some((value) => value.toLowerCase().includes(normalized)))
      .slice()
      .sort((a, b) => a[sort.key].localeCompare(b[sort.key]) * (sort.direction === 'ascending' ? 1 : -1))
  }, [query, rows, sort])
  const changeSort = (key) => setSort((current) => ({ key, direction: current.key === key && current.direction === 'ascending' ? 'descending' : 'ascending' }))
  const reset = () => { setQuery(''); setSort({ key: 'name', direction: 'ascending' }); setRows(employees) }
  const headers = [['id', 'Employee ID'], ['name', 'Name'], ['role', 'Role'], ['team', 'Team'], ['status', 'Status']]
  return (
    <>
      <PageHeading id="tables" objective="Find a row, sort the employee data, and verify a row-level action." />
      <ExerciseCard title="Team directory" description="Five stable sample records. Search matches all columns; click a column heading to sort." task="Search for “Payments”, clear the search, then sort by employee name.">
        <div className="table-toolbar"><label className="field search-field">Search team members<input name="employeeSearch" type="search" placeholder="Search by name, role, team…" value={query} onChange={(event) => setQuery(event.target.value)} /><span className="search-icon" aria-hidden="true">⌕</span></label><button className="button button-secondary button-small" type="button" onClick={reset}>Reset table</button></div>
        <div className="table-scroll"><table><caption className="sr-only">Sample QA team members; use column buttons to sort the rows.</caption><thead><tr>{headers.map(([key, label]) => <th key={key} aria-sort={sort.key === key ? sort.direction : 'none'}><button className="sort-button" type="button" onClick={() => changeSort(key)}>{label}<span aria-hidden="true">{sort.key === key ? sort.direction === 'ascending' ? ' ↑' : ' ↓' : ' ↕'}</span></button></th>)}<th scope="col">Action</th></tr></thead>
          <tbody>{filtered.map((row) => <tr key={row.id} data-testid={`employee-row-${row.id}`}><td><span className="employee-id">{row.id}</span></td><th scope="row" className="employee-name">{row.name}</th><td>{row.role}</td><td>{row.team}</td><td><span className={`status-pill${row.status === 'On leave' ? ' status-away' : ''}`}><i />{row.status}</span></td><td><button className="row-action" type="button" aria-label={`${row.status === 'Active' ? 'Mark' : 'Return'} ${row.name} ${row.status === 'Active' ? 'on leave' : 'active'}`} onClick={() => setRows((current) => current.map((item) => item.id === row.id ? { ...item, status: item.status === 'Active' ? 'On leave' : 'Active' } : item))}>{row.status === 'Active' ? 'Mark away' : 'Set active'}</button></td></tr>)}</tbody>
          </table></div>
        <div className="table-foot"><span>Showing <strong>{filtered.length}</strong> of <strong>{rows.length}</strong> team members</span><span>Sample data · resets on reload</span></div>
        {filtered.length === 0 && <div className="empty-state" role="status">No team members match “{query}”. Try another search.</div>}
      </ExerciseCard>
      <div className="callout callout-amber"><span aria-hidden="true">✳</span><p><strong>Automation task</strong> Find Maya Chen’s row and verify her team. Mark her away, confirm the status changed, then use “Reset table”.</p></div>
    </>
  )
}

export function DynamicSection() {
  const [visible, setVisible] = useState(false)
  const [waiting, setWaiting] = useState(false)
  const [delayed, setDelayed] = useState(false)
  const [progress, setProgress] = useState('Ready')
  const [modalOpen, setModalOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [confirmed, setConfirmed] = useState('')
  const dialogRef = useRef(null)

  useEffect(() => {
    if (!waiting) return undefined
    const timer = window.setTimeout(() => { setDelayed(true); setWaiting(false) }, 1400)
    return () => window.clearTimeout(timer)
  }, [waiting])

  useEffect(() => {
    if (!toast) return undefined
    const timer = window.setTimeout(() => setToast(''), 2600)
    return () => window.clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    if (modalOpen) dialogRef.current?.showModal()
  }, [modalOpen])

  const resetDynamic = () => {
    setVisible(false)
    setWaiting(false)
    setDelayed(false)
    setProgress('Ready')
    setConfirmed('')
    setToast('')
    setModalOpen(false)
  }

  return (
    <>
      <PageHeading id="dynamic" objective="Wait for an element to appear, observe a state change, and handle common dialog patterns." />
      <div className="exercise-grid">
        <ExerciseCard title="Element visibility" description="Show or hide content in response to a user action." task="Reveal the status panel and verify that it becomes visible.">
          <button className="button button-primary" type="button" onClick={() => setVisible((current) => !current)}>{visible ? 'Hide status panel' : 'Show status panel'}</button>
          {visible && <div className="revealed-panel" data-testid="revealed-status"><span className="success-icon" aria-hidden="true">✓</span><div><strong>Status panel revealed</strong><p>This element is now available in the page.</p></div></div>}
        </ExerciseCard>
        <ExerciseCard title="Wait for content" description="A deterministic 1.4-second delay simulates content arriving." task="Start the request, wait for the status to update, and verify the loaded message.">
          <button className="button button-primary" type="button" disabled={waiting} onClick={() => { setDelayed(false); setWaiting(true) }}>{waiting ? 'Request in progress…' : 'Load delayed content'}</button>
          <div className={`loading-result${waiting ? ' is-loading' : ''}`} role="status" aria-live="polite">{waiting ? <><span className="spinner" aria-hidden="true" /> Loading content…</> : delayed ? <><span className="success-icon" aria-hidden="true">✓</span> Content loaded successfully.</> : 'Waiting to start.'}</div>
        </ExerciseCard>
        <ExerciseCard title="Changing text" description="Advance through a short, predictable state sequence." task="Advance through the process and verify its final state.">
          <div className="progress-track"><span className={`progress-fill progress-${progress.toLowerCase()}`} /></div>
          <div className="process-status"><span>Process status</span><strong>{progress}</strong></div>
          <div className="button-demo-row"><button className="button button-primary" type="button" disabled={progress === 'Complete'} onClick={() => setProgress((current) => current === 'Ready' ? 'Processing' : 'Complete')}>{progress === 'Complete' ? 'Complete' : progress === 'Ready' ? 'Start process' : 'Finish process'}</button><button className="button button-secondary" type="button" onClick={() => setProgress('Ready')}>Reset process</button></div>
        </ExerciseCard>
        <ExerciseCard title="Modal dialog" description="Open a dialog, verify its content, and close it." task="Open the details dialog and dismiss it with the close button or Escape.">
          <button className="button button-primary" type="button" onClick={() => setModalOpen(true)}>Open details</button>
          {confirmed && <Result>Dialog result: {confirmed}</Result>}
        </ExerciseCard>
        <ExerciseCard title="Toast notification" description="The notification disappears automatically after 2.6 seconds." task="Show the toast and verify its text before it disappears.">
          <button className="button button-primary" type="button" onClick={() => setToast('Settings saved successfully.')}>Show success toast</button>
          <p className="small-muted">A live notification appears in the bottom corner.</p>
        </ExerciseCard>
        <ExerciseCard title="Browser dialog" description="This uses the browser’s native confirmation dialog." task="Trigger the confirmation and choose either option to observe the page result.">
          <button className="button button-secondary" type="button" onClick={() => setConfirmed(window.confirm('Would you like to confirm this practice action?') ? 'Confirmed' : 'Cancelled')}>Show confirmation</button>
          {confirmed && <Result>Last response: {confirmed}</Result>}
        </ExerciseCard>
      </div>
      <div className="reset-bar"><p><strong>Done practicing?</strong> Reset all scenarios in this section to their initial state.</p><button type="button" className="button button-secondary button-small" onClick={resetDynamic}>Reset dynamic exercises</button></div>
      {modalOpen && <dialog ref={dialogRef} className="modal-dialog" aria-labelledby="modal-title" onCancel={(event) => { event.preventDefault(); setModalOpen(false) }} onClose={() => setModalOpen(false)} onKeyDown={(event) => { if (event.key === 'Escape') { event.preventDefault(); setModalOpen(false) } }}><button className="modal-close" type="button" aria-label="Close dialog" onClick={() => setModalOpen(false)}>×</button><span className="modal-icon" aria-hidden="true">✳</span><h2 id="modal-title">Practice details</h2><p>This is a modal dialog in the page. Its content is available while the dialog is open.</p><div className="modal-actions"><button className="button button-secondary" type="button" onClick={() => { setConfirmed('Dismissed'); setModalOpen(false) }}>Dismiss</button><button className="button button-primary" type="button" onClick={() => { setConfirmed('Confirmed'); setModalOpen(false) }}>Confirm action</button></div></dialog>}
      {toast && <div className="toast-message" role="status"><span aria-hidden="true">✓</span><strong>{toast}</strong><button type="button" aria-label="Dismiss notification" onClick={() => setToast('')}>×</button></div>}
    </>
  )
}

export function MouseSection() {
  const [hovered, setHovered] = useState(false)
  const [clicks, setClicks] = useState(0)
  const [contextOpen, setContextOpen] = useState(false)
  const [contextAction, setContextAction] = useState('')
  const reset = () => {
    setHovered(false)
    setClicks(0)
    setContextOpen(false)
    setContextAction('')
  }

  return (
    <>
      <PageHeading id="mouse" objective="Use pointer hover, double-click, and right-click actions and verify their outcomes." />
      <div className="exercise-grid">
        <ExerciseCard title="Hover for a tooltip" description="Move the pointer over the target to reveal a short hint." task="Hover over the target, verify the tooltip, then move away.">
          <button
            className="mouse-hover-target"
            type="button"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onFocus={() => setHovered(true)}
            onBlur={() => setHovered(false)}
            aria-describedby="hover-tip"
          >
            Hover over me
            <span id="hover-tip" className="mouse-tooltip" role="tooltip">You found the tooltip.</span>
          </button>
          <Result>Hover state: {hovered ? 'Target hovered' : 'Pointer away'}</Result>
        </ExerciseCard>
        <ExerciseCard title="Double-click target" description="A double-click increments the target counter once." task="Double-click the target and confirm its count increases by one.">
          <button className="mouse-double-target" type="button" onDoubleClick={() => setClicks((count) => count + 1)}>Double-click target</button>
          <Result>Double-click count: {clicks}</Result>
        </ExerciseCard>
        <ExerciseCard title="Context menu target" description="Right-click the target to show its practice context menu." task="Right-click the target and choose “Inspect item”.">
          <div className="context-target" onContextMenu={(event) => { event.preventDefault(); setContextOpen(true); setContextAction('') }}>
            <span>Practice item</span>
            <span className="small-muted">Right-click anywhere in this target</span>
            {contextOpen && <div className="context-menu" role="menu" aria-label="Practice item actions">
              <button type="button" role="menuitem" onClick={() => { setContextAction('Item inspected'); setContextOpen(false) }}>Inspect item</button>
              <button type="button" role="menuitem" onClick={() => { setContextAction('Item copied'); setContextOpen(false) }}>Copy item label</button>
            </div>}
          </div>
          <Result>{contextAction || 'No context action yet.'}</Result>
        </ExerciseCard>
      </div>
      <div className="reset-bar"><p><strong>Reset mouse exercises?</strong> Clear the interaction outcomes and counter.</p><button type="button" className="button button-secondary button-small" onClick={reset}>Reset mouse actions</button></div>
    </>
  )
}

export function KeyboardSection() {
  const [lastKey, setLastKey] = useState('None yet')
  const [submittedValue, setSubmittedValue] = useState('')
  const [entry, setEntry] = useState('')

  const handleKeyDown = (event) => {
    const parts = []
    if (event.ctrlKey || event.metaKey) parts.push(event.ctrlKey ? 'Ctrl' : 'Meta')
    if (event.altKey) parts.push('Alt')
    if (event.shiftKey && event.key.length !== 1) parts.push('Shift')
    parts.push(event.key === ' ' ? 'Space' : event.key.length === 1 ? event.key.toUpperCase() : event.key)
    setLastKey(parts.join(' + '))
  }

  const submit = (event) => {
    event.preventDefault()
    setSubmittedValue(entry || '(empty)')
  }

  return (
    <>
      <PageHeading id="keyboard" objective="Send keys to a focused control, observe key names and modifiers, and submit with the keyboard." />
      <div className="exercise-grid">
        <ExerciseCard title="Key event viewer" description="Focus the input and press keys or combinations to inspect the last key event." task="Press Tab, an arrow key, and Ctrl+A while the input is focused.">
          <label className="field">Keyboard event input<input name="keyboardPlayground" type="text" placeholder="Focus here, then press keys" onKeyDown={handleKeyDown} /></label>
          <Result>Last key: {lastKey}</Result>
          <p className="small-muted">The input keeps its normal behavior so you can also practice selection, typing, and deletion.</p>
        </ExerciseCard>
        <ExerciseCard title="Submit with Enter" description="Submit the form using Enter while the text field has focus." task="Type a short message and press Enter to submit it.">
          <form className="keyboard-form" onSubmit={submit}>
            <label className="field">Quick message<input name="quickMessage" value={entry} onChange={(event) => setEntry(event.target.value)} placeholder="Type and press Enter" /></label>
            <button className="button button-primary" type="submit">Submit message</button>
          </form>
          <Result>Submitted message: {submittedValue || 'Nothing submitted yet.'}</Result>
        </ExerciseCard>
      </div>
      <div className="reset-bar"><p><strong>Reset keyboard exercises?</strong> Clear the recorded key and submitted message.</p><button type="button" className="button button-secondary button-small" onClick={() => { setLastKey('None yet'); setEntry(''); setSubmittedValue('') }}>Reset keyboard actions</button></div>
    </>
  )
}
