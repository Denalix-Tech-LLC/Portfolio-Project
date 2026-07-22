/**
 * SmartImage — renders a real photo `object-contain` (never upscale-cropped)
 * over a blurred `object-cover` copy of itself as a backdrop, so any aspect
 * ratio looks deliberate.
 */
export default function SmartImage({
  src,
  alt,
  className = '',
}: {
  src: string
  alt: string
  className?: string
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-xl"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="relative h-full w-full object-contain" />
    </div>
  )
}
