// components/MenuItem.tsx
'use client';

import { MenuItem } from "../types";

interface MenuItemProps {
  menu: MenuItem[];
  selectedItems: string[];
  setSelectedItems: (items: string[]) => void;
}

export const MenuItemList = ({ menu, selectedItems, setSelectedItems }: MenuItemProps) => (
  <>
    <h4 className="text-xl font-semibold text-white mb-4">🍸 Signature Cocktails</h4>
    <div className="grid gap-3 mb-6">
      {menu.map((item) => (
        <label
          key={item._id}
          className="flex items-center p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
        >
          <input
            type="checkbox"
            value={item._id}
            checked={selectedItems.includes(item._id)}
            onChange={(e) => {
              const { checked, value } = e.target;
              setSelectedItems(
                checked ? [...selectedItems, value] : selectedItems.filter(id => id !== value)
              );
            }}
            className="form-checkbox h-5 w-5 text-purple-400 rounded-sm border-gray-400"
          />
          <div className="ml-3 flex-1">
            <div className="flex justify-between items-center">
              <span className="text-gray-100">{item.combo}</span>
              <span className="text-purple-300 font-medium">₹{item.price}</span>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              {item.description || "Premium cocktail experience"}
            </p>
          </div>
        </label>
      ))}
    </div>
  </>
);