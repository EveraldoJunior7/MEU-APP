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
  it("converte a linha do banco preservando o booleano is_done", () => {
    const row: ItemRow = {
      id: "item-1",
      list_id: "list-1",
      user_id: "user-1",
      content: "Comprar leite",
      is_done: true,
      position: 2,
      created_at: "2026-07-18T10:05:00Z",
    };

    expect(mapItemRow(row)).toEqual({
      id: "item-1",
      listId: "list-1",
      userId: "user-1",
      content: "Comprar leite",
      isDone: true,
      position: 2,
      createdAt: "2026-07-18T10:05:00Z",
    });
  });
});
