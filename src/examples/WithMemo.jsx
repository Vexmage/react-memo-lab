import { useCallback, useMemo, useRef, useState } from "react";
import React from "react";

function expensiveCalculation(items) {
  const start = performance.now();
  let junk = 0;
  for (let i = 0; i < 1_500_000; i++) junk += i % 7;
  const total = items.reduce((a, b) => a + b, 0);
  const ms = performance.now() - start;
  console.log(`[Memo Child] expensiveCalculation ~${ms.toFixed(1)}ms`);
  return { total, ms };
}

function ChildView({ items, onPing, label }) {
  console.count(`[Memo Child] render`);
  const { total, ms } = expensiveCalculation(items);

  return (
    <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
      <div><strong>{label}</strong></div>
      <div>Items: [{items.join(", ")}]</div>
      <div>Total: {total}</div>
      <div style={{ opacity: 0.7, fontSize: 12 }}>calc ≈ {ms.toFixed(1)}ms</div>
      <button onClick={onPing} style={{ marginTop: 8 }}>Ping</button>
    </div>
  );
}

// 1) React.memo short-circuits child renders if props are shallow-equal
const MemoChild = React.memo(ChildView);

export default function WithMemo() {
  console.count("[Memo Parent] render");

  const baseRef = useRef([1, 2, 3]);
  const [unrelated, setUnrelated] = useState(0);
  const [bump, setBump] = useState(4);

  // 2) Keep array reference stable unless the underlying data actually changes
  const items = useMemo(() => baseRef.current, [baseRef.current]);

  // 3) Keep function reference stable
  const onPing = useCallback(() => {
    console.log("[Memo Child] ping");
  }, []);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button onClick={() => setUnrelated((n) => n + 1)}>
          Re-render parent (unrelated): {unrelated}
        </button>
        <button
          onClick={() => {
            const next = bump + 1;
            // update the backing data AND its reference
            baseRef.current = [...baseRef.current, next];
            setBump(next); // trigger re-render
          }}
        >
          Change child data (append {bump + 1})
        </button>
      </div>

      <MemoChild items={items} onPing={onPing} label="Child (memoized)" />
    </div>
  );
}
