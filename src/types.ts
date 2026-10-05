export interface Product {
  id: string;
  name: string;
  category: 'Hardware' | 'Heavy Duty Spares' | 'Services';
  subcategory: string;
  description: string;
  priceEstimate: number;
  specifications: string[];
  safetyStandards: string[];
  image: string;
  stockStatus: string;
  sizes: string[];
  types: string[];
}

export interface QuoteItem {
  product: Product;
  selectedSize: string;
  selectedType: string;
  quantity: number;
  customNotes?: string;
}

export interface Quote {
  id: string;
  clientName: string;
  clientEmail: string;
  clientCompany: string;
  items: QuoteItem[];
  createdAt: string;
  totalEstimate: number;
  status: 'Pending' | 'Under Review' | 'Quoted' | 'Approved' | 'Declined' | 'Closed' | 'Rejected';
  userId?: string;
  adminNotes?: string;
  adminReviewedAt?: string;
  adminReviewedBy?: string;
  quotedAmount?: number;
  itemPrices?: Record<number, number>;
}
