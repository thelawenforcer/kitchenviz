import { useRef, useState } from "react";
import { useScene } from "@/scene/store";
import { downloadScene, readSceneFromFile } from "@/scene/serialize";
import { useRenderTrigger } from "./renderMode";

export function TopBar() {
  const [filename, setFilename] = useState("kitchen.json");
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scene = useScene((s) => s.scene);
  const loadScene = useScene((s) => s.loadScene);
  const resetScene = useScene((s) => s.resetScene);
  const triggerRender = useRenderTrigger();

  const handleSave = () => downloadScene(scene, filename);
  const handleSaveAs = () => {
    const name = window.prompt("Save as:", filename);
    if (!name) return;
    const finalName = name.endsWith(".json") ? name : `${name}.json`;
    setFilename(finalName);
    downloadScene(scene, finalName);
  };
  const handleNew = () => {
    if (!window.confirm("Discard the current scene and start a new one?")) return;
    resetScene();
  };

  const handleFile = async (file: File) => {
    setError(null);
    try {
      const next = await readSceneFromFile(file);
      loadScene(next);
      setFilename(file.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load file");
    }
  };

  return (
    <header className="h-11 shrink-0 border-b border-line bg-panel flex items-center px-3 gap-2 text-sm">
      <span className="font-medium tracking-tight">kitchenviz</span>
      <span className="text-neutral-500 text-xs hidden md:inline">— mvp build</span>

      <div className="ml-4 flex items-center gap-1">
        <Btn onClick={handleNew}>New</Btn>
        <Btn onClick={() => fileInputRef.current?.click()}>Open…</Btn>
        <Btn onClick={handleSave}>Save</Btn>
        <Btn onClick={handleSaveAs}>Save as…</Btn>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void handleFile(f);
            e.target.value = "";
          }}
        />
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "copy";
        }}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files[0];
          if (f) void handleFile(f);
        }}
        className="ml-3 px-2 py-1 text-[11px] text-neutral-500 border border-dashed border-line rounded hover:border-accent hover:text-neutral-300 transition-colors"
      >
        drop .json here
      </div>

      <span className="ml-auto" />

      {error && (
        <span className="text-xs text-red-400 mr-2 truncate max-w-xs" title={error}>
          {error}
        </span>
      )}

      <Btn onClick={triggerRender} variant="primary">
        Render
      </Btn>
    </header>
  );
}

function Btn({
  children,
  onClick,
  variant = "default",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "primary";
}) {
  const base = "px-2.5 py-1 text-xs rounded border transition-colors";
  const styles =
    variant === "primary"
      ? "bg-accent/20 border-accent/60 text-white hover:bg-accent/40"
      : "bg-panelMuted border-line text-neutral-200 hover:bg-line";
  return (
    <button type="button" onClick={onClick} className={`${base} ${styles}`}>
      {children}
    </button>
  );
}
