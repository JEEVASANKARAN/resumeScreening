import { useState, useCallback, useEffect } from 'react'
import StarField        from './components/StarField'
import UploadSection    from './components/UploadSection'
import BatchResultTable from './components/BatchResultTable'
import { Zap, Activity } from 'lucide-react'

const API_BATCH_URL = 'http://localhost:8081/analyze-batch'
const DEFAULT_JD    = 'Java Spring Boot REST API MySQL Docker Kubernetes Microservices Maven Git'

export default function App() {
  const [files,      setFiles]      = useState([])      // array of File objects
  const [jd,         setJd]         = useState('')
  const [loading,    setLoading]    = useState(false)
  const [batchResult,setBatchResult] = useState(null)   // BatchResponseDto
  const [error,      setError]      = useState('')
  const [isDragOver, setIsDragOver] = useState(false)

  // Pre-fill default JD after a short delay
  useEffect(() => {
    const t = setTimeout(() => setJd(DEFAULT_JD), 600)
    return () => clearTimeout(t)
  }, [])

  // ------------------------------------------------------------------
  // Core analysis – posts all files to /analyze-batch
  // ------------------------------------------------------------------
  const runBatchAnalysis = useCallback(async (filesArg, jdArg) => {
    setLoading(true)
    setError('')
    setBatchResult(null)

    const form = new FormData()
    filesArg.forEach(f => form.append('files', f))
    form.append('jd', jdArg.trim())

    try {
      const res  = await fetch(API_BATCH_URL, { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) setError(data.error || `Backend error (HTTP ${res.status})`)
      else         setBatchResult(data)
    } catch {
      setError('Could not reach the backend. Make sure Spring Boot is running on port 8081.')
    } finally {
      setLoading(false)
    }
  }, [])

  // ------------------------------------------------------------------
  // Handlers
  // ------------------------------------------------------------------
  const handleFilesSelect = useCallback((incoming) => {
    setFiles(incoming)
    setBatchResult(null)
    setError('')
  }, [])

  const handleAnalyze = () => {
    if (files.length === 0) return setError('Please upload at least one resume.')
    if (!jd.trim())        return setError('Please enter a job description.')
    runBatchAnalysis(files, jd)
  }

  const handleRetry = () => {
    setError('')
    setBatchResult(null)
    if (files.length > 0 && jd.trim()) runBatchAnalysis(files, jd)
  }

  const canAnalyze = files.length > 0 && !!jd.trim() && !loading

  return (
    <>
      <StarField />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Page wrapper */}
      <div className="relative z-10 min-h-screen flex items-start justify-center px-4 py-14">

        {/* Soft glow behind card */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute rounded-full"
          style={{
            width: '680px', height: '500px', zIndex: 0,
            background: 'radial-gradient(ellipse at center, rgba(168,85,247,0.10) 0%, rgba(34,211,238,0.04) 55%, transparent 75%)',
            filter: 'blur(50px)',
            top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          }}
        />

        {/* ── MAIN CARD ── */}
        <main className="glass-card animate-fade-slide-in relative z-10 w-full max-w-2xl px-8 py-10 sm:px-12 sm:py-12">

          {/* ── HEADER ── */}
          <header className="text-center mb-9">
            {/* Live badge */}
            <div
              className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
              style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.22)', color: '#a855f7' }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse-dot"
                style={{ boxShadow: '0 0 6px #22d3ee' }}
              />
              <Activity size={10} strokeWidth={2.5} />
              System Active
            </div>

            <h1 className="gradient-heading text-4xl sm:text-[2.8rem] font-extrabold tracking-tight leading-tight mb-2.5">
              Resume Screening Engine
            </h1>
            <p className="text-gray-500 text-sm font-light tracking-wide">
              Upload multiple resumes · Match skills · Rank candidates instantly
            </p>
          </header>

          {/* Divider */}
          <div className="section-divider" />

          {/* ── UPLOAD (multi-file) ── */}
          <UploadSection
            onFilesSelect={handleFilesSelect}
            selectedFiles={files}
            isDragOver={isDragOver}
            setIsDragOver={setIsDragOver}
          />

          {/* ── JD TEXTAREA ── */}
          <div className="mb-6">
            <label className="section-label" htmlFor="jobDescription">
              Job Description / Keywords
            </label>
            <textarea
              id="jobDescription"
              className="jd-textarea"
              placeholder="e.g. Java Spring Boot MySQL Docker Kubernetes REST API"
              value={jd}
              onChange={e => { setJd(e.target.value); setError(''); setBatchResult(null) }}
              rows={4}
            />
          </div>

          {/* ── ANALYZE BUTTON ── */}
          <button
            id="analyzeBtn"
            className="btn-analyze w-full py-3.5 text-white font-semibold text-sm tracking-wide"
            onClick={handleAnalyze}
            disabled={!canAnalyze}
            aria-label="Run Batch Analysis"
          >
            <span className="flex items-center justify-center gap-2.5">
              {loading ? (
                <>
                  <span className="spinner" />
                  <span>Analyzing<span className="animate-pulse">…</span></span>
                </>
              ) : (
                <>
                  <Zap size={16} strokeWidth={2.5} />
                  {files.length > 1
                    ? `Screen ${files.length} Resumes`
                    : 'Run Analysis'}
                </>
              )}
            </span>
          </button>

          {/* ── ERROR BANNER ── */}
          {error && (
            <div
              id="errorMessage"
              role="alert"
              className="animate-fade-slide-in flex items-start gap-3 mt-5 px-5 py-4 rounded-xl text-red-300 text-sm"
              style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.22)' }}
            >
              <span className="text-base leading-none mt-0.5">⚠️</span>
              <span className="flex-1 leading-snug">{error}</span>
              {files.length > 0 && jd.trim() && (
                <button
                  onClick={handleRetry}
                  className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg"
                  style={{
                    background: 'rgba(239,68,68,0.12)',
                    border:     '1px solid rgba(239,68,68,0.30)',
                    color:      '#fca5a5',
                    cursor:     'pointer',
                  }}
                >
                  ↺ Retry
                </button>
              )}
            </div>
          )}

          {/* ── BATCH RESULTS ── */}
          {batchResult && (
            <div id="resultSection" className="animate-fade-slide-in mt-7">
              <BatchResultTable batchResult={batchResult} />
            </div>
          )}

          {/* ── Footer indicator ── */}
          <div className="flex items-center justify-center gap-2 mt-8 text-xs uppercase tracking-widest text-gray-700 select-none">
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse-dot-slow"
              style={{ background: '#10b981', boxShadow: '0 0 5px #10b981' }}
            />
            Multi-resume batch mode
          </div>

        </main>
      </div>
    </>
  )
}
