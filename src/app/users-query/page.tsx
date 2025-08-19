"use client";

import React, { useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

type User = { id: number | string; name: string };

function UsersInner() {
  const qc = useQueryClient();

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: () => fetch("http://localhost:3001/users").then((r) => r.json()),
    staleTime: 30_000, // refresh every 30 seconds
    refetchOnWindowFocus: false, // do not refetch on window focus
    // select: (data) => data.slice(0, 10), // select first 10 users
  });

  const createUser = useMutation<
    User,
    Error,
    { name: string },
    { previous?: User[] }
  >({
    mutationFn: async (payload: { name: string }) => {
      const res = await fetch("http://localhost:3001/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("create failed");
      return res.json() as Promise<User>;
    },
    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey: ["users"] });
      const previous = qc.getQueryData<User[]>(["users"]);
      // adiciona um “fantasma”
      qc.setQueryData<User[]>(["users"], (old) => [
        { id: "tmp-" + Date.now(), name: payload.name },
        ...(old ?? []),
      ]);
      return { previous };
    },
    onSuccess: (created: User) => {
      qc.setQueryData<User[]>(["users"], (old) => [created, ...(old ?? [])]);
    },
    onError: (_err, _vars, ctx) => {
      // desfaz caso falhe
      if (ctx?.previous) qc.setQueryData(["users"], ctx.previous);
    },
    onSettled: () => {
      // garante dados reais do servidor
      qc.invalidateQueries({ queryKey: ["users"] });
    },
  });

  if (usersQuery.isPending) return <p>carregando…</p>;
  if (usersQuery.isError) return <p>erro</p>;

  return (
    <>
      <ul>
        {usersQuery.data.map((u: { id: number; name: string }) => (
          <li key={u.id}>{u.name}</li>
        ))}
      </ul>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => createUser.mutate({ name: "New" })}
        disabled={createUser.isPending}
      >
        {createUser.isPending ? "Adicionando..." : "Add"}
      </button>
      {createUser.isError && <p>Erro ao criar</p>}
    </>
  );
}

export default function UsersClient() {
  const [client] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={client}>
      <UsersInner />
    </QueryClientProvider>
  );
}
