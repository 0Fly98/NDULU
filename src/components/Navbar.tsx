import { useState, useRef, useEffect } from 'react';
import { Shield, FileText, ClipboardList, HardHat, Factory, Sun, Moon, ShieldCheck, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  quoteCount: number;
  pendingQuoteCount?: number;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function Navbar({ currentTab, setCurrentTab, quoteCount, pendingQuoteCount = 0, isDarkMode, onToggleDarkMode }: NavbarProps) {
  const { user, isAdmin, isSuperAdmin, signInWithGoogle, signOut, loading } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignIn = async () => {
    setAuthLoading(true);
    try {
      await signInWithGoogle();
    } catch (e) {
      console.error('Sign-in failed:', e);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    setShowUserMenu(false);
    await signOut();
  };

  return (
    <nav className="bg-[#1c1917] dark:bg-stone-950 text-white sticky top-0 z-50 shadow-md border-b border-[#2e2a24] dark:border-stone-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand Section */}
          <div 
            onClick={() => setCurrentTab('catalog')}
            className="flex items-center space-x-3 cursor-pointer select-none"
          >
            <div className="bg-[#f59e0b] text-[#1c1917] p-2 rounded-lg flex items-center justify-center shadow-sm">
              <Factory id="nav-brand-icon" className="h-6 w-6 font-bold" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-wider uppercase block text-[#f59e0b]">
                Ndulu
              </span>
              <span className="text-[10px] text-gray-400 uppercase tracking-widest block -mt-1 font-mono">
                General Dealers
              </span>
            </div>
          </div>

          {/* Navigation Items & Theme Toggle */}
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3">
            <button
              id="nav-tab-catalog"
              onClick={() => setCurrentTab('catalog')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                currentTab === 'catalog'
                  ? 'bg-[#2e2a24] text-[#f59e0b] border-b-2 border-[#f59e0b]'
                  : 'text-gray-300 hover:bg-[#2e2a24] hover:text-white'
              }`}
            >
              <HardHat className="h-4 w-4" />
              <span className="hidden sm:inline">Products & Services</span>
            </button>

            <button
              id="nav-tab-builder"
              onClick={() => setCurrentTab('builder')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 relative ${
                currentTab === 'builder'
                  ? 'bg-[#2e2a24] text-[#f59e0b] border-b-2 border-[#f59e0b]'
                  : 'text-gray-300 hover:bg-[#2e2a24] hover:text-white'
              }`}
            >
              <ClipboardList className="h-4 w-4" />
              <span className="hidden sm:inline">Quote Builder</span>
              {quoteCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#f59e0b] text-[#1c1917] text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center animate-pulse">
                  {quoteCount}
                </span>
              )}
            </button>

            <button
              id="nav-tab-advisor"
              onClick={() => setCurrentTab('advisor')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                currentTab === 'advisor'
                  ? 'bg-[#2e2a24] text-[#f59e0b] border-b-2 border-[#f59e0b]'
                  : 'text-gray-300 hover:bg-[#2e2a24] hover:text-white'
              }`}
            >
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">AI Safety Advisor</span>
            </button>

            <button
              id="nav-tab-past"
              onClick={() => setCurrentTab('past')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                currentTab === 'past'
                  ? 'bg-[#2e2a24] text-[#f59e0b] border-b-2 border-[#f59e0b]'
                  : 'text-gray-300 hover:bg-[#2e2a24] hover:text-white'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Quote Archives</span>
            </button>

            {/* Google Authentication Control */}
            <div className="relative" ref={menuRef}>
              {user ? (
                <button
                  id="user-profile-button"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`flex items-center space-x-2 p-1 sm:px-2.5 sm:py-1 rounded-lg border transition-all text-xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                    currentTab === 'admin'
                      ? 'bg-amber-500/10 border-amber-500/50 text-amber-300'
                      : 'bg-stone-800/90 hover:bg-stone-800 border-stone-700'
                  }`}
                  title={user.email || 'User Account'}
                >
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName || 'User'} 
                      className="h-6 w-6 rounded-full border border-amber-500/50 object-cover" 
                    />
                  ) : (
                    <div className="h-6 w-6 rounded-full bg-amber-500 text-stone-950 font-bold flex items-center justify-center text-[11px] font-mono">
                      {(user.displayName || user.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <span className="hidden lg:inline max-w-[110px] truncate text-stone-200 font-medium">
                    {user.displayName?.split(' ')[0] || user.email?.split('@')[0]}
                  </span>
                  {isAdmin && (
                    <div className="flex items-center space-x-1">
                      <span className="hidden sm:inline-block px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-mono font-bold rounded">
                        Admin
                      </span>
                      {pendingQuoteCount > 0 && (
                        <span className="bg-amber-500 text-stone-950 text-[10px] font-extrabold h-4 w-4 rounded-full flex items-center justify-center font-mono">
                          {pendingQuoteCount}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              ) : (
                <button
                  id="google-login-btn"
                  onClick={handleSignIn}
                  disabled={authLoading || loading}
                  className="flex items-center space-x-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 text-white border border-stone-700 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                  title="Sign in with Google"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span className="hidden sm:inline font-mono">
                    {authLoading ? 'Signing in...' : 'Sign In with Google'}
                  </span>
                  <span className="sm:hidden font-mono">
                    {authLoading ? '...' : 'Login'}
                  </span>
                </button>
              )}

              {/* User Account Popover */}
              {showUserMenu && user && (
                <div className="absolute right-0 mt-2 w-72 bg-stone-900 border border-stone-700 rounded-xl shadow-2xl p-4 z-50 animate-fadeIn text-stone-100">
                  <div className="flex items-center space-x-3 pb-3 border-b border-stone-800">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="User" className="h-10 w-10 rounded-full border border-amber-500/50" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-amber-500 text-stone-950 font-bold flex items-center justify-center text-sm font-mono">
                        {(user.displayName || user.email || 'U')[0].toUpperCase()}
                      </div>
                    )}
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-white truncate">{user.displayName || 'Signed In User'}</p>
                      <p className="text-[11px] text-stone-400 font-mono truncate">{user.email}</p>
                      {isAdmin && (
                        <span className="inline-flex items-center space-x-1 mt-1 px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold">
                          <ShieldCheck className="h-3 w-3" />
                          <span>{isSuperAdmin ? 'Super Administrator' : 'Administrator'}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="py-2 space-y-1 text-xs">
                    {isAdmin && (
                      <button
                        id="menu-admin-operations-btn"
                        onClick={() => {
                          setShowUserMenu(false);
                          setCurrentTab('admin');
                        }}
                        className="w-full text-left px-2.5 py-2.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 hover:text-amber-300 border border-amber-500/30 flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <ShieldCheck className="h-4 w-4 text-amber-400" />
                          <span className="font-semibold">Admin Operations Portal</span>
                        </div>
                        {pendingQuoteCount > 0 && (
                          <span className="bg-amber-500 text-stone-950 text-[10px] font-extrabold h-4 px-1.5 rounded-full flex items-center justify-center font-mono">
                            {pendingQuoteCount}
                          </span>
                        )}
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setCurrentTab('past');
                      }}
                      className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-stone-800 text-stone-300 hover:text-white flex items-center space-x-2 cursor-pointer transition-colors"
                    >
                      <FileText className="h-4 w-4 text-stone-400" />
                      <span>My Submitted Quotes</span>
                    </button>
                  </div>

                  <div className="pt-2 border-t border-stone-800">
                    <button
                      onClick={handleSignOut}
                      className="w-full py-2 px-3 bg-stone-800 hover:bg-red-950/40 hover:text-red-300 text-stone-300 rounded-lg text-xs font-medium flex items-center justify-center space-x-2 transition-colors cursor-pointer"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Dark Mode Toggle Button */}
            <button
              id="theme-toggle-btn"
              onClick={onToggleDarkMode}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle dark mode"
              className="ml-1 px-2.5 py-2 rounded-lg bg-[#2e2a24] hover:bg-stone-800 text-amber-400 hover:text-amber-300 border border-[#3e3830] transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm active:scale-95"
            >
              {isDarkMode ? (
                <>
                  <Sun className="h-4 w-4 text-amber-400" />
                  <span className="hidden md:inline text-xs font-mono font-bold text-amber-400">Light</span>
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4 text-amber-300" />
                  <span className="hidden md:inline text-xs font-mono font-bold text-amber-300">Dark</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
