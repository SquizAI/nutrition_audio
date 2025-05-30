import React, { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

// Premium icons with better visuals
const icons = {
  dashboard: '🏠',
  mealPlanner: '🍽️',
  progress: '📊',
  community: '👥',
  insights: '💡',
  music: '🎵',
  profile: '👤',
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
  
  @media (max-width: 768px) {
    display: none; /* Hide sidebar on mobile - use footer navigation instead */
  }
`;

const MainContent = styled.main<{ $sidebarOpen: boolean }>`
  flex: 1;
  margin-left: ${({ $sidebarOpen }) => ($sidebarOpen ? '280px' : '80px')};
  transition: margin-left 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 100vh;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    margin-left: 0;
    padding-bottom: 6rem; /* Space for mobile footer */
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

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const mainNavItems = [
    { path: '/', label: 'Dashboard', icon: icons.dashboard },
    { path: '/meal-planner', label: 'Meal Planner', icon: icons.mealPlanner },
    { path: '/progress', label: 'Progress', icon: icons.progress },
  ];
  
  const secondaryNavItems = [
    { path: '/community', label: 'Community', icon: icons.community },
    { path: '/insights', label: 'Insights', icon: icons.insights },
    { path: '/music-mood', label: 'Music & Mood', icon: icons.music },
  ];
  
  const profileNavItems = [
    { path: '/profile', label: 'Profile', icon: icons.profile },
  ];
  
  return (
    <LayoutContainer>
      <Sidebar $isOpen={sidebarOpen}>
        <SidebarHeader $isOpen={sidebarOpen}>
          <Logo $isOpen={sidebarOpen}>
            {sidebarOpen ? 'NutriTrack' : 'NT'}
          </Logo>
          <LogoSubtext $isOpen={sidebarOpen}>
            Professional Nutrition
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
            <UpgradeTitle>🚀 Upgrade to Pro</UpgradeTitle>
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
    </LayoutContainer>
  );
};

export default Layout;
