import React, { useState, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { useMealPlan } from '../services/mealPlanContext';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, addDays, subDays, addWeeks, subWeeks, addMonths, subMonths, isSameDay, parseISO } from 'date-fns';

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

// Types for meal data
interface Meal {
  id: string;
  name: string;
  image: string;
  prepTime: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  instructions: string[];
}

interface DayMeals {
  date: string;
  breakfast: Meal[];
  lunch: Meal[];
  dinner: Meal[];
  snacks: Meal[];
}

const PageContainer = styled.div`
  padding: 1rem;
  padding-bottom: 6rem; /* Space for mobile footer */
  max-width: 1600px;
  margin: 0 auto;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a0b2e 25%, #16213e 50%, #0f3460 75%, #533a7b 100%);
  min-height: 100vh;
  position: relative;
  
  @media (min-width: 768px) {
    padding: 3rem 2rem;
    padding-bottom: 3rem;
  }
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(236, 72, 153, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(59, 130, 246, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
  
  @media (min-width: 768px) {
    margin-bottom: 4rem;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.75rem;
  text-shadow: 0 4px 8px rgba(0,0,0,0.3);
  letter-spacing: -0.02em;
  
  @media (min-width: 768px) {
    font-size: 4rem;
    margin-bottom: 1.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  max-width: 500px;
  margin: 0 auto;
  line-height: 1.6;
  font-weight: 400;
  padding: 0 1rem;
  
  @media (min-width: 768px) {
    font-size: 1.4rem;
    max-width: 700px;
    line-height: 1.7;
    padding: 0;
  }
`;

const ViewControls = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
  padding: 0 1rem;
  
  @media (min-width: 768px) {
    margin-bottom: 3rem;
    padding: 0;
  }
`;

const ViewButton = styled.button<{ $active: boolean }>`
  padding: 0.75rem 1.5rem;
  border: none;
  background: ${({ $active }) => 
    $active 
      ? 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)' 
      : 'rgba(255, 255, 255, 0.1)'};
  color: white;
  border-radius: 50px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  margin: 0 0.5rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${({ $active }) => 
    $active 
      ? '0 8px 32px rgba(236, 72, 153, 0.4)' 
      : '0 4px 16px rgba(0, 0, 0, 0.2)'};
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  @media (min-width: 768px) {
    padding: 1.2rem 2.5rem;
    font-size: 1rem;
    margin: 0 0.75rem;
  }
  
  &:hover {
    transform: translateY(-2px);
    background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
    box-shadow: 0 12px 40px rgba(236, 72, 153, 0.5);
  }
`;

const NavigationBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.8);
  padding: 1rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  margin-bottom: 2rem;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 1;
  
  @media (min-width: 768px) {
    padding: 2rem 2.5rem;
    border-radius: 24px;
    margin-bottom: 3rem;
  }
`;

const NavButton = styled.button`
  background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
  border: none;
  color: white;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(236, 72, 153, 0.4);
  
  @media (min-width: 768px) {
    width: 56px;
    height: 56px;
    font-size: 1.4rem;
    box-shadow: 0 6px 20px rgba(236, 72, 153, 0.4);
  }
  
  &:hover {
    transform: scale(1.1) rotate(5deg);
    box-shadow: 0 8px 24px rgba(236, 72, 153, 0.6);
  }
  
  &:active {
    transform: scale(0.95) rotate(5deg);
  }
`;

const DateDisplay = styled.h2`
  font-size: 1.2rem;
  font-weight: 800;
  color: white;
  margin: 0;
  text-align: center;
  letter-spacing: -0.01em;
  
  @media (min-width: 768px) {
    font-size: 2rem;
  }
`;

const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  position: relative;
  z-index: 1;
  
  @media (min-width: 1200px) {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 3rem;
  }
`;

const MainContent = styled.div`
  position: relative;
  order: 2;
  
  @media (min-width: 1200px) {
    order: 1;
  }
`;

const SidebarContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  order: 1;
  
  @media (min-width: 768px) {
    flex-direction: row;
  }
  
  @media (min-width: 1200px) {
    flex-direction: column;
    gap: 2rem;
    order: 2;
  }
`;

// Week View Components
const WeekContainer = styled.div`
  background: rgba(0, 0, 0, 0.8);
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow-x: auto;
  
  @media (min-width: 768px) {
    border-radius: 24px;
    padding: 3rem;
  }
`;

const WeekTable = styled.div`
  display: grid;
  grid-template-columns: 100px repeat(7, 1fr);
  gap: 0.5rem;
  min-width: 800px;
  
  @media (min-width: 768px) {
    grid-template-columns: 120px repeat(7, 1fr);
    gap: 1rem;
    min-width: 1000px;
  }
  
  @media (min-width: 1400px) {
    min-width: 1200px;
  }
`;

const TimeSlotHeader = styled.div`
  display: flex;
  align-items: center;
  font-weight: 700;
  color: white;
  font-size: 0.8rem;
  padding: 0.75rem 0;
  border-bottom: 2px solid rgba(236, 72, 153, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  @media (min-width: 768px) {
    font-size: 1rem;
    padding: 1rem 0;
  }
`;

const DayHeader = styled.div<{ $isToday: boolean }>`
  text-align: center;
  padding: 1rem 0.5rem;
  border-bottom: 2px solid rgba(236, 72, 153, 0.3);
  position: relative;
  
  @media (min-width: 768px) {
    padding: 1.5rem 1rem;
  }
  
  &:before {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 3px;
    background: ${({ $isToday }) => 
      $isToday ? 'linear-gradient(90deg, #ec4899 0%, #8b5cf6 100%)' : 'transparent'};
  }
`;

const DayNumber = styled.div`
  font-size: 1.4rem;
  font-weight: 800;
  color: white;
  margin-bottom: 0.25rem;
  
  @media (min-width: 768px) {
    font-size: 1.8rem;
  }
`;

const DayName = styled.div`
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
  
  @media (min-width: 768px) {
    font-size: 0.8rem;
  }
`;

const MealSlot = styled.div`
  padding: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  @media (min-width: 768px) {
    padding: 1rem;
  }
  
  &:hover {
    background: rgba(236, 72, 153, 0.05);
  }
`;

const MealItem = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  cursor: pointer;
  
  @media (min-width: 768px) {
    padding: 1.5rem;
    border-radius: 16px;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(236, 72, 153, 0.3);
    border-color: #ec4899;
    background: rgba(236, 72, 153, 0.1);
  }
`;

const MealHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
  
  @media (min-width: 768px) {
    margin-bottom: 0.75rem;
  }
`;

const MealName = styled.div`
  font-weight: 700;
  color: white;
  font-size: 0.85rem;
  line-height: 1.3;
  
  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

const MealActions = styled.div`
  display: flex;
  gap: 0.25rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  @media (min-width: 768px) {
    gap: 0.5rem;
  }
  
  ${MealItem}:hover & {
    opacity: 1;
  }
`;

const ActionIcon = styled.button<{ $variant?: 'refresh' | 'info' }>`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: ${({ $variant }) => 
    $variant === 'refresh' ? 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)' : 'rgba(255, 255, 255, 0.1)'};
  color: ${({ $variant }) => $variant === 'refresh' ? 'white' : 'rgba(255, 255, 255, 0.7)'};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.8rem;
  
  @media (min-width: 768px) {
    width: 32px;
    height: 32px;
    font-size: 0.9rem;
  }
  
  &:hover {
    transform: scale(1.1) rotate(${({ $variant }) => $variant === 'refresh' ? '180deg' : '0'});
    box-shadow: 0 4px 12px rgba(236, 72, 153, 0.4);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const MealWeekDescription = styled.div`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.3;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  
  @media (min-width: 768px) {
    font-size: 0.85rem;
    margin-bottom: 0.75rem;
    -webkit-line-clamp: 3;
  }
`;

const MealNutrition = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  
  @media (min-width: 768px) {
    gap: 0.75rem;
  }
`;

const NutritionBadge = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.6rem;
  font-weight: 600;
  color: ${({ $color }) => $color};
  
  @media (min-width: 768px) {
    font-size: 0.7rem;
  }
  
  &:before {
    content: '';
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: ${({ $color }) => $color};
    
    @media (min-width: 768px) {
      width: 6px;
      height: 6px;
    }
  }
`;

const EmptySlot = styled.div`
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.4);
  font-style: italic;
  font-size: 0.8rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  border: 1px dashed rgba(255, 255, 255, 0.1);
  
  @media (min-width: 768px) {
    padding: 1.5rem;
    font-size: 0.9rem;
  }
`;

const LoadingSpinner = styled.div`
  width: 10px;
  height: 10px;
  border: 2px solid rgba(236, 72, 153, 0.3);
  border-top: 2px solid #ec4899;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @media (min-width: 768px) {
    width: 12px;
    height: 12px;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Day View Components
const DayViewContainer = styled.div`
  background: rgba(0, 0, 0, 0.8);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  @media (min-width: 768px) {
    border-radius: 24px;
    padding: 3rem;
  }
`;

const MealSection = styled.div`
  margin-bottom: 2rem;
  
  @media (min-width: 768px) {
    margin-bottom: 3rem;
  }
`;

const MealSectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid rgba(236, 72, 153, 0.2);
  
  @media (min-width: 768px) {
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
  }
`;

const MealSectionTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: white;
  margin: 0;
  
  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
`;

const MealTime = styled.span`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  background: rgba(236, 72, 153, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  
  @media (min-width: 768px) {
    font-size: 0.9rem;
  }
`;

const MealGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
`;

const MealCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0,0,0,0.3);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 32px rgba(236, 72, 153, 0.3);
    border-color: rgba(236, 72, 153, 0.5);
  }
`;

const MealImage = styled.div<{ $image: string }>`
  height: 160px;
  background: url(${({ $image }) => $image}) center/cover;
  background-color: #1a0b2e;
  position: relative;
  
  @media (min-width: 768px) {
    height: 180px;
  }
`;

const MealBadge = styled.div<{ $difficulty: string }>`
  position: absolute;
  top: 10px;
  right: 10px;
  background: ${({ $difficulty }) => 
    $difficulty === 'Easy' ? '#10b981' :
    $difficulty === 'Medium' ? '#f59e0b' : '#ef4444'};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  
  @media (min-width: 768px) {
    font-size: 0.8rem;
  }
`;

const MealCardContent = styled.div`
  padding: 1.25rem;
  
  @media (min-width: 768px) {
    padding: 1.5rem;
  }
`;

const MealCardTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.5rem;
  
  @media (min-width: 768px) {
    font-size: 1.1rem;
  }
`;

const MealDescription = styled.p`
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1rem;
  line-height: 1.5;
  
  @media (min-width: 768px) {
    font-size: 0.9rem;
  }
`;

const MealStats = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const StatBox = styled.div`
  text-align: center;
  padding: 0.5rem;
  background: rgba(236, 72, 153, 0.1);
  border-radius: 8px;
`;

const StatValue = styled.div`
  font-size: 0.9rem;
  font-weight: 700;
  color: white;
  
  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

const StatLabel = styled.div`
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  @media (min-width: 768px) {
    font-size: 0.7rem;
  }
`;

const MealTags = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Tag = styled.span`
  background: rgba(139, 92, 246, 0.2);
  color: rgba(255, 255, 255, 0.8);
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.65rem;
  font-weight: 500;
  border: 1px solid rgba(139, 92, 246, 0.3);
  
  @media (min-width: 768px) {
    font-size: 0.7rem;
  }
`;

// Sidebar Components
const SummaryCard = styled.div`
  background: rgba(0, 0, 0, 0.8);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  
  @media (min-width: 768px) {
    border-radius: 24px;
    padding: 2rem;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(236, 72, 153, 0.2);
    border-color: rgba(236, 72, 153, 0.3);
  }
`;

const SummaryTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 800;
  color: white;
  margin-bottom: 1rem;
  letter-spacing: -0.01em;
  
  @media (min-width: 768px) {
    font-size: 1.4rem;
    margin-bottom: 1.5rem;
  }
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  
  @media (min-width: 768px) {
    gap: 1.2rem;
  }
`;

const SummaryItem = styled.div`
  text-align: center;
  padding: 1rem;
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
  border-radius: 12px;
  border: 1px solid rgba(236, 72, 153, 0.2);
  transition: all 0.3s ease;
  
  @media (min-width: 768px) {
    padding: 1.5rem;
    border-radius: 16px;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(236, 72, 153, 0.2);
    border-color: rgba(236, 72, 153, 0.4);
  }
`;

const SummaryValue = styled.div`
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.25rem;
  
  @media (min-width: 768px) {
    font-size: 1.8rem;
  }
`;

const SummaryLabel = styled.div`
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
  
  @media (min-width: 768px) {
    font-size: 0.8rem;
  }
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
  border: none;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(236, 72, 153, 0.4);
  width: 100%;
  
  @media (min-width: 768px) {
    padding: 1rem 2rem;
    font-size: 1rem;
    border-radius: 60px;
    box-shadow: 0 6px 20px rgba(236, 72, 153, 0.4);
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(236, 72, 153, 0.6);
  }
`;

// Mobile Sticky Footer Navigation
const MobileFooter = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1rem;
  z-index: 1000;
  
  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileNavGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  max-width: 400px;
  margin: 0 auto;
`;

const MobileNavItem = styled.button<{ $active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.75rem 0.5rem;
  background: ${({ $active }) => 
    $active ? 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)' : 'transparent'};
  border: none;
  border-radius: 12px;
  color: ${({ $active }) => $active ? 'white' : 'rgba(255, 255, 255, 0.7)'};
  font-size: 0.7rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    color: white;
    background: ${({ $active }) => 
      $active ? 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)' : 'rgba(255, 255, 255, 0.1)'};
  }
`;

const MobileNavIcon = styled.div`
  font-size: 1.2rem;
`;

const MobileNavLabel = styled.div`
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

// Modal Updates for Miami Theme
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(20px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  
  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const ModalContent = styled.div`
  background: linear-gradient(135deg, #0a0a0a 0%, #1a0b2e 100%);
  border-radius: 20px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  @media (min-width: 768px) {
    max-width: 800px;
    border-radius: 24px;
  }
`;

const ModalHeader = styled.div`
  position: relative;
  height: 250px;
  background-size: cover;
  background-position: center;
  border-radius: 20px 20px 0 0;
  display: flex;
  align-items: flex-end;
  padding: 1.5rem;
  
  @media (min-width: 768px) {
    height: 300px;
    border-radius: 24px 24px 0 0;
    padding: 2rem;
  }
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.8) 100%);
    border-radius: 20px 20px 0 0;
    
    @media (min-width: 768px) {
      border-radius: 24px 24px 0 0;
    }
  }
`;

const ModalTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 800;
  color: white;
  text-shadow: 0 4px 8px rgba(0,0,0,0.8);
  margin: 0;
  position: relative;
  z-index: 1;
  
  @media (min-width: 768px) {
    font-size: 2.5rem;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 2;
  
  @media (min-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
  
  &:hover {
    background: rgba(236, 72, 153, 0.8);
    transform: scale(1.05);
  }
`;

const ModalBody = styled.div`
  padding: 2rem;
  color: white;
  
  @media (min-width: 768px) {
    padding: 3rem;
  }
`;

// Recipe Modal Components
const RecipeSection = styled.div`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  @media (min-width: 768px) {
    font-size: 1.4rem;
  }
`;

const IngredientsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
`;

const IngredientItem = styled.li`
  padding: 0.75rem 1rem;
  background: rgba(236, 72, 153, 0.1);
  border-radius: 8px;
  border-left: 3px solid #ec4899;
  font-weight: 500;
  color: white;
`;

const InstructionsList = styled.ol`
  padding: 0;
  margin: 0;
  list-style: none;
  counter-reset: step-counter;
`;

const InstructionItem = styled.li`
  counter-increment: step-counter;
  padding: 1rem 1rem 1rem 3rem;
  margin-bottom: 1rem;
  background: rgba(139, 92, 246, 0.1);
  border-radius: 12px;
  position: relative;
  color: white;
  
  @media (min-width: 768px) {
    padding: 1.5rem 1.5rem 1.5rem 4rem;
  }
  
  &:before {
    content: counter(step-counter);
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    width: 28px;
    height: 28px;
    background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.8rem;
    
    @media (min-width: 768px) {
      width: 32px;
      height: 32px;
      font-size: 0.9rem;
    }
  }
`;

const RecipeStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }
`;

const RecipeStatCard = styled.div`
  text-align: center;
  padding: 1rem;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
  border-radius: 12px;
  border: 1px solid rgba(59, 130, 246, 0.2);
`;

// Paywall Modal Components
const PaywallContent = styled.div`
  background: linear-gradient(135deg, #0a0a0a 0%, #1a0b2e 100%);
  border-radius: 20px;
  max-width: 450px;
  width: 100%;
  padding: 2rem;
  text-align: center;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  @media (min-width: 768px) {
    max-width: 500px;
    padding: 3rem;
    border-radius: 24px;
  }
`;

const PaywallIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  
  @media (min-width: 768px) {
    font-size: 4rem;
    margin-bottom: 1.5rem;
  }
`;

const PaywallTitle = styled.h2`
  font-size: 1.6rem;
  font-weight: 800;
  background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.75rem;
  
  @media (min-width: 768px) {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
`;

const PaywallText = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 1.5rem;
  
  @media (min-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }
`;

const PaywallButton = styled.button`
  background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
  border: none;
  color: white;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 6px 24px rgba(236, 72, 153, 0.4);
  margin-bottom: 1rem;
  width: 100%;
  
  @media (min-width: 768px) {
    padding: 1.2rem 2.5rem;
    font-size: 1.1rem;
    border-radius: 60px;
    box-shadow: 0 8px 32px rgba(236, 72, 153, 0.4);
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 32px rgba(236, 72, 153, 0.6);
  }
`;

const PaywallFeatures = styled.ul`
  text-align: left;
  list-style: none;
  padding: 0;
  margin: 1.5rem 0;
  
  @media (min-width: 768px) {
    margin: 2rem 0;
  }
`;

const PaywallFeature = styled.li`
  padding: 0.4rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  
  @media (min-width: 768px) {
    padding: 0.5rem 0;
  }
  
  &:before {
    content: '✓';
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    font-weight: 700;
    flex-shrink: 0;
    
    @media (min-width: 768px) {
      width: 20px;
      height: 20px;
      font-size: 0.8rem;
    }
  }
`;

const HelpTooltip = styled.div`
  position: fixed;
  bottom: 7rem;
  right: 1rem;
  background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-size: 0.8rem;
  max-width: 250px;
  box-shadow: 0 8px 24px rgba(236, 72, 153, 0.4);
  z-index: 1500;
  animation: ${slideInUp} 0.5s ease-out;
  
  @media (min-width: 768px) {
    bottom: 2rem;
    right: 2rem;
    padding: 1rem 1.5rem;
    border-radius: 16px;
    font-size: 0.9rem;
    max-width: 300px;
    box-shadow: 0 8px 32px rgba(236, 72, 153, 0.4);
  }
  
  &:before {
    content: '💡';
    margin-right: 0.5rem;
  }
`;

const DemoCounter = styled.div`
  position: fixed;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(20px);
  padding: 0.75rem 1rem;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 1500;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 600;
  
  @media (min-width: 768px) {
    top: 2rem;
    right: 2rem;
    padding: 1rem 1.5rem;
    border-radius: 20px;
    font-size: 0.9rem;
  }
`;

type ViewType = 'day' | 'week' | 'month';

// Mock meal data with properly matched images
const mockMeals: Meal[] = [
  {
    id: '1',
    name: 'Avocado Toast with Poached Egg',
    image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=300&fit=crop',
    prepTime: 15,
    calories: 420,
    protein: 18,
    carbs: 32,
    fat: 28,
    ingredients: ['Sourdough bread', 'Avocado', 'Eggs', 'Cherry tomatoes', 'Hemp seeds'],
    description: 'Perfectly ripe avocado on artisan sourdough with a creamy poached egg.',
    difficulty: 'Easy',
    tags: ['Vegetarian', 'High Protein', 'Healthy Fats'],
    instructions: [
      'Bring a pot of water to a gentle simmer and add a splash of white vinegar.',
      'Toast the sourdough bread until golden brown.',
      'Mash the avocado with a fork and season with salt and pepper.',
      'Crack the egg into a small bowl, then gently slide into the simmering water.',
      'Poach for 3-4 minutes until the white is set but yolk is still runny.',
      'Spread mashed avocado on toast, top with poached egg and cherry tomatoes.',
      'Sprinkle with hemp seeds and serve immediately.'
    ]
  },
  {
    id: '2',
    name: 'Greek Quinoa Buddha Bowl',
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop',
    prepTime: 25,
    calories: 485,
    protein: 22,
    carbs: 54,
    fat: 18,
    ingredients: ['Quinoa', 'Cucumber', 'Feta cheese', 'Olives', 'Cherry tomatoes', 'Red onion'],
    description: 'Mediterranean-inspired bowl packed with fresh vegetables and protein.',
    difficulty: 'Medium',
    tags: ['Vegetarian', 'Mediterranean', 'High Fiber'],
    instructions: [
      'Rinse quinoa under cold water until water runs clear.',
      'Cook quinoa in vegetable broth for 15 minutes until fluffy.',
      'Dice cucumber, cherry tomatoes, and red onion.',
      'Crumble feta cheese into bite-sized pieces.',
      'Make dressing with olive oil, lemon juice, oregano, salt, and pepper.',
      'Arrange cooked quinoa in a bowl as the base.',
      'Top with cucumber, tomatoes, olives, onion, and feta.',
      'Drizzle with dressing and garnish with fresh herbs.'
    ]
  },
  {
    id: '3',
    name: 'Grilled Salmon with Asparagus',
    image: 'https://images.unsplash.com/photo-1485704686097-ed47f7263ca4?w=400&h=300&fit=crop',
    prepTime: 20,
    calories: 380,
    protein: 35,
    carbs: 8,
    fat: 24,
    ingredients: ['Atlantic salmon', 'Asparagus', 'Lemon', 'Olive oil', 'Garlic', 'Herbs'],
    description: 'Wild-caught salmon grilled to perfection with seasonal vegetables.',
    difficulty: 'Medium',
    tags: ['High Protein', 'Omega-3', 'Low Carb', 'Paleo'],
    instructions: [
      'Preheat grill to medium-high heat.',
      'Pat salmon fillets dry and season with salt, pepper, and herbs.',
      'Trim woody ends from asparagus and toss with olive oil.',
      'Mince garlic and mix with olive oil and lemon zest.',
      'Grill salmon skin-side down for 4-5 minutes without moving.',
      'Flip salmon and grill for 3-4 more minutes until flaky.',
      'Grill asparagus for 3-4 minutes, turning occasionally.',
      'Serve salmon with asparagus, drizzled with garlic oil and lemon juice.'
    ]
  },
  {
    id: '4',
    name: 'Mixed Berry Smoothie Bowl',
    image: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400&h=300&fit=crop',
    prepTime: 10,
    calories: 320,
    protein: 12,
    carbs: 58,
    fat: 8,
    ingredients: ['Mixed berries', 'Banana', 'Greek yogurt', 'Granola', 'Chia seeds', 'Honey'],
    description: 'Antioxidant-rich smoothie bowl topped with fresh fruits and granola.',
    difficulty: 'Easy',
    tags: ['Vegetarian', 'Antioxidants', 'Post-Workout'],
    instructions: [
      'Freeze mixed berries and banana slices the night before.',
      'Blend frozen berries, banana, and Greek yogurt until smooth and thick.',
      'Add a tablespoon of honey if extra sweetness is desired.',
      'Pour smoothie mixture into a chilled bowl.',
      'Arrange fresh berries, granola, and chia seeds on top.',
      'Drizzle with honey and serve immediately.',
      'Enjoy with a spoon for the perfect texture contrast.'
    ]
  },
  {
    id: '5',
    name: 'Chicken Teriyaki Rice Bowl',
    image: 'https://images.unsplash.com/photo-1563379091339-03246963d61b?w=400&h=300&fit=crop',
    prepTime: 30,
    calories: 520,
    protein: 38,
    carbs: 65,
    fat: 12,
    ingredients: ['Chicken breast', 'Brown rice', 'Broccoli', 'Carrots', 'Teriyaki sauce', 'Sesame seeds'],
    description: 'Lean protein with complex carbs in a flavorful Asian-inspired sauce.',
    difficulty: 'Medium',
    tags: ['High Protein', 'Asian', 'Balanced'],
    instructions: [
      'Cook brown rice according to package directions.',
      'Cut chicken breast into bite-sized pieces.',
      'Heat oil in a large pan over medium-high heat.',
      'Cook chicken pieces until golden brown and cooked through.',
      'Steam broccoli and carrots until tender-crisp.',
      'Add teriyaki sauce to chicken and simmer for 2 minutes.',
      'Serve chicken over rice with steamed vegetables.',
      'Garnish with sesame seeds and green onions.'
    ]
  },
  {
    id: '6',
    name: 'Dark Chocolate Energy Balls',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
    prepTime: 15,
    calories: 180,
    protein: 6,
    carbs: 18,
    fat: 11,
    ingredients: ['Dates', 'Almonds', 'Dark chocolate', 'Coconut', 'Vanilla'],
    description: 'Naturally sweetened energy bites perfect for afternoon fuel.',
    difficulty: 'Easy',
    tags: ['Vegan', 'No-Bake', 'Energy', 'Antioxidants'],
    instructions: [
      'Pit dates and soak in warm water for 10 minutes to soften.',
      'Roughly chop almonds and dark chocolate.',
      'Drain dates and add to food processor.',
      'Process dates until they form a smooth paste.',
      'Add almonds, chocolate, coconut, and vanilla.',
      'Pulse until mixture holds together when pressed.',
      'Roll mixture into 12 small balls using your hands.',
      'Chill in refrigerator for 30 minutes before serving.'
    ]
  },
  {
    id: '7',
    name: 'Protein Pancakes with Berries',
    image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=400&h=300&fit=crop',
    prepTime: 20,
    calories: 380,
    protein: 28,
    carbs: 42,
    fat: 12,
    ingredients: ['Protein powder', 'Oats', 'Eggs', 'Blueberries', 'Greek yogurt', 'Maple syrup'],
    description: 'Fluffy protein-packed pancakes topped with fresh berries and Greek yogurt.',
    difficulty: 'Easy',
    tags: ['High Protein', 'Post-Workout', 'Vegetarian'],
    instructions: [
      'Blend oats in a blender until they form a fine flour.',
      'Mix oat flour, protein powder, and a pinch of salt.',
      'Whisk eggs and add to dry ingredients.',
      'Add enough water to make a pancake batter consistency.',
      'Heat a non-stick pan over medium heat.',
      'Pour batter to form small pancakes.',
      'Cook for 2-3 minutes until bubbles form, then flip.',
      'Serve topped with Greek yogurt, berries, and maple syrup.'
    ]
  },
  {
    id: '8',
    name: 'Mediterranean Chicken Salad',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
    prepTime: 15,
    calories: 390,
    protein: 32,
    carbs: 18,
    fat: 22,
    ingredients: ['Grilled chicken', 'Mixed greens', 'Cucumber', 'Feta', 'Olives', 'Olive oil'],
    description: 'Fresh Mediterranean salad with grilled chicken and tangy feta cheese.',
    difficulty: 'Easy',
    tags: ['High Protein', 'Mediterranean', 'Low Carb'],
    instructions: [
      'Season chicken breast with herbs and grill until cooked through.',
      'Let chicken rest for 5 minutes, then slice thinly.',
      'Wash and dry mixed greens thoroughly.',
      'Dice cucumber and halve cherry tomatoes.',
      'Make dressing with olive oil, lemon juice, and oregano.',
      'Toss greens with half the dressing.',
      'Top with chicken, cucumber, olives, and crumbled feta.',
      'Drizzle with remaining dressing and serve immediately.'
    ]
  },
  {
    id: '9',
    name: 'Sweet Potato & Black Bean Bowl',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
    prepTime: 35,
    calories: 445,
    protein: 18,
    carbs: 72,
    fat: 12,
    ingredients: ['Roasted sweet potato', 'Black beans', 'Quinoa', 'Avocado', 'Lime', 'Cilantro'],
    description: 'Hearty plant-based bowl with roasted sweet potatoes and protein-rich beans.',
    difficulty: 'Medium',
    tags: ['Vegan', 'High Fiber', 'Plant-Based'],
    instructions: [
      'Preheat oven to 425°F (220°C).',
      'Cube sweet potatoes and toss with olive oil and spices.',
      'Roast sweet potatoes for 25-30 minutes until tender.',
      'Cook quinoa according to package directions.',
      'Rinse and heat black beans in a pan.',
      'Slice avocado and chop fresh cilantro.',
      'Assemble bowls with quinoa as base.',
      'Top with roasted sweet potato, black beans, avocado, and cilantro.',
      'Squeeze lime juice over everything before serving.'
    ]
  },
  {
    id: '10',
    name: 'Almond Butter Apple Slices',
    image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&h=300&fit=crop',
    prepTime: 5,
    calories: 220,
    protein: 8,
    carbs: 24,
    fat: 12,
    ingredients: ['Honeycrisp apple', 'Almond butter', 'Cinnamon', 'Chia seeds'],
    description: 'Crisp apple slices with creamy almond butter and a sprinkle of cinnamon.',
    difficulty: 'Easy',
    tags: ['Healthy Fats', 'Quick', 'Natural'],
    instructions: [
      'Wash the apple thoroughly under cold water.',
      'Core the apple and slice into 8 wedges.',
      'Arrange apple slices on a plate.',
      'Warm almond butter slightly to make it easier to drizzle.',
      'Drizzle or spread almond butter over apple slices.',
      'Sprinkle with cinnamon and chia seeds.',
      'Serve immediately for the best texture and flavor.'
    ]
  }
];

const MealPlanner: React.FC = () => {
  const { selectedDate } = useMealPlan();
  const [view, setView] = useState<ViewType>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [recipeViews, setRecipeViews] = useState(() => {
    return parseInt(localStorage.getItem('recipeViews') || '0');
  });
  const [regeneratingMeals, setRegeneratingMeals] = useState<Set<string>>(new Set());
  const [customMeals, setCustomMeals] = useState<{ [key: string]: Meal }>({});

  const DEMO_LIMIT = 3;

  const handleMealClick = (meal: Meal) => {
    if (recipeViews >= DEMO_LIMIT) {
      setShowPaywall(true);
      return;
    }
    
    setSelectedMeal(meal);
    const newCount = recipeViews + 1;
    setRecipeViews(newCount);
    localStorage.setItem('recipeViews', newCount.toString());
  };

  const handleRegenerateMeal = async (mealId: string, mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks', date: string) => {
    const mealKey = `${date}-${mealType}`;
    setRegeneratingMeals(prev => new Set(prev).add(mealKey));
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Get meals of the same type but exclude the current one
    const mealTypeMap = {
      breakfast: [mockMeals[0], mockMeals[3], mockMeals[6]], // Avocado toast, smoothie bowl, pancakes
      lunch: [mockMeals[1], mockMeals[7], mockMeals[8]], // Buddha bowl, chicken salad, sweet potato bowl
      dinner: [mockMeals[2], mockMeals[4]], // Salmon, chicken teriyaki
      snacks: [mockMeals[5], mockMeals[9]] // Energy balls, apple slices
    };
    
    const availableMeals = mealTypeMap[mealType].filter(meal => meal.id !== mealId);
    const randomMeal = availableMeals[Math.floor(Math.random() * availableMeals.length)];
    
    // Store the new meal in custom meals state
    setCustomMeals(prev => ({
      ...prev,
      [mealKey]: randomMeal
    }));
    
    setRegeneratingMeals(prev => {
      const newSet = new Set(prev);
      newSet.delete(mealKey);
      return newSet;
    });
  };

  const closeModal = () => {
    setSelectedMeal(null);
  };

  const closePaywall = () => {
    setShowPaywall(false);
  };

  // Generate mock meal plans for different days
  const generateDayMeals = (date: Date): DayMeals => {
    const dateString = format(date, 'yyyy-MM-dd');
    const seed = date.getTime();
    const random = (array: any[]) => array[Math.floor((seed * 9301 + 49297) % 233280 / 233280 * array.length)];
    
    // Separate meals by type for better distribution
    const breakfastMeals = [mockMeals[0], mockMeals[3], mockMeals[6]]; // Avocado toast, smoothie bowl, pancakes
    const lunchMeals = [mockMeals[1], mockMeals[7], mockMeals[8]]; // Buddha bowl, chicken salad, sweet potato bowl
    const dinnerMeals = [mockMeals[2], mockMeals[4]]; // Salmon, chicken teriyaki
    const snackMeals = [mockMeals[5], mockMeals[9]]; // Energy balls, apple slices
    
    return {
      date: dateString,
      breakfast: [customMeals[`${dateString}-breakfast`] || random(breakfastMeals)],
      lunch: [customMeals[`${dateString}-lunch`] || random(lunchMeals)],
      dinner: [customMeals[`${dateString}-dinner`] || random(dinnerMeals)],
      snacks: [customMeals[`${dateString}-snacks`] || random(snackMeals)]
    };
  };

  // Calculate date ranges based on view
  const dateRange = useMemo(() => {
    switch (view) {
      case 'week':
        return {
          start: startOfWeek(currentDate),
          end: endOfWeek(currentDate)
        };
      case 'month':
        return {
          start: startOfMonth(currentDate),
          end: endOfMonth(currentDate)
        };
      default:
        return {
          start: currentDate,
          end: currentDate
        };
    }
  }, [view, currentDate]);

  const viewDays = useMemo(() => {
    return eachDayOfInterval(dateRange).map(date => ({
      date: format(date, 'yyyy-MM-dd'),
      dayObj: date,
      meals: generateDayMeals(date)
    }));
  }, [dateRange]);

  const navigation = {
    day: {
      prev: () => setCurrentDate(prev => subDays(prev, 1)),
      next: () => setCurrentDate(prev => addDays(prev, 1)),
      label: format(currentDate, 'EEEE, MMMM d, yyyy')
    },
    week: {
      prev: () => setCurrentDate(prev => subWeeks(prev, 1)),
      next: () => setCurrentDate(prev => addWeeks(prev, 1)),
      label: `${format(dateRange.start, 'MMM d')} - ${format(dateRange.end, 'MMM d, yyyy')}`
    },
    month: {
      prev: () => setCurrentDate(prev => subMonths(prev, 1)),
      next: () => setCurrentDate(prev => addMonths(prev, 1)),
      label: format(currentDate, 'MMMM yyyy')
    }
  };

  const selectedDayMeals = useMemo(() => {
    const day = viewDays.find(d => d.date === selectedDate);
    return day?.meals || generateDayMeals(parseISO(selectedDate));
  }, [selectedDate, viewDays]);

  const renderWeekView = () => (
    <WeekContainer>
      <WeekTable>
        {/* Header Row */}
        <TimeSlotHeader>Meal Type</TimeSlotHeader>
        {viewDays.map(({ date, dayObj }) => {
          const isToday = isSameDay(dayObj, new Date());
          return (
            <DayHeader key={date} $isToday={isToday}>
              <DayNumber>{format(dayObj, 'd')}</DayNumber>
              <DayName>{format(dayObj, 'EEE')}</DayName>
            </DayHeader>
          );
        })}

        {/* Breakfast Row */}
        <TimeSlotHeader>🌅 Breakfast</TimeSlotHeader>
        {viewDays.map(({ date, meals }) => {
          const mealKey = `${date}-breakfast`;
          const isRegenerating = regeneratingMeals.has(mealKey);
          const meal = meals.breakfast[0];
          
          return (
            <MealSlot key={mealKey}>
              {meal ? (
                <MealItem onClick={() => handleMealClick(meal)}>
                  <MealHeader>
                    <MealName>{meal.name}</MealName>
                    <MealActions>
                      <ActionIcon 
                        $variant="refresh" 
                        disabled={isRegenerating}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRegenerateMeal(meal.id, 'breakfast', date);
                        }}
                      >
                        {isRegenerating ? <LoadingSpinner /> : '↻'}
                      </ActionIcon>
                      <ActionIcon $variant="info" onClick={(e) => {
                        e.stopPropagation();
                        handleMealClick(meal);
                      }}>
                        ℹ
                      </ActionIcon>
                    </MealActions>
                  </MealHeader>
                  <MealWeekDescription>{meal.description}</MealWeekDescription>
                  <MealNutrition>
                    <NutritionBadge $color="#f59e0b">{meal.calories} cal</NutritionBadge>
                    <NutritionBadge $color="#10b981">{meal.protein}g protein</NutritionBadge>
                  </MealNutrition>
                </MealItem>
              ) : (
                <EmptySlot>No meal planned</EmptySlot>
              )}
            </MealSlot>
          );
        })}

        {/* Lunch Row */}
        <TimeSlotHeader>🥗 Lunch</TimeSlotHeader>
        {viewDays.map(({ date, meals }) => {
          const mealKey = `${date}-lunch`;
          const isRegenerating = regeneratingMeals.has(mealKey);
          const meal = meals.lunch[0];
          
          return (
            <MealSlot key={mealKey}>
              {meal ? (
                <MealItem onClick={() => handleMealClick(meal)}>
                  <MealHeader>
                    <MealName>{meal.name}</MealName>
                    <MealActions>
                      <ActionIcon 
                        $variant="refresh" 
                        disabled={isRegenerating}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRegenerateMeal(meal.id, 'lunch', date);
                        }}
                      >
                        {isRegenerating ? <LoadingSpinner /> : '↻'}
                      </ActionIcon>
                      <ActionIcon $variant="info" onClick={(e) => {
                        e.stopPropagation();
                        handleMealClick(meal);
                      }}>
                        ℹ
                      </ActionIcon>
                    </MealActions>
                  </MealHeader>
                  <MealWeekDescription>{meal.description}</MealWeekDescription>
                  <MealNutrition>
                    <NutritionBadge $color="#f59e0b">{meal.calories} cal</NutritionBadge>
                    <NutritionBadge $color="#10b981">{meal.protein}g protein</NutritionBadge>
                  </MealNutrition>
                </MealItem>
              ) : (
                <EmptySlot>No meal planned</EmptySlot>
              )}
            </MealSlot>
          );
        })}

        {/* Dinner Row */}
        <TimeSlotHeader>🍽️ Dinner</TimeSlotHeader>
        {viewDays.map(({ date, meals }) => {
          const mealKey = `${date}-dinner`;
          const isRegenerating = regeneratingMeals.has(mealKey);
          const meal = meals.dinner[0];
          
          return (
            <MealSlot key={mealKey}>
              {meal ? (
                <MealItem onClick={() => handleMealClick(meal)}>
                  <MealHeader>
                    <MealName>{meal.name}</MealName>
                    <MealActions>
                      <ActionIcon 
                        $variant="refresh" 
                        disabled={isRegenerating}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRegenerateMeal(meal.id, 'dinner', date);
                        }}
                      >
                        {isRegenerating ? <LoadingSpinner /> : '↻'}
                      </ActionIcon>
                      <ActionIcon $variant="info" onClick={(e) => {
                        e.stopPropagation();
                        handleMealClick(meal);
                      }}>
                        ℹ
                      </ActionIcon>
                    </MealActions>
                  </MealHeader>
                  <MealWeekDescription>{meal.description}</MealWeekDescription>
                  <MealNutrition>
                    <NutritionBadge $color="#f59e0b">{meal.calories} cal</NutritionBadge>
                    <NutritionBadge $color="#10b981">{meal.protein}g protein</NutritionBadge>
                  </MealNutrition>
                </MealItem>
              ) : (
                <EmptySlot>No meal planned</EmptySlot>
              )}
            </MealSlot>
          );
        })}

        {/* Snacks Row */}
        <TimeSlotHeader>🍎 Snacks</TimeSlotHeader>
        {viewDays.map(({ date, meals }) => {
          const mealKey = `${date}-snacks`;
          const isRegenerating = regeneratingMeals.has(mealKey);
          const meal = meals.snacks[0];
          
          return (
            <MealSlot key={mealKey}>
              {meal ? (
                <MealItem onClick={() => handleMealClick(meal)}>
                  <MealHeader>
                    <MealName>{meal.name}</MealName>
                    <MealActions>
                      <ActionIcon 
                        $variant="refresh" 
                        disabled={isRegenerating}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRegenerateMeal(meal.id, 'snacks', date);
                        }}
                      >
                        {isRegenerating ? <LoadingSpinner /> : '↻'}
                      </ActionIcon>
                      <ActionIcon $variant="info" onClick={(e) => {
                        e.stopPropagation();
                        handleMealClick(meal);
                      }}>
                        ℹ
                      </ActionIcon>
                    </MealActions>
                  </MealHeader>
                  <MealWeekDescription>{meal.description}</MealWeekDescription>
                  <MealNutrition>
                    <NutritionBadge $color="#f59e0b">{meal.calories} cal</NutritionBadge>
                    <NutritionBadge $color="#10b981">{meal.protein}g protein</NutritionBadge>
                  </MealNutrition>
                </MealItem>
              ) : (
                <EmptySlot>No meal planned</EmptySlot>
              )}
            </MealSlot>
          );
        })}
      </WeekTable>
    </WeekContainer>
  );

  const renderDayView = () => {
    return (
      <DayViewContainer>
        <MealSection>
          <MealSectionHeader>
            <MealSectionTitle>🌅 Breakfast</MealSectionTitle>
            <MealTime>7:00 - 9:00 AM</MealTime>
          </MealSectionHeader>
          <MealGrid>
            {selectedDayMeals.breakfast.map(meal => (
              <MealCard key={meal.id} onClick={() => handleMealClick(meal)}>
                <MealImage $image={meal.image}>
                  <MealBadge $difficulty={meal.difficulty}>{meal.difficulty}</MealBadge>
                </MealImage>
                <MealCardContent>
                  <MealCardTitle>{meal.name}</MealCardTitle>
                  <MealDescription>{meal.description}</MealDescription>
                  <MealStats>
                    <StatBox>
                      <StatValue>{meal.calories}</StatValue>
                      <StatLabel>Cal</StatLabel>
                    </StatBox>
                    <StatBox>
                      <StatValue>{meal.protein}g</StatValue>
                      <StatLabel>Protein</StatLabel>
                    </StatBox>
                    <StatBox>
                      <StatValue>{meal.carbs}g</StatValue>
                      <StatLabel>Carbs</StatLabel>
                    </StatBox>
                    <StatBox>
                      <StatValue>{meal.fat}g</StatValue>
                      <StatLabel>Fat</StatLabel>
                    </StatBox>
                  </MealStats>
                  <MealTags>
                    {meal.tags.map(tag => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </MealTags>
                </MealCardContent>
              </MealCard>
            ))}
          </MealGrid>
        </MealSection>

        <MealSection>
          <MealSectionHeader>
            <MealSectionTitle>🥗 Lunch</MealSectionTitle>
            <MealTime>12:00 - 2:00 PM</MealTime>
          </MealSectionHeader>
          <MealGrid>
            {selectedDayMeals.lunch.map(meal => (
              <MealCard key={meal.id} onClick={() => handleMealClick(meal)}>
                <MealImage $image={meal.image}>
                  <MealBadge $difficulty={meal.difficulty}>{meal.difficulty}</MealBadge>
                </MealImage>
                <MealCardContent>
                  <MealCardTitle>{meal.name}</MealCardTitle>
                  <MealDescription>{meal.description}</MealDescription>
                  <MealStats>
                    <StatBox>
                      <StatValue>{meal.calories}</StatValue>
                      <StatLabel>Cal</StatLabel>
                    </StatBox>
                    <StatBox>
                      <StatValue>{meal.protein}g</StatValue>
                      <StatLabel>Protein</StatLabel>
                    </StatBox>
                    <StatBox>
                      <StatValue>{meal.carbs}g</StatValue>
                      <StatLabel>Carbs</StatLabel>
                    </StatBox>
                    <StatBox>
                      <StatValue>{meal.fat}g</StatValue>
                      <StatLabel>Fat</StatLabel>
                    </StatBox>
                  </MealStats>
                  <MealTags>
                    {meal.tags.map(tag => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </MealTags>
                </MealCardContent>
              </MealCard>
            ))}
          </MealGrid>
        </MealSection>

        <MealSection>
          <MealSectionHeader>
            <MealSectionTitle>🍽️ Dinner</MealSectionTitle>
            <MealTime>6:00 - 8:00 PM</MealTime>
          </MealSectionHeader>
          <MealGrid>
            {selectedDayMeals.dinner.map(meal => (
              <MealCard key={meal.id} onClick={() => handleMealClick(meal)}>
                <MealImage $image={meal.image}>
                  <MealBadge $difficulty={meal.difficulty}>{meal.difficulty}</MealBadge>
                </MealImage>
                <MealCardContent>
                  <MealCardTitle>{meal.name}</MealCardTitle>
                  <MealDescription>{meal.description}</MealDescription>
                  <MealStats>
                    <StatBox>
                      <StatValue>{meal.calories}</StatValue>
                      <StatLabel>Cal</StatLabel>
                    </StatBox>
                    <StatBox>
                      <StatValue>{meal.protein}g</StatValue>
                      <StatLabel>Protein</StatLabel>
                    </StatBox>
                    <StatBox>
                      <StatValue>{meal.carbs}g</StatValue>
                      <StatLabel>Carbs</StatLabel>
                    </StatBox>
                    <StatBox>
                      <StatValue>{meal.fat}g</StatValue>
                      <StatLabel>Fat</StatLabel>
                    </StatBox>
                  </MealStats>
                  <MealTags>
                    {meal.tags.map(tag => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </MealTags>
                </MealCardContent>
              </MealCard>
            ))}
          </MealGrid>
        </MealSection>

        <MealSection>
          <MealSectionHeader>
            <MealSectionTitle>🍎 Snacks</MealSectionTitle>
            <MealTime>Throughout the day</MealTime>
          </MealSectionHeader>
          <MealGrid>
            {selectedDayMeals.snacks.map(meal => (
              <MealCard key={meal.id} onClick={() => handleMealClick(meal)}>
                <MealImage $image={meal.image}>
                  <MealBadge $difficulty={meal.difficulty}>{meal.difficulty}</MealBadge>
                </MealImage>
                <MealCardContent>
                  <MealCardTitle>{meal.name}</MealCardTitle>
                  <MealDescription>{meal.description}</MealDescription>
                  <MealStats>
                    <StatBox>
                      <StatValue>{meal.calories}</StatValue>
                      <StatLabel>Cal</StatLabel>
                    </StatBox>
                    <StatBox>
                      <StatValue>{meal.protein}g</StatValue>
                      <StatLabel>Protein</StatLabel>
                    </StatBox>
                    <StatBox>
                      <StatValue>{meal.carbs}g</StatValue>
                      <StatLabel>Carbs</StatLabel>
                    </StatBox>
                    <StatBox>
                      <StatValue>{meal.fat}g</StatValue>
                      <StatLabel>Fat</StatLabel>
                    </StatBox>
                  </MealStats>
                  <MealTags>
                    {meal.tags.map(tag => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </MealTags>
                </MealCardContent>
              </MealCard>
            ))}
          </MealGrid>
        </MealSection>
      </DayViewContainer>
    );
  };

  const renderSummary = () => {
    const allMeals = [...selectedDayMeals.breakfast, ...selectedDayMeals.lunch, ...selectedDayMeals.dinner, ...selectedDayMeals.snacks];
    const totals = allMeals.reduce((acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fat: acc.fat + meal.fat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

    return (
      <SummaryCard>
        <SummaryTitle>Daily Summary</SummaryTitle>
        <SummaryGrid>
          <SummaryItem>
            <SummaryValue>{totals.calories}</SummaryValue>
            <SummaryLabel>Calories</SummaryLabel>
          </SummaryItem>
          <SummaryItem>
            <SummaryValue>{totals.protein}g</SummaryValue>
            <SummaryLabel>Protein</SummaryLabel>
          </SummaryItem>
          <SummaryItem>
            <SummaryValue>{totals.carbs}g</SummaryValue>
            <SummaryLabel>Carbs</SummaryLabel>
          </SummaryItem>
          <SummaryItem>
            <SummaryValue>{totals.fat}g</SummaryValue>
            <SummaryLabel>Fat</SummaryLabel>
          </SummaryItem>
        </SummaryGrid>
      </SummaryCard>
    );
  };

  return (
    <PageContainer>
      <Header>
        <Title>Professional Meal Planner</Title>
        <Subtitle>
          Discover perfectly balanced meals with detailed nutrition info, prep times, and beautiful recipes. 
          Click any day to explore complete meal plans.
        </Subtitle>
      </Header>

      <ViewControls>
        <ViewButton $active={view === 'day'} onClick={() => setView('day')}>
          Day View
        </ViewButton>
        <ViewButton $active={view === 'week'} onClick={() => setView('week')}>
          Week View
        </ViewButton>
      </ViewControls>

      <NavigationBar>
        <NavButton onClick={navigation[view].prev}>
          ←
        </NavButton>
        <DateDisplay>{navigation[view].label}</DateDisplay>
        <NavButton onClick={navigation[view].next}>
          →
        </NavButton>
      </NavigationBar>

      <ContentArea>
        <MainContent>
          {view === 'week' && renderWeekView()}
          {view === 'day' && renderDayView()}
        </MainContent>
        
        <SidebarContent>
          {renderSummary()}
          
          <SummaryCard>
            <SummaryTitle>Quick Actions</SummaryTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <ActionButton onClick={() => setView('week')}>
                📅 View Week Overview
              </ActionButton>
              <ActionButton onClick={() => setView('day')}>
                🍽️ Today's Details
              </ActionButton>
              <ActionButton onClick={() => {}}>
                📝 Customize Plan
              </ActionButton>
              <ActionButton onClick={() => {}}>
                🛒 Shopping List
              </ActionButton>
            </div>
          </SummaryCard>
        </SidebarContent>
      </ContentArea>

      {/* Mobile Footer Navigation */}
      <MobileFooter>
        <MobileNavGrid>
          <MobileNavItem 
            $active={view === 'day'} 
            onClick={() => setView('day')}
          >
            <MobileNavIcon>🍽️</MobileNavIcon>
            <MobileNavLabel>Today</MobileNavLabel>
          </MobileNavItem>
          <MobileNavItem 
            $active={view === 'week'} 
            onClick={() => setView('week')}
          >
            <MobileNavIcon>📅</MobileNavIcon>
            <MobileNavLabel>Week</MobileNavLabel>
          </MobileNavItem>
          <MobileNavItem onClick={() => {}}>
            <MobileNavIcon>📊</MobileNavIcon>
            <MobileNavLabel>Stats</MobileNavLabel>
          </MobileNavItem>
          <MobileNavItem onClick={() => {}}>
            <MobileNavIcon>⚙️</MobileNavIcon>
            <MobileNavLabel>Settings</MobileNavLabel>
          </MobileNavItem>
        </MobileNavGrid>
      </MobileFooter>

      {selectedMeal && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader style={{ backgroundImage: `url(${selectedMeal.image})` }}>
              <ModalTitle>{selectedMeal.name}</ModalTitle>
              <CloseButton onClick={closeModal}>✗</CloseButton>
            </ModalHeader>
            <ModalBody>
              <RecipeSection>
                <SectionTitle>🥘 Ingredients</SectionTitle>
                <IngredientsList>
                  {selectedMeal.ingredients.map((ingredient, index) => (
                    <IngredientItem key={index}>{ingredient}</IngredientItem>
                  ))}
                </IngredientsList>
              </RecipeSection>

              <RecipeSection>
                <SectionTitle>📝 Instructions</SectionTitle>
                <InstructionsList>
                  {selectedMeal.instructions.map((instruction, index) => (
                    <InstructionItem key={index}>{instruction}</InstructionItem>
                  ))}
                </InstructionsList>
              </RecipeSection>

              <RecipeStats>
                <RecipeStatCard>
                  <StatValue>{selectedMeal.calories} cal</StatValue>
                  <StatLabel>Calories</StatLabel>
                </RecipeStatCard>
                <RecipeStatCard>
                  <StatValue>{selectedMeal.protein}g</StatValue>
                  <StatLabel>Protein</StatLabel>
                </RecipeStatCard>
                <RecipeStatCard>
                  <StatValue>{selectedMeal.carbs}g</StatValue>
                  <StatLabel>Carbs</StatLabel>
                </RecipeStatCard>
                <RecipeStatCard>
                  <StatValue>{selectedMeal.fat}g</StatValue>
                  <StatLabel>Fat</StatLabel>
                </RecipeStatCard>
              </RecipeStats>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}

      {showPaywall && (
        <ModalOverlay onClick={closePaywall}>
          <PaywallContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={closePaywall}>✗</CloseButton>
            <PaywallIcon>🚀</PaywallIcon>
            <PaywallTitle>Unlock Premium Recipes</PaywallTitle>
            <PaywallText>
              You've viewed your 3 free recipes! Upgrade to get unlimited access to our professional nutrition platform.
            </PaywallText>
            
            <PaywallFeatures>
              <PaywallFeature>Unlimited recipe access with detailed instructions</PaywallFeature>
              <PaywallFeature>Custom meal plans based on your goals</PaywallFeature>
              <PaywallFeature>Advanced nutrition tracking & insights</PaywallFeature>
              <PaywallFeature>Grocery lists and meal prep guides</PaywallFeature>
              <PaywallFeature>1-on-1 nutritionist consultations</PaywallFeature>
              <PaywallFeature>Mobile app with offline access</PaywallFeature>
            </PaywallFeatures>
            
            <PaywallButton onClick={closePaywall}>
              Start Free Trial - $0 for 14 days
            </PaywallButton>
            
            <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.6)', marginTop: '1rem' }}>
              Then just $29/month. Cancel anytime.
            </div>
          </PaywallContent>
        </ModalOverlay>
      )}

      {view === 'week' && (
        <HelpTooltip>
          💡 Hover over any meal to see regeneration options! Click the ↻ button to get a different meal of the same type.
        </HelpTooltip>
      )}

      <DemoCounter>
        {recipeViews} / {DEMO_LIMIT} free recipes viewed
      </DemoCounter>
    </PageContainer>
  );
};

export default MealPlanner;
