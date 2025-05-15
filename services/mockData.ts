import { User } from './types/user';
import { Chat, Message } from './types/chat';

// Mock user data
export const mockUsers: User[] = [
  {
    _id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    photoUrl: 'https://i.pinimg.com/736x/6f/40/df/6f40dfcad1e52dfbcd3dfb021cf82a93.jpg',
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
  },
  {
    _id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    photoUrl: 'https://i.pinimg.com/736x/23/6c/cd/236ccd6f8747d825a4dbef82f553b9dd.jpg',
    knownLanguages: [
      { language: 'English', level: 'Native' },
      { language: 'French', level: 'Advanced' }
    ],
    learningLanguages: [
      { language: 'Japanese', level: 'Intermediate' },
      { language: 'Italian', level: 'Beginner' }
    ],
    interests: ['Reading', 'Music', 'Art'],
    partnerPreferences: 'Interested in cultural exchange and making new friends.'
  },
  {
    _id: '3',
    name: 'Miguel Rodríguez',
    email: 'miguel@example.com',
    photoUrl: 'https://i.pinimg.com/736x/15/16/3a/15163a5ae8e3a1cc12eea042e8c1a4c9.jpg',
    knownLanguages: [
      { language: 'Spanish', level: 'Native' },
      { language: 'Portuguese', level: 'Advanced' }
    ],
    learningLanguages: [
      { language: 'English', level: 'Intermediate' },
      { language: 'French', level: 'Beginner' }
    ],
    interests: ['Soccer', 'History', 'Hiking'],
    partnerPreferences: 'Looking for language partners who enjoy discussing culture and travel.'
  },
  {
    _id: '4',
    name: 'Yuki Tanaka',
    email: 'yuki@example.com',
    photoUrl: 'https://i.pinimg.com/736x/c5/af/be/c5afbe8d87cd8f3f9900ab6092cd4c35.jpg',
    knownLanguages: [
      { language: 'Japanese', level: 'Native' },
      { language: 'English', level: 'Advanced' }
    ],
    learningLanguages: [
      { language: 'Spanish', level: 'Beginner' },
      { language: 'Korean', level: 'Intermediate' }
    ],
    interests: ['Anime', 'Cooking', 'Photography'],
    partnerPreferences: 'Interested in teaching Japanese and learning about different cultures.'
  },
  {
    _id: '5',
    name: 'Pierre Dubois',
    email: 'pierre@example.com',
    photoUrl: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg',
    knownLanguages: [
      { language: 'French', level: 'Native' },
      { language: 'English', level: 'Advanced' }
    ],
    learningLanguages: [
      { language: 'German', level: 'Intermediate' },
      { language: 'Russian', level: 'Beginner' }
    ],
    interests: ['Literature', 'Cinema', 'Chess'],
    partnerPreferences: 'Looking for someone interested in deep conversations about culture and philosophy.'
  }
];

// Mock chat data
export const mockChats: Chat[] = [
  {
    _id: 'chat1',
    participants: ['1', '2'],
    lastMessage: 'How are you doing with your Japanese studies?',
    lastMessageTime: '2023-06-01T14:30:00Z',
    recipientName: 'Jane Smith',
    recipientPhotoUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    unreadCount: 0
  },
  {
    _id: 'chat2',
    participants: ['1', '3'],
    lastMessage: '¿Quieres practicar español mañana?',
    lastMessageTime: '2023-06-02T09:45:00Z',
    recipientName: 'Miguel Rodríguez',
    recipientPhotoUrl: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
    unreadCount: 2
  },
  {
    _id: 'chat3',
    participants: ['1', '4'],
    lastMessage: 'I can help you with your Japanese grammar.',
    lastMessageTime: '2023-05-30T18:20:00Z',
    recipientName: 'Yuki Tanaka',
    recipientPhotoUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    unreadCount: 0
  }
];

// Mock message data
export const mockMessages: Message[] = [
  {
    _id: 'msg1',
    chatId: 'chat1',
    senderId: '1',
    text: 'Hi Jane! How are you doing with your Japanese studies?',
    createdAt: '2023-06-01T14:30:00Z'
  },
  {
    _id: 'msg2',
    chatId: 'chat1',
    senderId: '2',
    text: 'Hi John! It\'s going well, thanks for asking. I\'ve been practicing hiragana and katakana every day.',
    createdAt: '2023-06-01T14:35:00Z'
  },
  {
    _id: 'msg3',
    chatId: 'chat1',
    senderId: '1',
    text: 'That\'s great! Do you want to practice conversation sometime this week?',
    createdAt: '2023-06-01T14:40:00Z'
  },
  {
    _id: 'msg4',
    chatId: 'chat2',
    senderId: '3',
    text: 'Hola John! ¿Cómo va tu español?',
    createdAt: '2023-06-02T09:30:00Z'
  },
  {
    _id: 'msg5',
    chatId: 'chat2',
    senderId: '1',
    text: 'Hola Miguel! Mi español está mejorando poco a poco.',
    createdAt: '2023-06-02T09:35:00Z'
  },
  {
    _id: 'msg6',
    chatId: 'chat2',
    senderId: '3',
    text: '¡Muy bien! ¿Quieres practicar español mañana?',
    createdAt: '2023-06-02T09:45:00Z'
  },
  {
    _id: 'msg7',
    chatId: 'chat3',
    senderId: '4',
    text: 'Hello John! How is your Japanese coming along?',
    createdAt: '2023-05-30T18:00:00Z'
  },
  {
    _id: 'msg8',
    chatId: 'chat3',
    senderId: '1',
    text: 'Hi Yuki! I\'m struggling with the particles a bit. Any tips?',
    createdAt: '2023-05-30T18:10:00Z'
  },
  {
    _id: 'msg9',
    chatId: 'chat3',
    senderId: '4',
    text: 'I can help you with your Japanese grammar. Let\'s schedule a call!',
    createdAt: '2023-05-30T18:20:00Z'
  }
];