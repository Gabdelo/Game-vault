import type { ReactNode, CSSProperties } from "react";
import { createContext, useState, useCallback, useContext } from "react";
// ─── Types ────────────────────────────────────────────────────────────────────

export type ToastVariant = "success" | "error" | "info" | "warning";

export interface ToastOptions {
  /** Visual variant — controls icon + accent color */
  variant?: ToastVariant;
  /** Override the accent color entirely */
  accentColor?: string;
  /** Toast title (small caps above message) */
  title?: string;
  /** Main message text */
  message: string;
  /** Auto-dismiss duration in ms. Default: 3500. Set 0 to disable. */
  duration?: number;
}

export interface ConfirmOptions {
  /** Toast title */
  title?: string;
  /** Question shown to the user */
  message: string;
  /** Label for the confirm button. Default: "Confirmar" */
  confirmLabel?: string;
  /** Label for the cancel button. Default: "Cancelar" */
  cancelLabel?: string;
  /** Accent color for the danger button. Default: #ff2244 */
  accentColor?: string;
  /** Callback fired when user clicks confirm */
  onConfirm?: () => void;
  /** Callback fired when user clicks cancel */
  onCancel?: () => void;
}

interface ToastItem {
  id: string;
  type: "toast" | "confirm";
  options: ToastOptions | ConfirmOptions;
  removing: boolean;
}

interface ToastContextValue {
  toast: (opts: ToastOptions) => void;
  confirm: (opts: ConfirmOptions) => void;
}

// ─── Static styles ────────────────────────────────────────────────────────────

const TOAST_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700&family=Rajdhani:wght@400;500&family=Share+Tech+Mono&display=swap');

.ct-portal {
  position: fixed;
  top: 20px; right: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 9999;
  width: 320px;
  pointer-events: none;
}

.ct-toast {
  pointer-events: all;
  background: #0d1420;
  border: 1px solid color-mix(in srgb, var(--ct-color, #00f5ff) 50%, transparent);
  font-family: 'Rajdhani', sans-serif;
  font-size: 14px;
  padding: 12px 14px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%);
  animation: ct-in 0.25s cubic-bezier(.16,1,.3,1) forwards;
}
.ct-toast.ct-removing {
  animation: ct-out 0.2s ease-in forwards;
}

/* Left glow bar */
.ct-toast::before {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 3px; height: 100%;
  background: var(--ct-color, #00f5ff);
  box-shadow: 0 0 8px var(--ct-color, #00f5ff);
}
/* Bottom gradient fade */
.ct-toast::after {
  content: '';
  position: absolute;
  bottom: 0; left: 3px; right: 0;
  height: 1px;
  background: linear-gradient(90deg, color-mix(in srgb, var(--ct-color,#00f5ff) 30%, transparent), transparent);
}

/* Scan line */
@keyframes ct-scan { from { top: 0; opacity:.5; } to { top: 100%; opacity: 0; } }
.ct-scan { position:absolute; top:0; left:0; right:0; height:1px;
  background: var(--ct-color,#00f5ff); opacity:.4;
  animation: ct-scan 2s linear infinite; }

.ct-icon {
  flex-shrink: 0; margin-top: 1px;
  font-family: 'Share Tech Mono', monospace;
  font-size: 16px;
  color: var(--ct-color, #00f5ff);
}

.ct-body { flex: 1; }

.ct-title {
  font-family: 'Orbitron', monospace;
  font-size: 10px;
  letter-spacing: 2px;
  color: var(--ct-color, #00f5ff);
  text-transform: uppercase;
  margin-bottom: 3px;
}

.ct-msg { color: #8aa0c0; font-size: 13px; line-height: 1.45; }

.ct-close {
  flex-shrink: 0;
  background: none; border: none; cursor: pointer;
  color: #4a6080;
  font-family: 'Share Tech Mono', monospace;
  font-size: 13px; padding: 0;
  transition: color .15s;
  line-height: 1;
}
.ct-close:hover { color: var(--ct-color, #00f5ff); }

/* Progress bar */
@keyframes ct-progress { from { width: 100%; } to { width: 0%; } }
.ct-progress {
  position: absolute;
  bottom: 0; left: 3px;
  height: 2px;
  background: var(--ct-color, #00f5ff);
  opacity: .35;
  animation: ct-progress var(--ct-dur, 3.5s) linear forwards;
}

/* Confirm actions */
.ct-actions { display: flex; gap: 8px; margin-top: 10px; }
.ct-btn {
  font-family: 'Orbitron', monospace;
  font-size: 9px; letter-spacing: 1.5px;
  text-transform: uppercase;
  padding: 5px 12px;
  border: 1px solid; background: transparent;
  cursor: pointer;
  transition: all .15s;
  clip-path: polygon(4px 0%,100% 0%,calc(100% - 4px) 100%,0% 100%);
}
.ct-btn-confirm { border-color: var(--ct-color,#ff2244); color: var(--ct-color,#ff2244); }
.ct-btn-confirm:hover { background: color-mix(in srgb, var(--ct-color,#ff2244) 15%, transparent);
  box-shadow: 0 0 8px color-mix(in srgb, var(--ct-color,#ff2244) 35%, transparent); }
.ct-btn-cancel  { border-color: #3a5070; color: #8aa0c0; }
.ct-btn-cancel:hover { background: #3a507022; }

@keyframes ct-in  { from { opacity:0; transform: translateX(30px) skewX(-1deg); } to { opacity:1; transform:none; } }
@keyframes ct-out { from { opacity:1; transform:translateX(0); max-height:200px; } to { opacity:0; transform:translateX(40px); max-height:0; padding:0; margin:0; } }
`;

let toastStyleInjected = false;
function injectToastStyles() {
  if (toastStyleInjected || typeof document === "undefined") return;
  const tag = document.createElement("style");
  tag.textContent = TOAST_CSS;
  document.head.appendChild(tag);
  toastStyleInjected = true;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const VARIANT_MAP: Record<ToastVariant, { color: string; icon: string; title: string }> = {
  success: { color: "#00ff88", icon: "✓", title: "Operación Exitosa" },
  error:   { color: "#ff2244", icon: "✗", title: "Error del Sistema"  },
  info:    { color: "#00f5ff", icon: "◈", title: "Sistema Info"       },
  warning: { color: "#ffe600", icon: "⚠", title: "Advertencia"        },
};

let _counter = 0;
const uid = () => `ct-${Date.now()}-${++_counter}`;

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastCtx = createContext<ToastContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

export function CyberToastProvider({ children }: { children: ReactNode }) {
  injectToastStyles();
  const [items, setItems] = useState<ToastItem[]>([]);

  const remove = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((t) => (t.id === id ? { ...t, removing: true } : t))
    );
    setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 230);
  }, []);

  const toast = useCallback(
    (opts: ToastOptions) => {
      const id = uid();
      setItems((prev) => [{ id, type: "toast", options: opts, removing: false }, ...prev]);
      const dur = opts.duration ?? 3500;
      if (dur > 0) setTimeout(() => remove(id), dur + 200);
    },
    [remove]
  );

  const confirm = useCallback((opts: ConfirmOptions) => {
    const id = uid();
    setItems((prev) => [{ id, type: "confirm", options: opts, removing: false }, ...prev]);
  }, []);

  return (
    <ToastCtx.Provider value={{ toast, confirm }}>
      {children}
      <div className="ct-portal">
        {items.map((item) =>
          item.type === "toast" ? (
            <ToastItem key={item.id} item={item} onRemove={remove} />
          ) : (
            <ConfirmItem key={item.id} item={item} onRemove={remove} />
          )
        )}
      </div>
    </ToastCtx.Provider>
  );
}

// ─── useToast hook ────────────────────────────────────────────────────────────

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used inside <CyberToastProvider>");
  return ctx;
}

// ─── Internal: ToastItem ─────────────────────────────────────────────────────

function ToastItem({ item, onRemove }: { item: ToastItem; onRemove: (id: string) => void }) {
  const opts    = item.options as ToastOptions;
  const variant = opts.variant ?? "info";
  const meta    = VARIANT_MAP[variant];
  const color   = opts.accentColor ?? meta.color;
  const dur     = opts.duration ?? 3500;

  const css: CSSProperties = {
    "--ct-color": color,
    "--ct-dur":   `${dur}ms`,
  } as CSSProperties;

  return (
    <div
      className={`ct-toast${item.removing ? " ct-removing" : ""}`}
      style={css}
      role="alert"
      aria-live="polite"
    >
      <span className="ct-scan" aria-hidden="true" />
      <span className="ct-icon">{meta.icon}</span>
      <div className="ct-body">
        <div className="ct-title">{opts.title ?? meta.title}</div>
        <div className="ct-msg">{opts.message}</div>
      </div>
      <button className="ct-close" onClick={() => onRemove(item.id)} aria-label="Cerrar">✕</button>
      {dur > 0 && <div className="ct-progress" aria-hidden="true" />}
    </div>
  );
}

// ─── Internal: ConfirmItem ────────────────────────────────────────────────────

function ConfirmItem({ item, onRemove }: { item: ToastItem; onRemove: (id: string) => void }) {
  const opts  = item.options as ConfirmOptions;
  const color = opts.accentColor ?? "#ff2244";

  const css: CSSProperties = { "--ct-color": color } as CSSProperties;

  const handleConfirm = () => {
    opts.onConfirm?.();
    onRemove(item.id);
  };
  const handleCancel = () => {
    opts.onCancel?.();
    onRemove(item.id);
  };

  return (
    <div
      className={`ct-toast${item.removing ? " ct-removing" : ""}`}
      style={css}
      role="alertdialog"
      aria-modal="false"
    >
      <span className="ct-scan" aria-hidden="true" />
      <span className="ct-icon">⬡</span>
      <div className="ct-body">
        <div className="ct-title">{opts.title ?? "Confirmar Acción"}</div>
        <div className="ct-msg">{opts.message}</div>
        <div className="ct-actions">
          <button className="ct-btn ct-btn-confirm" onClick={handleConfirm}>
            {opts.confirmLabel ?? "Confirmar"}
          </button>
          <button className="ct-btn ct-btn-cancel" onClick={handleCancel}>
            {opts.cancelLabel ?? "Cancelar"}
          </button>
        </div>
      </div>
      <button className="ct-close" onClick={handleCancel} aria-label="Cerrar">✕</button>
    </div>
  );
}
