import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class AppController {
  @Get()
  getDashboard(@Res() res: Response) {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sectors AI Financial Agent (Track 03)</title>
  <script src="https://cdn.tailwindcss.com?plugins=typography"></script>
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <style>
    /* Custom scrollbar and dropdown styles */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: #0f172a; }
    ::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #10b981; }
    
    .prose-custom table { width: 100%; border-collapse: collapse; margin-top: 1rem; margin-bottom: 1rem; }
    .prose-custom th { background: #1e293b; color: #34d399; font-weight: 600; text-align: left; padding: 0.75rem 1rem; border: 1px solid #334155; }
    .prose-custom td { padding: 0.75rem 1rem; border: 1px solid #334155; }
    .prose-custom tr:nth-child(even) { background: #0f172a80; }
    .prose-custom tr:hover { background: #1e293b50; }
    .prose-custom h1, .prose-custom h2, .prose-custom h3 { color: #34d399; margin-top: 1.5rem; margin-bottom: 0.5rem; font-weight: 700; }
    .prose-custom h1 { font-size: 1.5rem; border-bottom: 1px solid #334155; padding-bottom: 0.5rem; }
    .prose-custom h2 { font-size: 1.25rem; }
    .prose-custom h3 { font-size: 1.1rem; }
    .prose-custom ul { list-style-type: disc; padding-left: 1.5rem; margin: 0.5rem 0; }
    .prose-custom ol { list-style-type: decimal; padding-left: 1.5rem; margin: 0.5rem 0; }
    .prose-custom p { margin-bottom: 0.75rem; line-height: 1.6; }
    .prose-custom strong { color: #f8fafc; }
    .prose-custom blockquote { border-left: 4px solid #10b981; padding-left: 1rem; color: #94a3b8; font-style: italic; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen p-4 sm:p-8 selection:bg-emerald-500 selection:text-slate-950">
  <div class="max-w-5xl mx-auto space-y-6">
    <!-- Header -->
    <header class="bg-slate-900/80 backdrop-blur border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
      <div>
        <div class="flex items-center gap-3">
          <span class="text-3xl">📊</span>
          <h1 class="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
            Sectors AI Financial Agent
          </h1>
          <span class="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            IDX Market AI
          </span>
        </div>
        <p class="text-slate-400 text-sm mt-1">
          Track 03 — Multi-Agent Orchestration & Financial Workflows (NestJS + Gemini + Sectors API)
        </p>
      </div>
      <div class="flex items-center gap-2 self-start md:self-auto text-xs text-slate-400 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800">
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        API Online
      </div>
    </header>

    <!-- Navigation Tabs -->
    <nav class="grid grid-cols-1 sm:grid-cols-3 gap-3 p-1.5 bg-slate-900/60 rounded-xl border border-slate-800/80">
      <button id="tab-compare" onclick="setTab('compare')" class="flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-150">
        <span>⚖️</span> Stock Comparison
      </button>
      <button id="tab-risk" onclick="setTab('risk')" class="flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-150">
        <span>🛡️</span> Portfolio Risk Scoring
      </button>
      <button id="tab-report" onclick="setTab('report')" class="flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-150">
        <span>📑</span> Equity Report Generator
      </button>
    </nav>

    <!-- Main Interactive Form Card -->
    <div class="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
      <form id="agent-form" onsubmit="handleSubmit(event)" class="space-y-6">
        <div id="form-inputs"></div>
        
        <button id="submit-btn" type="submit" class="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 font-bold rounded-xl text-slate-950 shadow-lg shadow-emerald-500/20 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]">
          <span id="btn-icon">⚡</span>
          <span id="btn-text">Run AI Analysis</span>
        </button>
      </form>
    </div>

    <!-- Agent Output Panel -->
    <div id="output-container" class="hidden bg-slate-900/95 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-4">
      <div class="flex items-center justify-between border-b border-slate-800 pb-4">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          <h2 class="text-lg font-bold text-emerald-400">Agent Synthesis & Research Output</h2>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="copyOutput()" id="copy-btn" class="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1.5 transition-colors">
            <span>📋</span> Copy
          </button>
          <button onclick="clearOutput()" class="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 transition-colors">
            ✕ Clear
          </button>
        </div>
      </div>
      
      <div id="loading-spinner" class="hidden py-12 flex flex-col items-center justify-center gap-3">
        <div class="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin"></div>
        <p id="loading-msg" class="text-sm font-medium text-slate-400 animate-pulse">Aggregating live IDX market data & synthesizing with Gemini AI...</p>
      </div>

      <div id="output-content" class="prose-custom text-slate-200 text-sm leading-relaxed overflow-x-auto"></div>
      <pre id="output-raw" class="hidden font-mono text-xs bg-slate-950 p-4 rounded-xl border border-slate-800/80 text-emerald-300 overflow-x-auto"></pre>
    </div>
  </div>

  <script>
    // Master IDX stock list with symbols, full names, and sectors
    const IDX_STOCKS = [
      { ticker: 'BBCA', name: 'Bank Central Asia', sector: 'Financials' },
      { ticker: 'BBRI', name: 'Bank Rakyat Indonesia', sector: 'Financials' },
      { ticker: 'BMRI', name: 'Bank Mandiri', sector: 'Financials' },
      { ticker: 'BBNI', name: 'Bank Negara Indonesia', sector: 'Financials' },
      { ticker: 'BRIS', name: 'Bank Syariah Indonesia', sector: 'Financials' },
      { ticker: 'TLKM', name: 'Telkom Indonesia', sector: 'Infrastructure' },
      { ticker: 'ASII', name: 'Astra International', sector: 'Industrials' },
      { ticker: 'GOTO', name: 'GoTo Gojek Tokopedia', sector: 'Technology' },
      { ticker: 'ADRO', name: 'Adaro Energy Indonesia', sector: 'Energy' },
      { ticker: 'PTBA', name: 'Bukit Asam', sector: 'Energy' },
      { ticker: 'MEDC', name: 'Medco Energi Internasional', sector: 'Energy' },
      { ticker: 'BUMI', name: 'Bumi Resources', sector: 'Energy' },
      { ticker: 'UNVR', name: 'Unilever Indonesia', sector: 'Consumer Non-Cyclicals' },
      { ticker: 'ICBP', name: 'Indofood CBP Sukses Makmur', sector: 'Consumer Non-Cyclicals' },
      { ticker: 'INDF', name: 'Indofood Sukses Makmur', sector: 'Consumer Non-Cyclicals' },
      { ticker: 'AMMN', name: 'Amman Mineral Internasional', sector: 'Basic Materials' },
      { ticker: 'ANTM', name: 'Aneka Tambang', sector: 'Basic Materials' },
      { ticker: 'INCO', name: 'Vale Indonesia', sector: 'Basic Materials' },
      { ticker: 'MDKA', name: 'Merdeka Copper Gold', sector: 'Basic Materials' },
      { ticker: 'KLBF', name: 'Kalbe Farma', sector: 'Healthcare' },
      { ticker: 'CPIN', name: 'Charoen Pokphand Indonesia', sector: 'Consumer Non-Cyclicals' },
      { ticker: 'PGAS', name: 'Perusahaan Gas Negara', sector: 'Utilities' },
      { ticker: 'SMGR', name: 'Semen Indonesia', sector: 'Basic Materials' },
      { ticker: 'EXCL', name: 'XL Axiata', sector: 'Infrastructure' },
      { ticker: 'ACES', name: 'Aspirasi Hidup Indonesia', sector: 'Consumer Cyclicals' },
      { ticker: 'AMRT', name: 'Sumber Alfaria Trijaya', sector: 'Consumer Non-Cyclicals' },
      { ticker: 'TOWR', name: 'Sarana Menara Nusantara', sector: 'Infrastructure' }
    ];

    const IDX_SECTORS = [
      { id: 'financials', name: 'Financials (Perbankan & Jasa Keuangan)' },
      { id: 'energy', name: 'Energy (Minyak, Gas & Batubara)' },
      { id: 'basic-materials', name: 'Basic Materials (Tambang & Kimia)' },
      { id: 'consumer-non-cyclicals', name: 'Consumer Non-Cyclicals (Makanan & Kebutuhan Primer)' },
      { id: 'consumer-cyclicals', name: 'Consumer Cyclicals (Ritel & Otomotif)' },
      { id: 'healthcare', name: 'Healthcare (Farmasi & Rumah Sakit)' },
      { id: 'industrials', name: 'Industrials (Konglomerasi & Manufaktur)' },
      { id: 'infrastructure', name: 'Infrastructure (Telekomunikasi & Konstruksi)' },
      { id: 'technology', name: 'Technology (Software & Layanan Digital)' },
      { id: 'properties-real-estate', name: 'Properties & Real Estate' },
      { id: 'transportation-logistics', name: 'Transportation & Logistics' }
    ];

    // State
    let activeTab = 'compare';
    let selectedCompareTickers = ['BBCA', 'BBRI', 'BMRI'];
    let compareSearchTerm = '';
    let compareSectorFilter = 'ALL';
    let portfolioRows = [
      { ticker: 'BBCA', weight: 40 },
      { ticker: 'GOTO', weight: 30 },
      { ticker: 'ADRO', weight: 30 }
    ];
    let showJsonPayload = false;
    let selectedSingleTarget = 'TLKM';
    let selectedReportType = 'EQUITY_RESEARCH';
    let lastRawOutput = '';

    // Tab switching
    function setTab(tab) {
      activeTab = tab;
      
      // Update Tab Styles
      ['compare', 'risk', 'report'].forEach(t => {
        const btn = document.getElementById('tab-' + t);
        if (t === tab) {
          btn.className = 'flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-bold text-sm bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 transition-all';
        } else {
          btn.className = 'flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all';
        }
      });

      renderTabContent();
    }

    function renderTabContent() {
      const container = document.getElementById('form-inputs');
      if (activeTab === 'compare') {
        renderCompareTab(container);
      } else if (activeTab === 'risk') {
        renderRiskTab(container);
      } else {
        renderReportTab(container);
      }
    }

    // =========================================================================
    // 1. Stock Comparison Tab (Tickers input as Multiple Select + Comma-sync)
    // =========================================================================
    function renderCompareTab(container) {
      const filteredStocks = IDX_STOCKS.filter(s => {
        const matchesSearch = !compareSearchTerm || 
          s.ticker.toLowerCase().includes(compareSearchTerm.toLowerCase()) || 
          s.name.toLowerCase().includes(compareSearchTerm.toLowerCase());
        const matchesSector = compareSectorFilter === 'ALL' || s.sector.toLowerCase().includes(compareSectorFilter.toLowerCase());
        return matchesSearch && matchesSector;
      });

      container.innerHTML = \`
        <div class="space-y-5">
          <!-- Section Title & Counter Badge -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <label class="block text-sm font-semibold text-slate-200">
                Tickers: Multiple Select
              </label>
              <p class="text-xs text-slate-400">Select 2 to 5 IDX tickers from the catalog or paste comma-separated symbols</p>
            </div>
            <div class="flex items-center gap-2">
              <span id="ticker-count-badge" class="text-xs px-2.5 py-1 rounded-full font-mono font-semibold \${
                selectedCompareTickers.length >= 2 && selectedCompareTickers.length <= 5 
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
              }">
                \${selectedCompareTickers.length} / 5 Selected (Min: 2)
              </span>
              \${selectedCompareTickers.length > 0 ? \`
                <button type="button" onclick="clearCompareTickers()" class="text-xs text-slate-400 hover:text-rose-400 px-2 py-1 rounded hover:bg-slate-800 transition-colors">
                  Clear All
                </button>
              \` : ''}
            </div>
          </div>

          <!-- Active Selected Ticker Chips (Pill Multi-Select Box) -->
          <div class="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
            <div class="flex items-center justify-between text-xs text-slate-400">
              <span class="font-medium flex items-center gap-1.5">
                <span>🏷️</span> Active Selections (\${selectedCompareTickers.length})
              </span>
              <span class="text-[11px] text-slate-500">Click ✕ to remove any position</span>
            </div>
            <div id="selected-chips" class="flex flex-wrap gap-2 min-h-[44px] items-center">
              \${selectedCompareTickers.map(t => {
                const info = IDX_STOCKS.find(s => s.ticker === t);
                return \`
                  <span class="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 px-3 py-1 rounded-lg text-xs sm:text-sm font-semibold shadow-sm transition-all hover:border-emerald-500/60">
                    <span class="font-mono">\${t}</span>
                    \${info ? \`<span class="text-[11px] font-normal text-emerald-400/80">(\${info.name.split(' ')[0]})</span>\` : ''}
                    <button type="button" onclick="toggleCompareTicker('\${t}')" class="text-emerald-400 hover:text-emerald-100 hover:bg-emerald-500/30 rounded p-0.5 ml-0.5 transition-colors" title="Remove \${t}">
                      ✕
                    </button>
                  </span>
                \`;
              }).join('')}
              \${selectedCompareTickers.length === 0 ? '<span class="text-xs text-slate-500 italic py-1">No tickers selected yet. Use the multi-select options below.</span>' : ''}
            </div>
          </div>

          <!-- Interactive Multi-Select Filter & Stock Picker Grid -->
          <div class="bg-slate-950/60 border border-slate-800/90 rounded-xl p-4 space-y-3">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div class="flex items-center gap-2 flex-1">
                <div class="relative w-full max-w-sm">
                  <span class="absolute left-3 top-2.5 text-xs text-slate-500">🔍</span>
                  <input 
                    type="text" 
                    id="compare-search"
                    placeholder="Search ticker, name, or sector..." 
                    value="\${compareSearchTerm}"
                    oninput="handleCompareSearch(this.value)"
                    class="w-full pl-8 pr-3 py-2 text-xs bg-slate-900 border border-slate-700/80 rounded-lg text-slate-200 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                \${compareSearchTerm ? \`
                  <button type="button" onclick="handleCompareSearch('')" class="text-xs text-slate-400 hover:text-slate-200">Reset</button>
                \` : ''}
              </div>

              <!-- Quick Sector Filter Buttons -->
              <div class="flex flex-wrap items-center gap-1 text-[11px]">
                <button type="button" onclick="setCompareSectorFilter('ALL')" class="px-2 py-1 rounded \${compareSectorFilter === 'ALL' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}">All</button>
                <button type="button" onclick="setCompareSectorFilter('Financials')" class="px-2 py-1 rounded \${compareSectorFilter === 'Financials' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}">Financials</button>
                <button type="button" onclick="setCompareSectorFilter('Energy')" class="px-2 py-1 rounded \${compareSectorFilter === 'Energy' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}">Energy</button>
                <button type="button" onclick="setCompareSectorFilter('Consumer')" class="px-2 py-1 rounded \${compareSectorFilter === 'Consumer' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}">Consumer</button>
                <button type="button" onclick="setCompareSectorFilter('Materials')" class="px-2 py-1 rounded \${compareSectorFilter === 'Materials' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}">Materials</button>
              </div>
            </div>

            <!-- Multi-Select Checkbox Tiles -->
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-52 overflow-y-auto pr-1">
              \${filteredStocks.map(stock => {
                const isSelected = selectedCompareTickers.includes(stock.ticker);
                const isMax = selectedCompareTickers.length >= 5 && !isSelected;
                return \`
                  <button 
                    type="button" 
                    onclick="toggleCompareTicker('\${stock.ticker}')"
                    \${isMax ? 'disabled title="Max 5 tickers reached"' : ''}
                    class="p-2.5 rounded-lg border text-left flex items-center justify-between gap-1.5 transition-all text-xs \${
                      isSelected 
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-semibold shadow-sm' 
                        : isMax 
                          ? 'opacity-40 cursor-not-allowed bg-slate-950 border-slate-900 text-slate-500' 
                          : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
                    }"
                  >
                    <div class="truncate">
                      <div class="font-mono font-bold text-sm \${isSelected ? 'text-emerald-300' : 'text-slate-200'}">\${stock.ticker}</div>
                      <div class="text-[10px] text-slate-400 truncate">\${stock.name}</div>
                    </div>
                    <span class="w-4 h-4 rounded border flex items-center justify-center text-[10px] \${
                      isSelected 
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-bold' 
                        : 'border-slate-700 text-transparent'
                    }">✓</span>
                  </button>
                \`;
              }).join('')}
            </div>
          </div>

          <!-- Quick Comparison Baskets -->
          <div>
            <span class="block text-xs font-medium text-slate-400 mb-1.5">⚡ Instant Comparison Baskets:</span>
            <div class="flex flex-wrap gap-2">
              <button type="button" onclick="setCompareBasket(['BBCA', 'BBRI', 'BMRI', 'BBNI'])" class="px-2.5 py-1 text-xs rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/80 transition-colors">
                🏛️ Big 4 Banks (BBCA, BBRI, BMRI, BBNI)
              </button>
              <button type="button" onclick="setCompareBasket(['ADRO', 'PTBA', 'MEDC'])" class="px-2.5 py-1 text-xs rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/80 transition-colors">
                ⛏️ Energy & Mining (ADRO, PTBA, MEDC)
              </button>
              <button type="button" onclick="setCompareBasket(['TLKM', 'GOTO', 'EXCL'])" class="px-2.5 py-1 text-xs rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/80 transition-colors">
                📱 Tech & Telco (TLKM, GOTO, EXCL)
              </button>
              <button type="button" onclick="setCompareBasket(['UNVR', 'ICBP', 'INDF'])" class="px-2.5 py-1 text-xs rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/80 transition-colors">
                🛒 Consumer Staples (UNVR, ICBP, INDF)
              </button>
            </div>
          </div>

          <!-- Focus Area -->
          <div class="pt-2">
            <label class="block text-sm font-semibold text-slate-200 mb-1">Focus Area & Investment Angle</label>
            <input id="focusArea" type="text" value="Valuation, Profitability, and Dividend Yield" class="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:border-emerald-500 focus:outline-none" />
            <div class="flex flex-wrap gap-1.5 mt-2">
              <button type="button" onclick="setFocus('Valuation and Dividend Yield')" class="text-xs px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200">Valuation & Dividends</button>
              <button type="button" onclick="setFocus('Growth, Margins and ROE')" class="text-xs px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200">Growth & Profitability</button>
              <button type="button" onclick="setFocus('Debt, Solvency and Balance Sheet Health')" class="text-xs px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200">Solvency & Debt</button>
              <button type="button" onclick="setFocus('Competitive Moat and Market Share')" class="text-xs px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200">Market Moat</button>
            </div>
          </div>
        </div>
      \`;
    }

    function toggleCompareTicker(ticker) {
      const idx = selectedCompareTickers.indexOf(ticker);
      if (idx >= 0) {
        selectedCompareTickers.splice(idx, 1);
      } else {
        if (selectedCompareTickers.length >= 5) {
          alert('Maximum 5 tickers allowed per comparison.');
          return;
        }
        selectedCompareTickers.push(ticker);
      }
      renderCompareTab(document.getElementById('form-inputs'));
    }

    function clearCompareTickers() {
      selectedCompareTickers = [];
      renderCompareTab(document.getElementById('form-inputs'));
    }

    function handleCompareSearch(val) {
      compareSearchTerm = val;
      renderCompareTab(document.getElementById('form-inputs'));
      const input = document.getElementById('compare-search');
      if (input) {
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
      }
    }

    function setCompareSectorFilter(sector) {
      compareSectorFilter = sector;
      renderCompareTab(document.getElementById('form-inputs'));
    }

    function handleCommaInput(val) {
      if (!val) return;
      const parsed = val.split(',')
        .map(t => t.trim().toUpperCase())
        .filter(t => t.length > 0);
      
      const unique = Array.from(new Set(parsed));
      if (unique.length > 5) {
        alert('Maximum 5 tickers allowed. Limiting to first 5.');
        selectedCompareTickers = unique.slice(0, 5);
      } else {
        selectedCompareTickers = unique;
      }
      renderCompareTab(document.getElementById('form-inputs'));
    }

    function setCompareBasket(tickers) {
      selectedCompareTickers = [...tickers];
      renderCompareTab(document.getElementById('form-inputs'));
    }

    function setFocus(val) {
      const input = document.getElementById('focusArea');
      if (input) input.value = val;
    }

    // =========================================================================
    // 2. Portfolio Risk Scoring Tab (Portfolio Payload JSON as Tabular Form)
    // =========================================================================
    function renderRiskTab(container) {
      const totalWeight = portfolioRows.reduce((sum, r) => sum + (Number(r.weight) || 0), 0);
      const isSum100 = Math.abs(totalWeight - 100) < 0.1;

      // Construct live JSON payload
      const jsonPayload = {
        items: portfolioRows.map(r => ({
          ticker: r.ticker.toUpperCase(),
          weight: totalWeight > 0 ? Number((Number(r.weight) / 100).toFixed(4)) : 0.1
        }))
      };

      container.innerHTML = \`
        <div class="space-y-5">
          <!-- Section Title & Status Badge -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <label class="block text-sm font-semibold text-slate-200">
                Portfolio Payload (JSON): Tabular Form
              </label>
              <p class="text-xs text-slate-400">Configure your portfolio holdings via the interactive table below. Weights should sum to 100%.</p>
            </div>
            
            <div class="flex items-center gap-2">
              <span class="text-xs px-3 py-1 rounded-full font-mono font-semibold \${
                isSum100 
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                  : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
              }">
                Total: \${totalWeight.toFixed(1)}% (\${(totalWeight / 100).toFixed(2)})
              </span>
            </div>
          </div>

          <!-- Quick Presets -->
          <div class="flex flex-wrap items-center gap-2 text-xs">
            <span class="text-slate-400 font-medium">⚡ Quick Allocation Presets:</span>
            <button type="button" onclick="setRiskPreset('bluechip')" class="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/80 transition-colors">
              🏛️ Bluechip 60/40 (BBCA 40%, TLKM 30%, ASII 30%)
            </button>
            <button type="button" onclick="setRiskPreset('techEnergy')" class="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/80 transition-colors">
              ⚡ High-Beta (GOTO 40%, ADRO 35%, MEDC 25%)
            </button>
            <button type="button" onclick="setRiskPreset('dividend')" class="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/80 transition-colors">
              💰 Dividend Focus (BBRI 35%, BMRI 35%, PTBA 30%)
            </button>
          </div>

          <!-- Primary Tabular Form -->
          <div class="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950/70 shadow-inner">
            <table class="w-full text-left text-sm">
              <thead class="bg-slate-900/90 text-slate-300 text-xs uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th class="py-3 px-4 w-12 text-center">#</th>
                  <th class="py-3 px-4">Asset / Ticker (Single Select)</th>
                  <th class="py-3 px-4 w-32">Weight (%)</th>
                  <th class="py-3 px-4 min-w-[130px]">Allocation Bar</th>
                  <th class="py-3 px-4 text-center w-16">Action</th>
                </tr>
              </thead>
              <tbody id="portfolio-tbody" class="divide-y divide-slate-800/60">
                \${portfolioRows.map((row, idx) => {
                  const stockInfo = IDX_STOCKS.find(s => s.ticker === row.ticker);
                  return \`
                    <tr class="hover:bg-slate-900/40 transition-colors">
                      <td class="py-3 px-4 text-slate-500 font-mono text-xs text-center">\${idx + 1}</td>
                      <td class="py-3 px-4">
                        <div class="flex items-center gap-2">
                          <select onchange="updateRowTicker(\${idx}, this.value)" class="p-2 rounded-lg bg-slate-900 border border-slate-700/80 text-slate-200 text-xs sm:text-sm font-semibold focus:border-emerald-500 focus:outline-none">
                            \${IDX_STOCKS.map(s => \`
                              <option value="\${s.ticker}" \${s.ticker === row.ticker ? 'selected' : ''}>
                                \${s.ticker} — \${s.name} (\${s.sector})
                              </option>
                            \`).join('')}
                            \${!IDX_STOCKS.some(s => s.ticker === row.ticker) ? \`<option value="\${row.ticker}" selected>\${row.ticker} (Custom)</option>\` : ''}
                          </select>
                          <input 
                            type="text" 
                            placeholder="Custom" 
                            value="\${!IDX_STOCKS.some(s => s.ticker === row.ticker) ? row.ticker : ''}" 
                            onchange="if(this.value.trim()) updateRowTicker(\${idx}, this.value.trim().toUpperCase())" 
                            class="w-20 p-2 rounded-lg bg-slate-900 border border-slate-700/80 text-slate-200 text-xs font-mono uppercase focus:border-emerald-500 focus:outline-none" 
                            title="Or enter custom ticker symbol" 
                          />
                        </div>
                      </td>
                      <td class="py-3 px-4">
                        <div class="relative">
                          <input 
                            type="number" 
                            min="1" 
                            max="100" 
                            step="1" 
                            value="\${row.weight}" 
                            oninput="updateRowWeight(\${idx}, this.value)" 
                            class="w-full p-2 pr-6 rounded-lg bg-slate-900 border border-slate-700/80 text-slate-200 text-sm font-mono focus:border-emerald-500 focus:outline-none" 
                          />
                          <span class="absolute right-2.5 top-2.5 text-xs text-slate-500">%</span>
                        </div>
                      </td>
                      <td class="py-3 px-4">
                        <div class="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                          <div class="bg-gradient-to-r from-emerald-500 to-teal-400 h-2.5 rounded-full transition-all duration-300" style="width: \${Math.min(100, Math.max(0, row.weight))}%"></div>
                        </div>
                      </td>
                      <td class="py-3 px-4 text-center">
                        <button type="button" onclick="removePortfolioRow(\${idx})" class="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors" title="Delete row" \${portfolioRows.length <= 1 ? 'disabled style="opacity:0.3;cursor:not-allowed"' : ''}>
                          🗑️
                        </button>
                      </td>
                    </tr>
                  \`;
                }).join('')}
              </tbody>
            </table>
          </div>

          <!-- Table Controls & Normalizer -->
          <div class="flex flex-wrap items-center justify-between gap-3 pt-1">
            <button type="button" onclick="addPortfolioRow()" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-semibold rounded-xl text-sm border border-slate-700/80 flex items-center gap-1.5 transition-colors">
              <span>➕</span> Add Position
            </button>
            <div class="flex items-center gap-2">
              <button type="button" onclick="equalWeightPortfolio()" class="px-3 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium border border-slate-700/60 transition-colors">
                ⚖️ Equal Weight
              </button>
              <button type="button" onclick="normalizePortfolio()" class="px-3 py-2 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 rounded-xl text-xs font-semibold border border-emerald-500/30 transition-colors">
                🎯 Normalize to 100%
              </button>
            </div>
          </div>

          \${!isSum100 ? \`
            <div class="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300 flex items-center justify-between">
              <span>⚠️ <strong>Total weight is \${totalWeight.toFixed(1)}%</strong>. For standard portfolio evaluation, weights should ideally total 100% (1.00).</span>
              <button type="button" onclick="normalizePortfolio()" class="underline font-semibold ml-2 text-amber-200 hover:text-white">Auto-Fix</button>
            </div>
          \` : ''}

          <!-- Bidirectional Portfolio Payload (JSON) Accordion Preview -->
          <div class="border border-slate-800/90 rounded-xl bg-slate-950/60 overflow-hidden transition-all">
            <div class="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-900/50" onclick="toggleJsonPreview()">
              <div class="flex items-center gap-2">
                <span class="text-sm">📄</span>
                <span class="text-xs font-semibold text-slate-300">Generated Portfolio Payload (JSON)</span>
                <span class="text-[11px] text-slate-500">(\${portfolioRows.length} positions)</span>
              </div>
              <div class="flex items-center gap-2">
                <button type="button" onclick="event.stopPropagation(); promptImportJson()" class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs border border-slate-700">
                  📥 Import JSON
                </button>
                <button type="button" onclick="event.stopPropagation(); copyJsonPayload()" class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs border border-slate-700">
                  📋 Copy JSON
                </button>
                <span class="text-xs text-slate-400">\${showJsonPayload ? '▲ Hide' : '▼ View'}</span>
              </div>
            </div>
            \${showJsonPayload ? \`
              <div class="p-3 border-t border-slate-800 bg-slate-950 font-mono text-xs text-emerald-300 overflow-x-auto">
                <pre>\${JSON.stringify(jsonPayload, null, 2)}</pre>
              </div>
            \` : ''}
          </div>
        </div>
      \`;
    }

    function toggleJsonPreview() {
      showJsonPayload = !showJsonPayload;
      renderRiskTab(document.getElementById('form-inputs'));
    }

    function copyJsonPayload() {
      const totalWeight = portfolioRows.reduce((sum, r) => sum + (Number(r.weight) || 0), 0);
      const payload = {
        items: portfolioRows.map(r => ({
          ticker: r.ticker.toUpperCase(),
          weight: totalWeight > 0 ? Number((Number(r.weight) / 100).toFixed(4)) : 0.1
        }))
      };
      navigator.clipboard.writeText(JSON.stringify(payload, null, 2)).then(() => {
        alert('Portfolio Payload (JSON) copied to clipboard!');
      });
    }

    function promptImportJson() {
      const raw = prompt('Paste Portfolio Payload JSON (e.g. {"items": [{"ticker": "BBCA", "weight": 0.4}]}):');
      if (!raw) return;
      try {
        const parsed = JSON.parse(raw);
        const items = parsed.items || (Array.isArray(parsed) ? parsed : null);
        if (!items || !Array.isArray(items) || items.length === 0) {
          throw new Error('Invalid structure. Expected { "items": [{ "ticker": "...", "weight": 0.4 }] }');
        }
        portfolioRows = items.map(it => {
          const rawWeight = Number(it.weight) || 0.1;
          const pct = rawWeight <= 1.0 ? Math.round(rawWeight * 100) : Math.round(rawWeight);
          return {
            ticker: (it.ticker || 'BBCA').toUpperCase(),
            weight: pct
          };
        });
        renderRiskTab(document.getElementById('form-inputs'));
      } catch (e) {
        alert('JSON Import Error: ' + e.message);
      }
    }

    function updateRowTicker(idx, ticker) {
      if (portfolioRows[idx]) {
        portfolioRows[idx].ticker = ticker.toUpperCase();
        renderRiskTab(document.getElementById('form-inputs'));
      }
    }

    function updateRowWeight(idx, weight) {
      if (portfolioRows[idx]) {
        portfolioRows[idx].weight = Number(weight) || 0;
        renderRiskTab(document.getElementById('form-inputs'));
      }
    }

    function addPortfolioRow() {
      const unused = IDX_STOCKS.find(s => !portfolioRows.some(r => r.ticker === s.ticker));
      const nextTicker = unused ? unused.ticker : 'TLKM';
      portfolioRows.push({ ticker: nextTicker, weight: 20 });
      renderRiskTab(document.getElementById('form-inputs'));
    }

    function removePortfolioRow(idx) {
      if (portfolioRows.length <= 1) return;
      portfolioRows.splice(idx, 1);
      renderRiskTab(document.getElementById('form-inputs'));
    }

    function equalWeightPortfolio() {
      if (portfolioRows.length === 0) return;
      const equal = Math.floor(100 / portfolioRows.length);
      const remainder = 100 - (equal * portfolioRows.length);
      portfolioRows.forEach((r, idx) => {
        r.weight = idx === 0 ? equal + remainder : equal;
      });
      renderRiskTab(document.getElementById('form-inputs'));
    }

    function normalizePortfolio() {
      const currentTotal = portfolioRows.reduce((sum, r) => sum + (Number(r.weight) || 0), 0);
      if (currentTotal <= 0) return equalWeightPortfolio();
      
      let runningSum = 0;
      portfolioRows.forEach((r, idx) => {
        if (idx === portfolioRows.length - 1) {
          r.weight = Math.max(1, 100 - runningSum);
        } else {
          r.weight = Math.round((r.weight / currentTotal) * 100);
          runningSum += r.weight;
        }
      });
      renderRiskTab(document.getElementById('form-inputs'));
    }

    function setRiskPreset(preset) {
      if (preset === 'bluechip') {
        portfolioRows = [
          { ticker: 'BBCA', weight: 40 },
          { ticker: 'TLKM', weight: 30 },
          { ticker: 'ASII', weight: 30 }
        ];
      } else if (preset === 'techEnergy') {
        portfolioRows = [
          { ticker: 'GOTO', weight: 40 },
          { ticker: 'ADRO', weight: 35 },
          { ticker: 'MEDC', weight: 25 }
        ];
      } else if (preset === 'dividend') {
        portfolioRows = [
          { ticker: 'BBRI', weight: 35 },
          { ticker: 'BMRI', weight: 35 },
          { ticker: 'PTBA', weight: 30 }
        ];
      }
      renderRiskTab(document.getElementById('form-inputs'));
    }

    // =========================================================================
    // 3. Equity Report Generator Tab (Target Ticker or Sector as Single Select)
    // =========================================================================
    function renderReportTab(container) {
      const selectedStockInfo = IDX_STOCKS.find(s => s.ticker === selectedSingleTarget);

      container.innerHTML = \`
        <div class="space-y-5">
          <!-- Report Type Selector -->
          <div>
            <label class="block text-sm font-semibold text-slate-200 mb-1">Report Type</label>
            <select id="reportType" onchange="handleReportTypeChange(event)" class="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:border-emerald-500 focus:outline-none">
              <option value="EQUITY_RESEARCH" \${selectedReportType === 'EQUITY_RESEARCH' ? 'selected' : ''}>📑 EQUITY_RESEARCH — Comprehensive Fundamental Company Report</option>
              <option value="EXECUTIVE_SUMMARY" \${selectedReportType === 'EXECUTIVE_SUMMARY' ? 'selected' : ''}>⚡ EXECUTIVE_SUMMARY — High-Level C-Suite Briefing</option>
            </select>
          </div>

          <!-- Target Ticker or Sector: Single Select -->
          <div class="space-y-2">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <label for="target-single-select" class="block text-sm font-semibold text-slate-200">
                Target Ticker or Sector: (Single Select)
              </label>
              <span class="text-xs text-slate-400">
                Select a single IDX company for deep research
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div class="sm:col-span-2">
                  <select 
                    id="target-single-select" 
                    onchange="selectedSingleTarget = this.value; renderReportTab(document.getElementById('form-inputs'));" 
                    class="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm font-semibold focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    \${IDX_STOCKS.map(stk => \`
                      <option value="\${stk.ticker}" \${stk.ticker === selectedSingleTarget ? 'selected' : ''}>
                        \${stk.ticker} — \${stk.name} (\${stk.sector})
                      </option>
                    \`).join('')}
                  </select>
                </div>
                <div>
                  <input 
                    id="target-custom" 
                    type="text" 
                    placeholder="Or custom ticker..." 
                    maxlength="6" 
                    value="\${!IDX_STOCKS.some(s => s.ticker === selectedSingleTarget) ? selectedSingleTarget : ''}" 
                    onchange="if(this.value.trim()){ selectedSingleTarget = this.value.trim().toUpperCase(); renderReportTab(document.getElementById('form-inputs')); }" 
                    class="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm font-mono uppercase focus:border-emerald-500 focus:outline-none" 
                  />
                </div>
              </div>

              <!-- Selected Stock Preview Card -->
              <div class="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <span class="text-2xl">🏢</span>
                  <div>
                    <div class="text-sm font-bold text-emerald-300 flex items-center gap-2">
                      <span class="font-mono text-base">\${selectedSingleTarget}</span>
                      \${selectedStockInfo ? \`<span class="font-normal text-slate-300">— \${selectedStockInfo.name}</span>\` : ''}
                    </div>
                    <div class="text-xs text-slate-400">
                      Sector: <span class="text-slate-300 font-medium">\${selectedStockInfo ? selectedStockInfo.sector : 'Custom IDX Listing'}</span>
                    </div>
                  </div>
                </div>
                <span class="text-xs px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Single Stock</span>
              </div>
            }
          </div>

          <!-- Custom Research Instructions -->
          <div class="pt-2">
            <label class="block text-sm font-semibold text-slate-200 mb-1">Custom Analyst Directives (Optional)</label>
            <input id="customInstructions" type="text" placeholder="e.g. Focus on upcoming quarterly dividend sustainability and margin pressures" class="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:border-emerald-500 focus:outline-none" />
            <div class="flex flex-wrap gap-1.5 mt-2">
              <button type="button" onclick="document.getElementById('customInstructions').value = 'Evaluate balance sheet debt covenants and refinancing sensitivity'" class="text-xs px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200">Balance Sheet Sensitivity</button>
              <button type="button" onclick="document.getElementById('customInstructions').value = 'Focus on dividend yield sustainability and payout ratio projections'" class="text-xs px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200">Dividend Projections</button>
              <button type="button" onclick="document.getElementById('customInstructions').value = 'Analyze competitive moat versus regional and domestic peers'" class="text-xs px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200">Competitive Moat</button>
            </div>
          </div>
        </div>
      \`;
    }

    function handleReportTypeChange(e) {
      selectedReportType = e.target.value;
      if (!IDX_STOCKS.some(s => s.ticker === selectedSingleTarget)) {
        selectedSingleTarget = 'TLKM';
      }
      renderReportTab(document.getElementById('form-inputs'));
    }

    // =========================================================================
    // Form Submission & API Handlers
    // =========================================================================
    async function handleSubmit(e) {
      e.preventDefault();
      const outputBox = document.getElementById('output-container');
      const outputContent = document.getElementById('output-content');
      const outputRaw = document.getElementById('output-raw');
      const spinner = document.getElementById('loading-spinner');
      const submitBtn = document.getElementById('submit-btn');
      const btnText = document.getElementById('btn-text');

      outputBox.classList.remove('hidden');
      outputContent.innerHTML = '';
      outputRaw.classList.add('hidden');
      spinner.classList.remove('hidden');
      submitBtn.disabled = true;
      submitBtn.classList.add('opacity-70', 'cursor-wait');
      btnText.innerText = 'Synthesizing with Gemini AI...';

      let endpoint = '/api/financial/' + activeTab;
      let body = {};

      try {
        if (activeTab === 'compare') {
          if (selectedCompareTickers.length < 2) {
            throw new Error('Please select at least 2 tickers to compare (max 5).');
          }
          if (selectedCompareTickers.length > 5) {
            throw new Error('Maximum 5 tickers allowed per comparison.');
          }
          const focusArea = document.getElementById('focusArea')?.value || 'Valuation and Dividends';
          body = { tickers: selectedCompareTickers, focusArea };
        } else if (activeTab === 'risk') {
          endpoint = '/api/financial/risk-score';
          if (portfolioRows.length === 0) {
            throw new Error('Please provide at least 1 holding position in your portfolio.');
          }
          const totalW = portfolioRows.reduce((sum, r) => sum + (Number(r.weight) || 0), 0);
          const items = portfolioRows.map(r => {
            const rawW = Number(r.weight) || 0;
            const decimalWeight = totalW > 0 ? Number((rawW / 100).toFixed(4)) : 0.1;
            return {
              ticker: r.ticker.toUpperCase(),
              weight: Math.min(1.0, Math.max(0.01, decimalWeight))
            };
          });
          body = { items };
        } else {
          endpoint = '/api/financial/report';
          const customInst = document.getElementById('customInstructions')?.value;
          body = {
            target: selectedSingleTarget || 'TLKM',
            reportType: selectedReportType,
            ...(customInst ? { customInstructions: customInst } : {})
          };
        }

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });

        const data = await res.json();
        spinner.classList.add('hidden');

        if (!res.ok) {
          throw new Error(data.message || 'Server request failed with status ' + res.status);
        }

        const markdownText = data.analysis || data.riskAnalysis || data.report;
        if (markdownText) {
          lastRawOutput = markdownText;
          outputContent.innerHTML = marked.parse(markdownText);
        } else {
          lastRawOutput = JSON.stringify(data, null, 2);
          outputRaw.classList.remove('hidden');
          outputRaw.innerText = lastRawOutput;
        }

        outputBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } catch (err) {
        spinner.classList.add('hidden');
        outputContent.innerHTML = \`
          <div class="p-4 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-300">
            <h3 class="font-bold text-rose-400 text-base mb-1">⚠️ Request Failed</h3>
            <p class="text-sm">\${err.message}</p>
          </div>
        \`;
      } finally {
        submitBtn.disabled = false;
        submitBtn.classList.remove('opacity-70', 'cursor-wait');
        btnText.innerText = 'Run AI Analysis';
      }
    }

    function copyOutput() {
      if (!lastRawOutput) return;
      navigator.clipboard.writeText(lastRawOutput).then(() => {
        const copyBtn = document.getElementById('copy-btn');
        const original = copyBtn.innerHTML;
        copyBtn.innerHTML = '<span>✓</span> Copied!';
        setTimeout(() => { copyBtn.innerHTML = original; }, 2000);
      });
    }

    function clearOutput() {
      document.getElementById('output-container').classList.add('hidden');
      document.getElementById('output-content').innerHTML = '';
      lastRawOutput = '';
    }

    // Initialize default tab
    setTab('compare');
  </script>
</body>
</html>
    `;
    return res.send(html);
  }
}