import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider, BOOTSTRAP_ADMIN_EMAIL } from '../firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isVisitor: boolean;
  visitorName: string;
  enableVisitorMode: (name?: string) => void;
  disableVisitorMode: () => void;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  authError: string | null;
  authErrorCode: string | null;
  unauthorizedDomain: string | null;
  clearAuthError: () => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authErrorCode, setAuthErrorCode] = useState<string | null>(null);
  const [unauthorizedDomain, setUnauthorizedDomain] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  // Guest / Visitor mode state
  const [isVisitor, setIsVisitor] = useState<boolean>(() => {
    return localStorage.getItem('ndulu_visitor_mode') === 'true';
  });
  const [visitorName, setVisitorName] = useState<string>(() => {
    return localStorage.getItem('ndulu_visitor_name') || 'Guest Visitor';
  });

  const enableVisitorMode = (name?: string) => {
    const finalName = name || 'Guest Visitor';
    setIsVisitor(true);
    setVisitorName(finalName);
    localStorage.setItem('ndulu_visitor_mode', 'true');
    localStorage.setItem('ndulu_visitor_name', finalName);
    setAuthError(null);
    setAuthErrorCode(null);
    setShowAuthModal(false);
  };

  const disableVisitorMode = () => {
    setIsVisitor(false);
    localStorage.removeItem('ndulu_visitor_mode');
    localStorage.removeItem('ndulu_visitor_name');
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(true);

      if (currentUser && currentUser.email) {
        // If logged in via Google, disable visitor guest flag
        disableVisitorMode();
        const email = currentUser.email.toLowerCase();
        const isSuper = email === BOOTSTRAP_ADMIN_EMAIL.toLowerCase();
        setIsSuperAdmin(isSuper);

        if (isSuper) {
          setIsAdmin(true);
        } else {
          // Check if designated admin record exists in Firestore
          try {
            const adminDoc = await getDoc(doc(db, 'admins', currentUser.uid));
            setIsAdmin(adminDoc.exists());
          } catch (e) {
            console.error('Error verifying admin authorization:', e);
            setIsAdmin(false);
          }
        }
      } else {
        setIsAdmin(false);
        setIsSuperAdmin(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setAuthError(null);
    setAuthErrorCode(null);
    setUnauthorizedDomain(null);
    try {
      await signInWithPopup(auth, googleProvider);
      setShowAuthModal(false);
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      const code = err.code || '';
      setAuthErrorCode(code);

      if (code === 'auth/unauthorized-domain') {
        const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'your-deployed-domain';
        setUnauthorizedDomain(currentHost);
        setAuthError(
          `Domain "${currentHost}" is not authorized for Google Sign-In yet in Firebase. Add this domain under Firebase Console > Authentication > Settings > Authorized Domains.`
        );
      } else if (code === 'auth/popup-blocked') {
        setAuthError('The sign-in popup was blocked by your browser. Please allow popups for this site and try again.');
      } else if (code === 'auth/popup-closed-by-user') {
        setAuthError('Sign-in cancelled. The popup window was closed before finishing.');
      } else if (code === 'auth/cancelled-popup-request') {
        setAuthError('Sign-in process was interrupted.');
      } else {
        setAuthError(err.message || 'Failed to sign in with Google.');
      }
      throw err;
    }
  };

  const signOut = async () => {
    setAuthError(null);
    setAuthErrorCode(null);
    setUnauthorizedDomain(null);
    try {
      await firebaseSignOut(auth);
      sessionStorage.removeItem('ndulu_admin_auth');
      disableVisitorMode();
    } catch (err: any) {
      console.error('Sign-Out Error:', err);
      setAuthError(err.message || 'Failed to sign out.');
      throw err;
    }
  };

  const clearAuthError = () => {
    setAuthError(null);
    setAuthErrorCode(null);
    setUnauthorizedDomain(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        isSuperAdmin,
        isVisitor,
        visitorName,
        enableVisitorMode,
        disableVisitorMode,
        signInWithGoogle,
        signOut,
        authError,
        authErrorCode,
        unauthorizedDomain,
        clearAuthError,
        showAuthModal,
        setShowAuthModal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
