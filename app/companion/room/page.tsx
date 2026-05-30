import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getPersonById } from '@/lib/notion';
import StatusSwitcher from './StatusSwitcher';

export const revalidate = 0;

export default async function CompanionRoom() {
  const cookieStore = await cookies();
  const companionId = cookieStore.get('companion_session')?.value;
  if (!companionId) redirect('/companion/login');

  const person = await getPersonById(companionId);
  if (!person) redirect('/companion/login');

  return (
    <main className="min-h-screen bg-black px-4 py-8">
      <div className="max-w-sm mx-auto space-y-8">
        {/* Profile */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-zinc-800 flex-shrink-0">
            {person.image ? (
              <img src={person.image} alt={person.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl">👤</div>
            )}
          </div>
          <div>
            <h1 className="text-white text-xl font-bold">{person.name}</h1>
            <div className="flex gap-1 mt-1 flex-wrap">
              {person.games.map((g) => (
                <span key={g} className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">{g}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Bio */}
        {person.bio && (
          <p className="text-zinc-400 text-sm leading-relaxed">{person.bio}</p>
        )}

        {/* Status */}
        <div className="bg-zinc-900 rounded-2xl p-6">
          <p className="text-zinc-500 text-xs uppercase tracking-wider mb-4">我的状态</p>
          <StatusSwitcher currentStatus={person.status} />
        </div>
      </div>
    </main>
  );
}
