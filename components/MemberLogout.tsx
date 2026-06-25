'use client';

export default function MemberLogout() {
  function logout() {
    localStorage.removeItem('peiniwan_member');
    window.location.href = '/member';
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
