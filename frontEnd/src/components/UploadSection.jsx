import { useRef } from 'react'
import { UploadCloud, FileCheck, X } from 'lucide-react'

/**
 * UploadSection – supports multi-file selection (PDF / DOCX).
 *
 * Props:
 *  - onFilesSelect(files: File[])  called whenever the selection changes
 *  - selectedFiles: File[]         current selection (controlled)
 *  - isDragOver: boolean
 *  - setIsDragOver: fn
 */
export default function UploadSection({ onFilesSelect, selectedFiles, isDragOver, setIsDragOver }) {
  const inputRef = useRef(null)

  const handleDragEnter = e => { e.preventDefault(); setIsDragOver(true) }
  const handleDragLeave = e => { e.preventDefault(); setIsDragOver(false) }
  const handleDragOver  = e => { e.preventDefault() }

  const handleDrop = e => {
    e.preventDefault()
    setIsDragOver(false)
    const dropped = Array.from(e.dataTransfer.files).filter(isValidFile)
    if (dropped.length > 0) onFilesSelect(dropped)
  }

  const handleChange = e => {
    const chosen = Array.from(e.target.files).filter(isValidFile)
    if (chosen.length > 0) onFilesSelect(chosen)
    // Reset input so the same files can be re-selected after removal
    e.target.value = ''
  }

  const removeFile = (indexToRemove, e) => {
    e.stopPropagation()
    const updated = selectedFiles.filter((_, i) => i !== indexToRemove)
    onFilesSelect(updated)
  }

  const hasFiles = selectedFiles && selectedFiles.length > 0

  return (
    <div className="mb-6">
      <span className="section-label">Upload Resumes</span>

      {/* Drop zone */}
      <div
        className={`drop-zone relative flex flex-col items-center justify-center gap-3 px-6 py-7 text-center${isDragOver ? ' drag-over' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        {/* Hidden multi-file input */}
        <input
          ref={inputRef}
          id="resumeFile"
          type="file"
          accept=".pdf,.doc,.docx"
          multiple
          onChange={handleChange}
          onClick={e => e.stopPropagation()}
          className="sr-only"
        />

        {/* Icon */}
        {hasFiles ? (
          <FileCheck
            size={34}
            strokeWidth={1.5}
            className="text-emerald-400"
            style={{ filter: 'drop-shadow(0 0 8px rgba(52,211,153,0.5))' }}
          />
        ) : (
          <UploadCloud
            size={34}
            strokeWidth={1.5}
            className="text-violet-400"
            style={{ filter: 'drop-shadow(0 0 8px rgba(167,139,250,0.45))' }}
          />
        )}

        {/* Primary text */}
        <p className="text-white text-sm font-medium leading-snug">
          {hasFiles
            ? `${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''} selected`
            : 'Drag & drop or click to upload multiple resumes'}
        </p>

        {/* Hint */}
        <p className="text-gray-600 text-xs">
          {hasFiles ? 'Click to add more files' : 'PDF or DOCX — max 50 MB each'}
        </p>
      </div>

      {/* File chip list */}
      {hasFiles && (
        <ul className="mt-3 flex flex-col gap-1.5">
          {selectedFiles.map((file, i) => (
            <li
              key={`${file.name}-${i}`}
              className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs font-mono font-semibold"
              style={{
                background:  'rgba(52,211,153,0.06)',
                border:      '1px solid rgba(52,211,153,0.22)',
                color:       '#34d399',
              }}
            >
              <span
                style={{
                  overflow:     'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace:   'nowrap',
                  maxWidth:     'calc(100% - 28px)',
                }}
              >
                📎 {file.name}
              </span>
              <button
                onClick={e => removeFile(i, e)}
                aria-label={`Remove ${file.name}`}
                style={{
                  background:  'none',
                  border:      'none',
                  cursor:      'pointer',
                  padding:     '2px',
                  color:       '#6b7280',
                  flexShrink:  0,
                  lineHeight:  1,
                }}
              >
                <X size={13} strokeWidth={2.5} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// Only allow PDF / DOC / DOCX files
function isValidFile(file) {
  return /\.(pdf|doc|docx)$/i.test(file.name)
}
