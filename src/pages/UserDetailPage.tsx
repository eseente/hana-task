import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { Post } from "../types";
import { StateView } from "../components/StateView";
import { useFavorites } from "../context/favorites";
import { useCreatePost, usePostsByUser, useUser } from "../api/hooks";
import { useStoredPosts } from "../hooks/useStoredPosts";

function errorMessage(err: unknown) {
  if (err instanceof Error) return err.message;
  return err ? String(err) : "Unknown error";
}

export default function UserDetailPage() {
  const params = useParams();
  const userId = useMemo(() => Number(params.id), [params.id]);

  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = Number.isFinite(userId) && userId > 0 ? isFavorite(userId) : false;

  const userQuery = useUser(userId);
  const postsQuery = usePostsByUser(userId);

  const { storedPosts } = useStoredPosts(userId);

  const createPostMutation = useCreatePost(userId);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const loading = userQuery.isLoading || postsQuery.isLoading;
  const error =
    userQuery.error
      ? errorMessage(userQuery.error)
      : postsQuery.error
      ? errorMessage(postsQuery.error)
      : !Number.isFinite(userId) || userId <= 0
      ? "Invalid user id"
      : null;

  const user = userQuery.data ?? null;
  const apiPosts: Post[] = postsQuery.data ?? [];

  const posts: Post[] = useMemo(() => {
    const seen = new Set<number>();
    const merged: Post[] = [];

    for (const p of storedPosts) {
      if (!seen.has(p.id)) {
        seen.add(p.id);
        merged.push(p);
      }
    }

    for (const p of apiPosts) {
      if (!seen.has(p.id)) {
        seen.add(p.id);
        merged.push(p);
      }
    }

    return merged;
  }, [storedPosts, apiPosts]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    const t = title.trim();
    const b = body.trim();
    if (!t || !b) {
      setSubmitError("Title and content are required.");
      return;
    }

    try {
      await createPostMutation.mutateAsync({ title: t, body: b });
      setTitle("");
      setBody("");
    } catch (err: unknown) {
      setSubmitError(errorMessage(err));
    }
  }

  const postsCount = posts.length;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Sticky top bar */}
        <div className="sticky top-0 z-10 -mx-4 mb-4 bg-slate-50/80 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="flex items-center justify-between gap-3">
            <Link
              to="/users"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <span aria-hidden="true">←</span>
              Back
            </Link>

            <div className="flex items-center">
              <button
                type="button"
                onClick={() => Number.isFinite(userId) && userId > 0 && toggleFavorite(userId)}
                className={[
                  "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium shadow-sm transition",
                  fav
                    ? "border-amber-200 bg-amber-100 text-amber-900 hover:bg-amber-100/80"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                ].join(" ")}
                disabled={!Number.isFinite(userId) || userId <= 0}
                aria-pressed={fav}
              >
                <span aria-hidden="true" className={fav ? "text-amber-700" : "text-slate-500"}>
                  {fav ? "★" : "☆"}
                </span>
                {fav ? "Favorited" : "Favorite"}
              </button>
            </div>
          </div>
        </div>

        <StateView loading={loading} error={error}>
          {/* Author card */}
          {user && (
            <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <h1 className="truncate text-xl sm:text-2xl font-semibold tracking-tight text-slate-900">
                    {user.name}
                  </h1>
                  <p className="mt-1 text-sm text-slate-600">
                    {user.email} <span className="text-slate-400">•</span> @{user.username}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
                      City: <span className="ml-1 text-slate-900">{user.address.city}</span>
                    </span>
                    <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
                      Company: <span className="ml-1 text-slate-900">{user.company.name}</span>
                    </span>
                  </div>
                </div>

                <div className="grid w-full grid-cols-1 gap-2 text-sm text-slate-700 sm:grid-cols-2 lg:w-[420px]">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="text-xs font-medium text-slate-500">Address</div>
                    <div className="mt-1 text-sm text-slate-900">
                      {user.address.street} {user.address.suite}
                      <div className="text-slate-600">{user.address.city}</div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="text-xs font-medium text-slate-500">Contact</div>
                    <div className="mt-1 text-sm text-slate-900">
                      {user.phone}
                      <div className="text-slate-600">{user.website}</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Main layout */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* New Post (sticky on desktop) */}
            <aside className="lg:col-span-1">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-slate-900">New Post</h2>
                </div>

                {submitError && (
                  <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {submitError}
                  </div>
                )}

                <form onSubmit={onSubmit} className="mt-4 space-y-3">
                  <div>
                    <label htmlFor="post-title" className="text-sm font-medium text-slate-700">
                      Title
                    </label>
                    <input
                      id="post-title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                      placeholder="e.g. Weekly update"
                    />
                  </div>

                  <div>
                    <label htmlFor="post-body" className="text-sm font-medium text-slate-700">
                      Content
                    </label>
                    <textarea
                      id="post-body"
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      className="mt-1 w-full min-h-28 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                      placeholder="Write something..."
                    />
                  </div>

                  <button
                    disabled={createPostMutation.isPending}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-indigo-800 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-900 disabled:opacity-60"
                    type="submit"
                  >
                    {createPostMutation.isPending ? "Saving..." : "Add Post"}
                  </button>

                </form>
              </div>
            </aside>

            {/* Posts */}
            <section className="lg:col-span-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-900">Posts</h2>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
                      Total: <span className="ml-1 text-slate-900">{postsCount}</span>
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {posts.map((p) => {
                    return (
                      <article
                        key={p.id}
                        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
                      >
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <h3 className="text-sm font-semibold text-slate-900">
                            {p.title}
                          </h3>
                        </div>

                        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-700">
                          {p.body}
                        </p>
                      </article>
                    );
                  })}

                  {posts.length === 0 && (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
                      <div className="text-sm font-semibold text-slate-900">No posts found</div>
                      <div className="mt-1 text-sm text-slate-600">
                        Create a new post using the form.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        </StateView>
      </div>
    </div>
  );
}
