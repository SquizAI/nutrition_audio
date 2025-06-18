import React from 'react';
import styled from 'styled-components';
import { 
  X, 
  Clock, 
  Users, 
  ChefHat, 
  Utensils,
  Heart,
  Star,
  AlertCircle,
  CheckCircle,
  Flame,
  Activity
} from 'lucide-react';

interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  instructions?: string;
  image?: string;
  cookTime?: number;
  servings?: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  tags?: string[];
}

interface MealDetailModalProps {
  meal: Meal | null;
  isOpen: boolean;
  onClose: () => void;
}

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(20px);
  z-index: 1000;
  display: ${({ $isOpen }) => $isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const ModalContainer = styled.div`
  background: linear-gradient(145deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
  border-radius: 24px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 20%, rgba(236, 72, 153, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
    border-radius: inherit;
    pointer-events: none;
  }
`;

const Header = styled.div`
  position: relative;
  z-index: 1;
  padding: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }
`;

const MealImage = styled.div<{ $image?: string }>`
  width: 100%;
  height: 200px;
  background: ${({ $image }) => 
    $image 
      ? `url(${$image}) center/cover` 
      : 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)'};
  border-radius: 16px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  
  @media (min-width: 768px) {
    height: 250px;
  }
`;

const MealTitle = styled.h1`
  color: white;
  font-size: 2rem;
  font-weight: 900;
  margin: 0 0 1rem 0;
  line-height: 1.2;
  
  @media (min-width: 768px) {
    font-size: 2.5rem;
  }
`;

const MealMeta = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  font-weight: 600;
`;

const DifficultyBadge = styled.span<{ $difficulty: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  background: ${({ $difficulty }) => {
    switch ($difficulty) {
      case 'Easy': return 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';
      case 'Medium': return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
      case 'Hard': return 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
      default: return 'rgba(255, 255, 255, 0.2)';
    }
  }};
  color: white;
`;

const Content = styled.div`
  padding: 2rem;
  position: relative;
  z-index: 1;
`;

const Section = styled.div`
  margin-bottom: 2rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  color: white;
  font-size: 1.3rem;
  font-weight: 800;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const NutritionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const NutritionCard = styled.div<{ $color: string }>`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${({ $color }) => $color};
    box-shadow: 0 8px 24px ${({ $color }) => $color}40;
  }
`;

const NutritionValue = styled.div`
  color: white;
  font-size: 1.8rem;
  font-weight: 900;
  margin-bottom: 0.25rem;
`;

const NutritionLabel = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const IngredientsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.75rem;
`;

const IngredientItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem;
  color: white;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(236, 72, 153, 0.4);
  }
`;

const CheckIcon = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.7rem;
  flex-shrink: 0;
`;

const Instructions = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
`;

const TagContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Tag = styled.span`
  background: rgba(236, 72, 153, 0.2);
  border: 1px solid rgba(236, 72, 153, 0.4);
  color: #ec4899;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
`;

const ActionButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  flex: 1;
  min-width: 150px;
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  background: ${({ $variant }) => 
    $variant === 'primary' 
      ? 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)'
      : 'rgba(255, 255, 255, 0.1)'};
  color: white;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(236, 72, 153, 0.4);
  }
`;

const MealDetailModal: React.FC<MealDetailModalProps> = ({ meal, isOpen, onClose }) => {
  if (!meal) return null;

  // Generate enhanced meal details if not provided
  const enhancedMeal = {
    ...meal,
    cookTime: meal.cookTime || 25,
    servings: meal.servings || 2,
    difficulty: meal.difficulty || 'Medium',
    instructions: meal.instructions || `
      1. Prepare all ingredients by washing and chopping as needed.
      2. Heat your cooking surface to medium heat.
      3. Cook the main ingredients according to their requirements.
      4. Season to taste and combine all components.
      5. Serve immediately while hot and enjoy!
    `,
    tags: meal.tags || ['Balanced', 'Nutritious', 'Quick']
  };

  return (
    <ModalOverlay $isOpen={isOpen} onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Header>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
          
          <MealImage $image={enhancedMeal.image}>
            {!enhancedMeal.image && <ChefHat />}
          </MealImage>
          
          <MealTitle>{enhancedMeal.name}</MealTitle>
          
          <MealMeta>
            <MetaItem>
              <Clock size={16} />
              {enhancedMeal.cookTime} mins
            </MetaItem>
            <MetaItem>
              <Users size={16} />
              {enhancedMeal.servings} servings
            </MetaItem>
            <MetaItem>
              <Star size={16} />
              <DifficultyBadge $difficulty={enhancedMeal.difficulty}>
                {enhancedMeal.difficulty}
              </DifficultyBadge>
            </MetaItem>
          </MealMeta>
          
          <TagContainer>
            {enhancedMeal.tags.map((tag, index) => (
              <Tag key={index}>{tag}</Tag>
            ))}
          </TagContainer>
        </Header>

        <Content>
          <Section>
            <SectionTitle>
              <Activity size={20} />
              Nutrition Facts
            </SectionTitle>
            <NutritionGrid>
              <NutritionCard $color="#22c55e">
                <NutritionValue>{enhancedMeal.calories}</NutritionValue>
                <NutritionLabel>Calories</NutritionLabel>
              </NutritionCard>
              <NutritionCard $color="#3b82f6">
                <NutritionValue>{enhancedMeal.protein}g</NutritionValue>
                <NutritionLabel>Protein</NutritionLabel>
              </NutritionCard>
              <NutritionCard $color="#f59e0b">
                <NutritionValue>{enhancedMeal.carbs}g</NutritionValue>
                <NutritionLabel>Carbs</NutritionLabel>
              </NutritionCard>
              <NutritionCard $color="#ec4899">
                <NutritionValue>{enhancedMeal.fat}g</NutritionValue>
                <NutritionLabel>Fat</NutritionLabel>
              </NutritionCard>
            </NutritionGrid>
          </Section>

          <Section>
            <SectionTitle>
              <Utensils size={20} />
              Ingredients
            </SectionTitle>
            <IngredientsList>
              {enhancedMeal.ingredients.map((ingredient, index) => (
                <IngredientItem key={index}>
                  <CheckIcon>
                    <CheckCircle size={12} />
                  </CheckIcon>
                  {ingredient}
                </IngredientItem>
              ))}
            </IngredientsList>
          </Section>

          <Section>
            <SectionTitle>
              <ChefHat size={20} />
              Instructions
            </SectionTitle>
            <Instructions>
              {enhancedMeal.instructions.split('\n').map((step, index) => (
                <div key={index} style={{ marginBottom: '0.75rem' }}>
                  {step.trim()}
                </div>
              ))}
            </Instructions>
          </Section>

          <ActionButtons>
            <ActionButton $variant="secondary">
              <Heart size={18} />
              Save Recipe
            </ActionButton>
            <ActionButton $variant="primary">
              <Flame size={18} />
              Start Cooking
            </ActionButton>
          </ActionButtons>
        </Content>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default MealDetailModal; 