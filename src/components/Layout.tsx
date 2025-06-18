import React, { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ChatMobile from './ChatMobile';
import { 
  Home, 
  UtensilsCrossed, 
  BarChart3, 
  User, 
  MessageCircle,
  Sparkles,
  Mic,
  TrendingUp
} from 'lucide-react';

// Navigation items configuration
const navItems = {
  home: { path: '/', icon: Home, label: 'Home' },
  mealPlanner: { path: '/meal-planner', icon: UtensilsCrossed, label: 'Meals' },
  progress: { path: '/progress', icon: BarChart3, label: 'Progress' },
  profile: { path: '/profile', icon: User, label: 'Profile' },
  chat: { icon: MessageCircle, label: 'Chat' }
};

interface LayoutProps {
  children: ReactNode;
}

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a0b2e 25%, #16213e 50%, #0f3460 75%, #533a7b 100%);
  
  &:before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(236, 72, 153, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(59, 130, 246, 0.1) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }
`;

const Sidebar = styled.aside<{ $isOpen: boolean }>`
  width: ${({ $isOpen }) => ($isOpen ? '280px' : '80px')};
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 0;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  
  @media (max-width: 1023px) {
    display: none; /* Hide sidebar on tablet/mobile - use footer navigation instead */
  }
`;

const MainContent = styled.main<{ $sidebarOpen: boolean }>`
  flex: 1;
  margin-left: ${({ $sidebarOpen }) => ($sidebarOpen ? '280px' : '80px')};
  transition: margin-left 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 100vh;
  position: relative;
  z-index: 1;
  
  @media (max-width: 1023px) {
    margin-left: 0;
    padding-bottom: 10rem; /* Increased for better clearance above sticky footer */
  }
`;

const SidebarHeader = styled.div<{ $isOpen: boolean }>`
  padding: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  text-align: ${({ $isOpen }) => ($isOpen ? 'left' : 'center')};
  position: relative;
`;

const Logo = styled.div<{ $isOpen: boolean }>`
  font-size: ${({ $isOpen }) => ($isOpen ? '1.8rem' : '1.2rem')};
  font-weight: 900;
  background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: ${({ $isOpen }) => ($isOpen ? '0.5rem' : '0')};
  transition: all 0.3s ease;
`;

const LogoSubtext = styled.div<{ $isOpen: boolean }>`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  transition: opacity 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const NavSection = styled.div`
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
`;

const NavGroup = styled.div`
  margin-bottom: 2rem;
`;

const NavGroupTitle = styled.div<{ $isOpen: boolean }>`
  font-size: 0.7rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  padding: 0 2rem 1rem 2rem;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  transition: opacity 0.3s ease;
`;

const NavItem = styled(Link)<{ $active: boolean; $isOpen: boolean }>`
  display: flex;
  align-items: center;
  padding: 1rem 2rem;
  color: ${({ $active }) => ($active ? '#ec4899' : 'rgba(255, 255, 255, 0.7)')};
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  margin: 0.25rem 1rem;
  border-radius: 16px;
  background: ${({ $active }) => 
    $active ? 'rgba(236, 72, 153, 0.15)' : 'transparent'};
  border: 1px solid ${({ $active }) => ($active ? 'rgba(236, 72, 153, 0.3)' : 'transparent')};
  
  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: ${({ $active }) => ($active ? '60%' : '0')};
    background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
    border-radius: 0 3px 3px 0;
    transition: height 0.3s ease;
  }
  
  &:hover {
    background: rgba(236, 72, 153, 0.1);
    border-color: rgba(236, 72, 153, 0.2);
    color: white;
    transform: translateX(4px);
    
    &:before {
      height: 60%;
    }
  }
`;

const NavIcon = styled.span<{ $active: boolean }>`
  font-size: 1.4rem;
  margin-right: 1.2rem;
  width: 28px;
  text-align: center;
  transition: transform 0.3s ease;
  
  ${NavItem}:hover & {
    transform: scale(1.1);
  }
`;

const NavText = styled.span<{ $isVisible: boolean; $active: boolean }>`
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  transition: opacity 0.3s ease;
  white-space: nowrap;
  font-weight: ${({ $active }) => ($active ? '600' : '500')};
  font-size: 0.95rem;
`;

const ToggleButton = styled.button<{ $isOpen: boolean }>`
  position: absolute;
  top: 2rem;
  right: ${({ $isOpen }) => ($isOpen ? '1rem' : '50%')};
  transform: ${({ $isOpen }) => ($isOpen ? 'none' : 'translateX(50%)')};
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(236, 72, 153, 0.4);
  font-size: 0.9rem;
  
  &:hover {
    transform: ${({ $isOpen }) => ($isOpen ? 'scale(1.05)' : 'translateX(50%) scale(1.05)')};
    box-shadow: 0 6px 20px rgba(236, 72, 153, 0.6);
  }
`;

const SidebarFooter = styled.div<{ $isOpen: boolean }>`
  padding: 1.5rem 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
`;

const UpgradeCard = styled.div<{ $isOpen: boolean }>`
  background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
  border-radius: 16px;
  padding: 1.5rem;
  color: white;
  text-align: center;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  transition: opacity 0.3s ease;
  box-shadow: 0 8px 24px rgba(236, 72, 153, 0.3);
`;

const UpgradeTitle = styled.div`
  font-weight: 700;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const UpgradeText = styled.div`
  font-size: 0.8rem;
  opacity: 0.9;
  margin-bottom: 1rem;
  line-height: 1.4;
`;

const UpgradeButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
  }
`;

// Mobile Footer Navigation Component
const MobileFooter = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.875rem 1rem;
  z-index: 1000;
  
  /* Enhanced safe area insets for all mobile devices */
  padding-bottom: max(1.25rem, calc(0.875rem + env(safe-area-inset-bottom)));
  
  /* Enhanced visual separation */
  box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.6);
  border-top: 2px solid rgba(236, 72, 153, 0.2);
  
  @media (min-width: 1024px) {
    display: none;
  }
`;

const MobileNavContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 500px;
  margin: 0 auto;
  position: relative;
`;

const MobileNavSide = styled.div`
  display: flex;
  gap: 0.5rem;
  flex: 1;
  justify-content: space-around;
`;

const MobileNavItem = styled.button<{ $active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.75rem 0.5rem;
  background: ${({ $active }) => 
    $active ? 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)' : 'transparent'};
  border: none;
  border-radius: 12px;
  color: ${({ $active }) => $active ? 'white' : 'rgba(255, 255, 255, 0.7)'};
  font-size: 0.7rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 56px; /* Touch-friendly minimum */
  min-width: 60px;
  
  &:hover {
    color: white;
    background: ${({ $active }) => 
      $active ? 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)' : 'rgba(255, 255, 255, 0.1)'};
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const CentralChatButton = styled.button`
  position: relative;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
  color: white;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(236, 72, 153, 0.6);
  margin: 0 1rem;
  transform: translateY(-10px); /* Elevate it above other items */
  
  &:hover {
    transform: translateY(-12px) scale(1.05);
    box-shadow: 0 12px 40px rgba(236, 72, 153, 0.8);
  }
  
  &:active {
    transform: translateY(-8px) scale(0.95);
  }
  
  &:before {
    content: '';
    position: absolute;
    inset: -3px;
    border-radius: 50%;
    background: linear-gradient(135deg, #ec4899, #8b5cf6, #3b82f6);
    z-index: -1;
    opacity: 0.7;
    animation: pulse-glow 2s ease-in-out infinite;
  }
  
  @keyframes pulse-glow {
    0%, 100% { 
      transform: scale(1);
      opacity: 0.7;
    }
    50% { 
      transform: scale(1.1);
      opacity: 1;
    }
  }
`;

const ChatStatusIndicator = styled.div<{ $connected: boolean; $minimized: boolean }>`
  position: absolute;
  top: -2px;
  right: -2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: ${({ $connected }) => $connected ? '#22c55e' : '#6b7280'};
  border: 2px solid white;
  display: ${({ $minimized }) => $minimized ? 'block' : 'none'};
  animation: ${({ $connected }) => $connected ? 'pulse 2s ease-in-out infinite' : 'none'};
  
  @keyframes pulse {
    0%, 100% { 
      transform: scale(1);
      opacity: 1;
    }
    50% { 
      transform: scale(1.3);
      opacity: 0.8;
    }
  }
`;

const ChatIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  /* Chat bubble background */
  &:before {
    content: '';
    position: absolute;
    width: 32px;
    height: 24px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    z-index: 0;
  }
  
  /* Chat bubble tail */
  &:after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 4px solid rgba(255, 255, 255, 0.2);
    z-index: 0;
  }
`;

const MicrophoneIcon = styled.div`
  font-size: 1.2rem;
  z-index: 1;
  position: relative;
`;

const ChatLabel = styled.div`
  font-size: 0.5rem;
  font-weight: 700;
  text-align: center;
  line-height: 1;
  margin-top: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const MobileNavIcon = styled.div`
  font-size: 1.3rem;
  line-height: 1;
`;

const MobileNavLabel = styled.div`
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  line-height: 1;
`;

const FloatingChatButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
  color: white;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(236, 72, 153, 0.4);
  z-index: 999;
  
  @media (max-width: 1023px) {
    display: none; /* Hide on tablet/mobile - use footer button instead */
  }
  
  &:hover {
    transform: scale(1.05) rotate(5deg);
    box-shadow: 0 12px 40px rgba(236, 72, 153, 0.6);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  &:before {
    content: '';
    position: absolute;
    inset: -3px;
    border-radius: 50%;
    background: linear-gradient(135deg, #ec4899, #8b5cf6);
    z-index: -1;
    opacity: 0.6;
    animation: desktop-pulse 3s ease-in-out infinite;
  }
  
  @keyframes desktop-pulse {
    0%, 100% { 
      transform: scale(1);
      opacity: 0.6;
    }
    50% { 
      transform: scale(1.15);
      opacity: 0.9;
    }
  }
`;

const ChatButtonIcon = styled.div`
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
  position: relative;
  
  /* Microphone icon background circle */
  &:before {
    content: '';
    position: absolute;
    inset: -8px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    z-index: 0;
  }
`;

const ChatButtonLabel = styled.div`
  font-size: 0.6rem;
  font-weight: 600;
  text-align: center;
  line-height: 1.1;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatConnected, setChatConnected] = useState(false);
  const [chatMinimized, setChatMinimized] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const openChat = () => {
    setChatOpen(true);
  };
  
  const closeChat = () => {
    setChatOpen(false);
  };
  
  const mainNavItems = [
    { path: '/', label: 'Dashboard', icon: <Home size={20} /> },
    { path: '/meal-planner', label: 'Meal Planner', icon: <UtensilsCrossed size={20} /> },
    { path: '/daily-tracker', label: 'Daily Tracker', icon: <BarChart3 size={20} /> },
    { path: '/progress', label: 'Progress', icon: <TrendingUp size={20} /> },
  ];
  
  const secondaryNavItems = [
    { path: '/community', label: 'Community', icon: <User size={20} /> },
    { path: '/insights', label: 'Insights', icon: <Sparkles size={20} /> },
    { path: '/music-mood', label: 'Music & Mood', icon: <MessageCircle size={20} /> },
  ];
  
  const profileNavItems = [
    { path: '/profile', label: 'Profile', icon: <User size={20} /> },
  ];
  
  // Mobile navigation items (simplified for footer)
  const mobileNavItems = [
    { path: '/', label: 'Home', icon: <Home size={20} /> },
    { path: '/meal-planner', label: 'Meals', icon: <UtensilsCrossed size={20} /> },
    { path: '/daily-tracker', label: 'Track', icon: <BarChart3 size={20} /> },
    { path: '/progress', label: 'Progress', icon: <TrendingUp size={20} /> },
  ];
  
  return (
    <LayoutContainer>
      <Sidebar $isOpen={sidebarOpen}>
        <SidebarHeader $isOpen={sidebarOpen}>
          <Logo $isOpen={sidebarOpen}>
            {sidebarOpen ? 'JMEFIT' : 'JME'}
          </Logo>
          <LogoSubtext $isOpen={sidebarOpen}>
            Premium Nutrition
          </LogoSubtext>
          <ToggleButton $isOpen={sidebarOpen} onClick={toggleSidebar}>
            {sidebarOpen ? '←' : '→'}
          </ToggleButton>
        </SidebarHeader>
        
        <NavSection>
          <NavGroup>
            <NavGroupTitle $isOpen={sidebarOpen}>Main</NavGroupTitle>
            {mainNavItems.map((item) => (
              <NavItem 
                key={item.path} 
                to={item.path} 
                $active={location.pathname === item.path}
                $isOpen={sidebarOpen}
              >
                <NavIcon $active={location.pathname === item.path}>
                  {item.icon}
                </NavIcon>
                <NavText 
                  $isVisible={sidebarOpen} 
                  $active={location.pathname === item.path}
                >
                  {item.label}
                </NavText>
              </NavItem>
            ))}
          </NavGroup>
          
          <NavGroup>
            <NavGroupTitle $isOpen={sidebarOpen}>Explore</NavGroupTitle>
            {secondaryNavItems.map((item) => (
              <NavItem 
                key={item.path} 
                to={item.path} 
                $active={location.pathname === item.path}
                $isOpen={sidebarOpen}
              >
                <NavIcon $active={location.pathname === item.path}>
                  {item.icon}
                </NavIcon>
                <NavText 
                  $isVisible={sidebarOpen} 
                  $active={location.pathname === item.path}
                >
                  {item.label}
                </NavText>
              </NavItem>
            ))}
          </NavGroup>
          
          <NavGroup>
            <NavGroupTitle $isOpen={sidebarOpen}>Account</NavGroupTitle>
            {profileNavItems.map((item) => (
              <NavItem 
                key={item.path} 
                to={item.path} 
                $active={location.pathname === item.path}
                $isOpen={sidebarOpen}
              >
                <NavIcon $active={location.pathname === item.path}>
                  {item.icon}
                </NavIcon>
                <NavText 
                  $isVisible={sidebarOpen} 
                  $active={location.pathname === item.path}
                >
                  {item.label}
                </NavText>
              </NavItem>
            ))}
          </NavGroup>
        </NavSection>
        
        <SidebarFooter $isOpen={sidebarOpen}>
          <UpgradeCard $isOpen={sidebarOpen}>
            <UpgradeTitle>
              <Sparkles size={16} style={{ marginRight: '0.5rem', display: 'inline' }} />
              Upgrade to Pro
            </UpgradeTitle>
            <UpgradeText>
              Unlock unlimited meal plans, custom recipes, and advanced nutrition insights.
            </UpgradeText>
            <UpgradeButton>
              Get Pro Access
            </UpgradeButton>
          </UpgradeCard>
        </SidebarFooter>
      </Sidebar>
      
      <MainContent $sidebarOpen={sidebarOpen}>
        {children}
      </MainContent>
      
      {/* Floating Chat Button for Desktop */}
      <FloatingChatButton onClick={openChat}>
        <ChatButtonIcon>
          <Mic size={24} />
        </ChatButtonIcon>
        <ChatButtonLabel>Voice AI</ChatButtonLabel>
      </FloatingChatButton>
      
      {/* Mobile Sticky Footer Navigation */}
      <MobileFooter>
        <MobileNavContainer>
          <MobileNavSide>
            {mobileNavItems.slice(0, 2).map((item) => (
              <MobileNavItem
                key={item.path}
                $active={location.pathname === item.path}
                onClick={() => navigate(item.path)}
              >
                <MobileNavIcon>{item.icon}</MobileNavIcon>
                <MobileNavLabel>{item.label}</MobileNavLabel>
              </MobileNavItem>
            ))}
          </MobileNavSide>
          
          {/* Central Chat Button */}
          <CentralChatButton onClick={openChat}>
            <ChatIcon>
              <MicrophoneIcon>
                <Mic size={18} />
              </MicrophoneIcon>
            </ChatIcon>
            <ChatLabel>Voice AI</ChatLabel>
            <ChatStatusIndicator $connected={chatConnected} $minimized={chatMinimized} />
          </CentralChatButton>
          
          <MobileNavSide>
            {mobileNavItems.slice(2, 4).map((item) => (
              <MobileNavItem
                key={item.path}
                $active={location.pathname === item.path}
                onClick={() => navigate(item.path)}
              >
                <MobileNavIcon>{item.icon}</MobileNavIcon>
                <MobileNavLabel>{item.label}</MobileNavLabel>
              </MobileNavItem>
            ))}
          </MobileNavSide>
        </MobileNavContainer>
      </MobileFooter>
      
      {/* Chat Component */}
      <ChatMobile 
        isOpen={chatOpen} 
        onClose={closeChat}
      />
    </LayoutContainer>
  );
};

export default Layout;
