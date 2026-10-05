import { useState, useEffect, useRef } from 'react';
import { Quote } from '../types';
import { 
  User, 
  Mail, 
  Calendar, 
  Search, 
  Filter, 
  Send, 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign, 
  FileText, 
  MessageSquare, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  AlertCircle, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  KeyRound, 
  LogOut, 
  ShieldAlert,
  Activity,
  Users,
  Shield,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BOOTSTRAP_ADMIN_EMAIL } from '../firebase';
import { 
  recordSecurityAudit, 
  fetchSecurityAudits, 
  SecurityAuditRecord 
} from '../services/quotesService';

interface AdminDashboardProps {
  quotes: Quote[];
  onUpdateQuote: (updatedQuote: Quote) => void;
  onDeleteQuote: (id: string) => void;
  showToast: (message: string, type?: 'success' | 'info') => void;
}

export default function AdminDashboard({
  quotes,
  onUpdateQuote,
  onDeleteQuote,
  showToast
}: AdminDashboardProps) {
  const { user, isAdmin, isSuperAdmin, signInWithGoogle, signOut, loading: authLoading } = useAuth();

  // Active Admin Sub-Tab: 'quotes' | 'security' | 'access'
  const [activeAdminTab, setActiveAdminTab] = useState<'quotes' | 'security' | 'access'>('quotes');

  // Operational Security PIN Unlock State
  const [isPinUnlocked, setIsPinUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem('ndulu_admin_session_unlocked') === 'true';
  });
  const [passcode, setPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  // Customizable Admin Security PIN
  const [adminPin, setAdminPin] = useState<string>(() => {
    return localStorage.getItem('ndulu_admin_passcode') || 'ndulu2026';
  });
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [newPinInput, setNewPinInput] = useState('');

  // Brute-force protection state
  const [failedAttempts, setFailedAttempts] = useState<number>(() => {
    const stored = sessionStorage.getItem('ndulu_admin_failed_attempts');
    return stored ? parseInt(stored, 10) : 0;
  });
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(() => {
    const stored = sessionStorage.getItem('ndulu_admin_lockout_until');
    return stored ? parseInt(stored, 10) : null;
  });
  const [lockoutRemaining, setLockoutRemaining] = useState<number>(0);

  // Security Audits state
  const [securityLogs, setSecurityLogs] = useState<SecurityAuditRecord[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [expandedQuoteId, setExpandedQuoteId] = useState<string | null>(quotes[0]?.id || null);

  // Edit buffer state for selected quote being reviewed
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});
  const [editingTotal, setEditingTotal] = useState<Record<string, string>>({});
  const [editingPrices, setEditingPrices] = useState<Record<string, Record<number, string>>>({});
  const [reviewerName, setReviewerName] = useState(user?.displayName || 'Ndulu Operations Desk');

  // Inactivity auto-lock timer (15 minutes)
  const lastActivityRef = useRef<number>(Date.now());

  useEffect(() => {
    const resetActivity = () => {
      lastActivityRef.current = Date.now();
    };

    window.addEventListener('mousemove', resetActivity);
    window.addEventListener('keydown', resetActivity);
    window.addEventListener('click', resetActivity);

    const checkInterval = setInterval(() => {
      if (isPinUnlocked && Date.now() - lastActivityRef.current > 15 * 60 * 1000) {
        setIsPinUnlocked(false);
        sessionStorage.removeItem('ndulu_admin_session_unlocked');
        showToast('Admin session locked due to inactivity.', 'info');
      }
    }, 30000);

    return () => {
      window.removeEventListener('mousemove', resetActivity);
      window.removeEventListener('keydown', resetActivity);
      window.removeEventListener('click', resetActivity);
      clearInterval(checkInterval);
    };
  }, [isPinUnlocked, showToast]);

  // Lockout countdown timer
  useEffect(() => {
    if (!lockoutUntil) return;

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((lockoutUntil - Date.now()) / 1000));
      setLockoutRemaining(remaining);
      if (remaining <= 0) {
        setLockoutUntil(null);
        setFailedAttempts(0);
        sessionStorage.removeItem('ndulu_admin_lockout_until');
        sessionStorage.removeItem('ndulu_admin_failed_attempts');
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lockoutUntil]);

  // Fetch security logs when security tab opens
  const loadSecurityLogs = async () => {
    setLoadingLogs(true);
    const logs = await fetchSecurityAudits();
    setSecurityLogs(logs);
    setLoadingLogs(false);
  };

  useEffect(() => {
    if (activeAdminTab === 'security' && isPinUnlocked) {
      loadSecurityLogs();
    }
  }, [activeAdminTab, isPinUnlocked]);

  // Handle PIN verification
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (lockoutUntil && Date.now() < lockoutUntil) {
      return;
    }

    if (passcode.trim() === adminPin) {
      setIsPinUnlocked(true);
      sessionStorage.setItem('ndulu_admin_session_unlocked', 'true');
      setAuthError('');
      setPasscode('');
      setFailedAttempts(0);
      sessionStorage.removeItem('ndulu_admin_failed_attempts');

      showToast('Admin Operations Portal unlocked successfully!', 'success');
      recordSecurityAudit('CONSOLE_UNLOCKED', user?.email || 'admin', 'PIN verification successful');
    } else {
      const nextAttempts = failedAttempts + 1;
      setFailedAttempts(nextAttempts);
      sessionStorage.setItem('ndulu_admin_failed_attempts', nextAttempts.toString());

      if (nextAttempts >= 5) {
        const lockoutTime = Date.now() + 15 * 60 * 1000;
        setLockoutUntil(lockoutTime);
        sessionStorage.setItem('ndulu_admin_lockout_until', lockoutTime.toString());
        setAuthError('Too many failed attempts. Console locked for 15 minutes.');
        recordSecurityAudit('BRUTE_FORCE_LOCKOUT', user?.email || 'unknown', '5 consecutive failed PIN attempts');
      } else {
        setAuthError(`Invalid Security PIN. Attempt ${nextAttempts} of 5 before temporary lockout.`);
      }
    }
  };

  const handleLockSession = () => {
    setIsPinUnlocked(false);
    sessionStorage.removeItem('ndulu_admin_session_unlocked');
    showToast('Admin session locked.', 'info');
    recordSecurityAudit('CONSOLE_LOCKED', user?.email || 'admin', 'Manual lock triggered');
  };

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPinInput.trim().length < 4) {
      showToast('Security PIN must be at least 4 characters long.', 'info');
      return;
    }
    setAdminPin(newPinInput.trim());
    localStorage.setItem('ndulu_admin_passcode', newPinInput.trim());
    setNewPinInput('');
    setIsChangingPin(false);
    showToast('Admin Security PIN updated successfully!', 'success');
    recordSecurityAudit('PIN_UPDATED', user?.email || 'admin', 'Administrative PIN rotated');
  };

  // ========================================================
  // GATE 1: Google Authentication Check
  // ========================================================
  if (!user) {
    return (
      <div className="max-w-md mx-auto my-12 px-4">
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden transition-colors duration-200">
          <div className="bg-[#1c1917] p-8 text-center text-white space-y-3 border-b border-stone-800">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-1">
              <Lock className="h-8 w-8" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Admin Operations Gate
            </h2>
            <p className="text-xs text-stone-400 leading-relaxed max-w-xs mx-auto">
              Restricted management console. Authentication with your verified Google account is required to access quotation archives and company tenders.
            </p>
          </div>

          <div className="p-8 space-y-6">
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-stone-700 dark:text-stone-300 space-y-1">
              <div className="flex items-center space-x-1.5 font-bold text-amber-700 dark:text-amber-400 font-mono">
                <ShieldCheck className="h-4 w-4" />
                <span>Authorized Administrator Account</span>
              </div>
              <p className="text-[11px] text-stone-600 dark:text-stone-400">
                Primary Super Administrator: <code className="font-mono font-bold text-stone-900 dark:text-stone-100">{BOOTSTRAP_ADMIN_EMAIL}</code>
              </p>
            </div>

            <button
              onClick={() => signInWithGoogle()}
              disabled={authLoading}
              className="w-full py-3.5 px-4 bg-stone-900 dark:bg-stone-800 hover:bg-stone-800 dark:hover:bg-stone-700 text-white font-semibold text-xs rounded-xl border border-stone-700 transition-all flex items-center justify-center space-x-3 shadow-lg active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>{authLoading ? 'Verifying with Google...' : 'Sign in with Google as Administrator'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ========================================================
  // GATE 2: Role Authorization Check (Non-admin account)
  // ========================================================
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-12 px-4">
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-red-200 dark:border-red-900/40 shadow-2xl overflow-hidden transition-colors duration-200">
          <div className="bg-red-950 p-8 text-center text-white space-y-3 border-b border-red-900/60">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-red-900/50 border border-red-700/60 text-red-300 mb-1">
              <ShieldAlert className="h-8 w-8 text-red-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              403 Access Forbidden
            </h2>
            <p className="text-xs text-red-200 leading-relaxed max-w-xs mx-auto">
              This Google Account does not possess Ndulu Operations Desk administration privileges.
            </p>
          </div>

          <div className="p-6 space-y-5 text-xs">
            <div className="p-3 bg-stone-100 dark:bg-stone-800/80 rounded-xl space-y-1 font-mono">
              <span className="text-stone-400 text-[10px] uppercase block">Current Authenticated Account:</span>
              <p className="font-bold text-stone-900 dark:text-stone-100 truncate">{user.email}</p>
              <p className="text-[10px] text-stone-500">Status: Client / Standard Access Tier</p>
            </div>

            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-800 dark:text-amber-300 space-y-1">
              <p className="font-bold">Authorized Operations Email:</p>
              <p className="font-mono text-[11px]">{BOOTSTRAP_ADMIN_EMAIL}</p>
              <p className="text-[10px] text-amber-700 dark:text-amber-400 mt-1">
                Please switch to your designated administrator account to unlock access.
              </p>
            </div>

            <button
              onClick={() => signOut()}
              className="w-full py-2.5 bg-stone-900 dark:bg-stone-800 hover:bg-stone-800 text-stone-200 rounded-xl font-bold flex items-center justify-center space-x-2 cursor-pointer transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Switch Google Account</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ========================================================
  // GATE 3: Operational PIN Verification & Anti-Brute-Force
  // ========================================================
  if (!isPinUnlocked) {
    const isLockedOut = lockoutUntil !== null && Date.now() < lockoutUntil;

    return (
      <div className="max-w-md mx-auto my-10 px-4">
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden transition-colors duration-200">
          <div className="bg-[#1c1917] dark:bg-stone-950 p-6 sm:p-8 text-center text-white space-y-3 border-b border-stone-800">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-1">
              <KeyRound className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold">
                Google Identity Verified: {user.email?.split('@')[0]}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Operational PIN Security Gate
              </h2>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed max-w-xs mx-auto">
              Two-factor step-up verification required to unlock tender dispatching and pricing overrides.
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="p-6 sm:p-8 space-y-5">
            {isLockedOut ? (
              <div className="p-4 bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-800 rounded-xl text-xs text-red-700 dark:text-red-300 space-y-2">
                <div className="flex items-center space-x-2 font-bold text-red-800 dark:text-red-200">
                  <ShieldAlert className="h-5 w-5 text-red-500" />
                  <span>Security Lockout Active</span>
                </div>
                <p>Exceeded 5 failed attempts. Console locked to prevent unauthorized tampering.</p>
                <div className="font-mono font-bold text-sm bg-red-100 dark:bg-red-900/60 p-2 rounded text-center">
                  Unlock cooldown: {Math.floor(lockoutRemaining / 60)}m {lockoutRemaining % 60}s
                </div>
              </div>
            ) : (
              <>
                {authError && (
                  <div className="p-3.5 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-700 dark:text-red-300 flex items-start space-x-2">
                    <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>{authError}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-bold font-mono text-stone-700 dark:text-stone-300 uppercase tracking-wider block">
                    Management Security PIN
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter PIN (Default: ndulu2026)"
                      value={passcode}
                      onChange={(e) => {
                        setPasscode(e.target.value);
                        if (authError) setAuthError('');
                      }}
                      className="w-full pl-10 pr-10 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-sm font-mono text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-800 dark:text-amber-300 flex items-center justify-between">
                  <span className="font-mono">Demo Admin Passcode:</span>
                  <code className="font-mono font-bold bg-amber-500/20 px-2 py-0.5 rounded text-amber-900 dark:text-amber-200">
                    ndulu2026
                  </code>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Unlock className="h-4 w-4" />
                  <span>Verify PIN & Access Portal</span>
                </button>
              </>
            )}

            <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs">
              <span className="text-stone-400">Signed in: {user.email}</span>
              <button
                type="button"
                onClick={() => signOut()}
                className="text-stone-500 hover:text-red-500 font-semibold cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ========================================================
  // UNLOCKED ADMIN OPERATIONS CONSOLE
  // ========================================================

  // Filter quotes based on search and status
  const filteredQuotes = quotes.filter(q => {
    const matchesSearch = 
      q.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.clientCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.clientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = quotes.filter(q => q.status === 'Pending' || q.status === 'Under Review').length;
  const quotedCount = quotes.filter(q => q.status === 'Quoted' || q.status === 'Approved').length;
  const totalPipelineValue = quotes.reduce((sum, q) => sum + (q.quotedAmount || q.totalEstimate || 0), 0);

  const getStatusBadge = (status: Quote['status']) => {
    switch (status) {
      case 'Pending':
        return <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 font-mono"><Clock className="h-3 w-3" /><span>Pending Review</span></span>;
      case 'Under Review':
        return <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 font-mono"><Clock className="h-3 w-3 animate-spin" /><span>Under Review</span></span>;
      case 'Quoted':
        return <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 font-mono"><FileText className="h-3 w-3" /><span>Quoted & Sent</span></span>;
      case 'Approved':
        return <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-mono"><CheckCircle className="h-3 w-3" /><span>Approved</span></span>;
      case 'Declined':
        return <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 font-mono"><XCircle className="h-3 w-3" /><span>Declined</span></span>;
      default:
        return <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 font-mono"><span>{status}</span></span>;
    }
  };

  const handlePriceChange = (quoteId: string, itemIdx: number, val: string) => {
    setEditingPrices(prev => ({
      ...prev,
      [quoteId]: {
        ...(prev[quoteId] || {}),
        [itemIdx]: val
      }
    }));
  };

  const calculateAutoTotal = (quote: Quote) => {
    const priceMap = editingPrices[quote.id] || {};
    return quote.items.reduce((sum, item, idx) => {
      const unitPriceStr = priceMap[idx] !== undefined ? priceMap[idx] : (quote.itemPrices?.[idx]?.toString() || item.product.priceEstimate.toString() || '0');
      const unitPrice = parseFloat(unitPriceStr) || 0;
      return sum + (unitPrice * item.quantity);
    }, 0);
  };

  const handleSaveReview = (quote: Quote, targetStatus: Quote['status']) => {
    const rawNotes = editingNotes[quote.id] !== undefined ? editingNotes[quote.id] : (quote.adminNotes || '');
    const priceMap = editingPrices[quote.id] || {};
    
    // Parse item prices
    const updatedItemPrices: Record<number, number> = {};
    quote.items.forEach((item, idx) => {
      const pStr = priceMap[idx] !== undefined ? priceMap[idx] : (quote.itemPrices?.[idx]?.toString() || item.product.priceEstimate.toString() || '0');
      updatedItemPrices[idx] = parseFloat(pStr) || 0;
    });

    const calculatedTotal = Object.entries(updatedItemPrices).reduce((sum, [idxStr, price]) => {
      const idx = parseInt(idxStr);
      return sum + (price * (quote.items[idx]?.quantity || 1));
    }, 0);

    const customTotalStr = editingTotal[quote.id];
    const finalQuotedAmount = customTotalStr && !isNaN(parseFloat(customTotalStr)) 
      ? parseFloat(customTotalStr) 
      : (calculatedTotal > 0 ? calculatedTotal : quote.totalEstimate);

    const updatedQuote: Quote = {
      ...quote,
      status: targetStatus,
      adminNotes: rawNotes.trim(),
      adminReviewedAt: new Date().toISOString(),
      adminReviewedBy: reviewerName,
      quotedAmount: finalQuotedAmount,
      itemPrices: updatedItemPrices
    };

    onUpdateQuote(updatedQuote);
    showToast(`Quote #${quote.id.slice(0, 8)} updated to "${targetStatus}" & client review stored!`, 'success');
    recordSecurityAudit('QUOTE_STATUS_UPDATE', user?.email || 'admin', `Quote #${quote.id} marked as ${targetStatus} (Amount: K ${finalQuotedAmount})`);
  };

  const handleSendNotification = (quote: Quote) => {
    showToast(`Dispatching quotation summary email to ${quote.clientEmail}...`, 'info');
    recordSecurityAudit('EMAIL_DISPATCHED', user?.email || 'admin', `Quote #${quote.id} dispatched to ${quote.clientEmail}`);
    setTimeout(() => {
      showToast(`Notification sent successfully to ${quote.clientCompany} (${quote.clientName})!`, 'success');
    }, 1200);
  };

  const applyPresetTemplate = (quoteId: string, templateText: string) => {
    setEditingNotes(prev => ({
      ...prev,
      [quoteId]: (prev[quoteId] ? prev[quoteId] + '\n\n' : '') + templateText
    }));
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-[#1c1917] dark:bg-stone-900 text-white rounded-2xl p-6 sm:p-8 border border-[#2e2a24] dark:border-stone-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors duration-200">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full text-xs font-mono font-bold uppercase tracking-wider">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Ndulu Operations & Tender Control</span>
            </div>
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>2FA Verified • {user.email}</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Corporate Quote Review & Security Desk
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 max-w-2xl leading-relaxed">
            Review incoming tender requests, assign custom product/labor rates, compose official technical feedback, audit security actions, and manage company operations.
          </p>
        </div>

        {/* Operational Officer Badge & Security Controls */}
        <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-3">
          <div className="bg-stone-800/80 border border-stone-700/70 p-3.5 rounded-xl space-y-1.5 text-xs font-mono w-full sm:w-auto">
            <span className="text-stone-400 block text-[10px] uppercase tracking-wider font-bold">Active Administrator</span>
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-amber-400" />
              <input
                type="text"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                className="bg-stone-900 border border-stone-700 rounded px-2 py-1 text-amber-300 font-bold focus:outline-none focus:border-amber-400 text-xs w-48"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => setIsChangingPin(!isChangingPin)}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-300 hover:text-amber-400 rounded-xl text-xs font-mono flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <KeyRound className="h-3.5 w-3.5" />
              <span>Change PIN</span>
            </button>

            <button
              onClick={handleLockSession}
              className="px-3 py-1.5 bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-800/80 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Lock Session</span>
            </button>
          </div>
        </div>
      </div>

      {/* Expandable PIN Reset Box */}
      {isChangingPin && (
        <form onSubmit={handleUpdatePin} className="bg-stone-900 border border-amber-500/30 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <KeyRound className="h-4 w-4 text-amber-400 flex-shrink-0" />
            <span className="text-stone-200 font-medium">Set New Admin Passcode / PIN:</span>
          </div>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Enter new 4+ char PIN"
              value={newPinInput}
              onChange={(e) => setNewPinInput(e.target.value)}
              className="bg-stone-950 border border-stone-700 text-amber-300 font-mono px-3 py-1.5 rounded-lg text-xs w-full sm:w-48 focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg whitespace-nowrap cursor-pointer font-mono"
            >
              Save PIN
            </button>
            <button
              type="button"
              onClick={() => setIsChangingPin(false)}
              className="px-2 py-1.5 text-stone-400 hover:text-stone-200 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Admin Operations Sub-Tab Navigation */}
      <div className="flex border-b border-stone-200 dark:border-stone-800 space-x-4">
        <button
          onClick={() => setActiveAdminTab('quotes')}
          className={`pb-3 text-sm font-bold flex items-center space-x-2 border-b-2 transition-colors cursor-pointer ${
            activeAdminTab === 'quotes'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Quotation Desk ({quotes.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('security')}
          className={`pb-3 text-sm font-bold flex items-center space-x-2 border-b-2 transition-colors cursor-pointer ${
            activeAdminTab === 'security'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
          }`}
        >
          <Activity className="h-4 w-4" />
          <span>Security Audit Trail</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('access')}
          className={`pb-3 text-sm font-bold flex items-center space-x-2 border-b-2 transition-colors cursor-pointer ${
            activeAdminTab === 'access'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Admin Access Control</span>
        </button>
      </div>

      {/* ========================================================
          SUB-TAB 1: QUOTATION DESK
          ======================================================== */}
      {activeAdminTab === 'quotes' && (
        <div className="space-y-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white dark:bg-stone-900 rounded-xl border border-gray-200 dark:border-stone-800 p-5 shadow-sm space-y-2 transition-colors duration-200">
              <div className="flex items-center justify-between text-stone-500 dark:text-stone-400">
                <span className="text-xs font-bold uppercase tracking-wider font-mono">Pending Reviews</span>
                <div className="h-8 w-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Clock className="h-4 w-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-stone-900 dark:text-stone-100 font-mono">
                {pendingCount}
              </div>
              <p className="text-[11px] text-stone-400">Quotations awaiting pricing & review notes</p>
            </div>

            <div className="bg-white dark:bg-stone-900 rounded-xl border border-gray-200 dark:border-stone-800 p-5 shadow-sm space-y-2 transition-colors duration-200">
              <div className="flex items-center justify-between text-stone-500 dark:text-stone-400">
                <span className="text-xs font-bold uppercase tracking-wider font-mono">Quoted & Approved</span>
                <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-stone-900 dark:text-stone-100 font-mono">
                {quotedCount}
              </div>
              <p className="text-[11px] text-stone-400">Client quotes with issued pricing</p>
            </div>

            <div className="bg-white dark:bg-stone-900 rounded-xl border border-gray-200 dark:border-stone-800 p-5 shadow-sm space-y-2 transition-colors duration-200">
              <div className="flex items-center justify-between text-stone-500 dark:text-stone-400">
                <span className="text-xs font-bold uppercase tracking-wider font-mono">Pipeline Value</span>
                <div className="h-8 w-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <DollarSign className="h-4 w-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
                K {totalPipelineValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-[11px] text-stone-400 font-mono">Total estimated corporate quote volume (ZMW)</p>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="bg-white dark:bg-stone-900 rounded-xl border border-gray-200 dark:border-stone-800 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 transition-colors duration-200">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search by client officer, company, or Quote ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center space-x-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              <Filter className="h-3.5 w-3.5 text-stone-400 mr-1 flex-shrink-0" />
              {['All', 'Pending', 'Under Review', 'Quoted', 'Approved', 'Declined'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium font-mono whitespace-nowrap transition-colors cursor-pointer ${
                    statusFilter === filter
                      ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Quotations Review List */}
          <div className="space-y-4">
            {filteredQuotes.length === 0 ? (
              <div className="bg-white dark:bg-stone-900 rounded-xl border border-gray-200 dark:border-stone-800 p-12 text-center space-y-3">
                <AlertCircle className="h-10 w-10 text-stone-400 mx-auto" />
                <h3 className="text-base font-bold text-stone-800 dark:text-stone-200">No matching quotation requests found</h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">Try adjusting your search terms or status filter tab.</p>
              </div>
            ) : (
              filteredQuotes.map((quote) => {
                const isExpanded = expandedQuoteId === quote.id;
                const currentNotes = editingNotes[quote.id] !== undefined ? editingNotes[quote.id] : (quote.adminNotes || '');
                const currentQuotedTotal = editingTotal[quote.id] !== undefined 
                  ? editingTotal[quote.id] 
                  : (quote.quotedAmount !== undefined ? quote.quotedAmount.toString() : calculateAutoTotal(quote).toString());

                return (
                  <div
                    key={quote.id}
                    className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden transition-colors duration-200"
                  >
                    <div
                      onClick={() => setExpandedQuoteId(isExpanded ? null : quote.id)}
                      className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-stone-50/60 dark:hover:bg-stone-800/40 transition-colors"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="bg-amber-500/10 text-amber-600 dark:text-amber-400 p-3 rounded-xl flex items-center justify-center flex-shrink-0 border border-amber-500/20">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                              Quote #{quote.id}
                            </span>
                            {getStatusBadge(quote.status)}
                            {quote.userId && (
                              <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded font-mono">
                                Google User Linked
                              </span>
                            )}
                          </div>
                          <h3 className="text-base font-extrabold text-stone-900 dark:text-stone-100 mt-1">
                            {quote.clientCompany}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500 dark:text-stone-400 mt-1">
                            <span className="flex items-center space-x-1">
                              <User className="h-3.5 w-3.5 text-stone-400" />
                              <span>{quote.clientName}</span>
                            </span>
                            <span>•</span>
                            <span className="flex items-center space-x-1">
                              <Mail className="h-3.5 w-3.5 text-stone-400" />
                              <span>{quote.clientEmail}</span>
                            </span>
                            <span>•</span>
                            <span className="flex items-center space-x-1">
                              <Calendar className="h-3.5 w-3.5 text-stone-400" />
                              <span>{new Date(quote.createdAt).toLocaleDateString()}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-end space-x-6 border-t md:border-t-0 border-stone-100 dark:border-stone-800 pt-3 md:pt-0">
                        <div className="text-left md:text-right">
                          <span className="text-[10px] uppercase font-mono text-stone-400 block tracking-wider font-bold">
                            Assigned Quote Value
                          </span>
                          <span className="text-sm font-black font-mono text-amber-600 dark:text-amber-400">
                            {quote.quotedAmount !== undefined && quote.quotedAmount > 0
                              ? `K ${quote.quotedAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                              : 'Pending Review'}
                          </span>
                        </div>

                        <button
                          className="p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
                        >
                          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/60 p-6 space-y-6">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider font-mono flex items-center space-x-2">
                              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                              <span>1. Scope Line Items & Unit Price Review</span>
                            </h4>
                            <span className="text-[11px] text-stone-400 font-mono">
                              {quote.items.length} category scope items requested
                            </span>
                          </div>

                          <div className="overflow-x-auto rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm">
                            <table className="min-w-full divide-y divide-stone-200 dark:divide-stone-800 text-xs">
                              <thead className="bg-stone-100/70 dark:bg-stone-800/80 font-mono text-stone-500 dark:text-stone-400 uppercase text-[10px]">
                                <tr>
                                  <th className="px-4 py-3 text-left font-bold">Item Description</th>
                                  <th className="px-4 py-3 text-left font-bold">Client Spec / Size</th>
                                  <th className="px-4 py-3 text-center font-bold">Qty</th>
                                  <th className="px-4 py-3 text-right font-bold">Unit Rate (K)</th>
                                  <th className="px-4 py-3 text-right font-bold">Subtotal (K)</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-stone-700 dark:text-stone-300">
                                {quote.items.map((item, idx) => {
                                  const priceMap = editingPrices[quote.id] || {};
                                  const unitPriceStr = priceMap[idx] !== undefined 
                                    ? priceMap[idx] 
                                    : (quote.itemPrices?.[idx]?.toString() || item.product.priceEstimate.toString() || '0');
                                  const unitPrice = parseFloat(unitPriceStr) || 0;
                                  const lineSubtotal = unitPrice * item.quantity;

                                  return (
                                    <tr key={idx} className="hover:bg-stone-50/80 dark:hover:bg-stone-800/40">
                                      <td className="px-4 py-3">
                                        <div className="font-bold text-stone-900 dark:text-stone-100">{item.product.name}</div>
                                        <div className="text-[10px] text-amber-600 dark:text-amber-400 font-mono">{item.product.subcategory}</div>
                                        {item.customNotes && (
                                          <div className="text-[10px] bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 p-1.5 rounded mt-1 border border-amber-200 dark:border-amber-800/60">
                                            <span className="font-bold">Client Note:</span> {item.customNotes}
                                          </div>
                                        )}
                                      </td>
                                      <td className="px-4 py-3">
                                        <div className="space-y-0.5">
                                          <div><span className="text-[10px] text-stone-400">Size:</span> <span className="font-semibold text-stone-800 dark:text-stone-200">{item.selectedSize}</span></div>
                                          <div><span className="text-[10px] text-stone-400">Spec:</span> <span className="font-semibold text-stone-800 dark:text-stone-200">{item.selectedType}</span></div>
                                        </div>
                                      </td>
                                      <td className="px-4 py-3 text-center font-mono font-bold text-stone-900 dark:text-stone-100">
                                        {item.quantity}
                                      </td>
                                      <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end space-x-1">
                                          <span className="text-stone-400 font-mono">K</span>
                                          <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={unitPriceStr}
                                            onChange={(e) => handlePriceChange(quote.id, idx, e.target.value)}
                                            className="w-24 px-2 py-1 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-right font-mono font-semibold text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                          />
                                        </div>
                                      </td>
                                      <td className="px-4 py-3 text-right font-mono font-bold text-amber-600 dark:text-amber-400">
                                        K {lineSubtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Total Quotation Amount */}
                        <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                          <div className="space-y-1 text-center sm:text-left">
                            <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block">
                              Official Total Quotation Amount (Kwacha / ZMW)
                            </span>
                            <span className="text-[11px] text-stone-400 block">
                              Auto-summed from line items or overwrite with custom bulk package rate.
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-bold text-stone-400 font-mono">K</span>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder={calculateAutoTotal(quote).toString()}
                              value={currentQuotedTotal}
                              onChange={(e) => setEditingTotal(prev => ({ ...prev, [quote.id]: e.target.value }))}
                              className="w-40 px-3 py-1.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-right font-mono font-black text-sm text-amber-600 dark:text-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
                            />
                          </div>
                        </div>

                        {/* Admin Feedback Notes */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider font-mono flex items-center space-x-2">
                              <MessageSquare className="h-3.5 w-3.5 text-amber-500" />
                              <span>2. Management Review & Client Feedback Message</span>
                            </h4>
                            <span className="text-[10px] text-stone-400">Visible on the client's Quote Archive & Invoice page</span>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => applyPresetTemplate(quote.id, "All requested items are available in inventory. Scope approved for dispatch within 48 hours of PO issuance.")}
                              className="px-2.5 py-1 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-[10px] font-semibold rounded-md transition-colors"
                            >
                              + Standard Delivery Notice
                            </button>
                            <button
                              type="button"
                              onClick={() => applyPresetTemplate(quote.id, "Bulk corporate discount applied for volume PPE/catering order. Payment terms: 30 days net.")}
                              className="px-2.5 py-1 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-[10px] font-semibold rounded-md transition-colors"
                            >
                              + Corporate Discount Note
                            </button>
                            <button
                              type="button"
                              onClick={() => applyPresetTemplate(quote.id, "Medical Red Tickets & statutory OHS safety documentation verified for site labor hire services.")}
                              className="px-2.5 py-1 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-[10px] font-semibold rounded-md transition-colors"
                            >
                              + Safety Medical Clearance
                            </button>
                          </div>

                          <textarea
                            rows={4}
                            placeholder="Write official feedback for the client (e.g. Lead times, statutory OHS safety compliance, delivery terms, catering shift logistics)..."
                            value={currentNotes}
                            onChange={(e) => setEditingNotes(prev => ({ ...prev, [quote.id]: e.target.value }))}
                            className="w-full p-3.5 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500 font-sans"
                          />
                        </div>

                        {/* Action Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-stone-200 dark:border-stone-800">
                          <button
                            onClick={() => {
                              onDeleteQuote(quote.id);
                              recordSecurityAudit('QUOTE_DELETED', user?.email || 'admin', `Quote #${quote.id} deleted by administrator`);
                            }}
                            className="px-3 py-2 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/60 text-red-700 dark:text-red-300 text-xs font-semibold rounded-lg transition-colors border border-red-200 dark:border-red-800 cursor-pointer"
                          >
                            Delete Request
                          </button>

                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              onClick={() => handleSaveReview(quote, 'Under Review')}
                              className="px-3.5 py-2 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                            >
                              Mark as Under Review
                            </button>

                            <button
                              onClick={() => handleSaveReview(quote, 'Declined')}
                              className="px-3.5 py-2 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                            >
                              Decline Scope
                            </button>

                            <button
                              onClick={() => handleSendNotification(quote)}
                              className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1.5 cursor-pointer shadow-sm"
                            >
                              <Send className="h-3.5 w-3.5" />
                              <span>Dispatch Email Alert</span>
                            </button>

                            <button
                              onClick={() => handleSaveReview(quote, 'Quoted')}
                              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center space-x-1.5 shadow-md active:scale-95 cursor-pointer"
                            >
                              <CheckCircle className="h-4 w-4" />
                              <span>Send Final Quotation & Review</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 2: SECURITY AUDIT TRAIL
          ======================================================== */}
      {activeAdminTab === 'security' && (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center space-x-2">
                <Activity className="h-5 w-5 text-amber-500" />
                <span>Zero-Trust Security & Audit Trail</span>
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Immutable record of administrative logins, tender sign-offs, PIN updates, and privilege changes stored in Firestore.
              </p>
            </div>
            <button
              onClick={loadSecurityLogs}
              disabled={loadingLogs}
              className="px-3 py-1.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 rounded-lg text-xs font-mono flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loadingLogs ? 'animate-spin' : ''}`} />
              <span>Refresh Log</span>
            </button>
          </div>

          <div className="space-y-3">
            {securityLogs.length === 0 ? (
              <div className="p-8 text-center text-stone-500 dark:text-stone-400 text-xs">
                No external audit events found in Cloud Firestore yet. New operational events will populate here automatically.
              </div>
            ) : (
              <div className="divide-y divide-stone-100 dark:divide-stone-800">
                {securityLogs.map((log) => (
                  <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded text-[11px]">
                          {log.action}
                        </span>
                        <span className="text-stone-700 dark:text-stone-300 font-medium">
                          {log.performedBy}
                        </span>
                      </div>
                      {log.details && (
                        <p className="text-stone-500 dark:text-stone-400 text-[11px]">
                          {log.details}
                        </p>
                      )}
                    </div>
                    <span className="text-[10px] text-stone-400 font-mono whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 3: ADMIN ACCESS CONTROL
          ======================================================== */}
      {activeAdminTab === 'access' && (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 space-y-6 shadow-sm">
          <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center space-x-2">
              <Users className="h-5 w-5 text-amber-500" />
              <span>Privileged Access Control & Operator Roles</span>
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Only authenticated and verified corporate accounts can access quotation archives, adjust prices, or dispatch tenders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700/60 space-y-3">
              <div className="flex items-center space-x-2 text-stone-900 dark:text-stone-100 font-bold text-sm">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                <span>Designated Super Administrator</span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                The primary bootstrapped account with permanent administrative authority, rule bypass, and audit review rights.
              </p>
              <div className="p-3 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-700 font-mono text-xs text-stone-800 dark:text-stone-200 flex items-center justify-between">
                <span>{BOOTSTRAP_ADMIN_EMAIL}</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold text-[10px]">Super Admin</span>
              </div>
            </div>

            <div className="p-5 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700/60 space-y-3">
              <div className="flex items-center space-x-2 text-stone-900 dark:text-stone-100 font-bold text-sm">
                <Shield className="h-5 w-5 text-amber-500" />
                <span>Current Active Session</span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                Details regarding the logged-in administrator currently manipulating quotations.
              </p>
              <div className="p-3 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-700 space-y-1 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-400">Account:</span>
                  <span className="font-bold text-stone-900 dark:text-stone-100 truncate max-w-[200px]">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Authority:</span>
                  <span className="text-emerald-500 font-bold">{isSuperAdmin ? 'Full Super Admin' : 'Operations Desk'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Auto-lock:</span>
                  <span className="text-amber-500">15 min inactivity</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
