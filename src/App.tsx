import { CatalogPanel } from "./ui/CatalogPanel";
import { InspectorPanel } from "./ui/InspectorPanel";
import { RenderOverlay } from "./ui/RenderOverlay";
import { ShortcutHints } from "./ui/ShortcutHints";
import { TopBar } from "./ui/TopBar";
import { useKeyboardShortcuts } from "./ui/useKeyboardShortcuts";
import { Viewport } from "./rendering/Viewport";

export function App() {
  useKeyboardShortcuts();

  return (
    <div className="h-screen w-screen flex flex-col">
      <TopBar />
      <main className="flex-1 flex overflow-hidden">
        <CatalogPanel />
        <section className="flex-1 relative bg-[#0d0d0f]">
          <Viewport />
          <ShortcutHints />
          <RenderOverlay />
        </section>
        <InspectorPanel />
      </main>
    </div>
  );
}
