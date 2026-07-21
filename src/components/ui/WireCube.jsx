/**
 * WireCube — a slowly spinning 3D wireframe cube in the accent color.
 * Pure CSS 3D (no library): six bordered faces around a preserve-3d spinner.
 * Decorative only (aria-hidden); the global reduced-motion rule freezes it
 * at a static 3D angle. `size` is the edge length in px.
 */
export default function WireCube({ size = 112, reverse = false, duration, className = '' }) {
  const half = size / 2
  const spin = {
    animationDirection: reverse ? 'reverse' : undefined,
    animationDuration: duration || undefined,
  }
  const faces = [
    `rotateY(0deg) translateZ(${half}px)`,
    `rotateY(90deg) translateZ(${half}px)`,
    `rotateY(180deg) translateZ(${half}px)`,
    `rotateY(270deg) translateZ(${half}px)`,
    `rotateX(90deg) translateZ(${half}px)`,
    `rotateX(-90deg) translateZ(${half}px)`,
  ]

  return (
    <div
      aria-hidden="true"
      className={`cube-scene pointer-events-none ${className}`}
      style={{ width: size, height: size }}
    >
      <div className="cube" style={spin}>
        {faces.map((transform) => (
          <div key={transform} className="cube-face" style={{ transform }} />
        ))}
      </div>
    </div>
  )
}
