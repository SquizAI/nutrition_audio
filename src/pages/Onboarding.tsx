import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { LifestyleSection } from '../components/onboarding/sections/LifestyleSection';
import { HealthHistorySection } from '../components/onboarding/sections/HealthHistorySection';
import { HydrationSleepSection } from '../components/onboarding/sections/HydrationSleepSection';

// Modern 2025 Animations
const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(5deg); }
`;

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.4); }
  50% { box-shadow: 0 0 0 20px rgba(102, 126, 234, 0); }
`;

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

const OnboardingContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #667eea 50%, #764ba2 75%, #667eea 100%);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
  position: relative;
  overflow: hidden;
  
  @keyframes gradientShift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.2) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const FloatingElements = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
`;

const FloatingIcon = styled.div<{ $top: string; $left: string; $delay: string }>`
  position: absolute;
  top: ${({ $top }) => $top};
  left: ${({ $left }) => $left};
  font-size: 2rem;
  opacity: 0.1;
  animation: ${floatAnimation} 6s ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay};
`;

const Header = styled.header`
  padding: 3rem 2rem 2rem;
  text-align: center;
  color: white;
  position: relative;
  z-index: 10;
`;

const SkipButton = styled.button`
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(20px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-3px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  }
`;

const Logo = styled.h1`
  font-size: 4rem;
  font-weight: 900;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 4px 8px rgba(0,0,0,0.1);
  letter-spacing: -0.02em;
  animation: ${slideInUp} 0.8s ease-out;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Tagline = styled.p`
  font-size: 1.4rem;
  opacity: 0.95;
  margin-bottom: 2rem;
  animation: ${slideInUp} 0.8s ease-out 0.2s both;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const ContentContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  position: relative;
  z-index: 10;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(30px);
  border-radius: 32px;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.1),
    0 8px 32px rgba(102, 126, 234, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  width: 100%;
  max-width: 900px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: ${slideInUp} 0.8s ease-out 0.4s both;
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  }
`;

const CardHeader = styled.div`
  padding: 3rem 3rem 2rem;
  text-align: center;
  position: relative;
`;

const CardTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 0.75rem;
  letter-spacing: -0.01em;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const CardSubtitle = styled.p`
  color: #64748b;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const ProgressContainer = styled.div`
  margin-top: 2rem;
`;

const ProgressTrack = styled.div`
  height: 8px;
  background: #f1f5f9;
  border-radius: 50px;
  overflow: hidden;
  position: relative;
  margin-bottom: 1.5rem;
`;

const ProgressFill = styled.div<{ $progress: number }>`
  height: 100%;
  width: ${({ $progress }) => `${$progress}%`};
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 50px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%);
    animation: shimmer 2s ease-in-out infinite;
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const StepDot = styled.div<{ $active: boolean; $completed: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ $active, $completed }) => 
    $active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' :
    $completed ? '#10b981' : '#e2e8f0'};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  
  ${({ $active }) => $active && css`
    animation: ${pulseGlow} 2s ease-in-out infinite;
    transform: scale(1.2);
  `}
  
  ${({ $completed }) => $completed && css`
    &:after {
      content: '✓';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-size: 8px;
      font-weight: 700;
    }
  `}
`;

const CardBody = styled.div`
  padding: 2rem 3rem;
  
  .form-group {
    margin-bottom: 2rem;
    
    label {
      display: block;
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.75rem;
      font-size: 1rem;
    }
    
    input, select {
      width: 100%;
      padding: 1rem 1.25rem;
      border: 2px solid #e5e7eb;
      border-radius: 16px;
      font-size: 1rem;
      transition: all 0.3s ease;
      background: white;
      
      &:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        transform: translateY(-2px);
      }
      
      &::placeholder {
        color: #9ca3af;
      }
    }
  }
`;

const CardFooter = styled.div`
  padding: 2rem 3rem 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`;

const Button = styled.button<{ $primary?: boolean }>`
  padding: 1rem 2rem;
  border-radius: 60px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  position: relative;
  overflow: hidden;
  min-width: 120px;
  
  ${({ $primary }) => $primary ? `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
    
    &:hover:not(:disabled) {
      transform: translateY(-3px);
      box-shadow: 0 12px 40px rgba(102, 126, 234, 0.4);
    }
    
    &:active {
      transform: translateY(-1px);
    }
  ` : `
    background: transparent;
    color: #667eea;
    border: 2px solid #667eea;
    
    &:hover:not(:disabled) {
      background: rgba(102, 126, 234, 0.1);
      transform: translateY(-2px);
    }
  `}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }
`;

const CompletionAnimation = styled.div`
  text-align: center;
  
  .celebration-icon {
    font-size: 5rem;
    margin-bottom: 2rem;
    animation: ${floatAnimation} 3s ease-in-out infinite;
  }
  
  h3 {
    font-size: 2rem;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 1rem;
  }
  
  p {
    font-size: 1.1rem;
    color: #64748b;
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }
`;

interface OnboardingSection {
  title: string;
  subtitle: string;
  component: React.ReactNode;
}

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Basic info
    name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    goal: '',
    
    // Lifestyle
    activityLevel: '',
    dietaryPreferences: [],
    allergies: [],
    
    // Health history
    medicalConditions: [],
    medications: [],
    
    // Hydration & sleep
    waterIntake: '',
    sleepHours: '',
    stressLevel: ''
  });
  
  // Define the sections for the onboarding process
  const sections: OnboardingSection[] = [
    {
      title: 'Basic Information',
      subtitle: 'Let\'s get to know you better',
      component: (
        <div>
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Age</label>
            <input 
              type="number" 
              placeholder="Enter your age"
              value={formData.age}
              onChange={(e) => setFormData({...formData, age: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Gender</label>
            <select 
              value={formData.gender}
              onChange={(e) => setFormData({...formData, gender: e.target.value})}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-binary</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>
          <div className="form-group">
            <label>Height (cm)</label>
            <input 
              type="number" 
              placeholder="Enter your height in cm"
              value={formData.height}
              onChange={(e) => setFormData({...formData, height: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Weight (kg)</label>
            <input 
              type="number" 
              placeholder="Enter your weight in kg"
              value={formData.weight}
              onChange={(e) => setFormData({...formData, weight: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Goal</label>
            <select 
              value={formData.goal}
              onChange={(e) => setFormData({...formData, goal: e.target.value})}
            >
              <option value="">Select your primary goal</option>
              <option value="weight-loss">Weight Loss</option>
              <option value="muscle-gain">Muscle Gain</option>
              <option value="maintenance">Maintenance</option>
              <option value="overall-health">Overall Health</option>
            </select>
          </div>
        </div>
      )
    },
    {
      title: 'Lifestyle & Preferences',
      subtitle: 'Tell us about your lifestyle and dietary preferences',
      component: <LifestyleSection formData={formData} setFormData={setFormData} />
    },
    {
      title: 'Health History',
      subtitle: 'Important information for personalized recommendations',
      component: <HealthHistorySection formData={formData} setFormData={setFormData} />
    },
    {
      title: 'Hydration & Sleep',
      subtitle: 'Let\'s understand your hydration and sleep patterns',
      component: <HydrationSleepSection formData={formData} setFormData={setFormData} />
    },
    {
      title: 'All Set!',
      subtitle: 'Your personalized nutrition plan is ready',
      component: (
        <CompletionAnimation>
          <div className="celebration-icon">🎉</div>
          <h3>Congratulations!</h3>
          <p>
            Your personalized nutrition profile has been created. We've tailored 
            recommendations based on your unique needs and preferences.
          </p>
          <p>
            Click "Complete" to start your nutrition journey!
          </p>
        </CompletionAnimation>
      )
    }
  ];
  
  const handleNext = () => {
    if (currentStep < sections.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding and navigate to dashboard
      localStorage.setItem('onboardingCompleted', 'true');
      // Dispatch custom event to notify App component
      window.dispatchEvent(new Event('onboardingCompleted'));
      navigate('/');
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    // Skip onboarding and go straight to the app
    localStorage.setItem('onboardingCompleted', 'true');
    // Dispatch custom event to notify App component
    window.dispatchEvent(new Event('onboardingCompleted'));
    navigate('/');
  };
  
  const progress = ((currentStep + 1) / sections.length) * 100;
  
  return (
    <OnboardingContainer>
      <FloatingElements>
        <FloatingIcon $top="10%" $left="5%" $delay="0s">🥗</FloatingIcon>
        <FloatingIcon $top="20%" $left="85%" $delay="1s">🍎</FloatingIcon>
        <FloatingIcon $top="40%" $left="10%" $delay="2s">🥑</FloatingIcon>
        <FloatingIcon $top="60%" $left="90%" $delay="0.5s">🍊</FloatingIcon>
        <FloatingIcon $top="80%" $left="15%" $delay="1.5s">🥕</FloatingIcon>
        <FloatingIcon $top="70%" $left="80%" $delay="2.5s">🥦</FloatingIcon>
        <FloatingIcon $top="30%" $left="75%" $delay="3s">🫐</FloatingIcon>
        <FloatingIcon $top="50%" $left="5%" $delay="0.8s">🍓</FloatingIcon>
      </FloatingElements>
      
      <Header>
        <SkipButton onClick={handleSkip}>Skip to App</SkipButton>
        <Logo>NutriTrack Pro</Logo>
        <Tagline>Your AI-powered nutrition companion for 2025</Tagline>
      </Header>
      
      <ContentContainer>
        <Card>
          <CardHeader>
            <CardTitle>{sections[currentStep].title}</CardTitle>
            <CardSubtitle>{sections[currentStep].subtitle}</CardSubtitle>
            
            <ProgressContainer>
              <ProgressTrack>
                <ProgressFill $progress={progress} />
              </ProgressTrack>
              
              <StepIndicator>
                {sections.map((_, index) => (
                  <StepDot 
                    key={index} 
                    $active={index === currentStep}
                    $completed={index < currentStep}
                  />
                ))}
              </StepIndicator>
            </ProgressContainer>
          </CardHeader>
          
          <CardBody>
            {sections[currentStep].component}
          </CardBody>
          
          <CardFooter>
            <Button 
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              Back
            </Button>
            
            <Button 
              $primary
              onClick={handleNext}
            >
              {currentStep === sections.length - 1 ? 'Complete' : 'Next'}
            </Button>
          </CardFooter>
        </Card>
      </ContentContainer>
    </OnboardingContainer>
  );
};

export default Onboarding;
