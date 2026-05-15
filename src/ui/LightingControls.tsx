import { useScene } from "@/scene/store";
import type { EnvironmentPreset } from "@/types";
import { Slider } from "./Slider";

const PRESETS: EnvironmentPreset[] = [
  "studio",
  "apartment",
  "sunset",
  "dawn",
  "warehouse",
  "city",
];

export function LightingControls() {
  const lighting = useScene((s) => s.scene.lighting);
  const setLighting = useScene((s) => s.setLighting);
  const setEnvironmentPreset = useScene((s) => s.setEnvironmentPreset);

  const [az, el] = lighting.sunAngle;

  return (
    <section className="space-y-3">
      <h3 className="text-[11px] uppercase tracking-wider text-neutral-500">Lighting</h3>

      <label className="block text-[11px] text-neutral-400">
        <span>Environment</span>
        <select
          value={lighting.environmentPreset}
          onChange={(e) => setEnvironmentPreset(e.target.value as EnvironmentPreset)}
          className="mt-1 w-full bg-panelMuted border border-line rounded px-2 py-1 text-sm text-neutral-100 focus:outline-none focus:border-accent capitalize"
        >
          {PRESETS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </label>

      <Slider
        label="environment intensity"
        min={0}
        max={2}
        step={0.05}
        value={Number(lighting.environmentIntensity.toFixed(2))}
        onChange={(v) => setLighting({ environmentIntensity: v })}
      />
      <Slider
        label="sun intensity"
        min={0}
        max={6}
        step={0.1}
        value={Number(lighting.sunIntensity.toFixed(2))}
        onChange={(v) => setLighting({ sunIntensity: v })}
      />
      <Slider
        label="sun azimuth"
        min={-180}
        max={180}
        step={5}
        value={Math.round((az * 180) / Math.PI)}
        onChange={(deg) =>
          setLighting({ sunAngle: [(deg * Math.PI) / 180, el] })
        }
        suffix="°"
      />
      <Slider
        label="sun elevation"
        min={5}
        max={89}
        step={1}
        value={Math.round((el * 180) / Math.PI)}
        onChange={(deg) =>
          setLighting({ sunAngle: [az, (deg * Math.PI) / 180] })
        }
        suffix="°"
      />
      <Slider
        label="ambient"
        min={0}
        max={1}
        step={0.02}
        value={Number(lighting.ambientIntensity.toFixed(2))}
        onChange={(v) => setLighting({ ambientIntensity: v })}
      />
    </section>
  );
}
