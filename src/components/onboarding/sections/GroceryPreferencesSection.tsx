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

const RangeContainer = styled.div`
  margin-top: 1rem;
`;

const RangeLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const RangeLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.lightText};
`;

const Range = styled.input`
  width: 100%;
  margin: 0.5rem 0;
`;

const RangeValue = styled.div`
  text-align: center;
  font-weight: 500;
  margin-top: 0.5rem;
`;

interface GroceryPreferencesSectionProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const GroceryPreferencesSection: React.FC<GroceryPreferencesSectionProps> = ({ formData, setFormData }) => {
  // Initialize grocery preferences if they don't exist
  if (!formData.groceryPreferences) {
    setFormData({
      ...formData,
      groceryPreferences: {
        budget: 'moderate',
        budgetAmount: '',
        preferredStores: [],
        organicPreference: 'sometimes',
        mealPrepFrequency: 'weekly',
        cookingTime: '30'
      }
    });
  }

  const handlePreferredStoresToggle = (store: string) => {
    const currentStores = [...(formData.groceryPreferences?.preferredStores || [])];
    if (currentStores.includes(store)) {
      // Remove store if already selected
      setFormData({
        ...formData,
        groceryPreferences: {
          ...formData.groceryPreferences,
          preferredStores: currentStores.filter(s => s !== store)
        }
      });
    } else {
      // Add store if not already selected
      setFormData({
        ...formData,
        groceryPreferences: {
          ...formData.groceryPreferences,
          preferredStores: [...currentStores, store]
        }
      });
    }
  };

  const getCookingTimeLabel = (minutes: string) => {
    const mins = parseInt(minutes, 10);
    if (mins <= 15) return "Quick meals (15 min or less)";
    if (mins <= 30) return "Medium prep (15-30 min)";
    if (mins <= 60) return "Standard cooking (30-60 min)";
    return "Extended cooking (60+ min)";
  };

  return (
    <div>
      <FormGroup>
        <Label htmlFor="budget">What's your grocery budget level?</Label>
        <Select 
          id="budget"
          value={formData.groceryPreferences?.budget || 'moderate'}
          onChange={(e) => setFormData({
            ...formData,
            groceryPreferences: {
              ...formData.groceryPreferences,
              budget: e.target.value
            }
          })}
        >
          <option value="budget">Budget-conscious</option>
          <option value="moderate">Moderate</option>
          <option value="premium">Premium</option>
        </Select>
      </FormGroup>

      <FormGroup>
        <Label htmlFor="budget-amount">Approximate weekly grocery budget (optional)</Label>
        <Input 
          id="budget-amount"
          type="text"
          placeholder="e.g., $100"
          value={formData.groceryPreferences?.budgetAmount || ''}
          onChange={(e) => setFormData({
            ...formData,
            groceryPreferences: {
              ...formData.groceryPreferences,
              budgetAmount: e.target.value
            }
          })}
        />
        <InfoText>
          This helps us suggest meal plans that fit within your budget.
        </InfoText>
      </FormGroup>

      <FormGroup>
        <Label>Where do you typically shop for groceries? (Select all that apply)</Label>
        <CheckboxContainer>
          {[
            'Supermarket',
            'Farmers Market',
            'Health Food Store',
            'Discount Store',
            'Wholesale Club',
            'Online Grocery',
            'Specialty Stores',
            'Convenience Store'
          ].map((store) => (
            <CheckboxItem key={store}>
              <input 
                type="checkbox"
                id={`store-${store.toLowerCase().replace(/\s+/g, '-')}`}
                checked={(formData.groceryPreferences?.preferredStores || []).includes(store)}
                onChange={() => handlePreferredStoresToggle(store)}
              />
              <CheckboxLabel htmlFor={`store-${store.toLowerCase().replace(/\s+/g, '-')}`}>
                {store}
              </CheckboxLabel>
            </CheckboxItem>
          ))}
        </CheckboxContainer>
      </FormGroup>

      <FormGroup>
        <Label>Do you prefer organic products?</Label>
        <RadioGroup>
          <RadioItem>
            <input 
              type="radio" 
              id="organic-always" 
              name="organic-preference" 
              value="always"
              checked={formData.groceryPreferences?.organicPreference === 'always'}
              onChange={() => setFormData({
                ...formData,
                groceryPreferences: {
                  ...formData.groceryPreferences,
                  organicPreference: 'always'
                }
              })}
            />
            <RadioLabel htmlFor="organic-always">Always when available</RadioLabel>
          </RadioItem>
          <RadioItem>
            <input 
              type="radio" 
              id="organic-sometimes" 
              name="organic-preference" 
              value="sometimes"
              checked={formData.groceryPreferences?.organicPreference === 'sometimes'}
              onChange={() => setFormData({
                ...formData,
                groceryPreferences: {
                  ...formData.groceryPreferences,
                  organicPreference: 'sometimes'
                }
              })}
            />
            <RadioLabel htmlFor="organic-sometimes">Sometimes (for certain foods)</RadioLabel>
          </RadioItem>
          <RadioItem>
            <input 
              type="radio" 
              id="organic-rarely" 
              name="organic-preference" 
              value="rarely"
              checked={formData.groceryPreferences?.organicPreference === 'rarely'}
              onChange={() => setFormData({
                ...formData,
                groceryPreferences: {
                  ...formData.groceryPreferences,
                  organicPreference: 'rarely'
                }
              })}
            />
            <RadioLabel htmlFor="organic-rarely">Rarely or never</RadioLabel>
          </RadioItem>
        </RadioGroup>
      </FormGroup>

      <FormGroup>
        <Label>How often do you meal prep?</Label>
        <RadioGroup>
          <RadioItem>
            <input 
              type="radio" 
              id="prep-daily" 
              name="meal-prep" 
              value="daily"
              checked={formData.groceryPreferences?.mealPrepFrequency === 'daily'}
              onChange={() => setFormData({
                ...formData,
                groceryPreferences: {
                  ...formData.groceryPreferences,
                  mealPrepFrequency: 'daily'
                }
              })}
            />
            <RadioLabel htmlFor="prep-daily">Daily</RadioLabel>
          </RadioItem>
          <RadioItem>
            <input 
              type="radio" 
              id="prep-weekly" 
              name="meal-prep" 
              value="weekly"
              checked={formData.groceryPreferences?.mealPrepFrequency === 'weekly'}
              onChange={() => setFormData({
                ...formData,
                groceryPreferences: {
                  ...formData.groceryPreferences,
                  mealPrepFrequency: 'weekly'
                }
              })}
            />
            <RadioLabel htmlFor="prep-weekly">Weekly</RadioLabel>
          </RadioItem>
          <RadioItem>
            <input 
              type="radio" 
              id="prep-occasionally" 
              name="meal-prep" 
              value="occasionally"
              checked={formData.groceryPreferences?.mealPrepFrequency === 'occasionally'}
              onChange={() => setFormData({
                ...formData,
                groceryPreferences: {
                  ...formData.groceryPreferences,
                  mealPrepFrequency: 'occasionally'
                }
              })}
            />
            <RadioLabel htmlFor="prep-occasionally">Occasionally</RadioLabel>
          </RadioItem>
          <RadioItem>
            <input 
              type="radio" 
              id="prep-rarely" 
              name="meal-prep" 
              value="rarely"
              checked={formData.groceryPreferences?.mealPrepFrequency === 'rarely'}
              onChange={() => setFormData({
                ...formData,
                groceryPreferences: {
                  ...formData.groceryPreferences,
                  mealPrepFrequency: 'rarely'
                }
              })}
            />
            <RadioLabel htmlFor="prep-rarely">Rarely or never</RadioLabel>
          </RadioItem>
        </RadioGroup>
      </FormGroup>

      <FormGroup>
        <Label>How much time do you prefer to spend cooking a meal?</Label>
        <RangeContainer>
          <RangeLabels>
            <RangeLabel>15 min</RangeLabel>
            <RangeLabel>30 min</RangeLabel>
            <RangeLabel>60 min</RangeLabel>
            <RangeLabel>90+ min</RangeLabel>
          </RangeLabels>
          <Range 
            type="range" 
            min="15" 
            max="90" 
            step="15"
            value={formData.groceryPreferences?.cookingTime || '30'}
            onChange={(e) => setFormData({
              ...formData,
              groceryPreferences: {
                ...formData.groceryPreferences,
                cookingTime: e.target.value
              }
            })}
          />
          <RangeValue>
            {getCookingTimeLabel(formData.groceryPreferences?.cookingTime || '30')}
          </RangeValue>
        </RangeContainer>
        <InfoText>
          We'll prioritize recipes that match your preferred cooking time.
        </InfoText>
      </FormGroup>
    </div>
  );
};
