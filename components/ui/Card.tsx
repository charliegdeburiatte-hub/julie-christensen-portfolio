interface CardProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  as?: 'div' | 'article'
}

export function Card({ children, onClick, className = '', as: Tag = 'div' }: CardProps) {
  const base = 'bg-bg-secondary border border-border-color rounded-lg overflow-hidden'

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${base} text-left w-full hover:-translate-y-1 hover:shadow-lg transition-transform duration-200 ${className}`}
      >
        {children}
      </button>
    )
  }

  return (
    <Tag className={`${base} ${className}`}>
      {children}
    </Tag>
  )
}
