import { useState } from 'react';
import { ShieldAlert, Send, AlertTriangle, BookOpen, FileCheck, CheckSquare, Loader2 } from 'lucide-react';
import { QuoteItem } from '../types';

interface SafetyAdvisorProps {
  activeQuoteItems: QuoteItem[];
}

export default function SafetyAdvisor({ activeQuoteItems }: SafetyAdvisorProps) {
  const [query, setQuery] = useState('');
  const [includeQuoteContext, setIncludeQuoteContext] = useState(true);
  const [advice, setAdvice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const quickPrompts = [
    {
      label: 'Conveyor Belt Safety Checklist',
      text: 'Provide a SANS 1173 and ISO 340 safety inspection checklist and hazard plan for installing heavy-duty rubber conveyor belting.'
    },
    {
      label: 'Solar PV Regulations (NERSA/SANS)',
      text: 'What are the SANS 10142-1 and NRS 097-2-1 compliance standards required for on-site hybrid solar PV plant installation?'
    },
    {
      label: 'Scrap Metal Buyback Risk Plan',
      text: 'Give me a safety and waste transport risk plan for buying and reselling ferrous/non-ferrous scrap metal from mining locations.'
    },
    {
      label: 'Labour Hire Medical & Red Tickets',
      text: 'Explain the legal occupational health safety requirements (including Red Ticket mining medicals) for site labor hire services.'
    },
    {
      label: 'Food Supply & Hygiene Standards',
      text: 'What are the SANS 10049 and HACCP food safety standards required for catering and food supply services to remote mining camps?'
    }
  ];

  const handleAskAdvisor = async (textQuery: string) => {
    if (!textQuery.trim()) return;
    setIsLoading(true);
    setError(null);

    const contextItems = includeQuoteContext && activeQuoteItems.length > 0
      ? activeQuoteItems.map(item => ({
          name: item.product.name,
          category: item.product.category,
          subcategory: item.product.subcategory,
          size: item.selectedSize,
          type: item.selectedType,
          quantity: item.quantity,
          safetyStandards: item.product.safetyStandards,
          specifications: item.product.specifications
        }))
      : [];

    try {
      const response = await fetch('/api/safety-advisor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: textQuery,
          contextItems
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate response from advisor.');
      }

      const data = await response.json();
      setAdvice(data.advice || 'No recommendations returned.');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred while communicating with the AI Safety Advisor.');
    } finally {
      setIsLoading(false);
    }
  };

  const parseMarkdown = (text: string) => {
    // Simple secure parser for basic markdown elements (headers, bullets, bold)
    return text.split('\n').map((line, index) => {
      let trimmed = line.trim();
      if (trimmed.startsWith('###')) {
        return <h4 key={index} className="text-sm font-bold text-[#1c1917] dark:text-amber-400 uppercase tracking-wider mt-4 mb-2 font-mono border-b border-gray-100 dark:border-stone-800 pb-1">{trimmed.replace('###', '').trim()}</h4>;
      }
      if (trimmed.startsWith('##')) {
        return <h3 key={index} className="text-md font-extrabold text-amber-900 dark:text-amber-300 uppercase tracking-wide mt-5 mb-2">{trimmed.replace('##', '').trim()}</h3>;
      }
      if (trimmed.startsWith('#')) {
        return <h2 key={index} className="text-lg font-black text-gray-900 dark:text-stone-100 border-l-4 border-[#f59e0b] pl-3 py-1 my-4">{trimmed.replace('#', '').trim()}</h2>;
      }
      if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
        // Handle bold in lists
        const listText = trimmed.substring(1).trim();
        return (
          <li key={index} className="text-xs text-gray-700 dark:text-stone-300 ml-4 list-disc leading-relaxed mt-1">
            {formatBoldText(listText)}
          </li>
        );
      }
      if (/^\d+\./.test(trimmed)) {
        const listText = trimmed.replace(/^\d+\./, '').trim();
        return (
          <li key={index} className="text-xs text-gray-700 dark:text-stone-300 ml-4 list-decimal leading-relaxed mt-1">
            {formatBoldText(listText)}
          </li>
        );
      }
      if (trimmed === '') {
        return <div key={index} className="h-2"></div>;
      }
      return <p key={index} className="text-xs text-gray-600 dark:text-stone-300 leading-relaxed mb-2">{formatBoldText(trimmed)}</p>;
    });
  };

  const formatBoldText = (text: string) => {
    // Basic bold parsing **text**
    const parts = text.split(/\*\*([^*]+)\*\*/g);
    return parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="font-extrabold text-[#1c1917] dark:text-amber-400">{part}</strong> : part);
  };

  return (
    <div className="space-y-6">
      {/* Alert Header */}
      <div className="bg-[#1c1917] dark:bg-stone-900 text-white rounded-xl p-6 border border-[#2e2a24] dark:border-stone-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex space-x-4 items-start">
          <div className="bg-[#f59e0b] text-[#1c1917] p-3 rounded-xl flex items-center justify-center flex-shrink-0">
            <ShieldAlert className="h-6 w-6 font-bold" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-black text-white tracking-tight flex items-center space-x-2">
              <span>Ndulu AI Safety Advisor</span>
              <span className="bg-[#f59e0b] text-[#1c1917] text-[9px] px-2 py-0.5 rounded-full font-mono uppercase font-bold animate-pulse">
                SANS/OHS Grounded
              </span>
            </h1>
            <p className="text-xs text-gray-400 dark:text-stone-400 max-w-2xl">
              Consult our real-time regulatory advisor trained on South African mining safety directives, SANS compliance, and protective hardware risk controls.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Interaction Console */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-stone-900 rounded-xl border border-gray-200 dark:border-stone-800 p-5 shadow-sm space-y-4 transition-colors duration-200">
            <h3 className="text-sm font-bold text-gray-900 dark:text-stone-100 flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <span>Safety Consulting Console</span>
            </h3>

            {/* Input form */}
            <div className="space-y-3">
              <textarea
                id="safety-input-query"
                placeholder="Ask about risk plans, SANS codes, red ticket certifications, or hazardous handling directives..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                rows={4}
                className="w-full p-3 bg-gray-50 dark:bg-stone-800 border border-gray-300 dark:border-stone-700 rounded-lg text-xs text-gray-900 dark:text-stone-100 placeholder-gray-400 dark:placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-[#f59e0b] focus:border-transparent transition-all duration-200 resize-none font-sans"
              />

              {/* Context Attachment Switch */}
              {activeQuoteItems.length > 0 && (
                <div className="flex items-center justify-between p-2.5 bg-amber-50 dark:bg-amber-950/40 rounded-lg border border-amber-200 dark:border-amber-800/60">
                  <div className="flex items-center space-x-2">
                    <CheckSquare className="h-4 w-4 text-amber-700 dark:text-amber-400" />
                    <div>
                      <span className="text-xs font-semibold text-amber-950 dark:text-amber-200 block">Attach Scope Context</span>
                      <span className="text-[10px] text-amber-800 dark:text-amber-300 block">Use active quote list items as AI context</span>
                    </div>
                  </div>
                  <input
                    id="checkbox-context"
                    type="checkbox"
                    checked={includeQuoteContext}
                    onChange={(e) => setIncludeQuoteContext(e.target.checked)}
                    className="h-4 w-4 rounded border-amber-300 dark:border-amber-700 text-[#f59e0b] focus:ring-[#f59e0b]"
                  />
                </div>
              )}

              <button
                id="btn-ask-safety"
                onClick={() => handleAskAdvisor(query)}
                disabled={isLoading || !query.trim()}
                className="w-full py-2 bg-[#1c1917] dark:bg-amber-500 hover:bg-[#2e2a24] dark:hover:bg-amber-400 text-white dark:text-stone-950 font-semibold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-[#f59e0b] dark:text-stone-950" />
                ) : (
                  <Send className="h-3.5 w-3.5 text-[#f59e0b] dark:text-stone-950" />
                )}
                <span>{isLoading ? 'Consulting Standards...' : 'Submit to Advisor'}</span>
              </button>
            </div>
          </div>

          {/* Quick templates panel */}
          <div className="bg-white dark:bg-stone-900 rounded-xl border border-gray-200 dark:border-stone-800 p-5 shadow-sm space-y-3 transition-colors duration-200">
            <h4 className="text-xs font-bold text-gray-400 dark:text-stone-400 uppercase tracking-widest font-mono">
              Common Regulatory Queries
            </h4>
            <div className="flex flex-col gap-2">
              {quickPrompts.map((p, i) => (
                <button
                  key={i}
                  id={`btn-quick-prompt-${i}`}
                  onClick={() => {
                    setQuery(p.text);
                    handleAskAdvisor(p.text);
                  }}
                  className="p-3 text-left bg-gray-50 dark:bg-stone-800/80 hover:bg-amber-50 dark:hover:bg-stone-800 hover:border-amber-300 dark:hover:border-amber-500 border border-gray-200 dark:border-stone-700 rounded-lg text-xs font-medium text-gray-700 dark:text-stone-300 transition-all duration-200 flex flex-col justify-between"
                >
                  <span className="text-amber-700 dark:text-amber-400 font-bold text-[10px] uppercase font-mono tracking-wider">{p.label}</span>
                  <span className="text-gray-500 dark:text-stone-400 line-clamp-1 mt-0.5">{p.text}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Output Display Card */}
        <div className="lg:col-span-2">
          {isLoading ? (
            <div className="bg-white dark:bg-stone-900 rounded-xl border border-gray-200 dark:border-stone-800 p-12 text-center shadow-sm space-y-4 h-full flex flex-col items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-[#f59e0b]" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-gray-900 dark:text-stone-100 font-mono uppercase tracking-wider">Compiling Safety Protocols</h4>
                <p className="text-xs text-gray-400 dark:text-stone-400 max-w-sm">
                  Analyzing user conditions against OHS regulations, Mine Health & Safety guidelines, and certified industrial safety standards...
                </p>
              </div>
            </div>
          ) : advice ? (
            <div className="bg-white dark:bg-stone-900 rounded-xl border border-gray-200 dark:border-stone-800 shadow-sm overflow-hidden h-full flex flex-col">
              {/* Output Header */}
              <div className="bg-[#fafafa] dark:bg-stone-950 border-b border-gray-100 dark:border-stone-800 p-4 px-6 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-bold text-gray-700 dark:text-stone-300 uppercase tracking-wide font-mono">
                    Official Regulatory Response
                  </span>
                </div>
                <button
                  onClick={() => window.print()}
                  className="text-[10px] font-bold text-gray-500 dark:text-stone-400 hover:text-gray-800 dark:hover:text-stone-200 bg-white dark:bg-stone-800 border border-gray-200 dark:border-stone-700 rounded px-2 py-0.5"
                >
                  Print Report
                </button>
              </div>

              {/* Output Scrollable Body */}
              <div className="p-6 flex-1 overflow-y-auto space-y-4 max-h-[70vh] markdown-container">
                {parseMarkdown(advice)}
              </div>

              {/* Disclaimer */}
              <div className="bg-amber-50/50 dark:bg-amber-950/20 border-t border-gray-100 dark:border-stone-800 p-4 text-[10px] text-gray-400 dark:text-stone-400 italic">
                Disclaimer: Ndulu AI Safety Advisor delivers regulatory checks and industry standard guidelines based on published SANS and OHS blueprints. Always coordinate with certified safety officers on-site before initiating hazardous procedures.
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl p-12 text-center shadow-sm space-y-4 h-full flex flex-col items-center justify-center">
              <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center text-red-600 dark:text-red-400">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-red-950 dark:text-red-200 font-mono uppercase tracking-wider">Advisor Service Error</h4>
                <p className="text-xs text-red-800 dark:text-red-300 max-w-sm">{error}</p>
              </div>
              <button
                onClick={() => { setError(null); setAdvice(null); }}
                className="px-4 py-2 bg-red-900 text-white text-xs font-semibold rounded-lg hover:bg-red-950 transition-colors"
              >
                Reset Advisor
              </button>
            </div>
          ) : (
            <div className="bg-white dark:bg-stone-900 rounded-xl border border-gray-200 dark:border-stone-800 p-12 text-center shadow-sm space-y-4 h-full flex flex-col items-center justify-center">
              <div className="h-12 w-12 rounded-full bg-gray-50 dark:bg-stone-800 flex items-center justify-center text-gray-400 dark:text-stone-400">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-gray-900 dark:text-stone-100">Awaiting Safety Query</h4>
                <p className="text-xs text-gray-400 dark:text-stone-400 max-w-sm">
                  Submit a regulatory question or click one of our common industrial safety presets to generate a compliant hazard control plan.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
