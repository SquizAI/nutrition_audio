import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useMealPlan } from '../services/mealPlanContext';
import { voiceProcessor } from '../utils/voiceIsolation';
import { 
  X, 
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Camera,
  Send,
  Image as ImageIcon,
  Loader2,
  Bot,
  User,
  Minimize2,
  Maximize2,
  Trash2,
  Volume2,
  VolumeX,
  Check,
  Shield,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

// MOBILE-FIRST DESIGN SYSTEM
// ==========================

const colors = {
  primary: '#8B5CF6',
  secondary: '#EC4899', 
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  surface: '#1F2937',
  surfaceLight: '#374151',
  text: '#F9FAFB',
  textMuted: '#9CA3AF',
  border: '#4B5563'
};

const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const voiceWave = keyframes`
  0%, 100% { height: 4px; }
  50% { height: 20px; }
`;

// MOBILE-FIRST COMPONENTS
// ======================

const ChatContainer = styled.div<{ $isMinimized: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(145deg, #0F172A 0%, #1E293B 50%, #334155 100%);
  display: ${({ $isMinimized }) => $isMinimized ? 'none' : 'flex'};
  flex-direction: column;
  z-index: 1000;
  
  @media (min-width: 768px) {
    position: relative;
    max-width: 400px;
    height: 600px;
    border-radius: 20px;
    margin: 2rem auto;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid ${colors.border};
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Avatar = styled.div<{ $isActive: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${({ $isActive }) => $isActive ? pulse : 'none'} 2s ease-in-out infinite;
`;

const StatusInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  color: ${colors.text};
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
`;

const Status = styled.span<{ $status: string }>`
  color: ${({ $status }) => {
    switch ($status) {
      case 'connected': return colors.success;
      case 'connecting': return colors.warning;
      case 'listening': return colors.secondary;
      case 'thinking': return colors.primary;
      default: return colors.textMuted;
    }
  }};
  font-size: 0.75rem;
  font-weight: 500;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const IconButton = styled.button<{ $variant?: 'primary' | 'danger' | 'muted' }>`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  background: ${({ $variant }) => {
    switch ($variant) {
      case 'primary': return `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`;
      case 'danger': return colors.error;
      case 'muted': return colors.surfaceLight;
      default: return 'rgba(255, 255, 255, 0.1)';
    }
  }};
  color: ${colors.text};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const MessagesArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Message = styled.div<{ $isUser: boolean; $type: string }>`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  align-self: ${({ $isUser }) => $isUser ? 'flex-end' : 'flex-start'};
  max-width: 85%;
  animation: ${slideUp} 0.3s ease-out;
`;

const MessageBubble = styled.div<{ $isUser: boolean; $type: string }>`
  background: ${({ $isUser, $type }) => {
    if ($type === 'system') return `linear-gradient(135deg, ${colors.warning} 0%, #F97316 100%)`;
    if ($type === 'function') return `linear-gradient(135deg, ${colors.success} 0%, #059669 100%)`;
    return $isUser 
      ? `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
      : colors.surfaceLight;
  }};
  color: ${colors.text};
  padding: 0.75rem 1rem;
  border-radius: ${({ $isUser }) => $isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px'};
  font-size: 0.9rem;
  line-height: 1.4;
  word-wrap: break-word;
`;

const MessageIcon = styled.div<{ $isUser: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${({ $isUser }) => $isUser ? colors.primary : colors.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 0.25rem;
`;

const VoiceVisualization = styled.div<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  height: 24px;
  
  span {
    width: 3px;
    background: ${colors.success};
    border-radius: 2px;
    animation: ${({ $isActive }) => $isActive ? voiceWave : 'none'} 0.6s ease-in-out infinite;
    
    &:nth-child(1) { animation-delay: 0s; height: 8px; }
    &:nth-child(2) { animation-delay: 0.1s; height: 12px; }
    &:nth-child(3) { animation-delay: 0.2s; height: 16px; }
    &:nth-child(4) { animation-delay: 0.3s; height: 12px; }
    &:nth-child(5) { animation-delay: 0.4s; height: 8px; }
  }
`;

const InputArea = styled.div`
  padding: 1rem;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px);
  border-top: 1px solid ${colors.border};
`;

const ImagePreview = styled.div<{ $visible: boolean }>`
  display: ${({ $visible }) => $visible ? 'flex' : 'none'};
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: ${colors.surfaceLight};
  border-radius: 12px;
  margin-bottom: 0.75rem;
`;

const PreviewImage = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  object-fit: cover;
`;

const PreviewInfo = styled.div`
  flex: 1;
  
  h4 {
    color: ${colors.text};
    font-size: 0.8rem;
    font-weight: 600;
    margin: 0 0 0.25rem 0;
  }
  
  p {
    color: ${colors.textMuted};
    font-size: 0.7rem;
    margin: 0;
  }
`;

const InputRow = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: flex-end;
`;

const TextInput = styled.textarea`
  flex: 1;
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  border-radius: 12px;
  padding: 0.75rem;
  color: ${colors.text};
  font-size: 0.9rem;
  resize: none;
  min-height: 44px;
  max-height: 120px;
  
  &::placeholder {
    color: ${colors.textMuted};
  }
  
  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const ControlButton = styled.button<{ $variant?: 'primary' | 'danger' | 'success' }>`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: none;
  background: ${({ $variant }) => {
    switch ($variant) {
      case 'primary': return `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`;
      case 'danger': return colors.error;
      case 'success': return colors.success;
      default: return colors.surfaceLight;
    }
  }};
  color: ${colors.text};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const MinimizedFloat = styled.div<{ $isMinimized: boolean }>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);
  display: ${({ $isMinimized }) => $isMinimized ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
  z-index: 1001;
  animation: ${pulse} 2s ease-in-out infinite;
  
  &:hover {
    transform: scale(1.1);
  }
`;

// INTERFACES & TYPES
// ==================

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type: 'voice' | 'system' | 'function';
}

interface UserInteraction {
  id: string;
  timestamp: string;
  type: 'voice_input' | 'text_input' | 'image_upload' | 'function_call' | 'ai_response';
  content: string;
  metadata?: {
    processingTime?: number;
    confidence?: number;
    deviceInfo?: any;
    fileSize?: number;
    fileType?: string;
    calories?: number;
    mealType?: string;
    mealName?: string;
    date?: string;
    modificationType?: string;
  };
}

interface ChatMobileProps {
  isOpen: boolean;
  onClose: () => void;
}

// ADVANCED PARSING SYSTEM
// =======================
class AdvancedParser {
  private static instance: AdvancedParser;
  
  static getInstance(): AdvancedParser {
    if (!AdvancedParser.instance) {
      AdvancedParser.instance = new AdvancedParser();
    }
    return AdvancedParser.instance;
  }

  // Enhanced meal extraction with multiple parsing strategies
  async extractMealData(text: string, isImageAnalysis = false): Promise<any | null> {
    try {
      // Strategy 1: Direct meal parsing
      const directResult = await this.directMealParsing(text, isImageAnalysis);
      if (directResult) return directResult;

      // Strategy 2: Context-aware parsing
      const contextResult = await this.contextAwareParsing(text);
      if (contextResult) return contextResult;

      // Strategy 3: Fuzzy matching for common foods
      const fuzzyResult = await this.fuzzyFoodMatching(text);
      if (fuzzyResult) return fuzzyResult;

      return null;
    } catch (error) {
      console.error('Advanced parsing error:', error);
      return null;
    }
  }

  private async directMealParsing(text: string, isImageAnalysis: boolean): Promise<any | null> {
    const foodKeywords = [
      'ate', 'had', 'eating', 'consumed', 'finished', 'devoured', 'munched',
      'breakfast', 'lunch', 'dinner', 'snack', 'meal', 'food', 'dish'
    ];
    
    const portionKeywords = [
      'half', 'quarter', 'double', 'triple', 'small', 'medium', 'large',
      'cup', 'cups', 'tablespoon', 'teaspoon', 'ounce', 'ounces', 'gram', 'grams',
      'slice', 'slices', 'piece', 'pieces', 'serving', 'servings'
    ];

    const hasFoodMention = foodKeywords.some(keyword => 
      text.toLowerCase().includes(keyword)
    );
    
    const hasPortionMention = portionKeywords.some(keyword => 
      text.toLowerCase().includes(keyword)
    );

    if (!hasFoodMention && !isImageAnalysis) return null;

    const response = await fetch('/api/openai-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: `You are an expert nutrition parser. Extract meal information from user input and return ONLY valid JSON with no markdown formatting.

CRITICAL REQUIREMENTS:
1. Return ONLY valid JSON - no markdown, no backticks, no explanations
2. Set "shouldLog" to true ONLY if the user clearly ate/consumed food
3. Estimate realistic portions and nutrition values
4. Handle portion modifications (half, double, etc.)
5. Identify the most appropriate meal type based on context

Response format:
{
  "name": "meal name",
  "calories": number,
  "protein": number,
  "carbs": number,
  "fat": number,
  "mealType": "breakfast|lunch|dinner|snacks",
  "ingredients": ["ingredient1", "ingredient2"],
  "portionMultiplier": number (1.0 = normal, 0.5 = half, 2.0 = double),
  "confidence": number (0-1),
  "shouldLog": boolean,
  "modifications": "description of any portion changes"
}`
          },
          {
            role: "user", 
            content: text
          }
        ]
      })
    });

    if (!response.ok) return null;

    const data = await response.json();
    let content = data.choices[0]?.message?.content;
    
    if (!content) return null;

    // Clean any markdown formatting
    content = content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    
    // Remove any leading/trailing text that isn't JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      content = jsonMatch[0];
    }

    try {
      const mealData = JSON.parse(content);
      
      if (mealData.shouldLog && mealData.name && mealData.confidence > 0.6) {
        return {
          id: `meal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          ...mealData
        };
      }
    } catch (parseError) {
      console.error('JSON parsing error in direct parsing:', parseError);
    }

    return null;
  }

  private async contextAwareParsing(text: string): Promise<any | null> {
    // Enhanced context parsing for complex scenarios
    const modificationContext = sessionStorage.getItem('mealModificationContext');
    let context = '';
    
    if (modificationContext) {
      try {
        const ctx = JSON.parse(modificationContext);
        context = `Context: User is modifying ${ctx.meal?.name || 'a meal'} from ${ctx.date}. Original calories: ${ctx.meal?.calories || 0}.`;
      } catch (e) {
        // Ignore context parsing errors
      }
    }

    const response = await fetch('/api/openai-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: `You are a context-aware nutrition parser. Use the provided context to better understand meal modifications and portion changes.

${context}

Parse the user's input for:
1. Meal substitutions ("ate X instead of Y")
2. Portion modifications ("ate half", "had more")
3. Time-based meal logging ("yesterday I had", "tomorrow I want")
4. Ingredient-based requests ("make something with chicken")

Return valid JSON only - no markdown formatting.`
          },
          {
            role: "user", 
            content: text
          }
        ]
      })
    });

    if (!response.ok) return null;

    const data = await response.json();
    let content = data.choices[0]?.message?.content;
    
    if (!content) return null;

    content = content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      content = jsonMatch[0];
    }

    try {
      const mealData = JSON.parse(content);
      if (mealData.shouldLog && mealData.name) {
        return {
          id: `meal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          ...mealData
        };
      }
    } catch (parseError) {
      console.error('JSON parsing error in context parsing:', parseError);
    }

    return null;
  }

  private async fuzzyFoodMatching(text: string): Promise<any | null> {
    // Common food database for quick matching
    const commonFoods = {
      'apple': { calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
      'banana': { calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
      'chicken breast': { calories: 165, protein: 31, carbs: 0, fat: 3.6 },
      'salmon': { calories: 206, protein: 22, carbs: 0, fat: 12 },
      'rice': { calories: 205, protein: 4.3, carbs: 45, fat: 0.4 },
      'pasta': { calories: 220, protein: 8, carbs: 44, fat: 1 },
      'salad': { calories: 50, protein: 3, carbs: 10, fat: 0.5 },
      'pizza': { calories: 285, protein: 12, carbs: 36, fat: 10 },
      'burger': { calories: 540, protein: 25, carbs: 40, fat: 31 }
    };

    const lowerText = text.toLowerCase();
    for (const [foodName, nutrition] of Object.entries(commonFoods)) {
      if (lowerText.includes(foodName)) {
        return {
          id: `meal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: foodName.charAt(0).toUpperCase() + foodName.slice(1),
          ...nutrition,
          mealType: this.inferMealType(text),
          ingredients: [foodName],
          confidence: 0.8,
          shouldLog: true,
          source: 'fuzzy_match'
        };
      }
    }

    return null;
  }

  private inferMealType(text: string): string {
    const timeWords = text.toLowerCase();
    if (timeWords.includes('breakfast') || timeWords.includes('morning')) return 'breakfast';
    if (timeWords.includes('lunch') || timeWords.includes('noon')) return 'lunch';
    if (timeWords.includes('dinner') || timeWords.includes('evening')) return 'dinner';
    
    const currentHour = new Date().getHours();
    if (currentHour < 11) return 'breakfast';
    if (currentHour < 16) return 'lunch';
    if (currentHour < 21) return 'dinner';
    return 'snacks';
  }
}

// UNIFIED VOICE AGENT COORDINATOR
// ===============================
class VoiceAgentCoordinator {
  private static instance: VoiceAgentCoordinator;
  private isVoiceActive = false;
  private isTTSActive = false;
  private currentAudioElement: HTMLAudioElement | null = null;
  
  static getInstance(): VoiceAgentCoordinator {
    if (!VoiceAgentCoordinator.instance) {
      VoiceAgentCoordinator.instance = new VoiceAgentCoordinator();
    }
    return VoiceAgentCoordinator.instance;
  }

  setVoiceActive(active: boolean) {
    this.isVoiceActive = active;
    if (active && this.isTTSActive) {
      this.stopTTS();
    }
  }

  setTTSActive(active: boolean) {
    this.isTTSActive = active;
  }

  canPlayTTS(): boolean {
    return !this.isVoiceActive;
  }

  stopTTS() {
    if (this.currentAudioElement) {
      this.currentAudioElement.pause();
      this.currentAudioElement.currentTime = 0;
      this.currentAudioElement = null;
    }
    this.isTTSActive = false;
  }

  setCurrentAudio(audio: HTMLAudioElement) {
    this.currentAudioElement = audio;
  }
}

// MAIN COMPONENT
// ==============

const ChatMobile: React.FC<ChatMobileProps> = ({ isOpen, onClose }) => {
  // MEAL PLAN INTEGRATION
  const { addMeal, selectedDate } = useMealPlan();
  
  // STATE MANAGEMENT
  const [isMinimized, setIsMinimized] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [callStatus, setCallStatus] = useState<'idle' | 'connecting' | 'connected' | 'listening' | 'thinking' | 'talking'>('idle');
  const [messages, setMessages] = useState<Message[]>([]);
  const [textInput, setTextInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  // VOICE ISOLATION STATE
  const [voiceIsolationEnabled, setVoiceIsolationEnabled] = useState(true);
  const [speakerVerified, setSpeakerVerified] = useState(false);
  const [noiseLevel, setNoiseLevel] = useState(0);
  const [voiceConfidence, setVoiceConfidence] = useState(0);
  const [hasVoiceProfile, setHasVoiceProfile] = useState(false);

  // REFS
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const voiceProcessingInterval = useRef<NodeJS.Timeout | null>(null);

  // ADVANCED PARSING AND COORDINATION INSTANCES
  const advancedParser = useRef(AdvancedParser.getInstance());
  const voiceCoordinator = useRef(VoiceAgentCoordinator.getInstance());

  // AUTO-CONNECT WHEN CHAT OPENS
  useEffect(() => {
    if (isOpen && !isConnected && callStatus === 'idle') {
      // Auto-connect when chat opens
      setTimeout(() => {
        initializeConnection();
      }, 500); // Small delay for smooth UI transition
    }
  }, [isOpen]);

  // HANDLE MEAL MODIFICATION CONTEXT
  useEffect(() => {
    if (isOpen && isConnected) {
      // Check if there's a meal modification context
      const modContext = sessionStorage.getItem('mealModificationContext');
      if (modContext) {
        try {
          const context = JSON.parse(modContext);
          handleMealModificationContext(context);
          // Clear the context after using it
          sessionStorage.removeItem('mealModificationContext');
        } catch (error) {
          console.error('Error parsing meal modification context:', error);
          sessionStorage.removeItem('mealModificationContext');
        }
      }
    }
  }, [isOpen, isConnected]);

  // Update voice coordinator state
  useEffect(() => {
    voiceCoordinator.current.setVoiceActive(callStatus === 'listening' || callStatus === 'thinking' || callStatus === 'talking');
  }, [callStatus]);

  const handleMealModificationContext = (context: any) => {
    const { meal, mealType, date, modificationType } = context;
    
    let contextMessage = '';
    
    switch (modificationType) {
      case 'ate_half':
        contextMessage = `Hey JME! I only ate half of my ${meal?.name || mealType} today (${date}). Can you update my nutrition tracking to reflect that I ate about ${Math.round((meal?.calories || 0) / 2)} calories instead of ${meal?.calories || 0}?`;
        break;
      case 'ate_more':
        contextMessage = `Hi JME! I ended up eating more of my ${meal?.name || mealType} than planned on ${date}. Can you help me adjust the portions and calories?`;
        break;
      case 'ate_double':
        contextMessage = `Hey! I ate double the portion of my ${meal?.name || mealType} on ${date}. That would be about ${Math.round((meal?.calories || 0) * 2)} calories total. Can you update my tracking?`;
        break;
      case 'didnt_eat':
        contextMessage = `JME, I didn't end up eating my planned ${meal?.name || mealType} on ${date}. Can you remove it from my daily tracker?`;
        break;
      case 'ate_different':
        contextMessage = `Hi! Instead of my planned ${meal?.name || mealType} on ${date}, I ate something different. Can you help me log what I actually ate?`;
        break;
      case 'substitute':
        contextMessage = `Hey JME! Can you suggest some healthy substitutes for ${meal?.name || mealType}? I want something with similar nutrition but different ingredients.`;
        break;
      case 'plan_similar':
        contextMessage = `Hi! I really liked my ${meal?.name || mealType}. Can you help me plan similar meals for other days this week?`;
        break;
      case 'add_ingredients':
        contextMessage = `JME, can you add all the ingredients from my ${meal?.name || mealType} to my grocery list? Here are the ingredients: ${meal?.ingredients?.join(', ') || 'ingredients not listed'}.`;
        break;
      case 'suggest_meal':
        contextMessage = `Hey JME! Can you suggest a healthy ${mealType} for ${date}? I'm looking for something nutritious and tasty!`;
        break;
      case 'use_ingredients':
        contextMessage = `Hi! I want to plan a ${mealType} using ingredients I already have. Can you help me create something delicious?`;
        break;
      case 'dietary_preferences':
        contextMessage = `JME, can you suggest a ${mealType} that matches my dietary goals and preferences?`;
        break;
      case 'custom_portion':
        contextMessage = `Hi JME! I ate a different portion of my ${meal?.name || mealType} on ${date}. Can you help me figure out the exact calories and macros for what I actually ate?`;
        break;
      default:
        contextMessage = `Hey JME! I need help with my ${meal?.name || mealType} from ${date}. Can you assist me?`;
    }

    // Add the contextual message
    addMessage(contextMessage, true);
    
    // Track the contextual interaction
    trackInteraction({
      type: 'function_call',
      content: `Meal modification context: ${modificationType}`,
      metadata: {
        mealName: meal?.name,
        mealType,
        date,
        modificationType,
        calories: meal?.calories
      }
    });

    // Send to AI if connected
    if (dataChannelRef.current && dataChannelRef.current.readyState === 'open') {
      const textMessage = {
        type: "conversation.item.create",
        item: {
          type: "message",
          role: "user",
          content: [{ type: "input_text", text: contextMessage }]
        }
      };
      
      dataChannelRef.current.send(JSON.stringify(textMessage));
      
      const responseCreate = { type: "response.create" };
      dataChannelRef.current.send(JSON.stringify(responseCreate));
    }
  };

  // USER INTERACTION TRACKING
  // =========================

  const trackInteraction = async (interaction: Omit<UserInteraction, 'id' | 'timestamp'>) => {
    const trackingData: UserInteraction = {
      id: `interaction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      ...interaction,
      metadata: {
        ...interaction.metadata,
        deviceInfo: {
          userAgent: navigator.userAgent,
          screenWidth: window.screen.width,
          screenHeight: window.screen.height,
          isMobile: window.innerWidth <= 768,
          connectionType: (navigator as any).connection?.effectiveType || 'unknown'
        }
      }
    };

    // Store locally for performance analysis
    const existingInteractions = JSON.parse(localStorage.getItem('userInteractions') || '[]');
    existingInteractions.push(trackingData);
    
    // Keep only last 500 interactions
    if (existingInteractions.length > 500) {
      existingInteractions.splice(0, existingInteractions.length - 500);
    }
    
    localStorage.setItem('userInteractions', JSON.stringify(existingInteractions));
    
    console.log('📊 Interaction tracked:', {
      type: interaction.type,
      processingTime: interaction.metadata?.processingTime
    });
  };

  // VOICE ISOLATION PROCESSING
  // ==========================

  const startVoiceProcessing = () => {
    if (voiceProcessingInterval.current) return;

    voiceProcessingInterval.current = setInterval(() => {
      if (!voiceIsolationEnabled) return;

      // Monitor voice activity
      const voiceActivity = voiceProcessor.detectVoiceActivity();
      setVoiceConfidence(voiceActivity.confidence);
      setNoiseLevel(voiceActivity.noiseLevel);
      setIsVoiceActive(voiceActivity.isVoiceDetected);

      // Apply adaptive noise reduction
      voiceProcessor.adaptiveNoiseReduction(voiceActivity.noiseLevel);

      // Verify speaker if we have voice profiles
      if (hasVoiceProfile && voiceActivity.isVoiceDetected) {
        const verification = voiceProcessor.verifySpeaker();
        setSpeakerVerified(verification.isVerified);
        
        if (!verification.isVerified && verification.confidence < 0.5) {
          // Unknown speaker detected - show warning
          addMessage('⚠️ Unknown speaker detected. Voice isolation active.', false, 'system');
        }
      }
    }, 100); // Process every 100ms for real-time feedback
  };

  const stopVoiceProcessing = () => {
    if (voiceProcessingInterval.current) {
      clearInterval(voiceProcessingInterval.current);
      voiceProcessingInterval.current = null;
    }
  };

  const createVoiceProfile = async () => {
    try {
      const success = await voiceProcessor.createVoiceProfile('user1', 'User');
      if (success) {
        setHasVoiceProfile(true);
        addMessage('✅ Voice profile created! Speaker verification is now active.', false, 'system');
      } else {
        addMessage('❌ Failed to create voice profile. Please try speaking again.', false, 'system');
      }
    } catch (error) {
      console.error('Error creating voice profile:', error);
      addMessage('❌ Error creating voice profile.', false, 'system');
    }
  };

  const enhanceAudioStream = async (stream: MediaStream): Promise<MediaStream> => {
    if (!voiceIsolationEnabled) return stream;

    try {
      const enhancedStream = await voiceProcessor.initializeAudioProcessing(stream);
      return enhancedStream;
    } catch (error) {
      console.error('Error enhancing audio stream:', error);
      return stream; // Fallback to original stream
    }
  };

  // ENHANCED ELEVENLABS TTS WITH COORDINATION
  // ========================================

  const speakWithElevenLabs = async (text: string) => {
    try {
      if (!text || text.trim().length < 2) return;
      
      // Check if voice agent allows TTS
      if (!voiceCoordinator.current.canPlayTTS()) {
        console.log('TTS blocked - voice agent is active');
        return;
      }

      const cleanText = text
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/#{1,6}\s/g, '')
        .replace(/\n{2,}/g, '. ')
        .replace(/\n/g, ' ')
        .trim();

      voiceCoordinator.current.setTTSActive(true);

      const response = await fetch('/api/elevenlabs-tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: cleanText
        })
      });

      if (!response.ok) throw new Error(`TTS Error: ${response.status}`);

      const data = await response.json();
      const audioBlob = new Blob([Uint8Array.from(atob(data.audio), c => c.charCodeAt(0))], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      voiceCoordinator.current.setCurrentAudio(audio);
      
      audio.volume = isMuted ? 0 : 1;
      audio.onplay = () => {
        if (voiceCoordinator.current.canPlayTTS()) {
          setCallStatus('talking');
        }
      };
      audio.onended = () => {
        setCallStatus('connected');
        voiceCoordinator.current.setTTSActive(false);
        URL.revokeObjectURL(audioUrl);
      };
      audio.onerror = () => {
        voiceCoordinator.current.setTTSActive(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      // Only play if voice agent still allows it
      if (voiceCoordinator.current.canPlayTTS()) {
        await audio.play();
      } else {
        voiceCoordinator.current.setTTSActive(false);
        URL.revokeObjectURL(audioUrl);
      }
      
    } catch (error) {
      console.error('TTS Error:', error);
      voiceCoordinator.current.setTTSActive(false);
    }
  };

  // OPENAI VISION INTEGRATION
  // ========================

  const analyzeImageWithVision = async (imageFile: File, userPrompt?: string): Promise<string> => {
    try {
      const base64Image = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          resolve(result.split(',')[1]);
        };
        reader.readAsDataURL(imageFile);
      });

      const response = await fetch('/api/openai-vision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          imageData: `data:image/jpeg;base64,${base64Image}`,
          prompt: userPrompt || "Hey! What do you have there? 😊 Tell me about the food in this pic - what you're eating, how much, and I'll help you track it! I love seeing what people are enjoying!"
        })
      });

      if (!response.ok) throw new Error(`Vision API error: ${response.status}`);

      const data = await response.json();
      return data.choices[0]?.message?.content || 'Could not analyze image';

    } catch (error) {
      console.error('Vision analysis error:', error);
      return 'Error analyzing image. Please try again.';
    }
  };

  // MESSAGE HANDLING
  // ===============

  const addMessage = (text: string, isUser: boolean, type: 'voice' | 'system' | 'function' = 'voice') => {
    const message: Message = {
      id: Date.now().toString() + Math.random(),
      text,
      isUser,
      timestamp: new Date(),
      type
    };
    setMessages(prev => [...prev, message]);
    
    // Auto-scroll to bottom
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // IMAGE HANDLING
  // =============

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addMessage('Oops! That doesn\'t look like an image file. Can you try selecting a photo instead?', false, 'system');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      addMessage('Whoa, that image is pretty big! Could you try one that\'s under 20MB? Thanks!', false, 'system');
      return;
    }

    setSelectedImage(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
      
      trackInteraction({
        type: 'image_upload',
        content: `Image uploaded: ${file.name}`,
        metadata: {
          fileSize: file.size,
          fileType: file.type
        }
      });
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // TEXT INPUT HANDLING
  // ==================

  const handleTextSubmit = async () => {
    if (!textInput.trim() && !selectedImage) return;

    const message = textInput.trim() || '📸 Analyze this image';
    setTextInput('');
    addMessage(message, true);

    trackInteraction({
      type: 'text_input',
      content: message
    });

    // Handle image analysis
    if (selectedImage) {
      setCallStatus('thinking');
      addMessage('🔍 Analyzing image...', false, 'system');
      
      const analysisResult = await analyzeImageWithVision(selectedImage, textInput || undefined);
      
      addMessage(analysisResult, false, 'function');
      speakWithElevenLabs(analysisResult);
      
      // Try to extract and log meal from image analysis
      const meal = await extractMealFromText(analysisResult, true);
      if (meal) {
        await logMealToTracker(meal);
      }
      
      removeImage();
      setCallStatus('connected');
      
      trackInteraction({
        type: 'ai_response',
        content: `Vision analysis completed`,
        metadata: {
          confidence: 0.9
        }
      });
    } else {
      // Handle regular text via voice connection
      if (dataChannelRef.current && dataChannelRef.current.readyState === 'open') {
        const textMessage = {
          type: "conversation.item.create",
          item: {
            type: "message",
            role: "user",
            content: [{ type: "input_text", text: message }]
          }
        };
        
        dataChannelRef.current.send(JSON.stringify(textMessage));
        
        const responseCreate = { type: "response.create" };
        dataChannelRef.current.send(JSON.stringify(responseCreate));
        
        // Try to extract and log meal from text input
        extractMealFromText(message).then(meal => {
          if (meal) {
            logMealToTracker(meal);
          }
        });
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTextSubmit();
    }
  };

  // VOICE CONNECTION HANDLING
  // ========================

  const toggleConnection = () => {
    if (isConnected) {
      // Disconnect and cleanup
      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }
      if (dataChannelRef.current) {
        dataChannelRef.current.close();
        dataChannelRef.current = null;
      }
      
      // Stop voice processing
      stopVoiceProcessing();
      voiceProcessor.cleanup();
      
      setIsConnected(false);
      setCallStatus('idle');
      setSpeakerVerified(false);
      setVoiceConfidence(0);
      setNoiseLevel(0);
      addMessage('📞 Connection ended', false, 'system');
    } else {
      // Connect
      initializeConnection();
    }
  };

  const initializeConnection = async () => {
    try {
      setCallStatus('connecting');
      addMessage('🤝 Hey there! Connecting you to JME, your AI nutrition buddy...', false, 'system');

      // Get ephemeral token
      const tokenResponse = await fetch("/api/session", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!tokenResponse.ok) throw new Error('Failed to get token');
      
      const data = await tokenResponse.json();
      const EPHEMERAL_KEY = data.client_secret.value;

      // Create peer connection
      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      // Add microphone with voice isolation enhancement
      const ms = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 24000
        } 
      });

      // Enhance audio stream with voice isolation
      const enhancedStream = await enhanceAudioStream(ms);
      enhancedStream.getTracks().forEach(track => pc.addTrack(track, enhancedStream));

      // Start voice processing monitoring
      startVoiceProcessing();

      // Create data channel
      const dc = pc.createDataChannel("oai-events");
      dataChannelRef.current = dc;

      dc.addEventListener("open", () => {
        setIsConnected(true);
        setCallStatus('connected');
        addMessage('Hey there! I\'m JME (pronounced Ja-mie), your AI nutrition buddy! Ready to chat about your food and help you track everything? What\'s up?', false, 'system');
        
        // Configure session
        const sessionUpdate = {
          type: "session.update",
          session: {
            modalities: ["text"],
            instructions: `You're JME (pronounced Ja-mie), a super friendly AI nutrition buddy! Chat like you're texting a close friend who's really into health and fitness. When users mention food they ate or are eating, get excited and ask follow-up questions like "How much did you have?" or "What size portion?" to help them track accurately. 

When users want to modify meals, help them update their meal plan by asking about changes like:
- "Did you eat more or less than planned?"
- "Want to swap this for something else?"
- "How should we update your tracking for this meal?"

For meal planning requests like "I want pot roast tomorrow," get excited and ask about preferences, then help them plan it out with ingredients for their grocery list.

Keep it casual, fun, and encouraging. Use emojis, be excited about their progress, and celebrate when they eat healthy! Keep responses SHORT (1-2 sentences max) and conversational. Make them feel supported, not judged. Always encourage them to share more details about their meals!`,
            voice: "verse",
            input_audio_format: "pcm16",
            input_audio_transcription: { model: "whisper-1" },
            turn_detection: {
              type: "server_vad",
              threshold: 0.4,
              prefix_padding_ms: 200,
              silence_duration_ms: 600
            },
            temperature: 0.9,
            max_response_output_tokens: 200
          }
        };
        
        dc.send(JSON.stringify(sessionUpdate));
      });

      dc.addEventListener("message", async (event) => {
        const response = JSON.parse(event.data);
        
        switch (response.type) {
          case "input_audio_buffer.speech_started":
            setCallStatus('listening');
            setIsVoiceActive(true);
            // Notify coordinator that voice is active
            voiceCoordinator.current.setVoiceActive(true);
            break;
            
          case "input_audio_buffer.speech_stopped":
            setCallStatus('thinking');
            setIsVoiceActive(false);
            // Keep voice active during thinking phase
            voiceCoordinator.current.setVoiceActive(true);
            break;
            
          case "conversation.item.input_audio_transcription.completed":
            if (response.transcript) {
              addMessage(response.transcript, true);
              trackInteraction({
                type: 'voice_input',
                content: response.transcript
              });
              
              // Try to extract and log meal from transcript using advanced parser
              const meal = await extractMealFromText(response.transcript);
              if (meal) {
                await logMealToTracker(meal);
              }
            }
            break;
            
          case "response.text.done":
            if (response.text) {
              addMessage(response.text, false);
              
              // Use voice coordinator to manage TTS
              if (voiceCoordinator.current.canPlayTTS()) {
                speakWithElevenLabs(response.text);
              }
              
              trackInteraction({
                type: 'ai_response',
                content: response.text
              });
              
              // Try to extract and log meal from AI response
              const meal = await extractMealFromText(response.text);
              if (meal) {
                await logMealToTracker(meal);
              }
            }
            setCallStatus('connected');
            // Allow TTS after response is complete
            voiceCoordinator.current.setVoiceActive(false);
            break;
            
          case "response.audio_transcript.done":
            // Handle voice response completion
            setCallStatus('connected');
            voiceCoordinator.current.setVoiceActive(false);
            break;
            
          case "error":
            console.error('Realtime API error:', response);
            addMessage('❌ Connection error occurred. Please try reconnecting.', false, 'system');
            setCallStatus('connected');
            voiceCoordinator.current.setVoiceActive(false);
            break;
        }
      });

      // Create offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Send to OpenAI
      const sdpResponse = await fetch("https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17", {
        method: "POST",
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${EPHEMERAL_KEY}`,
          "Content-Type": "application/sdp"
        },
      });

      if (!sdpResponse.ok) throw new Error(`SDP Error: ${sdpResponse.status}`);

      const answerSdp = await sdpResponse.text();
      await pc.setRemoteDescription({
        type: "answer",
        sdp: answerSdp,
      });

    } catch (error) {
      console.error('Connection error:', error);
      setCallStatus('idle');
      setIsConnected(false);
      addMessage(`❌ Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`, false, 'system');
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [textInput]);

  // ADVANCED MEAL EXTRACTION
  // ========================

  const extractMealFromText = async (text: string, isImageAnalysis = false): Promise<any | null> => {
    try {
      return await advancedParser.current.extractMealData(text, isImageAnalysis);
    } catch (error) {
      console.error('Error in advanced meal extraction:', error);
      return null;
    }
  };

  // MEAL LOGGING FUNCTIONS
  // ======================

  const logMealToTracker = async (meal: any) => {
    try {
      addMeal(selectedDate, meal.mealType, meal);
      
      // Show success message
      addMessage(`✅ Logged ${meal.name} (${meal.calories} cal) to your ${meal.mealType}!`, false, 'system');
      
      trackInteraction({
        type: 'function_call',
        content: `Meal logged: ${meal.name}`,
        metadata: {
          calories: meal.calories,
          mealType: meal.mealType
        }
      });

      return true;
    } catch (error) {
      console.error('Error logging meal:', error);
      addMessage('Sorry, I had trouble logging that meal. Could you try again?', false, 'system');
      return false;
    }
  };

  // RENDER
  // ======

  if (!isOpen) return null;

  return (
    <>
      <ChatContainer $isMinimized={isMinimized}>
        <Header>
          <HeaderLeft>
            <Avatar $isActive={callStatus === 'listening' || callStatus === 'thinking'}>
              <Bot size={20} color="white" />
            </Avatar>
            <StatusInfo>
              <Title>JME - AI Nutritionist</Title>
              <Status $status={callStatus}>
                {callStatus === 'idle' ? 'Connecting...' :
                 callStatus === 'connecting' ? 'Connecting...' :
                 callStatus === 'connected' ? 'Ready to chat' :
                 callStatus === 'listening' ? 'Listening...' :
                 callStatus === 'thinking' ? 'Processing...' :
                 'Speaking...'}
              </Status>
              
              {/* Voice Isolation Status */}
              {isConnected && voiceIsolationEnabled && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                  <Shield size={10} color={speakerVerified ? colors.success : colors.warning} />
                  <span style={{ fontSize: '0.6rem', color: colors.textMuted }}>
                    {speakerVerified ? 'Verified' : 'Monitoring'} • 
                    Noise: {Math.round(noiseLevel * 100)}% • 
                    Confidence: {Math.round(voiceConfidence * 100)}%
                  </span>
                </div>
              )}
            </StatusInfo>
          </HeaderLeft>
          
          <HeaderActions>
            {/* Voice Isolation Toggle */}
            <IconButton 
              onClick={() => setVoiceIsolationEnabled(!voiceIsolationEnabled)}
              $variant={voiceIsolationEnabled ? 'primary' : 'muted'}
              title="Toggle voice isolation"
            >
              <Shield size={16} />
            </IconButton>

            {/* Create Voice Profile */}
            {isConnected && voiceIsolationEnabled && !hasVoiceProfile && (
              <IconButton 
                onClick={createVoiceProfile}
                $variant="primary"
                title="Create voice profile"
              >
                <CheckCircle size={16} />
              </IconButton>
            )}

            <IconButton onClick={() => setIsMuted(!isMuted)}>
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </IconButton>
            <IconButton onClick={() => setIsMinimized(true)}>
              <Minimize2 size={16} />
            </IconButton>
            <IconButton onClick={onClose}>
              <X size={16} />
            </IconButton>
          </HeaderActions>
        </Header>

        <MessagesArea>
          {callStatus === 'listening' && (
            <Message $isUser={false} $type="system">
              <MessageIcon $isUser={false}>
                <VoiceVisualization $isActive={isVoiceActive}>
                  <span></span><span></span><span></span><span></span><span></span>
                </VoiceVisualization>
              </MessageIcon>
              <MessageBubble $isUser={false} $type="system">
                Listening...
              </MessageBubble>
            </Message>
          )}
          
          {messages.map((message) => (
            <Message key={message.id} $isUser={message.isUser} $type={message.type}>
              <MessageIcon $isUser={message.isUser}>
                {message.isUser ? <User size={12} /> : <Bot size={12} />}
              </MessageIcon>
              <MessageBubble $isUser={message.isUser} $type={message.type}>
                <div dangerouslySetInnerHTML={{ 
                  __html: message.text
                    .replace(/\n/g, '<br/>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                }} />
              </MessageBubble>
            </Message>
          ))}
          <div ref={messagesEndRef} />
        </MessagesArea>

        <InputArea>
          <ImagePreview $visible={!!imagePreview}>
            {imagePreview && (
              <>
                <PreviewImage src={imagePreview} alt="Selected" />
                <PreviewInfo>
                  <h4>Image selected</h4>
                  <p>{selectedImage?.name} • {(selectedImage?.size || 0 / 1024).toFixed(1)}KB</p>
                </PreviewInfo>
                <IconButton onClick={removeImage}>
                  <Trash2 size={16} />
                </IconButton>
              </>
            )}
          </ImagePreview>
          
          <InputRow>
            <ControlButton onClick={toggleConnection} $variant={isConnected ? 'danger' : 'primary'}>
              {callStatus === 'connecting' ? (
                <Loader2 size={20} className="animate-spin" />
              ) : isConnected ? (
                <PhoneOff size={20} />
              ) : (
                <Phone size={20} />
              )}
            </ControlButton>
            
            <ControlButton onClick={() => fileInputRef.current?.click()}>
              <Camera size={20} />
            </ControlButton>
            
            <TextInput
              ref={textareaRef}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={selectedImage ? "Describe what you see..." : "Type or speak about your food..."}
              rows={1}
            />
            
            <ControlButton onClick={handleTextSubmit} $variant="success" disabled={!textInput.trim() && !selectedImage}>
              <Send size={20} />
            </ControlButton>
          </InputRow>
        </InputArea>

        <HiddenFileInput
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
        />
      </ChatContainer>

      <MinimizedFloat $isMinimized={isMinimized} onClick={() => setIsMinimized(false)}>
        <Bot size={24} color="white" />
      </MinimizedFloat>
    </>
  );
};

export default ChatMobile; 