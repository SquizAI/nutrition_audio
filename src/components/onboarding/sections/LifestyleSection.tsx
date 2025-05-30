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

const CheckboxContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
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

interface LifestyleSectionProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const LifestyleSection: React.FC<LifestyleSectionProps> = ({ formData, setFormData }) => {
  const handleDietaryPreferenceChange = (preference: string) => {
    const currentPreferences = [...formData.dietaryPreferences];
    if (currentPreferences.includes(preference)) {
      // Remove preference if already selected
      setFormData({
        ...formData,
        dietaryPreferences: currentPreferences.filter(item => item !== preference)
      });
    } else {
      // Add preference if not already selected
      setFormData({
        ...formData,
        dietaryPreferences: [...currentPreferences, preference]
      });
    }
  };

  const handleAllergiesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const allergiesText = e.target.value;
    // Split by commas and trim whitespace
    const allergiesArray = allergiesText
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);
    
    setFormData({
      ...formData,
      allergies: allergiesArray
    });
  };

  return (
    <div>
      <FormGroup>
        <Label htmlFor="activity-level">Activity Level</Label>
        <Select 
          id="activity-level"
          value={formData.activityLevel}
          onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value })}
        >
          <option value="">Select your activity level</option>
          <option value="sedentary">Sedentary (little or no exercise)</option>
          <option value="light">Light (exercise 1-3 days/week)</option>
          <option value="moderate">Moderate (exercise 3-5 days/week)</option>
          <option value="active">Active (exercise 6-7 days/week)</option>
          <option value="very-active">Very Active (physically demanding job or intense exercise)</option>
        </Select>
      </FormGroup>

      <FormGroup>
        <Label>Dietary Preferences</Label>
        <CheckboxContainer>
          {[
            'Balanced', 'Low Carb', 'High Protein', 'Keto', 'Paleo',
            'Mediterranean', 'Vegetarian', 'Vegan', 'Gluten Free', 'Dairy Free'
          ].map((preference) => (
            <CheckboxItem key={preference}>
              <input 
                type="checkbox"
                id={`diet-${preference.toLowerCase().replace(' ', '-')}`}
                checked={formData.dietaryPreferences.includes(preference)}
                onChange={() => handleDietaryPreferenceChange(preference)}
              />
              <CheckboxLabel htmlFor={`diet-${preference.toLowerCase().replace(' ', '-')}`}>
                {preference}
              </CheckboxLabel>
            </CheckboxItem>
          ))}
        </CheckboxContainer>
      </FormGroup>

      <FormGroup>
        <Label htmlFor="allergies">Allergies & Food Intolerances</Label>
        <TextArea 
          id="allergies"
          placeholder="List any allergies or food intolerances, separated by commas (e.g., peanuts, shellfish, lactose)"
          value={formData.allergies.join(', ')}
          onChange={handleAllergiesChange}
        />
      </FormGroup>
    </div>
  );
};
