'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Person } from '@/lib/notion';

const GAMES = ['英雄联盟', '无畏契约', '三角洲'];
const SKILLS = ['上分带队', '陪练', '开黑', '教学'];
const STATUSES = ['可接单', '忙碌中', '下线'];

type FormData = Omit<Person, 'id'>;

interface Props {
  initial?: FormData;
  personId?: string;
}

const empty: FormData = {
  name: '', games: [], skills: [], location: '',
  price: '', bio: '', contact: '', status: '可接单',
  image: '', audio: '',
};

export default function PersonForm({ initial, personId }: Props) {
  const [form, setForm] = useState<FormData>(initial || empty);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function toggle(field: 'games' | 'skills', value: string) {
    setForm((f) => ({
      ...f,
      [field]: f[field].includes(value)
        ? f[field].filter((v) => v !== value)
        : [...f[field], value],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    if (personId) {
      await fetch(`/api/admin/person/${personId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    } else {
      await fetch('/api/admin/person', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    }

    router.push('/admin');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* 昵称 */}
      <Field label="昵称 *">
        <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
          className={input} placeholder="例：小葵 🌸" />
      </Field>

      {/* 状态 */}
      <Field label="状态">
        <div className="flex gap-2">
          {STATUSES.map((s) => (
            <button key={s} type="button"
              onClick={() => setForm({ ...form, status: s })}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${form.status === s ? 'bg-pink-500 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}>
              {s}
            </button>
          ))}
        </div>
      </Field>

      {/* 游戏项目 */}
      <Field label="游戏项目">
        <div className="flex gap-2 flex-wrap">
          {GAMES.map((g) => (
            <button key={g} type="button" onClick={() => toggle('games', g)}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${form.games.includes(g) ? 'bg-blue-500 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}>
              {g}
            </button>
          ))}
        </div>
      </Field>

      {/* 技能标签 */}
      <Field label="技能标签">
        <div className="flex gap-2 flex-wrap">
          {SKILLS.map((s) => (
            <button key={s} type="button" onClick={() => toggle('skills', s)}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${form.skills.includes(s) ? 'bg-yellow-500 text-black' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}>
              {s}
            </button>
          ))}
        </div>
      </Field>

      {/* 文字字段 */}
      <Field label="所在地区">
        <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
          className={input} placeholder="例：上海" />
      </Field>

      <Field label="收费标准">
        <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
          className={input} placeholder="例：50元/小时" />
      </Field>

      <Field label="个人简介">
        <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}
          className={`${input} h-24 resize-none`} placeholder="简单介绍一下自己..." />
      </Field>

      <Field label="联系方式">
        <input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })}
          className={input} placeholder="例：微信：xxx" />
      </Field>

      <Field label="图片链接（头像）">
        <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })}
          className={input} placeholder="https://..." />
        {form.image && (
          <img src={form.image} alt="预览" className="mt-2 w-16 h-16 rounded-full object-cover" />
        )}
      </Field>

      <Field label="语音链接（音频）">
        <input value={form.audio} onChange={(e) => setForm({ ...form, audio: e.target.value })}
          className={input} placeholder="https://..." />
      </Field>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={() => router.back()}
          className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-xl font-semibold transition-colors">
          取消
        </button>
        <button type="submit" disabled={loading}
          className="flex-1 bg-pink-500 hover:bg-pink-400 disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition-colors">
          {loading ? '保存中...' : '保存'}
        </button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-zinc-400 text-xs mb-1.5 block uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}

const input = "w-full bg-zinc-800 text-white rounded-xl px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-pink-500 placeholder:text-zinc-600";
