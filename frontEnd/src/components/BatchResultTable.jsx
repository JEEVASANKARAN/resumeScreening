import { CheckCircle2, XCircle, ChevronDown, ChevronUp, Clock } from 'lucide-react'
import { useState } from 'react'

/**
 * BatchResultTable – displays screened candidates from a batch analysis.
 *
 * Props:
 *  - batchResult: { candidates: CandidateResultDto[], totalProcessed, shortlistedCount }
 */
export default function BatchResultTable({ batchResult }) {
  const [expandedIndex, setExpandedIndex] = useState(null)

  if (!batchResult) return null

  const { candidates = [], totalProcessed, shortlistedCount } = batchResult

  const timestamp = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
  })

  const toggleRow = i => setExpandedIndex(prev => (prev === i ? null : i))

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

      <div className="px-6 py-5">

        {/* Header row */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">
            ⚡ Batch Screening Complete
          </p>
          <span className="flex items-center gap-1.5 font-mono text-xs text-gray-600">
            <Clock size={11} strokeWidth={2} />
            {timestamp}
          </span>
        </div>

        {/* Summary pills */}
        <div className="flex flex-wrap gap-3 mb-5">
          <span
            className="px-4 py-1.5 rounded-full text-xs font-bold tracking-wide"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border:     '1px solid rgba(255,255,255,0.10)',
              color:      '#9ca3af',
            }}
          >
            {totalProcessed} Processed
          </span>
          <span
            className="px-4 py-1.5 rounded-full text-xs font-bold tracking-wide"
            style={{
              background: 'rgba(16,185,129,0.08)',
              border:     '1px solid rgba(16,185,129,0.30)',
              color:      '#34d399',
            }}
          >
            ✓ {shortlistedCount} Shortlisted
          </span>
          <span
            className="px-4 py-1.5 rounded-full text-xs font-bold tracking-wide"
            style={{
              background: 'rgba(239,68,68,0.08)',
              border:     '1px solid rgba(239,68,68,0.28)',
              color:      '#f87171',
            }}
          >
            ✗ {totalProcessed - shortlistedCount} Rejected
          </span>
        </div>

        {/* Divider */}
        <div className="w-full h-px mb-4" style={{ background: 'rgba(255,255,255,0.06)' }} />

        {/* Candidate rows */}
        {candidates.length === 0 ? (
          <p className="text-sm italic text-gray-600 text-center py-4">
            No resumes could be processed.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {candidates.map((c, i) => {
              const isShortlisted = c.status === 'Shortlisted'
              const score = c.score ?? 0
              const scoreColor =
                score >= 75 ? '#34d399'
                : score >= 45 ? '#f59e0b'
                : '#f87171'
              const isOpen = expandedIndex === i

              return (
                <li key={i}>
                  {/* Main row */}
                  <button
                    onClick={() => toggleRow(i)}
                    className="w-full text-left"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    aria-expanded={isOpen}
                    aria-label={`Toggle details for ${c.candidateName}`}
                  >
                    <div
                      className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
                      style={{
                        background: isOpen
                          ? 'rgba(168,85,247,0.07)'
                          : 'rgba(255,255,255,0.025)',
                        border: '1px solid rgba(255,255,255,0.07)',
                      }}
                    >
                      {/* Rank badge */}
                      <span
                        className="font-mono text-xs font-bold shrink-0"
                        style={{ color: '#4b5563', width: '20px', textAlign: 'right' }}
                      >
                        {i + 1}
                      </span>

                      {/* Candidate name */}
                      <span
                        className="flex-1 text-sm font-semibold text-white truncate"
                        title={c.candidateName}
                      >
                        {c.candidateName}
                      </span>

                      {/* Score */}
                      <span
                        className="font-mono font-extrabold text-sm shrink-0"
                        style={{ color: scoreColor, minWidth: '56px', textAlign: 'right' }}
                      >
                        {score.toFixed(1)}
                        <span className="text-xs font-semibold" style={{ color: '#4b5563' }}>%</span>
                      </span>

                      {/* Status pill */}
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shrink-0"
                        style={isShortlisted ? {
                          background: 'rgba(16,185,129,0.10)',
                          border:     '1px solid rgba(16,185,129,0.32)',
                          color:      '#34d399',
                        } : {
                          background: 'rgba(239,68,68,0.10)',
                          border:     '1px solid rgba(239,68,68,0.28)',
                          color:      '#f87171',
                        }}
                      >
                        {isShortlisted
                          ? <CheckCircle2 size={11} strokeWidth={2.5} />
                          : <XCircle      size={11} strokeWidth={2.5} />
                        }
                        {c.status}
                      </span>

                      {/* Expand toggle */}
                      <span style={{ color: '#4b5563', flexShrink: 0 }}>
                        {isOpen
                          ? <ChevronUp   size={14} strokeWidth={2} />
                          : <ChevronDown size={14} strokeWidth={2} />
                        }
                      </span>
                    </div>
                  </button>

                  {/* Expandable skills panel */}
                  {isOpen && (
                    <div
                      className="animate-fade-slide-in px-4 pt-2 pb-3 rounded-b-xl"
                      style={{
                        background: 'rgba(168,85,247,0.04)',
                        borderLeft:   '1px solid rgba(168,85,247,0.14)',
                        borderRight:  '1px solid rgba(168,85,247,0.14)',
                        borderBottom: '1px solid rgba(168,85,247,0.14)',
                      }}
                    >
                      <p className="stat-label mb-2">
                        Matched Skills&nbsp;
                        <span className="normal-case tracking-normal font-mono" style={{ color: '#6b7280' }}>
                          ({(c.matchedSkills ?? []).length})
                        </span>
                      </p>
                      {(c.matchedSkills ?? []).length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {c.matchedSkills.map(skill => (
                            <span key={skill} className="skill-chip">
                              <span className="skill-chip-dot" />
                              {skill}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs italic text-gray-600">No matching skills found.</p>
                      )}
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
