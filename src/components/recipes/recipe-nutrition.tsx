import React from 'react';
import { Label } from '@/components/ui/label';

interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
}

interface RecipeNutritionProps {
  nutrition: NutritionInfo;
}

export function RecipeNutrition({ nutrition }: RecipeNutritionProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
      <div className="text-center">
        <Label className="block text-sm text-gray-500">Calories</Label>
        <span className="text-lg font-semibold">{nutrition.calories}</span>
      </div>
      <div className="text-center">
        <Label className="block text-sm text-gray-500">Protein</Label>
        <span className="text-lg font-semibold">{nutrition.protein}g</span>
      </div>
      <div className="text-center">
        <Label className="block text-sm text-gray-500">Carbs</Label>
        <span className="text-lg font-semibold">{nutrition.carbs}g</span>
      </div>
      <div className="text-center">
        <Label className="block text-sm text-gray-500">Fat</Label>
        <span className="text-lg font-semibold">{nutrition.fat}g</span>
      </div>
      <div className="col-span-2 md:col-span-4 text-center text-sm text-gray-500">
        Per {nutrition.servingSize} serving
      </div>
    </div>
  );
}
