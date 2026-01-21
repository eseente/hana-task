import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Post } from "../types";
import { qk } from "./queryKeys";
import { getUser, getUsers } from "./users";
import { createPost, getPostsByUser } from "./posts";
import { saveStoredPost } from "../hooks/useStoredPosts";


export function useUsers() {
  return useQuery({
    queryKey: qk.users(),
    queryFn: ({ signal }) => getUsers(signal),
  });
}

export function useUser(id: number) {
  return useQuery({
    queryKey: qk.user(id),
    queryFn: ({ signal }) => getUser(id, signal),
    enabled: Number.isFinite(id) && id > 0,
  });
}

export function usePostsByUser(userId: number) {
  return useQuery({
    queryKey: qk.postsByUser(userId),
    queryFn: ({ signal }) => getPostsByUser(userId, signal),
    enabled: Number.isFinite(userId) && userId > 0,
  });
}

export function useCreatePost(userId: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (input: { title: string; body: string }) =>
      createPost({ userId, title: input.title, body: input.body }),

    onMutate: async (input) => {
      if (!Number.isFinite(userId) || userId <= 0) {
        return { prev: qc.getQueryData<Post[]>(qk.postsByUser(userId)) ?? [] };
      }

      await qc.cancelQueries({ queryKey: qk.postsByUser(userId) });

      const prev = qc.getQueryData<Post[]>(qk.postsByUser(userId)) ?? [];

      const maxId = prev.reduce((m, p) => Math.max(m, p.id), 0);
      const optimistic: Post = {
        userId,
        id: maxId + 1,
        title: input.title,
        body: input.body,
      };

      qc.setQueryData<Post[]>(qk.postsByUser(userId), [optimistic, ...prev]);
      
      saveStoredPost(userId, optimistic);
      
      return { prev };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData<Post[]>(qk.postsByUser(userId), ctx.prev);
    },

    onSuccess: (_serverPost) => {
    },

    onSettled: () => {
      // qc.invalidateQueries({ queryKey: qk.postsByUser(userId) });
    },
  });
}
