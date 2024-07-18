export function paginate<T>(
  data: T[],
  page?: number,
  pageSize?: number,
): { items: T[]; total: number; page: number; pageSize: number } {
  const total = data.length;

  if (!page || !pageSize) {
    return { items: data, total, page: 1, pageSize: total };
  }

  const start = (page - 1) * pageSize;
  const end = page * pageSize;
  const items = data.slice(start, end);
  return { items, total, page, pageSize };
}
