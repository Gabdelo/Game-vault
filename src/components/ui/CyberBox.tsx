import type { ReactNode, CSSProperties } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CyberBoxProps {
  children: ReactNode;

  // ── Existing props (unchanged) ─────────────────────────────────────────────
  /** Label tag shown on the top border */
  label?: string;
  /** Hex accent color. Default: #00f5ff (cyan) */
  accentColor?: string;
  /** Background color. Default: #0d1420 */
  bgColor?: string;
  /** Diagonal cut on top-right and bottom-left corners */
  cutCorner?: boolean;
  /** Bracket markers at all four corners */
  cornerLines?: boolean;
  /** Animated horizontal scan line */
  scan?: boolean;
  /** Soft glow on border (intensifies on hover) */
  glow?: boolean;
  /** Inner padding override (default "20px") */
  padding?: string;
  className?: string;
  style?: CSSProperties;

  // ── NEW: additional text labels ────────────────────────────────────────────
  /** Small tag on the BOTTOM border (mirroring top label) */
  bottomLabel?: string;
  /** Tag on the RIGHT border, rendered vertically */
  rightLabel?: string;
  /** Inline STATUS badge: shows a pulsing dot + text (e.g. "ONLINE", "SECURE") */
  statusLabel?: string;
  /** Override status dot color. Defaults to accentColor */
  statusColor?: string;

  // ── NEW: decorative lines ──────────────────────────────────────────────────
  /** Horizontal rule with optional text divider inside the box */
  divider?: boolean;
  /** Text shown inside the divider line (e.g. "//  SYSTEM  //") */
  dividerText?: string;

  // ── NEW: data / HUD rows ───────────────────────────────────────────────────
  /**
   * Array of key/value pairs rendered as a compact HUD panel
   * above the children. e.g. [["ID", "USR-0042"], ["ACCESS", "LVL 3"]]
   */
  hudData?: [string, string][];

  // ── NEW: visual effects ────────────────────────────────────────────────────
  /** Subtle noise/grain texture overlay */
  noise?: boolean;
  /** Animated corner brackets (rotate pulse) instead of static */
  animatedCorners?: boolean;
  /** Dashed instead of solid border */
  dashedBorder?: boolean;
  /** Second scan line (offset) for a double-sweep effect */
  dualScan?: boolean;
}

// ─── Static styles ────────────────────────────────────────────────────────────

const CYBER_BOX_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@700&display=swap');

.cbox-root {
  position: relative;
  background: var(--cbox-bg, #0d1420);
  border: 1px solid color-mix(in srgb, var(--cbox-color, #00f5ff) 40%, transparent);
  color: #c8d8f0;
  transition: box-shadow 0.2s ease;

}

/* ── Variants ── */
.cbox-cut {
  clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px));
}

.cbox-dashed {
  border-style: dashed;
}

/* Corner bracket markers — static */
.cbox-corner-tl,
.cbox-corner-tr,
.cbox-corner-bl,
.cbox-corner-br {
  position: absolute;
  width: 14px; height: 14px;
  pointer-events: none;
}
.cbox-corner-tl { top: -1px;   left: -1px;  border-top:    2px solid var(--cbox-color,#00f5ff); border-left:   2px solid var(--cbox-color,#00f5ff); }
.cbox-corner-tr { top: -1px;   right: -1px; border-top:    2px solid var(--cbox-color,#00f5ff); border-right:  2px solid var(--cbox-color,#00f5ff); }
.cbox-corner-bl { bottom: -1px; left: -1px; border-bottom: 2px solid var(--cbox-color,#00f5ff); border-left:   2px solid var(--cbox-color,#00f5ff); }
.cbox-corner-br { bottom: -1px; right: -1px;border-bottom: 2px solid var(--cbox-color,#00f5ff); border-right:  2px solid var(--cbox-color,#00f5ff); }

/* Corner bracket markers — animated */
@keyframes cbox-corner-pulse {
  0%, 100% { opacity: 1;   transform: scale(1); }
  50%       { opacity: 0.4; transform: scale(1.25); }
}
.cbox-corner-anim .cbox-corner-tl,
.cbox-corner-anim .cbox-corner-tr,
.cbox-corner-anim .cbox-corner-bl,
.cbox-corner-anim .cbox-corner-br {
  animation: cbox-corner-pulse 2s ease-in-out infinite;
}
.cbox-corner-anim .cbox-corner-tr { animation-delay: 0.5s; }
.cbox-corner-anim .cbox-corner-bl { animation-delay: 1s;   }
.cbox-corner-anim .cbox-corner-br { animation-delay: 1.5s; }

/* Border labels — top */
.cbox-label {
  position: absolute;
  top: -1px; left: 16px;
  font-family: 'Share Tech Mono', monospace;
  font-size: 10px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--cbox-color, #00f5ff);
  background: var(--cbox-bg, #0d1420);
  padding: 0 6px;
  transform: translateY(-50%);
  pointer-events: none;
  white-space: nowrap;
}

/* Border labels — bottom */
.cbox-bottom-label {
  position: absolute;
  bottom: -1px; right: 16px;
  font-family: 'Share Tech Mono', monospace;
  font-size: 10px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--cbox-color, #00f5ff) 60%, transparent);
  background: var(--cbox-bg, #0d1420);
  padding: 0 6px;
  transform: translateY(50%);
  pointer-events: none;
  white-space: nowrap;
}

/* Border labels — right (vertical) */
.cbox-right-label {
  position: absolute;
  top: 50%; right: -1px;
  font-family: 'Share Tech Mono', monospace;
  font-size: 9px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--cbox-color, #00f5ff) 55%, transparent);
  background: var(--cbox-bg, #0d1420);
  padding: 4px 2px;
  transform: translateX(50%) translateY(-50%) rotate(90deg);
  pointer-events: none;
  white-space: nowrap;
}

/* Status badge */
.cbox-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  position: absolute;
  top: -1px; right: 16px;
  font-family: 'Share Tech Mono', monospace;
  font-size: 9px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--cbox-color, #00f5ff);
  background: var(--cbox-bg, #0d1420);
  padding: 0 8px;
  transform: translateY(-50%);
  pointer-events: none;
  white-space: nowrap;
}
.cbox-status-dot {
  width: 5px; height: 5px;
  border-radius: 50%;
  background: var(--cbox-status-color, var(--cbox-color, #00f5ff));
  flex-shrink: 0;
}
@keyframes cbox-blink {
  0%, 100% { opacity: 1;   box-shadow: 0 0 4px var(--cbox-status-color, var(--cbox-color, #00f5ff)); }
  50%       { opacity: 0.2; box-shadow: none; }
}
.cbox-status-dot { animation: cbox-blink 1.6s ease-in-out infinite; }

/* Scan line — single */
@keyframes cbox-scan {
  0%   { top: 0%;   opacity: 0; }
  8%   { opacity: 1; }
  92%  { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}
.cbox-scan-line {
  position: absolute;
  left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--cbox-color,#00f5ff) 60%, transparent), transparent);
  pointer-events: none;
  animation: cbox-scan 3s ease-in-out infinite;
  z-index: 10;
}

/* Scan line — second (dual) */
.cbox-scan-line-2 {
  position: absolute;
  left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--cbox-color,#00f5ff) 30%, transparent), transparent);
  pointer-events: none;
  animation: cbox-scan 3s ease-in-out infinite;
  animation-delay: 1.5s;
  z-index: 10;
}

/* Glow */
.cbox-glow {
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--cbox-color,#00f5ff) 15%, transparent),
    inset 0 0 20px color-mix(in srgb, var(--cbox-color,#00f5ff) 5%, transparent);
}
.cbox-glow:hover {
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--cbox-color,#00f5ff) 50%, transparent),
    0 0 18px color-mix(in srgb, var(--cbox-color,#00f5ff) 28%, transparent),
    inset 0 0 20px color-mix(in srgb, var(--cbox-color,#00f5ff) 8%, transparent);
}

/* Noise overlay */
@keyframes cbox-noise-shift {
  0%   { transform: translate(0, 0); }
  25%  { transform: translate(-1px, 1px); }
  50%  { transform: translate(1px, -1px); }
  75%  { transform: translate(-1px, -1px); }
  100% { transform: translate(0, 0); }
}
.cbox-noise::after {
  content: '';
  position: absolute;
  inset: -2px;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-size: 128px 128px;
  pointer-events: none;
  animation: cbox-noise-shift 0.15s steps(1) infinite;
  z-index: 0;
}

/* HUD data panel */
.cbox-hud {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1px;
  border-bottom: 1px solid color-mix(in srgb, var(--cbox-color,#00f5ff) 20%, transparent);
  margin-bottom: 12px;
  padding-bottom: 10px;
  font-family: 'Share Tech Mono', monospace;
}
.cbox-hud-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 6px 8px;
}
.cbox-hud-key {
  font-size: 8px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--cbox-color,#00f5ff) 50%, transparent);
}
.cbox-hud-val {
  font-size: 12px;
  letter-spacing: 1px;
  color: var(--cbox-color, #00f5ff);
  text-shadow: 0 0 6px color-mix(in srgb, var(--cbox-color,#00f5ff) 50%, transparent);
}

/* Divider */
.cbox-divider {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 14px 0;
  font-family: 'Share Tech Mono', monospace;
  font-size: 9px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--cbox-color,#00f5ff) 40%, transparent);
}
.cbox-divider::before,
.cbox-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: color-mix(in srgb, var(--cbox-color,#00f5ff) 25%, transparent);
}
`;

let boxStyleInjected = false;
function injectBoxStyles() {
  if (boxStyleInjected || typeof document === "undefined") return;
  const tag = document.createElement("style");
  tag.textContent = CYBER_BOX_CSS;
  document.head.appendChild(tag);
  boxStyleInjected = true;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CyberBox({
  children,
  // existing
  label,
  accentColor,
  bgColor,
  cutCorner     = false,
  cornerLines   = false,
  scan          = false,
  glow          = false,
  padding       = "20px",
  className     = "",
  style,
  // new
  bottomLabel,
  rightLabel,
  statusLabel,
  statusColor,
  divider       = false,
  dividerText,
  hudData,
  noise         = false,
  animatedCorners = false,
  dashedBorder  = false,
  dualScan      = false,
}: CyberBoxProps) {
  injectBoxStyles();

  const cssVars: CSSProperties = {
    ...(accentColor  ? { "--cbox-color":        accentColor  } as CSSProperties : {}),
    ...(bgColor      ? { "--cbox-bg":            bgColor      } as CSSProperties : {}),
    ...(statusColor  ? { "--cbox-status-color":  statusColor  } as CSSProperties : {}),
    padding,
    ...style,
  };

  const showCorners = cornerLines || animatedCorners;

  const classes = [
    "cbox-root",
    cutCorner       ? "cbox-cut"          : "",
    glow            ? "cbox-glow"         : "",
    noise           ? "cbox-noise"        : "",
    dashedBorder    ? "cbox-dashed"       : "",
    animatedCorners ? "cbox-corner-anim"  : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} style={cssVars}>

      {/* ── Corners ── */}
      {showCorners && (
        <>
          <span className="cbox-corner-tl" aria-hidden="true" />
          <span className="cbox-corner-tr" aria-hidden="true" />
          <span className="cbox-corner-bl" aria-hidden="true" />
          <span className="cbox-corner-br" aria-hidden="true" />
        </>
      )}

      {/* ── Scan lines ── */}
      {scan          && <span className="cbox-scan-line"   aria-hidden="true" />}
      {dualScan      && <span className="cbox-scan-line-2" aria-hidden="true" />}

      {/* ── Border labels ── */}
      {label        && <span className="cbox-label"        aria-hidden="true">{label}</span>}
      {bottomLabel  && <span className="cbox-bottom-label" aria-hidden="true">{bottomLabel}</span>}
      {rightLabel   && <span className="cbox-right-label"  aria-hidden="true">{rightLabel}</span>}

      {/* ── Status badge (top-right) ── */}
      {statusLabel && (
        <span className="cbox-status" aria-hidden="true">
          <span className="cbox-status-dot" />
          {statusLabel}
        </span>
      )}

      {/* ── HUD data rows ── */}
      {hudData && hudData.length > 0 && (
        <div className="cbox-hud" aria-hidden="true">
          {hudData.map(([k, v], i) => (
            <div key={i} className="cbox-hud-cell">
              <span className="cbox-hud-key">{k}</span>
              <span className="cbox-hud-val">{v}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── Content ── */}
      {children}

      {/* ── Inline divider (rendered after children if needed at bottom) ── */}
      {divider && (
        <div className="cbox-divider" aria-hidden="true">
          {dividerText ?? "// ──────── //"}
        </div>
      )}

    </div>
  );
}

export default CyberBox;
