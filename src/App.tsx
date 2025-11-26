import { useCallback, useEffect, useMemo, useState } from 'react';
import { HeroSection } from './components/HeroSection';
import { LoadingOverlay } from './components/LoadingOverlay';
import { TarotResult } from './components/TarotResult';
import { HistoryPanel } from './components/HistoryPanel';
import { TAROT_DECK, type TarotCard } from './data/tarotDeck';
import type { ReadingHistoryEntry, SpreadOption } from './types';

const SPREAD_OPTIONS: SpreadOption[] = [
  {
    id: 'single',
    label: 'Singularity',
    cards: 1,
    description: 'Satu petunjuk pasti untuk jalur yang harus dilalui.',
  },
  {
    id: 'triad',
    label: 'Triad Pulse',
    cards: 3,
    description: 'Bayangan yang telah berlalu, cermin masa kini, dan peta bintang masa depan.',
  },
];

const LOADING_PHRASES = [
  '> MENENTUKAN JALUR TAKDIR... ',
  '> MEMBACA INDEX NAMA...',
  '> SINKRONISASI HARMONISASI NAMA...',
  '> MELIHAT JALUR TAKDIR...',
  '> SKIBIDI TOILET...',
  '> MEMASTIKAN RAMALAN...',
];

// ini nanti ada di local storage kok
const HISTORY_STORAGE_KEY = 'visionary-tarot-history';

const drawCards = (count: number): TarotCard[] => {
  const deck = [...TAROT_DECK];
  const selection: TarotCard[] = [];
  while (selection.length < count && deck.length) {
    const index = Math.floor(Math.random() * deck.length);
    const [card] = deck.splice(index, 1);
    if (card) selection.push(card);
  }
  return selection;
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function App() {
  const [question, setQuestion] = useState('');
  const [activeSpread, setActiveSpread] = useState<SpreadOption>(SPREAD_OPTIONS[0]);
  const [phase, setPhase] = useState<'idle' | 'loading' | 'result'>('idle');
  const [selectedCards, setSelectedCards] = useState<TarotCard[]>([]);
  const [reading, setReading] = useState('');
  const [loadingPhrase, setLoadingPhrase] = useState(LOADING_PHRASES[0]);
  const [history, setHistory] = useState<ReadingHistoryEntry[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = window.localStorage.getItem(HISTORY_STORAGE_KEY);
      return stored ? (JSON.parse(stored) as ReadingHistoryEntry[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    if (phase !== 'loading') return undefined;
    const interval = setInterval(() => {
      setLoadingPhrase((prev) => {
        const next = LOADING_PHRASES[Math.floor(Math.random() * LOADING_PHRASES.length)];
        return next === prev ? LOADING_PHRASES[0] : next;
      });
    }, 900);
    return () => clearInterval(interval);
  }, [phase]);

  const spreadLookup = useMemo(
    () => Object.fromEntries(SPREAD_OPTIONS.map((option) => [option.id, option])),
    []
  );

  const buildPrompt = useCallback(
    (cards: TarotCard[]) => {
      const cardSummary = cards
        .map((card, index) => `${index + 1}. ${card.name} — ${card.keywords}`)
        .join('\n');
      return `Kamu adalah pembaca tarot handal untuk sebuah instalasi seni. Berikan respon dengan maksimal 3 paragraf yang menjelaskan mengenai pembacaan Tarot berdasarkan kartu yang mereka terima.
Name: ${question} (berikan penjelasan atas nama mereka juga, jika ada)
Cards Drawn:\n${cardSummary} (ubah nama kartu dalam bahasa Indonesia)
Gunakan bahasa yang puitis sebagaimana pembaca tarot, beri penjelasan mengenai kartu yang di dapat (tambahkan efek bold dalam markdown), dan tutup dengan satu hal yang bisa mereka lakukan. Berikan efek markdown bold untuk hal penting, termasuk nama orang.`;
    },
    [question, activeSpread.label]
  );

  const fetchReading = useCallback(async (prompt: string) => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: prompt }),
    });

    if (!response.ok) {
      throw new Error('Gemini API responded with an error');
    }

    const data = await response.json();
    if (!data.response) {
      throw new Error('Empty response from Gemini');
    }

    return data.response.trim();
  }, []);

  const handleStartReading = useCallback(async () => {
    if (!question.trim()) return;
    const cards = drawCards(activeSpread.cards);
    setSelectedCards(cards);
    setPhase('loading');
    setReading('');

    try {
      const prompt = buildPrompt(cards);
      const geminiReading = await fetchReading(prompt);
      setReading(geminiReading);
      const entry: ReadingHistoryEntry = {
        id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}`,
        timestamp: new Date().toISOString(),
        question,
        spreadId: activeSpread.id,
        cards,
        reading: geminiReading,
      };
      setHistory((prev) => [entry, ...prev].slice(0, 10));
    } catch (error) {
      console.error(error);
      setReading('Pembaca Tarot sedang main Clash Royale, mohon menunggu.');
    } finally {
      await wait(1200);
      setPhase('result');
    }
  }, [question, activeSpread, buildPrompt, fetchReading]);

  const handleReset = useCallback(() => {
    setPhase('idle');
    setSelectedCards([]);
    setReading('');
  }, []);

  const handleHistorySelect = useCallback(
    (entry: ReadingHistoryEntry) => {
      setQuestion(entry.question);
      setSelectedCards(entry.cards);
      setReading(entry.reading);
      setActiveSpread(spreadLookup[entry.spreadId] ?? SPREAD_OPTIONS[0]);
      setPhase('result');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [spreadLookup]
  );

  const isLoading = phase === 'loading';

  return (
    <div className="min-h-screen w-full bg-[#030303] text-white px-4 py-12 relative overflow-hidden">
      <div className="ambient-light" />
      <nav className="absolute top-0 left-0 w-full px-6 py-6 flex justify-between text-white text-xs uppercase tracking-[0.4em]">
        <span>GeKa'25</span>
        <span>Fasilkom UI</span>
      </nav>

      <main className="relative z-10 flex flex-col gap-10 items-center pt-24">
        {phase === 'idle' && (
          <HeroSection
            question={question}
            onQuestionChange={setQuestion}
            spread={activeSpread}
            spreads={SPREAD_OPTIONS}
            onSpreadChange={(id) => setActiveSpread(spreadLookup[id] ?? SPREAD_OPTIONS[0])}
            onStart={handleStartReading}
            isLoading={isLoading}
          />
        )}

        {phase === 'result' && selectedCards.length > 0 && (
          <TarotResult
            cards={selectedCards}
            reading={reading}
            question={question}
            spreadLabel={activeSpread.label}
            onReset={handleReset}
          />
        )}

        <HistoryPanel history={history} spreads={SPREAD_OPTIONS} onSelect={handleHistorySelect} />
      </main>

      <LoadingOverlay visible={isLoading} phrase={loadingPhrase} />
    </div>
  );
}

export default App;
