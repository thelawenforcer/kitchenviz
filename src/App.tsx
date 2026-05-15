import { Viewport } from "./rendering/Viewport";

export function App() {
  return (
    <div className="h-screen w-screen flex flex-col">
      <header className="h-10 border-b border-line bg-panel flex items-center px-4 text-sm">
        <span className="font-medium">kitchenviz</span>
        <span className="ml-2 text-neutral-500">— milestone 1: skeleton</span>
      </header>
      <main className="flex-1 relative">
        <Viewport />
      </main>
    </div>
  );
}
