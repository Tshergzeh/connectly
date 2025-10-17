export async function clientFetchServices(
  cursor?: string,
  limit?: number,
  filters?: {
    keyword?: string;
    category?: string;
    priceMin?: number;
    priceMax?: number;
    ratingMin?: number;
  },
) {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/services`);

  if (cursor) url.searchParams.append('cursor', cursor);
  if (limit) url.searchParams.append('limit', limit.toString());
  if (filters?.keyword) url.searchParams.append('keyword', filters.keyword);
  if (filters?.category) url.searchParams.append('category', filters.category);
  if (filters?.priceMin) url.searchParams.append('priceMin', filters.priceMin.toString());
  if (filters?.priceMax) url.searchParams.append('priceMin', filters.priceMax.toString());
  if (filters?.ratingMin) url.searchParams.append('ratingMin', filters.ratingMin.toString());

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to fetch services');

  return res.json();
}
