import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

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

const PageContainer = styled.div`
  padding: 1rem;
  padding-bottom: 6rem; /* Space for mobile footer */
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

const PageHeader = styled.div`
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

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  
  @media (min-width: 768px) {
    margin-bottom: 3rem;
    overflow-x: visible;
  }
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 1rem 1.25rem;
  background: none;
  border: none;
  border-bottom: 3px solid ${({ active }) => 
    active ? '#ec4899' : 'transparent'};
  color: ${({ active }) => 
    active ? '#ec4899' : 'rgba(255, 255, 255, 0.6)'};
  font-weight: ${({ active }) => active ? '700' : '500'};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  min-width: max-content;
  
  @media (min-width: 768px) {
    padding: 1rem 2rem;
    font-size: 1rem;
  }
  
  &:hover {
    color: #ec4899;
  }
`;

const ChartContainer = styled.div`
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  margin-bottom: 2rem;
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  animation: ${slideInUp} 0.6s ease-out 0.3s both;
  
  @media (min-width: 768px) {
    height: 300px;
    padding: 3rem;
    border-radius: 24px;
    margin-bottom: 3rem;
  }
`;

const ChartPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  
  div:first-child {
    font-size: 3rem;
    margin-bottom: 1rem;
    
    @media (min-width: 768px) {
      font-size: 4rem;
    }
  }
  
  div:last-child {
    font-size: 1rem;
    
    @media (min-width: 768px) {
      font-size: 1.1rem;
    }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    margin-bottom: 3rem;
  }
`;

const StatCard = styled.div`
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  text-align: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: ${slideInUp} 0.6s ease-out;
  animation-fill-mode: both;
  position: relative;
  overflow: hidden;
  
  @media (min-width: 768px) {
    padding: 2rem;
    border-radius: 20px;
  }
  
  &:nth-child(1) { animation-delay: 0.4s; }
  &:nth-child(2) { animation-delay: 0.5s; }
  &:nth-child(3) { animation-delay: 0.6s; }
  
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

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
  
  @media (min-width: 768px) {
    font-size: 2.5rem;
  }
`;

const StatLabel = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.85rem;
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

const HistoryContainer = styled.div`
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  position: relative;
  z-index: 1;
  animation: ${slideInUp} 0.6s ease-out 0.7s both;
  
  @media (min-width: 768px) {
    padding: 3rem;
    border-radius: 24px;
  }
`;

const HistoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (min-width: 768px) {
    padding: 1.5rem 0;
  }
`;

const HistoryDate = styled.div`
  font-weight: 600;
  color: white;
  font-size: 0.9rem;
  
  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

const HistoryValue = styled.div<{ positive?: boolean }>`
  color: ${({ positive }) => 
    positive ? '#10b981' : '#ef4444'};
  font-weight: 600;
  font-size: 0.9rem;
  text-align: right;
  
  @media (min-width: 768px) {
    font-size: 1rem;
  }
  
  span:first-child {
    color: white;
    margin-right: 0.5rem;
  }
`;

const Progress: React.FC = () => {
  const [activeTab, setActiveTab] = useState('weight');
  
  // Mock data for demonstration
  const weightHistory = [
    { date: 'May 14, 2025', value: '185.2 lbs', change: '-0.8 lbs', positive: true },
    { date: 'May 7, 2025', value: '186.0 lbs', change: '-1.2 lbs', positive: true },
    { date: 'Apr 30, 2025', value: '187.2 lbs', change: '-0.5 lbs', positive: true },
    { date: 'Apr 23, 2025', value: '187.7 lbs', change: '+0.3 lbs', positive: false },
    { date: 'Apr 16, 2025', value: '187.4 lbs', change: '-1.1 lbs', positive: true },
  ];
  
  const calorieHistory = [
    { date: 'May 14, 2025', value: '2,150 cal', change: '-50 cal', positive: true },
    { date: 'May 13, 2025', value: '2,200 cal', change: '+100 cal', positive: false },
    { date: 'May 12, 2025', value: '2,100 cal', change: '-200 cal', positive: true },
    { date: 'May 11, 2025', value: '2,300 cal', change: '+150 cal', positive: false },
    { date: 'May 10, 2025', value: '2,150 cal', change: '-50 cal', positive: true },
  ];
  
  const workoutHistory = [
    { date: 'May 14, 2025', value: '45 min', change: '+5 min', positive: true },
    { date: 'May 12, 2025', value: '40 min', change: '+10 min', positive: true },
    { date: 'May 10, 2025', value: '30 min', change: '-15 min', positive: false },
    { date: 'May 8, 2025', value: '45 min', change: '+15 min', positive: true },
    { date: 'May 6, 2025', value: '30 min', change: '0 min', positive: true },
  ];
  
  const renderHistory = () => {
    let history;
    
    switch (activeTab) {
      case 'weight':
        history = weightHistory;
        break;
      case 'calories':
        history = calorieHistory;
        break;
      case 'workouts':
        history = workoutHistory;
        break;
      default:
        history = weightHistory;
    }
    
    return (
      <HistoryContainer>
        {history.map((item, index) => (
          <HistoryItem key={index}>
            <HistoryDate>{item.date}</HistoryDate>
            <div>
              <span>{item.value}</span>
              {' '}
              <HistoryValue positive={item.positive}>
                ({item.change})
              </HistoryValue>
            </div>
          </HistoryItem>
        ))}
      </HistoryContainer>
    );
  };
  
  return (
    <PageContainer>
      <PageHeader>
        <Title>Progress Tracking</Title>
        <Subtitle>Monitor your health and fitness journey</Subtitle>
      </PageHeader>
      
      <TabsContainer>
        <Tab 
          active={activeTab === 'weight'} 
          onClick={() => setActiveTab('weight')}
        >
          Weight
        </Tab>
        <Tab 
          active={activeTab === 'calories'} 
          onClick={() => setActiveTab('calories')}
        >
          Calories
        </Tab>
        <Tab 
          active={activeTab === 'workouts'} 
          onClick={() => setActiveTab('workouts')}
        >
          Workouts
        </Tab>
        <Tab 
          active={activeTab === 'measurements'} 
          onClick={() => setActiveTab('measurements')}
        >
          Measurements
        </Tab>
      </TabsContainer>
      
      <ChartContainer>
        <ChartPlaceholder>
          <div>📊</div>
          <div>Chart visualization would appear here</div>
        </ChartPlaceholder>
      </ChartContainer>
      
      <StatsGrid>
        <StatCard>
          <StatValue>
            {activeTab === 'weight' && '185.2 lbs'}
            {activeTab === 'calories' && '2,150'}
            {activeTab === 'workouts' && '3.5 hrs'}
            {activeTab === 'measurements' && '34"'}
          </StatValue>
          <StatLabel>
            {activeTab === 'weight' && 'Current Weight'}
            {activeTab === 'calories' && 'Daily Average'}
            {activeTab === 'workouts' && 'Weekly Total'}
            {activeTab === 'measurements' && 'Waist'}
          </StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>
            {activeTab === 'weight' && '-3.8 lbs'}
            {activeTab === 'calories' && '2,200'}
            {activeTab === 'workouts' && '45 min'}
            {activeTab === 'measurements' && '-2"'}
          </StatValue>
          <StatLabel>
            {activeTab === 'weight' && 'Monthly Change'}
            {activeTab === 'calories' && 'Target'}
            {activeTab === 'workouts' && 'Avg. Duration'}
            {activeTab === 'measurements' && 'Change'}
          </StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>
            {activeTab === 'weight' && '175 lbs'}
            {activeTab === 'calories' && '15,050'}
            {activeTab === 'workouts' && '12'}
            {activeTab === 'measurements' && '32"'}
          </StatValue>
          <StatLabel>
            {activeTab === 'weight' && 'Goal Weight'}
            {activeTab === 'calories' && 'Weekly Total'}
            {activeTab === 'workouts' && 'Monthly Count'}
            {activeTab === 'measurements' && 'Goal'}
          </StatLabel>
        </StatCard>
      </StatsGrid>
      
      <SectionTitle>
        <span>📈</span>
        Recent History
      </SectionTitle>
      {renderHistory()}
    </PageContainer>
  );
};

export default Progress;
