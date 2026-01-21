import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Navbar */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          {/* Brand */}
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500 text-white shadow-sm">
              {/* app logo */}
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M6 19V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12" />
                <path d="M6 19a2 2 0 0 0 2 2h10" />
                <path d="M10 9h6" />
                <path d="M10 13h6" />
              </svg>
            </div>

            <div className="min-w-0">
              <div className="truncate text-sm font-semibold tracking-tight text-slate-900 sm:text-base">
                Author Management Dashboard
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Page container */}
      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>© {new Date().getFullYear()} Esen Tekkanat - Hana Task</div>
        </div>
      </footer>
    </div>
  );
}
