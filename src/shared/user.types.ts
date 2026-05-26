export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  createdAt: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  age: number;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  age?: number;
}
