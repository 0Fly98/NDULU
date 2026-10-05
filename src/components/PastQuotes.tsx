import { useState } from 'react';
import { FileText, Printer, Trash2, Copy, CheckCircle, ChevronDown, ChevronUp, Calendar, Mail, Building } from 'lucide-react';
import { Quote } from '../types';

interface PastQuotesProps {
  quotes: Quote[];
  onDeleteQuote: (id: string) => void;
  onDuplicateQuote: (quote: Quote) => void;
}

export default function PastQuotes({ quotes, onDeleteQuote, onDuplicateQuote }: PastQuotesProps) {
  const [expandedQuote, setExpandedQuote] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedQuote(expandedQuote === id ? null : id);
  };

  const handleDuplicate = (quote: Quote) => {
    onDuplicateQuote(quote);
    setCopiedId(quote.id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  if (quotes.length === 0) {
    return (
      <div className="bg-white dark:bg-stone-900 rounded-xl border border-gray-200 dark:border-stone-800 p-12 text-center max-w-2xl mx-auto space-y-6 transition-colors duration-200">
        <div className="h-16 w-16 bg-gray-50 dark:bg-stone-800 rounded-full flex items-center justify-center mx-auto text-gray-400 dark:text-stone-500">
          <FileText className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-gray-900 dark:text-stone-100">No Quotes Generated Yet</h2>
          <p className="text-sm text-gray-500 dark:text-stone-400">
            Submit your item configuration from the Quote Builder to view your archived procurement invoices here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1c1917] dark:text-stone-100 tracking-tight">Quote Archives</h1>
          <p className="text-sm text-gray-500 dark:text-stone-400">Browse, audit, print or copy previous quote request details and work scopes.</p>
        </div>
      </div>

      <div className="space-y-4">
        {quotes.map((q) => {
          const isExpanded = expandedQuote === q.id;
          const formattedDate = new Date(q.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });

          return (
            <div
              key={q.id}
              id={`quote-card-${q.id}`}
              className="bg-white dark:bg-stone-900 rounded-xl border border-gray-200 dark:border-stone-800 shadow-sm overflow-hidden transition-all duration-200 hover:border-gray-300 dark:hover:border-stone-700"
            >
              {/* Card Header (Collapsed View Summary) */}
              <div
                onClick={() => toggleExpand(q.id)}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-stone-800/50 transition-colors"
              >
                <div className="flex items-start sm:items-center space-x-4">
                  <div className="bg-amber-50 dark:bg-amber-950/50 text-[#f59e0b] p-2.5 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-bold text-amber-800 dark:text-amber-400 uppercase tracking-widest">
                        Quote #{q.id.slice(0, 6)}
                      </span>
                      <span className="text-xs bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded font-bold font-mono">
                        {q.status}
                      </span>
                    </div>
                    <h3 className="text-md font-bold text-gray-900 dark:text-stone-100 leading-tight mt-0.5">
                      {q.clientCompany}
                    </h3>
                    <div className="flex items-center space-x-3 text-xs text-gray-400 dark:text-stone-400 mt-1">
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{formattedDate}</span>
                      </span>
                      <span>•</span>
                      <span>{q.items.length} Scope Items</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 border-gray-100 dark:border-stone-800 pt-3 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] uppercase font-mono text-amber-700 dark:text-amber-400 block tracking-wider font-bold">
                      Price Status
                    </span>
                    <span className="text-xs font-mono font-bold text-gray-800 dark:text-stone-200 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 px-2 py-0.5 rounded block">
                      Under Review
                    </span>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpand(q.id);
                      }}
                      className="p-1.5 text-gray-400 dark:text-stone-400 hover:text-gray-600 dark:hover:text-stone-200 rounded hover:bg-gray-100 dark:hover:bg-stone-800"
                    >
                      {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Specifications & Actions */}
              {isExpanded && (
                <div className="border-t border-gray-100 dark:border-stone-800 bg-[#fafafa] dark:bg-stone-950 p-6 space-y-6">
                  {/* Metadata Blocks */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-gray-200 dark:border-stone-800 pb-5">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 dark:text-stone-400 uppercase tracking-widest font-mono">
                        Authorized Client Officer
                      </span>
                      <p className="text-xs text-gray-800 dark:text-stone-200 font-semibold mt-1 flex items-center space-x-1.5">
                        <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                        <span>{q.clientName}</span>
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-gray-400 dark:text-stone-400 uppercase tracking-widest font-mono">
                        Corporate Contact
                      </span>
                      <p className="text-xs text-gray-800 dark:text-stone-200 font-semibold mt-1 flex items-center space-x-1.5">
                        <Mail className="h-3.5 w-3.5 text-amber-700 dark:text-amber-400" />
                        <span>{q.clientEmail}</span>
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-gray-400 dark:text-stone-400 uppercase tracking-widest font-mono">
                        Procuring Entity
                      </span>
                      <p className="text-xs text-gray-800 dark:text-stone-200 font-semibold mt-1 flex items-center space-x-1.5">
                        <Building className="h-3.5 w-3.5 text-amber-700 dark:text-amber-400" />
                        <span>{q.clientCompany}</span>
                      </p>
                    </div>
                  </div>

                  {/* Scope Items Table */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-gray-400 dark:text-stone-400 uppercase tracking-widest font-mono">
                      Scope of Work Specifications & Materials
                    </h4>
                    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-stone-800 bg-white dark:bg-stone-900">
                      <table className="min-w-full divide-y divide-gray-100 dark:divide-stone-800 text-xs">
                        <thead className="bg-gray-50 dark:bg-stone-800/80 font-mono text-gray-400 dark:text-stone-400 uppercase text-[10px]">
                          <tr>
                            <th className="px-4 py-3 text-left font-bold">Item & Subcategory</th>
                            <th className="px-4 py-3 text-left font-bold">Selected Config</th>
                            <th className="px-4 py-3 text-center font-bold">Requested Quantity</th>
                            <th className="px-4 py-3 text-right font-bold">Price Assessment</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-stone-800 text-gray-700 dark:text-stone-300">
                          {q.items.map((item, idx) => (
                            <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-stone-800/50">
                              <td className="px-4 py-3.5">
                                <div className="font-bold text-gray-900 dark:text-stone-100">{item.product.name}</div>
                                <div className="text-[10px] text-gray-400 dark:text-stone-400 mt-0.5">{item.product.subcategory}</div>
                                {item.customNotes && (
                                  <div className="text-[9px] bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 p-1 rounded mt-1.5 border border-amber-100 dark:border-amber-800/60 font-mono">
                                    Notes: {item.customNotes}
                                  </div>
                                )}
                              </td>
                              <td className="px-4 py-3.5">
                                <div className="space-y-1">
                                  <div>
                                    <span className="text-[9px] text-gray-400 dark:text-stone-400">Size:</span> <span className="font-semibold text-gray-800 dark:text-stone-200">{item.selectedSize}</span>
                                  </div>
                                  <div>
                                    <span className="text-[9px] text-gray-400 dark:text-stone-400">Spec:</span> <span className="font-semibold text-gray-800 dark:text-stone-200 max-w-[150px] truncate block">{item.selectedType}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3.5 text-center font-mono font-semibold text-gray-900 dark:text-stone-100">
                                {item.quantity}
                              </td>
                              <td className="px-4 py-3.5 text-right font-semibold text-amber-700 dark:text-amber-400 font-mono">
                                {q.itemPrices?.[idx] !== undefined ? (
                                  `K ${q.itemPrices[idx].toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                                ) : item.product.priceEstimate > 0 ? (
                                  `K ${item.product.priceEstimate.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                                ) : (
                                  'To Be Calculated'
                                )}
                              </td>
                            </tr>
                          ))}
                          {/* Total Row */}
                          <tr className="bg-gray-50 dark:bg-stone-800/60 font-bold border-t border-gray-200 dark:border-stone-800">
                            <td colSpan={3} className="px-4 py-3 text-right font-mono text-gray-500 dark:text-stone-400">
                              Grand Total Quote Amount:
                            </td>
                            <td className="px-4 py-3 text-right font-mono text-xs text-amber-800 dark:text-amber-400 uppercase tracking-wide font-extrabold">
                              {q.quotedAmount !== undefined && q.quotedAmount > 0 ? (
                                `K ${q.quotedAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                              ) : (
                                'Pending Review'
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Admin Management Review & Feedback Box */}
                  {q.adminNotes && (
                    <div className="bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/30 rounded-xl p-4 space-y-2 text-xs">
                      <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                        <div className="flex items-center space-x-2">
                          <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
                          <span className="font-bold text-stone-900 dark:text-stone-100 font-mono uppercase tracking-wider">
                            Official Management Review Note
                          </span>
                        </div>
                        {q.adminReviewedAt && (
                          <span className="text-[10px] text-stone-500 dark:text-stone-400 font-mono">
                            Reviewed: {new Date(q.adminReviewedAt).toLocaleDateString()} {new Date(q.adminReviewedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                      <p className="text-stone-700 dark:text-stone-300 whitespace-pre-line leading-relaxed font-sans">
                        {q.adminNotes}
                      </p>
                      {q.adminReviewedBy && (
                        <div className="text-[10px] text-stone-500 dark:text-stone-400 font-mono pt-1 text-right">
                          — Signed by {q.adminReviewedBy}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center justify-between pt-4 border-t border-gray-200 dark:border-stone-800 gap-4">
                    <button
                      id={`btn-archive-delete-${q.id}`}
                      onClick={() => onDeleteQuote(q.id)}
                      className="px-3 py-1.5 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/60 text-red-700 dark:text-red-300 text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1.5 border border-red-200 dark:border-red-800 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete From Archives</span>
                    </button>

                    <div className="flex space-x-3">
                      <button
                        id={`btn-archive-duplicate-${q.id}`}
                        onClick={() => handleDuplicate(q)}
                        className="px-4 py-1.5 bg-white dark:bg-stone-800 border border-gray-300 dark:border-stone-700 hover:bg-gray-100 dark:hover:bg-stone-700 text-gray-700 dark:text-stone-200 text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1.5 shadow-sm cursor-pointer"
                      >
                        {copiedId === q.id ? (
                          <>
                            <CheckCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span className="text-emerald-700 dark:text-emerald-300">Scope Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                            <span>Re-apply This Scope</span>
                          </>
                        )}
                      </button>

                      <button
                        id={`btn-archive-print-${q.id}`}
                        onClick={() => {
                          // Beautiful printable invoice trigger
                          window.print();
                        }}
                        className="px-4 py-1.5 bg-[#1c1917] dark:bg-amber-500 hover:bg-[#2e2a24] dark:hover:bg-amber-400 text-white dark:text-stone-950 text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1.5 shadow-sm cursor-pointer"
                      >
                        <Printer className="h-3.5 w-3.5 text-[#f59e0b] dark:text-stone-950" />
                        <span>Print Invoice Sheet</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
