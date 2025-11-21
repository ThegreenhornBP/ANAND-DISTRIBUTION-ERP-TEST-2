
export interface InventoryItem {
  id: string;
  name: string;
  hsn: string;
  size: string;
  rate: number;
  boxCount: number; // Physical stock tracking
  pieceCount: number; // Physical stock tracking
}

export interface InvoiceItem extends InventoryItem {
  quantity: number;
  discountPercent: number;
  amount: number;
}

export interface Customer {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  gstin?: string;
  mobile: string;
  stateCode: string;
}

export interface Staff {
  id: string;
  name: string;
  role: 'BILLER' | 'PICKER';
}

export interface Invoice {
  invoiceNo: string;
  date: string;
  customer: Customer;
  items: InvoiceItem[];
  billedBy: string;
  pickedBy: string;
  taxType: 'INTRA_STATE' | 'INTER_STATE'; // Intra = CGST/SGST, Inter = IGST
  paymentMode: 'Online' | 'Cash' | 'Credit' | 'Advance Payment';
  subTotal: number;
  taxAmount: number;
  roundOff: number;
  grandTotal: number;
}

export interface CompanyDetails {
  name: string;
  address: string;
  gstin: string;
  email: string;
}
