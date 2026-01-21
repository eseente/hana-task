export const qk = {
  users: () => ["users"] as const,
  user: (id: number) => ["users", id] as const,
  postsByUser: (userId: number) => ["posts", "byUser", userId] as const,
};
