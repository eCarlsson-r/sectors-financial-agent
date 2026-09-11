# Sectors Financial Agent 📈🤖

An AI-powered financial intelligence agent for the Indonesian Stock Exchange (IDX), built with [NestJS](https://nestjs.com) and powered by [Sectors.app API](https://sectors.app) and Google Gemini (`gemini-3.6-flash`).

The agent aggregates real-time company reports and market metrics from Sectors.app, runs automated financial comparisons, and produces structured equity research analysis and portfolio risk assessments.

---

## 🌟 Features

- **Automated IDX Stock Comparison**: Compare 2–5 IDX companies simultaneously across valuation (P/E, PBV), profitability (ROE, Net Margin), and growth.
- **Portfolio Risk Scoring & Evaluation**: Analyzes weighted holdings of IDX stocks against real-time company fundamentals, calculating quantitative risk scores (0–100), sector concentration risks, downside volatility metrics, and actionable rebalancing recommendations.
- **AI Equity Analyst Integration**: Employs Google Gemini (`gemini-3.6-flash` via `@google/genai`) configured as a senior IDX equity research analyst and risk manager to generate structured markdown reports with investment theses.
- **Customizable Research Focus**: Direct the agent's analytical focus towards specific investment themes (e.g., `dividend`, `valuation`, `growth`, `debt & liquidity`).
- **Parallel Data Ingestion**: Concurrently retrieves comprehensive company report payloads from Sectors.app v2 API.
- **Extensible Architecture**: Modular NestJS design with DTO validation (`class-validator`) and ready-to-expand data contracts for single-stock deep dives and sector overviews.

---

## 🏗️ Architecture

```
src/
├── main.ts                     # Application entrypoint (Port 3000)
├── app.module.ts               # Root module importing feature modules & ConfigModule
├── sectors/                    # Sectors.app integration
│   ├── sectors.module.ts
│   └── sectors.service.ts      # Multi-company & portfolio market data ingestion via Sectors.app v2 API
├── agent/                      # LLM Agent orchestration
│   ├── agent.module.ts
│   └── agent.service.ts        # Gemini 3.6 Flash prompt engineering, comparison & portfolio risk evaluation
└── financial/                  # Financial REST API & DTO validation
    ├── financial.module.ts
    ├── financial.controller.ts # Route handlers (/api/financial/*)
    └── dto/
        ├── stock-comparison.dto.ts # Validation for multi-stock comparison
        ├── portfolio-risk.dto.ts   # Validation for weighted portfolio holdings & risk evaluation
        └── generate-report.dto.ts  # (Planned) Single-stock & sector overview DTO
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v20+ recommended
- **Sectors.app API Key**: Obtain from [Sectors.app](https://sectors.app)
- **Gemini API Key**: Obtain from [Google AI Studio](https://aistudio.google.com)

### Installation

1. **Clone the repository and install dependencies:**

   ```bash
   git clone <repository-url>
   cd sectors-financial-agent
   npm install
   ```

2. **Configure Environment Variables:**

   Create a `.env` file in the root directory (based on `.env.example`):

   ```bash
   cp .env.example .env
   ```

   Configure the required variables:

   ```env
   # Sectors API
   SECTORS_API_KEY=your_sectors_api_key_here
   SECTORS_BASE_URL=https://api.sectors.app/v2

   # Google Gemini
   GEMINI_API_KEY=your_gemini_api_key_here

   # Application Settings
   PORT=3000
   ```

---

## 💻 Running the Application

```bash
# Development mode with hot-reload
npm run start:dev

# Standard start
npm run start

# Production build & run
npm run build
npm run start:prod
```

The application will start on `http://localhost:3000` (or the configured `PORT`).

---

## 📡 API Reference

### 1. Compare Stocks

Runs parallel company report lookups on Sectors.app and triggers the Gemini research agent to compare financial metrics and issue an investment verdict.

- **Endpoint:** `POST /api/financial/compare`
- **Headers:** `Content-Type: application/json`

#### Request Body

| Field       | Type       | Required | Constraints     | Description                                                          |
| ----------- | ---------- | -------- | --------------- | -------------------------------------------------------------------- |
| `tickers`   | `string[]` | **Yes**  | Min: 2, Max: 5  | Array of IDX stock ticker symbols (e.g. `["BBCA", "BBRI"]`)          |
| `focusArea` | `string`   | No       | Optional string | Target analysis focus (e.g. `"dividend"`, `"valuation"`, `"growth"`) |

#### Example Request

```bash
curl -X POST http://localhost:3000/api/financial/compare \
  -H "Content-Type: application/json" \
  -d '{
    "tickers": ["BBCA", "BBRI", "BMRI"],
    "focusArea": "dividend and valuation"
  }'
```

#### Example Response

```json
{
  "success": true,
  "comparedTickers": ["BBCA", "BBRI", "BMRI"],
  "focusArea": "dividend and valuation",
  "timestamp": "2026-09-10T15:45:00.000Z",
  "analysis": "## 1. Executive Summary\n...\n\n## 2. Key Financial Metrics Table\n| Metric | BBCA | BBRI | BMRI |\n|---|---|---|---|\n| P/E | ... | ... | ... |\n| PBV | ... | ... | ... |\n| ROE | ... | ... | ... |\n\n## 3. Focus Analysis (dividend and valuation)\n...\n\n## 4. Final Investment Thesis & Recommendation\n..."
}
```

---

### 2. Evaluate Portfolio Risk

Ingests weighted IDX portfolio holdings, fetches real-time market data from Sectors.app in parallel, and runs the Gemini quantitative risk agent to calculate an overall risk score (0–100), sector concentration breakdown, downside volatility analysis, and actionable rebalancing recommendations.

- **Endpoint:** `POST /api/financial/risk-score`
- **Headers:** `Content-Type: application/json`

#### Request Body

| Field            | Type       | Required | Constraints               | Description                                                   |
| ---------------- | ---------- | -------- | ------------------------- | ------------------------------------------------------------- |
| `items`          | `object[]` | **Yes**  | Min: 1 position           | Array of portfolio holding objects                            |
| `items[].ticker` | `string`   | **Yes**  | Non-empty string          | IDX stock ticker symbol (e.g. `"BBCA"`, `"BBRI"`, `"ASII"`)   |
| `items[].weight` | `number`   | **Yes**  | Min: `0.01`, Max: `1.0`   | Decimal weight representing position size (e.g. `0.4` for 40%) |

#### Example Request

```bash
curl -X POST http://localhost:3000/api/financial/risk-score \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      { "ticker": "BBCA", "weight": 0.4 },
      { "ticker": "BBRI", "weight": 0.3 },
      { "ticker": "ASII", "weight": 0.3 }
    ]
  }'
```

#### Example Response

```json
{
  "success": true,
  "totalHoldings": 3,
  "timestamp": "2026-09-11T08:20:00.000Z",
  "riskAnalysis": "## 1. Overall Portfolio Risk Score\n**Risk Score: 38/100 (Moderate Risk)**\n\nThe portfolio is anchored by high-quality large-cap financial institutions with moderate cyclical exposure via ASII...\n\n## 2. Sector Concentration & Diversification Analysis\n- **Financial Services (70%)**: Substantial exposure to BBCA and BBRI...\n- **Consumer Cyclical / Conglomerate (30%)**: ASII...\n\n## 3. Volatility & Downside Metrics\n- **Beta Profile**: Low to moderate aggregate beta...\n- **Valuation & Debt**: Solid balance sheet health...\n\n## 4. Actionable Rebalancing Plan\n- Consider trimming financial weighting towards 50% to reduce sector concentration.\n- Introduce defensive consumer staples (e.g., ICBP) or infrastructure/telecom (e.g., TLKM)."
}
```

---

### 3. Health / Hello

Basic sanity endpoint to verify server status.

- **Endpoint:** `GET /`
- **Response:** `Hello World!`

---

## 🧪 Testing & Code Quality

```bash
# Run unit tests (Vitest)
npm run test

# Run unit tests in watch mode
npm run test:watch

# Run test coverage
npm run test:cov

# Run e2e tests
npm run test:e2e

# Run linter (oxlint)
npm run lint

# Format code with Prettier
npm run format
```

---

## 🛠️ Tech Stack

- **Framework**: [NestJS 12](https://nestjs.com/)
- **Runtime**: [Node.js](https://nodejs.org/) & [TypeScript 6](https://www.typescriptlang.org/)
- **AI / LLM**: [@google/genai](https://www.npmjs.com/package/@google/genai) (`gemini-3.6-flash`)
- **Financial Data Provider**: [Sectors.app API](https://sectors.app)
- **Validation**: [class-validator](https://github.com/typestack/class-validator) & [class-transformer](https://github.com/typestack/class-transformer)
- **Testing**: [Vitest](https://vitest.dev/)
- **Linter**: [Oxlint](https://oxc.rs/docs/guide/usage/linter.html)

---

## 📄 License

This project is private and unlicensed.
