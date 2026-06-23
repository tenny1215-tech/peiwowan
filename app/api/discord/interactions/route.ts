import { NextRequest, NextResponse } from 'next/server';
import * as crypto from 'crypto';
import { getCustomerByDiscordId, deductBalance } from '@/lib/customers';
import { updatePerson } from '@/lib/notion';

function verifySignature(signature: string, timestamp: string, body: string): boolean {
  const publicKey = process.env.DISCORD_PUBLIC_KEY!;
  try {
    const keyDer = Buffer.concat([
      Buffer.from('302a300506032b6570032100', 'hex'),
      Buffer.from(publicKey, 'hex'),
    ]);
    const key = crypto.createPublicKey({ key: keyDer, format: 'der', type: 'spki' });
    return crypto.verify(null, Buffer.from(timestamp + body), key, Buffer.from(signature, 'hex'));
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get('x-signature-ed25519') || '';
  const timestamp = req.headers.get('x-signature-timestamp') || '';
  const body = await req.text();

  if (!verifySignature(signature, timestamp, body)) {
    return new NextResponse('Invalid signature', { status: 401 });
  }

  const interaction = JSON.parse(body);

  // Discord ping
  if (interaction.type === 1) {
    return NextResponse.json({ type: 1 });
  }

  // 按钮点击
  if (interaction.type === 3) {
    const customId: string = interaction.data?.custom_id || '';

    if (customId.startsWith('ao|')) {
      const parts = customId.split('|');
      const companionIdClean = parts[1];
      const cost = parseInt(parts[2] || '0');
      const customerDiscordId = parts[3] || '';

      // 补回 UUID 格式
      const companionId = [
        companionIdClean.slice(0, 8),
        companionIdClean.slice(8, 12),
        companionIdClean.slice(12, 16),
        companionIdClean.slice(16, 20),
        companionIdClean.slice(20),
      ].join('-');

      // 扣费
      if (cost > 0 && customerDiscordId) {
        const customer = await getCustomerByDiscordId(customerDiscordId);
        if (!customer || customer.balance < cost) {
          return NextResponse.json({
            type: 7,
            data: { content: '❌ 接单失败：玩家余额不足', components: [] },
          });
        }
        await deductBalance(customer.id, cost, customer.balance);
      }

      // 更新陪玩师状态
      await updatePerson(companionId, { status: '游戏中' });

      return NextResponse.json({
        type: 7,
        data: {
          content: `✅ 接单成功！已扣除玩家 ${cost} 硬币，加油～`,
          components: [],
        },
      });
    }
  }

  return NextResponse.json({ type: 1 });
}
