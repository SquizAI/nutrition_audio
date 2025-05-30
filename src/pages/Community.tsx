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

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 2rem;
  overflow-x: auto;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 3px solid ${({ active, theme }) => 
    active ? theme.colors.primary : 'transparent'};
  color: ${({ active, theme }) => 
    active ? theme.colors.primary : theme.colors.lightText};
  font-weight: ${({ active }) => active ? 'bold' : 'normal'};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  white-space: nowrap;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ContentContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FeedContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const PostCard = styled.div`
  background-color: white;
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  margin-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-weight: 500;
`;

const PostTime = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.lightText};
`;

const PostContent = styled.div`
  margin-bottom: 1rem;
`;

const PostImage = styled.div`
  width: 100%;
  height: 200px;
  background-color: ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.lightText};
`;

const PostActions = styled.div`
  display: flex;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.lightText};
  cursor: pointer;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SidebarCard = styled.div`
  background-color: white;
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const SidebarTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  margin-bottom: 1rem;
`;

const TrendingList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const TrendingItem = styled.li`
  padding: 0.75rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const TrendingTag = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 500;
`;

const TrendingCount = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.lightText};
  margin-left: 0.5rem;
`;

const EventList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const EventCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 1rem;
`;

const EventDate = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const EventTitle = styled.div`
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const EventDetails = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.lightText};
`;

const NewPostCard = styled.div`
  background-color: white;
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  margin-bottom: 1.5rem;
`;

const PostInput = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  font-family: inherit;
  font-size: ${({ theme }) => theme.fontSizes.md};
  resize: none;
  margin-bottom: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const PostButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const PostAttachments = styled.div`
  display: flex;
  gap: 1rem;
`;

const AttachmentButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.lightText};
  cursor: pointer;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const PostButton = styled.button`
  padding: 0.5rem 1.5rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const Community: React.FC = () => {
  const [activeTab, setActiveTab] = useState('feed');
  const [postContent, setPostContent] = useState('');
  
  // Mock data for demonstration
  const posts = [
    {
      id: 1,
      user: 'Alex Johnson',
      avatar: 'AJ',
      time: '2 hours ago',
      content: 'Just completed my first week of meal prepping! It\'s been a game changer for my nutrition goals. Anyone else have meal prep tips to share?',
      likes: 24,
      comments: 8
    },
    {
      id: 2,
      user: 'Morgan Smith',
      avatar: 'MS',
      time: '5 hours ago',
      content: 'Hit a new personal record at the gym today! 💪 Feeling stronger every day with my new nutrition plan.',
      image: true,
      likes: 42,
      comments: 12
    },
    {
      id: 3,
      user: 'Jamie Lee',
      avatar: 'JL',
      time: '1 day ago',
      content: 'Looking for recommendations on high-protein vegetarian recipes. I\'m trying to increase my protein intake while reducing meat consumption. Any suggestions?',
      likes: 18,
      comments: 15
    }
  ];
  
  const trendingTopics = [
    { tag: '#MealPrep', count: 1.2 },
    { tag: '#ProteinRecipes', count: 0.9 },
    { tag: '#NutritionGoals', count: 0.8 },
    { tag: '#WeightLossJourney', count: 0.7 },
    { tag: '#HealthySnacks', count: 0.5 }
  ];
  
  const upcomingEvents = [
    {
      id: 1,
      date: 'May 20, 2025',
      title: 'Virtual Cooking Class: Healthy Meal Prep',
      details: 'Online • 7:00 PM EST'
    },
    {
      id: 2,
      date: 'May 25, 2025',
      title: 'Nutrition Q&A with Registered Dietitian',
      details: 'Online • 6:30 PM EST'
    },
    {
      id: 3,
      date: 'June 2, 2025',
      title: 'Summer Fitness Challenge Kickoff',
      details: 'Online • All Day Event'
    }
  ];
  
  const handlePostSubmit = () => {
    if (postContent.trim()) {
      alert('Post submitted: ' + postContent);
      setPostContent('');
    }
  };
  
  return (
    <PageContainer>
      <PageHeader>
        <Title>Community</Title>
        <Subtitle>Connect with others on their nutrition journey</Subtitle>
      </PageHeader>
      
      <TabsContainer>
        <Tab 
          active={activeTab === 'feed'} 
          onClick={() => setActiveTab('feed')}
        >
          Feed
        </Tab>
        <Tab 
          active={activeTab === 'groups'} 
          onClick={() => setActiveTab('groups')}
        >
          Groups
        </Tab>
        <Tab 
          active={activeTab === 'challenges'} 
          onClick={() => setActiveTab('challenges')}
        >
          Challenges
        </Tab>
        <Tab 
          active={activeTab === 'events'} 
          onClick={() => setActiveTab('events')}
        >
          Events
        </Tab>
        <Tab 
          active={activeTab === 'recipes'} 
          onClick={() => setActiveTab('recipes')}
        >
          Recipes
        </Tab>
      </TabsContainer>
      
      <ContentContainer>
        <FeedContainer>
          <NewPostCard>
            <PostInput 
              placeholder="Share your thoughts, recipes, or progress..."
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            />
            <PostButtonsContainer>
              <PostAttachments>
                <AttachmentButton>
                  📷 Photo
                </AttachmentButton>
                <AttachmentButton>
                  📊 Progress
                </AttachmentButton>
                <AttachmentButton>
                  🍽️ Recipe
                </AttachmentButton>
              </PostAttachments>
              <PostButton onClick={handlePostSubmit}>
                Post
              </PostButton>
            </PostButtonsContainer>
          </NewPostCard>
          
          {posts.map(post => (
            <PostCard key={post.id}>
              <PostHeader>
                <Avatar>{post.avatar}</Avatar>
                <UserInfo>
                  <UserName>{post.user}</UserName>
                  <PostTime>{post.time}</PostTime>
                </UserInfo>
              </PostHeader>
              <PostContent>{post.content}</PostContent>
              {post.image && (
                <PostImage>
                  [Image would be displayed here]
                </PostImage>
              )}
              <PostActions>
                <ActionButton>
                  👍 Like ({post.likes})
                </ActionButton>
                <ActionButton>
                  💬 Comment ({post.comments})
                </ActionButton>
                <ActionButton>
                  🔄 Share
                </ActionButton>
              </PostActions>
            </PostCard>
          ))}
        </FeedContainer>
        
        <SidebarContainer>
          <SidebarCard>
            <SidebarTitle>Trending Topics</SidebarTitle>
            <TrendingList>
              {trendingTopics.map((topic, index) => (
                <TrendingItem key={index}>
                  <TrendingTag>{topic.tag}</TrendingTag>
                  <TrendingCount>{topic.count}k posts</TrendingCount>
                </TrendingItem>
              ))}
            </TrendingList>
          </SidebarCard>
          
          <SidebarCard>
            <SidebarTitle>Upcoming Events</SidebarTitle>
            <EventList>
              {upcomingEvents.map(event => (
                <EventCard key={event.id}>
                  <EventDate>{event.date}</EventDate>
                  <EventTitle>{event.title}</EventTitle>
                  <EventDetails>{event.details}</EventDetails>
                </EventCard>
              ))}
            </EventList>
          </SidebarCard>
        </SidebarContainer>
      </ContentContainer>
    </PageContainer>
  );
};

export default Community;
