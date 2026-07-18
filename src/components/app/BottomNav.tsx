"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ListTodo, Calendar } from "lucide-react";

const items = [
  { href: "/listas", label: "Listas", icon: ListTodo, ready: true },
  { href: "/agenda", label: "Agenda", icon: Calendar, ready: false },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 pb-[env(safe-area-inset-bottom)]">
      <div className="glass mx-auto max-w-md m-3 rounded-2xl flex p-1.5">
        {items.map(({ href, label, icon: Icon, ready }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={ready ? href : "#"}
              aria-disabled={!ready}
              className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl text-xs font-medium transition-colors ${
                active
                  ? "text-accent bg-surface-2"
                  : ready
                    ? "text-muted hover:text-foreground"
                    : "text-faint pointer-events-none"
              }`}
            >
              <Icon className="size-5" />
              <span>{label}</span>
              {!ready && (
                <span className="text-[9px] leading-none text-faint">
                  em breve
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
