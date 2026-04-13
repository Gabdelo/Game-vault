import { useState, useRef, useEffect } from "react"

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

  .gs-wrap {
    position: relative;
    width: 100%;
    max-width: 480px;
    font-family: 'Share Tech Mono', monospace;
  }

  /* ── Track line (bottom border) ── */
  .gs-track {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 1px;
    background: rgba(255,0,56,0.18);
    transition: background 0.3s;
  }

  .gs-track::after {
    content: '';
    position: absolute;
    bottom: 0; left: 50%;
    width: 0; height: 1px;
    background: #00f0ff;
    transition: width 0.35s ease, left 0.35s ease;
  }

  .gs-wrap:focus-within .gs-track::after {
    left: 0;
    width: 100%;
  }

  /* ── Corner marks ── */
  .gs-corner {
    position: absolute;
    width: 6px; height: 6px;
    transition: opacity 0.3s, transform 0.3s;
    opacity: 0;
  }

  .gs-wrap:focus-within .gs-corner { opacity: 1; }

  .gs-corner--tl {
    top: 0; left: 0;
    border-top: 1px solid #00f0ff;
    border-left: 1px solid #00f0ff;
    transform: translate(3px, 3px);
  }
  .gs-corner--tr {
    top: 0; right: 0;
    border-top: 1px solid #00f0ff;
    border-right: 1px solid #00f0ff;
    transform: translate(-3px, 3px);
  }
  .gs-wrap:focus-within .gs-corner--tl { transform: translate(0, 0); }
  .gs-wrap:focus-within .gs-corner--tr { transform: translate(0, 0); }

  /* ── Input ── */
  .gs-field {
    position: relative;
    display: flex;
    align-items: center;
    gap: 12px;
    background: transparent;
    padding: 14px 16px 14px 0;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }

  .gs-icon {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    transition: color 0.3s;
    color: rgba(232,232,240,0.3);
  }

  .gs-wrap:focus-within .gs-icon { color: #00f0ff; }

  .gs-icon svg { width: 15px; height: 15px; }

  .gs-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: rgba(255,255,0.4);
    font-family: 'Share Tech Mono', monospace;
    font-size: 14px;
    letter-spacing: 1.5px;
    caret-color: #00f0ff;
    padding: 0;
  }

  .gs-input::placeholder {
    color: rgba(255, 255, 0, 0.8);
    letter-spacing: 2px;
    font-size: 12px;
  }

  /* ── Shortcut hint ── */
  .gs-hint {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
    transition: opacity 0.3s;
    opacity: 1;
  }

  .gs-wrap:focus-within .gs-hint { opacity: 0; }

  .gs-kbd {
    
    font-size: 9px;
    letter-spacing: 1px;
    color: rgba(255,255,0.4);
    border: 1px solid rgba(255,0,54,0.2);
    padding: 2px 5px;
    clip-path: polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 0 100%);
  }

  /* ── Clear button ── */
  .gs-clear {
    display: flex;
    align-items: center;
    background: none;
    border: none;
    cursor: pointer;
    padding: 2px;
    color: rgba(255,255,0.4);
    transition: color 0.2s, opacity 0.2s;
    opacity: 0;
    pointer-events: none;
    flex-shrink: 0;
  }

  .gs-clear.visible {
    opacity: 1;
    pointer-events: auto;
  }

  .gs-clear:hover { color: #00f0ff; }
  .gs-clear svg { width: 13px; height: 13px; }

  /* ── Status line ── */
  .gs-status {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 8px;
    height: 14px;
  }

  .gs-status-text {
    font-size: 9px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: rgba(255,255,0.4);
    transition: opacity 0.2s;
    opacity: 0;
  }

  .gs-wrap:focus-within .gs-status-text { opacity: 1; }

  .gs-count {
    font-size: 9px;
    letter-spacing: 2px;
    color: color: rgba(255,255,0.4);
    transition: opacity 0.2s;
    opacity: 0;
  }

  .gs-count.visible { opacity: 1; }

  /* ── Cursor blink ── */
  @keyframes gs-blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  .gs-cursor {
    display: inline-block;
    width: 7px; height: 14px;
    background: #00f0ff;
    margin-left: 2px;
    vertical-align: middle;
    animation: gs-blink 1.1s step-end infinite;
    opacity: 0;
    transition: opacity 0.2s;
    flex-shrink: 0;
  }

  .gs-wrap:focus-within .gs-cursor { opacity: 1; }
`

type GameSearchProps = {
  value?: string
  onChange?: (value: string) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  placeholder?: string
  resultCount?: number
  statusLabel?: string
}

export function GameSearch({
  value: controlled,
  onChange,
  onKeyDown,
  placeholder = "SEARCH TITLES...",
  resultCount,
  statusLabel = "QUERYING DATABASE",
}: GameSearchProps) {
  const [internal, setInternal] = useState("")
  const isControlled = controlled !== undefined
  const value = isControlled ? controlled : internal
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (v: string) => {
    if (!isControlled) setInternal(v)
    onChange?.(v)
  }

  // Focus on "/" keypress globally
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  return (
    <>
      <style>{styles}</style>
      <div className="gs-wrap">

        {/* Corner accents */}
        <div className="gs-corner gs-corner--tl" />
        <div className="gs-corner gs-corner--tr" />

        {/* Input row */}
        <div className="gs-field">
          <span className="gs-icon">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="6.5" cy="6.5" r="4.5" />
              <line x1="10" y1="10" x2="14" y2="14" strokeLinecap="square" />
            </svg>
          </span>

          <input
            ref={inputRef}
            className="gs-input"
            type="text"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            autoComplete="off"
            spellCheck={false}
          />

          {/* Blinking cursor (decorative, hidden when typing) */}
          {value.length === 0 && <span className="gs-cursor" />}

          {/* Keyboard shortcut hint */}
          <div className="gs-hint">
            <span className="gs-kbd">/</span>
          </div>

          {/* Clear */}
          <button
            className={`gs-clear${value.length > 0 ? " visible" : ""}`}
            onClick={() => handleChange("")}
            tabIndex={-1}
            aria-label="Clear search"
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="4" y1="4" x2="12" y2="12" strokeLinecap="square" />
              <line x1="12" y1="4" x2="4" y2="12" strokeLinecap="square" />
            </svg>
          </button>
        </div>

        {/* Animated bottom track */}
        <div className="gs-track" />

        {/* Status row */}
        <div className="gs-status">
          <span className="gs-status-text">{statusLabel}</span>
          {resultCount !== undefined && (
            <span className={`gs-count${value.length > 0 ? " visible" : ""}`}>
              {resultCount} RESULTS
            </span>
          )}
        </div>

      </div>
    </>
  )
}

// ── Usage example ──────────────────────────────────────────────────
// import { GameSearch } from "./components/GameSearch"
//
// const [query, setQuery] = useState("")
//
// <GameSearch
//   value={query}
//   onChange={setQuery}
//   onKeyDown={handleKeyDown}
//   resultCount={filteredGames.length}
// />
