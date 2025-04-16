import AdminCafePage from '@/app/components/admin/Admincafepage';
import React, { Suspense } from 'react';

export default function CafePage() {
  return (
    <Suspense fallback={<div>Loading cafes...</div>}>
      <AdminCafePage />
    </Suspense>
  );
}
