import { describe, it, expect } from "vitest";
import {
  isValidEmail,
  validateCredentials,
  validateListName,
  validateItemContent,
  parseColor,
  parsePriority,
  parseDueDate,
  parseNote,
} from "./validation";

describe("isValidEmail", () => {
  it("aceita e-mails válidos", () => {
    expect(isValidEmail("ana@exemplo.com")).toBe(true);
    expect(isValidEmail("joao.silva@empresa.com.br")).toBe(true);
  });

  it("rejeita e-mails inválidos", () => {
    expect(isValidEmail("")).toBe(false);
    expect(isValidEmail("ana")).toBe(false);
    expect(isValidEmail("ana@")).toBe(false);
    expect(isValidEmail("ana@exemplo")).toBe(false);
    expect(isValidEmail("ana exemplo@teste.com")).toBe(false);
  });
});

describe("validateCredentials", () => {
  it("retorna null quando e-mail e senha são válidos", () => {
    expect(validateCredentials("ana@exemplo.com", "senha1234")).toBeNull();
  });

  it("reclama de e-mail inválido", () => {
    expect(validateCredentials("invalido", "senha1234")).toMatch(/e-mail/i);
  });

  it("reclama de senha curta (menos de 8)", () => {
    expect(validateCredentials("ana@exemplo.com", "1234567")).toMatch(/senha/i);
  });

  it("aceita senha com exatamente 8 caracteres", () => {
    expect(validateCredentials("ana@exemplo.com", "12345678")).toBeNull();
  });
});

describe("validateListName", () => {
  it("aceita um nome comum", () => {
    expect(validateListName("Compras do mês")).toBeNull();
  });

  it("rejeita nome vazio", () => {
    expect(validateListName("")).toMatch(/entre 1 e 80/);
  });

  it("aceita nome com 80 caracteres e rejeita com 81", () => {
    expect(validateListName("a".repeat(80))).toBeNull();
    expect(validateListName("a".repeat(81))).toMatch(/entre 1 e 80/);
  });
});

describe("validateItemContent", () => {
  it("aceita um item comum", () => {
    expect(validateItemContent("Comprar leite")).toBeNull();
  });

  it("rejeita item vazio", () => {
    expect(validateItemContent("")).toMatch(/entre 1 e 500/);
  });

  it("aceita 500 caracteres e rejeita 501", () => {
    expect(validateItemContent("a".repeat(500))).toBeNull();
    expect(validateItemContent("a".repeat(501))).toMatch(/entre 1 e 500/);
  });
});

describe("parseColor", () => {
  it("mantém uma cor válida", () => {
    expect(parseColor("emerald")).toBe("emerald");
    expect(parseColor("rose")).toBe("rose");
  });

  it("cai para 'violet' quando a cor é inválida ou ausente", () => {
    expect(parseColor("laranja-neon")).toBe("violet");
    expect(parseColor(null)).toBe("violet");
    expect(parseColor(undefined)).toBe("violet");
    expect(parseColor(123)).toBe("violet");
  });
});

describe("parsePriority", () => {
  it("mantém prioridades válidas", () => {
    expect(parsePriority("low")).toBe("low");
    expect(parsePriority("medium")).toBe("medium");
    expect(parsePriority("high")).toBe("high");
  });

  it("devolve null para ausente ou inválida", () => {
    expect(parsePriority(null)).toBeNull();
    expect(parsePriority("")).toBeNull();
    expect(parsePriority("urgentíssima")).toBeNull();
  });
});

describe("parseDueDate", () => {
  it("aceita datas no formato YYYY-MM-DD", () => {
    expect(parseDueDate("2026-07-20")).toBe("2026-07-20");
  });

  it("devolve null para vazio ou formato inválido", () => {
    expect(parseDueDate("")).toBeNull();
    expect(parseDueDate(null)).toBeNull();
    expect(parseDueDate("20/07/2026")).toBeNull();
    expect(parseDueDate("amanhã")).toBeNull();
  });
});

describe("parseNote", () => {
  it("corta espaços e mantém o texto", () => {
    expect(parseNote("  detalhe  ")).toBe("detalhe");
  });

  it("devolve null para vazio", () => {
    expect(parseNote("")).toBeNull();
    expect(parseNote("   ")).toBeNull();
    expect(parseNote(null)).toBeNull();
  });

  it("limita a 1000 caracteres", () => {
    expect(parseNote("a".repeat(1200))?.length).toBe(1000);
  });
});
