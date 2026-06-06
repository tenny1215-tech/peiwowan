import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const DB = process.env.NOTION_CUSTOMERS_DATABASE_ID!;

export interface Customer {
  id: string;
  name: string;
  discordId: string;
  balance: number;
  history: string;
}

function extract(page: any): Customer {
  const p = page.properties;
  return {
    id: page.id,
    name: p['昵称']?.title?.[0]?.plain_text || '',
    discordId: p['Discord ID']?.rich_text?.[0]?.plain_text || '',
    balance: p['余额']?.number ?? 0,
    history: p['充值记录']?.rich_text?.[0]?.plain_text || '',
  };
}

export async function getCustomerByDiscordId(discordId: string): Promise<Customer | null> {
  const res = await notion.databases.query({
    database_id: DB,
    filter: { property: 'Discord ID', rich_text: { equals: discordId } },
  });
  if (!res.results.length) return null;
  return extract(res.results[0]);
}

export async function createCustomer(name: string, discordId: string): Promise<Customer> {
  const page = await notion.pages.create({
    parent: { database_id: DB },
    properties: {
      '昵称': { title: [{ text: { content: name } }] },
      'Discord ID': { rich_text: [{ text: { content: discordId } }] },
      '余额': { number: 0 },
      '充值记录': { rich_text: [{ text: { content: '' } }] },
    },
  });
  return extract(page);
}

export async function addBalance(id: string, coins: number, note: string, currentHistory: string): Promise<void> {
  const date = new Date().toLocaleDateString('zh-CN', { timeZone: 'Europe/Paris' });
  const newHistory = currentHistory
    ? `${currentHistory}\n${date} +${coins}币（${note}）`
    : `${date} +${coins}币（${note}）`;

  await notion.pages.update({
    page_id: id,
    properties: {
      '余额': { number: coins },
      '充值记录': { rich_text: [{ text: { content: newHistory } }] },
    },
  });
}

export async function deductBalance(id: string, coins: number, currentBalance: number): Promise<void> {
  await notion.pages.update({
    page_id: id,
    properties: {
      '余额': { number: currentBalance - coins },
    },
  });
}
