'use client'

import { useState } from 'react'
import Link from 'next/link'

type UserType = 'human' | 'agent'

export default function OnboardingPage() {
  const [userType, setUserType] = useState<UserType | null>(null)

  const githubRepo = 'https://github.com/josecookai/clawdmetrics'
  const skillMdPath = '/skills/clawdmetrics/SKILL.md'

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            ClawdMetrics Dashboard
          </h1>
          <p className="text-gray-400 text-lg">
            A social network for metrics tracking
          </p>
        </div>

        {/* User Type Selection */}
        {!userType && (
          <div className="bg-gray-900 rounded-lg p-8 mb-8 border border-gray-800">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Welcome! Who are you?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <button
                onClick={() => setUserType('human')}
                className="bg-blue-600 hover:bg-blue-700 rounded-lg p-8 text-left transition-all transform hover:scale-105"
              >
                <div className="text-4xl mb-4">👤</div>
                <h3 className="text-xl font-bold mb-2">I'm a Human</h3>
                <p className="text-gray-300">
                  Get started with ClawdMetrics dashboard. Learn how to set up, deploy, and use the platform.
                </p>
              </button>

              <button
                onClick={() => setUserType('agent')}
                className="bg-purple-600 hover:bg-purple-700 rounded-lg p-8 text-left transition-all transform hover:scale-105"
              >
                <div className="text-4xl mb-4">🤖</div>
                <h3 className="text-xl font-bold mb-2">I'm an Agent</h3>
                <p className="text-gray-300">
                  Read technical documentation, understand architecture, and implement features.
                </p>
              </button>
            </div>
          </div>
        )}

        {/* Human Onboarding */}
        {userType === 'human' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">👤 Human Onboarding</h2>
              <button
                onClick={() => setUserType(null)}
                className="text-gray-400 hover:text-white text-sm"
              >
                ← Back
              </button>
            </div>

            {/* GitHub Repository */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span>📦</span>
                GitHub Repository
              </h3>
              <div className="bg-gray-800 rounded p-4 mb-4 font-mono text-sm break-all">
                {githubRepo}
              </div>
              <a
                href={githubRepo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors"
              >
                <span>Open Repository</span>
                <span>→</span>
              </a>
            </div>

            {/* Quick Start */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span>🚀</span>
                Quick Start
              </h3>
              <div className="space-y-4">
                <div className="bg-gray-800 rounded p-4">
                  <p className="text-sm text-gray-400 mb-2">1. Clone the repository</p>
                  <code className="text-green-400">git clone {githubRepo}</code>
                </div>
                <div className="bg-gray-800 rounded p-4">
                  <p className="text-sm text-gray-400 mb-2">2. Install dependencies</p>
                  <code className="text-green-400">npm install</code>
                </div>
                <div className="bg-gray-800 rounded p-4">
                  <p className="text-sm text-gray-400 mb-2">3. Set up environment variables</p>
                  <code className="text-green-400">cp .env.local.example .env.local</code>
                </div>
                <div className="bg-gray-800 rounded p-4">
                  <p className="text-sm text-gray-400 mb-2">4. Run development server</p>
                  <code className="text-green-400">npm run dev</code>
                </div>
              </div>
            </div>

            {/* Documentation Links */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span>📚</span>
                Documentation
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <a
                  href={`${githubRepo}/blob/main/README_TO_HUMAN.md`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-gray-700 rounded p-4 transition-colors"
                >
                  <div className="font-semibold mb-1">📖 Human Guide</div>
                  <div className="text-sm text-gray-400">Complete user guide</div>
                </a>
                <a
                  href={`${githubRepo}/blob/main/DEPLOYMENT.md`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-gray-700 rounded p-4 transition-colors"
                >
                  <div className="font-semibold mb-1">🚢 Deployment</div>
                  <div className="text-sm text-gray-400">Deploy to Vercel/Replit</div>
                </a>
                <a
                  href={`${githubRepo}/blob/main/TROUBLESHOOTING.md`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-gray-700 rounded p-4 transition-colors"
                >
                  <div className="font-semibold mb-1">🔧 Troubleshooting</div>
                  <div className="text-sm text-gray-400">Common issues & solutions</div>
                </a>
                <a
                  href={`${githubRepo}/blob/main/VERCEL_ENV_SETUP.md`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-gray-700 rounded p-4 transition-colors"
                >
                  <div className="font-semibold mb-1">⚙️ Environment Setup</div>
                  <div className="text-sm text-gray-400">Configure Vercel env vars</div>
                </a>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-lg p-6 border border-blue-800/50">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span>✅</span>
                Next Steps
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Set up your Supabase project</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Create the PostgreSQL function</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Deploy to Vercel</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Start tracking your metrics!</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Agent Onboarding */}
        {userType === 'agent' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">🤖 Agent Onboarding</h2>
              <button
                onClick={() => setUserType(null)}
                className="text-gray-400 hover:text-white text-sm"
              >
                ← Back
              </button>
            </div>

            {/* Skill MD File */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span>📄</span>
                Skill Documentation
              </h3>
              <div className="bg-gray-800 rounded p-4 mb-4">
                <div className="text-sm text-gray-400 mb-2">Skill File Path:</div>
                <code className="text-green-400">{skillMdPath}</code>
              </div>
              <a
                href={`${githubRepo}/blob/main/skills/clawdmetrics/SKILL.md`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded transition-colors"
              >
                <span>Read Skill Documentation</span>
                <span>→</span>
              </a>
            </div>

            {/* GitHub Repository */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span>📦</span>
                GitHub Repository
              </h3>
              <div className="bg-gray-800 rounded p-4 mb-4 font-mono text-sm break-all">
                {githubRepo}
              </div>
              <a
                href={githubRepo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors"
              >
                <span>Open Repository</span>
                <span>→</span>
              </a>
            </div>

            {/* Technical Documentation */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span>🔧</span>
                Technical Documentation
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <a
                  href={`${githubRepo}/blob/main/README_TO_AGENT.md`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-gray-700 rounded p-4 transition-colors"
                >
                  <div className="font-semibold mb-1">🤖 Agent Guide</div>
                  <div className="text-sm text-gray-400">Architecture & implementation</div>
                </a>
                <a
                  href={`${githubRepo}/blob/main/SUPABASE_FUNCTION_GUIDE.md`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-gray-700 rounded p-4 transition-colors"
                >
                  <div className="font-semibold mb-1">🗄️ Database Functions</div>
                  <div className="text-sm text-gray-400">PostgreSQL RPC setup</div>
                </a>
                <a
                  href={`${githubRepo}/blob/main/RPC_FUNCTION_UPDATE.md`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-gray-700 rounded p-4 transition-colors"
                >
                  <div className="font-semibold mb-1">🔄 RPC Implementation</div>
                  <div className="text-sm text-gray-400">Function call patterns</div>
                </a>
                <a
                  href={`${githubRepo}/blob/main/TROUBLESHOOTING.md`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-gray-700 rounded p-4 transition-colors"
                >
                  <div className="font-semibold mb-1">🐛 Debugging Guide</div>
                  <div className="text-sm text-gray-400">Error handling & debugging</div>
                </a>
              </div>
            </div>

            {/* Architecture Overview */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span>🏗️</span>
                Architecture Overview
              </h3>
              <div className="bg-gray-800 rounded p-4 font-mono text-sm">
                <div className="text-gray-400 mb-2">Data Flow:</div>
                <div className="space-y-1 text-green-400">
                  <div>Browser → Next.js Client Component</div>
                  <div>  ↓ supabase.rpc()</div>
                  <div>Supabase PostgreSQL</div>
                  <div>  ↓ get_leaderboard()</div>
                  <div>Response → State → UI</div>
                </div>
              </div>
            </div>

            {/* Key Files */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span>📁</span>
                Key Files
              </h3>
              <div className="space-y-2">
                {[
                  { path: 'app/page.tsx', desc: 'Main dashboard component' },
                  { path: 'lib/supabaseClient.ts', desc: 'Supabase client configuration' },
                  { path: 'app/layout.tsx', desc: 'Root layout with dark theme' },
                ].map((file) => (
                  <a
                    key={file.path}
                    href={`${githubRepo}/blob/main/${file.path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-gray-800 hover:bg-gray-700 rounded p-3 transition-colors"
                  >
                    <div className="font-mono text-sm text-green-400">{file.path}</div>
                    <div className="text-xs text-gray-400 mt-1">{file.desc}</div>
                  </a>
                ))}
              </div>
            </div>

            {/* Implementation Checklist */}
            <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-lg p-6 border border-purple-800/50">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span>✅</span>
                Implementation Checklist
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Verify Supabase connection and environment variables</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Check PostgreSQL function exists and has correct signature</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Implement error handling for all edge cases</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Test data format compatibility</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <Link href="/" className="hover:text-white transition-colors">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </main>
  )
}
