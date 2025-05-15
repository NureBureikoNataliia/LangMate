import { User } from '@/types/user';
import { mockUsers } from './mockData';

// Get all user profiles (for discovery)
export async function getUserProfiles(): Promise<User[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // In a real app, this would filter users based on preferences, location, etc.
  return mockUsers;
}

// Get single user profile
export async function getUserProfile(userId: string): Promise<User | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const user = mockUsers.find(u => u._id === userId);
  
  if (!user) {
    return null;
  }
  
  return user;
}

// Update user profile
export async function updateUserProfile(userData: Partial<User>): Promise<User> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Find the user in the mock database
  const userIndex = mockUsers.findIndex(u => u._id === userData._id);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }
  
  // Update user data
  mockUsers[userIndex] = {
    ...mockUsers[userIndex],
    ...userData,
  };
  
  return mockUsers[userIndex];
}

// Toggle favorite user
export async function toggleFavoriteUser(userId: string): Promise<void> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const userIndex = mockUsers.findIndex(u => u._id === userId);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }
  
  // Toggle favorite status
  mockUsers[userIndex] = {
    ...mockUsers[userIndex],
    isFavorite: !mockUsers[userIndex].isFavorite,
  };
}