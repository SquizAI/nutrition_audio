import React, { useState, useMemo, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useMealPlan } from '../services/mealPlanContext';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays, subDays, addWeeks, subWeeks, isSameDay } from 'date-fns';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar,
  Coffee,
  Salad,
  UtensilsCrossed,
  Apple,
  Plus,
  RefreshCw,
  Sparkles,
  Clock,
  ShoppingCart,
  List,
  MessageCircle,
  Bot,
  CalendarDays
} from 'lucide-react';
import GroceryList from '../components/GroceryList';
import UnifiedMealModal from '../components/UnifiedMealModal';
import ChatMobile from '../components/ChatMobile';

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
  overflow-x: hidden;
  
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
    margin-bottom: 1.5rem;
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
`;

// COMPACT CONTROL BAR
const ControlBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 1;
  animation: ${slideInUp} 0.6s ease-out 0.1s both;
  
  @media (min-width: 768px) {
    padding: 1rem 1.5rem;
    margin-bottom: 1.5rem;
  }
`;

const ViewToggle = styled.div`
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 0.25rem;
`;

const ViewButton = styled.button<{ $active: boolean }>`
  padding: 0.5rem 0.75rem;
  border: none;
  background: ${({ $active }) => 
    $active 
      ? 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)' 
      : 'transparent'};
  color: white;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  @media (min-width: 768px) {
    padding: 0.6rem 1rem;
    font-size: 0.8rem;
  }
  
  &:hover {
    background: ${({ $active }) => 
      $active 
        ? 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)'
        : 'rgba(255, 255, 255, 0.1)'};
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  
  @media (min-width: 768px) {
    gap: 0.75rem;
  }
`;

const ActionButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  background: ${({ $variant }) => 
    $variant === 'primary' 
      ? 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)'
      : 'rgba(255, 255, 255, 0.1)'};
  color: white;
  
  @media (min-width: 768px) {
    padding: 0.6rem 1rem;
    font-size: 0.8rem;
  }
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
  }
`;

// ENHANCED WEEK CAROUSEL
const WeekCarousel = styled.div`
  margin-bottom: 1rem;
  position: relative;
  z-index: 1;
  animation: ${slideInUp} 0.6s ease-out 0.2s both;
  
  @media (min-width: 768px) {
    margin-bottom: 1.5rem;
  }
`;

const WeekHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0 0.5rem;
`;

const WeekTitle = styled.h2`
  color: white;
  font-size: 1.1rem;
  font-weight: 800;
  margin: 0;
  
  @media (min-width: 768px) {
    font-size: 1.3rem;
  }
`;

const WeekNavButton = styled.button`
  background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
  border: none;
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (min-width: 768px) {
    width: 40px;
    height: 40px;
  }
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(236, 72, 153, 0.4);
  }
`;

const WeekScrollContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 0.5rem 0 1rem 0;
  scroll-snap-type: x mandatory;
  
  /* Hide scrollbar but keep functionality */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  
  /* Enhanced touch scrolling */
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-x: contain;
  
  @media (min-width: 768px) {
    gap: 0.75rem;
    padding: 1rem 0;
  }
  
  @media (min-width: 1024px) {
    gap: 1rem;
  }
`;

const DayCard = styled.div<{ $isSelected: boolean; $isToday: boolean }>`
  min-width: calc(33.333vw - 1rem);
  max-width: 240px;
  flex-shrink: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 0.75rem;
  border: 1px solid ${({ $isSelected, $isToday }) => 
    $isSelected ? '#ec4899' : $isToday ? '#8b5cf6' : 'rgba(255, 255, 255, 0.1)'};
  scroll-snap-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  min-height: 180px;
  
  @media (min-width: 480px) {
    min-width: calc(33.333vw - 1.5rem);
    max-width: 280px;
    padding: 1rem;
    min-height: 200px;
  }
  
  @media (min-width: 768px) {
    min-width: 320px;
    max-width: 360px;
    padding: 1.25rem;
    min-height: 220px;
  }
  
  @media (min-width: 1024px) {
    min-width: 360px;
    max-width: 400px;
    padding: 1.5rem;
    min-height: 250px;
  }
  
  ${({ $isSelected }) => $isSelected && `
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
  
  &:hover {
    transform: ${({ $isSelected }) => $isSelected ? 'scale(1.02)' : 'scale(1.01)'};
    box-shadow: 0 8px 24px rgba(236, 72, 153, 0.15);
  }
`;

const DayHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const DayInfo = styled.div`
  flex: 1;
`;

const DayName = styled.h3`
  color: white;
  font-size: 1rem;
  font-weight: 800;
  margin: 0 0 0.25rem 0;
  
  @media (min-width: 768px) {
    font-size: 1.1rem;
  }
`;

const DayDate = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.75rem;
  margin: 0;
  
  @media (min-width: 768px) {
    font-size: 0.8rem;
  }
`;

const DayTotalCalories = styled.div`
  text-align: right;
  
  span {
    color: white;
    font-size: 1.2rem;
    font-weight: 900;
    display: block;
    
    @media (min-width: 768px) {
      font-size: 1.4rem;
    }
  }
  
  small {
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.6rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    
    @media (min-width: 768px) {
      font-size: 0.7rem;
    }
  }
`;

const MealSlots = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  
  @media (min-width: 768px) {
    gap: 0.75rem;
  }
`;

const MealSlot = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 60px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  
  @media (min-width: 768px) {
    padding: 0.75rem;
    min-height: 70px;
  }
  
  &:hover {
    background: rgba(236, 72, 153, 0.1);
    border-color: rgba(236, 72, 153, 0.3);
    transform: translateY(-1px);
  }
`;

const MealType = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.4rem;
  
  span {
    font-size: 0.65rem;
    color: rgba(255, 255, 255, 0.6);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    
    @media (min-width: 768px) {
      font-size: 0.7rem;
    }
  }
`;

const MealContent = styled.div`
  h4 {
    color: white;
    font-size: 0.75rem;
    font-weight: 600;
    margin: 0 0 0.2rem 0;
    line-height: 1.2;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    
    @media (min-width: 768px) {
      font-size: 0.8rem;
    }
  }
  
  p {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.65rem;
    margin: 0;
    
    @media (min-width: 768px) {
      font-size: 0.7rem;
    }
  }
`;

const EmptySlot = styled.div`
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.65rem;
  font-style: italic;
  text-align: center;
  padding: 0.5rem;
  border: 1px dashed rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  
  @media (min-width: 768px) {
    font-size: 0.7rem;
  }
`;

// IMPROVED REGENERATE SECTION
const RegenerateSection = styled.div`
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  animation: ${slideInUp} 0.6s ease-out 0.3s both;
  
  @media (min-width: 768px) {
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }
`;

const RegenerateButton = styled.button`
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  border: none;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  
  @media (min-width: 768px) {
    padding: 1rem 2rem;
    font-size: 1rem;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(34, 197, 94, 0.4);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
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
  animation: pulse 3s ease-in-out infinite;
  
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

// DAY VIEW COMPONENTS
const DayViewContainer = styled.div`
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: ${slideInUp} 0.6s ease-out 0.2s both;
  
  @media (min-width: 768px) {
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }
`;

const DayViewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const DayNavigationButton = styled.button`
  background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
  border: none;
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (min-width: 768px) {
    width: 40px;
    height: 40px;
  }
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(236, 72, 153, 0.4);
  }
`;

const DayViewTitle = styled.div`
  text-align: center;
  
  h2 {
    color: white;
    font-size: 1.1rem;
    font-weight: 800;
    margin: 0 0 0.25rem 0;
    
    @media (min-width: 768px) {
      font-size: 1.3rem;
    }
  }
  
  p {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.75rem;
    margin: 0;
    
    @media (min-width: 768px) {
      font-size: 0.8rem;
    }
  }
`;

const DayMealsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  
  @media (min-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
  }
`;

const DayMealCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  
  @media (min-width: 768px) {
    padding: 1.25rem;
    min-height: 140px;
  }
  
  &:hover {
    background: rgba(236, 72, 153, 0.1);
    border-color: rgba(236, 72, 153, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(236, 72, 153, 0.2);
  }
`;

const DayMealType = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  
  span {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.6);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    
    @media (min-width: 768px) {
      font-size: 0.8rem;
    }
  }
`;

const DayMealInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  
  h4 {
    color: white;
    font-size: 0.9rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
    line-height: 1.3;
    
    @media (min-width: 768px) {
      font-size: 1rem;
    }
  }
  
  p {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.75rem;
    margin: 0 0 0.5rem 0;
    
    @media (min-width: 768px) {
      font-size: 0.8rem;
    }
  }
  
  .calories {
    color: white;
    font-size: 0.8rem;
    font-weight: 700;
    
    @media (min-width: 768px) {
      font-size: 0.9rem;
    }
  }
  
  .macros {
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.65rem;
    margin-top: 0.25rem;
    
    @media (min-width: 768px) {
      font-size: 0.7rem;
    }
  }
`;

const AddMealButton = styled.button`
  background: rgba(236, 72, 153, 0.1);
  border: 1px dashed rgba(236, 72, 153, 0.3);
  border-radius: 8px;
  color: rgba(236, 72, 153, 0.8);
  padding: 0.75rem;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: auto;
  
  &:hover {
    background: rgba(236, 72, 153, 0.2);
    border-color: rgba(236, 72, 153, 0.5);
    color: rgba(236, 72, 153, 1);
  }
`;

type ViewType = 'day' | 'week';

const MealPlanner: React.FC = () => {
  const { currentPlan, selectedDate, setSelectedDate, generateMealPlan, isLoading } = useMealPlan();
  const [view, setView] = useState<ViewType>('week');
  const [currentWeek, setCurrentWeek] = useState(new Date());
  
  // Modal states
  const [selectedMeal, setSelectedMeal] = useState<any>(null);
  const [isMealDetailOpen, setIsMealDetailOpen] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snacks' | null>(null);
  const [selectedMealDate, setSelectedMealDate] = useState<string>('');
  const [isGroceryListOpen, setIsGroceryListOpen] = useState(false);

  // Chat states
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Generate initial meal plan when component loads if none exists
  useEffect(() => {
    if (currentPlan.length === 0 && !isLoading) {
      handleGenerateMealPlan();
    }
  }, []);

  const handleGenerateMealPlan = async () => {
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

  // Calculate week range with smooth navigation
  const getWeekDays = (weekStart: Date) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const currentWeekStart = useMemo(() => {
    const start = startOfWeek(currentWeek);
    return start;
  }, [currentWeek]);

  const weekDays = getWeekDays(currentWeekStart);

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newWeek);
  };

  const navigateDay = (direction: 'prev' | 'next') => {
    const currentDate = new Date(selectedDate);
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    setSelectedDate(newDate.toISOString().split('T')[0]);
  };

  const formatWeekRange = () => {
    const endDate = new Date(currentWeekStart);
    endDate.setDate(currentWeekStart.getDate() + 6);
    
    return `${currentWeekStart.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })} - ${endDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })}`;
  };

  const formatDayTitle = () => {
    const date = new Date(selectedDate);
    return {
      dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
      fullDate: date.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      shortDate: date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      })
    };
  };

  const getDayPlan = (date: string) => {
    return currentPlan.find(plan => plan.date === date);
  };

  const getMealsForDay = (date: Date) => {
    const dayKey = date.toISOString().split('T')[0];
    const dayPlan = getDayPlan(dayKey);
    
    if (!dayPlan) {
      return {
        breakfast: null,
        lunch: null,
        dinner: null,
        snacks: null
      };
    }

    return {
      breakfast: dayPlan.breakfast,
      lunch: dayPlan.lunch,
      dinner: dayPlan.dinner,
      snacks: dayPlan.snacks && dayPlan.snacks.length > 0 ? dayPlan.snacks[0] : null
    };
  };

  const calculateDayCalories = (date: Date) => {
    const meals = getMealsForDay(date);
    let total = 0;
    if (meals.breakfast) total += meals.breakfast.calories;
    if (meals.lunch) total += meals.lunch.calories;
    if (meals.dinner) total += meals.dinner.calories;
    if (meals.snacks) total += meals.snacks.calories;
    return total;
  };

  const handleMealClick = (meal: any, mealType?: string, date?: string) => {
    if (meal) {
      setSelectedMeal(meal);
      setSelectedMealType(mealType as 'breakfast' | 'lunch' | 'dinner' | 'snacks' || 'breakfast');
      setSelectedMealDate(date || selectedDate);
      setIsMealDetailOpen(true);
    } else {
      setSelectedMeal(null);
      setSelectedMealType(mealType as 'breakfast' | 'lunch' | 'dinner' | 'snacks' || 'breakfast');
      setSelectedMealDate(date || selectedDate);
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

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return selectedDate === date.toISOString().split('T')[0];
  };

  return (
    <PageContainer>
      <Header>
        <Title>Meal Planner</Title>
        <Subtitle>Plan your weekly nutrition with smart meal suggestions</Subtitle>
      </Header>

      <ControlBar>
        <ViewToggle>
          <ViewButton $active={view === 'week'} onClick={() => setView('week')}>
            Week
          </ViewButton>
          <ViewButton $active={view === 'day'} onClick={() => setView('day')}>
            Day
          </ViewButton>
        </ViewToggle>
        
        <ActionButtons>
          <ActionButton onClick={() => setIsGroceryListOpen(true)}>
            <ShoppingCart size={14} />
            Grocery
          </ActionButton>
          <ActionButton $variant="primary" onClick={handleOpenChat}>
            <Bot size={14} />
            Ask JME
          </ActionButton>
        </ActionButtons>
      </ControlBar>

      {view === 'week' && (
        <>
          <WeekCarousel>
            <WeekHeader>
              <WeekNavButton onClick={() => navigateWeek('prev')}>
                <ChevronLeft size={18} />
              </WeekNavButton>
              <WeekTitle>{formatWeekRange()}</WeekTitle>
              <WeekNavButton onClick={() => navigateWeek('next')}>
                <ChevronRight size={18} />
              </WeekNavButton>
            </WeekHeader>

            <WeekScrollContainer>
              {weekDays.map((date) => {
                const dayKey = date.toISOString().split('T')[0];
                const meals = getMealsForDay(date);
                const totalCalories = calculateDayCalories(date);

                return (
                  <DayCard
                    key={dayKey}
                    $isSelected={isSelected(date)}
                    $isToday={isToday(date)}
                    onClick={() => setSelectedDate(dayKey)}
                  >
                    <DayHeader>
                      <DayInfo>
                        <DayName>{date.toLocaleDateString('en-US', { weekday: 'long' })}</DayName>
                        <DayDate>{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</DayDate>
                      </DayInfo>
                      <DayTotalCalories>
                        <span>{totalCalories}</span>
                        <small>calories</small>
                      </DayTotalCalories>
                    </DayHeader>

                    <MealSlots>
                      <MealSlot onClick={(e) => {
                        e.stopPropagation();
                        handleMealClick(meals.breakfast, 'breakfast', dayKey);
                      }}>
                        <MealType>
                          <Coffee size={12} />
                          <span>Breakfast</span>
                        </MealType>
                        <MealContent>
                          {meals.breakfast ? (
                            <>
                              <h4>{meals.breakfast.name}</h4>
                              <p>{meals.breakfast.calories} cal</p>
                            </>
                          ) : (
                            <EmptySlot>Add meal</EmptySlot>
                          )}
                        </MealContent>
                      </MealSlot>

                      <MealSlot onClick={(e) => {
                        e.stopPropagation();
                        handleMealClick(meals.lunch, 'lunch', dayKey);
                      }}>
                        <MealType>
                          <Salad size={12} />
                          <span>Lunch</span>
                        </MealType>
                        <MealContent>
                          {meals.lunch ? (
                            <>
                              <h4>{meals.lunch.name}</h4>
                              <p>{meals.lunch.calories} cal</p>
                            </>
                          ) : (
                            <EmptySlot>Add meal</EmptySlot>
                          )}
                        </MealContent>
                      </MealSlot>

                      <MealSlot onClick={(e) => {
                        e.stopPropagation();
                        handleMealClick(meals.dinner, 'dinner', dayKey);
                      }}>
                        <MealType>
                          <UtensilsCrossed size={12} />
                          <span>Dinner</span>
                        </MealType>
                        <MealContent>
                          {meals.dinner ? (
                            <>
                              <h4>{meals.dinner.name}</h4>
                              <p>{meals.dinner.calories} cal</p>
                            </>
                          ) : (
                            <EmptySlot>Add meal</EmptySlot>
                          )}
                        </MealContent>
                      </MealSlot>

                      <MealSlot onClick={(e) => {
                        e.stopPropagation();
                        handleMealClick(meals.snacks, 'snacks', dayKey);
                      }}>
                        <MealType>
                          <Apple size={12} />
                          <span>Snacks</span>
                        </MealType>
                        <MealContent>
                          {meals.snacks ? (
                            <>
                              <h4>{meals.snacks.name}</h4>
                              <p>{meals.snacks.calories} cal</p>
                            </>
                          ) : (
                            <EmptySlot>Add snack</EmptySlot>
                          )}
                        </MealContent>
                      </MealSlot>
                    </MealSlots>
                  </DayCard>
                );
              })}
            </WeekScrollContainer>
          </WeekCarousel>

          <RegenerateSection>
            <RegenerateButton onClick={handleGenerateMealPlan} disabled={isLoading}>
              {isLoading ? (
                <>
                  <LoadingSpinner />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw size={16} />
                  Regenerate Week
                </>
              )}
            </RegenerateButton>
          </RegenerateSection>
        </>
      )}

      {view === 'day' && (
        <>
          <DayViewContainer>
            <DayViewHeader>
              <DayNavigationButton onClick={() => navigateDay('prev')}>
                <ChevronLeft size={18} />
              </DayNavigationButton>
              <DayViewTitle>
                <h2>{formatDayTitle().dayName}</h2>
                <p>{formatDayTitle().shortDate}</p>
              </DayViewTitle>
              <DayNavigationButton onClick={() => navigateDay('next')}>
                <ChevronRight size={18} />
              </DayNavigationButton>
            </DayViewHeader>

            <DayMealsGrid>
              {/* Breakfast */}
              <DayMealCard onClick={() => {
                const dayPlan = getDayPlan(selectedDate);
                handleMealClick(dayPlan?.breakfast || null, 'breakfast', selectedDate);
              }}>
                <DayMealType>
                  <Coffee size={16} />
                  <span>Breakfast</span>
                </DayMealType>
                <DayMealInfo>
                  {(() => {
                    const dayPlan = getDayPlan(selectedDate);
                    const meal = dayPlan?.breakfast;
                    return meal ? (
                      <>
                        <h4>{meal.name}</h4>
                        <p>{meal.ingredients?.slice(0, 2).join(', ')}{meal.ingredients?.length > 2 ? '...' : ''}</p>
                        <div className="calories">{meal.calories} calories</div>
                        <div className="macros">
                          P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fat}g
                        </div>
                      </>
                    ) : (
                      <AddMealButton onClick={(e) => {
                        e.stopPropagation();
                        handleMealClick(null, 'breakfast', selectedDate);
                      }}>
                        <Plus size={16} />
                        Add Breakfast
                      </AddMealButton>
                    );
                  })()}
                </DayMealInfo>
              </DayMealCard>

              {/* Lunch */}
              <DayMealCard onClick={() => {
                const dayPlan = getDayPlan(selectedDate);
                handleMealClick(dayPlan?.lunch || null, 'lunch', selectedDate);
              }}>
                <DayMealType>
                  <Salad size={16} />
                  <span>Lunch</span>
                </DayMealType>
                <DayMealInfo>
                  {(() => {
                    const dayPlan = getDayPlan(selectedDate);
                    const meal = dayPlan?.lunch;
                    return meal ? (
                      <>
                        <h4>{meal.name}</h4>
                        <p>{meal.ingredients?.slice(0, 2).join(', ')}{meal.ingredients?.length > 2 ? '...' : ''}</p>
                        <div className="calories">{meal.calories} calories</div>
                        <div className="macros">
                          P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fat}g
                        </div>
                      </>
                    ) : (
                      <AddMealButton onClick={(e) => {
                        e.stopPropagation();
                        handleMealClick(null, 'lunch', selectedDate);
                      }}>
                        <Plus size={16} />
                        Add Lunch
                      </AddMealButton>
                    );
                  })()}
                </DayMealInfo>
              </DayMealCard>

              {/* Dinner */}
              <DayMealCard onClick={() => {
                const dayPlan = getDayPlan(selectedDate);
                handleMealClick(dayPlan?.dinner || null, 'dinner', selectedDate);
              }}>
                <DayMealType>
                  <UtensilsCrossed size={16} />
                  <span>Dinner</span>
                </DayMealType>
                <DayMealInfo>
                  {(() => {
                    const dayPlan = getDayPlan(selectedDate);
                    const meal = dayPlan?.dinner;
                    return meal ? (
                      <>
                        <h4>{meal.name}</h4>
                        <p>{meal.ingredients?.slice(0, 2).join(', ')}{meal.ingredients?.length > 2 ? '...' : ''}</p>
                        <div className="calories">{meal.calories} calories</div>
                        <div className="macros">
                          P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fat}g
                        </div>
                      </>
                    ) : (
                      <AddMealButton onClick={(e) => {
                        e.stopPropagation();
                        handleMealClick(null, 'dinner', selectedDate);
                      }}>
                        <Plus size={16} />
                        Add Dinner
                      </AddMealButton>
                    );
                  })()}
                </DayMealInfo>
              </DayMealCard>

              {/* Snacks */}
              <DayMealCard onClick={() => {
                const dayPlan = getDayPlan(selectedDate);
                const meal = dayPlan?.snacks && dayPlan.snacks.length > 0 ? dayPlan.snacks[0] : null;
                handleMealClick(meal, 'snacks', selectedDate);
              }}>
                <DayMealType>
                  <Apple size={16} />
                  <span>Snacks</span>
                </DayMealType>
                <DayMealInfo>
                  {(() => {
                    const dayPlan = getDayPlan(selectedDate);
                    const meal = dayPlan?.snacks && dayPlan.snacks.length > 0 ? dayPlan.snacks[0] : null;
                    return meal ? (
                      <>
                        <h4>{meal.name}</h4>
                        <p>{meal.ingredients?.slice(0, 2).join(', ')}{meal.ingredients?.length > 2 ? '...' : ''}</p>
                        <div className="calories">{meal.calories} calories</div>
                        <div className="macros">
                          P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fat}g
                        </div>
                      </>
                    ) : (
                      <AddMealButton onClick={(e) => {
                        e.stopPropagation();
                        handleMealClick(null, 'snacks', selectedDate);
                      }}>
                        <Plus size={16} />
                        Add Snacks
                      </AddMealButton>
                    );
                  })()}
                </DayMealInfo>
              </DayMealCard>
            </DayMealsGrid>
          </DayViewContainer>

          <RegenerateSection>
            <RegenerateButton onClick={handleGenerateMealPlan} disabled={isLoading}>
              {isLoading ? (
                <>
                  <LoadingSpinner />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw size={16} />
                  Regenerate Day
                </>
              )}
            </RegenerateButton>
          </RegenerateSection>
        </>
      )}

      {/* Floating Chat Button */}
      <FloatingChatButton $isOpen={isChatOpen} onClick={handleOpenChat}>
        <MessageCircle size={24} />
      </FloatingChatButton>

      {/* Modals */}
      {isMealDetailOpen && selectedMealType && selectedMealDate && (
        <UnifiedMealModal 
          meal={selectedMeal}
          mealType={selectedMealType}
          date={selectedMealDate}
          isOpen={isMealDetailOpen}
          onClose={closeMealDetail}
          onOpenChat={handleOpenChat}
        />
      )}
      
      <GroceryList 
        isOpen={isGroceryListOpen}
        onClose={() => setIsGroceryListOpen(false)}
      />

      {/* Chat Modal */}
      <ChatMobile 
        isOpen={isChatOpen}
        onClose={handleCloseChat}
      />
    </PageContainer>
  );
};

export default MealPlanner;
