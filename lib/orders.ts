import { put, get, del, list } from '@vercel/blob';

export interface Order {
  id: string;
  companionId: string;
  companionName: string;
  companionPrice: string;
  customerDiscordId: string;
  status: 'pending' | 'confirmed';
  discordInviteUrl?: string;
  createdAt: string;
}

function orderKey(id: string) {
  return `orders/${id}.json`;
}

export async function createOrder(data: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<Order> {
  const id = Math.random().toString(36).slice(2, 10);
  const order: Order = {
    ...data,
    id,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  await put(orderKey(id), JSON.stringify(order), {
    access: 'public',
    addRandomSuffix: false,
  });
  return order;
}

export async function getOrder(id: string): Promise<Order | null> {
  try {
    const { blobs } = await list({ prefix: `orders/${id}.json` });
    if (!blobs.length) return null;
    const res = await fetch(blobs[0].url);
    return await res.json();
  } catch {
    return null;
  }
}

export async function confirmOrder(id: string, discordInviteUrl: string): Promise<Order | null> {
  const order = await getOrder(id);
  if (!order) return null;
  const updated: Order = { ...order, status: 'confirmed', discordInviteUrl };
  await put(orderKey(id), JSON.stringify(updated), {
    access: 'public',
    addRandomSuffix: false,
  });
  return updated;
}
