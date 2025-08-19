// app/reports/WidgetClient.tsx (Client)
"use client";
import { useState, useMemo } from "react";

interface DataItem {
  id: string | number;
  name: string;
}

export default function WidgetClient({ initial }: { initial: DataItem[] }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(
    () =>
      initial.filter((row) =>
        row.name?.toLowerCase().includes(q.toLowerCase())
      ),
    [initial, q]
  );
  return (
    <>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="buscar..."
      />
      <ul>
        {filtered.map((r) => (
          <li key={r.id}>{r.name}</li>
        ))}
      </ul>
    </>
  );
}
