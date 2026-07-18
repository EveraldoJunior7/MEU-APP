"use client";

import { useRef, useState, useTransition } from "react";
import { Plus, Loader2 } from "lucide-react";
import { addItemAction } from "@/controllers/item.controller";

export function AddItemForm({ listId }: { listId: string }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await addItemAction(listId, formData);
      if (res?.error) {
        setError(res.error);
      } else {
        setError(null);
        formRef.current?.reset();
        inputRef.current?.focus();
      }
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <div className="glass rounded-2xl flex items-center gap-2 p-2 pl-4">
        <input
          ref={inputRef}
          name="content"
          placeholder="Adicionar item…"
          maxLength={500}
          autoComplete="off"
          className="flex-1 bg-transparent outline-none text-[15px] placeholder:text-faint h-10"
        />
        <button
          type="submit"
          disabled={pending}
          aria-label="Adicionar"
          className="size-10 shrink-0 grid place-items-center rounded-xl bg-accent text-accent-foreground hover:bg-accent-strong transition-colors disabled:opacity-50 active:scale-95"
        >
          {pending ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <Plus className="size-5" />
          )}
        </button>
      </div>
      {error && <p className="text-danger text-sm mt-2 px-1">{error}</p>}
    </form>
  );
}
