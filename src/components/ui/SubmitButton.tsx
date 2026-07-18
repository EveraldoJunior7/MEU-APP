"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { Button } from "./Button";
import type { ComponentProps } from "react";

/**
 * Botão de submit que reflete o estado `pending` do formulário
 * (Server Actions + progressive enhancement).
 */
export function SubmitButton({
  children,
  pendingText,
  ...props
}: ComponentProps<typeof Button> & { pendingText?: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} aria-busy={pending} {...props}>
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          {pendingText ?? "Aguarde…"}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
