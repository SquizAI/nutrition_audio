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

const CheckboxContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

const CheckboxItem = styled.div`
  display: flex;
  align-items: center;
`;

const CheckboxLabel = styled.label`
  margin-left: 0.5rem;
  cursor: pointer;
`;

const InfoText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.lightText};
  margin-top: 0.5rem;
  margin-bottom: 1rem;
`;

interface HealthHistorySectionProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const HealthHistorySection: React.FC<HealthHistorySectionProps> = ({ formData, setFormData }) => {
  const handleMedicalConditionsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const conditionsText = e.target.value;
    // Split by commas and trim whitespace
    const conditionsArray = conditionsText
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);
    
    setFormData({
      ...formData,
      medicalConditions: conditionsArray
    });
  };

  const handleMedicationsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const medicationsText = e.target.value;
    // Split by commas and trim whitespace
    const medicationsArray = medicationsText
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);
    
    setFormData({
      ...formData,
      medications: medicationsArray
    });
  };

  const commonConditions = [
    'Diabetes',
    'Hypertension',
    'Heart Disease',
    'Celiac Disease',
    'Irritable Bowel Syndrome',
    'Acid Reflux',
    'Thyroid Disorder'
  ];

  const handleConditionToggle = (condition: string) => {
    const currentConditions = [...formData.medicalConditions];
    if (currentConditions.includes(condition)) {
      // Remove condition if already selected
      setFormData({
        ...formData,
        medicalConditions: currentConditions.filter(item => item !== condition)
      });
    } else {
      // Add condition if not already selected
      setFormData({
        ...formData,
        medicalConditions: [...currentConditions, condition]
      });
    }
  };

  return (
    <div>
      <InfoText>
        This information helps us provide personalized nutrition recommendations tailored to your health needs.
        All health information is kept private and secure.
      </InfoText>

      <FormGroup>
        <Label>Do you have any of these common conditions?</Label>
        <CheckboxContainer>
          {commonConditions.map((condition) => (
            <CheckboxItem key={condition}>
              <input 
                type="checkbox"
                id={`condition-${condition.toLowerCase().replace(' ', '-')}`}
                checked={formData.medicalConditions.includes(condition)}
                onChange={() => handleConditionToggle(condition)}
              />
              <CheckboxLabel htmlFor={`condition-${condition.toLowerCase().replace(' ', '-')}`}>
                {condition}
              </CheckboxLabel>
            </CheckboxItem>
          ))}
        </CheckboxContainer>
      </FormGroup>

      <FormGroup>
        <Label htmlFor="other-conditions">Other Medical Conditions</Label>
        <TextArea 
          id="other-conditions"
          placeholder="List any other medical conditions that may affect your nutrition needs, separated by commas"
          value={formData.medicalConditions.filter(c => !commonConditions.includes(c)).join(', ')}
          onChange={handleMedicalConditionsChange}
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="medications">Current Medications</Label>
        <TextArea 
          id="medications"
          placeholder="List any medications you're currently taking, separated by commas"
          value={formData.medications.join(', ')}
          onChange={handleMedicationsChange}
        />
        <InfoText>
          Some medications can affect nutrition absorption or interact with certain foods.
          This information helps us provide safer recommendations.
        </InfoText>
      </FormGroup>
    </div>
  );
};
