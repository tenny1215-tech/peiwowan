'use client';
import { useEffect, useState } from 'react';

const SESSION_KEY = 'peiniwan_member';

export default function MemberGuard({ discordId, children }: { discordId: string; children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(SESSION_KEY);
    if (!saved) { window.location.href = '/member'; return; }
    try {
      const s = JSON.parse(saved);
      if (s.discordId !== discordId) { window.location.href = '/member'; return; }
    } catch {
      window.location.href = '/member';
      return;
    }
    setAuthorized(true);
  }, [discordId]);

  if (!authorized) return null;
  return <>{children}</>;
}
