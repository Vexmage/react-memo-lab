import { useRef, useState } from "react";

function expensiveCalculation(items) {
  // Simulate heavy work
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

  // Keep a stable items reference to prove that even identical props won't stop re-renders by default
  const itemsRef = useRef([1, 2, 3]);
  const [unrelated, setUnrelated] = useState(0);
  const [bump, setBump] = useState(4);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button onClick={() => setUnrelated((n) => n + 1)}>
          Re-render parent (unrelated): {unrelated}
        </button>
        <button
          onClick={() => {
            const next = bump + 1;
            itemsRef.current = [...itemsRef.current, next]; // new array reference
            setBump(next); // trigger re-render so child receives updated items
          }}
        >
          Change child data (append {bump + 1})
        </button>
      </div>

      <ExpensiveChild
        items={itemsRef.current}
        // NEW function every render → different reference each time → child re-renders
        onPing={() => console.log("[NoMemo Child] ping")}
        label="Child (no memo)"
      />
    </div>
  );
}
