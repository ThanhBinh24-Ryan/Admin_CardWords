export interface WordType {
  id: number;
  name: string;
  description?: string;
}

export interface WordTypeResponse {
  status: string;
  message: string;
  data: WordType;
}

export interface WordTypesResponse {
  status: string;
  message: string;
  data: WordType[];
}

export interface CreateWordTypeRequest {
  name: string;
  description?: string;
}

export interface UpdateWordTypeRequest {
  name: string;
  description?: string;
}

export interface EmptyResponse {
  status: string;
  message: string;
  data: {};
}

export interface BatchUpdateWordTypeRequest {
  id: number;
  name: string;
}

export interface BatchUpdateRequest {
  types: BatchUpdateWordTypeRequest[];
}

export interface BatchUpdateResponse {
  status: string;
  message: string;
  data: WordType[];
}