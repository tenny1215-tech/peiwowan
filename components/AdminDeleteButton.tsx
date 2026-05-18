'use client';
import { useRouter } from 'next/navigation';

export default function AdminDeleteButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`确定删除「${name}」吗？`)) return;
    await fetch(`/api/admin/person/${id}`, { method: 'DELETE' });
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      className="text-red-400 hover:text-red-300 text-sm bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-lg transition-colors"
    >
      删除
    </button>
  );
}
