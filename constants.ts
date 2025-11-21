import { CompanyDetails, Staff, InventoryItem } from './types';

export const COMPANY_DETAILS: CompanyDetails = {
  name: "ANAND DISTRIBUTION",
  address: "GROUND FLOOR, 41, INDUSTRIAL AREA 3 STREET, KOKAR INDUSTRIAL AREA, RANCHI JHARKHAND - 834001",
  gstin: "20ABUFA2905P1Z7",
  email: "ananddistributionranchi@gmail.com"
};

export const INITIAL_STAFF: Staff[] = [
  { id: '1', name: 'Sachin', role: 'BILLER' },
  { id: '2', name: 'Amit', role: 'BILLER' },
  { id: '3', name: 'Mukesh', role: 'PICKER' },
  { id: '4', name: 'Raju', role: 'PICKER' },
];

// Comprehensive Techno Sports Inventory List
export const INITIAL_INVENTORY: InventoryItem[] = [
  // --- JACKETS & HOODIES ---
  { id: 'J001', name: 'TECHNO JACKET HOOD PL91 M', size: 'M', hsn: '61121200', rate: 505.00, boxCount: 10, pieceCount: 50 },
  { id: 'J002', name: 'TECHNO JACKET HOOD PL91 L', size: 'L', hsn: '61121200', rate: 505.00, boxCount: 10, pieceCount: 50 },
  { id: 'J003', name: 'TECHNO JACKET HOOD PL91 XL', size: 'XL', hsn: '61121200', rate: 505.00, boxCount: 10, pieceCount: 50 },
  { id: 'J004', name: 'TECHNO JACKET HOOD PL91 XXL', size: 'XXL', hsn: '61121200', rate: 505.00, boxCount: 10, pieceCount: 50 },
  { id: 'J005', name: 'TECHNO WINCHEATER JACKET WJ-22 M', size: 'M', hsn: '61121200', rate: 550.00, boxCount: 5, pieceCount: 20 },
  { id: 'J006', name: 'TECHNO WINCHEATER JACKET WJ-22 L', size: 'L', hsn: '61121200', rate: 550.00, boxCount: 5, pieceCount: 20 },
  { id: 'J007', name: 'TECHNO BOMBER JACKET BJ-05 M', size: 'M', hsn: '61121200', rate: 620.00, boxCount: 5, pieceCount: 25 },
  { id: 'J008', name: 'TECHNO BOMBER JACKET BJ-05 L', size: 'L', hsn: '61121200', rate: 620.00, boxCount: 5, pieceCount: 25 },

  // --- T-SHIRTS (Round Neck) ---
  { id: 'T001', name: 'TECHNO R/N T-SHIRT UP-18 M', size: 'M', hsn: '61091000', rate: 190.00, boxCount: 50, pieceCount: 500 },
  { id: 'T002', name: 'TECHNO R/N T-SHIRT UP-18 L', size: 'L', hsn: '61091000', rate: 190.00, boxCount: 50, pieceCount: 500 },
  { id: 'T003', name: 'TECHNO R/N T-SHIRT UP-18 XL', size: 'XL', hsn: '61091000', rate: 190.00, boxCount: 50, pieceCount: 500 },
  { id: 'T004', name: 'TECHNO R/N T-SHIRT UP-18 XXL', size: 'XXL', hsn: '61091000', rate: 210.00, boxCount: 30, pieceCount: 300 },
  { id: 'T005', name: 'TECHNO ACTIVE DRY R/N MH-22 M', size: 'M', hsn: '61091000', rate: 220.00, boxCount: 20, pieceCount: 200 },
  { id: 'T006', name: 'TECHNO ACTIVE DRY R/N MH-22 L', size: 'L', hsn: '61091000', rate: 220.00, boxCount: 20, pieceCount: 200 },
  { id: 'T007', name: 'TECHNO PRINTED R/N PR-09 M', size: 'M', hsn: '61091000', rate: 240.00, boxCount: 15, pieceCount: 150 },
  { id: 'T008', name: 'TECHNO PRINTED R/N PR-09 L', size: 'L', hsn: '61091000', rate: 240.00, boxCount: 15, pieceCount: 150 },

  // --- T-SHIRTS (Collar / Polo) ---
  { id: 'P001', name: 'TECHNO COLLAR T-SHIRT OR67 F M', size: 'M', hsn: '61103010', rate: 304.00, boxCount: 20, pieceCount: 200 },
  { id: 'P002', name: 'TECHNO COLLAR T-SHIRT OR67 F L', size: 'L', hsn: '61103010', rate: 304.00, boxCount: 20, pieceCount: 200 },
  { id: 'P003', name: 'TECHNO COLLAR T-SHIRT OR67 F XL', size: 'XL', hsn: '61103010', rate: 304.00, boxCount: 20, pieceCount: 200 },
  { id: 'P004', name: 'TECHNO COLLAR T-SHIRT OR67 F XXL', size: 'XXL', hsn: '61103010', rate: 320.00, boxCount: 10, pieceCount: 100 },
  { id: 'P005', name: 'TECHNO MATTY POLO PC-12 M', size: 'M', hsn: '61103010', rate: 350.00, boxCount: 10, pieceCount: 100 },
  { id: 'P006', name: 'TECHNO MATTY POLO PC-12 L', size: 'L', hsn: '61103010', rate: 350.00, boxCount: 10, pieceCount: 100 },

  // --- TRACK PANTS ---
  { id: 'TP001', name: 'TECHNO TRACK PANT P850 M', size: 'M', hsn: '61034300', rate: 407.00, boxCount: 15, pieceCount: 150 },
  { id: 'TP002', name: 'TECHNO TRACK PANT P850 L', size: 'L', hsn: '61034300', rate: 407.00, boxCount: 15, pieceCount: 150 },
  { id: 'TP003', name: 'TECHNO TRACK PANT P850 XL', size: 'XL', hsn: '61034300', rate: 407.00, boxCount: 15, pieceCount: 150 },
  { id: 'TP004', name: 'TECHNO TRACK PANT NS-LYCRA TP-99 M', size: 'M', hsn: '61034300', rate: 450.00, boxCount: 10, pieceCount: 100 },
  { id: 'TP005', name: 'TECHNO TRACK PANT NS-LYCRA TP-99 L', size: 'L', hsn: '61034300', rate: 450.00, boxCount: 10, pieceCount: 100 },
  { id: 'TP006', name: 'TECHNO JOGGER PANT JG-05 M', size: 'M', hsn: '61034300', rate: 480.00, boxCount: 8, pieceCount: 80 },
  { id: 'TP007', name: 'TECHNO JOGGER PANT JG-05 L', size: 'L', hsn: '61034300', rate: 480.00, boxCount: 8, pieceCount: 80 },

  // --- SHORTS ---
  { id: 'S001', name: 'TECHNO SHORTS OR 26 M', size: 'M', hsn: '61034300', rate: 260.00, boxCount: 20, pieceCount: 200 },
  { id: 'S002', name: 'TECHNO SHORTS OR 26 L', size: 'L', hsn: '61034300', rate: 260.00, boxCount: 20, pieceCount: 200 },
  { id: 'S003', name: 'TECHNO SHORTS OR 26 XL', size: 'XL', hsn: '61034300', rate: 260.00, boxCount: 20, pieceCount: 200 },
  { id: 'S004', name: 'TECHNO 4-WAY LYCRA SHORTS S-45 M', size: 'M', hsn: '61034300', rate: 290.00, boxCount: 15, pieceCount: 150 },
  { id: 'S005', name: 'TECHNO 4-WAY LYCRA SHORTS S-45 L', size: 'L', hsn: '61034300', rate: 290.00, boxCount: 15, pieceCount: 150 },
  { id: 'S006', name: 'TECHNO CAPRI C-10 M', size: 'M', hsn: '61034300', rate: 310.00, boxCount: 10, pieceCount: 100 },
  { id: 'S007', name: 'TECHNO CAPRI C-10 L', size: 'L', hsn: '61034300', rate: 310.00, boxCount: 10, pieceCount: 100 },

  // --- GYM VESTS / SANDOS ---
  { id: 'V001', name: 'TECHNO GYM VEST GV-01 M', size: 'M', hsn: '61091000', rate: 150.00, boxCount: 30, pieceCount: 300 },
  { id: 'V002', name: 'TECHNO GYM VEST GV-01 L', size: 'L', hsn: '61091000', rate: 150.00, boxCount: 30, pieceCount: 300 },
  { id: 'V003', name: 'TECHNO STRINGER VEST SV-05 M', size: 'M', hsn: '61091000', rate: 170.00, boxCount: 25, pieceCount: 250 },
  { id: 'V004', name: 'TECHNO STRINGER VEST SV-05 L', size: 'L', hsn: '61091000', rate: 170.00, boxCount: 25, pieceCount: 250 },

  // --- WOMEN'S WEAR ---
  { id: 'W001', name: 'TECHNO WOMEN T-SHIRT WT-02 M', size: 'M', hsn: '61091000', rate: 230.00, boxCount: 10, pieceCount: 100 },
  { id: 'W002', name: 'TECHNO WOMEN T-SHIRT WT-02 L', size: 'L', hsn: '61091000', rate: 230.00, boxCount: 10, pieceCount: 100 },
  { id: 'W003', name: 'TECHNO WOMEN TIGHTS LG-55 M', size: 'M', hsn: '61046300', rate: 350.00, boxCount: 10, pieceCount: 100 },
  { id: 'W004', name: 'TECHNO WOMEN TIGHTS LG-55 L', size: 'L', hsn: '61046300', rate: 350.00, boxCount: 10, pieceCount: 100 },

  // --- ACCESSORIES & OTHERS ---
  { id: 'A001', name: 'TECHNO SPORTS SOCKS (PACK OF 3)', size: 'FREE', hsn: '61159600', rate: 120.00, boxCount: 50, pieceCount: 500 },
  { id: 'A002', name: 'TECHNO GYM BAG GB-01', size: 'STD', hsn: '42022210', rate: 450.00, boxCount: 5, pieceCount: 50 },
  { id: 'A003', name: 'TECHNO WRIST BAND WB-01', size: 'FREE', hsn: '63079090', rate: 50.00, boxCount: 100, pieceCount: 1000 },
  { id: 'O001', name: 'NIVIA F.BALL SHINING STAR (292)', size: '5', hsn: '95066210', rate: 716.00, boxCount: 5, pieceCount: 50 },
  { id: 'O002', name: 'YY RACKET NANOFLARE SPEED 7', size: 'STD', hsn: '95065910', rate: 2300.00, boxCount: 2, pieceCount: 20 },
  { id: 'O003', name: 'YY RACKET ASTROX LITE 27i', size: 'STD', hsn: '95065910', rate: 1440.00, boxCount: 2, pieceCount: 20 },
];

export const TAX_RATE = 0.05; // 5% Total