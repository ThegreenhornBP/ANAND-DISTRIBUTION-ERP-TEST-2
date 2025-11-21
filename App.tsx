import React, { useState } from 'react';
import { LayoutDashboard, FileText, Package } from 'lucide-react';
import InvoiceGenerator from './components/InvoiceGenerator';
import InventoryManager from './components/InventoryManager';
import { COMPANY_DETAILS } from './constants';

type View = 'INVOICE' | 'INVENTORY';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('INVOICE');

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gray-900 text-white flex-shrink-0">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold tracking-wider text-yellow-500">ANAND DIST.</h1>
          <p className="text-xs text-gray-400 mt-1">Enterprise ERP</p>
        </div>
        <nav className="p-4 space-y-2">
          <button 
            onClick={() => setCurrentView('INVOICE')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'INVOICE' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`}
          >
            <FileText size={20} />
            <span>Billing</span>
          </button>
          <button 
            onClick={() => setCurrentView('INVENTORY')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'INVENTORY' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`}
          >
            <Package size={20} />
            <span>Inventory</span>
          </button>
        </nav>
        
        <div className="mt-auto p-6 border-t border-gray-800">
            <div className="text-xs text-gray-500">
                <p className="font-semibold text-gray-400 mb-1">System Status</p>
                <p>Database: Local Storage</p>
                <p>Version: 1.0.0</p>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-10">
            <h2 className="text-lg font-semibold text-gray-700">
                {currentView === 'INVOICE' ? 'Invoice Generation' : 'Inventory Management'}
            </h2>
            <div className="text-right text-xs text-gray-500">
                <p>{COMPANY_DETAILS.email}</p>
                <p>{COMPANY_DETAILS.gstin}</p>
            </div>
        </header>

        <div className="p-6">
            {currentView === 'INVOICE' ? (
                <InvoiceGenerator onInvoiceCreated={() => {}} />
            ) : (
                <InventoryManager />
            )}
        </div>
      </main>
    </div>
  );
}
