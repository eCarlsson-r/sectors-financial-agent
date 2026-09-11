# 📊 Sectors AI Financial Agent (Track 03)

> **Google Cloud Gen AI Academy APAC Hackathon & Sectors.app Challenge**  
> _Production-Ready Multi-Agent Orchestration Engine built with NestJS, Gemini 3.6 Flash, and Cloud Run._

---

## 🌟 Executive Summary

The **Sectors AI Financial Agent** is an institutional-grade equity research and portfolio risk analysis suite built for the Indonesian Stock Exchange (IDX). It transforms raw market feeds from **Sectors.app** into actionable financial intelligence, comparative matrices, and risk metrics using **Gemini 3.6 Flash**.

Built on **NestJS**, the architecture follows strict modular decoupling, strong type-safety via validation DTOs, and serverless scalability on **Google Cloud Run**.

---

## 🚀 Key Features

- **📈 Multi-Stock Comparison Engine (`/api/financial/compare`)**: Parallel retrieval of multi-company metrics across valuation ($P/E, P/BV$), profitability ($ROE$), and growth indicators synthesized into Markdown analysis.
- **🛡️ Portfolio Risk Scoring (`/api/financial/risk-score`)**: Multi-asset weighted portfolio risk evaluation providing single-point downside metrics ($0-100$), sector concentration analysis, and rebalancing suggestions.
- **📄 Automated Equity Research Reports (`/api/financial/report`)**: Institutional-grade equity research generation for company tickers.
- **💻 Interactive Reviewer Dashboard (`/`)**: Embedded Tailwind-styled frontend UI served directly by NestJS for instant API testing.

---

## 🔐 DevSecOps & Security Architecture

- **Zero Hardcoded Secrets**: Leverages **Google Cloud Secret Manager** at runtime to fetch both `GEMINI_API_KEY` and `SECTORS_API_KEY`.
- **Request Validation Layer**: Uses `class-validator` and `class-transformer` pipes to strip non-whitelisted properties and enforce input boundary types.
- **Stateless Containerization**: Built via multi-stage Docker builds to ensure minimal image footprint and fast cold starts on Cloud Run.

---

## 📁 Project Architecture

```text
src/
├── app.module.ts               # Root Application Module
├── app.controller.ts           # Serves Embedded Reviewer Web UI
├── main.ts                     # NestJS Bootstrap & Global Validation Pipes
├── sectors/                    # Sectors.app API Integration Layer
│   ├── sectors.module.ts
│   └── sectors.service.ts
├── agent/                      # Gemini AI Agent Orchestration
│   ├── agent.module.ts
│   └── agent.service.ts
└── financial/                  # Business Logic & Controllers
    ├── financial.controller.ts
    ├── financial.module.ts
    └── dto/                    # Class Validator DTOs
        ├── stock-comparison.dto.ts
        ├── portfolio-risk.dto.ts
        └── generate-report.dto.ts
```

---

## ⚡ Quick Start (Local Development)

### 1. Prerequisites

- **Node.js**: v20+ recommended
- **Sectors.app API Key**: Obtain from [Sectors.app](https://sectors.app)
- **Gemini API Key**: Obtain from [Google AI Studio](https://aistudio.google.com)

### 2. Installation

```bash
# Clone repository
git clone [https://github.com/YOUR_USERNAME/sectors-financial-agent.git](https://github.com/YOUR_USERNAME/sectors-financial-agent.git)
cd sectors-financial-agent

# Install dependencies
npm install
```

### 3. Environment Setup

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
GEMINI_MODEL=gemini-3.6-flash

# Application Settings
PORT=3000
```

### 4. Run Development Server

```bash
# Development mode with hot-reload
npm run start:dev

# Standard start
npm run start

# Production build & run
npm run build
npm run start:prod
```

Open `http://localhost:3000` in your browser to access the interactive dashboard!

---

## ☁️ Deploy to Google Cloud Run

Deploy directly to Google Cloud Run with dynamic Secret Manager bindings using Google Cloud Build:

```bash
gcloud builds submit --config cloudbuild.yaml .
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
