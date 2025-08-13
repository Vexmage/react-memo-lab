import { useRef, useState } from "react";
import { RenderBadge } from "../components/PerfPanel"; // ← add

function expensiveCalculation(items) {
  const start = performance.now();
  let junk = 0;
  for (let i = 0; i < 1_500_000; i++) junk += i % 7;
  const total = items.reduce((a, b) => a + b, 0);
  const ms = performance.now() - start;
  console.log(`[NoMemo Child] expensiveCalculation ~${ms.toFixed(1)}ms`);
  return { total, ms };
}

function ExpensiveChild({ items, onPing, label }) {
  console.count(`[NoMemo Child] render`);
  const { total, ms } = expensiveCalculation(items);

  return (
    <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
      <RenderBadge label="Child (no memo)" /> {/* ← add */}
      <div><strong>{label}</strong></div>
      <div>Items: [{items.join(", ")}]</div>
      <div>Total: {total}</div>
      <div style={{ opacity: 0.7, fontSize: 12 }}>calc ≈ {ms.toFixed(1)}ms</div>
      <button onClick={onPing} style={{ marginTop: 8 }}>Ping</button>
    </div>
  );
}

export default function WithoutMemo() {
  console.count("[NoMemo Parent] render");

  const itemsRef = useRef([1, 2, 3]);
  const [unrelated, setUnrelated] = useState(0);
  const [bump, setBump] = useState(4);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <RenderBadge label="Parent (no memo)" /> {/* ← add */}

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button onClick={() => setUnrelated((n) => n + 1)}>
          Re-render parent (unrelated): {unrelated}
        </button>
        <button
          onClick={() => {
            const next = bump + 1;
            itemsRef.current = [...itemsRef.current, next];
            setBump(next);
          }}
        >
          Change child data (append {bump + 1})
        </button>
      </div>

      <ExpensiveChild
        items={itemsRef.current}
        onPing={() => console.log("[NoMemo Child] ping")}
        label="Child (no memo)"
      />
    </div>
  );
}
