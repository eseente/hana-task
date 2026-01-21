import { useEffect, useState } from "react";
import type { Post } from "../types";

const keyOf = (userId: number) => `posts.created.user.${userId}`;

export function loadStoredPosts(userId: number): Post[] {
  if (!Number.isFinite(userId) || userId <= 0) return [];
  try {
    const raw = localStorage.getItem(keyOf(userId));
    return raw ? (JSON.parse(raw) as Post[]) : [];
  } catch {
    return [];
  }
}

export function saveStoredPost(userId: number, post: Post) {
  if (!Number.isFinite(userId) || userId <= 0) return;
  const existing = loadStoredPosts(userId);

  if (existing.some((p) => p.id === post.id)) return;

  const next = [post, ...existing];
  try {
    localStorage.setItem(keyOf(userId), JSON.stringify(next));
  } catch {
  }
}

export function useStoredPosts(userId: number) {
  const [stored, setStored] = useState<Post[]>(() => loadStoredPosts(userId));

  useEffect(() => {
    setStored(loadStoredPosts(userId));
  }, [userId]);

  const refresh = () => setStored(loadStoredPosts(userId));

  return { storedPosts: stored, refreshStoredPosts: refresh };
}
