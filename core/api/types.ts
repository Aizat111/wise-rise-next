import { AxiosRequestConfig } from "axios";

export interface RequestConfig<T = unknown> extends AxiosRequestConfig<T> {}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface CategoryBanner {
  id: number;
  name: string;
  mimetype: string;
  type: string;
  size: number;
  path: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  order: number;
  parent_id: number | null;
  is_active: number;
  description: string | null;
  is_last: boolean;
  banner: CategoryBanner | null;
  children: Category[];
}
