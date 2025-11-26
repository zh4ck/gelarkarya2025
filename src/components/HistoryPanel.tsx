import type { ReadingHistoryEntry, SpreadOption } from '../types';

const formatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
});

type HistoryPanelProps = {
  history: ReadingHistoryEntry[];
  spreads: SpreadOption[];
  onSelect: (entry: ReadingHistoryEntry) => void;
};

export function HistoryPanel({ history, spreads, onSelect }: HistoryPanelProps) {
  const spreadLookup = Object.fromEntries(spreads.map((spread) => [spread.id, spread.label]));

  if (!history.length) {
    return (
      <div className="w-full max-w-2xl mx-auto text-white/50 text-center text-sm border border-white/5 rounded-3xl p-4">
        Your readings will appear here once generated.
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-black/40 border border-white/10 rounded-3xl p-4 space-y-3">
      <p className="text-xs uppercase tracking-[0.4em] text-white/50">Reading History</p>
      {history.map((entry) => (
        <button
          key={entry.id}
          type="button"
          onClick={() => onSelect(entry)}
          className="w-full text-left rounded-2xl border border-white/10 px-4 py-3 hover:border-white/30 transition"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-white/80">{entry.question}</p>
            <p className="text-[11px] uppercase tracking-[0.3em] text-white/40">
              {spreadLookup[entry.spreadId]}
            </p>
          </div>
          <p className="text-[11px] text-white/40 mt-1">{formatter.format(new Date(entry.timestamp))}</p>
        </button>
      ))}
    </div>
  );
}
