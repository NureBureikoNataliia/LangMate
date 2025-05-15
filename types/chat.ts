export interface Chat {
  _id: string;
  participants: string[];
  lastMessage?: string;
  lastMessageTime: string;
  recipientName: string;
  recipientPhotoUrl?: string;
  unreadCount: number;
}

export interface Message {
  _id: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt: string;
}