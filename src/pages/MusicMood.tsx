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

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SectionCard = styled.div`
  background-color: white;
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  height: 100%;
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.text};
`;

const MoodSelector = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
`;

const MoodButton = styled.button<{ active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background-color: ${({ active, theme }) => 
    active ? `${theme.colors.primary}20` : 'transparent'};
  border: 2px solid ${({ active, theme }) => 
    active ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.primary}10;
  }
`;

const MoodEmoji = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const MoodLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 500;
`;

const PlaylistContainer = styled.div`
  margin-top: 2rem;
`;

const PlaylistCard = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  margin-bottom: 1rem;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary}10;
  }
`;

const PlaylistCover = styled.div`
  width: 60px;
  height: 60px;
  background-color: ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  margin-right: 1rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

const PlaylistInfo = styled.div`
  flex: 1;
`;

const PlaylistTitle = styled.h4`
  font-size: ${({ theme }) => theme.fontSizes.md};
  margin-bottom: 0.25rem;
`;

const PlaylistDescription = styled.p`
  color: ${({ theme }) => theme.colors.lightText};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const PlayButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const MoodTrackerContainer = styled.div`
  margin-top: 1.5rem;
`;

const MoodEntryForm = styled.div`
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  font-family: inherit;
  font-size: ${({ theme }) => theme.fontSizes.md};
  resize: vertical;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}30;
  }
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: 500;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const MoodHistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MoodHistoryItem = styled.div`
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
`;

const MoodHistoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const MoodHistoryDate = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.lightText};
`;

const MoodHistoryMood = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const MoodHistoryNote = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const MusicMood: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodNote, setMoodNote] = useState('');
  
  // Mock data for demonstration
  const moods = [
    { emoji: '😊', label: 'Happy' },
    { emoji: '😌', label: 'Calm' },
    { emoji: '🔋', label: 'Energetic' },
    { emoji: '😔', label: 'Sad' },
    { emoji: '😤', label: 'Stressed' },
    { emoji: '😴', label: 'Tired' }
  ];
  
  const playlists = [
    {
      title: 'Upbeat Morning Energy',
      description: 'Start your day with energizing tracks',
      emoji: '🌞'
    },
    {
      title: 'Calm Focus',
      description: 'Concentration music for productive work',
      emoji: '🧠'
    },
    {
      title: 'Workout Motivation',
      description: 'High-energy beats for exercise',
      emoji: '💪'
    },
    {
      title: 'Evening Relaxation',
      description: 'Wind down with soothing melodies',
      emoji: '🌙'
    }
  ];
  
  const moodHistory = [
    {
      date: 'Today, 9:15 AM',
      mood: 'Energetic',
      emoji: '🔋',
      note: 'Feeling great after my morning workout and protein smoothie!'
    },
    {
      date: 'Yesterday, 6:30 PM',
      mood: 'Calm',
      emoji: '😌',
      note: 'Relaxed after a balanced dinner and meditation session.'
    },
    {
      date: 'May 12, 2:45 PM',
      mood: 'Stressed',
      emoji: '😤',
      note: 'Work deadline approaching, need to remember to take breaks and stay hydrated.'
    }
  ];
  
  const handleMoodSubmit = () => {
    if (selectedMood && moodNote.trim()) {
      alert(`Mood logged: ${selectedMood} - ${moodNote}`);
      setMoodNote('');
    }
  };
  
  return (
    <PageContainer>
      <PageHeader>
        <Title>Music & Mood</Title>
        <Subtitle>Track your mood and discover music to match</Subtitle>
      </PageHeader>
      
      <ContentGrid>
        <SectionCard>
          <SectionTitle>Music Recommendations</SectionTitle>
          
          <div>
            <Label>How are you feeling today?</Label>
            <MoodSelector>
              {moods.map((mood, index) => (
                <MoodButton 
                  key={index} 
                  active={selectedMood === mood.label}
                  onClick={() => setSelectedMood(mood.label)}
                >
                  <MoodEmoji>{mood.emoji}</MoodEmoji>
                  <MoodLabel>{mood.label}</MoodLabel>
                </MoodButton>
              ))}
            </MoodSelector>
          </div>
          
          <PlaylistContainer>
            <Label>Recommended Playlists</Label>
            {playlists.map((playlist, index) => (
              <PlaylistCard key={index}>
                <PlaylistCover>{playlist.emoji}</PlaylistCover>
                <PlaylistInfo>
                  <PlaylistTitle>{playlist.title}</PlaylistTitle>
                  <PlaylistDescription>{playlist.description}</PlaylistDescription>
                </PlaylistInfo>
                <PlayButton>▶</PlayButton>
              </PlaylistCard>
            ))}
          </PlaylistContainer>
        </SectionCard>
        
        <SectionCard>
          <SectionTitle>Mood Tracker</SectionTitle>
          
          <MoodEntryForm>
            <FormGroup>
              <Label>Log your mood and thoughts</Label>
              <TextArea 
                placeholder="How are you feeling today? Any connection to your nutrition or activities?"
                value={moodNote}
                onChange={(e) => setMoodNote(e.target.value)}
              />
            </FormGroup>
            
            <Button onClick={handleMoodSubmit} disabled={!selectedMood || !moodNote.trim()}>
              Log Mood
            </Button>
          </MoodEntryForm>
          
          <MoodTrackerContainer>
            <Label>Recent Mood History</Label>
            <MoodHistoryList>
              {moodHistory.map((entry, index) => (
                <MoodHistoryItem key={index}>
                  <MoodHistoryHeader>
                    <MoodHistoryDate>{entry.date}</MoodHistoryDate>
                    <MoodHistoryMood>
                      {entry.emoji} {entry.mood}
                    </MoodHistoryMood>
                  </MoodHistoryHeader>
                  <MoodHistoryNote>{entry.note}</MoodHistoryNote>
                </MoodHistoryItem>
              ))}
            </MoodHistoryList>
          </MoodTrackerContainer>
        </SectionCard>
      </ContentGrid>
    </PageContainer>
  );
};

export default MusicMood;
