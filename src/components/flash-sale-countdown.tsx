import { useEffect, useState } from "react";

function endOfLocalDay(now = new Date()) {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
}

function remainingParts(target: Date) {
  const ms = Math.max(0, target.getTime() - Date.now());
  const totalSecs = Math.floor(ms / 1000);
  const hours = Math.floor(totalSecs / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;
  return {
    hours: String(hours).padStart(2, "0"),
    mins: String(mins).padStart(2, "0"),
    secs: String(secs).padStart(2, "0"),
    ended: ms <= 0,
  };
}

export function FlashSaleCountdown() {
  const [mounted, setMounted] = useState(false);
  const [parts, setParts] = useState({ hours: "00", mins: "00", secs: "00", ended: false });

  useEffect(() => {
    setMounted(true);
    const tick = () => setParts(remainingParts(endOfLocalDay()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const displayParts = mounted ? parts : { hours: "00", mins: "00", secs: "00", ended: false };

  if (displayParts.ended) {
    return (
      <p className="text-sm font-medium text-white/70 mb-8 tracking-wider uppercase">Sale ended</p>
    );
  }

  return (
    <div className="flex gap-3 mb-8">
      {(
        [
          [displayParts.hours, "HOURS"],
          [displayParts.mins, "MINS"],
          [displayParts.secs, "SECS"],
        ] as const
      ).map(([n, l]) => (
        <div
          key={l}
          className="bg-white/10 backdrop-blur rounded-xl px-5 py-3 text-center min-w-[80px]"
        >
          <div className="text-3xl font-black tabular-nums">{n}</div>
          <div className="text-[10px] tracking-widest opacity-60">{l}</div>
        </div>
      ))}
    </div>
  );
}
