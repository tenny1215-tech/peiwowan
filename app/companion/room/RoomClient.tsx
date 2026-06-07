'use client';
import { useState, useRef } from 'react';
import { Person } from '@/lib/notion';

const GAMES = ['英雄联盟', '无畏契约', '三角洲'];
const SKILLS = ['上分带队', '陪练', '开黑', '教学'];
const STATUSES = [
  { label: '在线', color: 'bg-green-500 hover:bg-green-400', dot: 'bg-green-400' },
  { label: '可接单', color: 'bg-green-500 hover:bg-green-400', dot: 'bg-green-400' },
  { label: '游戏中', color: 'bg-yellow-500 hover:bg-yellow-400', dot: 'bg-yellow-400' },
  { label: '离线', color: 'bg-zinc-600 hover:bg-zinc-500', dot: 'bg-zinc-400' },
];

const inputCls = 'w-full bg-zinc-800 text-white rounded-xl px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-pink-500 placeholder:text-zinc-600';

export default function RoomClient({ person }: { person: Person }) {
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [status, setStatus] = useState(person.status);
  const [statusSaving, setStatusSaving] = useState(false);
  const [statusSaved, setStatusSaved] = useState(false);
  const [form, setForm] = useState({ ...person });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState<'image' | 'audio' | null>(null);
  const [uploadError, setUploadError] = useState('');
  const imageRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLInputElement>(null);

  async function updateStatus(s: string) {
    if (s === status || statusSaving) return;
    setStatusSaving(true);
    const res = await fetch('/api/companion/status', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: s }),
    });
    if (res.ok) {
      setStatus(s);
      setStatusSaved(true);
      setTimeout(() => setStatusSaved(false), 2000);
    }
    setStatusSaving(false);
  }

  async function handleUpload(file: File, type: 'image' | 'audio') {
    setUploading(type);
    setUploadError('');
    const fd = new FormData();
    fd.append('file', file);
    fd.append('type', type);
    const res = await fetch('/api/companion/upload', { method: 'POST', body: fd });
    if (res.ok) {
      const { url } = await res.json();
      setForm((f) => ({ ...f, [type]: url }));
    } else {
      const data = await res.json().catch(() => ({}));
      setUploadError(data.error || '上传失败，请重试');
    }
    setUploading(null);
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/companion/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => { setSaved(false); setMode('view'); }, 1500);
  }

  function toggle(field: 'games' | 'skills', value: string) {
    setForm((f) => ({
      ...f,
      [field]: f[field].includes(value)
        ? f[field].filter((v) => v !== value)
        : [...f[field], value],
    }));
  }

  async function logout() {
    await fetch('/api/companion/logout', { method: 'POST' });
    window.location.href = '/companion/login';
  }

  const current = STATUSES.find((s) => s.label === status);

  return (
    <div className="max-w-sm mx-auto space-y-6 pb-16">
      {/* 头像 + 名字 */}
      <div className="flex items-center gap-4 pt-8 px-4">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-zinc-800 flex-shrink-0">
          {form.image ? (
            <img src={form.image} alt={form.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">👤</div>
          )}
        </div>
        <div className="flex-1">
          <h1 className="text-white text-xl font-bold">{form.name}</h1>
          <div className="flex items-center gap-1.5 mt-1">
            <span className={`w-2 h-2 rounded-full ${current?.dot || 'bg-zinc-400'}`} />
            <span className="text-zinc-400 text-sm">{status}</span>
          </div>
        </div>
        <button
          onClick={() => setMode(mode === 'edit' ? 'view' : 'edit')}
          className="text-zinc-400 hover:text-white text-sm bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-lg transition-colors"
        >
          {mode === 'edit' ? '取消' : '编辑资料'}
        </button>
      </div>

      {mode === 'view' ? (
        /* 状态切换 */
        <div className="bg-zinc-900 rounded-2xl p-6 mx-4">
          <p className="text-zinc-500 text-xs uppercase tracking-wider mb-4">我的状态</p>
          <div className="flex items-center gap-2 mb-5">
            <span className={`w-2.5 h-2.5 rounded-full ${current?.dot || 'bg-zinc-400'}`} />
            <span className="text-white font-semibold">{status}</span>
            {statusSaved && <span className="text-green-400 text-xs">已更新</span>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {STATUSES.map((s) => (
              <button key={s.label} onClick={() => updateStatus(s.label)} disabled={statusSaving}
                className={`py-3 rounded-xl font-semibold text-sm transition-colors disabled:opacity-50 ${
                  status === s.label
                    ? `${s.color} text-white ring-2 ring-white/20`
                    : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'
                }`}>
                {s.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* 编辑资料 */
        <form onSubmit={saveProfile} className="space-y-5 px-4">

          {/* 昵称 */}
          <Field label="昵称">
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputCls} placeholder="你的昵称" />
          </Field>

          {/* 个人简介 */}
          <Field label="个人简介">
            <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className={`${inputCls} h-24 resize-none`} placeholder="简单介绍一下自己..." />
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

          {/* 所在地区 */}
          <Field label="所在地区">
            <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
              className={inputCls} placeholder="例：上海" />
          </Field>

          {/* 收费标准 */}
          <Field label="收费标准">
            <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
              className={inputCls} placeholder="例：50元/小时" />
          </Field>

          {/* 联系方式 */}
          <Field label="联系方式">
            <input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })}
              className={inputCls} placeholder="例：微信：xxx" />
          </Field>

          {/* 头像上传 */}
          {uploadError && <p className="text-red-400 text-xs px-1">{uploadError}</p>}
          <Field label="头像">
            <div className="flex items-center gap-3">
              {form.image && (
                <img src={form.image} alt="头像" className="w-14 h-14 rounded-full object-cover flex-shrink-0" />
              )}
              <button type="button" onClick={() => imageRef.current?.click()}
                disabled={uploading === 'image'}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-zinc-300 py-3 rounded-xl text-sm transition-colors">
                {uploading === 'image' ? '上传中...' : '从本地上传图片'}
              </button>
              <input ref={imageRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'image')} />
            </div>
          </Field>

          {/* 语音上传 */}
          <Field label="语音介绍">
            <div className="flex items-center gap-3">
              {form.audio && (
                <audio src={form.audio} controls className="flex-1 h-10" />
              )}
              <button type="button" onClick={() => audioRef.current?.click()}
                disabled={uploading === 'audio'}
                className={`${form.audio ? '' : 'flex-1'} bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-zinc-300 px-4 py-3 rounded-xl text-sm transition-colors whitespace-nowrap`}>
                {uploading === 'audio' ? '上传中...' : '上传音频'}
              </button>
              <input ref={audioRef} type="file" accept="audio/*" className="hidden"
                onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'audio')} />
            </div>
          </Field>

          {/* Discord ID */}
          <Field label="Discord 用户 ID">
            <input value={form.discordId || ''} onChange={(e) => setForm({ ...form, discordId: e.target.value })}
              className={inputCls} placeholder="例：123456789012345678" />
            <p className="text-zinc-600 text-xs mt-1">填写后玩家下单时会自动通知你。在 Discord 设置 → 开启开发者模式 → 右键自己头像复制</p>
          </Field>

          {/* 登录 Key（只读）*/}
          <Field label="登录 Key（不可修改）">
            <div className="bg-zinc-900 text-zinc-500 rounded-xl px-4 py-3 text-sm font-mono tracking-wider">
              {form.loginKey}
            </div>
          </Field>

          <button type="submit" disabled={saving}
            className="w-full bg-pink-500 hover:bg-pink-400 disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition-colors">
            {saved ? '已保存 ✓' : saving ? '保存中...' : '保存资料'}
          </button>
        </form>
      )}

      {/* 退出 */}
      <div className="px-4">
        <button onClick={logout} className="w-full text-zinc-600 hover:text-zinc-400 text-sm py-2 transition-colors">
          退出登录
        </button>
      </div>
    </div>
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
