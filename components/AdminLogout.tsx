'use client';
import { useRouter } from 'next/navigation';

export default function AdminLogout() {
  const router = useRouter();

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/');
  }

  return (
    <button
      onClick={logout}
      className="text-zinc-400 hover:text-white text-sm transition-colors"
    >
      退出
    </button>
  );
}
