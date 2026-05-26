import { User, CreateUserDto, UpdateUserDto } from '../../src/shared/user.types.js';

export class UsersService {
  private users: User[] = [
    {
      id: '1',
      name: 'Kael Dev',
      email: 'kael130311996@gmail.com',
      age: 28,
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Jane Doe',
      email: 'jane@example.com',
      age: 30,
      createdAt: new Date().toISOString()
    }
  ];

  findAll(): User[] {
    return this.users;
  }

  findOne(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }

  create(dto: CreateUserDto): User {
    const newUser: User = {
      id: Math.random().toString(36).substring(2, 9),
      name: dto.name,
      email: dto.email,
      age: Number(dto.age),
      createdAt: new Date().toISOString()
    };
    this.users.push(newUser);
    return newUser;
  }

  update(id: string, dto: UpdateUserDto): User | undefined {
    const user = this.findOne(id);
    if (!user) return undefined;

    if (dto.name !== undefined) user.name = dto.name;
    if (dto.email !== undefined) user.email = dto.email;
    if (dto.age !== undefined) user.age = Number(dto.age);

    return user;
  }

  delete(id: string): boolean {
    const initialLength = this.users.length;
    this.users = this.users.filter(u => u.id !== id);
    return this.users.length < initialLength;
  }
}
