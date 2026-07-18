# Organiza — Guia de configuração

App mobile-first para organizar suas listas (tarefas, compras, etc.), construído com
**Next.js 16 + React 19 + Tailwind v4 + Supabase**, seguindo arquitetura **MVC**.

## Arquitetura (MVC)

```
src/
├── models/            # MODEL — tipos + acesso ao banco (Supabase)
│   ├── types.ts
│   ├── list.model.ts
│   └── item.model.ts
├── controllers/       # CONTROLLER — regras de negócio (Server Actions)
│   ├── session.ts       (helpers de autenticação)
│   ├── auth.controller.ts
│   ├── list.controller.ts
│   └── item.controller.ts
├── app/               # VIEW — rotas e páginas (App Router)
│   ├── login/           (tela de autenticação)
│   └── (app)/           (área logada: /listas, /listas/[id])
├── components/        # VIEW — componentes de interface
└── lib/supabase/      # infraestrutura de conexão + sessão
```

A **View** nunca fala com o banco direto: ela chama **Controllers**, que usam os
**Models**. Trocar a fonte de dados no futuro afeta só a pasta `models/`.

## Passo a passo

### 1. Criar o projeto no Supabase (grátis)
1. Acesse <https://supabase.com> e crie um projeto.
2. Em **SQL Editor**, cole e rode o conteúdo de [`supabase/schema.sql`](supabase/schema.sql).
   Isso cria as tabelas e as políticas de segurança (RLS).

### 2. Configurar as variáveis de ambiente
1. Copie `.env.local.example` para `.env.local`.
2. Em **Supabase → Project Settings → API**, copie:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Rodar localmente
```bash
npm run dev
```
Abra <http://localhost:3000>. Crie uma conta e comece a organizar.

> Sem `.env.local` o app ainda sobe, mas mostra apenas a tela de login
> (útil para ver o design antes de conectar o banco).

## Deploy na Vercel
1. Suba o projeto para o GitHub e importe em <https://vercel.com>.
2. Em **Settings → Environment Variables**, adicione as duas variáveis
   `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Em **Supabase → Authentication → URL Configuration**, adicione a URL da Vercel
   em *Site URL* / *Redirect URLs*.
4. Deploy. 🚀

## Segurança (mínima já implementada)
- **Row Level Security** no banco: cada usuário só acessa as próprias linhas.
- Autenticação por e-mail/senha via Supabase Auth (senha mín. 8 caracteres).
- Sessão via cookies httpOnly, renovada em cada request pelo middleware.
- A chave `service_role` nunca é usada no cliente.

## Próximos passos previstos
- 📅 Agenda / calendário (já reservado na navegação inferior).
- 🔔 Lembretes e notificações.
- 🔁 Reordenar itens (drag-and-drop).
