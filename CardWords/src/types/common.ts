// Common types used across the application
export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface PaginationParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface ListResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  numberOfElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}



export interface PaginationParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface ListResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  numberOfElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface SelectOption {
  value: string | number;
  label: string;
}

// Form types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'file';
  required?: boolean;
  options?: SelectOption[];
  placeholder?: string;
}