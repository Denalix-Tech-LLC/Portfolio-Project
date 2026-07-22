/**
 * HeroFallback — lightweight animated SVG neural network shown on mobile and
 * while the 3D scene lazy-loads. Animations are CSS-driven, so the global
 * prefers-reduced-motion rule freezes them automatically.
 */

const NODES = [
  [60, 90], [60, 190], [60, 290],
  [220, 50], [220, 140], [220, 240], [220, 330],
  [380, 90], [380, 190], [380, 290],
  [540, 140], [540, 240],
] as const

const EDGES = [
  [0, 3], [0, 4], [1, 4], [1, 5], [2, 5], [2, 6],
  [3, 7], [4, 7], [4, 8], [5, 8], [5, 9], [6, 9],
  [7, 10], [8, 10], [8, 11], [9, 11],
] as const

export default function HeroFallback() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden opacity-60">
      <svg
        viewBox="0 0 600 380"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        focusable="false"
      >
        {EDGES.map(([a, b], i) => (
          <line
            key={i}
            x1={NODES[a][0]}
            y1={NODES[a][1]}
            x2={NODES[b][0]}
            y2={NODES[b][1]}
            stroke="rgb(14 165 233 / 0.3)"
            strokeWidth="1.5"
            strokeDasharray="6 18"
            className="animate-dash-flow"
            style={{ animationDelay: `${(i % 5) * 0.3}s` }}
          />
        ))}
        {NODES.map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={i % 3 === 0 ? 7 : 5}
            fill="rgb(14 165 233 / 0.85)"
            className="animate-pulse-dot"
            style={{ animationDelay: `${(i % 6) * 0.4}s` }}
          />
        ))}
      </svg>
    </div>
  )
}
