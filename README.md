# 🏛️ PROJETO IMPÉRIOS — Ascensão das Civilizações

**MMO de Estratégia Histórica, Construção de Vilas Persistentes e Combate PvP Assíncrono**

---

## 🎯 Visão Geral da Fase 1 (Vertical Slice: Império Persa)

O projeto adota uma arquitetura limpa, orientada a dados e modular, preparada para suportar até 12 civilizações históricas, 6 eras evolutivas e persistência autoritativa no servidor.

### 🌐 Deploy Live Cloudflare
* **URL de Produção Cloudflare Pages:** [https://vilas-proton.pages.dev](https://vilas-proton.pages.dev)
* **Subdomínio Customizado Vinculado:** `vilas.proton.ia.br` (requer apenas registro CNAME `vilas` -> `vilas-proton.pages.dev` no painel Cloudflare DNS da zona `proton.ia.br`).
* **API Edge Functions Autoritativa:** `https://vilas-proton.pages.dev/api/health`

---

## 🏗️ Estrutura do Repositório

```text
imperios-ascensao/
├── .github/
│   └── workflows/
│       └── ci.yml                 # Pipeline CI/CD: testes, build e deploy Cloudflare
├── client/
│   ├── unity/                     # Projeto Unity (URP, C#, Addressables, Câmera Isométrica)
│   │   ├── Assets/
│   │   │   └── Scripts/
│   │   │       ├── Civilizations/ # Definições orientadas a dados e bônus persas
│   │   │       ├── Grid/          # Grade isométrica 40x40 e conversão de coordenadas
│   │   │       ├── Buildings/     # Controladores de ciclo de vida e vida útil
│   │   │       ├── Economy/       # Cache local não-autoritativo e sincronização
│   │   │       ├── Combat/        # Replay determinístico de eventos
│   │   │       ├── UI/            # Câmera isométrica (toque/pan/zoom) e HUD
│   │   │       └── Network/       # Cliente UnityWebRequest
│   │   ├── Packages/manifest.json # Pacotes oficiais Unity LTS
│   │   └── ProjectSettings/       # Configuração Unity 2022.3 LTS
│   └── web/                       # Cliente WebGL/Canvas jogável e Cloudflare Pages
│       ├── public/
│       │   └── index.html         # Vertical slice interativa jogável do Império Persa
│       └── functions/api/         # API Serverless no Edge do Cloudflare Pages
├── server/                        # Backend autoritativo Node.js / TypeScript / Fastify
│   ├── prisma/
│   │   └── schema.prisma          # 25 modelos relacionais autoritativos (Prisma ORM)
│   ├── src/
│   │   ├── config/                # Variáveis de ambiente e constantes
│   │   ├── modules/
│   │   │   ├── auth/              # Autenticação de convidado (Guest) e JWT
│   │   │   ├── civilization/      # Catálogo e dados da civilização persa
│   │   │   ├── village/           # Grade isométrica e validação de edifícios
│   │   │   ├── economy/           # Cálculo autoritativo offline e integridade de saldo
│   │   │   ├── units/             # Recrutamento de Imortais e filas de treino
│   │   │   └── combat/            # Motor de simulação PvP determinístico
│   │   ├── app.ts                 # Instância e rotas Fastify
│   │   └── index.ts               # Ponto de entrada do servidor
│   └── tests/
│       └── vertical_slice.test.ts # Suite de 9 testes automatizados (Vitest)
└── shared/                        # Contratos compartilhados, DTOs e tipos TypeScript
    └── src/
        ├── types/                 # Civilizações, Economia, Grade, Edifícios, Unidades, Combate
        └── contracts/             # Interfaces de requisições e respostas da API REST
```

---

## 🛡️ Regras Fundamentais de Arquitetura

1. **Integridade Econômica com Inteiros:** Saldos monetários e de recursos utilizam inteiros estritos (`BigInt` / inteiros seguros), nunca números de ponto flutuante, evitando erros de arredondamento e duplicação.
2. **Servidor Autoritativo:** Produção offline calculada exclusivamente por timestamps UTC confiáveis do servidor. O cliente nunca dita seus recursos ou o resultado de batalhas.
3. **Persistência Relacional:** Schema Prisma cobrindo todos os 25 modelos exigidos na especificação mestre (Users, Villages, Resources, Units, Battles, Shields, Alliances, etc.).
4. **Motor de Combate Determinístico:** Batalhas PvP assíncronas geram um log cronológico de eventos reproduzíveis, avaliando destruição (0% a 100%) e calculando de 0 a 3 estrelas canônicas.

---

## 🚀 Como Executar o Projeto Localmente

### 1. Pré-requisitos
* Node.js v20+ ou v24+
* Git
* Unity 2022.3 LTS (para o cliente Unity mobile)

### 2. Compilar o Módulo Shared
```bash
cd shared
npm install
npm run build
```

### 3. Executar os Testes Automatizados do Servidor
```bash
cd ../server
npm install
npm test
```
*Executa 9 testes unitários e de integração cobrindo economia offline, prevenção de saldos negativos, detecção de colisões espaciais na grade isométrica, motor de combate determinístico e endpoints REST Fastify.*

### 4. Iniciar o Backend Localmente
```bash
cd ../server
npm run dev
```
*O servidor estará acessível em `http://localhost:3000`.*

### 5. Executar o Cliente Web / Testar Deploy Cloudflare
Para executar localmente via Wrangler:
```bash
cd ../client/web
npx wrangler pages dev public
```
Ou acesse diretamente a versão em produção:
* **[https://vilas-proton.pages.dev](https://vilas-proton.pages.dev)**
* **Subdomínio planejado:** `https://vilas.proton.ia.br`
