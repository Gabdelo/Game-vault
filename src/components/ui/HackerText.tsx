import { useEffect, useState } from "react";

const CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz" +
  "0123456789¡!¿?@#$%^&*()_+-=[]{};:'\",.<>/\\|";

interface HackerTextProps {
  text: string;
  speed?: number;
  step?: number;
  loop?: boolean;
  className?: string;
}

export function HackerText({
  text,
  speed = 40,
  step = 3,
  loop = false,
  className = "",
}: HackerTextProps) {
  const [display, setDisplay] = useState<string>("");

  useEffect(() => {
    let iteration = 0;
    let timeout: ReturnType<typeof setTimeout>;

    const run = () => {
      const interval = setInterval(() => {
        setDisplay(
          text
            .split("")
            .map((ch, i) => {
              if (ch === " ") return " ";
              if (i < iteration) return text[i];
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join("")
        );

        if (iteration >= text.length) {
          clearInterval(interval);
          setDisplay(text);
          if (loop) timeout = setTimeout(run, 2200);
        }

        iteration += step / 3;
      }, speed);

      return interval;
    };

    const id = run();
    return () => {
      clearInterval(id);
      clearTimeout(timeout);
    };
  }, [text, speed, step, loop]);

  return <span className={`font-mono ${className}`}>{display}</span>;
}