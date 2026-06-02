# Celeris API

> Backend RESTful do sistema **Celeris** — Triagem Inteligente do Judiciário.

🔗 **Frontend do projeto:** [github.com/sofiamassaro/CELERIS](https://github.com/sofiamassaro/CELERIS)

---

## Sobre o projeto

Esta API serve como camada de persistência e regras de negócio do **Celeris**, um ecossistema de triagem inteligente desenvolvido para o Judiciário brasileiro. O sistema atua na porta de entrada dos Tribunais, classificando automaticamente petições iniciais e organizando a fila de trabalho dos servidores.

O nome vem do latim *celeritas* (rapidez, prontidão), em referência ao **Princípio da Celeridade Processual** garantido pela Constituição Federal.

---


## Stack

| Camada | Tecnologia |
|--------|-----------|
| Runtime | Node.js 18+ |
| Framework | Express 5 |
| Banco | PostgreSQL 18 |
| Driver SQL | pg (node-postgres) |
| Variáveis de ambiente | dotenv |
| CORS | cors |

---

## Modelagem do banco

### Tabelas

```
┌──────────────────┐         ┌─────────────────────┐         ┌──────────┐
│    processos     │ 1     N │   processos_tags    │ N     1 │   tags   │
│──────────────────│ ◄─────► │─────────────────────│ ◄─────► │──────────│
│ id (PK)          │         │ processo_id (FK)    │         │ id (PK)  │
│ numero (UNIQUE)  │         │ tag_id (FK)         │         │ nome     │
│ data_entrada     │         │ PRIMARY KEY (p, t)  │         │   UNIQUE │
│ requerente       │         └─────────────────────┘         │ criado_em│
│ cpf_requerente   │              ON DELETE CASCADE          └──────────┘
│ requerido        │
│ cpf_requerido    │
│ assunto          │
│ status (CHECK)   │  status ∈ { normal, prioritario, urgente }
│ repetitivos      │
│ conteudo         │
│ observacoes      │
│ criado_em        │
│ atualizado_em    │
└──────────────────┘
```

Relacionamento **N-N** entre processos e tags via tabela de junção `processos_tags`. O `ON DELETE CASCADE` garante que ao remover um processo, suas ligações com tags são apagadas automaticamente.

---

## Endpoints

### Tags

| Verbo | Rota | Descrição | Status sucesso |
|-------|------|-----------|----------------|
| GET | `/tags` | Lista todas | 200 |
| GET | `/tags/:id` | Busca por id | 200 |
| POST | `/tags` | Cria | 201 |
| PUT | `/tags/:id` | Atualiza | 200 |
| DELETE | `/tags/:id` | Remove | 204 |

**Body de POST/PUT:**
```json
{ "nome": "Direito Bancário" }
```

### Processos

| Verbo | Rota | Descrição | Status sucesso |
|-------|------|-----------|----------------|
| GET | `/processos` | Lista todos com tags | 200 |
| GET | `/processos/:id` | Busca por id com tags | 200 |
| POST | `/processos` | Cria com tags vinculadas | 201 |
| PUT | `/processos/:id` | Atualiza (substitui tags) | 200 |
| DELETE | `/processos/:id` | Remove | 204 |

**Body de POST/PUT:**
```json
{
  "numero": "5005000-99.2024.8.24.0023",
  "data_entrada": "2024-12-01",
  "requerente": "João da Silva",
  "cpf_requerente": "111.222.333-44",
  "requerido": "Banco do Brasil S.A.",
  "cpf_requerido": "00.000.000/0001-00",
  "assunto": "Ação Revisional de Juros",
  "status": "urgente",
  "repetitivos": 0,
  "conteudo": "Texto da petição...",
  "observacoes": "Notas internas",
  "tag_ids": [1, 2]
}
```

### Códigos de resposta

| Código | Significado |
|--------|-------------|
| 200 | OK — leitura ou atualização |
| 201 | Criado — novo recurso |
| 204 | Sem conteúdo — após DELETE |
| 400 | Requisição inválida — campos faltando ou inválidos |
| 404 | Não encontrado — id inexistente |
| 409 | Conflito — duplicação (UNIQUE violado) |
| 500 | Erro interno do servidor |

---

## Como rodar localmente

### Pré-requisitos

- Node.js 18 ou superior
- PostgreSQL 14 ou superior (testado em 18)
- Git

### Setup

```bash
# 1. Clonar o repositório
git clone https://github.com/sofiamassaro/celeris-api.git
cd celeris-api

# 2. Instalar dependências
npm install

# 3. Criar o banco de dados no PostgreSQL
# (via pgAdmin ou psql)
createdb celeris

# 4. Aplicar schema e dados iniciais
psql -d celeris -f src/db/schema.sql
psql -d celeris -f src/db/seed.sql

# 5. Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com a senha do PostgreSQL local

# 6. Rodar em modo desenvolvimento
npm run dev
```

A API estará disponível em **http://localhost:3000**.

### Scripts disponíveis

- `npm run dev` — modo desenvolvimento com auto-reload
- `npm start` — modo produção

---

## Equipe

**Sofia Massaro** — concepção, modelagem, backend e integração

---

## Licença

MIT
