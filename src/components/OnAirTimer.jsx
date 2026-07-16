import React, { useEffect, useState } from 'react';

// Theoretical Explanation §10 (Stale Closures, dependency array pitfalls,
// cleanup functions & memory leaks) walks through exactly this scenario:
// a setInterval inside useEffect. We apply both fixes it recommends:
//
//   1. Functional state update — setElapsed(prev => prev + 1) reads the
//      latest value from React's state queue instead of closing over a
//      stale variable from the render that registered the effect.
//   2. Cleanup function — clearInterval(id) on unmount, so navigating away
//      doesn't leave a dangling timer (a classic memory leak source).
//
// This component doubles as the app's "on-air" session clock.
export default function OnAirTimer() {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setElapsed((prev) => prev + 1); // functional update — avoids stale closure
    }, 1000);

    return () => clearInterval(id); // cleanup — prevents the memory leak
  }, []); // empty deps is safe here only because we used the functional updater

  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const ss = String(elapsed % 60).padStart(2, '0');

  return (
    <span className="on-air-timer" title="Time since this session started">
      {mm}:{ss}
    </span>
  );
}
