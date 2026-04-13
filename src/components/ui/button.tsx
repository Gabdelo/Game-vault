import { useCallback, useRef } from "react"

type Variant = "primary" | "danger" | "ghost"

type Props = {
  children: React.ReactNode
  type?: "button" | "submit"
  variant?: Variant
  onClick?: () => void
  tag?: string
}

const CLIP = "polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)"

const variantStyles: Record<Variant, { bg: string; shadow: string; hoverBg: string; textColor: string; tagColor: string; tagLabel: string }> = {
  primary: {
    bg: "#fcee0a",
    shadow: "#0c3cda",
    hoverBg: "#ffe800",
    textColor: "#0a0a0f",
    tagColor: "rgba(252,238,10,0.5)",
    tagLabel: "SYS_CMD::PRIMARY",
  },
  danger: {
    bg: "#ff003c",
    shadow: "#7a0019",
    hoverBg: "#ff2255",
    textColor: "#0a0a0f",
    tagColor: "rgba(255,0,60,0.5)",
    tagLabel: "SYS_CMD::DANGER",
  },
  ghost: {
    bg: "transparent",
    shadow: "transparent",
    hoverBg: "rgba(0,240,255,0.08)",
    textColor: "#00f0ff",
    tagColor: "rgba(0,240,255,0.5)",
    tagLabel: "SYS_CMD::GHOST",
  },
}

export const CyberpunkButton = ({
  children,
  type = "button",
  variant = "primary",
  onClick,
  tag,
}: Props) => {
  const btnRef = useRef<HTMLButtonElement>(null)
  const glitchRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const isGlitching = useRef(false)

  const v = variantStyles[variant]
  const isGhost = variant === "ghost"

  const triggerGlitch = useCallback(() => {
    if (isGlitching.current) return
    isGlitching.current = true

    const glitch = glitchRef.current
    const text = textRef.current
    const bg = bgRef.current

    if (glitch) glitch.style.animation = "none"
    if (text) text.style.animation = "none"
    if (bg) bg.style.animation = "none"

    requestAnimationFrame(() => {
      if (glitch) glitch.style.animation = "cp-glitch-flash 0.3s steps(1) forwards"
      if (text) text.style.animation = "cp-text-glitch 0.3s steps(1) forwards"
      if (bg) bg.style.animation = "cp-bg-glitch 0.3s steps(1) forwards"
    })

    setTimeout(() => {
      if (glitch) glitch.style.animation = ""
      if (text) text.style.animation = ""
      if (bg) bg.style.animation = ""
      isGlitching.current = false
    }, 350)
  }, [])

  const handleClick = () => {
    triggerGlitch()
    onClick?.()
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@900&display=swap');

        .cp-btn-wrap { position: relative; display: inline-flex; }

        .cp-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          border: none;
          background: none;
          cursor: pointer;
          width: 260px;
          height: 56px;
          font-family: 'Orbitron', sans-serif;
          font-weight: 900;
          font-size: 13px;
          letter-spacing: 4px;
          text-transform: uppercase;
          isolation: isolate;
          outline: none;
          -webkit-tap-highlight-color: transparent;
        }

        .cp-btn__shadow {
          position: absolute; inset: 0;
          clip-path: ${CLIP};
          transform: translate(4px, 4px);
          transition: transform 0.1s ease;
          z-index: 0;
        }

        .cp-btn__bg {
          position: absolute; inset: 0;
          clip-path: ${CLIP};
          transition: background 0.15s ease;
          z-index: 1;
        }

        .cp-btn__border {
          position: absolute; inset: -1px;
          clip-path: polygon(11px 0%, 100% 0%, calc(100% - 11px) 100%, 0% 100%);
          background: #00f0ff;
          z-index: 0;
          opacity: 0;
          transition: opacity 0.15s ease;
        }

        .cp-btn__scanlines {
          position: absolute; inset: 0;
          clip-path: ${CLIP};
          background: repeating-linear-gradient(
            0deg, transparent, transparent 3px,
            rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 4px
          );
          z-index: 2; pointer-events: none;
        }

        .cp-btn__text {
          position: relative; z-index: 3;
          display: flex; align-items: center; gap: 10px;
          transition: transform 0.1s ease, color 0.15s ease;
        }

        .cp-btn__icon {
          width: 12px; height: 12px;
          clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
          flex-shrink: 0;
          transition: transform 0.3s ease;
        }

        .cp-btn__corner {
          position: absolute; width: 6px; height: 6px;
          background: #0a0a0f; z-index: 4;
        }
        .cp-btn__corner--tl { top: 0; left: 1px; }
        .cp-btn__corner--tr { top: 0; right: 1px; }
        .cp-btn__corner--bl { bottom: 0; left: 1px; }
        .cp-btn__corner--br { bottom: 0; right: 1px; }

        .cp-btn__glitch {
          position: absolute; inset: 0;
          clip-path: ${CLIP};
          background: #00f0ff;
          z-index: 5; opacity: 0;
          pointer-events: none;
          mix-blend-mode: screen;
        }

        .cp-btn__tag {
          position: absolute;
          bottom: -18px; right: 0;
          font-family: 'Share Tech Mono', monospace;
          font-size: 9px; letter-spacing: 2px;
          pointer-events: none;
        }

        .cp-btn:hover .cp-btn__shadow { transform: translate(6px, 6px); }
        .cp-btn:hover .cp-btn__border { opacity: 1; }
        .cp-btn:hover .cp-btn__text   { transform: translate(-1px, -1px); }
        .cp-btn:hover .cp-btn__icon   { transform: rotate(90deg); }
        .cp-btn:active .cp-btn__shadow { transform: translate(2px, 2px); }
        .cp-btn:active .cp-btn__text   { transform: translate(0, 0); }

        .cp-btn--ghost .cp-btn__text { color: #00f0ff; }
        .cp-btn--ghost:hover .cp-btn__text { color: #fcee0a; }
        .cp-btn--ghost::after {
          content: '';
          position: absolute; inset: 0;
          clip-path: ${CLIP};
          border: 1px solid #00f0ff;
          z-index: 1; pointer-events: none;
        }

        @keyframes cp-glitch-flash {
          0%   { opacity: 0; clip-path: ${CLIP}; transform: translate(0,0); }
          10%  { opacity: 0.7; clip-path: polygon(12px 20%,100% 20%,100% 40%,0% 40%); transform: translate(-3px,0); }
          20%  { opacity: 0; }
          35%  { opacity: 0.5; clip-path: polygon(12px 60%,100% 60%,100% 75%,0% 75%); transform: translate(3px,0); }
          50%  { opacity: 0; }
          65%  { opacity: 0.3; clip-path: polygon(12px 10%,100% 10%,100% 90%,0% 90%); transform: translate(-2px,0); }
          80%  { opacity: 0; }
          100% { opacity: 0; }
        }

        @keyframes cp-text-glitch {
          0%   { transform: translate(-1px,-1px); color: #0a0a0f; }
          15%  { transform: translate(3px,-1px); color: #ff003c; }
          30%  { transform: translate(-2px,0); color: #0a0a0f; }
          50%  { transform: translate(2px,1px); color: #00f0ff; }
          70%  { transform: translate(-1px,-1px); color: #0a0a0f; }
          100% { transform: translate(-1px,-1px); color: #0a0a0f; }
        }

        @keyframes cp-bg-glitch {
          0%   { background: #fcee0a; }
          15%  { background: #ff003c; }
          30%  { background: #fcee0a; }
          50%  { background: #00f0ff; }
          70%  { background: #fcee0a; }
          100% { background: #ffe800; }
        }
      `}</style>

      <div className="cp-btn-wrap">
        <button
          ref={btnRef}
          type={type}
          className={`cp-btn${isGhost ? " cp-btn--ghost" : ""}`}
          style={{ color: v.textColor }}
          onClick={handleClick}
        >
          <div className="cp-btn__border" />
          <div className="cp-btn__shadow" style={{ background: v.shadow }} />
          <div ref={bgRef} className="cp-btn__bg" style={{ background: v.bg }} />
          <div className="cp-btn__scanlines" />
          <div ref={glitchRef} className="cp-btn__glitch" />
          <span ref={textRef} className="cp-btn__text">
            <span
              className="cp-btn__icon"
              style={{ background: isGhost ? "#00f0ff" : v.textColor }}
            />
            {children}
          </span>
          <div className="cp-btn__corner cp-btn__corner--tl" />
          <div className="cp-btn__corner cp-btn__corner--tr" />
          <div className="cp-btn__corner cp-btn__corner--bl" />
          <div className="cp-btn__corner cp-btn__corner--br" />
          <span className="cp-btn__tag" style={{ color: v.tagColor }}>
            {tag ?? v.tagLabel}
          </span>
        </button>
      </div>
    </>
  )
}

// Usage examples:
// <CyberpunkButton>Execute</CyberpunkButton>
// <CyberpunkButton variant="danger">Terminate</CyberpunkButton>
// <CyberpunkButton variant="ghost">Jack In</CyberpunkButton>
// <CyberpunkButton type="submit" tag="FORM::SUBMIT">Submit</CyberpunkButton>
