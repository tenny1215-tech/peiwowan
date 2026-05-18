import { getPersonById } from '@/lib/notion';
import PersonForm from '@/components/PersonForm';
import { notFound } from 'next/navigation';

export default async function EditPerson({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const person = await getPersonById(id);
  if (!person) return notFound();

  const { id: _, ...initial } = person;

  return (
    <main className="min-h-screen bg-black px-4 py-8">
      <div className="max-w-lg mx-auto">
        <h1 className="text-white text-2xl font-bold mb-8">✏️ 编辑：{person.name}</h1>
        <PersonForm initial={initial} personId={id} />
      </div>
    </main>
  );
}
