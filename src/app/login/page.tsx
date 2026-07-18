"use client";

import { useActionState, useState } from "react";
import { ListChecks, Mail, Lock, AlertCircle, CheckCircle2 } from "lucide-react";
import { signInAction, signUpAction } from "@/controllers/auth.controller";
import type { AuthState } from "@/controllers/types";
import { Input } from "@/components/ui/Input";
import { SubmitButton } from "@/components/ui/SubmitButton";

type Mode = "login" | "signup";

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("login");

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm animate-in">
        {/* Marca */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="size-14 rounded-2xl bg-gradient-to-br from-accent to-[#a78bfa] grid place-items-center glow-accent mb-4">
            <ListChecks className="size-7 text-white" strokeWidth={2.2} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Organiza</h1>
          <p className="text-muted text-sm mt-1">Seu dia, no lugar.</p>
        </div>

        {/* Alternância Entrar / Criar conta */}
        <div className="glass rounded-2xl p-1.5 flex mb-5">
          {(["login", "signup"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 h-10 rounded-xl text-sm font-medium transition-colors ${
                mode === m
                  ? "bg-surface-2 text-foreground"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {m === "login" ? "Entrar" : "Criar conta"}
            </button>
          ))}
        </div>

        <AuthForm key={mode} mode={mode} />

        <p className="text-center text-xs text-faint mt-6 leading-relaxed">
          Seus dados são privados e protegidos por autenticação.
        </p>
      </div>
    </main>
  );
}

function AuthForm({ mode }: { mode: Mode }) {
  const action = mode === "login" ? signInAction : signUpAction;
  const [state, formAction] = useActionState<AuthState, FormData>(action, {});

  return (
    <form action={formAction} className="glass rounded-2xl p-5 space-y-3">
      <label className="relative block">
        <Mail className="size-4 text-faint absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <Input
          type="email"
          name="email"
          placeholder="seu@email.com"
          autoComplete="email"
          required
          className="pl-11"
        />
      </label>

      <label className="relative block">
        <Lock className="size-4 text-faint absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <Input
          type="password"
          name="password"
          placeholder={mode === "login" ? "Sua senha" : "Crie uma senha (8+)"}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          minLength={8}
          required
          className="pl-11"
        />
      </label>

      {state.error && (
        <p className="flex items-start gap-2 text-danger text-sm px-1">
          <AlertCircle className="size-4 mt-0.5 shrink-0" />
          {state.error}
        </p>
      )}
      {state.message && (
        <p className="flex items-start gap-2 text-success text-sm px-1">
          <CheckCircle2 className="size-4 mt-0.5 shrink-0" />
          {state.message}
        </p>
      )}

      <SubmitButton
        size="lg"
        className="w-full mt-1"
        pendingText={mode === "login" ? "Entrando…" : "Criando…"}
      >
        {mode === "login" ? "Entrar" : "Criar minha conta"}
      </SubmitButton>
    </form>
  );
}
