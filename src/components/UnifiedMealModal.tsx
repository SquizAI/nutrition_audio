import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useMealPlan } from '../services/mealPlanContext';
import { 
  X, 
  Plus,
  Edit3,
  Trash2,
  Save,
  RefreshCw,
  Clock, 
  Users, 
  ChefHat, 
  Utensils,
  Activity,
  Target,
  TrendingUp,
  BarChart3,
  Sparkles,
  Coffee,
  Sun,
  Moon,
  Apple,
  CheckCircle,
  AlertCircle,
  Calendar,
  MessageCircle,
  Bot,
  Zap,
  ArrowRight,
  Link,
  Globe,
  Search,
  ExternalLink
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

interface UnifiedMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  meal?: Meal | null;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  date: string;
  mode?: 'view' | 'edit' | 'create' | 'url-import' | 'url-results';
  onOpenChat?: () => void;
}

// Animation keyframes
const slideInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const glow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(236, 72, 153, 0.4);
  }
  50% {
    box-shadow: 0 0 30px rgba(236, 72, 153, 0.6);
  }
`;

// UNIFIED MODAL CONTAINER
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
  animation: ${slideInUp} 0.4s ease-out;
  
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

// UNIFIED HEADER WITH TABS
const UnifiedHeader = styled.div`
  position: relative;
  z-index: 1;
  padding: 2rem 2rem 0 2rem;
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

const HeaderInfo = styled.div`
  margin-bottom: 1.5rem;
`;

const MealTypeHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
`;

const MealTypeIcon = styled.div<{ $mealType: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $mealType }) => {
    switch ($mealType) {
      case 'breakfast': return 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)';
      case 'lunch': return 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';
      case 'dinner': return 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)';
      default: return 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)';
    }
  }};
  color: white;
`;

const HeaderText = styled.div`
  flex: 1;
`;

const MealTitle = styled.h1`
  color: white;
  font-size: 1.5rem;
  font-weight: 900;
  margin: 0;
  line-height: 1.2;
  
  @media (min-width: 768px) {
    font-size: 2rem;
  }
`;

const DateAndType = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  margin: 0;
  font-weight: 600;
`;

// MODE TABS
const ModeTabs = styled.div`
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 0.25rem;
  margin-bottom: 1.5rem;
`;

const ModeTab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  background: ${({ $active }) => $active 
    ? 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)'
    : 'transparent'};
  color: ${({ $active }) => $active ? 'white' : 'rgba(255, 255, 255, 0.7)'};
  
  &:hover {
    background: ${({ $active }) => $active 
      ? 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)'
      : 'rgba(255, 255, 255, 0.1)'};
  }
`;

// CONTENT AREA
const ModalContent = styled.div`
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
  font-size: 1.1rem;
  font-weight: 800;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

// VIEW MODE COMPONENTS
const MacroOverview = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const MacroCard = styled.div<{ $color: string }>`
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

const MacroValue = styled.div`
  color: white;
  font-size: 1.8rem;
  font-weight: 900;
  margin-bottom: 0.25rem;
`;

const MacroLabel = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

// EDIT MODE COMPONENTS
const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 0.75rem 1rem;
  color: white;
  font-size: 0.9rem;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
  
  &:focus {
    outline: none;
    border-color: #ec4899;
    box-shadow: 0 0 0 2px rgba(236, 72, 153, 0.2);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 0.75rem 1rem;
  color: white;
  font-size: 0.9rem;
  min-height: 100px;
  resize: vertical;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
  
  &:focus {
    outline: none;
    border-color: #ec4899;
    box-shadow: 0 0 0 2px rgba(236, 72, 153, 0.2);
  }
`;

const MacroInputs = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 1rem;
`;

// CREATE MODE COMPONENTS
const SuggestionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
`;

const SuggestionCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: rgba(236, 72, 153, 0.4);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(236, 72, 153, 0.2);
  }
`;

const SuggestionTitle = styled.h4`
  color: white;
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
`;

const SuggestionMacros = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
`;

const SuggestionIngredients = styled.p`
  color: #888;
  font-size: 0.8rem;
  margin: 0;
  line-height: 1.3;
`;

// ACTION BUTTONS
const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
`;

const ActionButton = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
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
  
  background: ${({ $variant }) => {
    switch ($variant) {
      case 'primary': return 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)';
      case 'danger': return 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
      default: return 'rgba(255, 255, 255, 0.1)';
    }
  }};
  color: white;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(236, 72, 153, 0.4);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

// Add new styled components for JME integration
const JmeIntegrationSection = styled.div`
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
  border: 1px solid rgba(236, 72, 153, 0.3);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #ec4899 0%, #8b5cf6 100%);
  }
`;

const JmeTitle = styled.h3`
  color: white;
  font-size: 1rem;
  font-weight: 800;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const JmeButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
`;

const JmeActionButton = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  background: ${({ $variant }) => {
    switch ($variant) {
      case 'primary': return 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)';
      case 'danger': return 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
      default: return 'rgba(255, 255, 255, 0.1)';
    }
  }};
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 0.75rem 1rem;
  color: white;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 44px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(236, 72, 153, 0.4);
    animation: ${glow} 2s infinite;
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const QuickModSection = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1.5rem;
`;

const QuickModTitle = styled.h4`
  color: white;
  font-size: 0.9rem;
  font-weight: 700;
  margin: 0 0 0.75rem 0;
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const QuickModGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.5rem;
`;

const QuickModButton = styled.button`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(236, 72, 153, 0.2);
    border-color: rgba(236, 72, 153, 0.4);
    transform: translateY(-1px);
  }
`;

// URL Import Styled Components
const UrlInputContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
`;

const UrlInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &::placeholder {
    color: #999;
  }
`;

const UrlButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  
  &:hover:not(:disabled) {
    background: #5a67d8;
    transform: translateY(-1px);
  }
  
  &:disabled {
    background: #cbd5e0;
    cursor: not-allowed;
    transform: none;
  }
  
  .animate-spin {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #fed7d7;
  border: 1px solid #feb2b2;
  border-radius: 8px;
  color: #c53030;
  font-size: 14px;
  margin-top: 12px;
`;

const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #4a5568;
  
  svg {
    color: #48bb78;
    flex-shrink: 0;
  }
`;

const RestaurantMenuGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 20px;
`;

const MenuItemCard = styled.div`
  padding: 16px;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
  
  &:hover {
    border-color: #667eea;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const MenuItemHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: start;
  margin-bottom: 8px;
  gap: 12px;
`;

const MenuItemName = styled.h4`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #2d3748;
  flex: 1;
`;

const MenuItemPrice = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #48bb78;
  background: #f0fff4;
  padding: 4px 8px;
  border-radius: 6px;
  flex-shrink: 0;
`;

const MenuItemDescription = styled.p`
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #718096;
  line-height: 1.4;
`;

const MenuItemNutrition = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 8px;
`;

const NutritionBadge = styled.span`
  background: #edf2f7;
  color: #4a5568;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
`;

const MenuItemCategory = styled.div`
  display: inline-block;
  background: #667eea;
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
`;

const UnifiedMealModal: React.FC<UnifiedMealModalProps> = ({ 
  isOpen, 
  onClose, 
  meal, 
  mealType, 
  date, 
  mode: initialMode = 'view',
  onOpenChat
}) => {
  const { addMeal, removeMeal, generateMealPlan, isLoading } = useMealPlan();
  
  const [currentMode, setCurrentMode] = useState(initialMode);
  const [editData, setEditData] = useState<Partial<Meal>>({});
  
  // URL Import states
  const [urlInput, setUrlInput] = useState('');
  const [isLoadingMenu, setIsLoadingMenu] = useState(false);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState<any>(null);
  const [restaurantName, setRestaurantName] = useState('');
  const [urlError, setUrlError] = useState('');
  
  useEffect(() => {
    if (meal) {
      setEditData(meal);
      setCurrentMode(meal ? 'view' : 'create');
    } else {
      setCurrentMode('create');
      setEditData({
        name: '',
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        ingredients: [],
        instructions: ''
      });
    }
  }, [meal, isOpen]);

  const getMealTypeIcon = () => {
    switch (mealType) {
      case 'breakfast': return <Coffee size={20} />;
      case 'lunch': return <Sun size={20} />;
      case 'dinner': return <Moon size={20} />;
      default: return <Apple size={20} />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleSave = async () => {
    if (!editData.name) return;

    const mealToSave = {
      id: meal?.id || `meal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: editData.name || '',
      calories: editData.calories || 0,
      protein: editData.protein || 0,
      carbs: editData.carbs || 0,
      fat: editData.fat || 0,
      ingredients: editData.ingredients || [],
      instructions: editData.instructions || ''
    };

    addMeal(date, mealType, mealToSave);
    onClose();
  };

  const handleDelete = () => {
    if (meal) {
      removeMeal(date, mealType, meal.id);
      onClose();
    }
  };

  // URL Scraping functions
  const handleUrlScraping = async () => {
    if (!urlInput.trim()) {
      setUrlError('Please enter a valid restaurant URL');
      return;
    }

    setIsLoadingMenu(true);
    setUrlError('');
    setMenuItems([]);

    try {
      const response = await fetch('/api/restaurant-menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: urlInput.trim() }),
      });

      if (!response.ok) {
        throw new Error(`Failed to scrape menu: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setMenuItems(data.menu_items || []);
        setRestaurantName(data.restaurant_name || 'Restaurant');
        setCurrentMode('url-results');
      } else {
        setUrlError(data.error || 'Failed to load menu items');
      }
    } catch (error) {
      console.error('Error scraping menu:', error);
      setUrlError('Unable to load menu. Please check the URL and try again.');
    } finally {
      setIsLoadingMenu(false);
    }
  };

  const handleSelectMenuItem = (item: any) => {
    setSelectedMenuItem(item);
    setEditData({
      name: item.name,
      calories: item.calories || 0,
      protein: item.protein || 0,
      carbs: item.carbs || 0,
      fat: item.fat || 0,
      ingredients: item.ingredients || [],
      instructions: item.description || ''
    });
    setCurrentMode('edit');
  };

  const resetUrlImport = () => {
    setUrlInput('');
    setMenuItems([]);
    setSelectedMenuItem(null);
    setRestaurantName('');
    setUrlError('');
    setCurrentMode('create');
  };

  const handleGenerateAlternatives = async () => {
    try {
      await generateMealPlan({
        dietaryRestrictions: [],
        calorieGoal: 2000,
        mealsPerDay: 4
      });
    } catch (error) {
      console.error('Failed to generate alternatives:', error);
    }
  };

  // JME Integration Functions
  const handleAskJmeToModify = () => {
    onOpenChat?.();
    onClose();
    // The chat will handle the meal modification conversation
  };

  const handleQuickMod = (type: string) => {
    // Store the modification context for JME
    const modContext = {
      meal,
      mealType,
      date,
      modificationType: type,
      originalCalories: meal?.calories || 0
    };
    
    // Store in sessionStorage for JME to access
    sessionStorage.setItem('mealModificationContext', JSON.stringify(modContext));
    
    onOpenChat?.();
    onClose();
  };

  if (!isOpen) return null;

  const renderJmeIntegration = () => {
    if (!meal) return null; // Only show for existing meals

    return (
      <JmeIntegrationSection>
        <JmeTitle>
          <Bot size={16} />
          Ask JME to Help
        </JmeTitle>
        
        <JmeButtonGrid>
          <JmeActionButton $variant="primary" onClick={handleAskJmeToModify}>
            <MessageCircle size={16} />
            Modify This Meal
          </JmeActionButton>
          
          <JmeActionButton onClick={() => handleQuickMod('substitute')}>
            <RefreshCw size={16} />
            Find Substitute
          </JmeActionButton>
          
          <JmeActionButton onClick={() => handleQuickMod('plan_similar')}>
            <Sparkles size={16} />
            Plan Similar Meal
          </JmeActionButton>
          
          <JmeActionButton onClick={() => handleQuickMod('add_ingredients')}>
            <Plus size={16} />
            Add to Grocery List
          </JmeActionButton>
        </JmeButtonGrid>

        <QuickModSection>
          <QuickModTitle>
            <Zap size={14} />
            Quick Portion Changes
          </QuickModTitle>
          <QuickModGrid>
            <QuickModButton onClick={() => handleQuickMod('ate_half')}>
              Ate Half
            </QuickModButton>
            <QuickModButton onClick={() => handleQuickMod('ate_more')}>
              Ate More
            </QuickModButton>
            <QuickModButton onClick={() => handleQuickMod('ate_double')}>
              Ate Double
            </QuickModButton>
            <QuickModButton onClick={() => handleQuickMod('didnt_eat')}>
              Didn't Eat
            </QuickModButton>
            <QuickModButton onClick={() => handleQuickMod('ate_different')}>
              Ate Different
            </QuickModButton>
            <QuickModButton onClick={() => handleQuickMod('custom_portion')}>
              Custom Amount
            </QuickModButton>
          </QuickModGrid>
        </QuickModSection>
      </JmeIntegrationSection>
    );
  };

  const renderViewMode = () => {
    if (!meal) return <div>No meal data available</div>;

    const enhancedMeal = {
      ...meal,
      cookTime: meal.cookTime || 25,
      servings: meal.servings || 2,
      difficulty: meal.difficulty || 'Medium',
      instructions: meal.instructions || 'No cooking instructions available.',
      tags: meal.tags || ['Nutritious', 'Balanced']
    };

    return (
      <>
        {renderJmeIntegration()}
        
        <Section>
          <SectionTitle>
            <Activity size={20} />
            Nutrition Facts
          </SectionTitle>
          <MacroOverview>
            <MacroCard $color="#22c55e">
              <MacroValue>{enhancedMeal.calories}</MacroValue>
              <MacroLabel>Calories</MacroLabel>
            </MacroCard>
            <MacroCard $color="#3b82f6">
              <MacroValue>{enhancedMeal.protein}g</MacroValue>
              <MacroLabel>Protein</MacroLabel>
            </MacroCard>
            <MacroCard $color="#f59e0b">
              <MacroValue>{enhancedMeal.carbs}g</MacroValue>
              <MacroLabel>Carbs</MacroLabel>
            </MacroCard>
            <MacroCard $color="#ec4899">
              <MacroValue>{enhancedMeal.fat}g</MacroValue>
              <MacroLabel>Fat</MacroLabel>
            </MacroCard>
          </MacroOverview>
        </Section>

        <Section>
          <SectionTitle>
            <Utensils size={20} />
            Ingredients
          </SectionTitle>
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.05)', 
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px', 
            padding: '1rem' 
          }}>
            {enhancedMeal.ingredients.length > 0 ? (
              enhancedMeal.ingredients.map((ingredient, index) => (
                <div key={index} style={{ 
                  color: 'rgba(255, 255, 255, 0.9)', 
                  marginBottom: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <CheckCircle size={14} style={{ color: '#22c55e' }} />
                  {ingredient}
                </div>
              ))
            ) : (
              <p style={{ color: 'rgba(255, 255, 255, 0.6)', margin: 0 }}>
                No ingredients listed
              </p>
            )}
          </div>
        </Section>

        <Section>
          <SectionTitle>
            <ChefHat size={20} />
            Instructions
          </SectionTitle>
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.05)', 
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px', 
            padding: '1rem',
            color: 'rgba(255, 255, 255, 0.9)',
            lineHeight: '1.6'
          }}>
            {enhancedMeal.instructions}
          </div>
        </Section>

        <ActionButtons>
          <ActionButton $variant="secondary" onClick={() => setCurrentMode('edit')}>
            <Edit3 size={18} />
            Edit Meal
          </ActionButton>
          <ActionButton $variant="danger" onClick={handleDelete}>
            <Trash2 size={18} />
            Remove
          </ActionButton>
          <ActionButton onClick={handleGenerateAlternatives} disabled={isLoading}>
            <Sparkles size={18} />
            Generate Alternatives
          </ActionButton>
        </ActionButtons>
      </>
    );
  };

  const renderEditMode = () => (
    <>
      <Section>
        <FormGroup>
          <Label>Meal Name</Label>
          <Input
            type="text"
            value={editData.name || ''}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            placeholder="Enter meal name..."
          />
        </FormGroup>

        <SectionTitle>
          <Target size={20} />
          Nutrition Information
        </SectionTitle>
        <MacroInputs>
          <FormGroup>
            <Label>Calories</Label>
            <Input
              type="number"
              value={editData.calories || ''}
              onChange={(e) => setEditData({ ...editData, calories: parseInt(e.target.value) || 0 })}
              placeholder="0"
            />
          </FormGroup>
          <FormGroup>
            <Label>Protein (g)</Label>
            <Input
              type="number"
              value={editData.protein || ''}
              onChange={(e) => setEditData({ ...editData, protein: parseInt(e.target.value) || 0 })}
              placeholder="0"
            />
          </FormGroup>
          <FormGroup>
            <Label>Carbs (g)</Label>
            <Input
              type="number"
              value={editData.carbs || ''}
              onChange={(e) => setEditData({ ...editData, carbs: parseInt(e.target.value) || 0 })}
              placeholder="0"
            />
          </FormGroup>
          <FormGroup>
            <Label>Fat (g)</Label>
            <Input
              type="number"
              value={editData.fat || ''}
              onChange={(e) => setEditData({ ...editData, fat: parseInt(e.target.value) || 0 })}
              placeholder="0"
            />
          </FormGroup>
        </MacroInputs>
      </Section>

      <Section>
        <FormGroup>
          <Label>Ingredients (one per line)</Label>
          <TextArea
            value={editData.ingredients?.join('\n') || ''}
            onChange={(e) => setEditData({ 
              ...editData, 
              ingredients: e.target.value.split('\n').filter(i => i.trim()) 
            })}
            placeholder="Enter ingredients, one per line..."
          />
        </FormGroup>

        <FormGroup>
          <Label>Cooking Instructions</Label>
          <TextArea
            value={editData.instructions || ''}
            onChange={(e) => setEditData({ ...editData, instructions: e.target.value })}
            placeholder="Enter cooking instructions..."
          />
        </FormGroup>
      </Section>

      <ActionButtons>
        <ActionButton $variant="secondary" onClick={() => setCurrentMode(meal ? 'view' : 'create')}>
          <X size={18} />
          Cancel
        </ActionButton>
        <ActionButton $variant="primary" onClick={handleSave} disabled={!editData.name}>
          <Save size={18} />
          Save Meal
        </ActionButton>
      </ActionButtons>
    </>
  );

  const renderCreateMode = () => {
    // Sample meal suggestions based on meal type
    const suggestions = {
      breakfast: [
        { name: 'Avocado Toast with Eggs', calories: 400, protein: 20, carbs: 30, fat: 25, ingredients: ['Whole grain bread', 'Avocado', 'Eggs', 'Salt', 'Pepper'] },
        { name: 'Protein Smoothie Bowl', calories: 380, protein: 25, carbs: 45, fat: 15, ingredients: ['Protein powder', 'Banana', 'Berries', 'Granola'] },
        { name: 'Greek Yogurt Parfait', calories: 300, protein: 20, carbs: 35, fat: 10, ingredients: ['Greek yogurt', 'Granola', 'Honey', 'Mixed berries'] }
      ],
      lunch: [
        { name: 'Quinoa Buddha Bowl', calories: 450, protein: 15, carbs: 65, fat: 18, ingredients: ['Quinoa', 'Bell peppers', 'Chickpeas', 'Olive oil'] },
        { name: 'Grilled Chicken Salad', calories: 380, protein: 35, carbs: 15, fat: 20, ingredients: ['Chicken breast', 'Mixed greens', 'Cherry tomatoes', 'Cucumber'] },
        { name: 'Turkey & Avocado Wrap', calories: 420, protein: 28, carbs: 35, fat: 22, ingredients: ['Turkey breast', 'Avocado', 'Whole wheat tortilla', 'Lettuce'] }
      ],
      dinner: [
        { name: 'Baked Salmon with Asparagus', calories: 520, protein: 40, carbs: 10, fat: 32, ingredients: ['Salmon fillet', 'Asparagus', 'Olive oil', 'Garlic', 'Lemon'] },
        { name: 'Grilled Chicken & Sweet Potato', calories: 480, protein: 35, carbs: 45, fat: 18, ingredients: ['Chicken breast', 'Sweet potato', 'Broccoli', 'Herbs'] },
        { name: 'Vegetarian Pasta', calories: 420, protein: 18, carbs: 60, fat: 16, ingredients: ['Whole wheat pasta', 'Marinara sauce', 'Vegetables', 'Parmesan'] }
      ],
      snacks: [
        { name: 'Greek Yogurt with Berries', calories: 180, protein: 15, carbs: 20, fat: 5, ingredients: ['Greek yogurt', 'Mixed berries', 'Honey'] },
        { name: 'Apple with Almond Butter', calories: 190, protein: 6, carbs: 25, fat: 12, ingredients: ['Apple', 'Almond butter'] },
        { name: 'Trail Mix', calories: 200, protein: 8, carbs: 18, fat: 14, ingredients: ['Mixed nuts', 'Dried fruit', 'Dark chocolate chips'] }
      ]
    };

    const currentSuggestions = suggestions[mealType] || suggestions.snacks;

    return (
      <>
        {/* JME Integration for Meal Planning */}
        <JmeIntegrationSection>
          <JmeTitle>
            <Bot size={16} />
            Ask JME to Plan This Meal
          </JmeTitle>
          
          <JmeButtonGrid>
            <JmeActionButton $variant="primary" onClick={handleAskJmeToModify}>
              <MessageCircle size={16} />
              "Plan my {mealType}"
            </JmeActionButton>
            
            <JmeActionButton onClick={() => handleQuickMod('suggest_meal')}>
              <Sparkles size={16} />
              "Suggest something healthy"
            </JmeActionButton>
            
            <JmeActionButton onClick={() => handleQuickMod('use_ingredients')}>
              <ChefHat size={16} />
              "Use what I have"
            </JmeActionButton>
            
            <JmeActionButton onClick={() => handleQuickMod('dietary_preferences')}>
              <Target size={16} />
              "Match my diet goals"
            </JmeActionButton>
          </JmeButtonGrid>
        </JmeIntegrationSection>

        <Section>
          <SectionTitle>
            <Sparkles size={20} />
            Suggested {mealType.charAt(0).toUpperCase() + mealType.slice(1)} Options
          </SectionTitle>
          <SuggestionGrid>
            {currentSuggestions.map((suggestion, index) => (
              <SuggestionCard 
                key={index}
                onClick={() => {
                  setEditData({
                    ...suggestion,
                    id: `meal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
                  });
                  setCurrentMode('edit');
                }}
              >
                <SuggestionTitle>{suggestion.name}</SuggestionTitle>
                <SuggestionMacros>
                  <span>{suggestion.calories} cal</span>
                  <span>P: {suggestion.protein}g</span>
                  <span>C: {suggestion.carbs}g</span>
                  <span>F: {suggestion.fat}g</span>
                </SuggestionMacros>
                <SuggestionIngredients>
                  {suggestion.ingredients.join(', ')}
                </SuggestionIngredients>
              </SuggestionCard>
            ))}
          </SuggestionGrid>
        </Section>

        <ActionButtons>
          <ActionButton $variant="secondary" onClick={() => setCurrentMode('edit')}>
            <Plus size={18} />
            Create Custom
          </ActionButton>
          <ActionButton onClick={handleGenerateAlternatives} disabled={isLoading}>
            <RefreshCw size={18} />
            {isLoading ? 'Generating...' : 'Generate More'}
          </ActionButton>
        </ActionButtons>
      </>
    );
  };

  // URL Import Mode
  const renderUrlImportMode = () => {
    return (
      <>
        <Section>
          <SectionTitle>
            <Globe size={20} />
            Import from Restaurant Menu
          </SectionTitle>
          <p style={{ marginBottom: '20px', color: '#666', fontSize: '14px' }}>
            Paste a restaurant website URL to automatically extract menu items with nutrition information.
          </p>
          
          <UrlInputContainer>
            <UrlInput
              type="url"
              placeholder="https://restaurant-website.com/menu"
              value={urlInput}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrlInput(e.target.value)}
              onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleUrlScraping()}
            />
            <UrlButton 
              onClick={handleUrlScraping}
              disabled={isLoadingMenu || !urlInput.trim()}
            >
              {isLoadingMenu ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <Search size={16} />
              )}
              {isLoadingMenu ? 'Loading...' : 'Load Menu'}
            </UrlButton>
          </UrlInputContainer>
          
          {urlError && (
            <ErrorMessage>
              <AlertCircle size={16} />
              {urlError}
            </ErrorMessage>
          )}
        </Section>

        <Section>
          <SectionTitle>
            <Utensils size={20} />
            How it works
          </SectionTitle>
          <InfoList>
            <InfoItem>
              <CheckCircle size={16} />
              <span>Paste any restaurant website URL</span>
            </InfoItem>
            <InfoItem>
              <CheckCircle size={16} />
              <span>We'll extract menu items and nutrition info</span>
            </InfoItem>
            <InfoItem>
              <CheckCircle size={16} />
              <span>Select an item to add to your meal plan</span>
            </InfoItem>
          </InfoList>
        </Section>
      </>
    );
  };

  // URL Results Mode
  const renderUrlResultsMode = () => {
    return (
      <>
        <Section>
          <SectionTitle>
            <ExternalLink size={20} />
            Menu from {restaurantName}
          </SectionTitle>
          <p style={{ marginBottom: '20px', color: '#666', fontSize: '14px' }}>
            Found {menuItems.length} menu items. Click any item to add it to your meal.
          </p>
          
          <RestaurantMenuGrid>
            {menuItems.map((item, index) => (
              <MenuItemCard 
                key={index}
                onClick={() => handleSelectMenuItem(item)}
              >
                <MenuItemHeader>
                  <MenuItemName>{item.name}</MenuItemName>
                  {item.price && <MenuItemPrice>{item.price}</MenuItemPrice>}
                </MenuItemHeader>
                
                {item.description && (
                  <MenuItemDescription>{item.description}</MenuItemDescription>
                )}
                
                <MenuItemNutrition>
                  <NutritionBadge>{item.calories} cal</NutritionBadge>
                  <NutritionBadge>P:{item.protein}g</NutritionBadge>
                  <NutritionBadge>C:{item.carbs}g</NutritionBadge>
                  <NutritionBadge>F:{item.fat}g</NutritionBadge>
                </MenuItemNutrition>
                
                {item.category && (
                  <MenuItemCategory>{item.category}</MenuItemCategory>
                )}
              </MenuItemCard>
            ))}
          </RestaurantMenuGrid>
          
          <ActionButtons>
            <ActionButton $variant="secondary" onClick={resetUrlImport}>
              <ArrowRight style={{ transform: 'rotate(180deg)' }} size={18} />
              Try Different URL
            </ActionButton>
          </ActionButtons>
        </Section>
      </>
    );
  };

  return (
    <ModalOverlay $isOpen={isOpen} onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <UnifiedHeader>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
          
          <HeaderInfo>
            <MealTypeHeader>
              <MealTypeIcon $mealType={mealType}>
                {getMealTypeIcon()}
              </MealTypeIcon>
              <HeaderText>
                <MealTitle>{meal?.name || `Add ${mealType}`}</MealTitle>
                <DateAndType>{formatDate(date)} • {mealType.charAt(0).toUpperCase() + mealType.slice(1)}</DateAndType>
              </HeaderText>
            </MealTypeHeader>
          </HeaderInfo>

          <ModeTabs>
            {meal && (
              <ModeTab 
                $active={currentMode === 'view'} 
                onClick={() => setCurrentMode('view')}
              >
                <CheckCircle size={16} />
                View
              </ModeTab>
            )}
            <ModeTab 
              $active={currentMode === 'edit'} 
              onClick={() => setCurrentMode('edit')}
            >
              <Edit3 size={16} />
              {meal ? 'Edit' : 'Manual'}
            </ModeTab>
            <ModeTab 
              $active={currentMode === 'create'} 
              onClick={() => setCurrentMode('create')}
            >
              <Plus size={16} />
              Suggestions
            </ModeTab>
            <ModeTab 
              $active={currentMode === 'url-import' || currentMode === 'url-results'} 
              onClick={() => setCurrentMode('url-import')}
            >
              <Link size={16} />
              Restaurant Menu
            </ModeTab>
          </ModeTabs>
        </UnifiedHeader>

        <ModalContent>
          {currentMode === 'view' && renderViewMode()}
          {currentMode === 'edit' && renderEditMode()}
          {currentMode === 'create' && renderCreateMode()}
          {currentMode === 'url-import' && renderUrlImportMode()}
          {currentMode === 'url-results' && renderUrlResultsMode()}
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default UnifiedMealModal; 