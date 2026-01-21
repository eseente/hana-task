import { http } from "./http";
import type { User } from "../types";

export const getUsers = (signal?: AbortSignal) =>
  http<User[]>("/users", { signal });

export const getUser = (id: number, signal?: AbortSignal) =>
  http<User>(`/users/${id}`, { signal });
