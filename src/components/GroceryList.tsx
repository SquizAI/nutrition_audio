import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { useMealPlan } from '../services/mealPlanContext';
import { 
  ShoppingCart, 
  CheckCircle, 
  Circle, 
  Calendar,
  Download,
  Share2,
  Filter,
  Search,
  X,
  Plus,
  Trash2,
  ShoppingBag,
  Apple,
  Beef,
  Milk,
  Wheat
} from 'lucide-react';

interface GroceryItem {
  id: string;
  name: string;
  category: string;
  quantity: string;
  isChecked: boolean;
  fromMeal?: string;
}

interface GroceryListProps {
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

const GroceryContainer = styled.div`
  background: linear-gradient(145deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
  border-radius: 24px;
  max-width: 900px;
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

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  color: white;
  font-size: 2rem;
  font-weight: 900;
  margin: 0;
  background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  @media (min-width: 768px) {
    font-size: 2.5rem;
  }
`;

const IconWrapper = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const Controls = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
`;

const ControlButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
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

const SearchBar = styled.div`
  position: relative;
  flex: 1;
  min-width: 200px;
`;

const SearchInput = styled.input`
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 0.75rem 1rem 0.75rem 3rem;
  color: white;
  font-size: 1rem;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  &:focus {
    outline: none;
    border-color: #ec4899;
    box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.2);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.5);
`;

const Content = styled.div`
  padding: 2rem;
  position: relative;
  z-index: 1;
`;

const WeekSelector = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: center;
`;

const WeekOption = styled.button<{ $active: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  background: ${({ $active }) => 
    $active 
      ? 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)'
      : 'rgba(255, 255, 255, 0.1)'};
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ $active }) => 
      $active 
        ? 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)'
        : 'rgba(255, 255, 255, 0.2)'};
  }
`;

const CategorySection = styled.div`
  margin-bottom: 2rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const CategoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const CategoryTitle = styled.h3`
  color: white;
  font-size: 1.2rem;
  font-weight: 800;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CategoryCount = styled.span`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const ItemsList = styled.div`
  display: grid;
  gap: 0.75rem;
`;

const GroceryItemCard = styled.div<{ $checked: boolean }>`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  opacity: ${({ $checked }) => $checked ? 0.6 : 1};
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(236, 72, 153, 0.4);
  }
`;

const CheckButton = styled.button<{ $checked: boolean }>`
  background: ${({ $checked }) => 
    $checked 
      ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
      : 'rgba(255, 255, 255, 0.1)'};
  border: 1px solid ${({ $checked }) => 
    $checked ? '#22c55e' : 'rgba(255, 255, 255, 0.2)'};
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.div<{ $checked: boolean }>`
  color: white;
  font-weight: 600;
  font-size: 1rem;
  text-decoration: ${({ $checked }) => $checked ? 'line-through' : 'none'};
  margin-bottom: 0.25rem;
`;

const ItemDetails = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
  display: flex;
  gap: 1rem;
`;

const AddItemForm = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const FormInput = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0.75rem;
  color: white;
  font-size: 0.9rem;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  &:focus {
    outline: none;
    border-color: #ec4899;
  }
`;

const FormSelect = styled.select`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0.75rem;
  color: white;
  font-size: 0.9rem;
  
  option {
    background: #1a1a2e;
    color: white;
  }
  
  &:focus {
    outline: none;
    border-color: #ec4899;
  }
`;

const Summary = styled.div`
  background: rgba(236, 72, 153, 0.1);
  border: 1px solid rgba(236, 72, 153, 0.3);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const SummaryText = styled.div`
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
`;

const GroceryList: React.FC<GroceryListProps> = ({ isOpen, onClose }) => {
  const { currentPlan } = useMealPlan();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWeek, setSelectedWeek] = useState('current');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', quantity: '', category: 'Other' });

  // Move categorizeIngredient function before it's used
  const categorizeIngredient = (ingredient: string): string => {
    const lower = ingredient.toLowerCase();
    
    if (lower.includes('chicken') || lower.includes('beef') || lower.includes('fish') || 
        lower.includes('turkey') || lower.includes('pork') || lower.includes('salmon')) {
      return 'Meat & Seafood';
    }
    
    if (lower.includes('apple') || lower.includes('banana') || lower.includes('berries') ||
        lower.includes('orange') || lower.includes('grapes') || lower.includes('fruit')) {
      return 'Fruits';
    }
    
    if (lower.includes('lettuce') || lower.includes('spinach') || lower.includes('carrot') ||
        lower.includes('broccoli') || lower.includes('vegetable') || lower.includes('tomato')) {
      return 'Vegetables';
    }
    
    if (lower.includes('milk') || lower.includes('cheese') || lower.includes('yogurt') ||
        lower.includes('butter') || lower.includes('cream')) {
      return 'Dairy';
    }
    
    if (lower.includes('bread') || lower.includes('rice') || lower.includes('pasta') ||
        lower.includes('oats') || lower.includes('quinoa') || lower.includes('grain')) {
      return 'Grains & Bread';
    }
    
    return 'Other';
  };

  // Generate grocery items from meal plans
  const groceryItems = useMemo(() => {
    const items: GroceryItem[] = [];
    
    currentPlan.forEach(dayPlan => {
      const addIngredientsFromMeal = (meal: any, mealName: string) => {
        if (meal && meal.ingredients) {
          meal.ingredients.forEach((ingredient: string, index: number) => {
            const category = categorizeIngredient(ingredient);
            items.push({
              id: `${dayPlan.date}-${mealName}-${index}`,
              name: ingredient,
              category,
              quantity: '1 serving',
              isChecked: false,
              fromMeal: `${mealName} (${new Date(dayPlan.date).toLocaleDateString()})`
            });
          });
        }
      };

      addIngredientsFromMeal(dayPlan.breakfast, 'Breakfast');
      addIngredientsFromMeal(dayPlan.lunch, 'Lunch');
      addIngredientsFromMeal(dayPlan.dinner, 'Dinner');
      dayPlan.snacks.forEach((snack, index) => {
        addIngredientsFromMeal(snack, `Snack ${index + 1}`);
      });
    });

    // Consolidate duplicate items
    const consolidated: { [key: string]: GroceryItem } = {};
    items.forEach(item => {
      const key = `${item.name.toLowerCase()}-${item.category}`;
      if (consolidated[key]) {
        consolidated[key].quantity = 'Multiple servings';
      } else {
        consolidated[key] = { ...item };
      }
    });

    return Object.values(consolidated);
  }, [currentPlan]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Meat & Seafood': return <Beef size={20} />;
      case 'Fruits': return <Apple size={20} />;
      case 'Vegetables': return <Apple size={20} />;
      case 'Dairy': return <Milk size={20} />;
      case 'Grains & Bread': return <Wheat size={20} />;
      default: return <ShoppingBag size={20} />;
    }
  };

  // Group items by category
  const itemsByCategory = useMemo(() => {
    const filtered = groceryItems.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const grouped: { [key: string]: GroceryItem[] } = {};
    filtered.forEach(item => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });
    
    return grouped;
  }, [groceryItems, searchTerm]);

  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const toggleItem = (itemId: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(itemId)) {
      newChecked.delete(itemId);
    } else {
      newChecked.add(itemId);
    }
    setCheckedItems(newChecked);
  };

  const totalItems = groceryItems.length;
  const checkedCount = checkedItems.size;

  const addNewItem = () => {
    if (newItem.name.trim()) {
      // In a real app, you'd add this to your state management
      setNewItem({ name: '', quantity: '', category: 'Other' });
      setShowAddForm(false);
    }
  };

  return (
    <ModalOverlay $isOpen={isOpen} onClick={onClose}>
      <GroceryContainer onClick={(e) => e.stopPropagation()}>
        <Header>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
          
          <HeaderContent>
            <IconWrapper>
              <ShoppingCart size={28} />
            </IconWrapper>
            <Title>Grocery List</Title>
          </HeaderContent>
          
          <Controls>
            <SearchBar>
              <SearchIcon>
                <Search size={18} />
              </SearchIcon>
              <SearchInput
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchBar>
            
            <ControlButton $variant="secondary" onClick={() => setShowAddForm(!showAddForm)}>
              <Plus size={18} />
              Add Item
            </ControlButton>
            
            <ControlButton $variant="secondary">
              <Download size={18} />
              Export
            </ControlButton>
            
            <ControlButton $variant="primary">
              <Share2 size={18} />
              Share
            </ControlButton>
          </Controls>
        </Header>

        <Content>
          <Summary>
            <SummaryText>
              {checkedCount} of {totalItems} items checked • {Math.round((checkedCount / totalItems) * 100) || 0}% complete
            </SummaryText>
          </Summary>

          {showAddForm && (
            <AddItemForm>
              <FormRow>
                <FormInput
                  placeholder="Item name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  style={{ flex: 2 }}
                />
                <FormInput
                  placeholder="Quantity"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                  style={{ flex: 1 }}
                />
                <FormSelect
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  style={{ flex: 1 }}
                >
                  <option value="Fruits">Fruits</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Meat & Seafood">Meat & Seafood</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Grains & Bread">Grains & Bread</option>
                  <option value="Other">Other</option>
                </FormSelect>
              </FormRow>
              <FormRow>
                <ControlButton $variant="primary" onClick={addNewItem}>
                  Add Item
                </ControlButton>
                <ControlButton $variant="secondary" onClick={() => setShowAddForm(false)}>
                  Cancel
                </ControlButton>
              </FormRow>
            </AddItemForm>
          )}

          {Object.keys(itemsByCategory).map(category => (
            <CategorySection key={category}>
              <CategoryHeader>
                <CategoryTitle>
                  {getCategoryIcon(category)}
                  {category}
                </CategoryTitle>
                <CategoryCount>{itemsByCategory[category].length}</CategoryCount>
              </CategoryHeader>
              
              <ItemsList>
                {itemsByCategory[category].map(item => (
                  <GroceryItemCard key={item.id} $checked={checkedItems.has(item.id)}>
                    <CheckButton 
                      $checked={checkedItems.has(item.id)}
                      onClick={() => toggleItem(item.id)}
                    >
                      {checkedItems.has(item.id) ? <CheckCircle size={16} /> : <Circle size={16} />}
                    </CheckButton>
                    
                    <ItemInfo>
                      <ItemName $checked={checkedItems.has(item.id)}>
                        {item.name}
                      </ItemName>
                      <ItemDetails>
                        <span>{item.quantity}</span>
                        {item.fromMeal && <span>• {item.fromMeal}</span>}
                      </ItemDetails>
                    </ItemInfo>
                  </GroceryItemCard>
                ))}
              </ItemsList>
            </CategorySection>
          ))}

          {Object.keys(itemsByCategory).length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              color: 'rgba(255, 255, 255, 0.6)', 
              padding: '3rem' 
            }}>
              <ShoppingCart size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <h3 style={{ margin: '0 0 0.5rem 0', color: 'white' }}>No items found</h3>
              <p style={{ margin: 0 }}>
                {searchTerm 
                  ? 'Try adjusting your search terms'
                  : 'Generate a meal plan to create your grocery list!'}
              </p>
            </div>
          )}
        </Content>
      </GroceryContainer>
    </ModalOverlay>
  );
};

export default GroceryList; 