export interface LoginResponse {
  token: string;
}

export interface LoginErrorResponse {
  errors: Record<string, string[]>;
}