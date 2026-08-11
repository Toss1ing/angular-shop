export interface User {
  id: string;
  email: string;
}

export interface LoginUser {
  id: string;
  email: string;
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SingUpCredentials {
  email: string;
  password: string;
}
