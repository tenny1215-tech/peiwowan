'use client';
import { useRouter } from 'next/navigation';

export default function MemberLogout() {
  const router = useRouter();

  function logout() {
    localStorage.removeItem('peiniwan_member');
    router.push('/member');
  }

  return (
    <button
      onClick={logout}
      className="text-zinc-500 hover:text-white text-sm transition-colors"
    >
      退出
    </button>
  );
}
