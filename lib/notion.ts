import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const DATABASE_ID = process.env.NOTION_DATABASE_ID!;

export interface Person {
  id: string;
  name: string;
  games: string[];
  skills: string[];
  location: string;
  price: string;
  bio: string;
  contact: string;
  status: string;
  image: string;
  audio: string;
}

function extractPerson(page: any): Person {
  const p = page.properties;
  return {
    id: page.id,
    name: p['昵称']?.title?.[0]?.plain_text || '',
    games: p['游戏项目']?.multi_select?.map((g: any) => g.name) || [],
    skills: p['技能标签']?.multi_select?.map((s: any) => s.name) || [],
    location: p['所在地区']?.rich_text?.[0]?.plain_text || '',
    price: p['收费标准']?.rich_text?.[0]?.plain_text || '',
    bio: p['个人简介']?.rich_text?.[0]?.plain_text || '',
    contact: p['联系方式']?.rich_text?.[0]?.plain_text || '',
    status: p['状态']?.select?.name || '',
    image: p['图片']?.url || '',
    audio: p['语音']?.url || '',
  };
}

export async function getPeople(): Promise<Person[]> {
  const res = await notion.databases.query({ database_id: DATABASE_ID });
  return res.results
    .filter((p: any) => !p.in_trash)
    .map(extractPerson)
    .filter((p) => p.name);
}

export async function getPersonById(id: string): Promise<Person | null> {
  try {
    const page = await notion.pages.retrieve({ page_id: id });
    return extractPerson(page);
  } catch {
    return null;
  }
}
