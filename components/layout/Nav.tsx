import Link from 'next/link'
import { ThemeToggle } from './ThemeToggle'
import { MobileMenu } from './MobileMenu'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Work', href: '/portfolio' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Contact', href: '/contact' },
]

export function Nav() {
  return (
    <header className="sticky top-0 z-40 bg-bg-primary border-b border-border-color">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between relative">
        {/* Wordmark */}
        <Link
          href="/"
          className="font-seasons text-lg text-text-primary hover:text-accent transition-colors"
        >
          Julie Christensen
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side: theme toggle + mobile menu */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <MobileMenu />
        </div>
      </div>
    </header>
  )
}
