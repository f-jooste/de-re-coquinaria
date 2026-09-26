import { useState } from 'react';

// Trivial hydrated island proving React + TypeScript actually run client-side.
export default function ToolchainCheck() {
  const [count, setCount] = useState(0);

  return (
    <button type="button" onClick={() => setCount((c) => c + 1)}>
      React island hydrated — clicked {count} time{count === 1 ? '' : 's'}
    </button>
  );
}
