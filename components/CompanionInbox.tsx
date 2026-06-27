'use client';

import { useState, useEffect, useRef } from 'react';
import PusherClient from 'pusher-js';

interface Message {
  message: string;
  senderName: string;
  senderType: 'player' | 'companion';
  timestamp: number;
}

export default function CompanionInbox({
  companionId,
  companionName,
}: {
  companionId: string;
  companionName: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 先拉历史消息
    fetch(`/api/chat/messages?companionId=${encodeURIComponent(companionId)}`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setMessages(data); })
      .catch(() => {});

    // 再订阅实时新消息（去重）
    const pusher = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });
    const channel = pusher.subscribe(`chat-${companionId}`);
    channel.bind('new-message', (data: Message) => {
      setMessages(prev => {
        if (prev.some(m => m.timestamp === data.timestamp && m.senderName === data.senderName)) return prev;
        return [...prev, data];
      });
    });
    return () => {
      channel.unbind_all();
      pusher.unsubscribe(`chat-${companionId}`);
      pusher.disconnect();
    };
  }, [companionId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function reply() {
    if (!input.trim() || sending) return;
    setSending(true);
    await fetch('/api/chat/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        companionId,
        message: input.trim(),
        senderName: companionName,
        senderType: 'companion',
      }),
    });
    setInput('');
    setSending(false);
  }

  return (
    <div className="bg-zinc-900 rounded-2xl overflow-hidden mt-6">
      <div className="px-4 py-3 border-b border-zinc-800">
        <p className="text-zinc-400 text-sm font-semibold">💬 私讯消息</p>
      </div>

      <div className="overflow-y-auto px-4 py-3 space-y-2 min-h-[160px] max-h-[280px]">
        {messages.length === 0 && (
          <p className="text-zinc-600 text-xs text-center mt-8">暂无消息，等待玩家来聊吧～</p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.senderType === 'companion' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-snug ${
              msg.senderType === 'companion'
                ? 'bg-pink-500 text-white rounded-br-sm'
                : 'bg-zinc-800 text-zinc-200 rounded-bl-sm'
            }`}>
              {msg.senderType === 'player' && (
                <p className="text-zinc-500 text-[10px] mb-0.5">{msg.senderName}</p>
              )}
              {msg.message}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="flex items-center gap-2 px-3 py-3 border-t border-zinc-800">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && reply()}
          placeholder="回复玩家..."
          className="flex-1 bg-zinc-800 text-white text-sm rounded-xl px-3 py-2 outline-none placeholder-zinc-600"
        />
        <button
          onClick={reply}
          disabled={!input.trim() || sending}
          className="bg-pink-500 hover:bg-pink-400 disabled:opacity-40 text-white rounded-xl px-3 py-2 text-sm font-semibold transition-colors"
        >
          回复
        </button>
      </div>
    </div>
  );
}
