import { Link } from "react-router-dom";
import type { User } from "../types";
import { useFavorites } from "../context/favorites";

type Props = {
  user: User;
};

export default function UserCard({ user }: Props) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(user.id);

  const city = user.address?.city ?? "";
  const company = user.company?.name ?? "";

  return (
    <div
      className={[
        "group relative overflow-hidden rounded-2xl border bg-white shadow-sm transition",
        "hover:-translate-y-[1px] hover:shadow-md",
        "focus-within:ring-4 focus-within:ring-slate-100",
        fav ? "border-amber-200 ring-2 ring-amber-200/70" : "border-slate-200",
      ].join(" ")}
    >
      {/* Soft highlight header */}
      <div className={fav ? "bg-amber-50/60" : "bg-slate-50/60"}>
        <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              {/* Name */}
              <h3 className="truncate text-sm font-semibold text-slate-900">
                {user.name}
              </h3>
            </div>

            {/* Secondary line */}
            <p className="mt-1 truncate text-xs text-slate-600">{user.email}</p>
          </div>

          {/* Favorite button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(user.id);
            }}
            className={[
              "relative z-10 inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition",
              "focus:outline-none focus:ring-4",
              fav
                ? "border-amber-200 bg-amber-100 text-amber-900 hover:bg-amber-100/80 focus:ring-amber-100"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-100",
            ].join(" ")}
            aria-pressed={fav}
            aria-label={fav ? "Remove from favorites" : "Add to favorites"}
          >
            <span className={fav ? "text-amber-700" : "text-slate-500"} aria-hidden="true">
              {fav ? "★" : "☆"}
            </span>
            <span>{fav ? "Favorited" : "Favorite"}</span>
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 pb-4">
        <div className="flex flex-col gap-2">
          {/* Meta rows */}
          {company && (
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                {/* briefcase icon */}
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M10 6h4a2 2 0 0 1 2 2v2H8V8a2 2 0 0 1 2-2z" />
                  <path d="M4 10h16v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8z" />
                </svg>
              </span>
              <span className="min-w-0 truncate">
                <span className="font-medium text-slate-900">Company:</span>{" "}
                {company}
              </span>
            </div>
          )}

          {city && (
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                {/* pin icon */}
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M12 21s7-4.5 7-11a7 7 0 0 0-14 0c0 6.5 7 11 7 11z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
              </span>
              <span className="truncate">
                <span className="font-medium text-slate-900">City:</span> {city}
              </span>
            </div>
          )}

          {/* CTA row */}
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              View details & posts
            </span>

            <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-900">
              Open
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 text-slate-500 transition group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </span>
          </div>
        </div>
      </div>

      <Link
        to={`/users/${user.id}`}
        className="absolute inset-0"
        aria-label={`Open details for ${user.name}`}
      />
    </div>
  );
}
