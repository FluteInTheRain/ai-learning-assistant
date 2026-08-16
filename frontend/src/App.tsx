// Temporary baseline preview — exercises the design tokens and component
// classes from styles/tokens.css + index.css side by side so they can be
// checked against the Aletheia design in a browser. Replace with real
// routes as pages are built.
function App() {
  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '48px 24px 96px' }}>
      <div style={{ fontSize: 10.5, letterSpacing: '0.26em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: 16 }}>
        Baseline preview
      </div>
      <h1 style={{ fontWeight: 300, letterSpacing: '-0.025em' }}>Aletheia design tokens</h1>
      <p className="text-muted">Colors, type, buttons, tags, inputs and cards ported from the design.</p>

      <h2 className="hr" style={{ background: 'none', height: 'auto', border: 0, margin: '48px 0 20px' }}>
        Colors
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))', gap: 12 }}>
        {(
          [
            ['bg', 'var(--color-bg)'],
            ['surface', 'var(--color-surface)'],
            ['surface-1', 'var(--color-surface-1)'],
            ['surface-2', 'var(--color-surface-2)'],
            ['accent-100', 'var(--color-accent-100)'],
            ['accent-300', 'var(--color-accent-300)'],
            ['accent-500', 'var(--color-accent-500)'],
            ['accent-700', 'var(--color-accent-700)'],
            ['accent-900', 'var(--color-accent-900)'],
            ['section', 'var(--color-section)'],
            ['section-glow', 'var(--color-section-glow)'],
            ['section-ghost', 'var(--color-section-ghost)'],
          ] as const
        ).map(([name, value]) => (
          <div key={name}>
            <div
              style={{
                height: 56,
                borderRadius: 'var(--radius-md)',
                background: value,
                border: '1px solid var(--color-divider)',
              }}
            />
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, marginTop: 6, color: 'var(--color-text)' }}>
              {name}
            </div>
          </div>
        ))}
      </div>

      <h2 style={{ margin: '48px 0 20px' }}>Buttons</h2>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <button className="btn btn-primary">Primary</button>
        <button className="btn btn-secondary">Secondary</button>
        <button className="btn btn-ghost">Ghost</button>
        <button className="btn btn-primary" disabled>
          Disabled
        </button>
        <button className="btn btn-icon btn-secondary" aria-label="icon">
          →
        </button>
      </div>
      <div style={{ maxWidth: 280, marginTop: 12 }}>
        <button className="btn btn-primary btn-block">Block button</button>
      </div>

      <h2 style={{ margin: '48px 0 20px' }}>Tags</h2>
      <div style={{ display: 'flex', gap: 8 }}>
        <span className="tag tag-accent">LLM</span>
        <span className="tag tag-accent">RAG</span>
        <span className="tag tag-outline">Advanced</span>
      </div>

      <h2 style={{ margin: '48px 0 20px' }}>Inputs</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 360 }}>
        <label className="field">
          <label>Email</label>
          <input className="input" type="email" placeholder="you@university.edu" />
        </label>
        <textarea className="input" rows={3} defaultValue="What do you want to achieve in the next six months?" />
      </div>

      <h2 style={{ margin: '48px 0 20px' }}>Card</h2>
      <div className="card elev-md" style={{ maxWidth: 320 }}>
        <div className="card-kicker">Technical track</div>
        <div className="card-title">Deep learning with PyTorch</div>
        <p className="card-body">Reimplement each layer, train on shared GPUs, compare against real baselines.</p>
        <div className="card-meta">18 LESSONS · 26 HRS</div>
      </div>

      <h2 style={{ margin: '48px 0 20px' }}>Type scale</h2>
      <h1>Heading 1</h1>
      <h2>Heading 2</h2>
      <h3>Heading 3</h3>
      <h4>Heading 4</h4>
      <h5>Heading 5</h5>
      <h6>Heading 6 / eyebrow</h6>
      <p>
        Body text at 15px/1.55 in Inter. <a href="#top">A link looks like this.</a>
      </p>
    </div>
  )
}

export default App
