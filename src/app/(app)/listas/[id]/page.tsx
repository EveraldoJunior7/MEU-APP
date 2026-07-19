import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { requireUser } from "@/controllers/session";
import { ListModel } from "@/models/list.model";
import { ItemModel } from "@/models/item.model";
import { listColorStyles } from "@/lib/list-colors";
import { ItemsBoard } from "@/components/items/ItemsBoard";
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

      <ItemsBoard listId={list.id} color={list.color} initialItems={items} />
    </div>
  );
}
