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

const SliderContainer = styled.div`
  margin-top: 1rem;
`;

const SliderLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const SliderLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.lightText};
`;

const Slider = styled.input`
  width: 100%;
  margin: 0.5rem 0;
`;

const SliderValue = styled.div`
  text-align: center;
  font-weight: 500;
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

interface HydrationSleepSectionProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const HydrationSleepSection: React.FC<HydrationSleepSectionProps> = ({ formData, setFormData }) => {
  const handleWaterIntakeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      waterIntake: e.target.value
    });
  };

  const handleSleepHoursChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      sleepHours: e.target.value
    });
  };

  const handleStressLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      stressLevel: e.target.value
    });
  };

  // Convert stress level to descriptive text
  const getStressLevelText = (level: string) => {
    const numLevel = parseInt(level, 10);
    if (numLevel <= 2) return "Low";
    if (numLevel <= 4) return "Mild";
    if (numLevel <= 6) return "Moderate";
    if (numLevel <= 8) return "High";
    return "Very High";
  };

  return (
    <div>
      <FormGroup>
        <Label htmlFor="water-intake">Daily Water Intake</Label>
        <Select 
          id="water-intake"
          value={formData.waterIntake}
          onChange={handleWaterIntakeChange}
        >
          <option value="">Select your typical water intake</option>
          <option value="less-than-1L">Less than 1 liter</option>
          <option value="1-2L">1-2 liters</option>
          <option value="2-3L">2-3 liters</option>
          <option value="3-4L">3-4 liters</option>
          <option value="more-than-4L">More than 4 liters</option>
        </Select>
        <InfoText>
          Proper hydration is essential for metabolism, digestion, and overall health.
        </InfoText>
      </FormGroup>

      <FormGroup>
        <Label htmlFor="sleep-hours">Average Sleep Duration</Label>
        <Select 
          id="sleep-hours"
          value={formData.sleepHours}
          onChange={handleSleepHoursChange}
        >
          <option value="">Select your typical sleep duration</option>
          <option value="less-than-5">Less than 5 hours</option>
          <option value="5-6">5-6 hours</option>
          <option value="6-7">6-7 hours</option>
          <option value="7-8">7-8 hours</option>
          <option value="8-9">8-9 hours</option>
          <option value="more-than-9">More than 9 hours</option>
        </Select>
        <InfoText>
          Sleep quality affects hunger hormones, metabolism, and food choices.
        </InfoText>
      </FormGroup>

      <FormGroup>
        <Label>Typical Stress Level</Label>
        <SliderContainer>
          <SliderLabels>
            <SliderLabel>Low</SliderLabel>
            <SliderLabel>Moderate</SliderLabel>
            <SliderLabel>High</SliderLabel>
          </SliderLabels>
          <Slider 
            type="range" 
            min="1" 
            max="10" 
            value={formData.stressLevel || 5}
            onChange={handleStressLevelChange}
          />
          <SliderValue>
            {formData.stressLevel ? `${getStressLevelText(formData.stressLevel)} (${formData.stressLevel}/10)` : 'Select your stress level'}
          </SliderValue>
        </SliderContainer>
        <InfoText>
          Stress can impact eating habits, digestion, and nutrient absorption.
        </InfoText>
      </FormGroup>

      <FormGroup>
        <Label>Do you typically eat when stressed?</Label>
        <RadioGroup>
          <RadioItem>
            <input 
              type="radio" 
              id="stress-eat-yes" 
              name="stress-eat" 
              value="yes"
              checked={formData.stressEating === 'yes'}
              onChange={() => setFormData({ ...formData, stressEating: 'yes' })}
            />
            <RadioLabel htmlFor="stress-eat-yes">Yes, I tend to eat more when stressed</RadioLabel>
          </RadioItem>
          <RadioItem>
            <input 
              type="radio" 
              id="stress-eat-no" 
              name="stress-eat" 
              value="no"
              checked={formData.stressEating === 'no'}
              onChange={() => setFormData({ ...formData, stressEating: 'no' })}
            />
            <RadioLabel htmlFor="stress-eat-no">No, I tend to eat less when stressed</RadioLabel>
          </RadioItem>
          <RadioItem>
            <input 
              type="radio" 
              id="stress-eat-neutral" 
              name="stress-eat" 
              value="neutral"
              checked={formData.stressEating === 'neutral'}
              onChange={() => setFormData({ ...formData, stressEating: 'neutral' })}
            />
            <RadioLabel htmlFor="stress-eat-neutral">Stress doesn't affect my eating habits</RadioLabel>
          </RadioItem>
        </RadioGroup>
      </FormGroup>
    </div>
  );
};
