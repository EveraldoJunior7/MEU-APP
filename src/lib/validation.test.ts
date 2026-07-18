import { describe, it, expect } from "vitest";
import {
  isValidEmail,
  validateCredentials,
  validateListName,
  validateItemContent,
  parseColor,
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
