export interface User {
  id?: string;
  username?: string;
  email?: string;
  fullName?: string;
}

export interface UserResponse {
  id?: string;
  email?: string;
  username?: string;
  fullName?: string;
  createdAt?: Date;
  updatedAt?: Date;
  token?: string;
}
