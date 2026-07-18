import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, CheckCircle2, ClipboardList } from "lucide-react";
import { requireUser } from "@/controllers/session";
import { ListModel } from "@/models/list.model";
import { ItemModel } from "@/models/item.model";
import { listColorStyles } from "@/lib/list-colors";
import { AddItemForm } from "@/components/items/AddItemForm";
import { ItemRow } from "@/components/items/ItemRow";
import { ListOptions } from "@/components/lists/ListOptions";

export default async function ListaDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();

  const list = await ListModel.findById(id, user.id);
  if (!list) notFound();

  const items = await ItemModel.findAllByList(id, user.id);
  const pending = items.filter((i) => !i.isDone);
  const done = items.filter((i) => i.isDone);
  const color = listColorStyles[list.color];

  return (
    <div className="space-y-5 animate-in">
      {/* Cabeçalho */}
      <div className="flex items-center gap-2 -ml-2">
        <Link
          href="/listas"
          className="size-9 grid place-items-center rounded-lg text-muted hover:text-foreground hover:bg-surface-2 transition-colors"
          aria-label="Voltar"
        >
          <ChevronLeft className="size-5" />
        </Link>
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <span
            className="size-3 rounded-full shrink-0"
            style={{ backgroundColor: color.hex }}
          />
          <h1 className="text-xl font-semibold tracking-tight truncate">
            {list.name}
          </h1>
        </div>
        <ListOptions id={list.id} name={list.name} color={list.color} />
      </div>

      {/* Resumo */}
      {items.length > 0 && (
        <p className="text-sm text-muted -mt-1">
          {done.length} de {items.length} concluído
          {items.length === 1 ? "" : "s"}
        </p>
      )}

      <AddItemForm listId={list.id} />

      {/* Itens pendentes */}
      {items.length === 0 ? (
        <div className="card flex flex-col items-center text-center gap-3 py-12 px-6">
          <div className="size-14 rounded-2xl bg-surface-2 grid place-items-center">
            <ClipboardList className="size-7 text-muted" />
          </div>
          <p className="text-sm text-muted">
            Lista vazia. Adicione o primeiro item acima.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {pending.map((item) => (
            <ItemRow key={item.id} item={item} />
          ))}

          {done.length > 0 && (
            <div className="pt-4">
              <div className="flex items-center gap-2 px-1 mb-2.5 text-muted">
                <CheckCircle2 className="size-4" />
                <span className="text-xs font-medium uppercase tracking-wide">
                  Concluídos ({done.length})
                </span>
              </div>
              <div className="space-y-2.5">
                {done.map((item) => (
                  <ItemRow key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
