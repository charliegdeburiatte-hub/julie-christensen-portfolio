import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h1 className="font-seasons text-5xl text-text-primary mb-4">Nothing here.</h1>
        <p className="text-text-secondary mb-8">
          The page you&apos;re looking for doesn&apos;t exist — but the rest of the site does.
        </p>
        <Button variant="primary" href="/">
          Go Home →
        </Button>
      </div>
    </div>
  )
}
