import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiActivity, FiClock, FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <NavbarContainer scrolled={scrolled}>
      <NavbarContent>
        <LogoContainer to="/">
          <LogoIcon>
            <FiActivity />
          </LogoIcon>
          <LogoText>SpeedWave</LogoText>
        </LogoContainer>

        <NavLinks>
          <NavLink 
            to="/" 
            $isActive={location.pathname === '/'}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiActivity />
            <span>Speed Test</span>
          </NavLink>
          <NavLink 
            to="/calculator" 
            $isActive={location.pathname === '/calculator'}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiClock />
            <span>Time Calculator</span>
          </NavLink>
        </NavLinks>

        <MobileMenuButton 
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </MobileMenuButton>

        <MobileMenu 
          initial={{ x: '100%' }}
          animate={{ x: isOpen ? 0 : '100%' }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <MobileNavLink 
            to="/" 
            $isActive={location.pathname === '/'}
            whileTap={{ scale: 0.95 }}
          >
            <FiActivity />
            <span>Speed Test</span>
          </MobileNavLink>
          <MobileNavLink 
            to="/calculator" 
            $isActive={location.pathname === '/calculator'}
            whileTap={{ scale: 0.95 }}
          >
            <FiClock />
            <span>Time Calculator</span>
          </MobileNavLink>
        </MobileMenu>
      </NavbarContent>
    </NavbarContainer>
  );
};

const NavbarContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background: ${({ scrolled, theme }) => 
    scrolled 
      ? `rgba(15, 23, 42, 0.9)`
      : 'transparent'
  };
  backdrop-filter: ${({ scrolled }) => 
    scrolled ? 'blur(10px)' : 'none'
  };
  border-bottom: ${({ scrolled, theme }) => 
    scrolled 
      ? `1px solid ${theme.cardBorder}`
      : 'none'
  };
  transition: all 0.3s ease;
`;

const NavbarContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 1rem;
  }
`;

const LogoContainer = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LogoIcon = styled.div`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.primaryLight};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LogoText = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(90deg, ${({ theme }) => theme.primaryLight}, ${({ theme }) => theme.primary});
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const NavLink = styled(motion(Link))`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ $isActive, theme }) => 
    $isActive ? theme.textLight : theme.textMuted
  };
  font-weight: ${({ $isActive }) => ($isActive ? '600' : '500')};
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  background: ${({ $isActive, theme }) => 
    $isActive ? `rgba(79, 172, 254, 0.15)` : 'transparent'
  };
  transition: all 0.3s ease;
  
  &:hover {
    color: ${({ theme }) => theme.textLight};
    background: rgba(79, 172, 254, 0.1);
  }
  
  svg {
    font-size: 1.2rem;
  }
`;

const MobileMenuButton = styled(motion.button)`
  display: none;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.textLight};
  font-size: 1.5rem;
  cursor: pointer;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  width: 70%;
  max-width: 300px;
  height: 100vh;
  background: ${({ theme }) => theme.backgroundLight};
  display: flex;
  flex-direction: column;
  padding: 5rem 1.5rem 2rem;
  z-index: 999;
  box-shadow: -5px 0 30px rgba(0, 0, 0, 0.3);
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const MobileNavLink = styled(motion(Link))`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: ${({ $isActive, theme }) => 
    $isActive ? theme.textLight : theme.textMuted
  };
  font-weight: ${({ $isActive }) => ($isActive ? '600' : '500')};
  padding: 1rem;
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  background: ${({ $isActive, theme }) => 
    $isActive ? `rgba(79, 172, 254, 0.15)` : 'transparent'
  };
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    color: ${({ theme }) => theme.textLight};
    background: rgba(79, 172, 254, 0.1);
  }
  
  svg {
    font-size: 1.2rem;
  }
`;

export default Navbar;