import { CatalogPanel } from "./ui/CatalogPanel";
import { InspectorPanel } from "./ui/InspectorPanel";
import { TopBar } from "./ui/TopBar";
import { Viewport } from "./rendering/Viewport";

export function App() {
  return (
    <div className="h-screen w-screen flex flex-col">
      <TopBar />
      <main className="flex-1 flex overflow-hidden">
        <CatalogPanel />
        <section className="flex-1 relative bg-[#0d0d0f]">
          <Viewport />
        </section>
        <InspectorPanel />
      </main>
    </div>
  );
}
