
import React, { useState } from 'react';
import { Share } from 'lucide-react';

interface ShareButtonProps {
  onShare: () => Promise<void>;
  isGenerating: boolean;
}

const ShareButton: React.FC<ShareButtonProps> = ({ onShare, isGenerating }) => {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
    try {
      await onShare();
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <button
      onClick={handleShare}
      disabled={isGenerating || isSharing}
      className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <div className="flex items-center justify-center gap-3">
        <Share size={24} />
        <span className="text-lg">
          {isSharing ? 'Compartilhando...' : 'Compartilhar'}
        </span>
      </div>
    </button>
  );
};

export default ShareButton;
