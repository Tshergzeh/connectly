export async function clientFetchServices(cursor?: string, limit?: number) {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/services`);
  if (cursor) url.searchParams.append('cursor', cursor);
  if (limit) url.searchParams.append('limit', limit.toString());

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to fetch services');

  return res.json();
}
