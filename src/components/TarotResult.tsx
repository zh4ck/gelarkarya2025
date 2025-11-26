import type { TarotCard } from '../data/tarotDeck';
import { markdownToHtml } from '../utils/markdown';

type TarotResultProps = {
  cards: TarotCard[];
  reading: string;
  question: string;
  spreadLabel: string;
  onReset: () => void;
};

export function TarotResult({ cards, reading, question, spreadLabel, onReset }: TarotResultProps) {
  const isSingleCard = cards.length === 1;

  return (
    <section className="w-full max-w-6xl mx-auto flex flex-col gap-12 items-center text-white animate-fade-in">
      <div className="text-center space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-white/60 animate-fade-in">{spreadLabel} Spread</p>
        <h2 className="font-playfair text-5xl md:text-6xl text-glow animate-fade-in animate-delay-100">Ramalan Masa Depan</h2>
        <p className="text-gray-400 text-sm md:text-base italic animate-fade-in animate-delay-200">"{question || 'Unspecified'}"</p>
      </div>

      {isSingleCard ? (
        <div className="w-full flex flex-col md:flex-row gap-8 md:gap-16 items-start justify-center">
          <div className="w-full md:w-1/3 flex justify-center md:justify-end">
            <article className="card-container w-full max-w-md animate-float">
              <div className="card-inner flipped">
                <div className="card-face card-back card-hover-effect">
                  <div className="card-image-container">
                    <img src={cards[0].img} alt={cards[0].name} className="card-illustration" />
                  </div>
                  <div className="card-content">
                    <span className="keyword-tag">{cards[0].keywords}</span>
                    <h3 className="card-title-modern">{cards[0].name}</h3>
                    <p className="card-desc-modern" dangerouslySetInnerHTML={{ __html: markdownToHtml(cards[0].desc) }} />
                  </div>
                </div>
              </div>
            </article>
          </div>

          <div className="w-full md:w-2/3 bg-black/40 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-10 space-y-6 animate-fade-in animate-delay-300 gemini-container-glow">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-white/30"></div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/80 font-semibold">The Oracle Speaks</p>
              <div className="h-px w-full bg-white/10"></div>
            </div>
            
            <div 
              className="markdown-content text-lg text-gray-100 leading-relaxed font-light tracking-wide"
              dangerouslySetInnerHTML={{ __html: markdownToHtml(reading) }}
            />
            
            <div className="flex flex-wrap gap-4 pt-8 border-t border-white/10 mt-8">
              <button type="button" onClick={onReset} className="px-6 py-3 rounded-full border border-transparent text-xs tracking-[0.2em] uppercase text-white/60 hover:text-white hover:bg-white/5 transition-all duration-300 ml-auto">
                New Reading
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-8 w-full md:grid-cols-3">
            {cards.map((card, index) => (
              <article key={card.name} className={`card-container w-full max-w-md mx-auto animate-fade-in`} style={{ animationDelay: `${index * 150}ms` }}>
                <div className="card-inner flipped">
                  <div className="card-face card-back card-hover-effect">
                    <div className="card-image-container">
                      <img src={card.img} alt={card.name} className="card-illustration" />
                    </div>
                    <div className="card-content">
                      <span className="keyword-tag">{card.keywords}</span>
                      <h3 className="card-title-modern">{card.name}</h3>
                      <p className="card-desc-modern" dangerouslySetInnerHTML={{ __html: markdownToHtml(card.desc) }} />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="w-full max-w-4xl bg-black/40 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-10 space-y-6 animate-fade-in animate-delay-300 mt-8 gemini-container-glow">
             <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-white/30"></div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/80 font-semibold">The Oracle Speaks</p>
              <div className="h-px w-full bg-white/10"></div>
            </div>

            <div 
              className="markdown-content text-lg text-gray-100 leading-relaxed font-light tracking-wide"
              dangerouslySetInnerHTML={{ __html: markdownToHtml(reading) }}
            />

            <div className="flex flex-wrap gap-4 pt-8 border-t border-white/10 mt-8">
              <button type="button" onClick={onReset} className="px-6 py-3 rounded-full border border-transparent text-xs tracking-[0.2em] uppercase text-white/60 hover:text-white hover:bg-white/5 transition-all duration-300 ml-auto">
                New Reading
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
