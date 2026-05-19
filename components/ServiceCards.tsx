'use client';
import { useState } from 'react';
import Link from 'next/link';

const cards = [
  {
    num: '01.',
    title: '游戏陪练',
    desc: '王者荣耀、英雄联盟、原神……专业玩家带你上分，组队开黑不再难。',
    link: '/companions',
    linkText: '→ 查看陪玩',
  },
  {
    num: '02.',
    title: '语音聊天陪伴',
    desc: '异乡生活有时就是需要一个说话的人。有趣的灵魂，随时在线陪你聊。',
    link: '/companions',
    linkText: '→ 了解详情',
  },
  {
    num: '03.',
    title: '私人定制服务',
    desc: '特定时段预约、多人组队、长期合作……按需匹配，灵活安排。',
    link: '/about',
    linkText: '→ 联系我们',
  },
];

export default function ServiceCards() {
  const [hovered, setHovered] = useState<number | null>(null);
  const activeIndex = hovered !== null ? hovered : 1;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card, i) => {
        const isActive = i === activeIndex;
        return (
          <div
            key={i}
            className={`rounded-2xl p-8 flex flex-col justify-between min-h-[300px] transition-colors duration-200 cursor-pointer ${
              isActive ? 'bg-[#CCFF00]' : 'bg-zinc-900'
            }`}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <div>
              <p className={`text-sm mb-6 transition-colors duration-200 ${isActive ? 'text-black/40' : 'text-zinc-600'}`}>
                {card.num}
              </p>
              <h3 className={`text-xl font-bold mb-4 transition-colors duration-200 ${isActive ? 'text-black' : 'text-white'}`}>
                {card.title}
              </h3>
              <p className={`text-sm leading-relaxed transition-colors duration-200 ${isActive ? 'text-black/70' : 'text-zinc-500'}`}>
                {card.desc}
              </p>
            </div>
            <Link
              href={card.link}
              className={`text-sm mt-8 hover:underline inline-flex items-center gap-1 transition-colors duration-200 ${
                isActive ? 'text-black font-semibold' : 'text-[#CCFF00]'
              }`}
            >
              {card.linkText}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
