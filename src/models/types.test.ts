import { describe, it, expect } from "vitest";
import { mapListRow, mapItemRow, type ListRow, type ItemRow } from "./types";

describe("mapListRow", () => {
  it("converte a linha do banco (snake_case) para o domínio (camelCase)", () => {
    const row: ListRow = {
      id: "list-1",
      user_id: "user-1",
      name: "Compras",
      color: "emerald",
      created_at: "2026-07-18T10:00:00Z",
    };

    expect(mapListRow(row)).toEqual({
      id: "list-1",
      userId: "user-1",
      name: "Compras",
      color: "emerald",
      createdAt: "2026-07-18T10:00:00Z",
    });
  });
});

describe("mapItemRow", () => {
  it("converte a linha do banco preservando is_done e os campos extras", () => {
    const row: ItemRow = {
      id: "item-1",
      list_id: "list-1",
      user_id: "user-1",
      content: "Comprar leite",
      is_done: true,
      position: 2,
      created_at: "2026-07-18T10:05:00Z",
      priority: "high",
      due_date: "2026-07-20",
      note: "sem lactose",
    };

    expect(mapItemRow(row)).toEqual({
      id: "item-1",
      listId: "list-1",
      userId: "user-1",
      content: "Comprar leite",
      isDone: true,
      position: 2,
      createdAt: "2026-07-18T10:05:00Z",
      priority: "high",
      dueDate: "2026-07-20",
      note: "sem lactose",
    });
  });

  it("mapeia campos extras ausentes (null) corretamente", () => {
    const row: ItemRow = {
      id: "item-2",
      list_id: "list-1",
      user_id: "user-1",
      content: "Pão",
      is_done: false,
      position: 0,
      created_at: "2026-07-18T10:06:00Z",
      priority: null,
      due_date: null,
      note: null,
    };

    const mapped = mapItemRow(row);
    expect(mapped.priority).toBeNull();
    expect(mapped.dueDate).toBeNull();
    expect(mapped.note).toBeNull();
  });
});
