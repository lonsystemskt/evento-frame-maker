
import React, { useRef, useEffect, useState } from 'react';
import { Download } from 'lucide-react';

interface ImagePreviewProps {
  userImage: string;
  frameImage: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ userImage, frameImage }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

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
          // Set canvas size to frame size
          canvas.width = frameImg.width;
          canvas.height = frameImg.height;

          // Clear canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Calculate user image dimensions to fit within the circular frame
          const frameSize = Math.min(frameImg.width, frameImg.height);
          const circleRadius = frameSize * 0.3; // Aproximadamente o raio do círculo na moldura
          const circleCenterX = canvas.width / 2;
          const circleCenterY = canvas.height / 2;

          // Calculate scaling to fit user image in circle
          const userAspectRatio = userImg.width / userImg.height;
          const targetSize = circleRadius * 2;
          
          let drawWidth, drawHeight;
          if (userAspectRatio > 1) {
            // Landscape image
            drawHeight = targetSize;
            drawWidth = drawHeight * userAspectRatio;
          } else {
            // Portrait or square image
            drawWidth = targetSize;
            drawHeight = drawWidth / userAspectRatio;
          }

          const drawX = circleCenterX - drawWidth / 2;
          const drawY = circleCenterY - drawHeight / 2;

          // Create circular clipping path
          ctx.save();
          ctx.beginPath();
          ctx.arc(circleCenterX, circleCenterY, circleRadius, 0, 2 * Math.PI);
          ctx.clip();

          // Draw user image
          ctx.drawImage(userImg, drawX, drawY, drawWidth, drawHeight);
          
          ctx.restore();

          // Draw frame on top
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
  }, [userImage, frameImage]);

  const handleDownload = async () => {
    setIsGenerating(true);
    
    // Regenerate image to ensure it's fresh
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

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-2xl p-8">
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Sua Foto com Moldura
        </h3>
        
        <div className="flex justify-center mb-8">
          <div className="relative">
            <canvas
              ref={canvasRef}
              className="max-w-full h-auto rounded-lg shadow-lg"
              style={{ maxHeight: '500px' }}
            />
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="bg-gradient-to-r from-blue-600 to-red-500 hover:from-blue-700 hover:to-red-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-center gap-3">
              <Download size={24} />
              <span className="text-lg">
                {isGenerating ? 'Gerando...' : 'Baixar Imagem Final'}
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;
