type LoadingOverlayProps = {
  visible: boolean;
  phrase: string;
};

export function LoadingOverlay({ visible, phrase }: LoadingOverlayProps) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fade-in">
      <div className="text-center px-6">
        <p className="font-playfair text-5xl text-white/20 italic mb-8 animate-pulse">Processing</p>
        <div className="loader-line mx-auto" />
        <p className="font-mono text-[11px] tracking-[0.3em] text-gray-400 mt-5 uppercase">{phrase}</p>
      </div>
    </div>
  );
}
