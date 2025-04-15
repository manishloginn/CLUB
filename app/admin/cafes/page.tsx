'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useSearchParams } from 'next/navigation';
import jwt from 'jsonwebtoken';

type Cafe = {
  _id: string;
  club_name?: string;
  location: {
    address?: string;
    city?: string;
    state?: string;
    country?: string;
  };
  isActive: boolean;
};

const AdminCafePage: React.FC = () => {
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);
  const [showApprove, setShowApprove] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [actionButtonRef, setActionButtonRef] = useState<HTMLButtonElement | null>(null);
  const approveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAllCafes();
  }, []);

  const searchParams = useSearchParams();
  const param = searchParams.get('param');

  console.log('param:', param);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (approveRef.current && !approveRef.current.contains(event.target as Node)) {
        setShowApprove(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchAllCafes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/admin/cafes/?param=${param}`);
      setCafes(response?.data?.cafes);
    } catch (error) {
      console.error('Error fetching cafes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedCafe) return;

    try {
      setLoading(true);
      await axios.post('/api/admin/approve-cafe', {
        cafeId: selectedCafe._id,
        isActive: true
      });

      setCafes((prevCafes) =>
        prevCafes.map((cafe) =>
          cafe._id === selectedCafe._id ? { ...cafe, isActive: true } : cafe
        )
      );
      setShowApprove(false);
    } catch (error) {
      console.error('Error approving cafe:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleApprove = (e: React.MouseEvent<HTMLButtonElement>, cafe: Cafe) => {
    e.stopPropagation();
    setActionButtonRef(e.currentTarget);
    setSelectedCafe(cafe);
    setShowApprove(!showApprove);
  };

  // Calculate position for the approve button
  const getApprovePosition = () => {
    if (!actionButtonRef) return { top: 0, left: 0 };

    const rect = actionButtonRef.getBoundingClientRect();
    return {
      top: rect.bottom + window.scrollY + 4,
      left: rect.left + window.scrollX - 50
    };
  };

  const handelCafeLogin = (cafe: any) => {
    console.log(cafe)
    const name = cafe.club_name;
    const id = cafe._id;

    const token = jwt.sign(
      { cafeId: id, name },
      process.env.JWT_SECRET || "secret"
    );

    console.log(token)
    localStorage.setItem("cafeToken", token)
    
    // window.open('http://localhost:3000/cafe/dashboard', '_blank', 'noopener,noreferrer');

  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cafe Management</h1>
          <p className="text-gray-500 mt-1">Review and approve cafe registrations</p>
        </div>
        <button
          onClick={() => fetchAllCafes()}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Loading State */}
      {loading && cafes.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Mobile Card View */}
          <div className="sm:hidden space-y-4 p-4">
            {cafes.map((cafe) => (
              <div key={cafe._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{cafe.club_name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {[cafe.location?.city, cafe.location?.state].filter(Boolean).join(', ')}
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-1 text-xs font-medium rounded-full 
                      ${cafe.isActive ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}
                  >
                    {cafe.isActive ? 'Approved' : 'Pending'}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end space-x-2">
                  {!cafe.isActive && (
                    <button
                      onClick={(e) => toggleApprove(e, cafe)}
                      className="relative p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={(e) => toggleApprove(e, cafe)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cafe</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cafes.map((cafe) => (
                  <tr key={cafe._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        </div>
                        <div className="ml-4"
                          onClick={() => handelCafeLogin(cafe)}
                        >
                          <div className="text-sm font-medium text-gray-900">{cafe.club_name}</div>
                          <div className="text-xs text-gray-500">ID: {cafe._id.substring(0, 6)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {cafe.location?.address && <div className="truncate max-w-xs">{cafe.location.address}</div>}
                        <div className="text-gray-500">
                          {[cafe.location?.city, cafe.location?.state].filter(Boolean).join(', ')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1.5 inline-flex items-center rounded-full text-xs font-medium 
                          ${cafe.isActive ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}
                      >
                        {cafe.isActive ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {!cafe.isActive && (
                          <button
                            ref={(el) => {
                              if (cafe._id === selectedCafe?._id) {
                                setActionButtonRef(el);
                              }
                            }}
                            onClick={(e) => toggleApprove(e, cafe)}
                            className="relative p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </button>
                        )}
                        <button
                          onClick={(e) => toggleApprove(e, cafe)}
                          className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Floating Approve Button */}
      {showApprove && (
        <div
          ref={approveRef}
          className="fixed z-50 bg-white shadow-lg rounded-md border border-gray-200 overflow-hidden transition-all duration-100"
          style={{
            ...getApprovePosition(),
            opacity: showApprove ? 1 : 0,
            transform: showApprove ? 'translateY(0)' : 'translateY(-10px)'
          }}
        >
          <button
            onClick={handleApprove}
            className={`w-full px-4 py-2 text-sm flex items-center gap-2 transition-colors
              ${loading
                ? 'bg-gray-100 text-gray-400'
                : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Approve
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminCafePage;