import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-seasons text-5xl text-text-primary mb-8">Privacy Policy</h1>

        {/* PLACEHOLDER — Generate a GDPR-compliant privacy policy for a sole trader based in Norway before launch.
            Key points to cover: what data is collected via the contact form, how long it is retained,
            Formspree as a data processor, user rights under GDPR/Norwegian law, contact details for data requests. */}
        <p className="text-text-secondary font-mono text-sm">
          Privacy policy coming soon. This site collects only the information you voluntarily
          submit via the contact form. No tracking or advertising cookies are used.
        </p>
      </div>
    </div>
  )
}
