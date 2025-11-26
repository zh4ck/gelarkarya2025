import type { TarotCard } from './data/tarotDeck';

export type SpreadOption = {
  id: 'single' | 'triad';
  label: string;
  description: string;
  cards: number;
};

export type ReadingHistoryEntry = {
  id: string;
  timestamp: string;
  question: string;
  spreadId: SpreadOption['id'];
  cards: TarotCard[];
  reading: string;
};
