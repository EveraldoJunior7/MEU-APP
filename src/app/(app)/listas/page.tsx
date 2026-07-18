import { ListPlus } from "lucide-react";
import { requireUser } from "@/controllers/session";
import { ListModel } from "@/models/list.model";
import { ListCard } from "@/components/lists/ListCard";
import { NewListSheet } from "@/components/lists/NewListSheet";

export default async function ListasPage() {
  const user = await requireUser();
  const lists = await ListModel.findAllByUser(user.id);

  return (
    <div className="space-y-6 animate-in">
      <header className="pt-2">
        <h1 className="text-2xl font-semibold tracking-tight">Suas listas</h1>
        <p className="text-muted text-sm mt-1">
          {lists.length === 0
            ? "Comece criando sua primeira lista."
            : `${lists.length} ${lists.length === 1 ? "lista" : "listas"} organizando seu dia.`}
        </p>
      </header>

      <NewListSheet />

      {lists.length === 0 ? (
        <div className="card flex flex-col items-center text-center gap-3 py-12 px-6 mt-2">
          <div className="size-14 rounded-2xl bg-surface-2 grid place-items-center">
            <ListPlus className="size-7 text-muted" />
          </div>
          <div>
            <p className="font-medium">Nenhuma lista ainda</p>
            <p className="text-sm text-muted mt-1">
              Tarefas, compras, metas… crie a primeira acima.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {lists.map((list) => (
            <ListCard key={list.id} list={list} />
          ))}
        </div>
      )}
    </div>
  );
}
