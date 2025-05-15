import { User } from '@/types/user';

// Default avatar URLs based on gender
const DEFAULT_AVATARS = {
  male: 'https://i.pinimg.com/736x/ac/6b/13/ac6b1392be57602c482e0317acaa3f4a.jpg',
  female: 'https://i.pinimg.com/736x/ac/6b/13/ac6b1392be57602c482e0317acaa3f4a.jpg',
};

// Mock user data
const MOCK_USERS = [
  {
    _id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    gender: 'male',
    photoUrl: DEFAULT_AVATARS.male,
    knownLanguages: [
      { language: 'English', level: 'Native' },
      { language: 'Spanish', level: 'Intermediate' }
    ],
    learningLanguages: [
      { language: 'French', level: 'Beginner' },
      { language: 'German', level: 'Beginner' }
    ],
    interests: ['Travel', 'Cooking', 'Movies'],
    partnerPreferences: 'Looking for someone patient and willing to practice regularly.'
  }
];

// Simulated storage
let mockUsers = [...MOCK_USERS];
let currentUser: User | null = null;

export async function signInUser(email: string, password: string): Promise<User> {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const user = mockUsers.find(u => u.email === email && u.password === password);
  
  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  const { password: _, ...userWithoutPassword } = user;
  currentUser = userWithoutPassword as User;
  
  return currentUser;
}

export async function signUpUser(
  name: string,
  email: string,
  password: string,
  gender: 'male' | 'female'
): Promise<User> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (mockUsers.some(u => u.email === email)) {
    throw new Error('User already exists');
  }
  
  const newUser = {
    _id: String(mockUsers.length + 1),
    name,
    email,
    password,
    gender,
    photoUrl: 'https://i.pinimg.com/736x/ac/6b/13/ac6b1392be57602c482e0317acaa3f4a.jpg',
    knownLanguages: [],
    learningLanguages: [],
    interests: [],
  };
  
  mockUsers.push(newUser);
  
  const { password: _, ...userWithoutPassword } = newUser;
  currentUser = userWithoutPassword as User;
  
  return currentUser;
}

export async function getCurrentUser(): Promise<User | null> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return currentUser;
}

export async function updateUserProfile(userData: Partial<User>): Promise<User> {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const userIndex = mockUsers.findIndex(u => u._id === userData._id);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }
  
  mockUsers[userIndex] = {
    ...mockUsers[userIndex],
    ...userData,
  };
  
  const { password: _, ...userWithoutPassword } = mockUsers[userIndex];
  currentUser = userWithoutPassword as User;
  
  return currentUser;
}