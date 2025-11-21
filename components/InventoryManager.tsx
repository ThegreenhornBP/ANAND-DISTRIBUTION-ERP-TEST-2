import React, { useState, useEffect } from 'react';
import { Save, Package, Search, Plus } from 'lucide-react';
import { InventoryItem } from '../types';
import { getInventory, saveInventory } from '../services/inventoryService';

const InventoryManager: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  
  const [newItem, setNewItem] = useState<InventoryItem>({
    id: '',
    name: '',
    hsn: '',
    size: '',
    rate: 0,
    boxCount: 0,
    pieceCount: 0
  });

  useEffect(() => {
    setInventory(getInventory());
  }, []);

  const handleSaveNew = () => {
    if (!newItem.name || !newItem.rate) return;
    
    const updatedInventory = [...inventory, { ...newItem, id: crypto.randomUUID() }];
    setInventory(updatedInventory);
    saveInventory(updatedInventory);
    setIsAdding(false);
    setNewItem({ id: '', name: '', hsn: '', size: '', rate: 0, boxCount: 0, pieceCount: 0 });
  };

  const handleUpdateStock = (id: string, field: keyof InventoryItem, value: any) => {
    const updated = inventory.map(item => 
        item.id === id ? { ...item, [field]: value } : item
    );
    setInventory(updated);
    saveInventory(updated);
  };

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow border border-gray-200">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
                <Package className="text-blue-600" /> Inventory Management
            </h2>
            <button 
                onClick={() => setIsAdding(!isAdding)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm flex items-center"
            >
                <Plus size={16} className="mr-1" /> Add New Product
            </button>
        </div>

        {isAdding && (
            <div className="bg-green-50 p-4 rounded mb-6 border border-green-200 animate-in fade-in slide-in-from-top-4">
                <h3 className="text-sm font-bold text-green-800 mb-3">New Product Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="col-span-2">
                        <input placeholder="Item Name" className="w-full p-2 border rounded text-sm" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} />
                    </div>
                    <div>
                        <input placeholder="Size" className="w-full p-2 border rounded text-sm" value={newItem.size} onChange={e => setNewItem({...newItem, size: e.target.value})} />
                    </div>
                    <div>
                        <input placeholder="HSN" className="w-full p-2 border rounded text-sm" value={newItem.hsn} onChange={e => setNewItem({...newItem, hsn: e.target.value})} />
                    </div>
                    <div>
                        <input type="number" placeholder="Rate" className="w-full p-2 border rounded text-sm" value={newItem.rate || ''} onChange={e => setNewItem({...newItem, rate: parseFloat(e.target.value)})} />
                    </div>
                    <div>
                        <input type="number" placeholder="Qty" className="w-full p-2 border rounded text-sm" value={newItem.pieceCount || ''} onChange={e => setNewItem({...newItem, pieceCount: parseInt(e.target.value)})} />
                    </div>
                </div>
                <div className="mt-3 flex justify-end">
                    <button onClick={handleSaveNew} className="bg-green-600 text-white px-4 py-2 rounded text-sm font-medium">Save to Inventory</button>
                </div>
            </div>
        )}

        <div className="mb-4 relative">
            <Search className="absolute left-3 top-2.5 text-gray-400 h-4 w-4" />
            <input 
                type="text" 
                placeholder="Search stock..." 
                className="w-full pl-10 p-2 border rounded bg-gray-50 focus:bg-white transition-colors"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-100 text-gray-700 font-semibold">
                    <tr>
                        <th className="p-3">Item Name</th>
                        <th className="p-3 w-24">Size</th>
                        <th className="p-3 w-32">Rate (₹)</th>
                        <th className="p-3 w-32">Current Stock</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {filteredInventory.map(item => (
                        <tr key={item.id} className="hover:bg-gray-50">
                            <td className="p-3 font-medium text-gray-800">{item.name}</td>
                            <td className="p-3 text-gray-600">{item.size}</td>
                            <td className="p-3">
                                <input 
                                    type="number" 
                                    className="w-24 p-1 border rounded bg-transparent hover:bg-white focus:bg-white"
                                    value={item.rate}
                                    onChange={(e) => handleUpdateStock(item.id, 'rate', parseFloat(e.target.value))}
                                />
                            </td>
                            <td className="p-3">
                                <input 
                                    type="number" 
                                    className={`w-24 p-1 border rounded bg-transparent hover:bg-white focus:bg-white font-bold ${item.pieceCount < 10 ? 'text-red-600' : 'text-green-600'}`}
                                    value={item.pieceCount}
                                    onChange={(e) => handleUpdateStock(item.id, 'pieceCount', parseInt(e.target.value))}
                                />
                            </td>
                        </tr>
                    ))}
                    {filteredInventory.length === 0 && (
                        <tr>
                            <td colSpan={4} className="p-8 text-center text-gray-500">No items found. Add some inventory to get started.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default InventoryManager;
