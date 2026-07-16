import React from 'react';

// A dial modeled on a broadcast VU meter: the needle sweeps from green
// through amber into red as the post approaches the platform's limit.
export default function CharacterGauge({ used, limit, color }) {
  const ratio = Math.min(used / limit, 1.15); // allow slight overshoot visual
  const angle = -120 + ratio * 240; // sweep from -120deg to +120deg
  const overLimit = used > limit;

  const zoneColor = overLimit ? '#E5484D' : ratio > 0.85 ? '#E8A33D' : color;

  return (
    <div className="gauge">
      <svg viewBox="0 0 120 80" className="gauge__svg">
        <path d="M 10 70 A 50 50 0 0 1 110 70" className="gauge__track" />
        <path
          d="M 10 70 A 50 50 0 0 1 110 70"
          className="gauge__fill"
          style={{
            stroke: zoneColor,
            strokeDasharray: 157,
            strokeDashoffset: 157 - Math.min(ratio, 1) * 157
          }}
        />
        <g style={{ transform: `rotate(${angle}deg)`, transformOrigin: '60px 70px' }}>
          <line x1="60" y1="70" x2="60" y2="26" className="gauge__needle" />
        </g>
        <circle cx="60" cy="70" r="4" fill="#EDEFF3" />
      </svg>
      <div className="gauge__reading">
        <span className="gauge__count" style={{ color: zoneColor }}>
          {overLimit ? `+${used - limit}` : limit - used}
        </span>
        <span className="gauge__label">{overLimit ? 'over limit' : 'chars left'}</span>
      </div>
    </div>
  );
}
