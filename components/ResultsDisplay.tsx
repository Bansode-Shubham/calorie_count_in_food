import React from 'react';
import { AnalysisResult } from '../types';
import MacroChart from './MacroChart';

interface ResultsDisplayProps {
  result: AnalysisResult;
  onReset: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, onReset }) => {
  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in-up">
      
      {/* Summary Card */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/food.png')]"></div>
          <p className="text-green-100 font-medium mb-1 uppercase tracking-wider text-xs">Total Energy</p>
          <h2 className="text-6xl font-bold mb-2">{result.totalCalories}</h2>
          <p className="text-xl font-light opacity-90">Calories</p>
          
          <div className="mt-6 flex justify-center gap-2">
             <span className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                🍽️ {result.items.length} Items
             </span>
             <span className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                💪 {result.totalMacros.protein}g Protein
             </span>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            {/* Chart Section */}
            <div>
              <h3 className="text-gray-800 font-semibold text-lg mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-green-500 rounded-full"></span>
                Macro Breakdown
              </h3>
              <div className="bg-gray-50 rounded-2xl p-4">
                 <MacroChart macros={result.totalMacros} />
              </div>
            </div>

            {/* Health Tip */}
            <div className="flex flex-col h-full justify-center">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r-xl">
                <h4 className="text-blue-700 font-bold mb-1">AI Insight</h4>
                <p className="text-blue-800 leading-relaxed italic">"{result.healthTip}"</p>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                 <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase">Carbs</p>
                    <p className="text-lg font-bold text-gray-800">{result.totalMacros.carbs}g</p>
                 </div>
                 <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase">Protein</p>
                    <p className="text-lg font-bold text-gray-800">{result.totalMacros.protein}g</p>
                 </div>
                 <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase">Fat</p>
                    <p className="text-lg font-bold text-gray-800">{result.totalMacros.fat}g</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Items List */}
      <h3 className="text-xl font-bold text-gray-800 mb-4 px-2">Detailed Breakdown</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {result.items.map((item, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-bold text-gray-800 text-lg capitalize">{item.name}</h4>
                <p className="text-sm text-gray-500">{item.portionSize}</p>
              </div>
              <div className="bg-green-100 text-green-700 px-3 py-1 rounded-lg font-bold text-sm">
                {item.calories} kcal
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-3 mb-2">
              {/* Visual bar relative to 500 kcal for simple scale visual */}
              <div 
                className="bg-green-500 h-1.5 rounded-full" 
                style={{ width: `${Math.min((item.calories / 500) * 100, 100)}%` }}
              ></div>
            </div>

            <div className="flex text-xs text-gray-500 justify-between mt-2">
              <span>P: {item.macros.protein}g</span>
              <span>C: {item.macros.carbs}g</span>
              <span>F: {item.macros.fat}g</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <button
          onClick={onReset}
          className="flex items-center gap-2 bg-gray-800 hover:bg-black text-white px-8 py-3 rounded-full font-medium transition-colors shadow-lg hover:shadow-xl transform active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v3.276a1 1 0 11-2 0V13.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          Analyze Another Meal
        </button>
      </div>
    </div>
  );
};

export default ResultsDisplay;
