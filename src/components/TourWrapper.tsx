'use client';

import dynamic from 'next/dynamic';

// Como este archivo es de cliente, Next.js nos permite usar ssr: false sin problemas
const GuidedTour = dynamic(() => import('./admin/GuidedTour'), { ssr: false });
export default function TourWrapper() {
  return <GuidedTour />;
}