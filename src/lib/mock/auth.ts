import { User, LoginCredentials, RegisterData } from '@/types/auth';

const mockUsers: User[] = [
  {
    id: '1',
    email: 'john@example.com',
    name: 'John Doe',
    familyGroups: [
      {
        id: '1',
        name: 'Doe Family',
        members: [],
        inviteCode: 'DOE123',
      },
    ],
  },
];

export const mockAuth = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const user = mockUsers.find((u) => u.email === credentials.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    return user;
  },
  
  register: async (data: RegisterData): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const existingUser = mockUsers.find((u) => u.email === data.email);
    if (existingUser) {
      throw new Error('User already exists');
    }
    
    const newUser: User = {
      id: String(mockUsers.length + 1),
      email: data.email,
      name: data.name,
      familyGroups: [],
    };
    
    mockUsers.push(newUser);
    return newUser;
  },
  
  logout: async (): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
  },
};
