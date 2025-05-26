
import React, { useState } from 'react';
import Header from '../components/Header';
import ImageUpload from '../components/ImageUpload';
import ImagePreview from '../components/ImagePreview';
import Footer from '../components/Footer';

const Index = () => {
  const [userImage, setUserImage] = useState<string | null>(null);
  
  // Using the uploaded frame image
  const frameImage = '/lovable-uploads/ef500dc2-7b4d-4c38-b8e5-b667d89ab94f.png';

  const handleImageSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setUserImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Instruction Text */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-light">
              Uma solução para que os inscritos no evento adicionem a moldura oficial à sua foto e compartilhem nas redes sociais, aumentando o alcance orgânico da marca.
            </p>
          </div>

          {/* Upload Section */}
          {!userImage && (
            <div className="max-w-2xl mx-auto mb-16">
              <ImageUpload onImageSelect={handleImageSelect} />
            </div>
          )}

          {/* Preview Section */}
          {userImage && (
            <div className="mb-16">
              <ImagePreview 
                userImage={userImage} 
                frameImage={frameImage}
              />
              
              {/* Reset Button */}
              <div className="text-center mt-8">
                <button
                  onClick={() => setUserImage(null)}
                  className="text-gray-500 hover:text-gray-700 underline transition-colors duration-200"
                >
                  Escolher outra foto
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
