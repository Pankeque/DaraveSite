import { motion } from "framer-motion";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Terms of Service</h1>
          <a
            href="/"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            ← Back to Home
          </a>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="prose prose-invert prose-zinc max-w-none"
        >
          <h1 className="text-5xl font-bold tracking-tighter mb-4">Terms of Service</h1>
          <p className="text-zinc-400 text-lg mb-12">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4">1. Acceptance of Terms</h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              By accessing or using Darave Studios' services, including our Discord bots, applications, and website, 
              you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use 
              our services.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4">2. Description of Services</h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              Darave Studios provides various services including but not limited to:
            </p>
            <ul className="list-disc list-inside text-zinc-300 space-y-2 mb-4">
              <li>Discord bots for ticket management and statistics</li>
              <li>Game development and asset creation</li>
              <li>Digital applications and tools</li>
              <li>Community management solutions</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4">3. User Responsibilities</h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              When using our services, you agree to:
            </p>
            <ul className="list-disc list-inside text-zinc-300 space-y-2 mb-4">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Not use our services for any illegal or unauthorized purpose</li>
              <li>Not attempt to interfere with or disrupt our services</li>
              <li>Not abuse, harass, or harm other users</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4">4. Prohibited Activities</h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              You may not:
            </p>
            <ul className="list-disc list-inside text-zinc-300 space-y-2 mb-4">
              <li>Reverse engineer, decompile, or disassemble our services</li>
              <li>Use our services to distribute spam or malware</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Violate Discord's Terms of Service or Community Guidelines</li>
              <li>Resell or redistribute our services without permission</li>
              <li>Use automated systems to access our services without authorization</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4">5. Intellectual Property</h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              All content, features, and functionality of our services are owned by Darave Studios and are protected 
              by international copyright, trademark, and other intellectual property laws. You may not copy, modify, 
              distribute, or create derivative works without our express written permission.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4">6. Service Availability</h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              We strive to provide reliable services, but we do not guarantee that our services will be uninterrupted, 
              secure, or error-free. We reserve the right to modify, suspend, or discontinue any part of our services 
              at any time without notice.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4">7. Limitation of Liability</h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              To the maximum extent permitted by law, Darave Studios shall not be liable for any indirect, incidental, 
              special, consequential, or punitive damages resulting from your use of or inability to use our services.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4">8. Indemnification</h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              You agree to indemnify and hold harmless Darave Studios from any claims, damages, losses, liabilities, 
              and expenses arising from your use of our services or violation of these Terms of Service.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4">9. Termination</h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              We reserve the right to terminate or suspend your access to our services at any time, without notice, 
              for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4">10. Changes to Terms</h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              We may modify these Terms of Service at any time. We will notify users of any material changes by posting 
              the new terms on this page. Your continued use of our services after such changes constitutes acceptance 
              of the new terms.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4">11. Governing Law</h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              These Terms of Service shall be governed by and construed in accordance with applicable laws, without 
              regard to conflict of law principles.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4">12. Contact Information</h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <p className="text-primary font-medium">
              legal@daravestudios.com
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
