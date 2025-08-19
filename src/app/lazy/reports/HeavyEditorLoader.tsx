// app/reports/HeavyEditorLoader.tsx (Client)
"use client";
import dynamic from "next/dynamic";

const HeavyEditor = dynamic(() => import("./HeavyEditor"), {
  ssr: false, // agora pode
  loading: () => <div>Carregando editor…</div>,
});

export default function HeavyEditorLoader() {
  return <HeavyEditor />;
}
