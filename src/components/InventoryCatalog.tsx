import { useState, useMemo } from 'react';
import { Search, Eye, Plus, ShoppingCart, CheckCircle, ShieldAlert, Award } from 'lucide-react';
import { Product } from '../types';
import { inventory } from '../data/inventory';

interface InventoryCatalogProps {
  onAddToQuote: (product: Product, size: string, type: string, quantity: number) => void;
  activeQuoteItems: { product: Product }[];
}

export default function InventoryCatalog({ onAddToQuote, activeQuoteItems }: InventoryCatalogProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Hardware' | 'Heavy Duty Spares' | 'Services'>('All');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Configuration State for adding to quote
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedNotification, setAddedNotification] = useState<string | null>(null);

  // Calculate unique subcategories for filters
  const subcategories = useMemo(() => {
    const list = new Set<string>();
    inventory.forEach(item => {
      if (selectedCategory === 'All' || item.category === selectedCategory) {
        list.add(item.subcategory);
      }
    });
    return ['All', ...Array.from(list)];
  }, [selectedCategory]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return inventory.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                            p.description.toLowerCase().includes(search.toLowerCase()) ||
                            p.subcategory.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesSubcategory = selectedSubcategory === 'All' || p.subcategory === selectedSubcategory;
      return matchesSearch && matchesCategory && matchesSubcategory;
    });
  }, [search, selectedCategory, selectedSubcategory]);

  const handleOpenDetails = (product: Product) => {
    setSelectedProduct(product);
    setSelectedSize(product.sizes[0] || 'Standard');
    setSelectedType(product.types[0] || 'Standard');
    setQuantity(1);
  };

  const handleAdd = (product: Product) => {
    const finalSize = selectedSize || product.sizes[0] || 'Standard';
    const finalType = selectedType || product.types[0] || 'Standard';
    onAddToQuote(product, finalSize, finalType, quantity);

    setAddedNotification(product.id);
    setTimeout(() => {
      setAddedNotification(null);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters Header */}
      <div className="bg-white dark:bg-stone-900 p-6 rounded-xl border border-gray-200 dark:border-stone-800 shadow-sm space-y-4 transition-colors duration-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1c1917] dark:text-stone-100 tracking-tight">Industrial Procurement Catalog</h1>
            <p className="text-sm text-gray-500 dark:text-stone-400">Select premium SANS-compliant mining PPE, heavy duty equipment spares, hardware, and accredited site services.</p>
          </div>
          
          <div className="relative max-w-md w-full">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 dark:text-stone-500">
              <Search className="h-5 w-5" />
            </span>
            <input
              id="catalog-search"
              type="text"
              placeholder="Search specifications, products or services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-stone-800 border border-gray-300 dark:border-stone-700 rounded-lg text-sm text-gray-900 dark:text-stone-100 placeholder-gray-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Categories Tab Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100 dark:border-stone-800">
          <button
            id="cat-filter-all"
            onClick={() => { setSelectedCategory('All'); setSelectedSubcategory('All'); }}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
              selectedCategory === 'All'
                ? 'bg-[#1c1917] dark:bg-amber-500 text-white dark:text-stone-950 shadow-sm'
                : 'bg-gray-100 dark:bg-stone-800 text-gray-600 dark:text-stone-300 hover:bg-gray-200 dark:hover:bg-stone-700'
            }`}
          >
            All Inventory
          </button>
          <button
            id="cat-filter-hardware"
            onClick={() => { setSelectedCategory('Hardware'); setSelectedSubcategory('All'); }}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
              selectedCategory === 'Hardware'
                ? 'bg-[#f59e0b] text-[#1c1917] shadow-sm font-bold'
                : 'bg-gray-100 dark:bg-stone-800 text-gray-600 dark:text-stone-300 hover:bg-gray-200 dark:hover:bg-stone-700'
            }`}
          >
            Mining Hardware & PPE
          </button>
          <button
            id="cat-filter-spares"
            onClick={() => { setSelectedCategory('Heavy Duty Spares'); setSelectedSubcategory('All'); }}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
              selectedCategory === 'Heavy Duty Spares'
                ? 'bg-amber-600 dark:bg-amber-500 text-white dark:text-stone-950 font-bold shadow-sm'
                : 'bg-gray-100 dark:bg-stone-800 text-gray-600 dark:text-stone-300 hover:bg-gray-200 dark:hover:bg-stone-700'
            }`}
          >
            Heavy Duty Spares
          </button>
          <button
            id="cat-filter-services"
            onClick={() => { setSelectedCategory('Services'); setSelectedSubcategory('All'); }}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
              selectedCategory === 'Services'
                ? 'bg-amber-800 dark:bg-amber-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-stone-800 text-gray-600 dark:text-stone-300 hover:bg-gray-200 dark:hover:bg-stone-700'
            }`}
          >
            Technical Services
          </button>

          {/* Subcategory dropdown or pills */}
          {subcategories.length > 2 && (
            <div className="flex items-center ml-auto space-x-2">
              <span className="text-xs text-gray-400 dark:text-stone-400 font-mono">Filter Subcategory:</span>
              <select
                id="subcategory-select"
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
                className="bg-gray-50 dark:bg-stone-800 border border-gray-300 dark:border-stone-700 text-gray-900 dark:text-stone-100 rounded-lg text-xs py-1 px-3 focus:outline-none focus:ring-1 focus:ring-[#f59e0b]"
              >
                {subcategories.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Product Display Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((p) => {
          const isAdded = activeQuoteItems.some(item => item.product.id === p.id);
          return (
            <div
              key={p.id}
              id={`product-card-${p.id}`}
              className="bg-white dark:bg-stone-900 rounded-xl border border-gray-200 dark:border-stone-800 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group"
            >
              {/* Image Section */}
              <div className="h-48 w-full bg-gray-100 dark:bg-stone-800 relative overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  <span className={`px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase rounded shadow-sm ${
                    p.category === 'Hardware' 
                      ? 'bg-[#1c1917] dark:bg-stone-950 text-[#f59e0b]' 
                      : p.category === 'Heavy Duty Spares'
                      ? 'bg-amber-600 dark:bg-amber-500 text-stone-950 font-extrabold'
                      : 'bg-amber-800 text-white'
                  }`}>
                    {p.category}
                  </span>
                  <span className="px-2.5 py-1 text-[10px] bg-white dark:bg-stone-900 text-gray-700 dark:text-stone-300 font-medium rounded shadow-sm border border-gray-100 dark:border-stone-800">
                    {p.subcategory}
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-0.5 text-[9px] font-mono rounded font-bold uppercase tracking-wider ${
                    p.stockStatus === 'In Stock' 
                      ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60' 
                      : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60'
                  }`}>
                    {p.stockStatus}
                  </span>
                </div>
              </div>

              {/* Info Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-stone-100 leading-snug hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer" onClick={() => handleOpenDetails(p)}>
                    {p.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-stone-400 mt-1 line-clamp-2">
                    {p.description}
                  </p>

                  {/* Safety Accreditations list */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {p.safetyStandards.slice(0, 2).map((std, i) => (
                      <span key={i} className="inline-flex items-center space-x-1 text-[9px] bg-gray-100 dark:bg-stone-800 text-gray-700 dark:text-stone-300 px-2 py-0.5 rounded border border-gray-200 dark:border-stone-700 font-mono">
                        <Award className="h-2.5 w-2.5 text-amber-600 dark:text-amber-400" />
                        <span>{std}</span>
                      </span>
                    ))}
                    {p.safetyStandards.length > 2 && (
                      <span className="text-[8px] text-gray-400 dark:text-stone-500 self-center font-mono pl-1">
                        +{p.safetyStandards.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-100 dark:border-stone-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-amber-700 dark:text-amber-400 block font-mono font-bold">
                      Price Model
                    </span>
                    <span className="text-xs font-bold text-gray-700 dark:text-stone-300 font-mono bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 px-2 py-0.5 rounded">
                      Quote Upon Review
                    </span>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      id={`btn-view-${p.id}`}
                      onClick={() => handleOpenDetails(p)}
                      className="p-2 text-gray-500 dark:text-stone-400 hover:text-[#1c1917] dark:hover:text-stone-100 hover:bg-gray-100 dark:hover:bg-stone-800 rounded-lg transition-colors border border-gray-200 dark:border-stone-700"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      id={`btn-add-quick-${p.id}`}
                      onClick={() => {
                        setSelectedSize(p.sizes[0] || 'Standard');
                        setSelectedType(p.types[0] || 'Standard');
                        handleAdd(p);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all duration-200 ${
                        isAdded
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60'
                          : 'bg-[#1c1917] dark:bg-amber-500 hover:bg-[#2e2a24] dark:hover:bg-amber-400 text-white dark:text-stone-950'
                      }`}
                    >
                      {addedNotification === p.id ? (
                        <>
                          <CheckCircle className="h-3.5 w-3.5" />
                          <span>Added!</span>
                        </>
                      ) : (
                        <>
                          <Plus className="h-3.5 w-3.5" />
                          <span>{isAdded ? 'Add More' : 'Add Quote'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Details & Config Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white dark:bg-stone-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 dark:border-stone-800 text-gray-900 dark:text-stone-100">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 dark:border-stone-800 flex items-center justify-between sticky top-0 bg-white dark:bg-stone-900 z-10">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-[#f59e0b] uppercase font-mono block">
                  {selectedProduct.category} &rsaquo; {selectedProduct.subcategory}
                </span>
                <h2 id="modal-product-title" className="text-xl font-extrabold text-gray-900 dark:text-stone-100 leading-tight">
                  {selectedProduct.name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-stone-200 p-1.5 hover:bg-gray-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
              >
                <span className="text-lg font-bold">✕</span>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Visual Cover */}
                <div className="space-y-4">
                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-gray-50 dark:bg-stone-800 border border-gray-200 dark:border-stone-700">
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Safety Alert Panel */}
                  <div className="bg-amber-50 dark:bg-amber-950/40 rounded-xl p-4 border border-amber-200 dark:border-amber-800/60">
                    <div className="flex space-x-3">
                      <ShieldAlert className="h-5 w-5 text-amber-700 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-bold text-amber-950 dark:text-amber-300 uppercase tracking-wide">
                          Regulatory Standards Verified
                        </h4>
                        <div className="mt-1 space-y-1">
                          {selectedProduct.safetyStandards.map((std, i) => (
                            <div key={i} className="text-xs text-amber-800 dark:text-amber-200 font-medium flex items-center space-x-1.5">
                              <span className="text-amber-500">•</span>
                              <span>{std}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Specs and Details */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 dark:text-stone-400 uppercase tracking-widest font-mono">
                      Product Description
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-stone-300 mt-1 leading-relaxed">
                      {selectedProduct.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-gray-400 dark:text-stone-400 uppercase tracking-widest font-mono">
                      Technical Specifications
                    </h3>
                    <ul className="mt-2 space-y-1.5">
                      {selectedProduct.specifications.map((spec, i) => (
                        <li key={i} className="text-xs text-gray-600 dark:text-stone-300 flex items-start space-x-2">
                          <span className="text-[#f59e0b] font-bold flex-shrink-0 mt-0.5">✔</span>
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Quote Customization and Adding */}
              <div className="bg-gray-50 dark:bg-stone-800/60 rounded-2xl p-5 border border-gray-200 dark:border-stone-700 space-y-4">
                <h4 className="text-sm font-bold text-gray-900 dark:text-stone-100 flex items-center space-x-2">
                  <ShoppingCart className="h-4 w-4 text-[#f59e0b]" />
                  <span>Customize For Quote Request</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Size Config */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-stone-400 mb-1">
                      Choose Size/Capacity
                    </label>
                    <select
                      id="modal-size-select"
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      className="w-full bg-white dark:bg-stone-900 border border-gray-300 dark:border-stone-700 text-gray-900 dark:text-stone-100 rounded-lg py-1.5 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#f59e0b]"
                    >
                      {selectedProduct.sizes.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  {/* Type Config */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-stone-400 mb-1">
                      Choose Type/Specification
                    </label>
                    <select
                      id="modal-type-select"
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full bg-white dark:bg-stone-900 border border-gray-300 dark:border-stone-700 text-gray-900 dark:text-stone-100 rounded-lg py-1.5 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#f59e0b]"
                    >
                      {selectedProduct.types.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-stone-400 mb-1">
                      Quantity
                    </label>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="px-2 py-1 bg-white dark:bg-stone-900 border border-gray-300 dark:border-stone-700 text-gray-900 dark:text-stone-100 rounded text-xs hover:bg-gray-100 dark:hover:bg-stone-800 font-bold"
                      >
                        -
                      </button>
                      <input
                        id="modal-quantity-input"
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-12 text-center bg-white dark:bg-stone-900 border border-gray-300 dark:border-stone-700 text-gray-900 dark:text-stone-100 rounded py-1 text-xs focus:outline-none"
                      />
                      <button
                        onClick={() => setQuantity(q => q + 1)}
                        className="px-2 py-1 bg-white dark:bg-stone-900 border border-gray-300 dark:border-stone-700 text-gray-900 dark:text-stone-100 rounded text-xs hover:bg-gray-100 dark:hover:bg-stone-800 font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-gray-200 dark:border-stone-700">
                  <div>
                    <span className="text-xs text-amber-700 dark:text-amber-400 block font-mono font-bold">Pricing Policy</span>
                    <span className="text-xs text-gray-500 dark:text-stone-400 max-w-[200px] block">
                      Custom pricing calculated upon specialist review.
                    </span>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => setSelectedProduct(null)}
                      className="px-4 py-2 bg-white dark:bg-stone-900 border border-gray-300 dark:border-stone-700 text-gray-700 dark:text-stone-300 text-xs font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-stone-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      id="btn-modal-add"
                      onClick={() => {
                        handleAdd(selectedProduct);
                        setSelectedProduct(null);
                      }}
                      className="px-6 py-2 bg-[#1c1917] dark:bg-amber-500 text-white dark:text-stone-950 text-xs font-semibold rounded-lg hover:bg-[#2e2a24] dark:hover:bg-amber-400 transition-colors flex items-center space-x-1.5 shadow"
                    >
                      <ShoppingCart className="h-3.5 w-3.5 text-[#f59e0b] dark:text-stone-950" />
                      <span>Add to Quote Request</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
