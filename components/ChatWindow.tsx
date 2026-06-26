'use client';

import { useState, useEffect, useRef } from 'react';
import PusherClient from 'pusher-js';

interface Message {
  message: string;
  senderName: string;
  senderType: 'player' | 'companion';
  timestamp: number;
}

interface Props {
  companionId: string;
  companionName: string;
  companionImage: string;
  onClose: () => void;
}

export default function ChatWindow({ companionId, companionName, companionImage, onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const session = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('peiniwan_member') || '{}')
    : {};
  const playerName = session.name || session.discordId || '玩家';

  useEffect(() => {
    const pusher = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });
    const channel = pusher.subscribe(`chat-${companionId}`);
    channel.bind('new-message', (data: Message) => {
      setMessages(prev => [...prev, data]);
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

  async function send() {
    if (!input.trim() || sending) return;
    setSending(true);
    await fetch('/api/chat/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        companionId,
        message: input.trim(),
        senderName: playerName,
        senderType: 'player',
      }),
    });
    setInput('');
    setSending(false);
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
      {/* 顶部 */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
        <div className="w-8 h-8 rounded-full overflow-hidden bg-zinc-800 flex-shrink-0">
          {companionImage ? (
            <img src={companionImage} alt={companionName} className="w-full h-full object-cover" />
          ) : (
            <span className="w-full h-full flex items-center justify-center text-xs">👤</span>
          )}
        </div>
        <span className="text-white font-semibold text-sm flex-1">{companionName}</span>
        <button onClick={onClose} className="text-zinc-500 hover:text-white text-lg leading-none">✕</button>
      </div>

      {/* 消息区 */}
      <div className="overflow-y-auto px-4 py-3 space-y-2 min-h-[240px] max-h-[320px]">
        {messages.length === 0 && (
          <p className="text-zinc-600 text-xs text-center mt-10">发送消息，开始聊天吧～</p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.senderType === 'player' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm leading-snug ${
              msg.senderType === 'player'
                ? 'bg-pink-500 text-white rounded-br-sm'
                : 'bg-zinc-800 text-zinc-200 rounded-bl-sm'
            }`}>
              {msg.senderType === 'companion' && (
                <p className="text-zinc-500 text-[10px] mb-0.5">{msg.senderName}</p>
              )}
              {msg.message}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* 输入框 */}
      <div className="flex items-center gap-2 px-3 py-3 border-t border-zinc-800">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="说点什么..."
          className="flex-1 bg-zinc-800 text-white text-sm rounded-xl px-3 py-2 outline-none placeholder-zinc-600"
        />
        <button
          onClick={send}
          disabled={!input.trim() || sending}
          className="bg-pink-500 hover:bg-pink-400 disabled:opacity-40 text-white rounded-xl px-3 py-2 text-sm font-semibold transition-colors"
        >
          发送
        </button>
      </div>
    </div>
  );
}
