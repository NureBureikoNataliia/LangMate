import { Chat, Message } from '@/types/chat';
import { mockChats, mockMessages } from './mockData';

// Get all chats for current user
export async function getChats(): Promise<Chat[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return mockChats;
}

// Get messages for a specific chat
export async function getMessages(chatId: string): Promise<Message[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Filter messages by chat ID
  return mockMessages.filter(m => m.chatId === chatId);
}

// Send a message
export async function sendMessage(chatId: string, messageData: Omit<Message, '_id'>): Promise<Message> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newMessage: Message = {
    _id: String(mockMessages.length + 1),
    chatId,
    ...messageData,
  };
  
  // Add to mock messages
  mockMessages.push(newMessage);
  
  // Update the chat's last message
  const chatIndex = mockChats.findIndex(c => c._id === chatId);
  if (chatIndex !== -1) {
    mockChats[chatIndex] = {
      ...mockChats[chatIndex],
      lastMessage: messageData.text,
      lastMessageTime: messageData.createdAt,
    };
  }
  
  return newMessage;
}