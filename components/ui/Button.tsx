import Link from 'next/link'

interface ButtonProps {
  variant: 'primary' | 'ghost' | 'link'
  children: React.ReactNode
  href?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  className?: string
  ariaLabel?: string
}

const variantClasses: Record<ButtonProps['variant'], string> = {
  primary:
    'bg-accent text-bg-primary font-mono text-sm px-6 py-3 rounded hover:opacity-90 transition-opacity inline-flex items-center gap-2',
  ghost:
    'border border-border-color text-text-primary font-mono text-sm px-6 py-3 rounded hover:bg-bg-secondary transition-colors inline-flex items-center gap-2',
  link: 'text-accent font-mono text-sm underline-offset-4 hover:underline inline-flex items-center gap-1',
}

export function Button({
  variant,
  children,
  href,
  onClick,
  type = 'button',
  disabled,
  className = '',
  ariaLabel,
}: ButtonProps) {
  const classes = `${variantClasses[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`

  if (href) {
    const isExternal = href.startsWith('http')
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
          aria-label={ariaLabel}
        >
          {children}
        </a>
      )
    }
    return (
      <Link href={href} className={classes} aria-label={ariaLabel}>
        {children}
      </Link>
    )
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  )
}
