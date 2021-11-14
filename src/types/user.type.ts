export interface User {
  id?: string;
  username?: string;
  fullName?: string;
}

export interface UserResponse {
  id?: number;
  username?: string;
  fullName?: string;
  createdAt?: Date;
  updatedAt?: Date;
  token?: string;
}
