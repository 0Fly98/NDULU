import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Quote } from '../types';

export interface SecurityAuditRecord {
  id: string;
  action: string;
  performedBy: string;
  timestamp: string;
  details?: string;
}

/**
 * Subscribes to real-time quotes updates from Firestore.
 * Handles role-based segregation:
 * - Admin: sees all quotes
 * - Authenticated user: sees their own submitted quotes
 */
export function subscribeToQuotes(
  userId: string | undefined,
  isAdmin: boolean,
  onUpdate: (quotes: Quote[]) => void,
  onFailure?: (err: any) => void
): () => void {
  const quotesRef = collection(db, 'quotes');
  let q;

  if (isAdmin) {
    q = query(quotesRef, orderBy('createdAt', 'desc'));
  } else if (userId) {
    q = query(quotesRef, where('userId', '==', userId));
  } else {
    // Guest / non-logged in: no live firestore subscription or empty list
    onUpdate([]);
    return () => {};
  }

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const quotes: Quote[] = [];
      snapshot.forEach((docSnap) => {
        quotes.push(docSnap.data() as Quote);
      });
      onUpdate(quotes);
    },
    (error) => {
      console.warn('Quotes subscription error, falling back:', error.message);
      if (onFailure) onFailure(error);
      handleFirestoreError(error, OperationType.LIST, 'quotes');
    }
  );

  return unsubscribe;
}

/**
 * Creates or submits a new quotation to Firestore
 */
export async function saveQuoteToFirestore(quote: Quote): Promise<void> {
  const path = `quotes/${quote.id}`;
  try {
    const docRef = doc(db, 'quotes', quote.id);
    await setDoc(docRef, quote);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

/**
 * Updates an existing quote in Firestore (status, reviewed amount, notes)
 */
export async function updateQuoteInFirestore(quote: Quote): Promise<void> {
  const path = `quotes/${quote.id}`;
  try {
    const docRef = doc(db, 'quotes', quote.id);
    await updateDoc(docRef, {
      status: quote.status,
      totalEstimate: quote.totalEstimate,
      items: quote.items,
      ...(quote.adminNotes !== undefined ? { adminNotes: quote.adminNotes } : {}),
      ...(quote.adminReviewedBy !== undefined ? { adminReviewedBy: quote.adminReviewedBy } : {}),
      ...(quote.adminReviewedAt !== undefined ? { adminReviewedAt: quote.adminReviewedAt } : {}),
      ...(quote.quotedAmount !== undefined ? { quotedAmount: quote.quotedAmount } : {})
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Deletes a quote from Firestore
 */
export async function deleteQuoteFromFirestore(id: string): Promise<void> {
  const path = `quotes/${id}`;
  try {
    const docRef = doc(db, 'quotes', id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Appends a security audit entry to the /securityAudits collection
 */
export async function recordSecurityAudit(
  action: string,
  performedBy: string,
  details?: string
): Promise<void> {
  const auditId = `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  try {
    const docRef = doc(db, 'securityAudits', auditId);
    await setDoc(docRef, {
      action,
      performedBy,
      timestamp: new Date().toISOString(),
      ...(details ? { details } : {})
    });
  } catch (error) {
    console.error('Audit recording notice:', error);
  }
}

/**
 * Fetches recent audit logs for the admin security inspector
 */
export async function fetchSecurityAudits(): Promise<SecurityAuditRecord[]> {
  try {
    const auditsRef = collection(db, 'securityAudits');
    const q = query(auditsRef, orderBy('timestamp', 'desc'), limit(25));
    const snapshot = await getDocs(q);
    const records: SecurityAuditRecord[] = [];
    snapshot.forEach((snap) => {
      records.push({ id: snap.id, ...snap.data() } as SecurityAuditRecord);
    });
    return records;
  } catch (error) {
    console.warn('Could not fetch security audits:', error);
    return [];
  }
}
