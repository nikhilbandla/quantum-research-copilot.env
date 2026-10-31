import { useEffect, useState } from 'react'
import {
  Activity, Atom, BookOpen, BrainCircuit, ChartNoAxesCombined, CheckCircle2,
  ChevronRight, CircleHelp, Code2, Database, FlaskConical, GitBranch,
  Layers3, Menu, Network, Orbit, PanelLeftClose, Search, Settings2,
  ShieldCheck, Sparkles, Workflow, X,
} from 'lucide-react'
import type { DependencyReport } from './types'

const modules = [
  { id: 'overview', label: 'Overview', group: 'Workspace', icon: ChartNoAxesCombined, phase: 'Phase 1', ready: true, description: 'Project status, system health and development roadmap.' },
  { id: 'assistant', label: 'AI Research Assistant', group: 'AI Research', icon: BrainCircuit, phase: 'Phase 5', description: 'Ask quantum computing questions and receive grounded explanations.' },
  { id: 'papers', label: 'Research Papers', group: 'AI Research', icon: BookOpen, phase: 'Phase 6', description: 'Upload papers, retrieve passages, summarize and compare research.' },
  { id: 'agents', label: 'Multi-Agent Lab', group: 'AI Research', icon: Network, phase: 'Phase 7', description: 'Coordinate research, math, circuit, simulation and verification agents.' },
  { id: 'circuits', label: 'Circuit Generator', group: 'Quantum Lab', icon: GitBranch, phase: 'Phase 2', description: 'Translate natural language into validated Qiskit circuits.' },
  { id: 'simulator', label: 'Quantum Simulator', group: 'Quantum Lab', icon: Atom, phase: 'Phase 2', description: 'Execute circuits with Qiskit Aer and inspect measurements.' },
  { id: 'states', label: 'State Analyzer', group: 'Quantum Lab', icon: Layers3, phase: 'Phase 2', description: 'Inspect state vectors, density matrices, purity and entropy.' },
  { id: 'partial-trace', label: 'Partial Trace', group: 'Quantum Lab', icon: Workflow, phase: 'Phase 3', description: 'Compute reduced density matrices and validate physical properties.' },
  { id: 'bloch', label: 'Bloch Sphere', group: 'Quantum Lab', icon: Orbit, phase: 'Phase 4', description: 'Explore single-qubit states on an interactive 3D Bloch sphere.' },
  { id: 'algorithms', label: 'Algorithm Playground', group: 'Quantum Lab', icon: FlaskConical, phase: 'Phase 8', description: 'Experiment with Grover, QFT, Deutsch-Jozsa, VQE and QAOA.' },
  { id: 'workspace', label: 'Research Workspace', group: 'Workspace', icon: Code2, phase: 'Phase 9', description: 'Save notes, experiments, code and reproducible research reports.' },
  { id: 'settings', label: 'Settings', group: 'System', icon: Settings2, phase: 'Phase 1', ready: true, description: 'Configure local service connections and application preferences.' },
]

function StatusDot({ status }: { status?: string }) {
  return <span className={`status-dot ${status === 'ok' ? 'online' : status === 'error' ? 'offline' : 'unknown'}`} />
}

export default function App() {
  const [active, setActive] = useState('overview')
  const [report, setReport] = useState<DependencyReport | null>(null)
  const [error, setError] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  async function refreshStatus() {
    try {
      setError('')
      const response = await fetch('/api/system/dependencies')
      if (!response.ok) throw new Error(`Backend returned HTTP ${response.status}`)
      setReport(await response.json() as DependencyReport)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not reach backend')
      setReport(null)
    }
  }

  useEffect(() => { void refreshStatus(); const timer = window.setInterval(() => void refreshStatus(), 15000); return () => window.clearInterval(timer) }, [])

  const current = modules.find((item) => item.id === active) ?? modules[0]
  const groups = [...new Set(modules.map((item) => item.group))]
  const dependencies = [
    { key: 'postgres', name: 'PostgreSQL', note: 'Structured project data', icon: Database },
    { key: 'qdrant', name: 'Qdrant', note: 'Vector search service', icon: Network },
    { key: 'ollama', name: 'Ollama', note: 'Local LLM runtime', icon: BrainCircuit },
  ] as const

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? '' : 'collapsed'}`}>
        <div className="brand">
          <div className="brand-mark"><Atom size={22} /></div>
          {sidebarOpen && <div><strong>Q-Copilot</strong><small>QUANTUM RESEARCH STUDIO</small></div>}
          <button className="icon-button sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle sidebar">
            {sidebarOpen ? <PanelLeftClose size={17} /> : <Menu size={17} />}
          </button>
        </div>
        <div className="nav-scroll">
          {groups.map((group) => (
            <section className="nav-group" key={group}>
              {sidebarOpen && <div className="nav-heading">{group}</div>}
              {modules.filter((item) => item.group === group).map((item) => {
                const Icon = item.icon
                return <button key={item.id} className={`nav-item ${active === item.id ? 'selected' : ''}`} onClick={() => setActive(item.id)} title={item.label}>
                  <Icon size={17} /><span>{sidebarOpen && item.label}</span>
                  {sidebarOpen && !item.ready && <small>{item.phase.replace('Phase ', 'P')}</small>}
                </button>
              })}
            </section>
          ))}
        </div>
        <div className="sidebar-footer"><ShieldCheck size={16} /><span>{sidebarOpen ? 'Local-first workspace' : ''}</span></div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumbs"><span>Workspace</span><ChevronRight size={14} /><strong>{current.label}</strong></div>
          <div className="top-actions"><span className="local-pill"><span className="pulse" /> LOCAL ENVIRONMENT</span><button className="icon-button" onClick={() => setActive('settings')} aria-label="Settings"><Settings2 size={18} /></button></div>
        </header>

        <div className="content">
          <div className="welcome-row">
            <div><div className="eyebrow"><Sparkles size={14} /> QUANTUM COMPUTING RESEARCH COPILOT</div><h1>{current.id === 'overview' ? 'Research, simulate, discover.' : current.label}</h1><p>{current.description}</p></div>
            <div className="build-tag">BUILD 0.1.0 <span>·</span> PHASE 1</div>
          </div>

          {active === 'overview' ? <>
            <div className="hero-card">
              <div className="hero-copy"><div className="hero-kicker">YOUR QUANTUM RESEARCH WORKSPACE</div><h2>From quantum theory<br />to reproducible experiments.</h2><p>A unified environment for quantum learning, mathematical analysis, circuit simulation and AI-assisted research.</p><button className="primary-button" onClick={() => setActive('settings')}>Configure environment <ChevronRight size={16} /></button></div>
              <div className="orbital-art" aria-hidden="true"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit orbit-three" /><div className="core"><Atom size={43} /></div><i /><b /><em /></div>
            </div>

            <div className="section-title"><div><h3>System connections</h3><p>Live checks against your local services</p></div><button className="text-button" onClick={() => void refreshStatus()}><Activity size={15} /> Refresh status</button></div>
            {error && <div className="error-banner"><X size={16} /> {error}. Start the backend and refresh.</div>}
            <div className="dependency-grid">
              {dependencies.map((dep) => {
                const item = report?.[dep.key]
                const Icon = dep.icon
                return <article className="dependency-card" key={dep.key}><div className="dep-top"><div className="dep-icon"><Icon size={19} /></div><StatusDot status={item?.status} /></div><h4>{dep.name}</h4><p>{dep.note}</p><div className="dep-bottom"><span>{item?.status === 'ok' ? 'Connected' : item?.status === 'error' ? 'Connection error' : item?.status === 'unavailable' ? 'Unavailable' : 'Checking / offline'}</span><span className="dep-detail">{item?.detail ?? 'Waiting for backend status'}</span></div>{dep.key === 'ollama' && item?.model_available === false && item.status === 'ok' && <small className="model-warning">Ollama is running, but the configured model is not pulled yet.</small>}</article>
              })}
            </div>

            <div className="section-title roadmap-heading"><div><h3>Platform roadmap</h3><p>Each capability will be implemented and tested phase by phase</p></div><span className="roadmap-count">12 DEVELOPMENT PHASES</span></div>
            <div className="roadmap-grid">
              {[
                ['01','Foundation','React, FastAPI, databases and local services','In progress'],
                ['02','Quantum engine','Qiskit circuits, simulation and state data','Next'],
                ['03','Partial trace','Reduced states and mathematical validation','Planned'],
                ['04','Visualizations','Interactive Bloch sphere and circuit diagrams','Planned'],
                ['05–07','AI intelligence','Ollama, RAG and multi-agent orchestration','Planned'],
                ['08–12','Research platform','Algorithms, advanced tools, tests and deployment','Planned'],
              ].map(([number,title,desc,state]) => <article className="roadmap-card" key={number}><div className="roadmap-number">{number}</div><div><h4>{title}</h4><p>{desc}</p></div><span className={`phase-state ${state === 'In progress' ? 'current' : ''}`}>{state}</span></article>)}
            </div>
          </> : <section className="module-panel"><div className="module-icon"><current.icon size={26} /></div><div className="eyebrow">MODULE STATUS · {current.phase.toUpperCase()}</div><h2>{current.label}</h2><p>{current.description}</p>{current.ready ? <div className="settings-content"><h3>Environment configuration</h3><p>Service status is read from the live backend endpoint. Use the Overview page to inspect PostgreSQL, Qdrant and Ollama connections.</p><button className="primary-button" onClick={() => setActive('overview')}>View system connections <ChevronRight size={16} /></button></div> : <div className="planned-box"><div className="planned-icon"><CircleHelp size={20} /></div><div><strong>Scheduled for {current.phase}</strong><p>This module is not implemented yet. It will be added with its real computation, API, interface and automated tests in the corresponding development phase.</p></div></div>}</section>}
          <footer className="footer"><span>QUANTUM RESEARCH COPILOT</span><span>Local-first · Open architecture · Reproducible research</span></footer>
        </div>
      </main>
    </div>
  )
}
