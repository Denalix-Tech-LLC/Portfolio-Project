import type { ProjectMotif } from '@/types/content'

/**
 * PlaceholderArt — a UNIQUE inline-SVG illustration per motif for projects
 * without a real image. Each motif is distinct vector art themed to the
 * project (never one repeated design). Decorative: aria-hidden; the card
 * title carries the meaning.
 */

const SKY = '#0ea5e9'
const SKY_LIGHT = '#7dd3fc'
const SKY_DIM = 'rgba(14,165,233,0.25)'
const INK = '#9ea4b3'

function Chatbot() {
  return (
    <g>
      <rect x="70" y="50" width="180" height="120" rx="16" fill="none" stroke={SKY} strokeWidth="2.5" />
      <circle cx="120" cy="100" r="9" fill={SKY_LIGHT} />
      <circle cx="160" cy="100" r="9" fill={SKY_LIGHT} />
      <circle cx="200" cy="100" r="9" fill={SKY_LIGHT} />
      <path d="M120 140h80" stroke={SKY_DIM} strokeWidth="6" strokeLinecap="round" />
      <path d="M130 170 115 195h30z" fill={SKY} opacity="0.7" />
      <rect x="270" y="90" width="80" height="46" rx="12" fill={SKY_DIM} />
      <path d="M285 108h50M285 120h30" stroke={SKY_LIGHT} strokeWidth="4" strokeLinecap="round" />
      <circle cx="330" cy="60" r="4" fill={SKY} />
      <circle cx="300" cy="45" r="2.5" fill={INK} />
    </g>
  )
}

function Api() {
  return (
    <g>
      <path d="M60 110h90M270 110h90" stroke={SKY} strokeWidth="2.5" strokeDasharray="8 6" />
      <rect x="155" y="75" width="110" height="70" rx="12" fill="none" stroke={SKY} strokeWidth="2.5" />
      <text x="210" y="118" textAnchor="middle" fill={SKY_LIGHT} fontFamily="monospace" fontSize="22" fontWeight="bold">
        {'{ }'}
      </text>
      <circle cx="60" cy="110" r="10" fill={SKY_DIM} stroke={SKY} strokeWidth="2" />
      <circle cx="360" cy="110" r="10" fill={SKY_DIM} stroke={SKY} strokeWidth="2" />
      <path d="M120 60l18 10-18 10M300 140l-18 10 18 10" stroke={SKY_LIGHT} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M90 170h60M270 55h60" stroke={SKY_DIM} strokeWidth="5" strokeLinecap="round" />
    </g>
  )
}

function Automation() {
  return (
    <g>
      <circle cx="140" cy="110" r="42" fill="none" stroke={SKY} strokeWidth="2.5" strokeDasharray="10 7" />
      <circle cx="140" cy="110" r="16" fill={SKY_DIM} stroke={SKY_LIGHT} strokeWidth="2" />
      <path d="M140 52v-14M140 182v-14M198 110h14M68 110h14" stroke={SKY} strokeWidth="3" strokeLinecap="round" />
      <path d="M250 80l16 16 30-34" stroke={SKY_LIGHT} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M250 140l16 16 30-34" stroke={SKY} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
      <rect x="238" y="60" width="118" height="52" rx="10" fill="none" stroke={SKY_DIM} strokeWidth="2" />
      <rect x="238" y="120" width="118" height="52" rx="10" fill="none" stroke={SKY_DIM} strokeWidth="2" />
    </g>
  )
}

function Network() {
  return (
    <g>
      <path d="M100 160 210 60M210 60l110 100M100 160h220M210 60v100" stroke={SKY_DIM} strokeWidth="2" />
      <path d="M100 160l110-30 110 30" stroke={SKY} strokeWidth="2" fill="none" />
      <circle cx="100" cy="160" r="14" fill={SKY_DIM} stroke={SKY} strokeWidth="2.5" />
      <circle cx="210" cy="60" r="14" fill={SKY_DIM} stroke={SKY} strokeWidth="2.5" />
      <circle cx="320" cy="160" r="14" fill={SKY_DIM} stroke={SKY} strokeWidth="2.5" />
      <circle cx="210" cy="130" r="10" fill={SKY_LIGHT} />
      <circle cx="155" cy="110" r="4" fill={INK} />
      <circle cx="265" cy="110" r="4" fill={INK} />
    </g>
  )
}

function Bank() {
  return (
    <g>
      <path d="M210 40 90 95h240z" fill="none" stroke={SKY} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M110 95v70M160 95v70M210 95v70M260 95v70M310 95v70" stroke={SKY_DIM} strokeWidth="8" strokeLinecap="round" />
      <path d="M85 175h250" stroke={SKY} strokeWidth="3" strokeLinecap="round" />
      <circle cx="210" cy="68" r="7" fill={SKY_LIGHT} />
      <path d="M330 130a18 18 0 1 1-8 20" stroke={SKY_LIGHT} strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </g>
  )
}

function Ai() {
  return (
    <g>
      <path
        d="M170 60c-25 0-38 18-34 38-16 6-20 30-6 42-6 20 10 36 30 32 8 14 32 14 40 0V70c0-6-12-10-30-10z"
        fill="none"
        stroke={SKY}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M200 90h60m-60 30h80m-80 30h50" stroke={SKY_DIM} strokeWidth="3" strokeLinecap="round" />
      <circle cx="270" cy="90" r="6" fill={SKY_LIGHT} />
      <circle cx="290" cy="120" r="6" fill={SKY_LIGHT} />
      <circle cx="260" cy="150" r="6" fill={SKY_LIGHT} />
      <circle cx="150" cy="95" r="5" fill={SKY_LIGHT} />
      <circle cx="165" cy="130" r="5" fill={SKY_LIGHT} />
      <path d="M150 95l15 35" stroke={SKY_DIM} strokeWidth="2" />
      <path d="M320 60l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" fill={SKY_LIGHT} opacity="0.8" />
    </g>
  )
}

const MOTIFS: Record<ProjectMotif, () => React.ReactElement> = {
  chatbot: Chatbot,
  api: Api,
  automation: Automation,
  network: Network,
  bank: Bank,
  ai: Ai,
}

export default function PlaceholderArt({ motif, className = '' }: { motif: ProjectMotif; className?: string }) {
  const Art = MOTIFS[motif] ?? MOTIFS.ai
  return (
    <svg
      viewBox="0 0 420 220"
      className={`h-full w-full bg-surface2/60 ${className}`}
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
    >
      <rect width="420" height="220" fill="transparent" />
      <Art />
    </svg>
  )
}
