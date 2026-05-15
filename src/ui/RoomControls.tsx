import { useScene } from "@/scene/store";
import { Slider } from "./Slider";

export function RoomControls() {
  const room = useScene((s) => s.scene.room);
  const setRoom = useScene((s) => s.setRoom);

  return (
    <section className="space-y-3">
      <h3 className="text-[11px] uppercase tracking-wider text-neutral-500">Room (mm)</h3>
      <Slider
        label="width"
        min={2000}
        max={8000}
        step={100}
        value={room.size.width}
        onChange={(v) => setRoom({ size: { ...room.size, width: v } })}
        suffix="mm"
      />
      <Slider
        label="depth"
        min={2000}
        max={8000}
        step={100}
        value={room.size.depth}
        onChange={(v) => setRoom({ size: { ...room.size, depth: v } })}
        suffix="mm"
      />
      <Slider
        label="height"
        min={2200}
        max={3500}
        step={50}
        value={room.size.height}
        onChange={(v) => setRoom({ size: { ...room.size, height: v } })}
        suffix="mm"
      />
    </section>
  );
}
