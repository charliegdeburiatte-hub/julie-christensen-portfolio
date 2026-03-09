import Link from 'next/link'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Work', href: '/portfolio' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Contact', href: '/contact' },
]

export function Footer() {
  return (
    <footer className="bg-bg-secondary border-t border-border-color py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Brand */}
          <div>
            <p className="font-seasons text-xl text-text-primary">Julie Christensen</p>
            <p className="font-mono text-sm text-text-secondary mt-1">
              Your story, told with care.
            </p>
          </div>

          {/* Nav links */}
          <nav className="flex flex-wrap gap-6">
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
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-8 border-t border-border-color flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-mono text-xs text-text-secondary">
            © {new Date().getFullYear()} Julie Christensen. All rights reserved.
          </p>
          <Link
            href="/privacy"
            className="font-mono text-xs text-text-secondary hover:text-text-primary transition-colors"
          >
            Privacy Policy
          </Link>
        </div>

        {/* FUTURE: Social links — renders nothing if socialLinks array is empty */}
        {/* <SocialLinks links={settings.socialLinks} /> */}
      </div>
    </footer>
  )
}
