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
  loginKey: string;
  discordId: string;
  discordChannelId: string;
}

function extractFileUrl(field: any): string {
  if (!field) return '';
  // URL 类型字段
  if (typeof field.url === 'string') return field.url;
  // Files & media 类型字段（直接上传到 Notion）
  const file = field.files?.[0];
  if (file) return file.file?.url || file.external?.url || '';
  // 页面 cover / icon 格式
  if (field.type === 'file') return field.file?.url || '';
  if (field.type === 'external') return field.external?.url || '';
  return '';
}

function extractPerson(page: any): Person {
  const p = page.properties;
  // 图片优先级：图片字段 URL > 页面 Cover > 页面 Icon
  const image =
    extractFileUrl(p['图片']) ||
    extractFileUrl(page.cover) ||
    extractFileUrl(page.icon) ||
    '';
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
    image,
    audio: extractFileUrl(p['语音']),
    loginKey: p['登录Key']?.rich_text?.[0]?.plain_text || '',
    discordId: p['Discord ID']?.rich_text?.[0]?.plain_text || '',
    discordChannelId: p['Discord 频道 ID']?.rich_text?.[0]?.plain_text || '',
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

function buildProperties(data: Partial<Omit<Person, 'id'>>) {
  const props: Record<string, any> = {};
  if (data.name !== undefined)
    props['昵称'] = { title: [{ text: { content: data.name } }] };
  if (data.games !== undefined)
    props['游戏项目'] = { multi_select: data.games.map((n) => ({ name: n })) };
  if (data.skills !== undefined)
    props['技能标签'] = { multi_select: data.skills.map((n) => ({ name: n })) };
  if (data.location !== undefined)
    props['所在地区'] = { rich_text: [{ text: { content: data.location } }] };
  if (data.price !== undefined)
    props['收费标准'] = { rich_text: [{ text: { content: data.price } }] };
  if (data.bio !== undefined)
    props['个人简介'] = { rich_text: [{ text: { content: data.bio } }] };
  if (data.contact !== undefined)
    props['联系方式'] = { rich_text: [{ text: { content: data.contact } }] };
  if (data.status !== undefined)
    props['状态'] = { select: { name: data.status } };
  if (data.image !== undefined)
    props['图片'] = { url: data.image || null };
  if (data.audio !== undefined)
    props['语音'] = { url: data.audio || null };
  if (data.loginKey !== undefined)
    props['登录Key'] = { rich_text: [{ text: { content: data.loginKey } }] };
  if (data.discordId !== undefined)
    props['Discord ID'] = { rich_text: [{ text: { content: data.discordId } }] };
  if (data.discordChannelId !== undefined)
    props['Discord 频道 ID'] = { rich_text: [{ text: { content: data.discordChannelId } }] };
  return props;
}

export async function getPersonByKey(key: string): Promise<Person | null> {
  const res = await notion.databases.query({
    database_id: DATABASE_ID,
    filter: { property: '登录Key', rich_text: { equals: key } },
  });
  const page = res.results[0];
  if (!page) return null;
  return extractPerson(page);
}

export async function createPerson(data: Omit<Person, 'id'>) {
  return notion.pages.create({
    parent: { database_id: DATABASE_ID },
    properties: buildProperties(data),
  });
}

export async function updatePerson(id: string, data: Partial<Omit<Person, 'id'>>) {
  return notion.pages.update({
    page_id: id,
    properties: buildProperties(data),
  });
}

export async function deletePerson(id: string) {
  return notion.pages.update({ page_id: id, archived: true });
}
