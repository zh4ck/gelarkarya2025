import type { SpreadOption } from '../types';

const copyPoints = [
  'Brought to you by Zhillan & Zayyan from SBF SENBUD.'
];

type HeroSectionProps = {
  question: string;
  onQuestionChange: (value: string) => void;
  spread: SpreadOption;
  spreads: SpreadOption[];
  onSpreadChange: (id: SpreadOption['id']) => void;
  onStart: () => void;
  isLoading: boolean;
};

export function HeroSection({
  question,
  onQuestionChange,
  spread,
  spreads,
  onSpreadChange,
  onStart,
  isLoading,
}: HeroSectionProps) {
  return (
    <section className="w-full max-w-2xl text-center fade-in-up">
      <div className="mb-6">
        <h1 className="hero-title text-5xl sm:text-7xl font-bold text-white tracking-tight">
          <span className="glitch-wrapper">
            <span className="glitch-text" data-text="Gelar Karya">Gelar Karya'25</span>
          </span>
        </h1>
        <p className="font-playfair text-4xl sm:text-6xl text-white mt-3">Tarot Reading</p>
      </div>

      <div className="hero-subtitle text-sm text-gray-300 mt-6 mb-8 mx-auto leading-relaxed max-w-lg">
        {copyPoints.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </div>

      <div className="bg-black/40 border border-white/10 rounded-3xl p-6 backdrop-blur-lg shadow-2xl space-y-6 animate-fade-in animate-delay-200">
        <div className="text-left">
          <label htmlFor="question" className="text-xs uppercase tracking-[0.3em] text-white/60">
            Truthseeker Name
          </label>
          <textarea
            id="question"
            value={question}
            onChange={(event) => onQuestionChange(event.target.value)}
            placeholder="Wahai penjelajah, bisikkan padaku: apa nama yang terukir di ambang batas takdir yang akan segera kulewati?"
            className="mt-2 w-full min-h-[120px] bg-white/5 border border-white/10 rounded-2xl p-4 text-base text-white focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300 focus:bg-white/10"
          />
        </div>

        <div className="grid gap-3 text-left sm:grid-cols-2">
          {spreads.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onSpreadChange(option.id)}
              className={`rounded-2xl border px-5 py-4 text-left transition-all duration-300 ${
                spread.id === option.id
                  ? 'border-white/40 bg-white/10 shadow-[0_0_30px_rgba(255,255,255,0.08)] scale-[1.02]'
                  : 'border-white/10 hover:border-white/30 hover:bg-white/5 hover:scale-[1.01]'
              }`}
            >
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">{option.label}</p>
              <p className="mt-2 text-white text-lg font-semibold">{option.cards} card{option.cards > 1 ? 's' : ''}</p>
              <p className="mt-1 text-sm text-gray-400">{option.description}</p>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onStart}
          disabled={isLoading || !question.trim()}
          className="btn-vision group disabled:opacity-50 disabled:cursor-not-allowed mx-auto block hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
        >
          <span className="relative z-10">TEMUKAN TAKDIRMU!</span>
        </button>
      </div>
    </section>
  );
}
