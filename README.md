# Curso Automatizai

[Automatizai] (https://fernandopapito.com/automatizai)

---

## Instalação

Na pasta do projeto (`velo`):

```bash
yarn install
```

### Variáveis de ambiente

Crie o arquivo `.env` na raiz do projeto com os dados do projeto no Supabase (**Project Settings → API** ou **Connect** no dashboard):

```env
VITE_SUPABASE_PROJECT_ID="seu_project_id"
VITE_SUPABASE_PUBLISHABLE_KEY="sua_chave_anon_publica"
VITE_SUPABASE_URL="https://seu_project_id.supabase.co"
```

### Rodar em desenvolvimento

```bash
yarn dev
```

Acesse: `http://localhost:5173`

---

## Configuração do Supabase

### 1. Criar Projeto

1. Acesse [supabase.com](https://supabase.com) e crie uma conta
2. Clique em **New Project**
3. Escolha um nome e senha para o banco
4. Aguarde a criação (~2 minutos)

### 2. Variáveis de Ambiente

As mesmas do passo [Variáveis de ambiente](#variáveis-de-ambiente) acima.

### 3. Deploy (banco + functions)

```bash
# Instalar CLI
npm install -g supabase
yarn add supabase -D

# Login e vincular projeto
yarn supabase login
yarn supabase link --project-ref SEU_PROJECT_ID

# Aplicar migrações (cria tabelas e RLS)
yarn supabase db push

# Deploy das Edge Functions
yarn supabase functions deploy
```

## Testes E2E (Playwright)

```bash
yarn playwright test
# Modo interativo (UI)
yarn playwright test --ui
# Só Chromium
yarn playwright test --project=chromium
# Arquivo específico
yarn playwright test example
# Por título do cenário
yarn playwright test -g 'webapp deve estar online'
# Debug
yarn playwright test --debug
yarn playwright test --debug -g 'webapp deve estar online'
# Gerar testes com Codegen
yarn playwright codegen
```

Sugestão para começar: `yarn playwright test`.
