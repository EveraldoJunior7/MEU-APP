import type { InputHTMLAttributes } from "react";

const base =
  "w-full h-12 rounded-xl bg-surface-2/60 border border-border px-4 text-[15px] " +
  "text-foreground placeholder:text-faint transition-colors outline-none " +
  "focus:border-accent/70 focus:bg-surface-2";

export function Input({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${base} ${className}`} {...props} />;
}
