/**
 * Container — centers content at a max width with responsive gutters.
 * Used by every section so horizontal rhythm stays identical site-wide.
 */
export default function Container({ as: Tag = 'div', className = '', children }) {
  return (
    <Tag className={`mx-auto w-full max-w-content px-6 sm:px-8 lg:px-12 ${className}`}>
      {children}
    </Tag>
  )
}
