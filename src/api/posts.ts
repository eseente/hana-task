import { http } from "./http";
import type { Post } from "../types";

export const getPostsByUser = (userId: number, signal?: AbortSignal) =>
  http<Post[]>("/posts", { signal, query: { userId } });

export const createPost = (
  input: { userId: number; title: string; body: string },
  signal?: AbortSignal
) =>
  http<Post>("/posts", {
    signal,
    init: { method: "POST", body: JSON.stringify(input) },
  });
