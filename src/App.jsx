import { useState } from "react";
import WithoutMemo from "./examples/WithoutMemo";
import WithMemo from "./examples/WithMemo";

export default function App() {
  const [tab, setTab] = useState("without");

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: 16 }}>
      <h1>React Memo Lab</h1>
      <p style={{ marginTop: -10, opacity: 0.8 }}>
        Open the console to see render logs.
      </p>

      <div style={{ display: "flex", gap: 8, margin: "12px 0 20px" }}>
        <button
          onClick={() => setTab("without")}
          style={{ fontWeight: tab === "without" ? 700 : 400 }}
        >
          Without memoization
        </button>
        <button
          onClick={() => setTab("with")}
          style={{ fontWeight: tab === "with" ? 700 : 400 }}
        >
          With memoization
        </button>
      </div>

      {tab === "without" ? <WithoutMemo /> : <WithMemo />}
      <hr style={{ margin: "20px 0" }} />
      <small>
        Tip: Try clicking <em>Re-render parent (unrelated)</em> and watch the child.
      </small>
    </div>
  );
}
