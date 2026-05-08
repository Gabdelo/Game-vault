import type { ReactNode, CSSProperties } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize    = "sm" | "md" | "lg";
type IconColor     = "cyan" | "magenta" | "green";

export interface CyberButtonProps {
  children?: ReactNode;
  /** Visual style */
  variant?: ButtonVariant;
  /** sm / md / lg */
  size?: ButtonSize;
  /** Icon-only button with accent color */
  iconOnly?: IconColor;
  /** Override the accent color via CSS hex (e.g. "#ff00aa") */
  accentColor?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
  type?: "button" | "submit" | "reset";
}

// ─── Static styles (injected once) ───────────────────────────────────────────

const CYBER_BTN_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Rajdhani:wght@500;600&display=swap');

.cb-root {
  position: relative;
  font-family: 'Orbitron', monospace;
  text-transform: uppercase;
  letter-spacing: 2px;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  transition: all 0.2s ease;
  overflow: hidden;
  background: transparent;
  outline: none;
  text-decoration: none;
  white-space: nowrap;
}
.cb-root:disabled { opacity: 0.4; pointer-events: none; }

/* ── Sizes ── */
.cb-sm { font-size: 9px;  padding: 6px 14px 6px 10px;  letter-spacing: 1.5px; }
.cb-md { font-size: 11px; padding: 9px  20px 9px  16px; }
.cb-lg { font-size: 13px; padding: 13px 30px 13px 22px; letter-spacing: 2.5px; }

/* ── Clip paths ── */
.cb-sm { clip-path: polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%); }
.cb-md { clip-path: polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%); }
.cb-lg { clip-path: polygon(14px 0%,100% 0%,calc(100% - 14px) 100%,0% 100%); }

/* ── Primary ── */
.cb-primary {
  color: black;
  background: var(--cb-accent, #FBFF00);
  box-shadow: 0 0 12px color-mix(in srgb, var(--cb-accent, #00f5ff) 50%, transparent);
  font-weight: 900;
}
.cb-primary:hover {
  filter: brightness(1.2);
  box-shadow: 0 0 22px color-mix(in srgb, var(--cb-accent, #00f5ff) 70%, transparent);
  transform: translateY(-1px);
}
.cb-primary:active { transform: scale(0.97); }

/* ── Secondary ── */
.cb-secondary {
  color: black;
  background: #00ECFF;
  box-shadow: 0 0 12px color-mix(in srgb, #00ECFF 50%, transparent);
  font-weight: 900;
}
.cb-secondary:hover {
  filter: brightness(1.2);
  box-shadow: 0 0 22px color-mix(in srgb, #00ECFF 70%, transparent);
  transform: translateY(-1px);
}
.cb-secondary:active { transform: scale(0.97); }


/* ── Ghost ── */
.cb-ghost {
  color: black;
  border: 1px solid #1a2540;
  background: #00FFF7;
  clip-path: polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%);
  font-size: 11px; padding: 8px 18px;
}
.cb-ghost:hover { scale: 1.05; }

/* ── Icon-only ── */
.cb-icon {
  padding: 10px;
  border: 1px solid;
  clip-path: polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%);
  font-size: 16px;
}

.cb-icon-cyan     { border-color: #00f5ff; color: #00f5ff; }
.cb-icon-magenta  { border-color: #ff00aa; color: #ff00aa; }
.cb-icon-green    { border-color: #00ff88; color: #00ff88; }
`;

let styleInjected = false;
function injectStyles() {
  if (styleInjected || typeof document === "undefined") return;
  const tag = document.createElement("style");
  tag.textContent = CYBER_BTN_CSS;
  document.head.appendChild(tag);
  styleInjected = true;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CyberButton({
  children,
  variant   = "primary",
  size      = "md",
  iconOnly,
  accentColor,
  onClick,
  disabled  = false,
  className = "",
  style,
  type      = "button",
}: CyberButtonProps) {
  injectStyles();

  const cssVars = accentColor
    ? ({ "--cb-accent": accentColor } as CSSProperties)
    : {};

  if (iconOnly) {
    return (
      <button
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={`cb-root cb-icon cb-icon-${iconOnly} ${className}`}
        style={{ ...cssVars, ...style }}
      >
        {children}
      </button>
    );
  }

  if (variant === "secondary") {
    return (
      <button
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={`cb-root cb-secondary cb-${size} ${className}`}
        style={{ ...cssVars, ...style }}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`cb-root cb-${variant} cb-${size} ${className}`}
      style={{ ...cssVars, ...style }}
    >
      {children}
    </button>
  );
}

export default CyberButton;
