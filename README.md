<div align="center">

# 📋 Organiza

### _Seu dia, no lugar._

Um app **simples, bonito e direto** para organizar o seu dia a dia em listas —
tarefas, compras, metas e o que mais você precisar. 💜

<br/>

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)

</div>

---

## ✨ O que dá pra fazer

- ✅ **Criar listas** com nome e cor (tarefas, compras, ideias… você escolhe)
- 📝 **Adicionar itens** e marcar como concluídos com um toque
- ✏️ **Editar** um item tocando no texto e **excluir** quando quiser
- 📊 Ver o **progresso** de cada lista de relance
- 🔐 **Sua conta, seus dados** — cada pessoa só enxerga as próprias listas
- 📱 **Feito para o celular** (mas funciona lindo no computador também)

---

## 🎨 Visual

Interface **escura e elegante**, com um toque de vidro (glassmorphism) e um acento
violeta suave. Pensada para ser agradável de usar todo dia, sem poluição.

---

## 🚀 Rodando no seu computador

> Guia completo e sem pressa em **[SETUP.md](SETUP.md)**.

Resumo rápido:

```bash
# 1. Instalar as dependências
npm install

# 2. Configurar o banco (copie e preencha suas chaves do Supabase)
cp .env.local.example .env.local

# 3. Rodar
npm run dev
```

Depois é só abrir **http://localhost:3000** 🎉

---

## 🧱 Como o app é organizado

O código segue o padrão **MVC** — cada parte tem um papel bem definido, o que
deixa tudo mais fácil de entender e crescer:

```
src/
├── models/        🗃️  Os dados (o que é uma lista, um item) e como salvá-los
├── controllers/   ⚙️   As regras (criar, editar, excluir, entrar/sair)
├── app/           🖥️   As telas (login, listas, detalhe da lista)
├── components/    🧩  As peças da interface (botões, cartões, formulários)
└── lib/supabase/  🔌  A conexão com o banco de dados
```

> A ideia central: as **telas** nunca falam com o banco diretamente. Elas pedem
> para os **controllers**, que usam os **models**. Trocar algo no futuro fica simples.

---

## 🔒 Segurança

- Cada usuário só acessa os **próprios dados** (Row Level Security no banco)
- Login por e-mail e senha (mínimo 8 caracteres)
- Sessão protegida por cookies e renovada automaticamente
- Chaves sensíveis **nunca** vão para o navegador nem para o repositório

---

## 🛣️ Próximos passos

- [x] Listas com itens (tarefas, compras…)
- [x] Autenticação e contas
- [ ] 📅 Agenda / calendário
- [ ] 🔔 Lembretes e notificações
- [ ] 🔁 Reordenar itens arrastando

---

<div align="center">

Feito com 💜 usando **Next.js**, **Supabase** e **Tailwind CSS**.

</div>
