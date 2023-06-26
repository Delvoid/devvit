import { Vote } from '@prisma/client';

export type CachedPost = {
  id: string;
  title: string;
  content: string;
  authorUsername: string;
  currentVote: Vote['type'] | null;
  createdAt: Date;
};
