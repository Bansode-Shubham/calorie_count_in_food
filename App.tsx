import React, { useState, useEffect } from 'react';
import ImageUpload from './components/ImageUpload';
import ResultsDisplay from './components/ResultsDisplay';
import { analyzeFoodImage } from './services/geminiService';
import { AnalysisResult, AppState } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Scroll to top on state change for better UX
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [appState]);

  const handleImageSelected = async (file: File) => {
    try {
      // Create local preview
      const objectUrl = URL.createObjectURL(file);
      setSelectedImage(objectUrl);
      setAppState(AppState.ANALYZING);
      setError(null);

      // Analyze
      const result = await analyzeFoodImage(file);
      setAnalysisResult(result);
      setAppState(AppState.SUCCESS);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze the image. Please try again with a clearer photo.");
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setSelectedImage(null);
    setAnalysisResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              S
            </div>
            <h1 className="text-xl font-bold tracking-tight">SnapCalorie</h1>
          </div>
          <div className="text-xs font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
            Powered by Gemini 2.5
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-10">
        
        {/* Intro Text (only when idle) */}
        {appState === AppState.IDLE && (
          <div className="text-center mb-12 max-w-2xl mx-auto animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
              Instant Nutrition <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-teal-500">
                From Your Photos
              </span>
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Upload a photo of your meal and let AI break down the calories and macros instantly.
            </p>
          </div>
        )}

        {/* Content Area */}
        <div className="flex flex-col items-center">
          
          {/* Upload Section */}
          {appState === AppState.IDLE && (
            <div className="w-full animate-fade-in-up">
              <ImageUpload onImageSelected={handleImageSelected} />
              
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mx-auto opacity-70">
                <div className="text-center p-4">
                  <div className="text-2xl mb-2">📸</div>
                  <h3 className="font-bold text-sm">Snap a Photo</h3>
                  <p className="text-xs text-gray-500 mt-1">Take a clear picture of your plate</p>
                </div>
                <div className="text-center p-4">
                  <div className="text-2xl mb-2">🤖</div>
                  <h3 className="font-bold text-sm">AI Analysis</h3>
                  <p className="text-xs text-gray-500 mt-1">Gemini identifies foods & portions</p>
                </div>
                <div className="text-center p-4">
                  <div className="text-2xl mb-2">📊</div>
                  <h3 className="font-bold text-sm">Get Stats</h3>
                  <p className="text-xs text-gray-500 mt-1">See calories, protein, and more</p>
                </div>
              </div>
            </div>
          )}

          {/* Analysis State */}
          {appState === AppState.ANALYZING && selectedImage && (
            <div className="w-full max-w-md mx-auto text-center animate-pulse">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg mb-8 border-4 border-white">
                <img src={selectedImage} alt="Analyzing" className="w-full h-full object-cover blur-sm" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                   <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Analyzing your meal...</h3>
              <p className="text-gray-500">Identifying food items and calculating portions</p>
            </div>
          )}

          {/* Results State */}
          {appState === AppState.SUCCESS && analysisResult && (
            <div className="w-full">
               <div className="mb-8 flex justify-center">
                 {selectedImage && (
                    <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-md border-4 border-white transform rotate-3 hover:rotate-0 transition-transform duration-300">
                      <img src={selectedImage} alt="Analyzed meal" className="w-full h-full object-cover" />
                    </div>
                 )}
               </div>
               <ResultsDisplay result={analysisResult} onReset={handleReset} />
            </div>
          )}

          {/* Error State */}
          {appState === AppState.ERROR && (
             <div className="text-center w-full max-w-md bg-red-50 p-8 rounded-3xl border border-red-100">
                <div className="text-4xl mb-4">😕</div>
                <h3 className="text-xl font-bold text-red-700 mb-2">Oops! Something went wrong</h3>
                <p className="text-red-600 mb-6">{error || "We couldn't analyze that image."}</p>
                <button 
                  onClick={handleReset}
                  className="bg-white text-red-600 border border-red-200 px-6 py-2 rounded-full font-medium hover:bg-red-50 transition-colors"
                >
                  Try Again
                </button>
             </div>
          )}

        </div>
      </main>
      
      {/* Global Style overrides for simple animations */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
