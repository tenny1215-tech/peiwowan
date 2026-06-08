'use client';
import { useState } from 'react';
import { Service } from '@/lib/notion';
import ServiceCheckout from './ServiceCheckout';

const gameColors: Record<string, string> = {
  '英雄联盟': 'bg-blue-500/20 text-blue-300',
  '无畏契约': 'bg-red-500/20 text-red-300',
  '三角洲': 'bg-green-500/20 text-green-300',
};

export default function ServiceList({
  companionId,
  companionName,
  companionImage,
  services,
}: {
  companionId: string;
  companionName: string;
  companionImage: string;
  services: Service[];
}) {
  const [selected, setSelected] = useState<Service | null>(null);

  return (
    <>
      <div className="space-y-3">
        {services.map((s, i) => (
          <div key={i} className="bg-zinc-900 rounded-2xl px-4 py-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${gameColors[s.game] || 'bg-zinc-700 text-zinc-300'}`}>
                {s.game}
              </span>
              <span className="text-zinc-300 text-sm truncate">{s.type}</span>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="text-white font-semibold text-sm">{s.price}硬币/{s.unit}</span>
              <button
                onClick={() => setSelected(s)}
                className="bg-pink-500 hover:bg-pink-400 text-white text-sm px-4 py-2 rounded-xl font-semibold transition-colors whitespace-nowrap"
              >
                预约
              </button>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <ServiceCheckout
          companionId={companionId}
          companionName={companionName}
          companionImage={companionImage}
          service={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
