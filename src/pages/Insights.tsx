import React, { useState } from 'react';
import styled from 'styled-components';

const PageContainer = styled.div`
  padding: 1rem;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.lightText};
`;

const InsightsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const InsightCard = styled.div`
  background-color: white;
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const InsightHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const InsightTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.text};
`;

const InsightIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary}20;
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
`;

const InsightContent = styled.div`
  margin-bottom: 1rem;
`;

const InsightValue = styled.div`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 0.5rem;
`;

const InsightDescription = styled.p`
  color: ${({ theme }) => theme.colors.lightText};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const InsightFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.lightText};
`;

const InsightTrend = styled.span<{ positive?: boolean }>`
  color: ${({ positive, theme }) => 
    positive ? theme.colors.success : theme.colors.error};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.text};
`;

const RecommendationsContainer = styled.div`
  background-color: white;
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  margin-bottom: 2rem;
`;

const RecommendationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const RecommendationItem = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
`;

const RecommendationIcon = styled.div`
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary}20;
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
`;

const RecommendationContent = styled.div`
  flex: 1;
`;

const RecommendationTitle = styled.h4`
  font-size: ${({ theme }) => theme.fontSizes.md};
  margin-bottom: 0.25rem;
`;

const RecommendationDescription = styled.p`
  color: ${({ theme }) => theme.colors.lightText};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const ChartContainer = styled.div`
  background-color: white;
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  margin-bottom: 2rem;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ChartPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.lightText};
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 1.5rem;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 0.75rem 1.25rem;
  background: none;
  border: none;
  border-bottom: 3px solid ${({ active, theme }) => 
    active ? theme.colors.primary : 'transparent'};
  color: ${({ active, theme }) => 
    active ? theme.colors.primary : theme.colors.lightText};
  font-weight: ${({ active }) => active ? 'bold' : 'normal'};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Insights: React.FC = () => {
  const [activeTab, setActiveTab] = useState('week');
  
  // Mock data for demonstration
  const insights = [
    {
      title: 'Calorie Balance',
      icon: '🔥',
      value: '-250 cal',
      description: 'Average daily calorie deficit',
      trend: '+50 cal from last week',
      positive: true
    },
    {
      title: 'Protein Intake',
      icon: '🥩',
      value: '110g',
      description: 'Average daily protein consumption',
      trend: '+15g from last week',
      positive: true
    },
    {
      title: 'Carb Intake',
      icon: '🍚',
      value: '180g',
      description: 'Average daily carbohydrate consumption',
      trend: '-20g from last week',
      positive: true
    },
    {
      title: 'Fat Intake',
      icon: '🥑',
      value: '65g',
      description: 'Average daily fat consumption',
      trend: '-5g from last week',
      positive: true
    },
    {
      title: 'Water Intake',
      icon: '💧',
      value: '2.4L',
      description: 'Average daily water consumption',
      trend: '+0.2L from last week',
      positive: true
    },
    {
      title: 'Sleep Quality',
      icon: '😴',
      value: '7.5 hrs',
      description: 'Average nightly sleep duration',
      trend: '+0.3 hrs from last week',
      positive: true
    }
  ];
  
  const recommendations = [
    {
      icon: '🥦',
      title: 'Increase vegetable intake',
      description: 'You\'re currently averaging 2 servings per day. Try to aim for 5 servings for optimal nutrition.'
    },
    {
      icon: '💧',
      title: 'Drink more water before meals',
      description: 'Drinking water 30 minutes before meals can help with portion control and digestion.'
    },
    {
      icon: '🥜',
      title: 'Add more healthy fats',
      description: 'Your omega-3 intake is lower than recommended. Consider adding more nuts, seeds, and fatty fish.'
    },
    {
      icon: '🧂',
      title: 'Reduce sodium intake',
      description: 'Your sodium consumption is higher than recommended. Try to limit processed foods and added salt.'
    }
  ];
  
  return (
    <PageContainer>
      <PageHeader>
        <Title>Nutrition Insights</Title>
        <Subtitle>Data-driven recommendations for your health journey</Subtitle>
      </PageHeader>
      
      <TabsContainer>
        <Tab 
          active={activeTab === 'day'} 
          onClick={() => setActiveTab('day')}
        >
          Today
        </Tab>
        <Tab 
          active={activeTab === 'week'} 
          onClick={() => setActiveTab('week')}
        >
          This Week
        </Tab>
        <Tab 
          active={activeTab === 'month'} 
          onClick={() => setActiveTab('month')}
        >
          This Month
        </Tab>
        <Tab 
          active={activeTab === 'year'} 
          onClick={() => setActiveTab('year')}
        >
          This Year
        </Tab>
      </TabsContainer>
      
      <InsightsGrid>
        {insights.map((insight, index) => (
          <InsightCard key={index}>
            <InsightHeader>
              <InsightTitle>{insight.title}</InsightTitle>
              <InsightIcon>{insight.icon}</InsightIcon>
            </InsightHeader>
            <InsightContent>
              <InsightValue>{insight.value}</InsightValue>
              <InsightDescription>{insight.description}</InsightDescription>
            </InsightContent>
            <InsightFooter>
              <InsightTrend positive={insight.positive}>
                {insight.trend}
              </InsightTrend>
              <span>{activeTab === 'day' ? 'Today' : activeTab === 'week' ? 'This Week' : activeTab === 'month' ? 'This Month' : 'This Year'}</span>
            </InsightFooter>
          </InsightCard>
        ))}
      </InsightsGrid>
      
      <SectionTitle>Nutrition Breakdown</SectionTitle>
      <ChartContainer>
        <ChartPlaceholder>
          <div>📊</div>
          <div>Nutrition breakdown chart would appear here</div>
        </ChartPlaceholder>
      </ChartContainer>
      
      <SectionTitle>Personalized Recommendations</SectionTitle>
      <RecommendationsContainer>
        <RecommendationList>
          {recommendations.map((recommendation, index) => (
            <RecommendationItem key={index}>
              <RecommendationIcon>{recommendation.icon}</RecommendationIcon>
              <RecommendationContent>
                <RecommendationTitle>{recommendation.title}</RecommendationTitle>
                <RecommendationDescription>
                  {recommendation.description}
                </RecommendationDescription>
              </RecommendationContent>
            </RecommendationItem>
          ))}
        </RecommendationList>
      </RecommendationsContainer>
    </PageContainer>
  );
};

export default Insights;
