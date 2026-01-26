function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100">
      <div className="w-full max-w-xl rounded-2xl bg-slate-800/80 border border-slate-700 shadow-xl p-8">
        <h1 className="text-3xl font-bold mb-2 text-center">Tech Forge</h1>
        <p className="text-sm text-slate-400 text-center mb-6">
          Clean starter. Tailwind-ready. No Vite boilerplate.
        </p>

        <div className="space-y-4">
          <div className="rounded-xl border border-slate-700/70 bg-slate-900/40 p-4">
            <h2 className="text-sm font-semibold text-slate-300 mb-1 uppercase tracking-wide">
              Next steps
            </h2>
            <ul className="text-sm text-slate-300 list-disc list-inside space-y-1">
              <li>Start building your components in <code className="px-1 py-0.5 rounded bg-slate-900/80">src/App.jsx</code></li>
              <li>Edit global styles with Tailwind in <code className="px-1 py-0.5 rounded bg-slate-900/80">src/index.css</code></li>
              <li>Run <code className="px-1 py-0.5 rounded bg-slate-900/80">npm run dev</code> to see changes live</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
