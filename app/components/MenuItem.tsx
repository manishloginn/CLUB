'use client';

import { MenuItem } from "../types";

interface MenuItemProps {
  menu: MenuItem[];
  selectedItems: string[]; // still an array for compatibility
  setSelectedItems: (items: string[]) => void;
}

export const MenuItemList = ({ menu, selectedItems, setSelectedItems }: MenuItemProps) => (
  <>
    <h4 className="text-xl font-semibold text-white mb-4">🍸 Signature Cocktails</h4>
    <div className="grid gap-3 mb-6">
      {menu?.map((item) => {
        const isSelected = selectedItems.includes(item._id);
        return (
          <div
            key={item._id}
            onClick={() => setSelectedItems([item._id])}
            className={`flex items-center p-4 rounded-lg transition-all cursor-pointer 
              ${isSelected ? 'bg-gradient-to-r from-purple-600 to-pink-500 shadow-lg scale-[1.02]' : 'bg-gray-700 hover:bg-gray-600'}
            `}
          >
            <div className="ml-1 flex-1">
              <div className="flex justify-between items-center">
                <span className={`text-sm ${isSelected ? 'text-white font-semibold' : 'text-gray-100'}`}>
                  {item.combo}
                </span>
                <span className={`font-medium ${isSelected ? 'text-white' : 'text-purple-300'}`}>
                  ₹{item.price}
                </span>
              </div>
              <p className={`text-xs mt-1 ${isSelected ? 'text-pink-100' : 'text-gray-400'}`}>
                {item.description || "Premium cocktail experience"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  </>
);
