import { useEffect, useRef, useState } from "react";

/** Simple FPS meter using requestAnimationFrame */
export function PerfPanel() {
  const [fps, setFps] = useState(0);
  const frames = useRef(0);
  const last = useRef(performance.now());
  const accum = useRef(0);

  useEffect(() => {
    let raf;
    const tick = (now) => {
      frames.current += 1;
      const dt = now - last.current;
      last.current = now;
      accum.current += dt;

      // update every ~500ms for stability
      if (accum.current >= 500) {
        const fpsNow = (frames.current / accum.current) * 1000;
        setFps(Math.round(fpsNow));
        frames.current = 0;
        accum.current = 0;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div style={panelStyle}>
      <div style={{ fontWeight: 700 }}>Perf</div>
      <div>FPS: {fps}</div>
      <div style={{ fontSize: 12, opacity: 0.7 }}>
        (Higher is smoother; spam-click to compare tabs)
      </div>
    </div>
  );
}

const panelStyle = {
  position: "fixed",
  right: 16,
  bottom: 16,
  background: "rgba(0,0,0,0.75)",
  color: "white",
  padding: "10px 12px",
  borderRadius: 12,
  lineHeight: 1.2,
  fontFamily: "system-ui, sans-serif",
  zIndex: 9999,
};

/** Drop this inside any component to see how many times it rendered */
export function RenderBadge({ label }) {
  const renders = useRef(0);
  renders.current += 1;

  return (
    <div style={badgeStyle}>
      <div style={{ fontWeight: 600 }}>{label}</div>
      <div>renders: {renders.current}</div>
    </div>
  );
}

const badgeStyle = {
  display: "inline-flex",
  gap: 8,
  alignItems: "baseline",
  background: "#f1f5f9",
  border: "1px solid #e2e8f0",
  padding: "6px 10px",
  borderRadius: 8,
  fontSize: 12,
  color: "#0f172a",
};
