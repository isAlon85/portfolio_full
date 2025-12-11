export interface PaginationDTO<T> {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: T[];
}
