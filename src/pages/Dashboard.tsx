import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useMealPlan } from '../services/mealPlanContext';
import { useNavigate } from 'react-router-dom';
import { 
  Flame, 
  Dumbbell, 
  UtensilsCrossed, 
  Apple, 
  Target, 
  Calendar, 
  BarChart3,
  TrendingUp
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

const DashboardContainer = styled.div`
  padding: 1rem;
  padding-bottom: 10rem; /* Increased for better clearance above sticky footer */
  min-height: 100vh;
  position: relative;
  
  @media (min-width: 768px) {
    padding: 2rem;
    padding-bottom: 2rem;
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

const DashboardHeader = styled.div`
  margin-bottom: 2rem;
  text-align: center;
  position: relative;
  z-index: 1;
  animation: ${slideInUp} 0.6s ease-out;
  
  @media (min-width: 768px) {
    text-align: left;
    margin-bottom: 3rem;
  }
`;

const BrandHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
  
  @media (min-width: 768px) {
    justify-content: flex-start;
    margin-bottom: 1.5rem;
  }
`;

const BrandLogo = styled.img`
  height: 40px;
  width: auto;
  filter: drop-shadow(0 2px 8px rgba(236, 72, 153, 0.3));
  
  @media (min-width: 768px) {
    height: 50px;
  }
`;

const BrandName = styled.div`
  font-size: 1.8rem;
  font-weight: 900;
  background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.01em;
  
  @media (min-width: 768px) {
    font-size: 2.2rem;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
  
  @media (min-width: 768px) {
    font-size: 3.5rem;
  }
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  line-height: 1.6;
  
  @media (min-width: 768px) {
    font-size: 1.2rem;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(4, 1fr);
  }
  
  @media (min-width: 768px) {
    gap: 1.5rem;
    margin-bottom: 3rem;
  }
`;

const StatCard = styled.div`
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1.25rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: ${slideInUp} 0.6s ease-out;
  animation-fill-mode: both;
  position: relative;
  overflow: hidden;
  
  @media (min-width: 768px) {
    padding: 2rem;
    border-radius: 20px;
  }
  
  &:nth-child(1) { animation-delay: 0.1s; }
  &:nth-child(2) { animation-delay: 0.2s; }
  &:nth-child(3) { animation-delay: 0.3s; }
  &:nth-child(4) { animation-delay: 0.4s; }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(236, 72, 153, 0.2);
    border-color: rgba(236, 72, 153, 0.3);
  }
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%);
  }
`;

const StatIcon = styled.div`
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
  
  @media (min-width: 768px) {
    width: 50px;
    height: 50px;
    font-size: 1.8rem;
  }
`;

const StatValue = styled.div`
  font-size: 1.8rem;
  font-weight: 800;
  background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.25rem;
  
  @media (min-width: 768px) {
    font-size: 2.5rem;
  }
`;

const StatLabel = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  @media (min-width: 768px) {
    font-size: 0.9rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 800;
  color: white;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
  z-index: 1;
  
  @media (min-width: 768px) {
    font-size: 2.2rem;
    margin-bottom: 2rem;
  }
`;

const MealPlanSection = styled.div`
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
  animation: ${slideInUp} 0.6s ease-out 0.5s both;
  
  @media (min-width: 768px) {
    margin-bottom: 3rem;
  }
`;

const MealPlanCard = styled.div`
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  
  @media (min-width: 768px) {
    padding: 3rem;
    border-radius: 24px;
  }
`;

const MealPlanHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 2rem;
  
  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const MealPlanTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: white;
  
  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
`;

const MealPlanDate = styled.span`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  background: rgba(236, 72, 153, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  
  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

const MealGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
  }
`;

const MealCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.25rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  
  @media (min-width: 768px) {
    padding: 1.5rem;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 32px rgba(236, 72, 153, 0.2);
    border-color: rgba(236, 72, 153, 0.4);
    background: rgba(236, 72, 153, 0.1);
  }
`;

const MealType = styled.div`
  font-weight: 700;
  color: #ec4899;
  margin-bottom: 0.75rem;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  @media (min-width: 768px) {
    font-size: 0.9rem;
  }
`;

const MealName = styled.div`
  color: white;
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 1rem;
  line-height: 1.3;
  
  @media (min-width: 768px) {
    font-size: 1.1rem;
  }
`;

const MealCalories = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  
  &:before {
    content: '🔥';
    font-size: 0.7rem;
  }
  
  @media (min-width: 768px) {
    font-size: 0.9rem;
  }
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  position: relative;
  z-index: 1;
  animation: ${slideInUp} 0.6s ease-out 0.7s both;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 768px) {
    gap: 1.5rem;
  }
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
  border: none;
  color: white;
  padding: 1.25rem 1.5rem;
  border-radius: 16px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 32px rgba(236, 72, 153, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  
  @media (min-width: 768px) {
    padding: 1.5rem 2rem;
    font-size: 1.1rem;
    border-radius: 20px;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 40px rgba(236, 72, 153, 0.5);
    animation: ${pulse} 0.6s ease-in-out;
  }
  
  &:active {
    transform: translateY(-1px);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: rgba(255, 255, 255, 0.6);
  
  @media (min-width: 768px) {
    padding: 4rem 2rem;
  }
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgba(255, 255, 255, 0.5);
`;

const EmptyText = styled.p`
  font-size: 1rem;
  margin-bottom: 1.5rem;
  
  @media (min-width: 768px) {
    font-size: 1.1rem;
  }
`;

const Dashboard: React.FC = () => {
  const { currentPlan, selectedDate } = useMealPlan();
  const navigate = useNavigate();

  // Find the plan for the selected date
  const todayPlan = currentPlan.find(plan => plan.date === selectedDate);

  // Calculate total calories for today
  const totalCalories = todayPlan ? 
    (todayPlan.breakfast?.calories || 0) +
    (todayPlan.lunch?.calories || 0) +
    (todayPlan.dinner?.calories || 0) +
    (todayPlan.snacks?.reduce((sum, snack) => sum + snack.calories, 0) || 0)
    : 0;

  return (
    <DashboardContainer>
      <DashboardHeader>
        <BrandHeader>
          <BrandLogo src="/JMEFIT_black_purple.png" alt="JMEFIT" />
          <BrandName>JMEFIT</BrandName>
        </BrandHeader>
        <Title>Welcome Back!</Title>
        <Subtitle>
          Your personalized nutrition dashboard with JMEFIT. Track your progress and stay on top of your health goals.
        </Subtitle>
      </DashboardHeader>

      <StatsGrid>
        <StatCard>
          <StatIcon>
            <Flame size={24} />
          </StatIcon>
          <StatValue>1,842</StatValue>
          <StatLabel>Calories Today</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon>
            <Dumbbell size={24} />
          </StatIcon>
          <StatValue>45min</StatValue>
          <StatLabel>Workout</StatLabel>
        </StatCard>
      </StatsGrid>

      <MealPlanSection>
        <SectionTitle>
          <UtensilsCrossed size={24} style={{ marginRight: '0.5rem' }} />
          Today's Meal Plan
        </SectionTitle>
        <MealPlanCard>
          <MealPlanHeader>
            <MealPlanTitle>Your Meals</MealPlanTitle>
            <MealPlanDate>{new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'short', 
              day: 'numeric' 
            })}</MealPlanDate>
          </MealPlanHeader>

          {todayPlan ? (
            <MealGrid>
              {todayPlan.breakfast && (
                <MealCard onClick={() => navigate('/meal-planner')}>
                  <MealType>
                    <UtensilsCrossed size={16} style={{ marginRight: '0.5rem' }} />
                    Breakfast
                  </MealType>
                  <MealName>{todayPlan.breakfast.name}</MealName>
                  <MealCalories>{todayPlan.breakfast.calories} calories</MealCalories>
                </MealCard>
              )}
              {todayPlan.lunch && (
                <MealCard onClick={() => navigate('/meal-planner')}>
                  <MealType>
                    <UtensilsCrossed size={16} style={{ marginRight: '0.5rem' }} />
                    Lunch
                  </MealType>
                  <MealName>{todayPlan.lunch.name}</MealName>
                  <MealCalories>{todayPlan.lunch.calories} calories</MealCalories>
                </MealCard>
              )}
              {todayPlan.dinner && (
                <MealCard onClick={() => navigate('/meal-planner')}>
                  <MealType>
                    <UtensilsCrossed size={16} style={{ marginRight: '0.5rem' }} />
                    Dinner
                  </MealType>
                  <MealName>{todayPlan.dinner.name}</MealName>
                  <MealCalories>{todayPlan.dinner.calories} calories</MealCalories>
                </MealCard>
              )}
              {todayPlan.snacks?.map((snack, index) => (
                <MealCard key={snack.id || index} onClick={() => navigate('/meal-planner')}>
                  <MealType>
                    <Apple size={16} style={{ marginRight: '0.5rem' }} />
                    Snack {index + 1}
                  </MealType>
                  <MealName>{snack.name}</MealName>
                  <MealCalories>{snack.calories} calories</MealCalories>
                </MealCard>
              ))}
            </MealGrid>
          ) : (
            <EmptyState>
              <EmptyIcon>
                <UtensilsCrossed size={48} />
              </EmptyIcon>
              <EmptyText>No meal plan for today.</EmptyText>
              <ActionButton onClick={() => navigate('/meal-planner')}>
                <Target size={20} style={{ marginRight: '0.5rem' }} />
                Create Meal Plan
              </ActionButton>
            </EmptyState>
          )}
        </MealPlanCard>
      </MealPlanSection>

      <QuickActions>
        <ActionButton onClick={() => navigate('/meal-planner')}>
          <Calendar size={20} style={{ marginRight: '0.5rem' }} />
          Plan Your Week
        </ActionButton>
        <ActionButton onClick={() => navigate('/progress')}>
          <BarChart3 size={20} style={{ marginRight: '0.5rem' }} />
          View Progress
        </ActionButton>
      </QuickActions>
    </DashboardContainer>
  );
};

export default Dashboard;
