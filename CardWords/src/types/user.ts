export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  gender: string;
  dateOfBirth: string;
  currentLevel: string;
  activated: boolean;
  banned: boolean;
  status: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserResponse {
  status: string;
  message: string;
  data: User;
}

export interface UsersResponse {
  status: string;
  message: string;
  data: {
    totalPages: number;
    totalElements: number;
    numberOfElements: number;
    pageable: {
      paged: boolean;
      unpaged: boolean;
      pageNumber: number;
      pageSize: number;
      offset: number;
      sort: {
        unsorted: boolean;
        sorted: boolean;
        empty: boolean;
      };
    };
    last: boolean;
    first: boolean;
    size: number;
    content: User[];
    number: number;
    sort: {
      unsorted: boolean;
      sorted: boolean;
      empty: boolean;
    };
    empty: boolean;
  };
}

export interface UserStatistics {
  totalUsers: number;
  activatedUsers: number;
  bannedUsers: number;
  adminUsers: number;
  normalUsers: number;
}

export interface StatisticsResponse {
  status: string;
  message: string;
  data: UserStatistics;
}

export interface UpdateRolesRequest {
  roleNames: string[];
}

export interface PaginationParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface SearchParams extends PaginationParams {
  keyword: string;
}

export interface EmptyResponse {
  status: string;
  message: string;
  data: {};
}
export interface UserFilter {
  search: string;
  status: string;
  banned: boolean | null;
  activated: boolean | null;
  current_level: string;
}