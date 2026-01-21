import { useMemo, useState, useDeferredValue } from "react";
import UserCard from "../components/UserCard";
import { StateView } from "../components/StateView";
import { useFavorites } from "../context/favorites";
import { useUsers } from "../api/hooks";
import type { User } from "../types";

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

function errorMessage(err: unknown) {
  if (err instanceof Error) return err.message;
  return err ? String(err) : null;
}

type UsersFilter = "all" | "favorites";

function sortByFavoriteFirst(users: User[], favoriteIds: Set<number>) {
  return [...users].sort((a, b) => {
    const af = favoriteIds.has(a.id) ? 1 : 0;
    const bf = favoriteIds.has(b.id) ? 1 : 0;
    if (af !== bf) return bf - af;
    return a.name.localeCompare(b.name);
  });
}

function filterUsers(users: User[], query: string, mode: UsersFilter, favoriteIds: Set<number>) {
  const q = normalizeText(query);

  let out = users;

  if (mode === "favorites") {
    out = out.filter((u) => favoriteIds.has(u.id));
  }

  if (q) {
    out = out.filter((u) => normalizeText(u.name).includes(q));
  }

  return out;
}

export default function UsersPage() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [mode, setMode] = useState<UsersFilter>("all");

  const { favoriteIds } = useFavorites();
  const { data: users = [], isLoading, error, refetch } = useUsers();

  const totalCount = users.length;
  const favoritesCount = favoriteIds.size;

  const visibleUsers = useMemo(() => {
    const filtered = filterUsers(users, deferredQuery, mode, favoriteIds);
    return sortByFavoriteFirst(filtered, favoriteIds);
  }, [users, deferredQuery, mode, favoriteIds]);

  const visibleCount = visibleUsers.length;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Page Header */}
        <header className="mb-5">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="p-5 sm:p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                {/* Title + Subtitle */}
                <div className="min-w-0">
                  <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900">
                    Author Management
                  </h1>
                  <p className="mt-1 text-sm text-slate-600">
                    Browse authors, mark favorites and open details to view/add posts.
                  </p>

                  {/* KPI chips */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
                      <span className="h-2 w-2 rounded-full bg-slate-400" />
                      Total: <span className="text-slate-900">{totalCount}</span>
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800">
                      <span className="h-2 w-2 rounded-full bg-amber-500" />
                      Favorites: <span className="text-amber-900">{favoritesCount}</span>
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      Showing: <span className="text-emerald-900">{visibleCount}</span>
                    </span>
                  </div>
                </div>

                {/* Toolbar */}
                <div className="flex w-full flex-col gap-3 lg:w-[420px]">
                  {/* Search */}
                  <div className="relative">
                    <label htmlFor="author-search" className="sr-only">
                      Search authors by name
                    </label>

                    <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                      {/* search icon */}
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <path d="M21 21l-4.3-4.3" />
                        <circle cx="11" cy="11" r="7" />
                      </svg>
                    </div>

                    <input
                      id="author-search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search by author name…"
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-20 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                    />

                    {query.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setQuery("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
                        aria-label="Clear search"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Filter segmented control */}
                  <div className="grid grid-cols-2 rounded-xl bg-white p-1 gap-4">
                    <button
                      type="button"
                      onClick={() => setMode("all")}
                      aria-pressed={mode === "all"}
                      className={`rounded-lg border border-slate-200 shadow-sm px-3 py-2 text-sm font-medium transition ${
                        mode === "all"
                          ? "bg-indigo-800 text-white shadow"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      All
                    </button>

                    <button
                      type="button"
                      onClick={() => setMode("favorites")}
                      aria-pressed={mode === "favorites"}
                      className={`rounded-lg border border-slate-200 shadow-sm px-3 py-2 text-sm font-medium transition ${
                        mode === "favorites"
                          ? "bg-amber-500 text-white shadow"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      Favorites
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <StateView loading={isLoading} error={errorMessage(error)} onRetry={() => refetch()}>
          {visibleUsers.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M21 21l-4.3-4.3" />
                  <circle cx="11" cy="11" r="7" />
                </svg>
              </div>
              <h2 className="text-sm font-semibold text-slate-900">No authors found</h2>
              <p className="mt-1 text-sm text-slate-600">
                Try adjusting your search or switching the filter.
              </p>
              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setMode("all");
                  }}
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
                >
                  Reset filters
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visibleUsers.map((u) => (
                <UserCard key={u.id} user={u} />
              ))}
            </div>
          )}
        </StateView>
      </div>
    </div>
  );
}
