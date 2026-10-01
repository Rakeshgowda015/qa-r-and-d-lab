import { useEffect, useState } from 'react'
import { sections } from './navigation.js'
import {
  ButtonsSection,
  DynamicSection,
  FormsSection,
  InputsSection,
  KeyboardSection,
  MouseSection,
  SelectionsSection,
  TablesSection,
} from './features/Exercises.jsx'
import {
  DateTimeSection,
  FiltersSection,
  PaginationSection,
} from './features/NextExercises.jsx'
import {
  AuthenticationSection,
  ChallengeSection,
  DragDropSection,
  DownloadSection,
  FileUploadSection,
  IframeSection,
  NetworkSection,
  ShadowDomSection,
  WindowsSection,
} from './features/RemainingExercises.jsx'

const content = {
  inputs: InputsSection,
  selections: SelectionsSection,
  buttons: ButtonsSection,
  forms: FormsSection,
  tables: TablesSection,
  dynamic: DynamicSection,
  pagination: PaginationSection,
  filters: FiltersSection,
  'date-time': DateTimeSection,
  mouse: MouseSection,
  keyboard: KeyboardSection,
  upload: FileUploadSection,
  download: DownloadSection,
  'drag-drop': DragDropSection,
  windows: WindowsSection,
  iframe: IframeSection,
  'shadow-dom': ShadowDomSection,
  authentication: AuthenticationSection,
  network: NetworkSection,
  challenges: ChallengeSection,
}

function getActiveSection() {
  const id = window.location.hash.slice(1)
  return sections.some((section) => section.id === id) ? id : 'overview'
}

function App() {
  const [active, setActive] = useState(getActiveSection)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleHashChange = () => {
      setActive(getActiveSection())
      setMenuOpen(false)
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const navLink = (id, label, icon, level) => (
    <a
      key={id}
      className={`nav-link${active === id ? ' is-active' : ''}`}
      href={`#${id}`}
      onClick={() => setMenuOpen(false)}
      aria-current={active === id ? 'page' : undefined}
    >
      <span className="nav-icon" aria-hidden="true">{icon}</span>
      <span>{label}</span>
      {level && <span className={`nav-level level-${level.toLowerCase()}`}>{level === 'Intermediate' ? 'INT' : level.slice(0, 3).toUpperCase()}</span>}
    </a>
  )

  const ActiveExercise = content[active]

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#overview" aria-label="QA R and D Lab home">
          <span className="brand-mark" aria-hidden="true">R<span>&amp;</span>D</span>
          <span className="brand-copy"><strong>QA R&amp;D Lab</strong><small>Automation practice playground</small></span>
        </a>
        <div className="topbar-right">
          <span className="free-badge"><span aria-hidden="true">●</span> Free practice lab</span>
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={menuOpen}
            aria-controls="sidebar"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? 'Close menu' : 'Browse exercises'}
          </button>
        </div>
      </header>

      <div className="workspace">
        <aside id="sidebar" className={`sidebar${menuOpen ? ' sidebar-open' : ''}`} aria-label="Exercise navigation">
          <p className="nav-caption">LEARN &amp; PRACTICE</p>
          {navLink('overview', 'Overview', '⌂')}
          <p className="nav-caption nav-caption-spaced">BEGINNER PATH</p>
          {sections.filter(({ level }) => level === 'Beginner').map(({ id, label, icon, level }) => navLink(id, label, icon, level))}
          <p className="nav-caption nav-caption-spaced">BUILD YOUR SKILLS</p>
          {sections.filter(({ id }) => ['tables', 'dynamic'].includes(id)).map(({ id, label, icon, level }) => navLink(id, label, icon, level))}
          <p className="nav-caption nav-caption-spaced">MORE PRACTICE</p>
          {sections.filter(({ id }) => !['inputs', 'selections', 'buttons', 'forms', 'tables', 'dynamic'].includes(id)).map(({ id, label, icon, level }) => navLink(id, label, icon, level))}
          <div className="sidebar-note">
            <span className="note-icon" aria-hidden="true">✳</span>
            <strong>Practice at your pace</strong>
            <p>Every exercise resets to a predictable starting point when you reload.</p>
          </div>
          <div className="sidebar-foot">Made for curious testers <span aria-hidden="true">↗</span></div>
        </aside>

        <main className="main-content" id="main-content">
          {active === 'overview' ? (
            <Overview navigate={setActive} />
          ) : ActiveExercise ? (
            <ActiveExercise />
          ) : null}
          <footer className="page-footer">
            <span>QA R&amp;D Lab <span className="footer-dot">·</span> A free browser automation playground</span>
            <a href="#overview">Back to overview ↑</a>
          </footer>
        </main>
      </div>
    </div>
  )
}

function Overview({ navigate }) {
  return (
    <>
      <div className="welcome-banner">
        <div>
          <p className="eyebrow">YOUR BROWSER AUTOMATION PLAYGROUND</p>
          <h1>Learn by <span>doing.</span></h1>
          <p className="welcome-copy">A friendly space to practice the interactions you’ll automate every day. Choose an exercise, complete the task, and verify what happens.</p>
          <a className="button button-primary" href="#inputs" onClick={() => navigate('inputs')}>Start with the basics <span aria-hidden="true">→</span></a>
        </div>
        <div className="welcome-art" aria-hidden="true">
          <div className="art-window">
            <div className="art-window-top"><i /><i /><i /><span>your-next-test.spec</span></div>
            <div className="art-code"><span>01</span><b>await</b> page.<em>getByRole</em>(<q>'button'</q>)<br /><span>02</span><b>await</b> button.<em>click</em>()<br /><span>03</span><b>expect</b>(result).<em>toBeVisible</em>()</div>
            <div className="art-check">✓ &nbsp;Ready to run</div>
          </div>
          <div className="art-sparkle sparkle-one">✳</div>
          <div className="art-sparkle sparkle-two">✦</div>
        </div>
      </div>

      <div className="page-heading overview-heading">
        <div><p className="eyebrow">THE PRACTICE LAB</p><h2>Pick a place to start</h2><p className="section-subtitle">Small, focused exercises. Real browser interactions. No setup required.</p></div>
        <span className="exercise-count">{sections.length} EXERCISE AREAS</span>
      </div>

      <div className="overview-grid">
        {sections.map((section, index) => (
          <a className="overview-card" href={`#${section.id}`} key={section.id} onClick={() => navigate(section.id)}>
            <div className={`card-symbol symbol-${index}`} aria-hidden="true">{section.icon}</div>
            <div className="overview-card-top"><span className={`difficulty-pill difficulty-${section.level.toLowerCase()}`}>{section.level}</span><span className="card-arrow" aria-hidden="true">↗</span></div>
            <h3>{section.label}</h3>
            <p>{overviewDescriptions[section.id]}</p>
            <span className="card-action">Explore exercises <span aria-hidden="true">→</span></span>
          </a>
        ))}
      </div>

      <div className="framework-note"><span aria-hidden="true">◎</span><p><strong>Works with your favorite tools.</strong> The practice tasks are framework-neutral. Use Playwright, Selenium, Cypress, or another browser automation tool.</p></div>
    </>
  )
}

const overviewDescriptions = {
  inputs: 'Fill, clear, and inspect common form fields and their states.',
  selections: 'Practice radio buttons, checkboxes, and native dropdowns.',
  buttons: 'Click, observe state changes, and handle disabled controls.',
  forms: 'Submit a registration form and verify helpful validation.',
  tables: 'Search, sort, and take actions on stable sample data.',
  dynamic: 'Wait for changing content and explore dialogs and notifications.',
  pagination: 'Move through a predictable record set and inspect page boundaries.',
  filters: 'Combine text search, categories, availability, and price constraints.',
  'date-time': 'Enter dates and times, then validate and compare a date range.',
  mouse: 'Practice hover, double-click, and right-click interactions.',
  keyboard: 'Capture key presses, combinations, and submitted keyboard input.',
  upload: 'Validate local files, simulate progress, and remove selected files.',
  download: 'Download sample CSV, JSON, text, and PDF files.',
  'drag-drop': 'Move task cards between workflow columns using drag and drop.',
  windows: 'Open a child practice page in a new tab or browser window.',
  iframe: 'Interact with a small independent form embedded in an iframe.',
  'shadow-dom': 'Locate and interact with form controls inside an open shadow root.',
  authentication: 'Practice success, invalid credentials, and locked-account flows.',
  network: 'Exercise simulated HTTP responses, timeouts, and network failures.',
  challenges: 'Practice dynamic selectors, hidden content, delayed controls, and changing DOM.',
}

export default App
