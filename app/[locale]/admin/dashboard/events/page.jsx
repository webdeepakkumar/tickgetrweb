'use client';
export const dynamic = 'force-dynamic';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const DetailsPopup = dynamic(() => import('@/app/[locale]/components/eventDetailsPopup'), { ssr: false });
const Tooltip = dynamic(() => import('@/app/[locale]/components/tooltip'), { ssr: false });


export default function EventsPage() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {

  }, []);

  return (
    <div className="text-white">
      <h1 className="text-xl font-bold mb-4">Events Page</h1>
      <button onClick={() => setShowPopup(true)} className="bg-orange-500 px-4 py-2 rounded">
        Open Popup
      </button>

      {showPopup && (
        <DetailsPopup
          title="Event Details"
          description="Some description"
          details={[{ label: 'Demo', value: '123' }]}
          color="text-green-400"
          eventId="abc123"
          eventExpiry={true}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
}
