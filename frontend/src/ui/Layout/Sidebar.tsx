import React from "react";
import styled from "@emotion/styled";
import { NavLink, useLocation } from "react-router-dom";

// Icon Imports
import {
  BiMusic,
  BiHeart,
  BiLogOut,
  BiChevronLeft,
  BiMenu,
  BiBarChart,
} from "react-icons/bi";
import { BsCollectionPlay } from "react-icons/bs";

// Redux & Other Components
import { useSelector } from "react-redux";
import RootState from "../../redux/RootState"; // Ensure this path is correct
import LogoutModal from "../../features/Auth/LogoutModal/LogoutModal"; // Ensure this path is correct

// --- 1. Prop Interfaces for Styled Components ---
interface CollapsibleProps {
  isCollapsed: boolean;
}

// --- 2. Styled Components Definitions ---

const Container = styled.aside<CollapsibleProps>`
  background-color: var(--background-color);
  display: flex;
  flex-direction: column;
  padding: 1.5rem 0;
  border-right: 1px solid #282828;
  transition: width 0.3s ease-in-out;
  width: ${(props) => (props.isCollapsed ? "80px" : "280px")};
`;

const ToggleButton = styled.button<CollapsibleProps>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  outline: none;
  background-color: transparent;
  color: var(--text-color);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  margin-bottom: 1rem;
  align-self: ${(props) => (props.isCollapsed ? "center" : "flex-end")};
  margin-right: ${(props) => (props.isCollapsed ? "0" : "1rem")};

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const LogoSection = styled.div<CollapsibleProps>`
  padding: 0 1.5rem 1.5rem;
  margin-bottom: 1rem;
  opacity: ${(props) => (props.isCollapsed ? 0 : 1)};
  /* Added for better visual stability when collapsing */
  height: 2.5rem; /* Matches font-size of LogoText for consistent height */
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.isCollapsed ? "center" : "flex-start")};
  overflow: hidden; /* Hide content when collapsed */
`;

const LogoText = styled.h1<CollapsibleProps>`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0;
  white-space: nowrap;
  /* Opacity is controlled by LogoSection's opacity, not here directly */
  transition: opacity 0.2s ease-in-out;
`;

const Navigation = styled.nav`
  flex: 1;
  padding: 0 1rem;
`;

const NavItem = styled(NavLink, {
  shouldForwardProp: (prop) => prop !== "isCollapsed",
})<CollapsibleProps>`
  display: flex;
  align-items: center;
  gap: ${(props) => (props.isCollapsed ? "0" : "1rem")};
  padding: ${(props) => (props.isCollapsed ? "1rem 0" : "1rem")};
  margin-bottom: 0.5rem;
  border-radius: 8px;
  color: var(--text-color-secondary);
  text-decoration: none;
  border: none;
  outline: none;
  transition: all 0.3s ease;
  font-weight: 500;
  justify-content: ${(props) => (props.isCollapsed ? "center" : "flex-start")};

  span {
    display: ${(props) => (props.isCollapsed ? "none" : "inline")};
    transition: opacity 0.2s ease-in-out;
    white-space: nowrap;
    overflow: hidden;
  }

  svg {
    font-size: 1.5rem;
    min-width: 24px;
  }

  &:hover {
    background-color: var(--second-background-color);
    color: var(--text-color);
  }

  &.active {
    background-color: var(--primary-color);
    color: #000000;
    font-weight: 700;
  }
`;

const UserSection = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid #282828;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const UserEmail = styled.span<CollapsibleProps>`
  color: var(--text-color-secondary);
  font-size: 0.875rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: ${(props) => (props.isCollapsed ? 0 : 1)};
  transition: opacity 0.2s ease-in-out;
  flex-grow: 1; /* Allows it to take available space */
  margin-right: ${(props) => (props.isCollapsed ? "0" : "0.5rem")};
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  outline: none;
  color: var(--text-color-secondary);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: var(--red-primary);
  }
`;

// --- 3. Data & Configuration ---

// Sidebar component props interface
interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
}

// Data for navigation items
const navigationItems: { to: string; icon: React.ReactNode; label: string }[] =
  [
    { to: "/", icon: <BiBarChart />, label: "Dashboard" },
    { to: "/songs", icon: <BiMusic />, label: "Songs" },
    { to: "/favorites", icon: <BiHeart />, label: "Favorites" },
    { to: "/playlists", icon: <BsCollectionPlay />, label: "Playlists" },
  ];

// --- 4. Sidebar Functional Component ---

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  // --- Hooks and State ---
  const location = useLocation();
  const user = useSelector((state: RootState) => state.auth.user);
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  // --- Render Logic ---
  return (
    <>
      <Container isCollapsed={isCollapsed}>
        {/* Sidebar Toggle Button */}
        <ToggleButton
          isCollapsed={isCollapsed}
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <BiMenu size={20} /> : <BiChevronLeft size={20} />}
        </ToggleButton>

        {/* Application Logo/Title */}
        <LogoSection isCollapsed={isCollapsed}>
          <LogoText isCollapsed={isCollapsed}>Musica</LogoText>
        </LogoSection>

        {/* Primary Navigation Links */}
        <Navigation>
          {navigationItems.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              className={location.pathname === item.to ? "active" : ""}
              isCollapsed={isCollapsed}
              title={item.label} // Tooltip on hover for better UX
            >
              {item.icon}
              <span>{item.label}</span>
            </NavItem>
          ))}
        </Navigation>

        {/* User Information and Logout */}
        <UserSection>
          <UserInfo>
            <UserEmail isCollapsed={isCollapsed}>{user?.email}</UserEmail>
            <LogoutButton
              onClick={() => setShowLogoutModal(true)}
              title="Sign Out"
              aria-label="Sign Out"
            >
              <BiLogOut size={20} />
            </LogoutButton>
          </UserInfo>
        </UserSection>
      </Container>

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
      />
    </>
  );
};

export default Sidebar;
