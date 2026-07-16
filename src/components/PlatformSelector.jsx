import React from 'react';
import { PLATFORM_CONFIG } from '../utils/validationStrategies';

export default function PlatformSelector({ selected, onSelect }) {
  return (
    <div className="channel-tabs" role="tablist" aria-label="Select platform">
      {Object.entries(PLATFORM_CONFIG).map(([key, cfg]) => (
        <button
          key={key}
          role="tab"
          aria-selected={selected === key}
          className={`channel-tab ${selected === key ? 'channel-tab--active' : ''}`}
          style={{ '--channel-color': cfg.color }}
          onClick={() => onSelect(key)}
        >
          <span className="channel-tab__dot" />
          {cfg.label}
        </button>
      ))}
    </div>
  );
}
