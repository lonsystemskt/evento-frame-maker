
import React, { useRef, useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import PhotoControls from './PhotoControls';
import ShareButton from './ShareButton';

interface ImagePreviewProps {
  userImage: string;
  frameImage: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ userImage, frameImage }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const generateCompositeImage = () => {
    return new Promise<void>((resolve) => {
      const canvas = canvasRef.current;
      if (!canvas) return resolve();

      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve();

      const userImg = new Image();
      const frameImg = new Image();
      
      let loadedImages = 0;
      const checkComplete = () => {
        loadedImages++;
        if (loadedImages === 2) {
          canvas.width = frameImg.width;
          canvas.height = frameImg.height;

          ctx.clearRect(0, 0, canvas.width, canvas.height);

          const frameSize = Math.min(frameImg.width, frameImg.height);
          const circleRadius = frameSize * 0.3;
          const circleCenterX = canvas.width / 2;
          const circleCenterY = canvas.height / 2;

          const userAspectRatio = userImg.width / userImg.height;
          const baseTargetSize = circleRadius * 2;
          const targetSize = baseTargetSize * zoomLevel;
          
          let drawWidth, drawHeight;
          if (userAspectRatio > 1) {
            drawHeight = targetSize;
            drawWidth = drawHeight * userAspectRatio;
          } else {
            drawWidth = targetSize;
            drawHeight = drawWidth / userAspectRatio;
          }

          const drawX = circleCenterX - drawWidth / 2 + position.x;
          const drawY = circleCenterY - drawHeight / 2 + position.y;

          ctx.save();
          ctx.beginPath();
          ctx.arc(circleCenterX, circleCenterY, circleRadius, 0, 2 * Math.PI);
          ctx.clip();

          ctx.drawImage(userImg, drawX, drawY, drawWidth, drawHeight);
          
          ctx.restore();
          ctx.drawImage(frameImg, 0, 0);

          resolve();
        }
      };

      userImg.onload = checkComplete;
      frameImg.onload = checkComplete;
      
      userImg.src = userImage;
      frameImg.src = frameImage;
    });
  };

  useEffect(() => {
    generateCompositeImage();
  }, [userImage, frameImage, zoomLevel, position]);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleMoveUp = () => {
    setPosition(prev => ({ ...prev, y: prev.y - 10 }));
  };

  const handleMoveDown = () => {
    setPosition(prev => ({ ...prev, y: prev.y + 10 }));
  };

  const handleMoveLeft = () => {
    setPosition(prev => ({ ...prev, x: prev.x - 10 }));
  };

  const handleMoveRight = () => {
    setPosition(prev => ({ ...prev, x: prev.x + 10 }));
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    
    await generateCompositeImage();
    
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'eu-no-evento.png';
      link.href = canvas.toDataURL();
      link.click();
    }
    
    setIsGenerating(false);
  };

  const handleShare = async () => {
    await generateCompositeImage();
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, 'image/png');
      });

      if (!blob) return;

      // Check if Web Share API is supported and has file sharing capability
      if (navigator.share && navigator.canShare) {
        const file = new File([blob], 'eu-no-evento.png', { type: 'image/png' });
        
        const shareData = {
          title: 'Eu No Evento',
          text: 'Confira minha foto no evento!',
          files: [file]
        };

        // Check if files can be shared
        if (navigator.canShare(shareData)) {
          await navigator.share(shareData);
          return;
        }
      }

      // Fallback: create download link and suggest manual sharing
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'eu-no-evento.png';
      link.click();
      URL.revokeObjectURL(url);

      // Show message for manual sharing
      if (window.confirm('Imagem baixada! Deseja abrir o WhatsApp para compartilhar?')) {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent('Confira minha foto no evento! 📸')}`;
        window.open(whatsappUrl, '_blank');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback to download
      handleDownload();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-8">
        <h3 className="text-xl md:text-2xl font-bold text-center text-gray-800 mb-6">
          Sua Foto com Moldura
        </h3>
        
        <div className="flex justify-center mb-6">
          <div className="relative">
            <canvas
              ref={canvasRef}
              className="max-w-full h-auto rounded-lg shadow-lg"
              style={{ maxHeight: '400px' }}
            />
          </div>
        </div>

        {/* Photo Controls */}
        <PhotoControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onMoveUp={handleMoveUp}
          onMoveDown={handleMoveDown}
          onMoveLeft={handleMoveLeft}
          onMoveRight={handleMoveRight}
          zoomLevel={zoomLevel}
        />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="bg-gradient-to-r from-blue-600 to-red-500 hover:from-blue-700 hover:to-red-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-center gap-3">
              <Download size={24} />
              <span className="text-lg">
                {isGenerating ? 'Gerando...' : 'Baixar Imagem'}
              </span>
            </div>
          </button>

          <ShareButton 
            onShare={handleShare}
            isGenerating={isGenerating}
          />
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;
