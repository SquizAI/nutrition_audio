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

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProfileSidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ProfileCard = styled.div`
  background-color: white;
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const ProfilePhotoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 0;
`;

const ProfilePhoto = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const ProfileName = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  text-align: center;
  margin-bottom: 0.25rem;
`;

const ProfileBio = styled.p`
  color: ${({ theme }) => theme.colors.lightText};
  text-align: center;
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const ProfileStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 1.5rem;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.lightText};
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.text};
`;

const ProfileContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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

const FormCard = styled.div`
  background-color: white;
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}30;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}30;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  resize: vertical;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}30;
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
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

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('personal');
  
  // Mock user data
  const user = {
    name: 'Alex Johnson',
    initials: 'AJ',
    bio: 'Fitness enthusiast and nutrition explorer',
    daysActive: 45,
    streakDays: 12,
    height: 69,
    weight: 154,
    age: 32,
    gender: 'Male',
    email: 'alex.johnson@example.com',
    goal: 'Weight maintenance',
    activityLevel: 'Moderate',
    dietaryPreferences: ['Balanced', 'Low sugar'],
    allergies: ['Peanuts'],
    medicalConditions: ['None'],
    medications: ['None'],
    waterIntake: '2.5L daily',
    sleepHours: '7-8 hours',
    stressLevel: 'Moderate'
  };
  
  return (
    <PageContainer>
      <PageHeader>
        <Title>Profile</Title>
        <Subtitle>Manage your account and preferences</Subtitle>
      </PageHeader>
      
      <ProfileGrid>
        <ProfileSidebar>
          <ProfileCard>
            <ProfilePhotoContainer>
              <ProfilePhoto>{user.initials}</ProfilePhoto>
              <ProfileName>{user.name}</ProfileName>
              <ProfileBio>{user.bio}</ProfileBio>
            </ProfilePhotoContainer>
            
            <ProfileStats>
              <StatItem>
                <StatValue>{user.daysActive}</StatValue>
                <StatLabel>Days Active</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{user.streakDays}</StatValue>
                <StatLabel>Day Streak</StatLabel>
              </StatItem>
            </ProfileStats>
          </ProfileCard>
          
          <ProfileCard>
            <SectionTitle>Quick Stats</SectionTitle>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Height</span>
                <span>{user.height} inches</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Weight</span>
                <span>{user.weight} pounds</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>BMI</span>
                <span>{(user.weight / ((user.height / 100) ** 2)).toFixed(1)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Goal</span>
                <span>{user.goal}</span>
              </div>
            </div>
          </ProfileCard>
        </ProfileSidebar>
        
        <ProfileContent>
          <TabsContainer>
            <Tab 
              active={activeTab === 'personal'} 
              onClick={() => setActiveTab('personal')}
            >
              Personal Info
            </Tab>
            <Tab 
              active={activeTab === 'health'} 
              onClick={() => setActiveTab('health')}
            >
              Health Profile
            </Tab>
            <Tab 
              active={activeTab === 'preferences'} 
              onClick={() => setActiveTab('preferences')}
            >
              Preferences
            </Tab>
            <Tab 
              active={activeTab === 'settings'} 
              onClick={() => setActiveTab('settings')}
            >
              Settings
            </Tab>
          </TabsContainer>
          
          {activeTab === 'personal' && (
            <FormCard>
              <SectionTitle>Personal Information</SectionTitle>
              
              <FormGroup>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" type="text" defaultValue={user.name} />
              </FormGroup>
              
              <FormRow>
                <FormGroup>
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" type="number" defaultValue={user.age} />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="gender">Gender</Label>
                  <Select id="gender" defaultValue={user.gender}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </Select>
                </FormGroup>
              </FormRow>
              
              <FormGroup>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={user.email} />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="bio">Bio</Label>
                <TextArea id="bio" defaultValue={user.bio} />
              </FormGroup>
              
              <Button>Save Changes</Button>
            </FormCard>
          )}
          
          {activeTab === 'health' && (
            <FormCard>
              <SectionTitle>Health Information</SectionTitle>
              
              <FormRow>
                <FormGroup>
                  <Label htmlFor="height">Height (inches)</Label>
                  <Input id="height" type="number" defaultValue={user.height} />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="weight">Weight (pounds)</Label>
                  <Input id="weight" type="number" defaultValue={user.weight} />
                </FormGroup>
              </FormRow>
              
              <FormGroup>
                <Label htmlFor="goal">Goal</Label>
                <Select id="goal" defaultValue={user.goal}>
                  <option value="Weight loss">Weight loss</option>
                  <option value="Weight gain">Weight gain</option>
                  <option value="Weight maintenance">Weight maintenance</option>
                  <option value="Muscle gain">Muscle gain</option>
                  <option value="Overall health">Overall health</option>
                </Select>
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="activity">Activity Level</Label>
                <Select id="activity" defaultValue={user.activityLevel}>
                  <option value="Sedentary">Sedentary</option>
                  <option value="Light">Light</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Active">Active</option>
                  <option value="Very Active">Very Active</option>
                </Select>
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="medical">Medical Conditions</Label>
                <TextArea id="medical" defaultValue={user.medicalConditions.join(', ')} />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="medications">Medications</Label>
                <TextArea id="medications" defaultValue={user.medications.join(', ')} />
              </FormGroup>
              
              <Button>Save Changes</Button>
            </FormCard>
          )}
          
          {activeTab === 'preferences' && (
            <FormCard>
              <SectionTitle>Dietary Preferences</SectionTitle>
              
              <FormGroup>
                <Label htmlFor="diet">Dietary Preferences</Label>
                <Select id="diet" multiple defaultValue={user.dietaryPreferences}>
                  <option value="Balanced">Balanced</option>
                  <option value="Low carb">Low carb</option>
                  <option value="Low fat">Low fat</option>
                  <option value="High protein">High protein</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Keto">Keto</option>
                  <option value="Paleo">Paleo</option>
                  <option value="Mediterranean">Mediterranean</option>
                  <option value="Low sugar">Low sugar</option>
                </Select>
                <small style={{ display: 'block', marginTop: '0.25rem', color: '#666' }}>
                  Hold Ctrl (or Cmd on Mac) to select multiple options
                </small>
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="allergies">Allergies & Intolerances</Label>
                <TextArea id="allergies" defaultValue={user.allergies.join(', ')} />
              </FormGroup>
              
              <SectionTitle>Lifestyle Preferences</SectionTitle>
              
              <FormGroup>
                <Label htmlFor="water">Daily Water Intake Target</Label>
                <Input id="water" type="text" defaultValue={user.waterIntake} />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="sleep">Sleep Hours Target</Label>
                <Input id="sleep" type="text" defaultValue={user.sleepHours} />
              </FormGroup>
              
              <Button>Save Changes</Button>
            </FormCard>
          )}
          
          {activeTab === 'settings' && (
            <FormCard>
              <SectionTitle>Account Settings</SectionTitle>
              
              <FormGroup>
                <Label htmlFor="password">Change Password</Label>
                <Input id="password" type="password" placeholder="New password" />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input id="confirm-password" type="password" placeholder="Confirm new password" />
              </FormGroup>
              
              <SectionTitle>Notification Preferences</SectionTitle>
              
              <FormGroup>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <input type="checkbox" id="email-notifications" defaultChecked />
                  <Label htmlFor="email-notifications" style={{ marginBottom: 0, marginLeft: '0.5rem' }}>
                    Email Notifications
                  </Label>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <input type="checkbox" id="push-notifications" defaultChecked />
                  <Label htmlFor="push-notifications" style={{ marginBottom: 0, marginLeft: '0.5rem' }}>
                    Push Notifications
                  </Label>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <input type="checkbox" id="reminder-notifications" defaultChecked />
                  <Label htmlFor="reminder-notifications" style={{ marginBottom: 0, marginLeft: '0.5rem' }}>
                    Daily Reminders
                  </Label>
                </div>
              </FormGroup>
              
              <Button>Save Changes</Button>
              
              <hr style={{ margin: '2rem 0' }} />
              
              <SectionTitle>Danger Zone</SectionTitle>
              <p style={{ color: '#666', marginBottom: '1rem' }}>
                These actions are irreversible. Please proceed with caution.
              </p>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button style={{ 
                  padding: '0.75rem 1.5rem', 
                  backgroundColor: 'transparent',
                  color: '#f44336',
                  border: '1px solid #f44336',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}>
                  Delete All Data
                </button>
                
                <button style={{ 
                  padding: '0.75rem 1.5rem', 
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}>
                  Delete Account
                </button>
              </div>
            </FormCard>
          )}
        </ProfileContent>
      </ProfileGrid>
    </PageContainer>
  );
};

export default Profile;
