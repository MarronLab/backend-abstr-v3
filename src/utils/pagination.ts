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

class PaginationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PaginationError';
  }
}

/**
 * Calculates the number of items to skip for pagination.
 *
 * @param page - The current page number (1-based).
 * @param count - The number of items per page.
 * @returns The number of items to skip.
 * @throws {PaginationError} If page or count is less than 1.
 */
export function calculateSkip(page: number, count: number): number {
  if (page < 1) {
    throw new PaginationError(
      'Page number must be greater than or equal to 1.',
    );
  }
  if (count < 1) {
    throw new PaginationError('Count must be greater than or equal to 1.');
  }
  return (page - 1) * count;
}
