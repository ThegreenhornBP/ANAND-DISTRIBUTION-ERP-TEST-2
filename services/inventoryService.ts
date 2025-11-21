import { InventoryItem, Staff } from '../types';
import { INITIAL_INVENTORY, INITIAL_STAFF } from '../constants';

const INVENTORY_KEY = 'anand_inventory';
const STAFF_KEY = 'anand_staff';

export const getInventory = (): InventoryItem[] => {
  const stored = localStorage.getItem(INVENTORY_KEY);
  if (!stored) {
    localStorage.setItem(INVENTORY_KEY, JSON.stringify(INITIAL_INVENTORY));
    return INITIAL_INVENTORY;
  }
  return JSON.parse(stored);
};

export const saveInventory = (items: InventoryItem[]) => {
  localStorage.setItem(INVENTORY_KEY, JSON.stringify(items));
};

export const updateStock = (itemId: string, qtySold: number) => {
  const items = getInventory();
  const updated = items.map(item => {
    if (item.id === itemId) {
      return { ...item, pieceCount: item.pieceCount - qtySold };
    }
    return item;
  });
  saveInventory(updated);
};

export const getStaff = (): Staff[] => {
  const stored = localStorage.getItem(STAFF_KEY);
  if (!stored) {
    localStorage.setItem(STAFF_KEY, JSON.stringify(INITIAL_STAFF));
    return INITIAL_STAFF;
  }
  return JSON.parse(stored);
};
