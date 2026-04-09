import { CheckCircle2, XCircle, Clock } from 'lucide-react'

export default function ResultCard({ result }) {
  if (!result) return null

  const shortlisted = result.status === 'Shortlisted'
  const score       = result.score ?? 0
  const skills      = result.matchedSkills ?? []

  const timestamp = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
  })

  /* Score arc colour */
  const scoreColor = score >= 75
    ? { text: '#34d399', glow: '0 0 14px rgba(52,211,153,0.45)' }
    : score >= 45
    ? { text: '#f59e0b', glow: '0 0 14px rgba(245,158,11,0.40)' }
    : { text: '#f87171', glow: '0 0 14px rgba(248,113,113,0.40)' }

  return (
    <div
      className="animate-fade-slide-in rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(8, 8, 18, 0.90)',
        border:     '1px solid rgba(168,85,247,0.20)',
        boxShadow:  '0 0 30px rgba(168,85,247,0.12), 0 0 1px rgba(255,255,255,0.04) inset',
      }}
    >
      {/* Shimmer accent line */}
      <div className="shimmer-border h-[2px] w-full" />

      <div className="px-7 py-6">

        {/* Header row */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">
            ⚡ Analysis Complete
          </p>
          <span className="flex items-center gap-1.5 font-mono text-xs text-gray-600">
            <Clock size={11} strokeWidth={2} />
            {timestamp}
          </span>
        </div>

        {/* Stats row — Score left, Decision right */}
        <div className="grid grid-cols-2 gap-4 mb-6">

          {/* Match Score */}
          <div className="stat-box">
            <p className="stat-label">Match Score</p>
            <div
              className="font-mono font-extrabold leading-none"
              style={{
                fontSize: '3rem',
                color: scoreColor.text,
                filter: `drop-shadow(${scoreColor.glow})`,
              }}
            >
              {score.toFixed(1)}
              <span className="text-lg font-semibold text-gray-600">%</span>
            </div>
          </div>

          {/* Decision */}
          <div className="stat-box">
            <p className="stat-label">Decision</p>
            <span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm"
              style={shortlisted ? {
                background: 'rgba(16,185,129,0.10)',
                border:     '1px solid rgba(16,185,129,0.35)',
                color:      '#34d399',
                boxShadow:  '0 0 16px rgba(16,185,129,0.30)',
              } : {
                background: 'rgba(239,68,68,0.10)',
                border:     '1px solid rgba(239,68,68,0.30)',
                color:      '#f87171',
                boxShadow:  '0 0 16px rgba(239,68,68,0.28)',
              }}
            >
              {shortlisted
                ? <CheckCircle2 size={15} strokeWidth={2.5} />
                : <XCircle      size={15} strokeWidth={2.5} />
              }
              {result.status}
            </span>
          </div>
        </div>

        {/* Section divider */}
        <div
          className="w-full h-px mb-5"
          style={{ background: 'rgba(255,255,255,0.06)' }}
        />

        {/* Skills Found */}
        <div>
          <p className="stat-label mb-3">
            Skills Matched&nbsp;
            <span
              className="normal-case tracking-normal font-mono"
              style={{ color: '#6b7280' }}
            >
              ({skills.length})
            </span>
          </p>

          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.map(skill => (
                <span key={skill} className="skill-chip">
                  <span className="skill-chip-dot" />
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm italic text-gray-600">No matching skills found.</p>
          )}
        </div>

      </div>
    </div>
  )
}
