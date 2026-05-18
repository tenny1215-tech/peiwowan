import PersonForm from '@/components/PersonForm';

export default function NewPerson() {
  return (
    <main className="min-h-screen bg-black px-4 py-8">
      <div className="max-w-lg mx-auto">
        <h1 className="text-white text-2xl font-bold mb-8">➕ 添加陪玩人员</h1>
        <PersonForm />
      </div>
    </main>
  );
}
