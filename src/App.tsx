import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import InventoryCatalog from './components/InventoryCatalog';
import QuoteBuilder from './components/QuoteBuilder';
import SafetyAdvisor from './components/SafetyAdvisor';
import PastQuotes from './components/PastQuotes';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';
import { Product, QuoteItem, Quote } from './types';
import { ShieldCheck, Flame, Award, Zap } from 'lucide-react';
import heroBgImage from './assets/images/mining_hero_bg_1785169655502.jpg';
import { useAuth } from './context/AuthContext';
import { 
  subscribeToQuotes, 
  saveQuoteToFirestore, 
  updateQuoteInFirestore, 
  deleteQuoteFromFirestore 
} from './services/quotesService';

export default function App() {
  const { user, isAdmin } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('catalog');
  const [activeQuoteItems, setActiveQuoteItems] = useState<QuoteItem[]>([]);
  const [savedQuotes, setSavedQuotes] = useState<Quote[]>([]);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('ndulu_dark_mode');
    if (saved !== null) {
      try { return JSON.parse(saved); } catch (e) { return false; }
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('ndulu_dark_mode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  // Load initial quotes and cart from local storage cache
  useEffect(() => {
    const storedQuotes = localStorage.getItem('ndulu_saved_quotes');
    if (storedQuotes) {
      try {
        setSavedQuotes(JSON.parse(storedQuotes));
      } catch (e) {
        console.error("Error reading saved quotes:", e);
      }
    } else {
      // Seed an initial mock quote for visual demonstration
      const seedQuote: Quote = {
        id: 'ND-Q-98105',
        clientName: 'Sizwe Ndlovu',
        clientEmail: 's.ndlovu@ndulugold.co.za',
        clientCompany: 'Ndulu Gold Exploration Ltd',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000 * 2).toISOString(),
        status: 'Approved',
        totalEstimate: 12565.00,
        items: [
          {
            product: {
              id: 'nd-hw-109',
              name: 'Solar Installation Services',
              category: 'Services',
              subcategory: 'Clean Energy & Solar',
              description: 'Professional, custom-engineered commercial & industrial solar PV installation services designed to dramatically reduce operational electricity costs, ensure business continuity during grid outages, and meet corporate ESG sustainability metrics.',
              priceEstimate: 12500.00,
              specifications: ['On-site solar irradiance modeling', 'High-efficiency Tier-1 monocrystalline panels'],
              safetyStandards: ['SANS 10142-1', 'SAPVIA PV GreenCard'],
              image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=500&q=80',
              stockStatus: 'In Stock',
              sizes: ['50 kWp Commercial System'],
              types: ['Grid-Tied Solar System']
            },
            selectedSize: '50 kWp Commercial System',
            selectedType: 'Grid-Tied Solar System',
            quantity: 1,
            customNotes: 'Requesting on-site evaluation at Shaft 4 head office roof.'
          },
          {
            product: {
              id: 'nd-hw-108',
              name: 'Labour Hire Services',
              category: 'Services',
              subcategory: 'On-Site Skilled Trades',
              description: 'Professional, fully-vetted, and induction-cleared skilled labour hire for underground and open-cast mining sites.',
              priceEstimate: 65.00,
              specifications: ['Pre-inducted tradespeople', 'Fully equipped with certified Level 2/3 PPE'],
              safetyStandards: ['ISO 9001 Compliant', 'MQA Accredited'],
              image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOsq1LCKYJYEvBcmJmF1amy2rqRFpu-9xg_HG3rg_yaz4a-v5Oc-Rnq5Zk&s=10',
              stockStatus: 'In Stock',
              sizes: ['Single Shift (8 Hours)'],
              types: ['Certified Coded Welder / Boilermaker']
            },
            selectedSize: 'Single Shift (8 Hours)',
            selectedType: 'Certified Coded Welder / Boilermaker',
            quantity: 1,
            customNotes: 'boilermaker emergency shift for conveyor structure reinforcement.'
          }
        ]
      };
      setSavedQuotes([seedQuote]);
      localStorage.setItem('ndulu_saved_quotes', JSON.stringify([seedQuote]));
    }

    const storedCart = localStorage.getItem('ndulu_active_cart');
    if (storedCart) {
      try {
        setActiveQuoteItems(JSON.parse(storedCart));
      } catch (e) {
        console.error("Error reading active cart:", e);
      }
    }
  }, []);

  // Real-time Firestore quotes subscription
  useEffect(() => {
    const unsubscribe = subscribeToQuotes(
      user?.uid,
      isAdmin,
      (remoteQuotes) => {
        if (remoteQuotes.length > 0) {
          setSavedQuotes(prevLocal => {
            // Merge remote quotes with any local cached items
            const map = new Map<string, Quote>();
            prevLocal.forEach(q => map.set(q.id, q));
            remoteQuotes.forEach(q => map.set(q.id, q));
            const merged = Array.from(map.values()).sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            localStorage.setItem('ndulu_saved_quotes', JSON.stringify(merged));
            return merged;
          });
        }
      },
      (err) => {
        console.warn('Realtime subscription notice:', err.message);
      }
    );

    return () => unsubscribe();
  }, [user, isAdmin]);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleAddToQuote = (product: Product, size: string, type: string, quantity: number) => {
    setActiveQuoteItems(prevItems => {
      const existingIdx = prevItems.findIndex(
        item => item.product.id === product.id &&
                item.selectedSize === size &&
                item.selectedType === type
      );

      let updated;
      if (existingIdx > -1) {
        updated = [...prevItems];
        updated[existingIdx].quantity += quantity;
      } else {
        updated = [...prevItems, { product, selectedSize: size, selectedType: type, quantity }];
      }

      localStorage.setItem('ndulu_active_cart', JSON.stringify(updated));
      return updated;
    });

    showToast(`Added ${quantity}x ${product.name} to Quote Builder.`);
  };

  const handleUpdateItem = (index: number, quantity: number, size: string, type: string, notes: string) => {
    setActiveQuoteItems(prevItems => {
      const updated = [...prevItems];
      updated[index] = {
        ...updated[index],
        quantity,
        selectedSize: size,
        selectedType: type,
        customNotes: notes
      };
      localStorage.setItem('ndulu_active_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const handleRemoveItem = (index: number) => {
    setActiveQuoteItems(prevItems => {
      const updated = prevItems.filter((_, i) => i !== index);
      localStorage.setItem('ndulu_active_cart', JSON.stringify(updated));
      return updated;
    });
    showToast('Item removed from active quote.', 'info');
  };

  const handleSubmitQuote = async (quoteDetails: Omit<Quote, 'id' | 'createdAt' | 'status'>) => {
    const newQuote: Quote = {
      ...quoteDetails,
      id: `ND-Q-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
      status: 'Pending',
      userId: user?.uid
    };

    // Update local state immediately
    setSavedQuotes(prevQuotes => {
      const updated = [newQuote, ...prevQuotes];
      localStorage.setItem('ndulu_saved_quotes', JSON.stringify(updated));
      return updated;
    });

    // Save to Firestore
    try {
      await saveQuoteToFirestore(newQuote);
    } catch (e) {
      console.warn('Quote saved to local cache; Firestore sync notice:', e);
    }

    // Clear active cart
    setActiveQuoteItems([]);
    localStorage.removeItem('ndulu_active_cart');

    showToast('Scope submission successful! Stored in Firestore and under manual review.', 'success');
    setCurrentTab('past'); // Go to archives to view invoice
  };

  const handleDeleteQuote = async (id: string) => {
    setSavedQuotes(prevQuotes => {
      const updated = prevQuotes.filter(q => q.id !== id);
      localStorage.setItem('ndulu_saved_quotes', JSON.stringify(updated));
      return updated;
    });

    try {
      await deleteQuoteFromFirestore(id);
    } catch (e) {
      console.warn('Quote deletion from Firestore notice:', e);
    }

    showToast('Quote deleted from archives.', 'info');
  };

  const handleDuplicateQuote = (quote: Quote) => {
    setActiveQuoteItems(prevItems => {
      const updated = [...prevItems];
      quote.items.forEach(histItem => {
        const existingIdx = updated.findIndex(
          active => active.product.id === histItem.product.id &&
                    active.selectedSize === histItem.selectedSize &&
                    active.selectedType === histItem.selectedType
        );

        if (existingIdx > -1) {
          updated[existingIdx].quantity += histItem.quantity;
        } else {
          updated.push({
            product: histItem.product,
            selectedSize: histItem.selectedSize,
            selectedType: histItem.selectedType,
            quantity: histItem.quantity,
            customNotes: histItem.customNotes
          });
        }
      });

      localStorage.setItem('ndulu_active_cart', JSON.stringify(updated));
      return updated;
    });

    showToast(`Successfully duplicated scope from ${quote.clientCompany}!`, 'success');
    setCurrentTab('builder');
  };

  const handleUpdateQuoteByAdmin = async (updatedQuote: Quote) => {
    setSavedQuotes(prevQuotes => {
      const updated = prevQuotes.map(q => q.id === updatedQuote.id ? updatedQuote : q);
      localStorage.setItem('ndulu_saved_quotes', JSON.stringify(updated));
      return updated;
    });

    try {
      await updateQuoteInFirestore(updatedQuote);
    } catch (e) {
      console.warn('Firestore quote update notice:', e);
    }
  };

  const pendingQuoteCount = savedQuotes.filter(q => q.status === 'Pending' || q.status === 'Under Review').length;

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col justify-between selection:bg-[#f59e0b] selection:text-[#1c1917] font-sans antialiased transition-colors duration-200">
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        quoteCount={activeQuoteItems.reduce((sum, item) => sum + item.quantity, 0)}
        pendingQuoteCount={pendingQuoteCount}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Hero Spotlight Section (Only visible on Catalog main tab) */}
      {currentTab === 'catalog' && (
        <div className="relative bg-stone-950 text-white border-b border-stone-800/80 overflow-hidden">
          {/* Background Image Layer with Gradient Masks */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-35 scale-105 transition-transform duration-1000"
            style={{ backgroundImage: `url(${heroBgImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-stone-950" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/60" />

          {/* Glowing Ambient Light Accents */}
          <div className="absolute -top-24 left-1/4 w-96 h-96 bg-[#f59e0b]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 right-1/4 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Technical Subtle Grid Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f59e0b0a_1px,transparent_1px),linear-gradient(to_bottom,#f59e0b0a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16 text-center z-10">
            <div className="space-y-5">
              <span className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-stone-900/90 border border-[#f59e0b]/40 text-[#f59e0b] rounded-full text-xs font-semibold tracking-wider uppercase font-mono backdrop-blur-md shadow-lg shadow-black/40">
                <ShieldCheck className="h-4 w-4" />
                <span>Certified Industrial Mining Supplier</span>
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
                Premium Mining Hardware, Heavy Duty Spares & Services
              </h1>
              <p className="text-sm md:text-base text-gray-300 leading-relaxed max-w-2xl mx-auto font-normal">
                Ndulu General Dealers supplies high-grade industrial assets, heavy duty machinery spares, conveyor systems, accredited solar engineering, and skilled safety-inducted labor hire across Copperbelt and regional mining exploration sites.
              </p>
              
              {/* Enterprise Accreditations */}
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 pt-3">
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-stone-900/80 border border-stone-800 rounded-lg text-xs text-gray-200 font-mono backdrop-blur-sm">
                  <Flame className="h-4 w-4 text-[#f59e0b]" />
                  <span>Flame Retardant (ISO 340)</span>
                </div>
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-stone-900/80 border border-stone-800 rounded-lg text-xs text-gray-200 font-mono backdrop-blur-sm">
                  <Award className="h-4 w-4 text-emerald-400" />
                  <span>B-BBEE Level 1</span>
                </div>
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-stone-900/80 border border-stone-800 rounded-lg text-xs text-gray-200 font-mono backdrop-blur-sm">
                  <Zap className="h-4 w-4 text-amber-400" />
                  <span>Turnkey Engineering</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Workspace Frame */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {currentTab === 'catalog' && (
          <InventoryCatalog
            onAddToQuote={handleAddToQuote}
            activeQuoteItems={activeQuoteItems}
          />
        )}

        {currentTab === 'builder' && (
          <QuoteBuilder
            items={activeQuoteItems}
            onUpdateItem={handleUpdateItem}
            onRemoveItem={handleRemoveItem}
            onSubmitQuote={handleSubmitQuote}
            onNavigateToCatalog={() => setCurrentTab('catalog')}
          />
        )}

        {currentTab === 'advisor' && (
          <SafetyAdvisor
            activeQuoteItems={activeQuoteItems}
          />
        )}

        {currentTab === 'past' && (
          <PastQuotes
            quotes={savedQuotes}
            onDeleteQuote={handleDeleteQuote}
            onDuplicateQuote={handleDuplicateQuote}
          />
        )}

        {currentTab === 'admin' && (
          <AdminDashboard
            quotes={savedQuotes}
            onUpdateQuote={handleUpdateQuoteByAdmin}
            onDeleteQuote={handleDeleteQuote}
            showToast={showToast}
          />
        )}
      </main>

      {/* Toast Notification Container */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 p-4 rounded-xl border flex items-center space-x-3 shadow-xl max-w-md bg-[#1c1917] border-amber-500 text-white animate-slideIn">
          <div className="h-2 w-2 rounded-full bg-[#f59e0b] animate-ping" />
          <p className="text-xs font-medium">{notification.message}</p>
        </div>
      )}

      {/* Professional Corporate Footer */}
      <Footer onNavigate={setCurrentTab} showToast={showToast} />
    </div>
  );
}
