import React, { useEffect, useRef } from "react"

// ─── TIPOS ────────────────────────────────────────────────────────────────────
interface GlitchOptions {
  /** Intensidad del desplazamiento en px. Default: 6 */
  intensity?: number
  /** Velocidad de cada frame en ms. Default: 50 */
  speed?: number
  /** Cuántos frames dura el glitch antes de parar. Default: 8 */
  frames?: number
  /** Color del slice izquierdo. Default: "#ff003c" */
  colorLeft?: string
  /** Color del slice derecho. Default: "#00f0ff" */
  colorRight?: string
}

// ─── HOOK ─────────────────────────────────────────────────────────────────────
/**
 * Aplica efecto glitch a cualquier ref de elemento HTML.
 *
 * @example
 * const ref = useGlitch({ intensity: 8 })
 * <h1 ref={ref}>GameVault</h1>
 */
export function useGlitch<T extends HTMLElement = HTMLElement>(
  options: GlitchOptions = {}
) {
  const {
    intensity = 6,
    speed = 50,
    frames = 8,
    colorLeft = "#ff003c",
    colorRight = "#00f0ff",
  } = options

  const ref = useRef<T>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const frameCountRef = useRef(0)

  const startGlitch = () => {
    if (intervalRef.current) return
    frameCountRef.current = 0

    intervalRef.current = setInterval(() => {
      const el = ref.current
      if (!el) return

      frameCountRef.current++

      const rx = (Math.random() - 0.5) * intensity
      const ry = (Math.random() - 0.5) * intensity * 0.5
      const skew = (Math.random() - 0.5) * 2

      // Clip slice aleatorio
      const sliceTop = Math.floor(Math.random() * 80)
      const sliceH = Math.floor(Math.random() * 20) + 4

      el.style.transform = `translate(${rx}px, ${ry}px) skewX(${skew}deg)`
      el.style.textShadow = `
        ${(Math.random() - 0.5) * intensity * 1.5}px 0 0 ${colorLeft},
        ${(Math.random() - 0.5) * intensity * 1.5}px 0 0 ${colorRight}
      `
      el.style.clipPath = Math.random() > 0.5
        ? `inset(${sliceTop}% 0 ${100 - sliceTop - sliceH}% 0)`
        : "none"
      el.style.filter = Math.random() > 0.7
        ? `brightness(1.4) contrast(1.2)`
        : "none"

      // Parar después de N frames
      if (frameCountRef.current >= frames) {
        stopGlitch()
      }
    }, speed)
  }

  const stopGlitch = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    const el = ref.current
    if (el) {
      el.style.transform = ""
      el.style.textShadow = ""
      el.style.clipPath = ""
      el.style.filter = ""
    }
  }

  // Limpiar al desmontar
  useEffect(() => {
    return () => stopGlitch()
  }, [])

  return { ref, startGlitch, stopGlitch }
}

// ─── COMPONENTE WRAPPER ───────────────────────────────────────────────────────
interface GlitchProps {
  children: React.ReactNode
  /** "hover" = glitch al pasar el mouse | "loop" = glitch continuo | "click" = glitch al hacer click */
  trigger?: "hover" | "loop" | "click"
  options?: GlitchOptions
  className?: string
  style?: React.CSSProperties
  as?: keyof React.JSX.IntrinsicElements
}

/**
 * Wrapper que aplica glitch a cualquier contenido.
 *
 * @example
 * // En un título
 * <Glitch trigger="hover"><h1>GameVault</h1></Glitch>
 *
 * // En un botón
 * <Glitch trigger="hover" options={{ intensity: 4, colorLeft: "#ff003c" }}>
 *   <button>Jugar</button>
 * </Glitch>
 *
 * // Loop continuo
 * <Glitch trigger="loop" options={{ frames: 4, speed: 80 }}>
 *   <img src="/logo.webp" />
 * </Glitch>
 */
export function Glitch({
  children,
  trigger = "hover",
  options = {},
  className,
  style,
  as: Tag = "div",
}: GlitchProps) {
  const { ref, startGlitch, stopGlitch } = useGlitch<HTMLDivElement>(options)
  const loopRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (trigger !== "loop") return

    // Loop: glitch cada N ms con pausa entre medio
    const interval = (options.frames ?? 8) * (options.speed ?? 50)
    const pause = 1200 + Math.random() * 800

    loopRef.current = setInterval(() => {
      startGlitch()
    }, interval + pause)

    // Primer glitch inmediato
    startGlitch()

    return () => {
      if (loopRef.current) clearInterval(loopRef.current)
      stopGlitch()
    }
  }, [trigger])

  const eventHandlers =
    trigger === "hover"
      ? { onMouseEnter: startGlitch, onMouseLeave: stopGlitch }
      : trigger === "click"
      ? { onClick: startGlitch }
      : {}

  return (
    React.createElement(Tag as any, {
      ref,
      className,
      style: { display: "inline-block", ...style },
      ...eventHandlers,
    }, children)
  )
}
