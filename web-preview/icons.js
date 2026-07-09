// Minimal line-icon set (SF Symbols-like) — stroke-based, currentColor,
// so every icon inherits whatever text/accent color its container sets.

const ICON_PATHS = {
  home: `<path d="M3 11.5L12 4l9 7.5"/><path d="M5.5 10v9a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-9"/><path d="M9.5 20v-6h5v6"/>`,
  checklist: `<path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 6.5l1.2 1.2L7.5 5.3M4 12.5l1.2 1.2 2.3-2.4M4 18.5l1.2 1.2 2.3-2.4"/>`,
  chartBar: `<rect x="4" y="12" width="3.2" height="8" rx="0.6" fill="currentColor" stroke="none"/><rect x="10.4" y="7" width="3.2" height="13" rx="0.6" fill="currentColor" stroke="none"/><rect x="16.8" y="3" width="3.2" height="17" rx="0.6" fill="currentColor" stroke="none"/>`,
  person: `<circle cx="12" cy="8" r="4"/><path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7"/>`,
  target: `<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none"/>`,
  history: `<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5v5l3.5 2"/>`,
  settings: `<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="14" cy="7" r="2.2"/><circle cx="8" cy="17" r="2.2"/>`,
  flame: `<path d="M12 3c-1 3-4 4-4 8a4 4 0 0 0 8 0c0-1.5-1-2-1-3.5 1.5 1 2.5 3 2.5 5a5.5 5.5 0 0 1-11 0C6.5 8 9 6 12 3z" fill="currentColor" stroke="none"/>`,
  star: `<path d="M12 3l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.2-5.4 3.2 1.3-6-4.6-4.1 6.1-.6z" fill="currentColor" stroke="none"/>`,
  message: `<rect x="4" y="5" width="16" height="11" rx="2.5"/><path d="M8 16l-3 3v-3"/>`,
  book: `<path d="M12 6c-1.5-1.5-4-2-7-2v13c3 0 5.5.5 7 2 1.5-1.5 4-2 7-2V4c-3 0-5.5.5-7 2z"/>`,
  run: `<circle cx="14.5" cy="4.5" r="2" fill="currentColor" stroke="none"/><path d="M9.5 20l1.7-4.7 2-2-1-4 3 1 1.8 3 2.7-1"/><path d="M12.3 13l-3.6 2.3M13.9 15l3 1.8"/>`,
  dollar: `<circle cx="12" cy="12" r="9"/><path d="M12 6.5v11M15 9a3.3 3.3 0 0 0-3-1.5c-1.7 0-3 1-3 2.3 0 3 6 1.3 6 4.3 0 1.3-1.3 2.4-3 2.4a3.3 3.3 0 0 1-3-1.7"/>`,
  heart: `<path d="M12 20s-7-4.5-9.5-9C1 8 2 4.5 5.5 4c2-.3 3.7.7 4.5 2 .8-1.3 2.5-2.3 4.5-2 3.5.5 4.5 4 3 7-2.5 4.5-9.5 9-9.5 9z" fill="currentColor" stroke="none"/>`,
  brain: `<path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-1.5 5.6A3 3 0 0 0 7 17a3 3 0 0 0 5-2V6a2 2 0 0 0-3-2z"/><path d="M15 4a3 3 0 0 1 3 3 3 3 0 0 1 1.5 5.6A3 3 0 0 1 17 17a3 3 0 0 1-5-2V6a2 2 0 0 1 3-2z"/>`,
  palette: `<path d="M12 3a9 9 0 1 0 0 18c1.2 0 2-1 2-2 0-.6-.2-1-.5-1.4-.3-.4-.5-.8-.5-1.3 0-1 .8-1.8 1.8-1.8H17a4 4 0 0 0 4-4c0-4.4-4-7.5-9-7.5z"/><circle cx="7.5" cy="10.5" r="1.1" fill="currentColor" stroke="none"/><circle cx="9.5" cy="7" r="1.1" fill="currentColor" stroke="none"/><circle cx="14.5" cy="7" r="1.1" fill="currentColor" stroke="none"/><circle cx="16.5" cy="10.5" r="1.1" fill="currentColor" stroke="none"/>`,
  house: `<path d="M3 11.5L12 4l9 7.5"/><path d="M5.5 10v9a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-9"/><path d="M12 20v-5"/>`,
  trophy: `<path d="M7 4h10v5a5 5 0 0 1-10 0V4z"/><path d="M7 5H4a3 3 0 0 0 3 5M17 5h3a3 3 0 0 1-3 5"/><path d="M12 14v3M9.5 17h5l.5 3h-6z"/>`,
  chevronLeft: `<path d="M15 5l-7 7 7 7"/>`,
  plus: `<path d="M12 5v14M5 12h14"/>`,
  check: `<path d="M5 12l4 4 10-10"/>`,
  medal: `<circle cx="12" cy="14" r="6"/><path d="M9 3l3 5 3-5M9 3L6 9M15 3l3 6"/>`,
  lock: `<rect x="5.5" y="10.5" width="13" height="9" rx="2"/><path d="M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3"/>`,
  shield: `<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/>`,
};

function icon(name, size = 20) {
  const inner = ICON_PATHS[name] || "";
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
}
