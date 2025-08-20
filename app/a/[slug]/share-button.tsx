'use client';

interface ShareButtonProps {
  shareUrl: string;
}

export default function ShareButton({ shareUrl }: ShareButtonProps) {
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
      }}
      className="px-6 py-3 bg-badge-accent text-white rounded-lg hover:bg-amber-600 transition-colors"
    >
      Copy Share Link
    </button>
  );
}