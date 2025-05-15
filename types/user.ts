export interface User {
  _id: string;
  name: string;
  email: string;
  photoUrl?: string;
  gender: 'male' | 'female';
  knownLanguages: {
    language: string;
    level: string;
  }[];
  learningLanguages: {
    language: string;
    level: string;
  }[];
  interests?: string[];
  partnerPreferences?: string;
  isFavorite?: boolean;
}