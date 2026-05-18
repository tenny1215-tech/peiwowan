import { getPeople } from '@/lib/notion';
import GalleryCard from '@/components/GalleryCard';

export const revalidate = 60;

export default async function Home() {
  const people = await getPeople();

  return (
    <main className="min-h-screen bg-black px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-white text-2xl font-bold mb-6">🎮 陪玩列表</h1>
        {people.length === 0 ? (
          <p className="text-zinc-500 text-center mt-32">暂无陪玩人员</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {people.map((person) => (
              <GalleryCard key={person.id} person={person} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
