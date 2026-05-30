import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getPersonById } from '@/lib/notion';
import RoomClient from './RoomClient';

export const revalidate = 0;

export default async function CompanionRoom() {
  const cookieStore = await cookies();
  const companionId = cookieStore.get('companion_session')?.value;
  if (!companionId) redirect('/companion/login');

  const person = await getPersonById(companionId);
  if (!person) redirect('/companion/login');

  return (
    <main className="min-h-screen bg-black">
      <RoomClient person={person} />
    </main>
  );
}
