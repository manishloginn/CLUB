// components/BookingModal.tsx
'use client';
import { useState } from 'react';
import { MenuItemList } from './MenuItem';
import { BookingForm } from './BookingForm';
import { Cafe } from '../types';

interface BookingModalProps {
  cafe: Cafe;
  onClose: () => void;
  onBook: () => Promise<void>;
  selectedItems: string[];
  setSelectedItems: (items: string[]) => void;
  bookingInfo: any;
  setBookingInfo: (info: any) => void;
}

export const BookingModal = ({
  cafe,
  onClose,
  onBook,
  selectedItems,
  setSelectedItems,
  bookingInfo,
  setBookingInfo
}: BookingModalProps) => (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center">
    <div className="bg-gray-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-lg relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
      >
        &times;
      </button>

      <h2 className="text-3xl text-white font-bold mb-6">{cafe.club_name}</h2>
      <MenuItemList 
        menu={cafe.menuItems || []}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
      />
      <BookingForm
        bookingInfo={bookingInfo}
        setBookingInfo={setBookingInfo}
        onBook={onBook}
      />
    </div>
  </div>
);