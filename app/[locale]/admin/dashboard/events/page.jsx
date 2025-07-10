'use client';

export const dynamic = 'force-dynamic';
import dynamicLib from 'next/dynamic';
import { useEffect, useState } from 'react';

const Tooltip = dynamicLib(() => import('@/app/[locale]/components/tooltip'), { ssr: false });

export default function EventsPage() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // future logic
  }, []);

  return (
    <div className="text-white">
      <h1 className="text-xl font-bold mb-4">Events Page</h1>
      <button onClick={() => setShowPopup(true)} className="bg-orange-500 px-4 py-2 rounded">
        Open Popup
      </button>

      {/* DetailsPopup component removed temporarily until it's available */}
      {showPopup && (
        <div className="mt-4 text-sm text-yellow-400">
          Event popup feature is temporarily disabled.
        </div>
      )}
    </div>
  );
}