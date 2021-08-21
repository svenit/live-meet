export interface User {
  id?: string;
  username?: string;
  email?: string;
  fullName?: string;
}

export interface UserResponse {
  id?: number;
  email?: string;
  username?: string;
  fullName?: string;
  createdAt?: Date;
  updatedAt?: Date;
  token?: string;
}
