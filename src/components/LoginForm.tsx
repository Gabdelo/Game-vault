
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { HackerText } from "./ui/HackerText"

// ─── Animated left-border field ───────────────────────────────────────────────

function Field({
  id,
  type = "text",
  label,
  placeholder,
  value,
  onChange,
  autoComplete,
}: {
  id: string
  type?: string
  label: string
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  autoComplete?: string
}) {
  const [focused, setFocused] = useState(false)

  return (
    <div className="flex flex-col gap-1.5 w-full">
      
      <label
        htmlFor={id}
        className="text-[10px] tracking-[0.2em] uppercase font-medium text-zinc-100"
      >
        {label}
      </label>
      

      <div className="relative">
        {/* accent left-border on focus */}
        <motion.span
          className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#F2FF00] origin-bottom pointer-events-none"
          animate={{ scaleY: focused ? 1 : 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        />

        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          autoComplete={autoComplete}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={[
            "w-full bg-[#0a160f]/80 text-zinc-100 text-sm",
            "pl-4 pr-4 py-3 border outline-none",
            "placeholder:text-zinc-700 transition-colors duration-150",
            focused
              ? "border-[#F2FF00]/60 shadow-[0_0_0_1px_rgba(242,255,0,0.08)_inset]"
              : "border-zinc-800 hover:border-zinc-700",
          ].join(" ")}
        />
      </div>
    </div>
  )
}

interface LoginProps {
  email: string
  setEmail: (v: string) => void
  password: string
  setPassword: (v: string) => void
  handleSubmit: (e: React.FormEvent) => void
  onSwitch: () => void
  error?: string
}

export default function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  handleSubmit,
  onSwitch,
  error,
}: LoginProps) {
  return (
    <div 
      className="w-full h-full bg-black flex items-center justify-center p-8"
      style={{ clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))" }}
    >
      <div className="relative w-full max-w-md flex flex-col gap-0">
      
      <div className="flex items-center gap-2 px-[1rem]">
        <motion.span
          className="w-1.5 h-1.5 rounded-full bg-[#F2FF00]"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
        <span className="text-[10px] tracking-[0.2em] uppercase text-zinc-100">
          <HackerText text="GAME VAULT — AUTH SYSTEM" />
        </span>
      </div>

      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-2xl font-black tracking-tight text-zinc-100 leading-none">
          <HackerText text="INICIAR SESIÓN" />
          <br />
          <span className="text-[#F2FF00]"><HackerText text="SESIÓN" /></span>
        </h1>
        <p className="mt-2 text-[11px] text-zinc-100 tracking-widest uppercase">
          Introduce tus credenciales para continuar
        </p>
      </div>

      {/* Form — onSubmit, value, onChange untouched */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        <Field
          id="login-email"
          type="email"
          label="Email"
          placeholder="player@gamevault.gg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />

        <Field
          id="login-password"
          type="password"
          label="Contraseña"
          placeholder="••••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        {/* Submit */}
        <motion.button
          type="submit"
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.01 }}
          className={[
            "relative w-full mt-1 py-3.5 text-[11px] tracking-[0.25em] uppercase font-bold",
            "bg-[#F2FF00] text-[#0a160f] overflow-hidden cursor-pointer",
            "[clip-path:polygon(0_0,100%_0,100%_calc(100%_-_10px),calc(100%_-_10px)_100%,0_100%)]",
          ].join(" ")}
        >
          {/* shimmer */}
          <motion.span
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/100 to-transparent -translate-x-full pointer-events-none"
            whileHover={{ translateX: "200%" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
          <span className="relative z-10"><HackerText text="INICIAR SESIÓN" /></span>
        </motion.button>

        {/* Error — same conditional as original */}
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-[11px] text-red-400 tracking-wide text-center"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </form>

      {/* Footer — onSwitch untouched */}
      <p className="mt-7 text-center text-[10px] text-zinc-100 tracking-widest uppercase">
        <HackerText text="¿No tienes cuenta?" />{" "}
        <span
          onClick={onSwitch}
          className="text-zinc-400 cursor-pointer transition-colors duration-150 underline underline-offset-2 hover:text-[#F2FF00]"
        >
          <HackerText text="Regístrate" />
        </span>
      </p>
      </div>
    </div>
  )
}
