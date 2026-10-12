import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  ExternalLink, 
  Copy, 
  Check, 
  UserCheck, 
  Building, 
  AlertTriangle 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BOOTSTRAP_ADMIN_EMAIL } from '../firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { 
    signInWithGoogle, 
    enableVisitorMode, 
    authError, 
    authErrorCode, 
    unauthorizedDomain,
    clearAuthError,
    loading: authLoading 
  } = useAuth();

  const [signingIn, setSigningIn] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentHost = unauthorizedDomain || (typeof window !== 'undefined' ? window.location.hostname : 'your-domain.vercel.app');
  const isUnauthorizedDomain = authErrorCode === 'auth/unauthorized-domain' || (authError && authError.includes('not authorized'));

  const handleGoogleSignIn = async () => {
    setSigningIn(true);
    try {
      await signInWithGoogle();
      if (onSuccess) onSuccess();
      onClose();
    } catch (e) {
      console.warn('Google sign-in attempt:', e);
    } finally {
      setSigningIn(false);
    }
  };

  const handleContinueAsVisitor = () => {
    enableVisitorMode('Guest Visitor');
    clearAuthError();
    onClose();
  };

  const handleCopyDomain = () => {
    navigator.clipboard.writeText(currentHost);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-stone-900 border border-stone-700 rounded-2xl shadow-2xl overflow-hidden text-stone-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-stone-950 px-6 py-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="bg-amber-500/20 text-amber-400 p-2 rounded-lg border border-amber-500/30">
              <Building className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide text-white">Ndulu Portal & Visitor Access</h3>
              <p className="text-[11px] text-stone-400">Copperbelt Mining Supplies & Quotation Desk</p>
            </div>
          </div>
          <button
            onClick={() => {
              clearAuthError();
              onClose();
            }}
            className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Domain Authorization Diagnostic Alert (if Vercel / deployed domain is not whitelisted) */}
          {isUnauthorizedDomain && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-3">
              <div className="flex items-start space-x-2.5">
                <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-amber-300 font-mono">
                    Firebase Domain Authorization Required
                  </h4>
                  <p className="text-[11px] text-stone-300 leading-relaxed">
                    Because this app is deployed live at <code className="bg-stone-950 px-1.5 py-0.5 rounded text-amber-300 font-mono">{currentHost}</code>, Firebase blocks Google Sign-In until this domain is added to your project's authorized list.
                  </p>
                </div>
              </div>

              {/* Step-by-step resolution box */}
              <div className="bg-stone-950/80 p-3 rounded-lg border border-stone-800 space-y-2 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-stone-400 font-mono text-[10px] uppercase">Domain to add:</span>
                  <button 
                    onClick={handleCopyDomain}
                    className="flex items-center space-x-1 text-xs text-amber-400 hover:text-amber-300 cursor-pointer font-mono"
                  >
                    {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    <span>{copied ? 'Copied!' : 'Copy Domain'}</span>
                  </button>
                </div>
                <div className="bg-stone-900 px-2.5 py-1.5 rounded font-mono text-xs text-amber-300 select-all border border-stone-800">
                  {currentHost}
                </div>
                <div className="text-stone-400 text-[10px] space-y-1 pt-1">
                  <p>1. Open <a href="https://console.firebase.google.com/project/ai-studio-ndulugeneraldeal-c0184c7e-e088-456c-bdcb-3ccf481763cc/authentication/settings" target="_blank" rel="noreferrer" className="text-amber-400 underline inline-flex items-center gap-0.5">Firebase Console <ExternalLink className="h-2.5 w-2.5" /></a></p>
                  <p>2. Under <strong>Authorized domains</strong>, click <strong>Add domain</strong> and paste <code className="text-amber-300">{currentHost}</code></p>
                </div>
              </div>
            </div>
          )}

          {/* Other Auth Errors */}
          {authError && !isUnauthorizedDomain && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-xs flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5 text-red-400" />
              <span>{authError}</span>
            </div>
          )}

          {/* Option 1: Continue as Guest Visitor (Guaranteed to work immediately without setup) */}
          <div className="bg-stone-950/60 p-4 rounded-xl border border-stone-800 space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                  Visitor & Client Access
                </span>
                <h4 className="text-xs font-semibold text-white">Continue as Visitor (No Login Required)</h4>
              </div>
              <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-mono">
                Instant
              </span>
            </div>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              As a visitor or mine procurement officer, you can explore the complete catalog, run AI Safety Advisor compliance checks, configure custom scopes, and submit official quote tenders with zero account creation.
            </p>
            <button
              onClick={handleContinueAsVisitor}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs rounded-lg transition-all flex items-center justify-center space-x-2 shadow-md cursor-pointer"
            >
              <UserCheck className="h-4 w-4" />
              <span>Continue as Guest Visitor</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-stone-800"></div>
            <span className="flex-shrink mx-3 text-stone-500 text-[10px] uppercase font-mono tracking-widest">Or Sign In</span>
            <div className="flex-grow border-t border-stone-800"></div>
          </div>

          {/* Option 2: Sign in with Google (For cloud sync & admin operations) */}
          <div className="space-y-2">
            <button
              onClick={handleGoogleSignIn}
              disabled={signingIn || authLoading}
              className="w-full py-3 px-4 bg-stone-800 hover:bg-stone-700 active:scale-95 text-white font-semibold text-xs rounded-xl border border-stone-600 transition-all flex items-center justify-center space-x-3 shadow-lg cursor-pointer disabled:opacity-50"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>{signingIn ? 'Opening Google Sign-In...' : 'Sign in with Google'}</span>
            </button>
            <p className="text-[10px] text-stone-500 text-center">
              Authorized Operations Officers: <code className="text-stone-400 font-mono">{BOOTSTRAP_ADMIN_EMAIL}</code>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="bg-stone-950 px-6 py-3 border-t border-stone-800 text-[10px] text-stone-500 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-amber-500" />
            256-bit SSL Protected
          </span>
          <span>Chingola, Copperbelt Province</span>
        </div>
      </div>
    </div>
  );
};
