// app/reports/page.tsx (Server)
import WidgetClient from "./WidgetClient";
import HeavyEditorLoader from "./HeavyEditorLoader";

export const revalidate = 300;

export default async function Page() {
  const res = await fetch(process.env.API_URL + "/reports", {
    next: { revalidate: 300 },
  });
  const summary = await res.json();

  return (
    <div className="grid gap-6">
      <WidgetClient initial={summary} />
      <HeavyEditorLoader />
    </div>
  );
}
