import { useState, useEffect } from 'react';
import { Trash2, FileSignature, Building, Mail, User, ShieldAlert, CheckCircle } from 'lucide-react';
import { QuoteItem, Quote } from '../types';
import { useAuth } from '../context/AuthContext';

interface QuoteBuilderProps {
  items: QuoteItem[];
  onUpdateItem: (index: number, quantity: number, size: string, type: string, notes: string) => void;
  onRemoveItem: (index: number) => void;
  onSubmitQuote: (quote: Omit<Quote, 'id' | 'createdAt' | 'status'>) => void;
  onNavigateToCatalog: () => void;
}

export default function QuoteBuilder({
  items,
  onUpdateItem,
  onRemoveItem,
  onSubmitQuote,
  onNavigateToCatalog
}: QuoteBuilderProps) {
  const { user, signInWithGoogle } = useAuth();

  // Client Form Details
  const [clientName, setClientName] = useState(user?.displayName || '');
  const [clientEmail, setClientEmail] = useState(user?.email || '');
  const [clientCompany, setClientCompany] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (user) {
      if (!clientName && user.displayName) setClientName(user.displayName);
      if (!clientEmail && user.email) setClientEmail(user.email);
    }
  }, [user]);

  const totalEstimate = 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !clientCompany) {
      setFormError('Please fill out all client and company information.');
      return;
    }
    setFormError('');

    onSubmitQuote({
      clientName,
      clientEmail,
      clientCompany,
      items,
      totalEstimate,
      userId: user?.uid
    });

    // Clear form
    setClientName(user?.displayName || '');
    setClientEmail(user?.email || '');
    setClientCompany('');
  };

  if (items.length === 0) {
    return (
      <div className="bg-white dark:bg-stone-900 rounded-xl border border-gray-200 dark:border-stone-800 p-12 text-center max-w-2xl mx-auto space-y-6 transition-colors duration-200">
        <div className="h-16 w-16 bg-amber-50 dark:bg-amber-950/50 rounded-full flex items-center justify-center mx-auto text-[#f59e0b]">
          <FileSignature className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-gray-900 dark:text-stone-100">Your Quotation Basket is Empty</h2>
          <p className="text-sm text-gray-500 dark:text-stone-400">
            Browse our certified industrial PPE, solar energy installations, labour hire, and industrial food supplying services to build your corporate quote request.
          </p>
        </div>
        <button
          onClick={onNavigateToCatalog}
          className="px-6 py-2.5 bg-[#1c1917] dark:bg-amber-500 hover:bg-[#2e2a24] dark:hover:bg-amber-400 text-white dark:text-stone-950 font-semibold text-xs rounded-lg transition-colors inline-flex items-center space-x-2"
        >
          <span>Explore Catalog & Services</span>
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Items List (Left / Main side) */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white dark:bg-stone-900 rounded-xl border border-gray-200 dark:border-stone-800 p-6 shadow-sm space-y-4 transition-colors duration-200">
          <h2 className="text-lg font-bold text-gray-900 dark:text-stone-100 border-b border-gray-100 dark:border-stone-800 pb-3">
            Quotation Scope of Work & Hardware Items
          </h2>

          <div className="divide-y divide-gray-100 dark:divide-stone-800">
            {items.map((item, index) => (
              <div key={index} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex space-x-4">
                  {/* Thumbnail */}
                  <div className="h-20 w-20 rounded-lg overflow-hidden bg-gray-50 dark:bg-stone-800 border border-gray-100 dark:border-stone-700 flex-shrink-0">
                    <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400 tracking-wider font-mono">
                      {item.product.subcategory}
                    </span>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-stone-100 leading-tight">
                      {item.product.name}
                    </h4>

                    {/* Sizing & Config Selectors */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <div>
                        <span className="text-[9px] text-gray-400 dark:text-stone-400 block font-mono">Size/Capacity:</span>
                        <select
                          value={item.selectedSize}
                          onChange={(e) => onUpdateItem(index, item.quantity, e.target.value, item.selectedType, item.customNotes || '')}
                          className="bg-gray-50 dark:bg-stone-800 border border-gray-300 dark:border-stone-700 text-gray-900 dark:text-stone-100 rounded px-1.5 py-0.5 text-[10px] focus:outline-none"
                        >
                          {item.product.sizes.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <span className="text-[9px] text-gray-400 dark:text-stone-400 block font-mono">Type/Spec:</span>
                        <select
                          value={item.selectedType}
                          onChange={(e) => onUpdateItem(index, item.quantity, item.selectedSize, e.target.value, item.customNotes || '')}
                          className="bg-gray-50 dark:bg-stone-800 border border-gray-300 dark:border-stone-700 text-gray-900 dark:text-stone-100 rounded px-1.5 py-0.5 text-[10px] focus:outline-none max-w-[150px] truncate"
                        >
                          {item.product.types.map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Adjusting Quantity, Notes, and Remove */}
                <div className="sm:text-right flex flex-col justify-between items-end gap-2">
                  <div className="flex items-center space-x-4">
                    <div>
                      <span className="text-[9px] text-gray-400 dark:text-stone-400 block font-mono">Rate Policy</span>
                      <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800/60 font-mono">Review Req.</span>
                    </div>

                    <div>
                      <span className="text-[9px] text-gray-400 dark:text-stone-400 block font-mono">Selected Qty</span>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => onUpdateItem(index, Math.max(1, parseInt(e.target.value) || 1), item.selectedSize, item.selectedType, item.customNotes || '')}
                        className="w-14 text-center bg-gray-50 dark:bg-stone-800 border border-gray-300 dark:border-stone-700 text-gray-900 dark:text-stone-100 rounded py-0.5 text-xs focus:outline-none font-bold font-mono"
                      />
                    </div>

                    <button
                      onClick={() => onRemoveItem(index)}
                      className="p-1 text-gray-400 dark:text-stone-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded transition-colors"
                      title="Remove Item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Custom Scope Notes */}
                  <div className="w-full">
                    <input
                      type="text"
                      placeholder="Add custom spec details or instruction notes..."
                      value={item.customNotes || ''}
                      onChange={(e) => onUpdateItem(index, item.quantity, item.selectedSize, item.selectedType, e.target.value)}
                      className="w-full bg-gray-50 dark:bg-stone-800 border border-gray-200 dark:border-stone-700 rounded px-2 py-1 text-[10px] text-gray-600 dark:text-stone-300 placeholder-gray-400 dark:placeholder-stone-500 focus:outline-none focus:border-amber-300"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Checkout / Submit Form (Right side) */}
      <div className="space-y-6">
        <div className="bg-[#1c1917] dark:bg-stone-900 text-white rounded-xl p-6 border border-[#2e2a24] dark:border-stone-800 shadow-sm space-y-4">
          <h3 className="text-md font-bold text-[#f59e0b] tracking-wider uppercase font-mono border-b border-[#2e2a24] dark:border-stone-800 pb-3">
            Quotation Scope
          </h3>

          <div className="space-y-2 font-mono">
            <div className="flex justify-between text-xs text-gray-400 dark:text-stone-400">
              <span>Unique Scope Items:</span>
              <span>{items.length} categories</span>
            </div>
            <div className="flex justify-between text-xs text-gray-400 dark:text-stone-400">
              <span>Delivery / Lead Time:</span>
              <span className="text-amber-500">Subject to OHS Review</span>
            </div>
            <hr className="border-[#2e2a24] dark:border-stone-800" />
            <div className="flex flex-col gap-1 pt-1">
              <span className="text-xs font-semibold text-gray-400 dark:text-stone-400">Estimate Price:</span>
              <span className="text-sm font-black text-[#f59e0b] uppercase tracking-wide">Quoted After Manual Review</span>
            </div>
            <span className="text-[9px] text-gray-500 dark:text-stone-400 block leading-tight pt-2">
              *Because mining specs and bulk material rates fluctuate, our team will review this custom scope and issue a formal quote directly.
            </span>
          </div>
        </div>

        {/* Client details form */}
        <div className="bg-white dark:bg-stone-900 rounded-xl border border-gray-200 dark:border-stone-800 p-6 shadow-sm space-y-4 transition-colors duration-200">
          <h3 className="text-sm font-bold text-gray-900 dark:text-stone-100 flex items-center space-x-2">
            <Building className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <span>Corporate Client Credentials</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-stone-400 mb-1">
                Authorized Officer Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-stone-500">
                  <User className="h-4 w-4" />
                </span>
                <input
                  id="client-name"
                  type="text"
                  placeholder="e.g. John Doe"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-stone-800 border border-gray-300 dark:border-stone-700 text-gray-900 dark:text-stone-100 placeholder-gray-400 dark:placeholder-stone-500 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#f59e0b]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-stone-400 mb-1">
                Corporate Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-stone-500">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  id="client-email"
                  type="email"
                  placeholder="e.g. jdoe@miningcorp.co.za"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-stone-800 border border-gray-300 dark:border-stone-700 text-gray-900 dark:text-stone-100 placeholder-gray-400 dark:placeholder-stone-500 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#f59e0b]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-stone-400 mb-1">
                Company / Mining Joint-Venture
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-stone-500">
                  <Building className="h-4 w-4" />
                </span>
                <input
                  id="client-company"
                  type="text"
                  placeholder="e.g. Ndulu Gold Mines Ltd"
                  value={clientCompany}
                  onChange={(e) => setClientCompany(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-stone-800 border border-gray-300 dark:border-stone-700 text-gray-900 dark:text-stone-100 placeholder-gray-400 dark:placeholder-stone-500 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#f59e0b]"
                  required
                />
              </div>
            </div>

            {user ? (
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-emerald-800 dark:text-emerald-300 text-[11px] flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                <span className="truncate">Linked with Google ({user.email}) • Stored to Cloud Firestore</span>
              </div>
            ) : (
              <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg text-amber-800 dark:text-amber-300 text-[11px] flex items-center justify-between">
                <span>Want to track quotes on your Google account?</span>
                <button
                  type="button"
                  onClick={() => signInWithGoogle()}
                  className="font-bold underline text-amber-900 dark:text-amber-200 hover:text-amber-700 cursor-pointer"
                >
                  Sign in with Google
                </button>
              </div>
            )}

            {formError && (
              <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs rounded-lg flex items-center space-x-2">
                <ShieldAlert className="h-4 w-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <button
              id="btn-submit-quote"
              type="submit"
              className="w-full py-2.5 bg-[#f59e0b] hover:bg-amber-500 text-[#1c1917] font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
            >
              <FileSignature className="h-4 w-4" />
              <span>Submit Scope for Quote Review</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
