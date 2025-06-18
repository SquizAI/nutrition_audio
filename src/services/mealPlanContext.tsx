import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

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

  // Load meal plan from localStorage on mount
  useEffect(() => {
    try {
      const savedPlan = localStorage.getItem('mealPlan');
      const savedDate = localStorage.getItem('selectedDate');
      
      if (savedPlan) {
        const parsedPlan = JSON.parse(savedPlan);
        setCurrentPlan(parsedPlan);
      }
      
      if (savedDate) {
        setSelectedDate(savedDate);
      }
    } catch (error) {
      console.error('Error loading meal plan from localStorage:', error);
    }
  }, []);

  // Save meal plan to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('mealPlan', JSON.stringify(currentPlan));
    } catch (error) {
      console.error('Error saving meal plan to localStorage:', error);
    }
  }, [currentPlan]);

  // Save selected date to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('selectedDate', selectedDate);
    } catch (error) {
      console.error('Error saving selected date to localStorage:', error);
    }
  }, [selectedDate]);

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
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Sample meal options for variety
      const mealOptions = {
        breakfasts: [
          { name: 'Avocado Toast with Eggs', calories: 400, protein: 20, carbs: 30, fat: 25, ingredients: ['Whole grain bread', 'Avocado', 'Eggs', 'Salt', 'Pepper', 'Red pepper flakes'] },
          { name: 'Overnight Oats with Berries', calories: 350, protein: 15, carbs: 55, fat: 12, ingredients: ['Rolled oats', 'Almond milk', 'Greek yogurt', 'Mixed berries', 'Honey', 'Chia seeds'] },
          { name: 'Protein Smoothie Bowl', calories: 380, protein: 25, carbs: 45, fat: 15, ingredients: ['Protein powder', 'Banana', 'Spinach', 'Almond butter', 'Coconut milk', 'Granola'] },
          { name: 'Greek Yogurt Parfait', calories: 300, protein: 20, carbs: 35, fat: 10, ingredients: ['Greek yogurt', 'Granola', 'Honey', 'Mixed berries', 'Almonds'] },
          { name: 'Veggie Scramble', calories: 320, protein: 18, carbs: 12, fat: 22, ingredients: ['Eggs', 'Bell peppers', 'Spinach', 'Mushrooms', 'Cheese', 'Olive oil'] },
          { name: 'Chia Pudding', calories: 280, protein: 12, carbs: 25, fat: 18, ingredients: ['Chia seeds', 'Coconut milk', 'Vanilla', 'Maple syrup', 'Fresh fruit'] },
          { name: 'Whole Grain Pancakes', calories: 420, protein: 16, carbs: 65, fat: 14, ingredients: ['Whole wheat flour', 'Eggs', 'Almond milk', 'Banana', 'Cinnamon', 'Berries'] }
        ],
        lunches: [
          { name: 'Quinoa Buddha Bowl', calories: 450, protein: 15, carbs: 65, fat: 18, ingredients: ['Quinoa', 'Bell peppers', 'Zucchini', 'Olive oil', 'Chickpeas', 'Lemon juice'] },
          { name: 'Grilled Chicken Salad', calories: 380, protein: 35, carbs: 15, fat: 20, ingredients: ['Chicken breast', 'Mixed greens', 'Cherry tomatoes', 'Cucumber', 'Olive oil', 'Balsamic vinegar'] },
          { name: 'Turkey & Avocado Wrap', calories: 420, protein: 28, carbs: 35, fat: 22, ingredients: ['Whole wheat tortilla', 'Turkey breast', 'Avocado', 'Lettuce', 'Tomato', 'Hummus'] },
          { name: 'Mediterranean Bowl', calories: 410, protein: 18, carbs: 50, fat: 20, ingredients: ['Brown rice', 'Falafel', 'Cucumber', 'Tomatoes', 'Olives', 'Tzatziki'] },
          { name: 'Asian Stir Fry', calories: 390, protein: 22, carbs: 45, fat: 16, ingredients: ['Brown rice', 'Mixed vegetables', 'Tofu', 'Soy sauce', 'Ginger', 'Sesame oil'] },
          { name: 'Salmon Poke Bowl', calories: 440, protein: 30, carbs: 40, fat: 20, ingredients: ['Salmon', 'Brown rice', 'Edamame', 'Cucumber', 'Avocado', 'Sesame seeds'] },
          { name: 'Lentil Soup & Salad', calories: 360, protein: 20, carbs: 50, fat: 12, ingredients: ['Red lentils', 'Vegetables', 'Mixed greens', 'Olive oil', 'Herbs'] }
        ],
        dinners: [
          { name: 'Baked Salmon with Asparagus', calories: 520, protein: 40, carbs: 10, fat: 32, ingredients: ['Salmon fillet', 'Asparagus', 'Olive oil', 'Garlic', 'Lemon', 'Dill'] },
          { name: 'Grilled Chicken & Sweet Potato', calories: 480, protein: 35, carbs: 45, fat: 18, ingredients: ['Chicken breast', 'Sweet potato', 'Broccoli', 'Olive oil', 'Herbs'] },
          { name: 'Beef Stir Fry', calories: 450, protein: 32, carbs: 35, fat: 20, ingredients: ['Lean beef', 'Mixed vegetables', 'Brown rice', 'Soy sauce', 'Ginger'] },
          { name: 'Vegetarian Pasta', calories: 420, protein: 18, carbs: 60, fat: 16, ingredients: ['Whole wheat pasta', 'Marinara sauce', 'Vegetables', 'Parmesan', 'Basil'] },
          { name: 'Turkey Meatballs & Zucchini Noodles', calories: 380, protein: 30, carbs: 20, fat: 22, ingredients: ['Ground turkey', 'Zucchini', 'Marinara sauce', 'Italian herbs'] },
          { name: 'Stuffed Bell Peppers', calories: 400, protein: 25, carbs: 35, fat: 20, ingredients: ['Bell peppers', 'Ground turkey', 'Brown rice', 'Vegetables', 'Cheese'] },
          { name: 'Baked Cod with Vegetables', calories: 350, protein: 28, carbs: 25, fat: 15, ingredients: ['Cod fillet', 'Roasted vegetables', 'Olive oil', 'Herbs', 'Lemon'] }
        ],
        snacks: [
          { name: 'Greek Yogurt with Berries', calories: 180, protein: 15, carbs: 20, fat: 5, ingredients: ['Greek yogurt', 'Mixed berries', 'Honey', 'Almonds'] },
          { name: 'Apple with Almond Butter', calories: 190, protein: 6, carbs: 25, fat: 12, ingredients: ['Apple', 'Almond butter'] },
          { name: 'Trail Mix', calories: 200, protein: 8, carbs: 18, fat: 14, ingredients: ['Mixed nuts', 'Dried fruit', 'Dark chocolate chips'] },
          { name: 'Hummus & Veggies', calories: 150, protein: 6, carbs: 15, fat: 8, ingredients: ['Hummus', 'Carrots', 'Cucumber', 'Bell peppers'] },
          { name: 'Protein Smoothie', calories: 220, protein: 20, carbs: 25, fat: 8, ingredients: ['Protein powder', 'Banana', 'Almond milk', 'Spinach'] },
          { name: 'Dark Chocolate & Nuts', calories: 160, protein: 4, carbs: 12, fat: 12, ingredients: ['Dark chocolate', 'Mixed nuts'] },
          { name: 'Cottage Cheese Bowl', calories: 170, protein: 14, carbs: 12, fat: 8, ingredients: ['Cottage cheese', 'Berries', 'Granola'] }
        ]
      };

      // Generate meals for 7 days starting from today
      const newPlans: DailyPlan[] = [];
      const startDate = new Date();
      
      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        const dateString = currentDate.toISOString().split('T')[0];
        
        // Randomly select meals for variety
        const breakfast = mealOptions.breakfasts[i % mealOptions.breakfasts.length];
        const lunch = mealOptions.lunches[i % mealOptions.lunches.length];
        const dinner = mealOptions.dinners[i % mealOptions.dinners.length];
        const snack = mealOptions.snacks[i % mealOptions.snacks.length];
        
        const dayPlan: DailyPlan = {
          date: dateString,
          breakfast: {
            id: `breakfast-${i}`,
            ...breakfast
          },
          lunch: {
            id: `lunch-${i}`,
            ...lunch
          },
          dinner: {
            id: `dinner-${i}`,
            ...dinner
          },
          snacks: [
            {
              id: `snack-${i}`,
              ...snack
            }
          ]
        };
        
        newPlans.push(dayPlan);
      }
      
      setCurrentPlan(newPlans);
      setSelectedDate(startDate.toISOString().split('T')[0]);
      
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
