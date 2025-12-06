export interface MacroNutrients {
  protein: number;
  carbs: number;
  fat: number;
}

export interface FoodItem {
  name: string;
  calories: number;
  portionSize: string;
  macros: MacroNutrients;
  confidence: number;
}

export interface AnalysisResult {
  totalCalories: number;
  totalMacros: MacroNutrients;
  items: FoodItem[];
  healthTip: string;
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
