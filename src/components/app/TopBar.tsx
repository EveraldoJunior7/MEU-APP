import Link from "next/link";
import { ListChecks, LogOut } from "lucide-react";
import { signOutAction } from "@/controllers/auth.controller";

export function TopBar({ email }: { email?: string }) {
  return (
    <header className="sticky top-0 z-30 glass border-b border-border">
      <div className="mx-auto max-w-md h-14 px-4 flex items-center justify-between">
        <Link href="/listas" className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-gradient-to-br from-accent to-[#a78bfa] grid place-items-center">
            <ListChecks className="size-4 text-white" strokeWidth={2.2} />
          </div>
          <span className="font-semibold tracking-tight">Organiza</span>
        </Link>

        <div className="flex items-center gap-3">
          {email && (
            <span className="text-xs text-muted max-w-32 truncate hidden sm:block">
              {email}
            </span>
          )}
          <form action={signOutAction}>
            <button
              type="submit"
              title="Sair"
              className="size-9 grid place-items-center rounded-lg text-muted hover:text-foreground hover:bg-surface-2 transition-colors cursor-pointer"
            >
              <LogOut className="size-4" />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
