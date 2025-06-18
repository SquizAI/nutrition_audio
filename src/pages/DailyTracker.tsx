import React, { useState, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { useMealPlan } from '../services/mealPlanContext';
import UnifiedMealModal from '../components/UnifiedMealModal';
import ChatMobile from '../components/ChatMobile';
import { 
  Calendar,
  Target,
  TrendingUp,
  Plus,
  Edit3,
  Trash2,
  Camera,
  Mic,
  BarChart3,
  Activity,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Sun,
  Moon,
  MessageCircle,
  Bot
} from 'lucide-react';

// Animation keyframes
const slideInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

// MOBILE-FIRST RESPONSIVE CONTAINER
const PageContainer = styled.div`
  width: 100%;
  max-width: 100vw;
  padding: 0.75rem;
  padding-bottom: 10rem; /* Increased for better clearance above sticky footer */
  min-height: 100vh;
  position: relative;
  overflow-x: hidden; /* Prevent horizontal scroll */
  
  @media (min-width: 768px) {
    padding: 2rem;
    padding-bottom: 2rem;
    max-width: 1400px;
    margin: 0 auto;
  }
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(236, 72, 153, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(59, 130, 246, 0.05) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 1rem;
  position: relative;
  z-index: 1;
  animation: ${slideInUp} 0.6s ease-out;
  
  @media (min-width: 768px) {
    margin-bottom: 2rem;
  }
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 900;
  background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
  
  @media (min-width: 480px) {
    font-size: 2rem;
  }
  
  @media (min-width: 768px) {
    font-size: 2.5rem;
  }
  
  @media (min-width: 1024px) {
    font-size: 3rem;
  }
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.8rem;
  line-height: 1.6;
  
  @media (min-width: 480px) {
    font-size: 0.9rem;
  }
  
  @media (min-width: 768px) {
    font-size: 1rem;
  }
  
  @media (min-width: 1024px) {
    font-size: 1.1rem;
  }
`;

// MOBILE-FIRST DAY CAROUSEL
const DayCarousel = styled.div`
  margin-bottom: 1rem;
  position: relative;
  z-index: 1;
  animation: ${slideInUp} 0.6s ease-out 0.2s both;
  
  @media (min-width: 768px) {
    margin-bottom: 2rem;
  }
`;

const DayScrollContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 0.5rem 0 1rem 0;
  scroll-snap-type: x mandatory;
  width: 100%;
  
  /* Hide scrollbar */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  
  @media (min-width: 640px) {
    gap: 0.75rem;
  }
  
  @media (min-width: 768px) {
    gap: 1rem;
    padding: 1rem 0;
  }
  
  @media (min-width: 1024px) {
    justify-content: center;
    gap: 1.5rem;
  }
`;

const DayCard = styled.div<{ $isCurrent: boolean }>`
  /* Mobile-first: Smaller cards for mobile */
  min-width: 240px;
  flex-shrink: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 0.75rem;
  border: 1px solid ${({ $isCurrent }) => $isCurrent ? '#ec4899' : 'rgba(255, 255, 255, 0.1)'};
  scroll-snap-align: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  
  ${({ $isCurrent }) => $isCurrent && `
    box-shadow: 0 12px 40px rgba(236, 72, 153, 0.2);
    transform: scale(1.02);
    
    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%);
      border-radius: 16px 16px 0 0;
    }
  `}
  
  /* Larger mobile screens */
  @media (min-width: 480px) {
    min-width: 280px;
    padding: 1rem;
  }
  
  /* Tablet: Larger cards */
  @media (min-width: 768px) {
    min-width: ${({ $isCurrent }) => $isCurrent ? '340px' : '300px'};
    padding: 1.5rem;
    border-radius: 20px;
  }
  
  /* Desktop: Even larger for current */
  @media (min-width: 1024px) {
    min-width: ${({ $isCurrent }) => $isCurrent ? '400px' : '320px'};
    padding: 2rem;
    border-radius: 24px;
  }
  
  &:hover {
    transform: ${({ $isCurrent }) => $isCurrent ? 'scale(1.02)' : 'scale(1.01)'};
    box-shadow: 0 8px 32px rgba(236, 72, 153, 0.15);
  }
`;

const DayHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  
  @media (min-width: 768px) {
    margin-bottom: 1.5rem;
  }
`;

const DayInfo = styled.div`
  flex: 1;
`;

const DayDate = styled.h3<{ $isCurrent: boolean }>`
  color: ${({ $isCurrent }) => $isCurrent ? '#ec4899' : 'white'};
  font-size: 1rem;
  font-weight: 800;
  margin: 0 0 0.25rem 0;
  
  @media (min-width: 480px) {
    font-size: 1.1rem;
  }
  
  @media (min-width: 768px) {
    font-size: 1.3rem;
  }
  
  @media (min-width: 1024px) {
    font-size: 1.5rem;
  }
`;

const DayName = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.7rem;
  margin: 0;
  font-weight: 500;
  
  @media (min-width: 480px) {
    font-size: 0.8rem;
  }
  
  @media (min-width: 768px) {
    font-size: 0.9rem;
  }
`;

const DayTotals = styled.div`
  text-align: right;
`;

const TotalCalories = styled.div<{ $isCurrent: boolean }>`
  color: ${({ $isCurrent }) => $isCurrent ? '#ec4899' : 'white'};
  font-size: 1.2rem;
  font-weight: 900;
  line-height: 1;
  
  @media (min-width: 480px) {
    font-size: 1.4rem;
  }
  
  @media (min-width: 768px) {
    font-size: 1.6rem;
  }
  
  @media (min-width: 1024px) {
    font-size: 1.8rem;
  }
`;

const TotalLabel = styled.p`
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.6rem;
  margin: 0;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  @media (min-width: 480px) {
    font-size: 0.7rem;
  }
  
  @media (min-width: 768px) {
    font-size: 0.8rem;
  }
`;

// MOBILE-FIRST MEAL GRID
const MealGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
  
  @media (min-width: 400px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 768px) {
    gap: 1rem;
  }
`;

const MealButton = styled.button<{ $hasData: boolean; $mealType: string }>`
  /* Mobile-first compact design */
  background: ${({ $hasData, $mealType }) => {
    if (!$hasData) return 'rgba(255, 255, 255, 0.05)';
    
    switch ($mealType) {
      case 'breakfast': return 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)';
      case 'lunch': return 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';
      case 'dinner': return 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)';
      default: return 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)';
    }
  }};
  border: 1px solid ${({ $hasData }) => $hasData ? 'transparent' : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 10px;
  padding: 0.6rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  color: white;
  min-height: 70px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 0.75rem;
  width: 100%;
  
  @media (min-width: 480px) {
    border-radius: 12px;
    padding: 0.75rem;
    min-height: 80px;
    font-size: 0.8rem;
  }
  
  @media (min-width: 768px) {
    border-radius: 16px;
    padding: 1rem;
    min-height: 100px;
    font-size: 0.9rem;
  }
  
  @media (min-width: 1024px) {
    padding: 1.25rem;
    min-height: 120px;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const MealHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.4rem;
  
  @media (min-width: 768px) {
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }
`;

const MealIcon = styled.div`
  font-size: 1rem;
  
  @media (min-width: 768px) {
    font-size: 1.1rem;
  }
`;

const MealName = styled.h4`
  font-size: 0.7rem;
  font-weight: 700;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  @media (min-width: 768px) {
    font-size: 0.8rem;
  }
  
  @media (min-width: 1024px) {
    font-size: 0.9rem;
  }
`;

const MealContent = styled.div<{ $hasData: boolean }>`
  opacity: ${({ $hasData }) => $hasData ? 1 : 0.6};
`;

const MealTitle = styled.div`
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 0.3rem;
  line-height: 1.2;
  
  @media (min-width: 768px) {
    font-size: 0.9rem;
    margin-bottom: 0.4rem;
  }
  
  @media (min-width: 1024px) {
    font-size: 1rem;
  }
`;

const MacroRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.7rem;
  font-weight: 600;
  
  @media (min-width: 768px) {
    font-size: 0.75rem;
  }
  
  @media (min-width: 1024px) {
    font-size: 0.8rem;
  }
`;

const CaloriesMain = styled.span`
  font-size: 0.9rem;
  font-weight: 800;
  
  @media (min-width: 768px) {
    font-size: 1rem;
  }
  
  @media (min-width: 1024px) {
    font-size: 1.1rem;
  }
`;

const MacroDetails = styled.span`
  opacity: 0.9;
`;

// MOBILE-FIRST MACRO OVERVIEW
const MacroOverview = styled.div`
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  animation: ${slideInUp} 0.6s ease-out 0.4s both;
  
  @media (min-width: 768px) {
    border-radius: 20px;
    padding: 1.5rem;
    margin-bottom: 2rem;
  }
  
  @media (min-width: 1024px) {
    padding: 2rem;
    border-radius: 24px;
  }
`;

const MacroGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(4, 1fr);
  }
  
  @media (min-width: 768px) {
    gap: 1rem;
  }
  
  @media (min-width: 1024px) {
    gap: 1.5rem;
  }
`;

const MacroCard = styled.div<{ $color: string; $percentage: number }>`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1rem 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  
  @media (min-width: 768px) {
    border-radius: 16px;
    padding: 1.25rem 1rem;
  }
  
  @media (min-width: 1024px) {
    padding: 1.5rem 1.25rem;
  }
  
  &:before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: ${({ $percentage }) => Math.min($percentage, 100)}%;
    background: linear-gradient(180deg, transparent 0%, ${({ $color }) => $color}15 100%);
    transition: height 0.5s ease;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px ${({ $color }) => $color}20;
  }
`;

const MacroHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  position: relative;
  z-index: 1;
  
  @media (min-width: 768px) {
    margin-bottom: 1rem;
  }
`;

const MacroName = styled.h3`
  color: white;
  font-size: 0.8rem;
  font-weight: 700;
  margin: 0;
  
  @media (min-width: 768px) {
    font-size: 0.9rem;
  }
  
  @media (min-width: 1024px) {
    font-size: 1rem;
  }
`;

const MacroIcon = styled.div<{ $color: string }>`
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  
  @media (min-width: 768px) {
    width: 32px;
    height: 32px;
    border-radius: 8px;
  }
  
  @media (min-width: 1024px) {
    width: 36px;
    height: 36px;
  }
`;

const MacroProgress = styled.div`
  position: relative;
  z-index: 1;
`;

const MacroValues = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
  margin-bottom: 0.4rem;
  
  @media (min-width: 768px) {
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }
`;

const CurrentValue = styled.span`
  color: white;
  font-size: 1.2rem;
  font-weight: 900;
  
  @media (min-width: 768px) {
    font-size: 1.4rem;
  }
  
  @media (min-width: 1024px) {
    font-size: 1.6rem;
  }
`;

const TargetValue = styled.span`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.75rem;
  font-weight: 600;
  
  @media (min-width: 768px) {
    font-size: 0.8rem;
  }
  
  @media (min-width: 1024px) {
    font-size: 0.85rem;
  }
`;

const ProgressBar = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  height: 4px;
  overflow: hidden;
  margin-bottom: 0.4rem;
  
  @media (min-width: 768px) {
    border-radius: 6px;
    height: 6px;
    margin-bottom: 0.5rem;
  }
`;

const ProgressFill = styled.div<{ $width: number; $color: string }>`
  width: ${({ $width }) => Math.min($width, 100)}%;
  height: 100%;
  background: ${({ $color }) => $color};
  transition: width 0.5s ease;
  border-radius: inherit;
`;

const ProgressText = styled.div<{ $isOver: boolean }>`
  color: ${({ $isOver }) => $isOver ? '#ef4444' : 'rgba(255, 255, 255, 0.7)'};
  font-size: 0.7rem;
  font-weight: 600;
  
  @media (min-width: 768px) {
    font-size: 0.75rem;
  }
  
  @media (min-width: 1024px) {
    font-size: 0.8rem;
  }
`;

// MOBILE-FIRST QUICK ADD SECTION
const QuickAddSection = styled.div`
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  text-align: center;
  animation: ${slideInUp} 0.6s ease-out 0.6s both;
  
  @media (min-width: 768px) {
    border-radius: 20px;
    padding: 1.5rem;
  }
  
  @media (min-width: 1024px) {
    padding: 2rem;
    border-radius: 24px;
  }
`;

const QuickAddTitle = styled.h2`
  color: white;
  font-size: 1.2rem;
  font-weight: 800;
  margin: 0 0 1rem 0;
  
  @media (min-width: 768px) {
    font-size: 1.4rem;
  }
  
  @media (min-width: 1024px) {
    font-size: 1.6rem;
  }
`;

const QuickAddButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
  
  @media (min-width: 768px) {
    gap: 1rem;
  }
  
  @media (min-width: 1024px) {
    gap: 1.5rem;
  }
`;

const QuickAddButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.8rem;
  
  background: ${({ $variant }) => 
    $variant === 'primary' 
      ? 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)'
      : 'rgba(255, 255, 255, 0.1)'};
  color: white;
  
  @media (min-width: 768px) {
    padding: 0.875rem 1.25rem;
    border-radius: 16px;
    font-size: 0.9rem;
  }
  
  @media (min-width: 1024px) {
    padding: 1rem 1.5rem;
    font-size: 1rem;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(236, 72, 153, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

// Add floating chat button
const FloatingChatButton = styled.button<{ $isOpen: boolean }>`
  position: fixed;
  bottom: 6rem;
  right: 1rem;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
  border: none;
  color: white;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 32px rgba(236, 72, 153, 0.4);
  z-index: 999;
  display: ${({ $isOpen }) => $isOpen ? 'none' : 'flex'};
  align-items: center;
  justify-content: center;
  animation: ${pulse} 3s ease-in-out infinite;
  
  /* Hide on mobile since sticky footer has chat button */
  @media (max-width: 767px) {
    display: none;
  }
  
  @media (min-width: 768px) {
    bottom: 2rem;
    width: 70px;
    height: 70px;
    display: ${({ $isOpen }) => $isOpen ? 'none' : 'flex'};
  }
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 12px 40px rgba(236, 72, 153, 0.6);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const DailyTracker: React.FC = () => {
  const { currentPlan, selectedDate, setSelectedDate, generateMealPlan, addMeal, removeMeal, isLoading } = useMealPlan();

  // Modal states
  const [selectedMeal, setSelectedMeal] = useState<any>(null);
  const [isMealDetailOpen, setIsMealDetailOpen] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snacks' | null>(null);
  const [selectedMealDate, setSelectedMealDate] = useState<string>('');

  // Chat states
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Helper to get date strings for carousel
  const getCarouselDates = () => {
    const currentDate = new Date(selectedDate);
    const prevDate = new Date(currentDate);
    prevDate.setDate(currentDate.getDate() - 1);
    const nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + 1);
    
    return {
      prev: prevDate.toISOString().split('T')[0],
      current: selectedDate,
      next: nextDate.toISOString().split('T')[0]
    };
  };

  const dates = getCarouselDates();

  // Get plan for specific date
  const getPlanForDate = (date: string) => {
    return currentPlan.find(plan => plan.date === date);
  };

  // Calculate totals for a date
  const calculateTotals = (date: string) => {
    const plan = getPlanForDate(date);
    if (!plan) return { calories: 0, protein: 0, carbs: 0, fat: 0 };

    let totals = { calories: 0, protein: 0, carbs: 0, fat: 0 };

    if (plan.breakfast) {
      totals.calories += plan.breakfast.calories;
      totals.protein += plan.breakfast.protein;
      totals.carbs += plan.breakfast.carbs;
      totals.fat += plan.breakfast.fat;
    }

    if (plan.lunch) {
      totals.calories += plan.lunch.calories;
      totals.protein += plan.lunch.protein;
      totals.carbs += plan.lunch.carbs;
      totals.fat += plan.lunch.fat;
    }

    if (plan.dinner) {
      totals.calories += plan.dinner.calories;
      totals.protein += plan.dinner.protein;
      totals.carbs += plan.dinner.carbs;
      totals.fat += plan.dinner.fat;
    }

    plan.snacks.forEach(snack => {
      totals.calories += snack.calories;
      totals.protein += snack.protein;
      totals.carbs += snack.carbs;
      totals.fat += snack.fat;
    });

    return totals;
  };

  // Current day totals for macro overview
  const dayTotals = calculateTotals(selectedDate);

  // Daily targets
  const targets = {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 65
  };

  // Calculate percentages
  const percentages = {
    calories: (dayTotals.calories / targets.calories) * 100,
    protein: (dayTotals.protein / targets.protein) * 100,
    carbs: (dayTotals.carbs / targets.carbs) * 100,
    fat: (dayTotals.fat / targets.fat) * 100
  };

  // Handle meal card clicks
  const handleMealClick = (meal: any, mealType: string, date: string) => {
    if (meal) {
      setSelectedMeal(meal);
      setSelectedMealType(mealType as 'breakfast' | 'lunch' | 'dinner' | 'snacks');
      setSelectedMealDate(date);
      setIsMealDetailOpen(true);
    } else {
      // If no meal exists, open meal modal in create mode
      setSelectedMeal(null);
      setSelectedMealType(mealType as 'breakfast' | 'lunch' | 'dinner' | 'snacks');
      setSelectedMealDate(date);
      setIsMealDetailOpen(true);
    }
  };

  const closeMealDetail = () => {
    setIsMealDetailOpen(false);
    setSelectedMeal(null);
    setSelectedMealType(null);
    setSelectedMealDate('');
  };

  const handleOpenChat = () => {
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  const handleGenerateMealForSlot = async (mealType: string, date: string) => {
    // Generate a new meal plan if none exists
    try {
      await generateMealPlan({
        dietaryRestrictions: [],
        calorieGoal: 2000,
        mealsPerDay: 4
      });
    } catch (error) {
      console.error('Failed to generate meal plan:', error);
    }
  };

  // Updated QuickAddButtons to include JME chat
  const updatedQuickAddButtons = (
    <QuickAddButtons>
      <QuickAddButton $variant="primary" onClick={handleOpenChat}>
        <Bot size={14} />
        Ask JME
      </QuickAddButton>
      <QuickAddButton $variant="secondary" onClick={handleOpenChat}>
        <Camera size={14} />
        Photo
      </QuickAddButton>
      <QuickAddButton $variant="secondary" onClick={handleOpenChat}>
        <Mic size={14} />
        Voice AI
      </QuickAddButton>
      <QuickAddButton $variant="secondary">
        <Plus size={14} />
        Add Manually
      </QuickAddButton>
    </QuickAddButtons>
  );

  // Render meal button with macro info
  const renderMealButton = (meal: any, mealType: string, date: string) => {
    const mealIcons = {
      breakfast: <Coffee size={14} />,
      lunch: <Sun size={14} />,
      dinner: <Moon size={14} />,
      snacks: <Plus size={12} />
    };

    const hasData = meal !== null && meal !== undefined;

    return (
      <MealButton 
        key={mealType}
        $hasData={hasData} 
        $mealType={mealType}
        onClick={() => handleMealClick(meal, mealType, date)}
      >
        <MealHeader>
          <MealIcon>{mealIcons[mealType as keyof typeof mealIcons]}</MealIcon>
          <MealName>{mealType}</MealName>
        </MealHeader>
        
        <MealContent $hasData={hasData}>
          {hasData ? (
            <>
              <MealTitle>{meal.name}</MealTitle>
              <MacroRow>
                <CaloriesMain>{meal.calories} cal</CaloriesMain>
                <MacroDetails>P:{meal.protein}g C:{meal.carbs}g F:{meal.fat}g</MacroDetails>
              </MacroRow>
            </>
          ) : (
            <>
              <MealTitle>Add {mealType}</MealTitle>
              <MacroRow>
                <span style={{ opacity: 0.6 }}>Tap to add</span>
              </MacroRow>
            </>
          )}
        </MealContent>
      </MealButton>
    );
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const dateStr = date.toISOString().split('T')[0];
    const todayStr = today.toISOString().split('T')[0];
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (dateStr === todayStr) return 'Today';
    if (dateStr === tomorrowStr) return 'Tomorrow';
    if (dateStr === yesterdayStr) return 'Yesterday';

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatDayName = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  return (
    <PageContainer>
      <Header>
        <Title>Daily Tracker</Title>
        <Subtitle>Track your nutrition across the week</Subtitle>
      </Header>

      <DayCarousel>
        <DayScrollContainer>
          {[dates.prev, dates.current, dates.next].map((date) => {
            const isCurrent = date === selectedDate;
            const plan = getPlanForDate(date);
            const totals = calculateTotals(date);

            return (
              <DayCard key={date} $isCurrent={isCurrent} onClick={() => setSelectedDate(date)}>
                <DayHeader>
                  <DayInfo>
                    <DayDate $isCurrent={isCurrent}>{formatDate(date)}</DayDate>
                    <DayName>{formatDayName(date)}</DayName>
                  </DayInfo>
                  <DayTotals>
                    <TotalCalories $isCurrent={isCurrent}>{totals.calories}</TotalCalories>
                    <TotalLabel>calories</TotalLabel>
                  </DayTotals>
                </DayHeader>

                <MealGrid>
                  {renderMealButton(plan?.breakfast, 'breakfast', date)}
                  {renderMealButton(plan?.lunch, 'lunch', date)}
                  {renderMealButton(plan?.dinner, 'dinner', date)}
                  {plan?.snacks && plan.snacks.length > 0 && renderMealButton(plan.snacks[0], 'snacks', date)}
                </MealGrid>
              </DayCard>
            );
          })}
        </DayScrollContainer>
      </DayCarousel>

      <MacroOverview>
        <MacroGrid>
          <MacroCard $color="#22c55e" $percentage={percentages.calories}>
            <MacroHeader>
              <MacroName>Calories</MacroName>
              <MacroIcon $color="#22c55e">
                <Activity size={14} />
              </MacroIcon>
            </MacroHeader>
            <MacroProgress>
              <MacroValues>
                <CurrentValue>{Math.round(dayTotals.calories)}</CurrentValue>
                <TargetValue>/ {targets.calories}</TargetValue>
              </MacroValues>
              <ProgressBar>
                <ProgressFill $width={percentages.calories} $color="#22c55e" />
              </ProgressBar>
              <ProgressText $isOver={percentages.calories > 100}>
                {percentages.calories > 100 ? 'Over target' : `${Math.round(100 - percentages.calories)}% left`}
              </ProgressText>
            </MacroProgress>
          </MacroCard>

          <MacroCard $color="#3b82f6" $percentage={percentages.protein}>
            <MacroHeader>
              <MacroName>Protein</MacroName>
              <MacroIcon $color="#3b82f6">
                <TrendingUp size={14} />
              </MacroIcon>
            </MacroHeader>
            <MacroProgress>
              <MacroValues>
                <CurrentValue>{Math.round(dayTotals.protein)}g</CurrentValue>
                <TargetValue>/ {targets.protein}g</TargetValue>
              </MacroValues>
              <ProgressBar>
                <ProgressFill $width={percentages.protein} $color="#3b82f6" />
              </ProgressBar>
              <ProgressText $isOver={percentages.protein > 100}>
                {percentages.protein > 100 ? 'Goal hit!' : `${Math.round(targets.protein - dayTotals.protein)}g to go`}
              </ProgressText>
            </MacroProgress>
          </MacroCard>

          <MacroCard $color="#f59e0b" $percentage={percentages.carbs}>
            <MacroHeader>
              <MacroName>Carbs</MacroName>
              <MacroIcon $color="#f59e0b">
                <BarChart3 size={14} />
              </MacroIcon>
            </MacroHeader>
            <MacroProgress>
              <MacroValues>
                <CurrentValue>{Math.round(dayTotals.carbs)}g</CurrentValue>
                <TargetValue>/ {targets.carbs}g</TargetValue>
              </MacroValues>
              <ProgressBar>
                <ProgressFill $width={percentages.carbs} $color="#f59e0b" />
              </ProgressBar>
              <ProgressText $isOver={percentages.carbs > 100}>
                {percentages.carbs > 100 ? 'Goal hit!' : `${Math.round(targets.carbs - dayTotals.carbs)}g to go`}
              </ProgressText>
            </MacroProgress>
          </MacroCard>

          <MacroCard $color="#ec4899" $percentage={percentages.fat}>
            <MacroHeader>
              <MacroName>Fat</MacroName>
              <MacroIcon $color="#ec4899">
                <Target size={14} />
              </MacroIcon>
            </MacroHeader>
            <MacroProgress>
              <MacroValues>
                <CurrentValue>{Math.round(dayTotals.fat)}g</CurrentValue>
                <TargetValue>/ {targets.fat}g</TargetValue>
              </MacroValues>
              <ProgressBar>
                <ProgressFill $width={percentages.fat} $color="#ec4899" />
              </ProgressBar>
              <ProgressText $isOver={percentages.fat > 100}>
                {percentages.fat > 100 ? 'Goal hit!' : `${Math.round(targets.fat - dayTotals.fat)}g to go`}
              </ProgressText>
            </MacroProgress>
          </MacroCard>
        </MacroGrid>
      </MacroOverview>

      <QuickAddSection>
        <QuickAddTitle>Log Your Food with JME</QuickAddTitle>
        {updatedQuickAddButtons}
      </QuickAddSection>

      {/* Floating Chat Button */}
      <FloatingChatButton $isOpen={isChatOpen} onClick={handleOpenChat}>
        <MessageCircle size={24} />
      </FloatingChatButton>

      {/* Meal Modal */}
      {isMealDetailOpen && selectedMealType && selectedMealDate && (
        <UnifiedMealModal
          isOpen={isMealDetailOpen}
          onClose={closeMealDetail}
          meal={selectedMeal}
          mealType={selectedMealType}
          date={selectedMealDate}
          onOpenChat={handleOpenChat}
        />
      )}

      {/* Chat Modal */}
      <ChatMobile 
        isOpen={isChatOpen}
        onClose={handleCloseChat}
      />
    </PageContainer>
  );
};

export default DailyTracker; 