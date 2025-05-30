import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define types for meal plan data
interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  instructions?: string;
  image?: string;
}

interface DailyPlan {
  date: string;
  breakfast: Meal | null;
  lunch: Meal | null;
  dinner: Meal | null;
  snacks: Meal[];
}

interface MealPlanContextType {
  currentPlan: DailyPlan[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  addMeal: (date: string, mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks', meal: Meal) => void;
  removeMeal: (date: string, mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks', mealId?: string) => void;
  generateMealPlan: (preferences: any) => Promise<void>;
  isLoading: boolean;
}

// Create context
const MealPlanContext = createContext<MealPlanContextType | undefined>(undefined);

// Provider component
export const MealPlanProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPlan, setCurrentPlan] = useState<DailyPlan[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Add a meal to the plan
  const addMeal = (date: string, mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks', meal: Meal) => {
    setCurrentPlan(prevPlan => {
      const dayIndex = prevPlan.findIndex(day => day.date === date);
      
      if (dayIndex === -1) {
        // Day doesn't exist yet, create it
        const newDay: DailyPlan = {
          date,
          breakfast: null,
          lunch: null,
          dinner: null,
          snacks: []
        };
        
        if (mealType === 'snacks') {
          newDay.snacks = [meal];
        } else {
          newDay[mealType] = meal;
        }
        
        return [...prevPlan, newDay];
      } else {
        // Day exists, update it
        const updatedPlan = [...prevPlan];
        if (mealType === 'snacks') {
          updatedPlan[dayIndex].snacks = [...updatedPlan[dayIndex].snacks, meal];
        } else {
          updatedPlan[dayIndex][mealType] = meal;
        }
        
        return updatedPlan;
      }
    });
  };

  // Remove a meal from the plan
  const removeMeal = (date: string, mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks', mealId?: string) => {
    setCurrentPlan(prevPlan => {
      const dayIndex = prevPlan.findIndex(day => day.date === date);
      
      if (dayIndex === -1) return prevPlan;
      
      const updatedPlan = [...prevPlan];
      
      if (mealType === 'snacks' && mealId) {
        // Remove specific snack by ID
        updatedPlan[dayIndex].snacks = updatedPlan[dayIndex].snacks.filter(snack => snack.id !== mealId);
      } else if (mealType !== 'snacks') {
        // Remove main meal (only for non-snack meal types)
        updatedPlan[dayIndex][mealType] = null;
      }
      
      return updatedPlan;
    });
  };

  // Generate a meal plan based on user preferences
  const generateMealPlan = async (preferences: Record<string, unknown>) => {
    // Log preferences to prevent unused parameter warning
    console.log('Generating meal plan with preferences:', preferences);
    setIsLoading(true);
    
    try {
      // This would typically be an API call to a meal planning service
      // For now, we'll simulate a delay and return some sample data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Sample meal plan data
      const sampleMeal: Meal = {
        id: 'sample-1',
        name: 'Grilled Chicken Salad',
        calories: 350,
        protein: 30,
        carbs: 15,
        fat: 12,
        ingredients: ['Chicken breast', 'Mixed greens', 'Olive oil', 'Lemon juice', 'Salt', 'Pepper']
      };
      
      const today = new Date().toISOString().split('T')[0];
      
      const newPlan: DailyPlan = {
        date: today,
        breakfast: {
          ...sampleMeal,
          id: 'breakfast-1',
          name: 'Avocado Toast with Eggs',
          calories: 400,
          protein: 20,
          carbs: 30,
          fat: 25,
          ingredients: ['Whole grain bread', 'Avocado', 'Eggs', 'Salt', 'Pepper', 'Red pepper flakes']
        },
        lunch: {
          ...sampleMeal,
          id: 'lunch-1',
          name: 'Quinoa Bowl with Roasted Vegetables',
          calories: 450,
          protein: 15,
          carbs: 65,
          fat: 18,
          ingredients: ['Quinoa', 'Bell peppers', 'Zucchini', 'Olive oil', 'Chickpeas', 'Lemon juice']
        },
        dinner: {
          ...sampleMeal,
          id: 'dinner-1',
          name: 'Baked Salmon with Asparagus',
          calories: 520,
          protein: 40,
          carbs: 10,
          fat: 32,
          ingredients: ['Salmon fillet', 'Asparagus', 'Olive oil', 'Garlic', 'Lemon', 'Dill']
        },
        snacks: [
          {
            ...sampleMeal,
            id: 'snack-1',
            name: 'Greek Yogurt with Berries',
            calories: 180,
            protein: 15,
            carbs: 20,
            fat: 5,
            ingredients: ['Greek yogurt', 'Mixed berries', 'Honey', 'Almonds']
          }
        ]
      };
      
      setCurrentPlan([newPlan]);
      setSelectedDate(today);
      
    } catch (error) {
      console.error('Error generating meal plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    currentPlan,
    selectedDate,
    setSelectedDate,
    addMeal,
    removeMeal,
    generateMealPlan,
    isLoading
  };

  return (
    <MealPlanContext.Provider value={value}>
      {children}
    </MealPlanContext.Provider>
  );
};

// Custom hook for using the meal plan context
export const useMealPlan = () => {
  const context = useContext(MealPlanContext);
  
  if (context === undefined) {
    throw new Error('useMealPlan must be used within a MealPlanProvider');
  }
  
  return context;
};
