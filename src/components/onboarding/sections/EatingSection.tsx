import React from 'react';
import styled from 'styled-components';

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
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

const InfoText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.lightText};
  margin-top: 0.5rem;
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

const RadioItem = styled.div`
  display: flex;
  align-items: center;
`;

const RadioLabel = styled.label`
  margin-left: 0.5rem;
  cursor: pointer;
`;

const TimeSelector = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

const TimeButton = styled.button<{ active: boolean }>`
  padding: 0.75rem;
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

const CheckboxContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const CheckboxItem = styled.div`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 0.5rem 1rem;
`;

const CheckboxLabel = styled.label`
  margin-left: 0.5rem;
  cursor: pointer;
`;

interface EatingSectionProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const EatingSection: React.FC<EatingSectionProps> = ({ formData, setFormData }) => {
  // Initialize eating habits if they don't exist
  if (!formData.eatingHabits) {
    setFormData({
      ...formData,
      eatingHabits: {
        mealsPerDay: '3',
        snacksPerDay: '2',
        largestMeal: 'dinner',
        mealTimes: [],
        challenges: []
      }
    });
  }

  const handleMealTimesToggle = (time: string) => {
    const currentTimes = [...(formData.eatingHabits?.mealTimes || [])];
    if (currentTimes.includes(time)) {
      // Remove time if already selected
      setFormData({
        ...formData,
        eatingHabits: {
          ...formData.eatingHabits,
          mealTimes: currentTimes.filter(t => t !== time)
        }
      });
    } else {
      // Add time if not already selected
      setFormData({
        ...formData,
        eatingHabits: {
          ...formData.eatingHabits,
          mealTimes: [...currentTimes, time]
        }
      });
    }
  };

  const handleChallengeToggle = (challenge: string) => {
    const currentChallenges = [...(formData.eatingHabits?.challenges || [])];
    if (currentChallenges.includes(challenge)) {
      // Remove challenge if already selected
      setFormData({
        ...formData,
        eatingHabits: {
          ...formData.eatingHabits,
          challenges: currentChallenges.filter(c => c !== challenge)
        }
      });
    } else {
      // Add challenge if not already selected
      setFormData({
        ...formData,
        eatingHabits: {
          ...formData.eatingHabits,
          challenges: [...currentChallenges, challenge]
        }
      });
    }
  };

  return (
    <div>
      <FormGroup>
        <Label htmlFor="meals-per-day">How many meals do you typically eat per day?</Label>
        <Select 
          id="meals-per-day"
          value={formData.eatingHabits?.mealsPerDay || '3'}
          onChange={(e) => setFormData({
            ...formData,
            eatingHabits: {
              ...formData.eatingHabits,
              mealsPerDay: e.target.value
            }
          })}
        >
          <option value="1">1 meal</option>
          <option value="2">2 meals</option>
          <option value="3">3 meals</option>
          <option value="4">4 meals</option>
          <option value="5">5+ meals</option>
        </Select>
      </FormGroup>

      <FormGroup>
        <Label htmlFor="snacks-per-day">How many snacks do you typically have per day?</Label>
        <Select 
          id="snacks-per-day"
          value={formData.eatingHabits?.snacksPerDay || '2'}
          onChange={(e) => setFormData({
            ...formData,
            eatingHabits: {
              ...formData.eatingHabits,
              snacksPerDay: e.target.value
            }
          })}
        >
          <option value="0">No snacks</option>
          <option value="1">1 snack</option>
          <option value="2">2 snacks</option>
          <option value="3">3 snacks</option>
          <option value="4">4+ snacks</option>
        </Select>
      </FormGroup>

      <FormGroup>
        <Label>Which is typically your largest meal of the day?</Label>
        <RadioGroup>
          <RadioItem>
            <input 
              type="radio" 
              id="largest-breakfast" 
              name="largest-meal" 
              value="breakfast"
              checked={formData.eatingHabits?.largestMeal === 'breakfast'}
              onChange={() => setFormData({
                ...formData,
                eatingHabits: {
                  ...formData.eatingHabits,
                  largestMeal: 'breakfast'
                }
              })}
            />
            <RadioLabel htmlFor="largest-breakfast">Breakfast</RadioLabel>
          </RadioItem>
          <RadioItem>
            <input 
              type="radio" 
              id="largest-lunch" 
              name="largest-meal" 
              value="lunch"
              checked={formData.eatingHabits?.largestMeal === 'lunch'}
              onChange={() => setFormData({
                ...formData,
                eatingHabits: {
                  ...formData.eatingHabits,
                  largestMeal: 'lunch'
                }
              })}
            />
            <RadioLabel htmlFor="largest-lunch">Lunch</RadioLabel>
          </RadioItem>
          <RadioItem>
            <input 
              type="radio" 
              id="largest-dinner" 
              name="largest-meal" 
              value="dinner"
              checked={formData.eatingHabits?.largestMeal === 'dinner'}
              onChange={() => setFormData({
                ...formData,
                eatingHabits: {
                  ...formData.eatingHabits,
                  largestMeal: 'dinner'
                }
              })}
            />
            <RadioLabel htmlFor="largest-dinner">Dinner</RadioLabel>
          </RadioItem>
        </RadioGroup>
      </FormGroup>

      <FormGroup>
        <Label>When do you typically eat? (Select all that apply)</Label>
        <TimeSelector>
          {[
            'Early morning (5-7am)',
            'Morning (7-9am)',
            'Mid-morning (9-11am)',
            'Noon (11am-1pm)',
            'Afternoon (1-4pm)',
            'Evening (4-7pm)',
            'Night (7-10pm)',
            'Late night (after 10pm)'
          ].map((time) => (
            <TimeButton 
              key={time}
              active={(formData.eatingHabits?.mealTimes || []).includes(time)}
              onClick={() => handleMealTimesToggle(time)}
              type="button"
            >
              {time}
            </TimeButton>
          ))}
        </TimeSelector>
      </FormGroup>

      <FormGroup>
        <Label>What eating challenges do you face? (Select all that apply)</Label>
        <CheckboxContainer>
          {[
            'Emotional eating',
            'Late night snacking',
            'Portion control',
            'Meal skipping',
            'Eating too quickly',
            'Mindless eating',
            'Unhealthy food cravings',
            'Eating out frequently',
            'Limited cooking skills',
            'Limited time for meal prep'
          ].map((challenge) => (
            <CheckboxItem key={challenge}>
              <input 
                type="checkbox"
                id={`challenge-${challenge.toLowerCase().replace(/\s+/g, '-')}`}
                checked={(formData.eatingHabits?.challenges || []).includes(challenge)}
                onChange={() => handleChallengeToggle(challenge)}
              />
              <CheckboxLabel htmlFor={`challenge-${challenge.toLowerCase().replace(/\s+/g, '-')}`}>
                {challenge}
              </CheckboxLabel>
            </CheckboxItem>
          ))}
        </CheckboxContainer>
        <InfoText>
          Understanding your eating patterns helps us provide more personalized meal plans and recommendations.
        </InfoText>
      </FormGroup>
    </div>
  );
};
