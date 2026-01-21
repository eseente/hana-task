import React from "react";

type Props = {
  loading: boolean;
  error: string | null;
  children: React.ReactNode;

  onRetry?: () => void;

  skeletonCount?: number;
};

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="animate-pulse space-y-3">
        <div className="h-4 w-2/3 rounded bg-slate-200" />
        <div className="h-3 w-1/2 rounded bg-slate-200" />
        <div className="h-3 w-5/6 rounded bg-slate-200" />
        <div className="h-3 w-4/6 rounded bg-slate-200" />
      </div>
    </div>
  );
}

export function StateView({
  loading,
  error,
  children,
  onRetry,
  skeletonCount = 6,
}: Props) {
  if (loading) {
    return (
      <div className="space-y-4">
        {/* Header placeholder */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="animate-pulse">
            <div className="h-4 w-40 rounded bg-slate-200" />
            <div className="mt-3 h-3 w-72 rounded bg-slate-200" />
          </div>
        </div>

        {/* Body skeletons */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-red-100 text-red-700">
            {/* warning icon */}
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            </svg>
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-red-800">Something went wrong</p>
            <p className="mt-1 break-words text-sm text-red-700">{error}</p>

            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="mt-4 inline-flex items-center justify-center rounded-xl bg-red-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-200"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
