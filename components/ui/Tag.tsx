interface TagProps {
  label: string
  className?: string
}

export function Tag({ label, className = '' }: TagProps) {
  return (
    <span
      className={`font-mono text-xs text-text-secondary border border-border-color px-2 py-0.5 rounded-sm ${className}`}
    >
      {label}
    </span>
  )
}
