import { useEffect, useRef, useState } from 'react'

const GH_URL = 'https://github.com/quybquang/knowledge-warehouse'
const DOCS_URL = GH_URL + '#readme'

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.36-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.73 0 0 .84-.28 2.75 1.05a9.36 9.36 0 015 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.42.2 2.47.1 2.73.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.02 10.02 0 0022 12.25C22 6.58 17.52 2 12 2z" />
    </svg>
  )
}

/* the "approval seal" — a perforated stamp edge around a check */
function LogoIcon() {
  return (
    <span className="logo" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="8.6" strokeWidth="1.6" strokeDasharray="3.3 2.1" />
        <path d="M8.4 12.4l2.5 2.6 4.9-5.4" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

function ThemeToggle({ theme, onToggle }) {
  const dark = theme === 'dark'
  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={onToggle}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={dark ? 'Light theme' : 'Dark theme'}
    >
      {dark ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4l1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" />
        </svg>
      )}
    </button>
  )
}

function LockIcon({ strokeWidth = 2.2 }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth}>
      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zM8 11V7a4 4 0 118 0v4" />
    </svg>
  )
}

function CheckMark() {
  return (
    <span className="rmark yes">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
        <path d="M20 6L9 17l-5-5" />
      </svg>
    </span>
  )
}

function CrossMark() {
  return (
    <span className="rmark no">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    </span>
  )
}

function ArrowX() {
  return (
    <div className="arrow-x" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </div>
  )
}

function KCard({ className, style, serial, tag, title, source, version }) {
  return (
    <div className={className} style={style} aria-label="Approved knowledge card">
      <div className="stamp">
        APPROVED<small>HUMAN REVIEW</small>
      </div>
      <div className="kcard-top">
        <span className="serial">{serial}</span>
        <span className="kcard-tag">{tag}</span>
      </div>
      <p className="ktitle">{title}</p>
      <div className="row"><span className="rk">source</span><span className="rv">{source}</span></div>
      <div className="row"><span className="rk">approver</span><span className="rv">@lead-ba</span></div>
      <div className="row"><span className="rk">version</span><span className="rv">{version}</span></div>
    </div>
  )
}

/* ---- hero terminal with typing animation ---- */
function Terminal() {
  const [typed, setTyped] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    const text = 'kb rule RULE-PAY-003'
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setTyped(text)
      setDone(true)
      return
    }
    let i = 0
    let timer
    const type = () => {
      if (i <= text.length) {
        setTyped(text.slice(0, i))
        i++
        timer = setTimeout(type, 55 + Math.random() * 45)
      } else {
        timer = setTimeout(() => setDone(true), 320)
      }
    }
    timer = setTimeout(type, 650)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="terminal" aria-label="Terminal showing a knowledge base rule lookup">
      <div className="term-bar">
        <span className="tdot"></span><span className="tdot"></span><span className="tdot"></span>
        <span className="tname">~/warehouse — kb</span>
      </div>
      <div className="term-body">
        <div>
          <span className="prompt">$</span> <span className="cmd">{typed}</span>
          {!done && <span className="cursor"></span>}
        </div>
        <div className={'term-out' + (done ? ' show' : '')}>
          <span className="rl"><span className="arrow">→</span> <span className="ok">rule found</span> · returning canonical block</span>
          <span className="rl"> </span>
          <span className="rl"><span className="k">id:      </span><span className="id">RULE-PAY-003</span></span>
          <span className="rl"><span className="k">title:   </span><span className="v">Refunds settle to the original tender only</span></span>
          <span className="rl"><span className="k">source:  </span><span className="v">payments-spec.md#refunds · #eng-payments 2024-11-08</span></span>
          <span className="rl"><span className="k">status:  </span><span className="ok">APPROVED</span> <span className="k">by</span> <span className="v">@lead-ba</span></span>
          <span className="rl"><span className="k">version: </span><span className="v">v3 · </span><span className="id">git 7f3a1c2</span></span>
        </div>
      </div>
    </div>
  )
}

/* ---- quickstart code block with copy button ---- */
function Quickstart() {
  const [copied, setCopied] = useState(false)
  const cmds =
    'git clone https://github.com/quybquang/knowledge-warehouse my-kb\n' +
    'my-kb/setup/setup-code-harness.sh ~/projects/my-app --kb ./my-kb'

  const copy = () => {
    navigator.clipboard.writeText(cmds).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    }).catch(() => {})
  }

  return (
    <section className="section quick" id="quickstart">
      <div className="wrap" style={{ maxWidth: 860 }}>
        <div className="section-head" style={{ textAlign: 'left' }}>
          <span className="kicker">Quickstart</span>
          <h2 className="section-title">Two commands to a warehouse.</h2>
          <p className="lead">Drop it into any repo. It's markdown and git the whole way down.</p>
        </div>

        <div className="codeblock">
          <div className="code-bar">
            <span className="cb-name">setup.sh</span>
            <button
              className={'copy-btn' + (copied ? ' copied' : '')}
              type="button"
              aria-label="Copy setup commands"
              onClick={copy}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="11" height="11" rx="2" />
                <path d="M5 15V5a2 2 0 012-2h10" />
              </svg>
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <div className="code-body">
            <span className="ln"><span className="cm"># 1 · clone the warehouse frame</span></span>
            <span className="ln"><span className="p">$</span> <span className="c">git clone https://github.com/quybquang/knowledge-warehouse my-kb</span></span>
            <span className="ln"> </span>
            <span className="ln"><span className="cm"># 2 · wire the execution harness into your code repo</span></span>
            <span className="ln"><span className="p">$</span> <span className="c">my-kb/setup/setup-code-harness.sh ~/projects/my-app --kb ./my-kb</span></span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function App() {
  /* ---- theme: initial value was set on <html> before paint (index.html) ---- */
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'dark')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem('kw-theme', theme) } catch { /* private mode */ }
  }, [theme])

  /* ---- reveal on scroll ---- */
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    if (!('IntersectionObserver' in window)) {
      els.forEach((e) => e.classList.add('in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('in')
            io.unobserve(en.target)
          }
        })
      },
      { threshold: 0.15 },
    )
    els.forEach((e, idx) => {
      e.style.transitionDelay = (idx % 4) * 60 + 'ms'
      io.observe(e)
    })
    return () => io.disconnect()
  }, [])

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>

      {/* ================= NAV ================= */}
      <header className="nav">
        <div className="wrap nav-inner">
          <a className="brand" href="#top">
            <LogoIcon />
            Knowledge&nbsp;Warehouse
          </a>
          <nav className="nav-links" aria-label="Primary">
            <a href="#how">How it works</a>
            <a href="#features">Features</a>
            <a href="#trust">Agents &amp; humans</a>
            <a href="#quickstart">Quickstart</a>
          </nav>
          <div className="nav-cta">
            <ThemeToggle theme={theme} onToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
            <a className="btn btn-ghost" href={DOCS_URL} target="_blank" rel="noreferrer">Read the docs</a>
            <a className="btn btn-primary" href={GH_URL} target="_blank" rel="noreferrer">
              <GitHubIcon />
              Star on GitHub
            </a>
          </div>
        </div>
      </header>

      <main id="main">
        <a id="top"></a>

        {/* ================= HERO ================= */}
        <section className="hero">
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <span className="hero-eyebrow"><span className="dot"></span> AI proposes · humans approve · git remembers</span>
              <h1>Your AI is confident.<br />Your knowledge base<br />shouldn't <span className="amber">take its word for it.</span></h1>
              <p className="hero-sub">An open-source knowledge harness that gives AI coding agents a single source of truth they <strong>can't corrupt</strong>. Nothing enters the warehouse without human review.</p>
              <div className="hero-actions">
                <a className="btn btn-primary" href={GH_URL} target="_blank" rel="noreferrer">
                  <GitHubIcon />
                  Star on GitHub
                </a>
                <a className="btn btn-ghost" href={DOCS_URL} target="_blank" rel="noreferrer">Read the docs</a>
              </div>
              <div className="hero-meta">
                <span><span className="tick">✓</span> Plain markdown + git</span>
                <span><span className="tick">✓</span> No database, no lock-in</span>
                <span><span className="tick">✓</span> MIT licensed</span>
              </div>
            </div>

            {/* the two brand artifacts: terminal + stamped card */}
            <div className="artifacts">
              <Terminal />
              <KCard
                className="kcard"
                serial="RULE-PAY-003"
                tag="domain / payments"
                title="Refunds settle to the original tender only."
                source="payments-spec.md"
                version="v3 · 7f3a1c2"
              />
            </div>
          </div>
        </section>

        {/* ================= PROBLEM STRIP ================= */}
        <section className="problem">
          <div className="wrap">
            <div className="problem-head">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 22V4M4 4h13l-2 4 2 4H4" /></svg>
              inbox — flagged before this existed
            </div>
            <div className="problem-grid">
              <div className="flag-item reveal">
                <span className="fic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 9v4m0 4h.01M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L14.7 3.9a2 2 0 00-3.4 0z" /></svg></span>
                <div><p>"The agent invented a field name."</p><span className="meta">hallucinated schema</span></div>
              </div>
              <div className="flag-item reveal">
                <span className="fic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3H5a2 2 0 00-2 2v3m0 8v3a2 2 0 002 2h3m8-18h3a2 2 0 012 2v3m0 8v3a2 2 0 01-2 2h-3" /></svg></span>
                <div><p>"Three docs, three different rules."</p><span className="meta">no single source</span></div>
              </div>
              <div className="flag-item reveal">
                <span className="fic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9.1 9a3 3 0 015.8 1c0 2-3 3-3 3m.1 4h.01M12 22a10 10 0 100-20 10 10 0 000 20z" /></svg></span>
                <div><p>"Nobody knows why we decided that."</p><span className="meta">lost rationale</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= HOW IT WORKS ================= */}
        <section className="section" id="how">
          <div className="wrap">
            <div className="section-head">
              <span className="kicker">How it works</span>
              <h2 className="section-title">Every fact passes through one gate.</h2>
              <p className="lead">Raw input is staged, never trusted. It only becomes citable knowledge after a human signs off — and git records who, what, and why.</p>
            </div>

            <div className="pipeline">
              <div className="stage reveal">
                <span className="snum">01 · SOURCE</span>
                <h3>Raw input</h3>
                <p>Docs, Slack threads, FE specs, meeting notes — anything an agent might otherwise guess at.</p>
                <div className="files"><code>docs · chat · specs</code></div>
              </div>
              <ArrowX />

              <div className="stage reveal">
                <span className="snum">02 · CAPTURE</span>
                <h3><span className="slash">/</span>ba-capture</h3>
                <p>The agent distills input into proposed changes — never writing to the warehouse directly.</p>
                <div className="files"><code>inbox/ (staged)</code></div>
              </div>
              <ArrowX />

              <div className="stage gate reveal">
                <span className="gate-badge"><LockIcon /> Human gate</span>
                <span className="snum">03 · REVIEW</span>
                <h3><span className="slash">/</span>ba-review</h3>
                <p>A human reviews each proposal, one at a time. Approve, edit, or reject — nothing merges silently.</p>
                <div className="gate-note"><span>✓</span> the only path in</div>
              </div>
              <ArrowX />

              <div className="stage reveal">
                <span className="snum">04 · WAREHOUSE</span>
                <h3>Approved &amp; versioned</h3>
                <p>Merged with a stable ID, a source, and a git history agents can cite by reference.</p>
                <div className="files"><code>domain/</code><code>glossary.md</code><code>decisions/</code></div>
              </div>
            </div>

            <p className="pipe-legend">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--accent)' }}><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zM8 11V7a4 4 0 118 0v4" /></svg>
              {' '}The gate is the product. <b>No approval, no entry.</b>
            </p>
          </div>
        </section>

        {/* ================= FEATURE BENTO ================= */}
        <section className="section" id="features">
          <div className="wrap">
            <div className="section-head">
              <span className="kicker">What you get</span>
              <h2 className="section-title">Knowledge that behaves like code.</h2>
              <p className="lead">Deterministic to retrieve, cheap on tokens, and reviewable in the pull request you already open.</p>
            </div>

            <div className="bento">
              {/* kb CLI */}
              <div className="cell c-wide reveal">
                <div className="cicon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 17l6-6-6-6M12 19h8" /></svg></div>
                <h3>The <span className="mono" style={{ color: 'var(--accent)' }}>kb</span> CLI</h3>
                <p>Deterministic, token-cheap retrieval. Agents ask for exactly what they need — no context-window roulette.</p>
                <div className="cmd-list">
                  <div className="cmdline"><span className="p">$</span> <span className="c">kb rule RULE-PAY-003</span><span className="note">by id</span></div>
                  <div className="cmdline"><span className="p">$</span> <span className="c">kb search "refund tender"</span><span className="note">by phrase</span></div>
                  <div className="cmdline"><span className="p">$</span> <span className="c">kb term chargeback</span><span className="note">glossary</span></div>
                  <div className="cmdline"><span className="p">$</span> <span className="c">kb pending</span><span className="note">review queue</span></div>
                </div>
              </div>

              {/* citable */}
              <div className="cell c-tall reveal">
                <div className="cicon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 8h10M7 12h6M9 20l-4 1 1-4L16.5 5.5a2.1 2.1 0 013 3L9 20z" /></svg></div>
                <h3>Every rule is citable</h3>
                <p>ID + source + version + full git history. Agents cite <span className="mono" style={{ color: 'var(--accent)' }}>RULE-PAY-003</span> instead of inventing a fact — and you can trace it to the commit that made it true.</p>
                <div className="diff">
                  <span className="ctx">@@ glossary.md @@</span>
                  <span className="del">- refunds go to store credit</span>
                  <span className="add">+ refunds settle to original tender</span>
                  <span className="ctx"># RULE-PAY-003 · approved v3</span>
                </div>
              </div>

              {/* conflict */}
              <div className="cell c-third reveal">
                <div className="cicon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 3v12a3 3 0 003 3h6M6 3a3 3 0 000 6m12 9a3 3 0 100 6 3 3 0 000-6zM18 9V6a3 3 0 00-3-3" /></svg></div>
                <h3>Conflicts become decisions</h3>
                <p>Contradictions surface as ADRs you resolve on purpose — never a silent overwrite.</p>
              </div>

              {/* context packs */}
              <div className="cell c-third reveal">
                <div className="cicon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 00-1-1.7l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.7l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /><path d="M3.3 7L12 12l8.7-5M12 22V12" /></svg></div>
                <h3>Context packs</h3>
                <p><span className="mono" style={{ color: 'var(--accent)' }}>/context&nbsp;payments</span> loads exactly what the task needs — nothing more.</p>
              </div>

              {/* markdown + git */}
              <div className="cell c-third reveal">
                <div className="cicon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16v16H4zM8 15V9l2.5 3L13 9v6M17 9v6M14.5 13.5L17 16l2.5-2.5" /></svg></div>
                <h3>Plain markdown + git</h3>
                <p>No database, no lock-in. Review changes in your normal PR flow — it's just files.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= FOR AGENTS / FOR HUMANS ================= */}
        <section className="section" id="trust">
          <div className="wrap">
            <div className="section-head">
              <span className="kicker">The contract</span>
              <h2 className="section-title">Agents propose. Humans decide.</h2>
              <p className="lead">The trust boundary is explicit and enforced — the agent's job ends where the human's begins.</p>
            </div>

            <div className="split">
              <div className="panel agents">
                <div className="ptag">For agents</div>
                <h3>Cite. Never fill gaps.</h3>
                <div className="rule-row"><CheckMark /><span className="rt"><b>Cite a rule ID</b> for every business claim — <code>RULE-PAY-003</code>, not "I think it works like…"</span></div>
                <div className="rule-row"><CheckMark /><span className="rt"><b>Stage proposals</b> into the inbox with <code>/ba-capture</code> — never touch the warehouse directly.</span></div>
                <div className="rule-row"><CrossMark /><span className="rt"><b>No inventing.</b> Missing knowledge is flagged as a gap, not hallucinated into an answer.</span></div>
                <div className="rule-row"><CrossMark /><span className="rt"><b>No silent overwrites.</b> A contradiction opens a decision — it doesn't rewrite the record.</span></div>
              </div>

              <div className="panel humans">
                <div className="ptag">For humans</div>
                <h3>You are the only approver.</h3>
                <div className="rule-row"><CheckMark /><span className="rt"><b>Review one proposal at a time</b> with <code>/ba-review</code> — approve, edit, or reject.</span></div>
                <div className="rule-row"><CheckMark /><span className="rt"><b>Your approval is the stamp.</b> Nothing reaches <code>domain/</code> without it.</span></div>
                <div className="rule-row"><CheckMark /><span className="rt"><b>Every entry is auditable</b> — source, approver, version, and the commit behind it.</span></div>
                <div className="rule-row"><CheckMark /><span className="rt"><b>Resolve conflicts as ADRs</b> so the <i>why</i> outlives the person who decided it.</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= QUICKSTART ================= */}
        <Quickstart />

        {/* ================= FOOTER CTA ================= */}
        <section className="footer-cta">
          <div className="wrap">
            <h2>Give your agents a memory<br />you can audit.</h2>
            <p className="lead">Open-source. Human-gated. Git-remembered. Stop taking your AI's word for it.</p>
            <div className="hero-actions">
              <a className="btn btn-primary" href={GH_URL} target="_blank" rel="noreferrer">
                <GitHubIcon />
                Star on GitHub
              </a>
              <a className="btn btn-ghost" href={DOCS_URL} target="_blank" rel="noreferrer">Read the docs</a>
            </div>
            <KCard
              className="footer-stamp kcard"
              style={{ position: 'relative', right: 'auto', bottom: 'auto', transform: 'rotate(-1.5deg)', maxWidth: 250, textAlign: 'left' }}
              serial="RULE-ORD-011"
              tag="domain / orders"
              title="Partial shipments never re-trigger tax calc."
              source="orders-spec.md"
              version="v2 · a19be04"
            />
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="wrap foot-inner">
          <span className="brand" style={{ fontSize: 15 }}>
            <LogoIcon />
            Knowledge Warehouse
          </span>
          <nav className="foot-links" aria-label="Footer">
            <a href={GH_URL} target="_blank" rel="noreferrer">GitHub</a>
            <a href={DOCS_URL} target="_blank" rel="noreferrer">Docs</a>
            <a href="#how">How it works</a>
          </nav>
          <span className="foot-meta">MIT licensed · built on markdown + git</span>
        </div>
      </footer>
    </>
  )
}
