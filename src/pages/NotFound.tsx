import { Link, useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        <div className="flex items-start gap-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
            {/* compass/404 icon */}
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M14.5 9.5l-2 5-5 2 2-5 5-2z" />
            </svg>
          </div>

          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-slate-900">
              Page not found
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              The page you requested does not exist or may have been moved.
            </p>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center">
              <Link
                to="/users"
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-100"
              >
                Go to Users
              </Link>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
              >
                Go back
              </button>
            </div>

            <p className="mt-6 text-xs text-slate-500">
              Tip: Use the navigation in the header to return to the dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
