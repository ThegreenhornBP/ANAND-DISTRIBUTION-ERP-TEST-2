
import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, FileText, Save, Printer } from 'lucide-react';
import { InventoryItem, InvoiceItem, Customer, Staff } from '../types';
import { getInventory, updateStock, getStaff } from '../services/inventoryService';
import { generateInvoicePDF } from '../utils/pdfGenerator';
import { TAX_RATE } from '../constants';

interface Props {
  onInvoiceCreated: () => void;
}

const InvoiceGenerator: React.FC<Props> = ({ onInvoiceCreated }) => {
  // --- State ---
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  
  const [billedBy, setBilledBy] = useState('');
  const [pickedBy, setPickedBy] = useState('');
  
  const [customer, setCustomer] = useState<Customer>({
    id: crypto.randomUUID(),
    name: 'SPORTS ZONE',
    address: 'MAA KESHRI MARKET NEAR GOKUL SWEATS, KANKE ROAD',
    city: 'RANCHI',
    state: 'JHARKHAND',
    pincode: '834008',
    mobile: '8210919293',
    stateCode: '20',
    gstin: ''
  });

  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [taxType, setTaxType] = useState<'INTRA_STATE' | 'INTER_STATE'>('INTRA_STATE');
  const [paymentMode, setPaymentMode] = useState<'Online' | 'Cash' | 'Credit' | 'Advance Payment'>('Credit');
  
  const [invoiceNo, setInvoiceNo] = useState('');
  // Initialize date to today (YYYY-MM-DD for input type="date")
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);

  // --- Initialization ---
  useEffect(() => {
    setInventory(getInventory());
    setStaffList(getStaff());
    // Generate semi-random invoice number for demo
    const date = new Date();
    const fiscalYear = date.getMonth() > 2 ? `${date.getFullYear()}-${(date.getFullYear()+1).toString().slice(2)}` : `${date.getFullYear()-1}-${date.getFullYear().toString().slice(2)}`;
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setInvoiceNo(`AD/${fiscalYear}/${randomNum}`);
  }, []);

  // --- Handlers ---

  const handleAddItem = () => {
    setItems([...items, {
      id: '',
      name: '',
      hsn: '',
      size: '',
      rate: 0,
      boxCount: 0,
      pieceCount: 0,
      quantity: 1,
      discountPercent: 0,
      amount: 0
    }]);
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...items];
    const item = newItems[index];

    if (field === 'name') {
      item.name = value;
      
      // Try to find matching inventory item by name
      const selectedProduct = inventory.find(p => p.name === value);
      
      if (selectedProduct) {
        // Match found: Populate details
        item.id = selectedProduct.id;
        item.hsn = selectedProduct.hsn;
        item.size = selectedProduct.size || '';
        item.rate = selectedProduct.rate;
        item.boxCount = selectedProduct.boxCount;
        item.pieceCount = selectedProduct.pieceCount;
        
        // Recalculate amount
        const baseAmt = item.quantity * selectedProduct.rate;
        const discountAmt = baseAmt * (item.discountPercent / 100);
        item.amount = baseAmt - discountAmt;
      } else {
        // No match (Custom item or typing): Clear inventory ID linkage
        if (item.id) {
           item.id = '';
           item.pieceCount = 0; 
        }
      }
    } else {
        // Handle manual inputs for other fields
        (item as any)[field] = value;

        // Recalculate amount if qty, rate, or discount changes
        if (field === 'quantity' || field === 'rate' || field === 'discountPercent') {
            const qty = field === 'quantity' ? value : item.quantity;
            const rate = field === 'rate' ? value : item.rate;
            const disc = field === 'discountPercent' ? value : item.discountPercent;
            
            const baseAmt = qty * rate;
            const discountAmt = baseAmt * (disc / 100);
            item.amount = baseAmt - discountAmt;
        }
    }
    setItems(newItems);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // --- Calculations ---
  const subTotal = items.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = subTotal * TAX_RATE;
  const totalWithTax = subTotal + taxAmount;
  const grandTotal = Math.round(totalWithTax);
  const roundOff = grandTotal - totalWithTax;

  // --- Submit ---
  const handleGenerate = () => {
    if (!billedBy || !pickedBy) {
      alert("Please select or enter Staff (Biller and Picker) first.");
      return;
    }
    if (items.length === 0 || items.some(i => !i.name)) {
      alert("Please add valid items. Description is required for all rows.");
      return;
    }
    
    // Check Stock (Only for items linked to inventory)
    for (const item of items) {
        if (item.id && item.quantity > item.pieceCount) {
            alert(`Insufficient stock for ${item.name}. Available: ${item.pieceCount}`);
            return;
        }
    }

    // Format Date properly for PDF (dd-MMM-yy)
    const [y, m, d] = invoiceDate.split('-');
    const dateObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
    const formattedDate = dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }).replace(/ /g, '-');

    const invoiceData = {
      invoiceNo,
      date: formattedDate,
      customer,
      items,
      billedBy,
      pickedBy,
      taxType,
      paymentMode,
      subTotal,
      taxAmount,
      roundOff,
      grandTotal
    };

    // 1. Deduct Stock (Only for items linked to inventory)
    items.forEach(item => {
        if (item.id) updateStock(item.id, item.quantity);
    });
    
    // 2. Generate PDF
    generateInvoicePDF(invoiceData);

    // 3. Notify Parent & Reset (Partial)
    onInvoiceCreated();
    alert("Invoice Generated & Saved!");
    setItems([]);
    // Refresh inventory in UI
    setInventory(getInventory());
  };

  return (
    <div className="bg-white shadow-xl rounded-xl p-8 max-w-6xl mx-auto border border-gray-200">
      {/* --- Top Header: Staff Tracking --- */}
      <div className="grid grid-cols-2 gap-6 mb-8 bg-gray-50 p-5 rounded-lg border border-gray-200">
        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Billed By (Staff)</label>
          <input 
            type="text"
            list="biller-options"
            value={billedBy} 
            onChange={(e) => setBilledBy(e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            placeholder="Select Staff..."
          />
          <datalist id="biller-options">
            {staffList.filter(s => s.role === 'BILLER').map(s => (
              <option key={s.id} value={s.name} />
            ))}
          </datalist>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Item Picked By (Warehouse)</label>
          <input 
            type="text"
            list="picker-options"
            value={pickedBy} 
            onChange={(e) => setPickedBy(e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            placeholder="Select Staff..."
          />
          <datalist id="picker-options">
             {staffList.filter(s => s.role === 'PICKER').map(s => (
              <option key={s.id} value={s.name} />
            ))}
          </datalist>
        </div>
      </div>

      <div className="flex justify-between items-start mb-8 border-b pb-6">
        <div className="flex gap-6">
            <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Invoice No</label>
                <input 
                    type="text"
                    value={invoiceNo}
                    onChange={(e) => setInvoiceNo(e.target.value)}
                    className="w-48 p-2.5 border border-gray-300 rounded-md bg-white text-sm font-bold shadow-sm"
                />
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Date</label>
                <input 
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    className="w-40 p-2.5 border border-gray-300 rounded-md bg-white text-sm shadow-sm"
                />
            </div>
        </div>

        <div className="flex flex-col items-end gap-4">
            <div className="flex items-center space-x-3 bg-gray-50 p-2 rounded-lg border border-gray-200">
                <span className={`text-sm font-semibold ${taxType === 'INTRA_STATE' ? 'text-green-600' : 'text-gray-400'}`}>CGST/SGST</span>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={taxType === 'INTER_STATE'} onChange={() => setTaxType(prev => prev === 'INTRA_STATE' ? 'INTER_STATE' : 'INTRA_STATE')} />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
                <span className={`text-sm font-semibold ${taxType === 'INTER_STATE' ? 'text-blue-600' : 'text-gray-400'}`}>IGST</span>
            </div>

            <div className="flex items-center space-x-2">
                 <label className="text-sm font-bold text-gray-600">Payment Mode:</label>
                 <select 
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value as any)}
                    className="p-2 border border-gray-300 rounded-md text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none shadow-sm w-40"
                 >
                    <option value="Credit">Credit</option>
                    <option value="Cash">Cash</option>
                    <option value="Online">Online</option>
                    <option value="Advance Payment">Advance Payment</option>
                 </select>
            </div>
        </div>
      </div>

      {/* --- Customer Details --- */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-gray-700 uppercase mb-3 border-b pb-1 inline-block">Customer Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 mb-1">Customer Name</label>
                <input 
                    type="text" 
                    value={customer.name} 
                    onChange={e => setCustomer({...customer, name: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded text-sm bg-white focus:ring-1 focus:ring-blue-500"
                />
            </div>
            <div className="md:col-span-1">
                <label className="block text-xs font-semibold text-gray-500 mb-1">Mobile</label>
                <input 
                    type="text" 
                    value={customer.mobile} 
                    onChange={e => setCustomer({...customer, mobile: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded text-sm bg-white"
                />
            </div>
            <div className="md:col-span-1">
                <label className="block text-xs font-semibold text-gray-500 mb-1">GSTIN (Optional)</label>
                <input 
                    type="text" 
                    value={customer.gstin || ''} 
                    onChange={e => setCustomer({...customer, gstin: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded text-sm bg-white"
                />
            </div>

            <div className="md:col-span-4">
                <label className="block text-xs font-semibold text-gray-500 mb-1">Address (Street)</label>
                <input 
                    type="text" 
                    value={customer.address} 
                    onChange={e => setCustomer({...customer, address: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded text-sm bg-white"
                />
            </div>

            <div className="md:col-span-1">
                <label className="block text-xs font-semibold text-gray-500 mb-1">City</label>
                <input 
                    type="text" 
                    value={customer.city} 
                    onChange={e => setCustomer({...customer, city: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded text-sm bg-white"
                />
            </div>
            <div className="md:col-span-1">
                <label className="block text-xs font-semibold text-gray-500 mb-1">State</label>
                <input 
                    type="text" 
                    value={customer.state} 
                    onChange={e => setCustomer({...customer, state: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded text-sm bg-white"
                />
            </div>
            <div className="md:col-span-1">
                <label className="block text-xs font-semibold text-gray-500 mb-1">Pincode</label>
                <input 
                    type="text" 
                    value={customer.pincode} 
                    onChange={e => setCustomer({...customer, pincode: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded text-sm bg-white"
                />
            </div>
            <div className="md:col-span-1">
                <label className="block text-xs font-semibold text-gray-500 mb-1">State Code</label>
                <input 
                    type="text" 
                    value={customer.stateCode} 
                    onChange={e => setCustomer({...customer, stateCode: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded text-sm bg-white"
                />
            </div>
        </div>
      </div>

      {/* --- Items Table --- */}
      <datalist id="inventory-list">
        {inventory.map(inv => (
            <option key={inv.id} value={inv.name}>
                {inv.size ? `Size: ${inv.size}` : ''} | Stock: {inv.pieceCount}
            </option>
        ))}
      </datalist>

      <datalist id="size-options">
        <option value="S" />
        <option value="M" />
        <option value="L" />
        <option value="XL" />
        <option value="XXL" />
        <option value="3XL" />
        <option value="4XL" />
        <option value="5XL" />
        <option value="FREE" />
        <option value="STD" />
      </datalist>

      <div className="overflow-x-auto mb-8 rounded-lg border border-gray-200 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-xs font-bold text-gray-700 uppercase border-b border-gray-300">
              <th className="p-3 w-10 text-center">#</th>
              <th className="p-3 w-1/3">Description</th>
              <th className="p-3 w-36">Size</th>
              <th className="p-3 w-24">HSN</th>
              <th className="p-3 w-20">Stock</th>
              <th className="p-3 w-24">Qty</th>
              <th className="p-3 w-24">Rate</th>
              <th className="p-3 w-20">Disc %</th>
              <th className="p-3 text-right">Amount</th>
              <th className="p-3 w-10"></th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {items.map((item, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                <td className="p-3 text-center text-gray-500">{index + 1}</td>
                <td className="p-3">
                    <input
                        type="text"
                        list="inventory-list"
                        value={item.name}
                        onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                        className="w-full p-1.5 border border-gray-300 rounded bg-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="Select or type item..."
                    />
                </td>
                <td className="p-3">
                    <input
                        type="text"
                        list="size-options"
                        value={item.size || ''}
                        onChange={(e) => handleItemChange(index, 'size', e.target.value)}
                        className="w-full p-1.5 border border-gray-300 rounded bg-white text-sm"
                        placeholder="Size"
                    />
                </td>
                <td className="p-3">
                    <input 
                        type="text" 
                        value={item.hsn} 
                        onChange={(e) => handleItemChange(index, 'hsn', e.target.value)}
                        className="w-full p-1.5 border border-gray-300 rounded bg-white text-center"
                        placeholder="HSN"
                    />
                </td>
                <td className={`p-3 font-medium text-center ${item.id && item.pieceCount < 10 ? 'text-red-500' : 'text-green-600'}`}>
                    {item.id ? item.pieceCount : '-'}
                </td>
                <td className="p-3">
                    <input 
                        type="number" 
                        min="1"
                        value={item.quantity} 
                        onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                        className="w-20 p-1.5 border border-gray-300 rounded text-center bg-white font-semibold"
                    />
                </td>
                <td className="p-3">
                    <input 
                        type="number" 
                        min="0"
                        value={item.rate} 
                        onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)}
                        className="w-24 p-1.5 border border-gray-300 rounded text-center bg-white"
                    />
                </td>
                <td className="p-3">
                    <input 
                        type="number" 
                        min="0"
                        max="100"
                        value={item.discountPercent} 
                        onChange={(e) => handleItemChange(index, 'discountPercent', parseFloat(e.target.value) || 0)}
                        className="w-16 p-1.5 border border-gray-300 rounded text-center bg-white"
                    />
                </td>
                <td className="p-3 text-right font-bold text-gray-800">
                    {item.amount.toFixed(2)}
                </td>
                <td className="p-3 text-center">
                    <button onClick={() => handleRemoveItem(index)} className="text-red-400 hover:text-red-600 transition-colors">
                        <Trash2 size={18} />
                    </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
                <tr>
                    <td colSpan={10} className="p-8 text-center text-gray-400 italic">
                        No items added. Click "Add Item" to start billing.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
        <div className="p-2 bg-gray-50 border-t border-gray-200">
             <button 
                onClick={handleAddItem}
                className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-bold px-2 py-1 rounded hover:bg-blue-50 transition-colors"
            >
                <Plus size={18} className="mr-1" /> Add New Row
            </button>
        </div>
      </div>

      {/* --- Footer / Totals --- */}
      <div className="flex justify-end">
        <div className="w-96 bg-white rounded-lg border border-gray-300 shadow-lg overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
               <h4 className="text-sm font-bold text-gray-700 uppercase">Invoice Summary</h4>
               <FileText size={16} className="text-gray-500"/>
            </div>
            <div className="p-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                    <span>Taxable Value</span>
                    <span className="font-medium">₹{subTotal.toFixed(2)}</span>
                </div>
                {taxType === 'INTRA_STATE' ? (
                    <>
                        <div className="flex justify-between text-gray-600">
                            <span>CGST (2.5%)</span>
                            <span>₹{(taxAmount / 2).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>SGST (2.5%)</span>
                            <span>₹{(taxAmount / 2).toFixed(2)}</span>
                        </div>
                    </>
                ) : (
                    <div className="flex justify-between text-gray-600">
                        <span>IGST (5.0%)</span>
                        <span>₹{taxAmount.toFixed(2)}</span>
                    </div>
                )}
                <div className="flex justify-between text-gray-600 border-b border-gray-300 pb-2">
                    <span>Round Off</span>
                    <span>{roundOff > 0 ? '+' : ''}{roundOff.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 bg-blue-50 -mx-4 px-4 py-3 border-t border-blue-100 mt-2">
                    <span className="font-bold text-blue-900 text-lg">Grand Total</span>
                    <span className="text-blue-900 text-xl font-extrabold">
                        ₹{grandTotal.toFixed(2)}
                    </span>
                </div>
            </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button 
            onClick={handleGenerate}
            className="bg-gray-900 hover:bg-black text-white px-8 py-3 rounded-lg shadow-lg flex items-center font-bold text-lg transition-all transform hover:-translate-y-1"
        >
            <Printer size={24} className="mr-2" /> Generate Invoice
        </button>
      </div>

    </div>
  );
};

export default InvoiceGenerator;
