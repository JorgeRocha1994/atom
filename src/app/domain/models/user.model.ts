export interface User {
  id: string;
  email: string;
  createdAt: Date;
}

export interface UserToken extends User {
  token: string;
  expiresAt: Date;
}
