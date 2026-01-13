import { GlassPanel } from '../ui/GlassPanel'
import { Textarea } from '../ui/Textarea'
import { Button } from '../ui/Button'
import { MIN_TRANSCRIPT_CHARS } from '../../lib/constants'

interface TranscriptInputProps {
  transcript: string
  onTranscriptChange: (value: string) => void
  onAnalyze: () => void
  loading: boolean
  error: string | null
}

export function TranscriptInput({
  transcript,
  onTranscriptChange,
  onAnalyze,
  loading,
  error,
}: TranscriptInputProps) {
  const charCount = transcript.trim().length
  const isValid = charCount >= MIN_TRANSCRIPT_CHARS

  return (
    <GlassPanel className="grid gap-4">
      {/* Header */}
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div>
          <div className="font-semibold text-lg">Transcript</div>
          <div className="text-sm text-text-muted">Minimaal {MIN_TRANSCRIPT_CHARS} karakters</div>
        </div>
        <div className="text-sm text-text-muted px-3 py-1.5 rounded-full bg-white/70 border border-slate-300/35">
          {charCount} / {MIN_TRANSCRIPT_CHARS}
        </div>
      </div>

      {/* Textarea */}
      <Textarea
        value={transcript}
        onChange={(e) => onTranscriptChange(e.target.value)}
        placeholder="Plak hier je coaching call transcript..."
        rows={10}
        disabled={loading}
      />

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={onAnalyze} disabled={!isValid} loading={loading}>
          Analyseer
        </Button>
        <span className="text-sm text-text-muted">Demo output, geen backend gekoppeld.</span>
      </div>

      {/* Error */}
      {error && <div className="error-box">{error}</div>}
    </GlassPanel>
  )
}
