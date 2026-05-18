'use client';

export default function AdminLogout() {
  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/';
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
