"use client";

import React, { useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

function UsersInner() {
  const qc = useQueryClient();

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: () => fetch("http://localhost:3001/users").then((r) => r.json()),
    staleTime: 30_000, // refresh every 30 seconds
    refetchOnWindowFocus: false, // do not refetch on window focus
    select: (data) => data.slice(0, 10), // select first 10 users
  });

  const createUser = useMutation({
    mutationFn: async (payload: { name: string }) => {
      const res = await fetch("http://localhost:3001/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("create failed");
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
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
      <button onClick={() => createUser.mutate({ name: "New" })}>Add</button>
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
